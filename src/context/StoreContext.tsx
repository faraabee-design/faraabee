import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  deleteField,
  onSnapshot,
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import {
  Product,
  Category,
  Promotion,
  Order,
  SocialLinks,
  StoreSettings,
  SpiritualPost,
  SpiritualSettings,
  DeliverySettings,
  Review,
  CareBundle,
  BotanicalIngredient,
  HikmatCard,
  AudioTrack,
  QuizConcern,
  Language,
  PaymentSettings,
  SpinWheelSettings,
  HakeemBargainSettings,
  WheelSlice,
  DeveloperSignatureSettings,
  SpiritualAppointment,
  AppointmentSlotConfig,
  AppointmentStatus,
  ConsultationType,
} from '../types';
import { DEFAULT_PAYMENT_SETTINGS } from '../config/defaultPayment';
import {
  DEFAULT_SPIN_WHEEL_SETTINGS,
  DEFAULT_HAKEEM_BARGAIN_SETTINGS,
} from '../config/defaultFunFeatures';

export const DEFAULT_APPOINTMENT_CONFIG: AppointmentSlotConfig = {
  acceptingAppointments: true,
  closedNoticeMessage: 'Spiritual consultations are currently paused for today while Hakeem Sahib attends existing patients. Please check back tomorrow morning.',
  closedNoticeMessageUrdu: 'حکیم صاحب فی الوقت مریضوں کے ساتھ مصروف ہیں۔ آج کے مشوروں کے لیے نئے وقت کا انتظار فرمائیں یا کل صبح دوبارہ رجوع فرمائیں۔',
  consultationWindowStart: '10:00 AM',
  consultationWindowEnd: '08:00 PM',
  slotDurationMinutes: 30,
  availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  dailySlotsLimit: 8,
  whatsappDeskNumber: '923091655743',
  consultationFeeNotice: 'Spiritual Hikmat Consultation is provided as a blessing and guidance for our patrons.',
  consultationFeeNoticeUrdu: 'روحانی و طبی مشورہ برائے شفا و دعا خالصتاً رضائے الٰہی کے لیے حاضر ہے۔',
  updatedAt: new Date().toISOString(),
};

export const fallbackAppointments: SpiritualAppointment[] = [
  {
    id: 'apt-demo-1',
    referenceId: 'APT-84291',
    customerName: 'Tariq Mehmood',
    customerPhone: '+92 300 1234567',
    customerEmail: 'tariq.m@example.com',
    city: 'Lahore',
    preferredDate: '2026-10-26',
    preferredTimeSlot: 'Evening (6:00 PM - 8:00 PM)',
    consultationType: 'voice_recording',
    category: 'Spiritual Serenity & Anxiety (دل کا سکون و بے چینی)',
    problemDescription: 'Frequent chest heaviness and sleep restlessness for past 3 weeks. Requesting prophetic botanical oils and ruqyah water guidance.',
    audioDurationSeconds: 42,
    status: 'pending',
    createdAt: '2026-10-23T16:20:00Z',
  },
  {
    id: 'apt-demo-2',
    referenceId: 'APT-84180',
    customerName: 'Zainab Bibi',
    customerPhone: '+92 321 9876543',
    city: 'Rawalpindi',
    preferredDate: '2026-10-25',
    preferredTimeSlot: 'Afternoon (2:00 PM - 5:00 PM)',
    consultationType: 'written_text',
    category: 'Ruqyah & Evil Eye (نظر بد و روحانی حفاظت)',
    problemDescription: 'Severe recurrent migraines after social gatherings. Seeking herbal bath and ruqyah dhikr schedule.',
    status: 'confirmed',
    scheduledTime: '2026-10-25T15:00:00Z',
    confirmedSlotLabel: 'Sunday, 25 Oct • 3:00 PM PKT',
    adminNotes: 'Assigned 25-minute WhatsApp Voice consultation. Recommended Sidr leaf infusion & Ruqyah track #3.',
    confirmationNotificationSent: true,
    createdAt: '2026-10-22T11:15:00Z',
  },
  {
    id: 'apt-demo-3',
    referenceId: 'APT-83955',
    customerName: 'Muhammad Salman',
    customerPhone: '+92 333 5556677',
    city: 'Karachi',
    preferredDate: '2026-10-22',
    preferredTimeSlot: 'Morning (10:00 AM - 1:00 PM)',
    consultationType: 'whatsapp_call',
    category: 'Prophetic Diet & Herbs (طب نبوی و غذا)',
    problemDescription: 'Joint stiffness and sluggish digestion. Inquiring about pure Kalonji oil and Talbina dosage.',
    status: 'completed',
    scheduledTime: '2026-10-22T11:00:00Z',
    confirmedSlotLabel: 'Thursday, 22 Oct • 11:00 AM PKT',
    adminNotes: 'Prescribed Habba Sawda with mountain wild honey. Patient satisfied with guidance.',
    confirmationNotificationSent: true,
    createdAt: '2026-10-21T09:40:00Z',
  },
];

export const fallbackDeveloperSignatureSettings: DeveloperSignatureSettings = {
  enabled: true,
  signatureImage: '',
  customText: 'This website was created by me. If you want your own custom website, contact:',
  customTextUrdu: 'یہ ویب سائٹ میرے ہاتھوں سے تیار کی گئی ہے۔ اگر آپ اپنی مرضی کی ویب سائٹ بنوانا چاہتے ہیں تو رابطہ کریں:',
  email: 'faraabee@gmail.com',
  creatorName: 'Farabi Web Studio',
  badgeTitle: 'Website Creator & Designer',
  penColor: '#D4AF37',
  updatedAt: new Date().toISOString(),
};
import { products as fallbackProducts } from '../data/products';
import { fallbackSpiritualPosts, fallbackSpiritualSettings } from '../data/spiritual';
import {
  fallbackReviews,
  fallbackBundles,
  fallbackBotanicals,
  fallbackHikmatCards,
  fallbackAudioTracks,
  defaultQuizConcerns,
} from '../data/featuresData';
import { translations, TranslationDictionary } from '../i18n/translations';
import { siteConfig } from '../config/siteConfig';
import { useAuth } from './FirebaseContext';

// Helper to safely strip undefined values and convert empty optional fields for Firestore
function cleanForUpdate<T extends Record<string, any>>(updates: T): Record<string, any> {
  const cleaned: Record<string, any> = {
    updatedAt: new Date().toISOString(),
  };

  for (const [key, val] of Object.entries(updates)) {
    if (key === 'id') continue;
    if (val === undefined) {
      cleaned[key] = deleteField();
    } else {
      cleaned[key] = val;
    }
  }

  return cleaned;
}

function cleanForCreate<T extends Record<string, any>>(data: T): Record<string, any> {
  const cleaned: Record<string, any> = {};

  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) {
      cleaned[key] = val;
    }
  }

  return cleaned;
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  promotions: Promotion[];
  orders: Order[];
  spiritualPosts: SpiritualPost[];
  spiritualSettings: SpiritualSettings;
  loading: boolean;
  featuredProducts: Product[];
  activePromotion: Promotion | null;
  socialLinks: SocialLinks;
  contactInfo: typeof siteConfig.contact;
  updateSocialLinks: (links: Partial<SocialLinks>) => Promise<void>;
  updateContactInfo: (info: Partial<typeof siteConfig.contact>) => Promise<void>;
  // CRUD Products
  addProduct: (productData: Partial<Product>) => Promise<string>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  duplicateProduct: (id: string) => Promise<string>;
  toggleProductFeatured: (id: string, current: boolean) => Promise<void>;
  toggleProductStatus: (id: string, currentStatus: Product['status']) => Promise<void>;
  // CRUD Categories
  addCategory: (categoryData: Omit<Category, 'id'>) => Promise<string>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  // CRUD Promotions
  addPromotion: (promoData: Omit<Promotion, 'id'>) => Promise<string>;
  updatePromotion: (id: string, updates: Partial<Promotion>) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;
  // Orders
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
  // Spiritual Sanctuary CRUD
  addSpiritualPost: (data: Partial<SpiritualPost>) => Promise<string>;
  updateSpiritualPost: (id: string, updates: Partial<SpiritualPost>) => Promise<void>;
  deleteSpiritualPost: (id: string) => Promise<void>;
  updateSpiritualSettings: (settings: Partial<SpiritualSettings>) => Promise<void>;
  // Delivery & Shipping settings
  deliverySettings: DeliverySettings;
  updateDeliverySettings: (updates: Partial<DeliverySettings>) => Promise<void>;
  // Online Payment Settings (Bank Transfer, JazzCash, Easypaisa, COD)
  paymentSettings: PaymentSettings;
  updatePaymentSettings: (updates: Partial<PaymentSettings>) => Promise<void>;
  // Spin the Shifa Wheel & Hakeem Bargain Gamification
  spinWheelSettings: SpinWheelSettings;
  updateSpinWheelSettings: (updates: Partial<SpinWheelSettings>) => Promise<void>;
  hakeemBargainSettings: HakeemBargainSettings;
  updateHakeemBargainSettings: (updates: Partial<HakeemBargainSettings>) => Promise<void>;
  // Website Creator / Developer Attribution Signature
  developerSignatureSettings: DeveloperSignatureSettings;
  updateDeveloperSignatureSettings: (updates: Partial<DeveloperSignatureSettings>) => Promise<void>;
  // Spiritual Appointments & Timeline Consultation
  appointments: SpiritualAppointment[];
  appointmentConfig: AppointmentSlotConfig;
  createAppointment: (data: Omit<SpiritualAppointment, 'id' | 'createdAt'>) => Promise<string>;
  updateAppointmentStatus: (
    id: string,
    status: AppointmentStatus,
    notes?: string,
    scheduledTime?: string,
    confirmedSlotLabel?: string,
    confirmationNotificationSent?: boolean
  ) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  updateAppointmentConfig: (updates: Partial<AppointmentSlotConfig>) => Promise<void>;
  refreshAppointments: () => Promise<void>;
  appliedCoupon: {
    code: string;
    discountPercent?: number;
    discountAmount?: number;
    freeShipping?: boolean;
    freeGift?: string;
  } | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  // Active currency display mode
  activeCurrency: 'PKR' | 'USD';
  setActiveCurrency: (curr: 'PKR' | 'USD') => void;
  // Bilingual English / Urdu Mode
  language: 'en' | 'ur';
  setLanguage: (lang: 'en' | 'ur') => void;
  t: TranslationDictionary;
  // Customer Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<string>;
  deleteReview: (id: string) => Promise<void>;
  approveReview: (id: string, approved: boolean) => Promise<void>;
  // Care Bundles & Packages
  bundles: CareBundle[];
  addBundle: (bundle: Partial<CareBundle>) => Promise<string>;
  updateBundle: (id: string, updates: Partial<CareBundle>) => Promise<void>;
  deleteBundle: (id: string) => Promise<void>;
  // Botanical Ingredients Directory
  botanicals: BotanicalIngredient[];
  // Prophetic Hikmat Cards
  hikmatCards: HikmatCard[];
  addHikmatCard: (card: Partial<HikmatCard>) => Promise<string>;
  updateHikmatCard: (id: string, updates: Partial<HikmatCard>) => Promise<void>;
  deleteHikmatCard: (id: string) => Promise<void>;
  // Audio Player Tracks
  audioTracks: AudioTrack[];
  updateAudioTracks: (tracks: AudioTrack[]) => Promise<void>;
  // Consultation Quiz Concerns
  quizConcerns: QuizConcern[];
  // Image upload
  uploadProductImage: (file: File) => Promise<string>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'All Products', slug: 'all', displayOrder: 1, active: true, description: 'All handcrafted herbal formulas' },
  { name: 'Herbal Oils', slug: 'herbal-oils', displayOrder: 2, active: true, description: 'Traditional cold-pressed and slow-macerated herbal oils' },
  { name: 'Herbal Balms', slug: 'herbal-balms', displayOrder: 3, active: true, description: 'Botanical salves infused with pure beeswax and extracts' },
  { name: 'Botanical Elixirs', slug: 'botanical-elixirs', displayOrder: 4, active: true, description: 'Concentrated plant essences and nourishing drops' },
  { name: 'Herbal Preparations', slug: 'herbal-preparations', displayOrder: 5, active: true, description: 'Artisanal apothecary blends and herbal tonics' },
];

const DEFAULT_DELIVERY_SETTINGS: DeliverySettings = {
  standardShippingFee: siteConfig.currency.standardShippingFee || 250,
  standardShippingFeeUSD: 10,
  freeShippingThreshold: siteConfig.currency.freeShippingThreshold || 5000,
  freeShippingThresholdUSD: 50,
  freeShippingEnabled: true,
  deliveryNote: 'Standard delivery across Pakistan takes 2-4 business days.',
  estimatedDays: '2-4 Business Days',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('farabi_cached_products');
      return saved ? JSON.parse(saved) : fallbackProducts;
    } catch {
      return fallbackProducts;
    }
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('farabi_cached_categories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    try {
      const saved = localStorage.getItem('farabi_cached_promotions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [spiritualPosts, setSpiritualPosts] = useState<SpiritualPost[]>(() => {
    try {
      const saved = localStorage.getItem('farabi_cached_spiritual_posts');
      return saved ? JSON.parse(saved) : fallbackSpiritualPosts;
    } catch {
      return fallbackSpiritualPosts;
    }
  });
  const [spiritualSettings, setSpiritualSettings] = useState<SpiritualSettings>(() => {
    try {
      const saved = localStorage.getItem('farabi_cached_spiritual_settings');
      return saved ? { ...fallbackSpiritualSettings, ...JSON.parse(saved) } : fallbackSpiritualSettings;
    } catch {
      return fallbackSpiritualSettings;
    }
  });
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(() => {
    try {
      const saved = localStorage.getItem('farabi_cached_socials');
      return saved ? { ...siteConfig.social, ...JSON.parse(saved) } : siteConfig.social;
    } catch {
      return siteConfig.social;
    }
  });
  const [contactInfo, setContactInfo] = useState<typeof siteConfig.contact>(() => {
    try {
      const saved = localStorage.getItem('farabi_cached_contact');
      return saved ? { ...siteConfig.contact, ...JSON.parse(saved) } : siteConfig.contact;
    } catch {
      return siteConfig.contact;
    }
  });
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>(DEFAULT_DELIVERY_SETTINGS);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS);
  const [spinWheelSettings, setSpinWheelSettings] = useState<SpinWheelSettings>(DEFAULT_SPIN_WHEEL_SETTINGS);
  const [hakeemBargainSettings, setHakeemBargainSettings] = useState<HakeemBargainSettings>(DEFAULT_HAKEEM_BARGAIN_SETTINGS);
  const [developerSignatureSettings, setDeveloperSignatureSettings] = useState<DeveloperSignatureSettings>(() => {
    try {
      const saved = localStorage.getItem('farabi_dev_sig_settings');
      return saved ? JSON.parse(saved) : fallbackDeveloperSignatureSettings;
    } catch {
      return fallbackDeveloperSignatureSettings;
    }
  });
  const [appointments, setAppointments] = useState<SpiritualAppointment[]>(() => {
    try {
      const saved = localStorage.getItem('farabi_cached_appointments');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [appointmentConfig, setAppointmentConfig] = useState<AppointmentSlotConfig>(() => {
    try {
      const saved = localStorage.getItem('farabi_appointment_config');
      return saved ? JSON.parse(saved) : DEFAULT_APPOINTMENT_CONFIG;
    } catch {
      return DEFAULT_APPOINTMENT_CONFIG;
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent?: number;
    discountAmount?: number;
    freeShipping?: boolean;
    freeGift?: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('faraabee_applied_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [activeCurrency, setActiveCurrency] = useState<'PKR' | 'USD'>('PKR');
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('faraabee_lang');
      return (saved === 'ur' || saved === 'en') ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  // Sync document language and direction
  useEffect(() => {
    try {
      if (language === 'ur') {
        document.documentElement.setAttribute('lang', 'ur');
        document.documentElement.setAttribute('dir', 'rtl');
      } else {
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.setAttribute('dir', 'ltr');
      }
    } catch {}
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('faraabee_lang', lang);
      if (lang === 'ur') {
        document.documentElement.setAttribute('lang', 'ur');
        document.documentElement.setAttribute('dir', 'rtl');
      } else {
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.setAttribute('dir', 'ltr');
      }
    } catch {}
  };

  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);
  const [bundles, setBundles] = useState<CareBundle[]>(fallbackBundles);
  const [botanicals] = useState<BotanicalIngredient[]>(fallbackBotanicals);
  const [hikmatCards, setHikmatCards] = useState<HikmatCard[]>(fallbackHikmatCards);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>(fallbackAudioTracks);
  const [quizConcerns] = useState<QuizConcern[]>(defaultQuizConcerns);
  const [loading, setLoading] = useState(true);

  // 1. Subscribe to Products
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            loaded.push({
              id: docSnap.id,
              ...data,
            } as Product);
          });
          // Sort by displayOrder or fallback
          loaded.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
          setProducts(loaded);
          try {
            localStorage.setItem('farabi_cached_products', JSON.stringify(loaded));
          } catch {}
        } else if (isAdmin) {
          // Empty in Firestore -> seed initial data if admin
          seedInitialProducts();
        }
        setLoading(false);
      },
      (error) => {
        console.warn('Could not read products from Firestore:', error.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [isAdmin]);

  // 2. Subscribe to Categories
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Category[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({
              id: docSnap.id,
              ...docSnap.data(),
            } as Category);
          });
          loaded.sort((a, b) => a.displayOrder - b.displayOrder);
          setCategories(loaded);
          try {
            localStorage.setItem('farabi_cached_categories', JSON.stringify(loaded));
          } catch {}
        } else if (isAdmin) {
          seedInitialCategories();
        }
      },
      (error) => {
        console.warn('Could not read categories from Firestore:', error.message);
      }
    );

    return () => unsub();
  }, [isAdmin]);

  // 3. Subscribe to Promotions
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'promotions'),
      (snapshot) => {
        const loaded: Promotion[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({
            id: docSnap.id,
            ...docSnap.data(),
          } as Promotion);
        });
        setPromotions(loaded);
        try {
          localStorage.setItem('farabi_cached_promotions', JSON.stringify(loaded));
        } catch {}
      },
      (error) => {
        console.warn('Could not read promotions:', error.message);
      }
    );

    return () => unsub();
  }, []);

  // 4. Subscribe to Orders (only if Admin)
  useEffect(() => {
    if (!isAdmin) {
      setOrders([]);
      return;
    }
    const unsub = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const loaded: Order[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({
            id: docSnap.id,
            ...docSnap.data(),
          } as Order);
        });
        loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(loaded);
      },
      (error) => {
        console.warn('Could not read orders:', error.message);
      }
    );

    return () => unsub();
  }, [isAdmin]);

  // 4b. Subscribe to Spiritual Appointments (when Admin)
  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    const unsub = onSnapshot(
      collection(db, 'appointments'),
      (snapshot) => {
        const loaded: SpiritualAppointment[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({
            id: docSnap.id,
            ...docSnap.data(),
          } as SpiritualAppointment);
        });
        loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAppointments(loaded);
        try {
          localStorage.setItem('farabi_cached_appointments', JSON.stringify(loaded));
        } catch {}
      },
      (error) => {
        console.warn('Could not read appointments from Firestore:', error.message);
      }
    );

    return () => unsub();
  }, [isAdmin]);

  // 5. Subscribe to Social Links & Store Contact Info
  useEffect(() => {
    const unsubSocials = onSnapshot(
      doc(db, 'settings', 'socials'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSocialLinks((prev) => ({ ...prev, ...(docSnap.data() as SocialLinks) }));
        }
      },
      (err) => console.warn('Could not read social links:', err.message)
    );

    const unsubContact = onSnapshot(
      doc(db, 'settings', 'contact'),
      (docSnap) => {
        if (docSnap.exists()) {
          setContactInfo((prev) => ({ ...prev, ...(docSnap.data() as typeof siteConfig.contact) }));
        }
      },
      (err) => console.warn('Could not read contact info:', err.message)
    );

    const unsubDelivery = onSnapshot(
      doc(db, 'settings', 'delivery'),
      (docSnap) => {
        if (docSnap.exists()) {
          setDeliverySettings((prev) => ({ ...prev, ...(docSnap.data() as DeliverySettings) }));
        }
      },
      (err) => console.warn('Could not read delivery settings:', err.message)
    );

    const unsubPayment = onSnapshot(
      doc(db, 'settings', 'payment'),
      (docSnap) => {
        if (docSnap.exists()) {
          setPaymentSettings((prev) => ({ ...prev, ...(docSnap.data() as PaymentSettings) }));
        }
      },
      (err) => console.warn('Could not read payment settings:', err.message)
    );

    const unsubSpinWheel = onSnapshot(
      doc(db, 'settings', 'spinWheel'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSpinWheelSettings((prev) => ({ ...prev, ...(docSnap.data() as SpinWheelSettings) }));
        }
      },
      (err) => console.warn('Could not read spin wheel settings:', err.message)
    );

    const unsubHakeemBargain = onSnapshot(
      doc(db, 'settings', 'hakeemBargain'),
      (docSnap) => {
        if (docSnap.exists()) {
          setHakeemBargainSettings((prev) => ({ ...prev, ...(docSnap.data() as HakeemBargainSettings) }));
        }
      },
      (err) => console.warn('Could not read hakeem bargain settings:', err.message)
    );

    const unsubDeveloperSignature = onSnapshot(
      doc(db, 'settings', 'developerSignature'),
      (docSnap) => {
        if (docSnap.exists()) {
          const remote = docSnap.data() as DeveloperSignatureSettings;
          setDeveloperSignatureSettings((prev) => {
            const next = { ...prev, ...remote };
            try {
              localStorage.setItem('farabi_dev_sig_settings', JSON.stringify(next));
            } catch {}
            return next;
          });
        }
      },
      (err) => console.warn('Could not read developer signature settings:', err.message)
    );

    const unsubAppointmentConfig = onSnapshot(
      doc(db, 'settings', 'appointmentConfig'),
      (docSnap) => {
        if (docSnap.exists()) {
          const remote = docSnap.data() as AppointmentSlotConfig;
          setAppointmentConfig((prev) => {
            const next = { ...prev, ...remote };
            try {
              localStorage.setItem('farabi_appointment_config', JSON.stringify(next));
            } catch {}
            return next;
          });
        }
      },
      (err) => console.warn('Could not read appointment config:', err.message)
    );

    return () => {
      unsubSocials();
      unsubContact();
      unsubDelivery();
      unsubPayment();
      unsubSpinWheel();
      unsubHakeemBargain();
      unsubDeveloperSignature();
      unsubAppointmentConfig();
    };
  }, []);

  // 6. Subscribe to Spiritual Posts and Settings
  useEffect(() => {
    const unsubSpiritual = onSnapshot(
      collection(db, 'spiritual'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: SpiritualPost[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({
              id: docSnap.id,
              ...docSnap.data(),
            } as SpiritualPost);
          });
          loaded.sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
          setSpiritualPosts(loaded);
          try {
            localStorage.setItem('farabi_cached_spiritual_posts', JSON.stringify(loaded));
          } catch {}
        } else if (isAdmin) {
          seedInitialSpiritual();
        }
      },
      (err) => console.warn('Could not read spiritual posts:', err.message)
    );

    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'spiritual'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSpiritualSettings((prev) => {
            const next = { ...prev, ...(docSnap.data() as SpiritualSettings) };
            try {
              localStorage.setItem('farabi_cached_spiritual_settings', JSON.stringify(next));
            } catch {}
            return next;
          });
        }
      },
      (err) => console.warn('Could not read spiritual settings:', err.message)
    );

    return () => {
      unsubSpiritual();
      unsubSettings();
    };
  }, [isAdmin]);

  // Seeding helpers
  const seedInitialSpiritual = async () => {
    try {
      const batch = writeBatch(db);
      for (const sp of fallbackSpiritualPosts) {
        const docRef = doc(db, 'spiritual', sp.id);
        batch.set(docRef, sp);
      }
      const settingsRef = doc(db, 'settings', 'spiritual');
      batch.set(settingsRef, fallbackSpiritualSettings);
      await batch.commit();
    } catch {
      // Ignore if unauthenticated
    }
  };

  const seedInitialProducts = async () => {
    try {
      const batch = writeBatch(db);
      for (const p of fallbackProducts) {
        const docRef = doc(db, 'products', p.id);
        batch.set(docRef, {
          ...p,
          status: 'active',
          displayOrder: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      await batch.commit();
    } catch {
      // Ignore if unauthenticated visitor cannot write
    }
  };

  const seedInitialCategories = async () => {
    try {
      const batch = writeBatch(db);
      for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
        const cat = DEFAULT_CATEGORIES[i];
        const docRef = doc(db, 'categories', cat.slug);
        batch.set(docRef, {
          ...cat,
          id: cat.slug,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      await batch.commit();
    } catch {
      // Ignore if unauthenticated
    }
  };

  // Products CRUD
  const addProduct = async (productData: Partial<Product>): Promise<string> => {
    const slug = (productData.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const id = `farabi-${slug}-${Date.now().toString(36)}`;
    const fullProduct: Product = {
      id,
      slug,
      name: productData.name || 'New Herbal Product',
      urduName: productData.urduName || '',
      category: productData.category || 'Herbal Oils',
      price: Number(productData.price) || 0,
      salePrice: productData.salePrice ? Number(productData.salePrice) : undefined,
      currency: productData.currency || 'PKR',
      priceUSD: productData.priceUSD !== undefined && productData.priceUSD !== null ? Number(productData.priceUSD) : undefined,
      salePriceUSD: productData.salePriceUSD !== undefined && productData.salePriceUSD !== null ? Number(productData.salePriceUSD) : undefined,
      volume: productData.volume || '100 ml',
      shortDescription: productData.shortDescription || '',
      description: productData.description || '',
      image: productData.image || fallbackProducts[0].image,
      secondaryImage: productData.secondaryImage || '',
      featured: !!productData.featured,
      inStock: productData.inStock !== false,
      stockQuantity: productData.stockQuantity ?? 50,
      sku: productData.sku || `FB-${Math.floor(1000 + Math.random() * 9000)}`,
      status: productData.status || 'active',
      displayOrder: productData.displayOrder ?? (products.length + 1),
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 0,
      traditionalUse: productData.traditionalUse || '',
      directions: productData.directions || '',
      precautions: productData.precautions || '',
      packagingInfo: productData.packagingInfo || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const payload = cleanForCreate(fullProduct);
      await setDoc(doc(db, 'products', id), payload);
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `products/${id}`);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const existing = products.find((p) => p.id === id);
      const merged = cleanForCreate({
        ...(existing || {}),
        ...updates,
        id,
        updatedAt: new Date().toISOString(),
      });
      await setDoc(doc(db, 'products', id), merged, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  };

  const duplicateProduct = async (id: string): Promise<string> => {
    const existing = products.find((p) => p.id === id);
    if (!existing) throw new Error('Product not found');
    const newName = `${existing.name} (Copy)`;
    const newSlug = `${existing.slug}-copy-${Date.now().toString(36)}`;
    const newId = `farabi-${newSlug}`;

    const duplicated: Product = {
      ...existing,
      id: newId,
      slug: newSlug,
      name: newName,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'products', newId), duplicated);
      return newId;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `products/${newId}`);
    }
  };

  const toggleProductFeatured = async (id: string, current: boolean) => {
    await updateProduct(id, { featured: !current });
  };

  const toggleProductStatus = async (id: string, currentStatus: Product['status']) => {
    const nextStatus: Product['status'] = currentStatus === 'active' ? 'draft' : 'active';
    await updateProduct(id, { status: nextStatus });
  };

  // Categories CRUD
  const addCategory = async (categoryData: Omit<Category, 'id'>): Promise<string> => {
    const slug = categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = slug;
    try {
      const payload = cleanForCreate({
        ...categoryData,
        id,
        slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await setDoc(doc(db, 'categories', id), payload);
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `categories/${id}`);
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const existing = categories.find((c) => c.id === id);
      const merged = cleanForCreate({
        ...(existing || {}),
        ...updates,
        id,
        updatedAt: new Date().toISOString(),
      });
      await setDoc(doc(db, 'categories', id), merged, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `categories/${id}`);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
    }
  };

  // Promotions CRUD
  const addPromotion = async (promoData: Omit<Promotion, 'id'>): Promise<string> => {
    const id = `promo-${Date.now().toString(36)}`;
    try {
      const payload = cleanForCreate({
        ...promoData,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await setDoc(doc(db, 'promotions', id), payload);
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `promotions/${id}`);
    }
  };

  const updatePromotion = async (id: string, updates: Partial<Promotion>) => {
    try {
      const existing = promotions.find((p) => p.id === id);
      const merged = cleanForCreate({
        ...(existing || {}),
        ...updates,
        id,
        updatedAt: new Date().toISOString(),
      });
      await setDoc(doc(db, 'promotions', id), merged, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `promotions/${id}`);
    }
  };

  const deletePromotion = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'promotions', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `promotions/${id}`);
    }
  };

  // Orders CRUD
  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
    const id = `FRB-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const sanitizedItems = (orderData.items || []).map((item) => ({
      productId: String(item.productId || ''),
      name: String(item.name || 'Herbal Product'),
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      image: item.image ? String(item.image) : '',
    }));

    const fullOrder: Order = {
      id,
      createdAt: new Date().toISOString(),
      customerName: String(orderData.customerName || '').trim(),
      customerPhone: String(orderData.customerPhone || '').trim(),
      customerEmail: orderData.customerEmail ? String(orderData.customerEmail).trim() : '',
      shippingAddress: String(orderData.shippingAddress || '').trim(),
      city: String(orderData.city || 'Pakistan').trim(),
      notes: orderData.notes ? String(orderData.notes).trim() : '',
      items: sanitizedItems,
      total: Number(orderData.total) || 0,
      status: orderData.status || 'pending',
      paymentMethod: orderData.paymentMethod || 'cod',
      transactionId: orderData.transactionId ? String(orderData.transactionId).trim() : '',
      paymentSenderTitle: orderData.paymentSenderTitle ? String(orderData.paymentSenderTitle).trim() : '',
    };

    const cleanPayload = cleanForCreate(fullOrder);

    try {
      await setDoc(doc(db, 'orders', id), cleanPayload);
      setOrders((prev) => [fullOrder, ...prev.filter((o) => o.id !== id)]);
      return id;
    } catch (err) {
      console.error('Firestore createOrder failure:', err);
      handleFirestoreError(err, OperationType.CREATE, `orders/${id}`);
      throw err;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `orders/${orderId}`);
    }
  };

  const refreshOrders = async () => {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      const loaded: Order[] = [];
      snap.forEach((docSnap) => {
        loaded.push({
          id: docSnap.id,
          ...docSnap.data(),
        } as Order);
      });
      loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(loaded);
    } catch (err) {
      console.warn('Could not manually fetch orders:', err);
    }
  };

  // Client-side image compression helper (runs in ~30ms, guarantees 0 hanging)
  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const rawResult = e.target?.result as string;
          if (!rawResult) {
            resolve('');
            return;
          }
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const maxDimension = 1000;
              let width = img.width;
              let height = img.height;

              if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                  height = Math.round((height * maxDimension) / width);
                  width = maxDimension;
                } else {
                  width = Math.round((width * maxDimension) / height);
                  height = maxDimension;
                }
              }

              canvas.width = Math.max(1, width);
              canvas.height = Math.max(1, height);
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);
                // 0.82 JPEG gives ultra-compact size (~35KB-75KB) with crisp botanical sharpness
                const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
                resolve(dataUrl);
              } else {
                resolve(rawResult);
              }
            } catch {
              resolve(rawResult);
            }
          };
          img.onerror = () => resolve(rawResult);
          img.src = rawResult;
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      } catch {
        resolve('');
      }
    });
  };

  // Image Upload (Ultra-fast client-side compression with instant responsiveness)
  const uploadProductImage = async (file: File): Promise<string> => {
    // 1. Immediately compress client-side in browser memory
    const compressedDataUrl = await compressImageFile(file);

    // 2. Try Firebase Storage with a strict 1.5s timeout.
    // If Firebase Storage hangs or bucket is unconfigured, immediately resolve with compressed image!
    try {
      const storagePromise = (async () => {
        const storageRef = ref(storage, `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
      })();

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Storage timeout')), 1500)
      );

      return await Promise.race([storagePromise, timeoutPromise]);
    } catch {
      // Fallback seamlessly to the compressed data URL
      return compressedDataUrl || (await new Promise<string>((res) => {
        const r = new FileReader();
        r.onload = (e) => res(e.target?.result as string);
        r.onerror = () => res('');
        r.readAsDataURL(file);
      }));
    }
  };

  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.featured && p.status === 'active');
  }, [products]);

  const activePromotion = useMemo(() => {
    return promotions.find((p) => p.active) || null;
  }, [promotions]);

  const updateSocialLinks = async (links: Partial<SocialLinks>) => {
    const merged = { ...socialLinks, ...links };
    setSocialLinks(merged);
    try {
      const payload = cleanForCreate(merged);
      await setDoc(doc(db, 'settings', 'socials'), payload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/socials');
    }
  };

  const updateContactInfo = async (info: Partial<typeof siteConfig.contact>) => {
    const merged = { ...contactInfo, ...info };
    setContactInfo(merged);
    try {
      const payload = cleanForCreate(merged);
      await setDoc(doc(db, 'settings', 'contact'), payload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/contact');
    }
  };

  // Spiritual Sanctuary CRUD
  const addSpiritualPost = async (data: Partial<SpiritualPost>): Promise<string> => {
    const slug = (data.title || 'spiritual-post')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const id = `spiritual-${slug}-${Date.now().toString(36)}`;
    const fullPost: SpiritualPost = {
      id,
      title: data.title || 'Spiritual Wisdom',
      subtitle: data.subtitle || '',
      category: data.category || 'Prophetic Botanicals',
      image: data.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
      arabicQuote: data.arabicQuote || '',
      quoteTranslation: data.quoteTranslation || '',
      description: data.description || '',
      contactPrompt: data.contactPrompt || 'Consult on Spiritual Formulations',
      relatedProductSlug: data.relatedProductSlug || '',
      featured: Boolean(data.featured),
      active: data.active ?? true,
      displayOrder: Number(data.displayOrder) || spiritualPosts.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      const clean = cleanForCreate(fullPost);
      await setDoc(doc(db, 'spiritual', id), clean);
      setSpiritualPosts((prev) => [...prev, fullPost]);
      return id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `spiritual/${id}`);
      throw err;
    }
  };

  const updateSpiritualPost = async (id: string, updates: Partial<SpiritualPost>) => {
    try {
      const clean = cleanForCreate({
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      await setDoc(doc(db, 'spiritual', id), clean, { merge: true });
      setSpiritualPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `spiritual/${id}`);
      throw err;
    }
  };

  const deleteSpiritualPost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'spiritual', id));
      setSpiritualPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `spiritual/${id}`);
      throw err;
    }
  };

  const updateSpiritualSettings = async (settings: Partial<SpiritualSettings>) => {
    const merged = { ...spiritualSettings, ...settings, updatedAt: new Date().toISOString() };
    setSpiritualSettings(merged);
    try {
      const clean = cleanForCreate(merged);
      await setDoc(doc(db, 'settings', 'spiritual'), clean, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/spiritual');
      throw err;
    }
  };

  const updateDeliverySettings = async (settings: Partial<DeliverySettings>) => {
    const merged = { ...deliverySettings, ...settings };
    setDeliverySettings(merged);
    try {
      const clean = cleanForCreate(merged);
      await setDoc(doc(db, 'settings', 'delivery'), clean, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/delivery');
      throw err;
    }
  };

  const updatePaymentSettings = async (settings: Partial<PaymentSettings>) => {
    const merged = { ...paymentSettings, ...settings, updatedAt: new Date().toISOString() };
    setPaymentSettings(merged);
    try {
      const clean = cleanForCreate(merged);
      await setDoc(doc(db, 'settings', 'payment'), clean, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/payment');
      throw err;
    }
  };

  const updateSpinWheelSettings = async (settings: Partial<SpinWheelSettings>) => {
    const merged = { ...spinWheelSettings, ...settings, updatedAt: new Date().toISOString() };
    setSpinWheelSettings(merged);
    try {
      const clean = cleanForCreate(merged);
      await setDoc(doc(db, 'settings', 'spinWheel'), clean, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/spinWheel');
      throw err;
    }
  };

  const updateHakeemBargainSettings = async (settings: Partial<HakeemBargainSettings>) => {
    const merged = { ...hakeemBargainSettings, ...settings, updatedAt: new Date().toISOString() };
    setHakeemBargainSettings(merged);
    try {
      const clean = cleanForCreate(merged);
      await setDoc(doc(db, 'settings', 'hakeemBargain'), clean, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/hakeemBargain');
      throw err;
    }
  };

  const updateDeveloperSignatureSettings = async (settings: Partial<DeveloperSignatureSettings>) => {
    const merged = { ...developerSignatureSettings, ...settings, updatedAt: new Date().toISOString() };
    setDeveloperSignatureSettings(merged);
    try {
      localStorage.setItem('farabi_dev_sig_settings', JSON.stringify(merged));
    } catch {}
    try {
      const clean = cleanForCreate(merged);
      await setDoc(doc(db, 'settings', 'developerSignature'), clean, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/developerSignature');
      throw err;
    }
  };

  // Spiritual Consultations & Appointments Actions
  const createAppointment = async (data: Omit<SpiritualAppointment, 'id' | 'createdAt'>): Promise<string> => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const referenceId = `APT-${randomDigits}`;
    const newId = `apt-${Date.now()}`;

    // Safeguard Firestore 1MB document limit: Base64 audio can be at most 600KB
    let safeAudioUrl = data.audioRecordingUrl;
    let description = data.problemDescription || '';
    if (safeAudioUrl && safeAudioUrl.length > 700000) {
      console.warn('Audio data size is close to Firestore 1MB limit. Storing note for WhatsApp fast-track.');
      description = (description ? description + '\n' : '') + '[Patient recorded voice note on device - fast track via WhatsApp]';
      safeAudioUrl = undefined;
    }

    const fullData: SpiritualAppointment = {
      ...data,
      id: newId,
      referenceId: data.referenceId || referenceId,
      status: data.status || 'pending',
      problemDescription: description,
      audioRecordingUrl: safeAudioUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAppointments((prev) => [fullData, ...prev]);
    try {
      const saved = [fullData, ...appointments.filter((a) => a.id !== newId)];
      localStorage.setItem('farabi_cached_appointments', JSON.stringify(saved));
    } catch {}

    try {
      const clean = cleanForCreate(fullData);
      await setDoc(doc(db, 'appointments', newId), clean);
      console.log('Spiritual appointment successfully saved to Firestore:', newId);
      return newId;
    } catch (err) {
      console.error('Error saving appointment to Firestore:', err);
      return newId;
    }
  };

  const updateAppointmentStatus = async (
    id: string,
    status: AppointmentStatus,
    notes?: string,
    scheduledTime?: string,
    confirmedSlotLabel?: string,
    confirmationNotificationSent?: boolean
  ) => {
    const updates: Partial<SpiritualAppointment> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (notes !== undefined) updates.adminNotes = notes;
    if (scheduledTime !== undefined) updates.scheduledTime = scheduledTime;
    if (confirmedSlotLabel !== undefined) updates.confirmedSlotLabel = confirmedSlotLabel;
    if (confirmationNotificationSent !== undefined) updates.confirmationNotificationSent = confirmationNotificationSent;

    setAppointments((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, ...updates } : a));
      try {
        localStorage.setItem('farabi_cached_appointments', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const clean = cleanForCreate(updates);
      await updateDoc(doc(db, 'appointments', id), clean);
    } catch (err) {
      console.warn('Could not update appointment in Firestore, updated locally:', err);
    }
  };

  const deleteAppointment = async (id: string) => {
    setAppointments((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      try {
        localStorage.setItem('farabi_cached_appointments', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      await deleteDoc(doc(db, 'appointments', id));
    } catch (err) {
      console.warn('Could not delete appointment from Firestore, removed locally:', err);
    }
  };

  const updateAppointmentConfig = async (settings: Partial<AppointmentSlotConfig>) => {
    const merged = { ...appointmentConfig, ...settings, updatedAt: new Date().toISOString() };
    setAppointmentConfig(merged);
    try {
      localStorage.setItem('farabi_appointment_config', JSON.stringify(merged));
    } catch {}

    try {
      const clean = cleanForCreate(merged);
      await setDoc(doc(db, 'settings', 'appointmentConfig'), clean, { merge: true });
    } catch (err) {
      console.warn('Could not save appointment config to Firestore, saved locally:', err);
    }
  };

  const refreshAppointments = async () => {
    try {
      const snap = await getDocs(collection(db, 'appointments'));
      const loaded: SpiritualAppointment[] = [];
      snap.forEach((docSnap) => {
        loaded.push({
          id: docSnap.id,
          ...docSnap.data(),
        } as SpiritualAppointment);
      });
      loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setAppointments(loaded);
      try {
        localStorage.setItem('farabi_cached_appointments', JSON.stringify(loaded));
      } catch {}
      console.log('Refreshed appointments from cloud, total:', loaded.length);
    } catch (err) {
      console.error('Error refreshing appointments from Firestore:', err);
    }
  };

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return false;

    // Check spin wheel slices
    const slice = spinWheelSettings.slices.find((s) => s.couponCode.toUpperCase() === cleanCode);
    if (slice) {
      const couponObj = {
        code: cleanCode,
        discountPercent: slice.type === 'discount_percent' ? slice.value : undefined,
        discountAmount: slice.type === 'discount_fixed' ? slice.value : undefined,
        freeShipping: slice.type === 'free_shipping' ? true : undefined,
        freeGift: slice.type === 'free_gift' ? slice.label : undefined,
      };
      setAppliedCoupon(couponObj);
      try {
        localStorage.setItem('faraabee_applied_coupon', JSON.stringify(couponObj));
      } catch {}
      return true;
    }

    // Check Hakeem Bargain prefix or format (e.g. HAKEEM-OFFER-15 or HAKEEM-15)
    if (cleanCode.startsWith('HAKEEM')) {
      const parts = cleanCode.split('-');
      const lastPart = parts[parts.length - 1];
      const parsedNum = Number(lastPart);
      const discountPercent = !isNaN(parsedNum) && parsedNum > 0 ? parsedNum : hakeemBargainSettings.counterOfferDiscountPercent;
      const couponObj = {
        code: cleanCode,
        discountPercent,
      };
      setAppliedCoupon(couponObj);
      try {
        localStorage.setItem('faraabee_applied_coupon', JSON.stringify(couponObj));
      } catch {}
      return true;
    }

    // Standard fallback coupons
    if (cleanCode === 'SHIFA10' || cleanCode === 'FARABI10') {
      const couponObj = { code: cleanCode, discountPercent: 10 };
      setAppliedCoupon(couponObj);
      try {
        localStorage.setItem('faraabee_applied_coupon', JSON.stringify(couponObj));
      } catch {}
      return true;
    }

    if (cleanCode === 'SUPER15' || cleanCode === 'BARKAT15') {
      const couponObj = { code: cleanCode, discountPercent: 15 };
      setAppliedCoupon(couponObj);
      try {
        localStorage.setItem('faraabee_applied_coupon', JSON.stringify(couponObj));
      } catch {}
      return true;
    }

    if (cleanCode === 'FREESHIP') {
      const couponObj = { code: cleanCode, freeShipping: true };
      setAppliedCoupon(couponObj);
      try {
        localStorage.setItem('faraabee_applied_coupon', JSON.stringify(couponObj));
      } catch {}
      return true;
    }

    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    try {
      localStorage.removeItem('faraabee_applied_coupon');
    } catch {}
  };

  // 7. Subscribe to Reviews, Bundles, Hikmat Cards
  useEffect(() => {
    const unsubReviews = onSnapshot(
      collection(db, 'reviews'),
      (snap) => {
        if (!snap.empty) {
          const list: Review[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Review));
          setReviews(list);
        }
      },
      () => {}
    );

    const unsubBundles = onSnapshot(
      collection(db, 'bundles'),
      (snap) => {
        if (!snap.empty) {
          const list: CareBundle[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() } as CareBundle));
          setBundles(list);
        }
      },
      () => {}
    );

    const unsubHikmat = onSnapshot(
      collection(db, 'hikmatCards'),
      (snap) => {
        if (!snap.empty) {
          const list: HikmatCard[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() } as HikmatCard));
          setHikmatCards(list);
        }
      },
      () => {}
    );

    const unsubAudio = onSnapshot(
      doc(db, 'settings', 'audioSanctuary'),
      (snap) => {
        if (snap.exists() && snap.data().tracks) {
          setAudioTracks(snap.data().tracks);
        }
      },
      () => {}
    );

    return () => {
      unsubReviews();
      unsubBundles();
      unsubHikmat();
      unsubAudio();
    };
  }, []);

  // CRUD Reviews
  const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<string> => {
    const newId = `rev-${Date.now()}`;
    const newReview: Review = {
      id: newId,
      ...reviewData,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
    try {
      const clean = cleanForCreate(newReview);
      await setDoc(doc(db, 'reviews', newId), clean);
    } catch (err) {
      console.warn('Could not save review to Firestore, saved locally:', err);
    }
    return newId;
  };

  const approveReview = async (id: string, approved: boolean): Promise<void> => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved } : r)));
    try {
      await updateDoc(doc(db, 'reviews', id), { approved });
    } catch (err) {
      console.warn('Could not update review status in Firestore, updated locally:', err);
    }
  };

  const deleteReview = async (id: string): Promise<void> => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (err) {
      console.warn('Could not delete review in Firestore, deleted locally:', err);
    }
  };

  // CRUD Bundles
  const addBundle = async (bundleData: Partial<CareBundle>): Promise<string> => {
    const newId = bundleData.id || `bundle-${Date.now()}`;
    const newBundle: CareBundle = {
      id: newId,
      slug: bundleData.slug || `bundle-${Date.now()}`,
      name: bundleData.name || 'Care Package',
      urduName: bundleData.urduName || '',
      subtitle: bundleData.subtitle || '',
      description: bundleData.description || '',
      image: bundleData.image || 'https://images.unsplash.com/photo-1608248597359-001091a13e2f?auto=format&fit=crop&q=80&w=800',
      productIds: bundleData.productIds || [],
      originalPrice: bundleData.originalPrice || 3500,
      bundlePrice: bundleData.bundlePrice || 2950,
      originalPriceUSD: bundleData.originalPriceUSD || 24,
      bundlePriceUSD: bundleData.bundlePriceUSD || 19,
      savingsPercentage: bundleData.savingsPercentage || 15,
      badge: bundleData.badge || 'Bachat Set',
      active: bundleData.active ?? true,
      featured: bundleData.featured ?? false,
    };
    setBundles((prev) => [newBundle, ...prev]);
    try {
      const clean = cleanForCreate(newBundle);
      await setDoc(doc(db, 'bundles', newId), clean);
    } catch (err) {
      console.warn('Could not save bundle to Firestore, saved locally:', err);
    }
    return newId;
  };

  const updateBundle = async (id: string, updates: Partial<CareBundle>): Promise<void> => {
    setBundles((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    try {
      const clean = cleanForCreate(updates);
      await updateDoc(doc(db, 'bundles', id), clean);
    } catch (err) {
      console.warn('Could not update bundle in Firestore, updated locally:', err);
    }
  };

  const deleteBundle = async (id: string): Promise<void> => {
    setBundles((prev) => prev.filter((b) => b.id !== id));
    try {
      await deleteDoc(doc(db, 'bundles', id));
    } catch (err) {
      console.warn('Could not delete bundle in Firestore, deleted locally:', err);
    }
  };

  // CRUD Hikmat Cards
  const addHikmatCard = async (cardData: Partial<HikmatCard>): Promise<string> => {
    const newId = cardData.id || `hikmat-${Date.now()}`;
    const newCard: HikmatCard = {
      id: newId,
      title: cardData.title || '',
      urduTitle: cardData.urduTitle || '',
      propheticReference: cardData.propheticReference || '',
      hadithText: cardData.hadithText || '',
      urduHadithText: cardData.urduHadithText || '',
      botanicalHerb: cardData.botanicalHerb || '',
      modernSignificance: cardData.modernSignificance || '',
      image: cardData.image || 'https://images.unsplash.com/photo-1608248597359-001091a13e2f?auto=format&fit=crop&q=80&w=800',
      relatedProductSlug: cardData.relatedProductSlug || '',
      active: cardData.active ?? true,
    };
    setHikmatCards((prev) => [newCard, ...prev]);
    try {
      const clean = cleanForCreate(newCard);
      await setDoc(doc(db, 'hikmatCards', newId), clean);
    } catch (err) {
      console.warn('Could not save hikmat card to Firestore, saved locally:', err);
    }
    return newId;
  };

  const updateHikmatCard = async (id: string, updates: Partial<HikmatCard>): Promise<void> => {
    setHikmatCards((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
    try {
      const clean = cleanForCreate(updates);
      await updateDoc(doc(db, 'hikmatCards', id), clean);
    } catch (err) {
      console.warn('Could not update hikmat card in Firestore, updated locally:', err);
    }
  };

  const deleteHikmatCard = async (id: string): Promise<void> => {
    setHikmatCards((prev) => prev.filter((h) => h.id !== id));
    try {
      await deleteDoc(doc(db, 'hikmatCards', id));
    } catch (err) {
      console.warn('Could not delete hikmat card in Firestore, deleted locally:', err);
    }
  };

  // Audio Tracks
  const updateAudioTracks = async (tracks: AudioTrack[]): Promise<void> => {
    setAudioTracks(tracks);
    try {
      await setDoc(doc(db, 'settings', 'audioSanctuary'), { tracks });
    } catch (err) {
      console.warn('Could not update audio sanctuary in Firestore, updated locally:', err);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories: categories.length > 0 ? categories : (DEFAULT_CATEGORIES as Category[]),
        promotions,
        orders,
        spiritualPosts,
        spiritualSettings,
        loading,
        featuredProducts,
        activePromotion,
        socialLinks,
        contactInfo,
        deliverySettings,
        updateDeliverySettings,
        paymentSettings,
        updatePaymentSettings,
        spinWheelSettings,
        updateSpinWheelSettings,
        hakeemBargainSettings,
        updateHakeemBargainSettings,
        developerSignatureSettings,
        updateDeveloperSignatureSettings,
        appointments,
        appointmentConfig,
        createAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        updateAppointmentConfig,
        refreshAppointments,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        activeCurrency,
        setActiveCurrency,
        language,
        setLanguage,
        t: translations[language],
        reviews,
        addReview,
        deleteReview,
        approveReview,
        bundles,
        addBundle,
        updateBundle,
        deleteBundle,
        botanicals,
        hikmatCards,
        addHikmatCard,
        updateHikmatCard,
        deleteHikmatCard,
        audioTracks,
        updateAudioTracks,
        quizConcerns,
        updateSocialLinks,
        updateContactInfo,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        toggleProductFeatured,
        toggleProductStatus,
        addCategory,
        updateCategory,
        deleteCategory,
        addPromotion,
        updatePromotion,
        deletePromotion,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        refreshOrders,
        addSpiritualPost,
        updateSpiritualPost,
        deleteSpiritualPost,
        updateSpiritualSettings,
        uploadProductImage,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
