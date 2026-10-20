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

export interface SecurityAlert {
  id: string;
  targetEmail: string;
  failedAttempts: number;
  timestamp: string;
  localTime: string;
  device: string;
  userAgent: string;
  platform: string;
  screen: string;
  status: 'dispatched' | 'pending';
  sourceUrl: string;
  read?: boolean;
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
