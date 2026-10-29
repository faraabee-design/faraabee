export interface Product {
  id: string;
  slug: string;
  name: string;
  urduName?: string;
  category: string;
  price: number;
  salePrice?: number;
  currency: string;
  priceUSD?: number;
  salePriceUSD?: number;
  volume?: string;
  shortDescription: string;
  description: string;
  image: string;
  secondaryImage?: string;
  additionalImages?: string[];
  featured: boolean;
  inStock: boolean;
  stockQuantity?: number;
  sku?: string;
  status?: 'active' | 'draft' | 'archived';
  displayOrder?: number;
  rating?: number;
  reviewsCount?: number;
  ingredients?: string[];
  keyBotanicals?: { name: string; benefit: string }[];
  traditionalUse?: string;
  directions?: string;
  precautions?: string;
  packagingInfo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  active: boolean;
}

export interface Promotion {
  id: string;
  productId?: string;
  title: string;
  subtitle?: string;
  description: string;
  discountPrice?: number;
  badge?: string;
  image?: string;
  active: boolean;
  linkText?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  notes?: string;
  items: OrderItem[];
  total: number;
  paymentMethod?: 'cod' | 'bank' | 'jazzcash' | 'easypaisa' | 'whatsapp';
  transactionId?: string;
  paymentSenderTitle?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface BankAccountDetails {
  enabled: boolean;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  branchName?: string;
  instructions?: string;
}

export interface MobileWalletDetails {
  enabled: boolean;
  accountTitle: string;
  mobileNumber: string;
  instructions?: string;
}

export interface PaymentSettings {
  codEnabled: boolean;
  bankTransfer: BankAccountDetails;
  jazzCash: MobileWalletDetails;
  easyPaisa: MobileWalletDetails;
  generalInstructions?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  publishedDate: string;
  image: string;
  author: string;
  content: string[];
  keyTakeaways: string[];
}

export interface SocialLinks {
  x?: string;
  youtube?: string;
  tiktok?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  linkedin?: string;
  pinterest?: string;
  customPlatform?: string;
  customUrl?: string;
}

export interface DeliverySettings {
  standardShippingFee: number;
  standardShippingFeeUSD?: number;
  freeShippingThreshold: number;
  freeShippingThresholdUSD?: number;
  freeShippingEnabled: boolean;
  deliveryNote?: string;
  estimatedDays?: string;
}

export interface AnnouncementSettings {
  enabled: boolean;
  text: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface StoreSettings {
  socials: SocialLinks;
  contact: {
    email: string;
    phone: string;
    whatsappNumber: string;
    whatsappDisplay: string;
    address: string;
    city: string;
    country: string;
    businessHours: string;
  };
  currency?: string;
  delivery?: DeliverySettings;
  announcement?: AnnouncementSettings;
  deliveryNote?: string;
  updatedAt?: string;
}

export interface SpiritualPost {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  image: string;
  arabicQuote?: string;
  quoteTranslation?: string;
  description: string;
  contactPrompt?: string;
  relatedProductSlug?: string;
  featured?: boolean;
  active: boolean;
  displayOrder?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface SpiritualSettings {
  badge: string;
  title: string;
  subtitle: string;
  headerQuote: string;
  headerQuoteTranslation: string;
  contactButtonText: string;
  consultationText: string;
  updatedAt?: string;
}

export type PageId =
  | 'home'
  | 'about'
  | 'products'
  | 'product-detail'
  | 'journal'
  | 'about-herbal'
  | 'spiritual'
  | 'contact'
  | 'track-order'
  | 'privacy'
  | 'terms'
  | 'admin';

export type ThreatCategory =
  | 'xss_injection'
  | 'sql_injection'
  | 'bot_honeypot'
  | 'rate_limit_flood'
  | 'oversized_payload'
  | 'tamper_attempt'
  | 'brute_force_login'
  | 'unauthorized_access';

export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface SecurityAlert {
  id: string;
  category?: ThreatCategory;
  severity?: ThreatSeverity;
  description?: string;
  sourceEndpoint?: string;
  payloadSnippet?: string;
  clientFingerprint?: string;
  deviceSummary?: string;
  actionTaken?: 'blocked_and_quarantined' | 'locked_out' | 'rate_limited' | 'sanitized';
  targetEmail?: string;
  failedAttempts?: number;
  timestamp: string;
  localTime?: string;
  device?: string;
  userAgent?: string;
  platform?: string;
  screen?: string;
  status?: 'dispatched' | 'pending' | 'blocked';
  sourceUrl?: string;
  read?: boolean;
}

export interface FirewallSettings {
  enabled: boolean;
  strictXssFilter: boolean;
  botTrapEnabled: boolean;
  rateLimiterEnabled: boolean;
  emergencyLockdown: boolean;
  lockdownMessage?: string;
  maxOrdersPerWindow: number;
  maxAppointmentsPerWindow: number;
  updatedAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  author: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  usageDuration?: string; // e.g. "Used for 3 weeks"
  verifiedBuyer: boolean;
  city?: string;
  createdAt: string;
  approved: boolean;
}

export interface CareBundle {
  id: string;
  slug: string;
  name: string;
  urduName?: string;
  subtitle: string;
  description: string;
  image: string;
  productIds: string[];
  originalPrice: number;
  bundlePrice: number;
  originalPriceUSD?: number;
  bundlePriceUSD?: number;
  savingsPercentage: number;
  badge?: string;
  active: boolean;
  featured?: boolean;
}

export interface BotanicalIngredient {
  id: string;
  name: string;
  botanicalName: string;
  urduName?: string;
  origin: string;
  image: string;
  temperament: string; // e.g. "Warm & Moist (گرم و تر)"
  keyBenefits: string[];
  traditionalUsage: string;
  featuredInProducts: string[]; // product slugs
  active: boolean;
}

export interface HikmatCard {
  id: string;
  title: string;
  urduTitle?: string;
  propheticReference: string; // e.g. "Sahih Bukhari #5688"
  hadithText: string;
  urduHadithText?: string;
  botanicalHerb: string;
  modernSignificance: string;
  image: string;
  relatedProductSlug?: string;
  active: boolean;
}

export interface QuizConcern {
  id: string;
  label: string;
  urduLabel: string;
  icon: string;
  description: string;
  subOptions: {
    id: string;
    label: string;
    urduLabel: string;
    productSlug: string;
    wazifaTitle: string;
    wazifaArabic: string;
    wazifaTranslation: string;
    usageGuidance: string;
  }[];
}

export interface AudioTrack {
  id: string;
  title: string;
  urduTitle?: string;
  reciter?: string;
  duration: string;
  url: string;
  category: 'ruqyah' | 'adhkar' | 'quran' | 'ambience';
  active: boolean;
}

export type Language = 'en' | 'ur';

export interface WheelSlice {
  id: string;
  label: string;
  labelUrdu: string;
  couponCode: string;
  type: 'discount_percent' | 'discount_fixed' | 'free_shipping' | 'free_gift' | 'blessing';
  value: number;
  color: string;
  textColor: string;
  probability: number;
}

export interface SpinWheelSettings {
  enabled: boolean;
  title: string;
  titleUrdu: string;
  subtitle: string;
  subtitleUrdu: string;
  triggerButtonText: string;
  triggerButtonTextUrdu: string;
  slices: WheelSlice[];
  cooldownHours: number;
  disclaimer: string;
  disclaimerUrdu: string;
  updatedAt?: string;
}

export interface HakeemBargainSettings {
  enabled: boolean;
  hakeemName: string;
  hakeemNameUrdu: string;
  hakeemTitle: string;
  hakeemTitleUrdu: string;
  buttonText: string;
  buttonTextUrdu: string;
  maxDiscountPercent: number;
  counterOfferDiscountPercent: number;
  tooLowThresholdPercent: number;
  couponPrefix: string;
  dialogues: {
    tooLowUrdu: string[];
    tooLowEnglish: string[];
    counterOfferUrdu: string[];
    counterOfferEnglish: string[];
    acceptedUrdu: string[];
    acceptedEnglish: string[];
  };
  updatedAt?: string;
}

export interface DeveloperSignatureSettings {
  enabled: boolean;
  signatureImage: string; // Base64 PNG data URL of drawn signature
  customText: string;     // e.g. "This website was created by me. If you want your own custom website, contact:"
  customTextUrdu?: string;// Urdu version
  email: string;          // Creator contact email
  creatorName?: string;   // Optional Creator name / signature title
  badgeTitle?: string;    // Optional badge label
  penColor?: string;      // Ink color on signature pad
  updatedAt?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type ConsultationType = 'voice_recording' | 'written_text' | 'whatsapp_call' | 'phone_call';

export interface SpiritualAppointment {
  id: string;
  referenceId: string; // e.g. "APT-84291"
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  city?: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  consultationType: ConsultationType;
  category: string;
  problemDescription?: string;
  audioRecordingUrl?: string; // Base64 audio/webm or audio/wav
  audioDurationSeconds?: number;
  status: AppointmentStatus;
  adminNotes?: string;
  scheduledTime?: string; // Confirmed appointment timeline e.g. "2026-10-26T15:30"
  confirmedSlotLabel?: string; // e.g. "Monday, 27 Oct • 3:30 PM PKT"
  confirmationNotificationSent?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AppointmentSlotConfig {
  acceptingAppointments: boolean; // Master Open / Closed toggle
  closedNoticeMessage: string;
  closedNoticeMessageUrdu: string;
  consultationWindowStart: string; // e.g. "10:00 AM"
  consultationWindowEnd: string;   // e.g. "08:00 PM"
  slotDurationMinutes: number;     // e.g. 30
  availableDays: string[];         // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  dailySlotsLimit: number;
  whatsappDeskNumber: string;
  consultationFeeNotice: string;
  consultationFeeNoticeUrdu: string;
  updatedAt?: string;
}

export interface PolicySection {
  id: string;
  title: string;
  titleUrdu?: string;
  content: string;
  contentUrdu?: string;
  icon?: string;
}

export interface LegalPoliciesConfig {
  // Privacy Policy
  privacyTitle: string;
  privacyTitleUrdu?: string;
  privacySubtitle: string;
  privacySubtitleUrdu?: string;
  privacyEffectiveDate: string;
  privacyIntro: string;
  privacyIntroUrdu?: string;
  privacySections: PolicySection[];
  privacyContactNotice: string;
  privacyContactNoticeUrdu?: string;

  // Terms of Use
  termsTitle: string;
  termsTitleUrdu?: string;
  termsSubtitle: string;
  termsSubtitleUrdu?: string;
  termsEffectiveDate: string;
  termsIntro: string;
  termsIntroUrdu?: string;
  termsDisclaimerBox: string;
  termsDisclaimerBoxUrdu?: string;
  termsSections: PolicySection[];
  termsContactNotice: string;
  termsContactNoticeUrdu?: string;

  // Consent Popup Banner (Every device pop-up to accept terms & privacy)
  consentBannerEnabled: boolean;
  consentTitle: string;
  consentTitleUrdu?: string;
  consentMessage: string;
  consentMessageUrdu?: string;
  consentAcceptButtonText: string;
  consentAcceptButtonTextUrdu?: string;
  consentLearnMoreText: string;
  consentLearnMoreTextUrdu?: string;
  consentBadgeText?: string;
  consentBadgeTextUrdu?: string;

  updatedAt?: string;
}



