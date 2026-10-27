import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { SecurityAlert, FirewallSettings, ThreatCategory, ThreatSeverity } from '../types';

export const DEFAULT_FIREWALL_SETTINGS: FirewallSettings = {
  enabled: true,
  strictXssFilter: true,
  botTrapEnabled: true,
  rateLimiterEnabled: true,
  emergencyLockdown: false,
  lockdownMessage: 'Routine security maintenance in progress. New submissions are temporarily paused. Please contact our WhatsApp desk for urgent needs.',
  maxOrdersPerWindow: 4,
  maxAppointmentsPerWindow: 4,
};

// Known exploit signatures for XSS, script execution, and injection
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /vbscript\s*:/gi,
  /on(?:error|load|click|mouseover|focus|blur|change|submit|keydown|keyup)\s*=/gi,
  /<iframe\b[^>]*>/gi,
  /<embed\b[^>]*>/gi,
  /<object\b[^>]*>/gi,
  /<link\b[^>]*rel=["']?stylesheet["']?/gi,
  /<style\b[^>]*>.*?<\/style>/gi,
  /expression\s*\(/gi,
  /eval\s*\(/gi,
  /document\s*\.\s*(?:cookie|location|write)/gi,
  /window\s*\.\s*location/gi,
];

const SQLI_PATTERNS = [
  /(\b(?:UNION(?:\s+ALL)?|SELECT|INSERT\s+INTO|DELETE\s+FROM|DROP\s+(?:TABLE|DATABASE)|ALTER\s+TABLE)\b)/gi,
  /(\b(?:OR|AND)\s+['"]?[0-9a-z]+['"]?\s*=\s*['"]?[0-9a-z]+['"]?)/gi,
  /(--|\#|\/\*).*?$/gm,
  /;\s*(?:DROP|DELETE|UPDATE|INSERT)/gi,
];

const PROTOTYPE_PATTERNS = [
  /__proto__/gi,
  /constructor\s*\.\s*prototype/gi,
];

// In-memory sliding window for client-side rate-limiting
const rateLimitMemory: Record<string, number[]> = {};

const getClientDiagnostics = () => {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Agent';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const platform = (navigator as any)?.userAgentData?.platform || (navigator ? navigator.platform : 'Device');
  const screenRes = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'Standard';
  return {
    summary: `${platform} • ${isMobile ? 'Mobile' : 'Desktop'} (${screenRes})`,
    platform,
    isMobile,
    screenRes,
    userAgent: ua,
    localTime: new Date().toLocaleString(),
  };
};

export class FirewallEngine {
  private static cachedConfig: FirewallSettings = { ...DEFAULT_FIREWALL_SETTINGS };
  private static configLoaded = false;

  /**
   * Fetch current firewall configuration from Firestore or use defaults
   */
  public static async getFirewallConfig(): Promise<FirewallSettings> {
    if (this.configLoaded) {
      return this.cachedConfig;
    }

    try {
      const docSnap = await getDoc(doc(db, 'settings', 'firewallConfig'));
      if (docSnap.exists()) {
        this.cachedConfig = { ...DEFAULT_FIREWALL_SETTINGS, ...docSnap.data() } as FirewallSettings;
      }
      this.configLoaded = true;
    } catch {
      // Offline or initial boot fallback
      this.cachedConfig = { ...DEFAULT_FIREWALL_SETTINGS };
    }
    return this.cachedConfig;
  }

  /**
   * Save updated firewall configuration to Firestore
   */
  public static async saveFirewallConfig(config: FirewallSettings): Promise<void> {
    const updated = {
      ...config,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'settings', 'firewallConfig'), updated);
    this.cachedConfig = updated;
  }

  /**
   * Inspect any string for malicious payloads (XSS, SQLi, Prototype Pollution)
   */
  public static inspectString(input: string): {
    isMalicious: boolean;
    category?: ThreatCategory;
    reason?: string;
    snippet?: string;
  } {
    if (!input || typeof input !== 'string') {
      return { isMalicious: false };
    }

    // Check Prototype Pollution
    for (const pat of PROTOTYPE_PATTERNS) {
      if (pat.test(input)) {
        return {
          isMalicious: true,
          category: 'tamper_attempt',
          reason: 'Prototype pollution vector detected',
          snippet: input.slice(0, 100),
        };
      }
    }

    // Check XSS
    for (const pat of XSS_PATTERNS) {
      pat.lastIndex = 0;
      if (pat.test(input)) {
        return {
          isMalicious: true,
          category: 'xss_injection',
          reason: 'Dangerous HTML / JavaScript execution pattern detected',
          snippet: input.slice(0, 100),
        };
      }
    }

    // Check SQLi / Query injection
    for (const pat of SQLI_PATTERNS) {
      pat.lastIndex = 0;
      if (pat.test(input)) {
        return {
          isMalicious: true,
          category: 'sql_injection',
          reason: 'SQL query manipulation pattern detected',
          snippet: input.slice(0, 100),
        };
      }
    }

    return { isMalicious: false };
  }

  /**
   * Deep sanitize a string: removes script tags, event handlers, and replaces unsafe brackets
   * while preserving clean multi-lingual text (Urdu, Arabic, English, punctuation).
   */
  public static sanitizeString(input: string): string {
    if (!input || typeof input !== 'string') return '';

    let clean = input;

    // Neutralize script tags
    clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    clean = clean.replace(/javascript\s*:/gi, 'blocked-proto:');
    clean = clean.replace(/data\s*:\s*text\/html/gi, 'blocked-data:');
    clean = clean.replace(/on\w+\s*=/gi, 'blocked-attr=');

    // Replace raw angle brackets that could form HTML tags
    clean = clean.replace(/</g, '‹').replace(/>/g, '›');

    return clean.trim();
  }

  /**
   * Recursively sanitize any object payload before saving to database
   */
  public static sanitizePayload<T>(payload: T): T {
    if (payload === null || payload === undefined) {
      return payload;
    }

    if (typeof payload === 'string') {
      return this.sanitizeString(payload) as unknown as T;
    }

    if (Array.isArray(payload)) {
      return payload.map((item) => this.sanitizePayload(item)) as unknown as T;
    }

    if (typeof payload === 'object') {
      const sanitizedObj: any = {};
      for (const [key, value] of Object.entries(payload)) {
        // Prevent prototype keys
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          continue;
        }
        sanitizedObj[key] = this.sanitizePayload(value);
      }
      return sanitizedObj as T;
    }

    return payload;
  }

  /**
   * Anti-Bot Honeypot verification.
   * If a bot auto-fills a hidden field that human users cannot see, block the submission.
   */
  public static async verifyHoneypot(
    honeypotValue: string | undefined,
    sourceEndpoint: string
  ): Promise<{ passed: boolean; error?: string }> {
    if (honeypotValue && honeypotValue.trim().length > 0) {
      await this.recordThreatIncident({
        category: 'bot_honeypot',
        severity: 'high',
        description: `Automated spam bot trapped on endpoint: ${sourceEndpoint}`,
        sourceEndpoint,
        payloadSnippet: `Honeypot value: "${honeypotValue.slice(0, 50)}"`,
        actionTaken: 'blocked_and_quarantined',
      });
      return {
        passed: false,
        error: 'Security verification failed. Automated bots are not allowed.',
      };
    }
    return { passed: true };
  }

  /**
   * Sliding-window rate limiter to prevent DDoS / spam flooding
   */
  public static async checkRateLimit(
    actionKey: 'order' | 'appointment' | 'contact' | 'review',
    sourceEndpoint: string
  ): Promise<{ passed: boolean; error?: string }> {
    const config = await this.getFirewallConfig();
    if (!config.rateLimiterEnabled) return { passed: true };

    const now = Date.now();
    const windowMs = 3 * 60 * 1000; // 3 minutes window
    const maxAllowed = actionKey === 'order' ? config.maxOrdersPerWindow : config.maxAppointmentsPerWindow;

    const timestamps = (rateLimitMemory[actionKey] || []).filter((ts) => now - ts < windowMs);

    if (timestamps.length >= maxAllowed) {
      const cooldownSecs = Math.ceil((windowMs - (now - timestamps[0])) / 1000);

      await this.recordThreatIncident({
        category: 'rate_limit_flood',
        severity: 'medium',
        description: `Rate limit exceeded on endpoint: ${sourceEndpoint} (${timestamps.length} submissions in window)`,
        sourceEndpoint,
        payloadSnippet: `Action: ${actionKey}, Attempts: ${timestamps.length + 1}`,
        actionTaken: 'rate_limited',
      });

      return {
        passed: false,
        error: `Submission rate limit exceeded. Please wait ${cooldownSecs} seconds before trying again to protect store availability.`,
      };
    }

    timestamps.push(now);
    rateLimitMemory[actionKey] = timestamps;
    return { passed: true };
  }

  /**
   * Checks if emergency lockdown is active
   */
  public static async checkLockdown(): Promise<{ isLocked: boolean; message?: string }> {
    const config = await this.getFirewallConfig();
    if (config.emergencyLockdown) {
      return {
        isLocked: true,
        message: config.lockdownMessage || DEFAULT_FIREWALL_SETTINGS.lockdownMessage,
      };
    }
    return { isLocked: false };
  }

  /**
   * Record a security incident to Firestore `security_alerts`
   */
  public static async recordThreatIncident(
    incident: Omit<SecurityAlert, 'id' | 'timestamp'>
  ): Promise<string> {
    const diag = getClientDiagnostics();
    const alertId = `threat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const fullAlert: SecurityAlert = {
      id: alertId,
      timestamp: new Date().toISOString(),
      localTime: diag.localTime,
      category: incident.category || 'tamper_attempt',
      severity: incident.severity || 'medium',
      description: incident.description || 'Firewall defense triggered',
      sourceEndpoint: incident.sourceEndpoint || window.location.pathname,
      payloadSnippet: incident.payloadSnippet ? incident.payloadSnippet.slice(0, 300) : undefined,
      deviceSummary: diag.summary,
      device: diag.summary,
      userAgent: diag.userAgent,
      platform: diag.platform,
      screen: diag.screenRes,
      actionTaken: incident.actionTaken || 'blocked_and_quarantined',
      status: 'blocked',
      sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
      targetEmail: incident.targetEmail || 'faraabee1@gmail.com',
    };

    try {
      await setDoc(doc(db, 'security_alerts', alertId), fullAlert);
    } catch (err) {
      console.warn('Could not persist security alert to database:', err);
    }

    return alertId;
  }
}
