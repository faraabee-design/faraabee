import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { SiteTheme, SiteCopyContent, TextCustomization } from '../types/customization';
import { DEFAULT_THEME, DEFAULT_CONTENT } from '../config/defaultCustomization';

// Helper to remove any undefined values before writing to Firestore
function sanitizeData<T extends Record<string, any>>(data: T): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) {
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        cleaned[key] = sanitizeData(val);
      } else {
        cleaned[key] = val;
      }
    }
  }
  return cleaned;
}

interface CustomizationContextType {
  theme: SiteTheme;
  content: SiteCopyContent;
  updateTheme: (updates: Partial<SiteTheme>) => Promise<void>;
  updateContent: (updates: Partial<SiteCopyContent>) => Promise<void>;
  updateTextItem: (key: keyof SiteCopyContent, item: Partial<TextCustomization>) => Promise<void>;
  resetTheme: () => Promise<void>;
  resetContent: () => Promise<void>;
  getText: (key: keyof SiteCopyContent) => TextCustomization;
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export const CustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<SiteTheme>(() => {
    try {
      const saved = localStorage.getItem('farabi_cached_theme');
      return saved ? { ...DEFAULT_THEME, ...JSON.parse(saved) } : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const [content, setContent] = useState<SiteCopyContent>(() => {
    try {
      const saved = localStorage.getItem('farabi_cached_content');
      return saved ? { ...DEFAULT_CONTENT, ...JSON.parse(saved) } : DEFAULT_CONTENT;
    } catch {
      return DEFAULT_CONTENT;
    }
  });

  // 1. Listen to real-time Theme customizations from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'settings', 'theme'),
      (docSnap) => {
        if (docSnap.exists()) {
          const remote = docSnap.data() as Partial<SiteTheme>;
          setTheme((prev) => {
            const next = { ...prev, ...remote };
            try {
              localStorage.setItem('farabi_cached_theme', JSON.stringify(next));
            } catch {}
            return next;
          });
        }
      },
      (err) => console.warn('Could not read remote theme settings:', err.message)
    );

    return () => unsub();
  }, []);

  // 2. Listen to real-time Content & Copy customizations from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'settings', 'content'),
      (docSnap) => {
        if (docSnap.exists()) {
          const remote = docSnap.data() as Record<string, TextCustomization>;
          setContent((prev) => {
            const merged = { ...prev };
            for (const [k, v] of Object.entries(remote)) {
              if (k in merged && v) {
                // @ts-expect-error key merge
                merged[k] = { ...merged[k], ...v };
              }
            }
            try {
              localStorage.setItem('farabi_cached_content', JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      },
      (err) => console.warn('Could not read remote content settings:', err.message)
    );

    return () => unsub();
  }, []);

  // 3. Inject CSS Variables into the document root for reactive live styling
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--farabi-primary', theme.primaryColor);
    root.style.setProperty('--farabi-secondary', theme.secondaryColor);
    root.style.setProperty('--farabi-accent', theme.accentColor);
    root.style.setProperty('--farabi-accent-light', theme.accentLightColor);
    root.style.setProperty('--farabi-bg', theme.backgroundColor);
    root.style.setProperty('--farabi-surface', theme.surfaceColor);
    root.style.setProperty('--farabi-text', theme.textColor);
    root.style.setProperty('--farabi-header-bg', theme.headerBgColor);
    root.style.setProperty('--farabi-header-text', theme.headerTextColor);
    root.style.setProperty('--farabi-footer-bg', theme.footerBgColor);
    root.style.setProperty('--farabi-footer-text', theme.footerTextColor);
    root.style.setProperty('--farabi-btn-bg', theme.buttonBgColor);
    root.style.setProperty('--farabi-btn-text', theme.buttonTextColor);
    root.style.setProperty('--farabi-banner-bg', theme.bannerBgColor);
    root.style.setProperty('--farabi-banner-text', theme.bannerTextColor);

    if (theme.fontHeading) {
      root.style.setProperty('--font-heading', `"${theme.fontHeading}", Georgia, serif`);
    }
    if (theme.fontBody) {
      root.style.setProperty('--font-body', `"${theme.fontBody}", system-ui, sans-serif`);
    }
  }, [theme]);

  // Update Theme in Cloud
  const updateTheme = async (updates: Partial<SiteTheme>) => {
    const merged = { ...theme, ...updates };
    setTheme(merged);
    try {
      const payload = sanitizeData(merged);
      await setDoc(doc(db, 'settings', 'theme'), payload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/theme');
    }
  };

  // Update whole Content object
  const updateContent = async (updates: Partial<SiteCopyContent>) => {
    const merged = { ...content, ...updates };
    setContent(merged);
    try {
      const payload = sanitizeData(merged);
      await setDoc(doc(db, 'settings', 'content'), payload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/content');
    }
  };

  // Update single Text block (text, font, color, size)
  const updateTextItem = async (key: keyof SiteCopyContent, item: Partial<TextCustomization>) => {
    const current = content[key] || DEFAULT_CONTENT[key];
    const updatedItem: TextCustomization = {
      ...current,
      ...item,
    };
    const updatedContent = {
      ...content,
      [key]: updatedItem,
    };
    setContent(updatedContent);

    try {
      const payload = sanitizeData({ [key]: updatedItem });
      await setDoc(doc(db, 'settings', 'content'), payload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `settings/content/${String(key)}`);
    }
  };

  // Reset Theme to Default
  const resetTheme = async () => {
    setTheme(DEFAULT_THEME);
    try {
      await setDoc(doc(db, 'settings', 'theme'), sanitizeData(DEFAULT_THEME));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/theme');
    }
  };

  // Reset Content to Default
  const resetContent = async () => {
    setContent(DEFAULT_CONTENT);
    try {
      await setDoc(doc(db, 'settings', 'content'), sanitizeData(DEFAULT_CONTENT));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/content');
    }
  };

  // Helper to safely get an item with default fallback
  const getText = (key: keyof SiteCopyContent): TextCustomization => {
    return content[key] || DEFAULT_CONTENT[key];
  };

  return (
    <CustomizationContext.Provider
      value={{
        theme,
        content,
        updateTheme,
        updateContent,
        updateTextItem,
        resetTheme,
        resetContent,
        getText,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const ctx = useContext(CustomizationContext);
  if (!ctx) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return ctx;
};

// Reusable Dynamic Text Component that honors custom text, font, size, and color
interface DynamicTextProps {
  id: keyof SiteCopyContent;
  defaultText?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export const DynamicText: React.FC<DynamicTextProps> = ({
  id,
  defaultText,
  className = '',
  as: Component = 'span',
}) => {
  const { content } = useCustomization();
  const item: TextCustomization = content[id] || DEFAULT_CONTENT[id] || { text: defaultText || '' };

  const style: React.CSSProperties = {};
  if (item.fontFamily) {
    style.fontFamily = `"${item.fontFamily}", serif`;
  }
  if (item.color) {
    style.color = item.color;
  }

  const combinedClasses = `${item.fontSize || ''} ${item.fontWeight || ''} ${className}`.trim();

  return (
    <Component className={combinedClasses} style={style}>
      {item.text || defaultText}
    </Component>
  );
};
