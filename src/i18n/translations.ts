import { Language } from '../types';

export interface TranslationDictionary {
  // Navigation
  navHome: string;
  navAbout: string;
  navProducts: string;
  navBundles: string;
  navPhilosophy: string;
  navSpiritual: string;
  navJournal: string;
  navTrackOrder: string;
  navContact: string;

  // Header & Ribbon
  switchLanguage: string;
  currencySwitcher: string;
  cart: string;
  menu: string;
  close: string;

  // Hero Section
  heroBadge: string;
  heroHeading: string;
  heroSubheading: string;
  heroExploreBtn: string;
  heroConsultBtn: string;
  heroAboutBtn: string;

  // Trust Strip
  trustColdPressed: string;
  trustColdPressedSub: string;
  trustSunnah: string;
  trustSunnahSub: string;
  trustPurity: string;
  trustPuritySub: string;
  trustNationwide: string;
  trustNationwideSub: string;

  // Remedy Finder Banner
  remedyBannerTitle: string;
  remedyBannerSubtitle: string;
  remedyBannerBtn: string;

  // Products & Featured
  featuredTitle: string;
  featuredSubtitle: string;
  viewAllProducts: string;
  addToBag: string;
  addedToBag: string;
  viewDetails: string;
  inStock: string;
  outOfStock: string;
  specialOffer: string;
  volume: string;
  taxesIncluded: string;

  // Bundles
  bundlesBadge: string;
  bundlesTitle: string;
  bundlesSubtitle: string;
  bundleSavings: string;
  bundleIncludes: string;
  bundleAddSet: string;

  // Wisdom & Tibb
  wisdomBadge: string;
  wisdomTitle: string;
  wisdomSubtitle: string;
  exploreSpiritual: string;
  contemporaryInsight: string;
  viewFormula: string;

  // Herbarium
  herbariumBadge: string;
  herbariumTitle: string;
  herbariumSubtitle: string;
  filterAll: string;
  filterWarm: string;
  filterCooling: string;
  filterBalanced: string;
  temperament: string;
  traditionalMethod: string;

  // Reviews
  reviewsBadge: string;
  reviewsTitle: string;
  reviewsSubtitle: string;
  shareExperience: string;
  verifiedPatron: string;

  // Cart & Checkout
  cartTitle: string;
  cartEmpty: string;
  subtotal: string;
  deliveryFee: string;
  freeDelivery: string;
  grandTotal: string;
  proceedToCheckout: string;
  continueShopping: string;
  checkoutTitle: string;
  paymentMethod: string;
  paymentCod: string;
  paymentCodDesc: string;
  paymentBank: string;
  paymentBankDesc: string;
  paymentJazzCash: string;
  paymentJazzCashDesc: string;
  paymentEasyPaisa: string;
  paymentEasyPaisaDesc: string;
  onlineTransferNote: string;
  tidPlaceholder: string;
  copyAccount: string;
  copied: string;
  fullName: string;
  phoneWhatsApp: string;
  deliveryCity: string;
  completeAddress: string;
  orderNotes: string;
  confirmOrder: string;
  placingOrder: string;
  orderConfirmed: string;
  orderRefText: string;

  // Audio Sanctuary
  sanctuaryAudio: string;
  sanctuaryShifaPeace: string;
  selectRecitation: string;

  // Footer
  footerHeritage: string;
  footerQuickLinks: string;
  footerContactUs: string;
  footerRights: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    // Navigation
    navHome: 'Home',
    navAbout: 'About',
    navProducts: 'Products',
    navBundles: 'Care Bundles',
    navPhilosophy: 'Herbal Codex',
    navSpiritual: 'Spiritual Sanctuary',
    navJournal: 'Herbal Journal',
    navTrackOrder: 'Track Order',
    navContact: 'Contact',

    // Header & Ribbon
    switchLanguage: 'اردو',
    currencySwitcher: 'Currency',
    cart: 'Bag',
    menu: 'Menu',
    close: 'Close',

    // Hero Section
    heroBadge: '100% ARTISANAL BOTANICAL PREPARATIONS',
    heroHeading: 'Classical Herbal Care, Prepared for Everyday Vitality',
    heroSubheading: 'Rooted in Unani Tibb and prophetic traditions, crafted with cold-pressed native oils and time-honored apothecary care.',
    heroExploreBtn: 'Explore Apothecary',
    heroConsultBtn: 'Spiritual Sanctuary',
    heroAboutBtn: 'Our Heritage',

    // Trust Strip
    trustColdPressed: 'Pure Cold-Pressed',
    trustColdPressedSub: 'Wooden expeller extraction under 38°C',
    trustSunnah: 'Prophetic Ingredients',
    trustSunnahSub: 'Kalonji, Zaitoon, Sidr & Desi Amla',
    trustPurity: 'Zero Mineral Oils',
    trustPuritySub: 'No liquid paraffin or synthetic fragrances',
    trustNationwide: 'Fast Courier Dispatch',
    trustNationwideSub: 'Cash on delivery & instant online transfer',

    // Remedy Finder Banner
    remedyBannerTitle: 'Not sure which botanical formulation aligns with your need?',
    remedyBannerSubtitle: 'Take our 30-second Tibb & Sunnah assessment for personalized cold-pressed remedies and prophetic wazaif.',
    remedyBannerBtn: 'Launch Remedy Finder',

    // Products & Featured
    featuredTitle: 'Signature Apothecary Formulations',
    featuredSubtitle: 'Handcrafted in small, temperature-controlled batches for pristine herbal potency.',
    viewAllProducts: 'View All Preparations',
    addToBag: 'Add to Bag',
    addedToBag: 'Added to Bag',
    viewDetails: 'View Details',
    inStock: 'In Stock & Ready for Immediate Dispatch',
    outOfStock: 'Currently Out of Stock',
    specialOffer: 'Special Offer',
    volume: 'Volume',
    taxesIncluded: 'Taxes included',

    // Bundles
    bundlesBadge: 'Curated Bachat Packages',
    bundlesTitle: 'Holistic Care Bundles',
    bundlesSubtitle: 'Thoughtfully paired herbal preparations working in physiological harmony with privileged apothecary savings.',
    bundleSavings: 'Save',
    bundleIncludes: 'Included in this Regimen:',
    bundleAddSet: 'Add Set to Bag',

    // Wisdom & Tibb
    wisdomBadge: 'Tibb-e-Nabawi & Classical Wisdom',
    wisdomTitle: 'Prophetic Herbs & Holistic Healing',
    wisdomSubtitle: 'Authentic Sunnah citations harmonized with modern botanical pharmacology and cold-pressed purity.',
    exploreSpiritual: 'Explore Spiritual Sanctuary',
    contemporaryInsight: 'Contemporary Pharmacological Insight:',
    viewFormula: 'View Formula',

    // Herbarium
    herbariumBadge: 'Native Apothecary Herbarium',
    herbariumTitle: 'Indigenous Botanical Compendium',
    herbariumSubtitle: 'Explore raw botanical treasures sourced directly from Pakistan’s fertile soils, harvested at dawn.',
    filterAll: 'All Herbs',
    filterWarm: 'Warm & Dry (گرم)',
    filterCooling: 'Cooling (سرد)',
    filterBalanced: 'Balanced (معتدل)',
    temperament: 'Mizaj / Temperament',
    traditionalMethod: 'Traditional Technique:',

    // Reviews
    reviewsBadge: 'Customer Shifa Testimonials',
    reviewsTitle: 'Verified Patron Experiences',
    reviewsSubtitle: 'Authentic reflections from seekers who invited FARAABEE into their daily restorative regimens.',
    shareExperience: 'Share Your Experience',
    verifiedPatron: 'Verified Patron',

    // Cart & Checkout
    cartTitle: 'Your Botanical Bag',
    cartEmpty: 'Your bag is currently empty.',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    freeDelivery: 'Free Delivery',
    grandTotal: 'Grand Total',
    proceedToCheckout: 'Proceed to Checkout',
    continueShopping: 'Continue Exploring',
    checkoutTitle: 'Complete Your Order',
    paymentMethod: 'Select Payment Method',
    paymentCod: 'Cash on Delivery (COD)',
    paymentCodDesc: 'Pay with cash upon parcel delivery across Pakistan',
    paymentBank: 'Online Bank Transfer',
    paymentBankDesc: 'Direct transfer to Meezan Bank with instant confirmation',
    paymentJazzCash: 'JazzCash Wallet',
    paymentJazzCashDesc: 'Fast mobile payment via JazzCash app or till',
    paymentEasyPaisa: 'Easypaisa Wallet',
    paymentEasyPaisaDesc: 'Immediate online transfer via Easypaisa mobile app',
    onlineTransferNote: 'Account & Transfer Details:',
    tidPlaceholder: 'Enter 6–12 Digit Transaction ID / Reference (TID)',
    copyAccount: 'Copy',
    copied: 'Copied!',
    fullName: 'Full Name *',
    phoneWhatsApp: 'Phone / Mobile Number *',
    deliveryCity: 'City / Town *',
    completeAddress: 'Complete Delivery Address *',
    orderNotes: 'Special Instructions / Notes (Optional)',
    confirmOrder: 'Confirm & Place Order',
    placingOrder: 'Recording Order...',
    orderConfirmed: 'Alhamdulillah, Your Order is Confirmed',
    orderRefText: 'Your Order Reference ID:',

    // Audio Sanctuary
    sanctuaryAudio: 'Sanctuary Audio',
    sanctuaryShifaPeace: 'Quranic Shifa & Peace',
    selectRecitation: 'Select Recitation:',

    // Footer
    footerHeritage: 'FARAABEE is an artisanal botanical apothecary dedicated to restorative cold-pressed oils and classical herbal wellness.',
    footerQuickLinks: 'Explore Apothecary',
    footerContactUs: 'Concierge Desk',
    footerRights: 'All rights reserved. Formulated with pure botanical integrity.',
  },

  ur: {
    // Navigation
    navHome: 'صفحہ اول',
    navAbout: 'ہمارے متعلق',
    navProducts: 'تمام مصنوعات',
    navBundles: 'خصوصی بچت سیٹ',
    navPhilosophy: 'ہربل فلسفہ',
    navSpiritual: 'روحانی سکون',
    navJournal: 'ہربل جرنل',
    navTrackOrder: 'آرڈر ٹریک کریں',
    navContact: 'رابطہ',

    // Header & Ribbon
    switchLanguage: 'English',
    currencySwitcher: 'کرنسی',
    cart: 'تھیلا',
    menu: 'فہرست',
    close: 'بند کریں',

    // Hero Section
    heroBadge: '۱۰۰٪ خالص دستکاری نباتیاتی تیاری',
    heroHeading: 'کلاسیکی نباتیاتی نگہداشت، روزمرہ شفا و توانائی کے لیے',
    heroSubheading: 'طبِ یونانی اور طبِ نبوی کے اصولوں پر تیار کردہ، دیسی کولڈ پریسڈ تیل اور قدرتی اجزاء کا شاہکار۔',
    heroExploreBtn: 'مصنوعات ملاحظہ فرمائیں',
    heroConsultBtn: 'روحانی سکون گاہ',
    heroAboutBtn: 'ہماری تاریخ و روایت',

    // Trust Strip
    trustColdPressed: 'خالص کولڈ پریسڈ کشیدگی',
    trustColdPressedSub: 'لکڑی کے کوہلو پر ۳۸ ڈگری سے کم درجہ حرارت پر کشیدہ',
    trustSunnah: 'مبارک نبوی اجزاء',
    trustSunnahSub: 'کلونجی، زیتون، سدر بیری اور دیسی آملہ',
    trustPurity: 'منرل آئل سے بالکل پاک',
    trustPuritySub: 'کوئی کیمیکل، پیرافین یا مصنوعی خوشبو نہیں',
    trustNationwide: 'ملک گیر ایکسپریس ترسیل',
    trustNationwideSub: 'کیش آن ڈیلیوری اور آن لائن بینک ٹرانسفر کی سہولت',

    // Remedy Finder Banner
    remedyBannerTitle: 'کیا آپ اپنی ضرورت کے مطابق درست ہربل نسخے کے انتخاب میں رہنمائی چاہتے ہیں؟',
    remedyBannerSubtitle: 'ہمارا ۳۰ سیکنڈ کا طب و سنت اسیسمنٹ مکمل کریں اور اپنے لیے موزوں ترین تیل اور مسنون دعا معلوم کریں۔',
    remedyBannerBtn: 'رہنمائی کوئز شروع کریں',

    // Products & Featured
    featuredTitle: 'فارابی کی شاہکار نباتیاتی مصنوعات',
    featuredSubtitle: 'محدود لاٹس میں تیار کردہ قدرتی فارمولے تاکہ پودوں کی حیاتاتی تاثیر برقرار رہے۔',
    viewAllProducts: 'تمام نسخہ جات دیکھیں',
    addToBag: 'تھیلے میں شامل کریں',
    addedToBag: 'شامل کر دیا گیا',
    viewDetails: 'تفصیلات دیکھیں',
    inStock: 'اسٹاک میں دستیاب ہے · فوری روانگی',
    outOfStock: 'فی الوقت دستیاب نہیں',
    specialOffer: 'خصوصی پیشکش',
    volume: 'حجم',
    taxesIncluded: 'ٹیکس شامل ہے',

    // Bundles
    bundlesBadge: 'خصوصی بچت پیکجز',
    bundlesTitle: 'جامع شفا و نگہداشت پیکجز',
    bundlesSubtitle: 'ایک دوسرے کو تقویت دینے والے باہم مربوط نباتیاتی مرکبات، خصوصی رعایت کے ساتھ۔',
    bundleSavings: 'بچت',
    bundleIncludes: 'اس پیکج میں شامل ہیں:',
    bundleAddSet: 'مکمل سیٹ خریدیں',

    // Wisdom & Tibb
    wisdomBadge: 'طبِ نبوی ﷺ اور دائمی حکمت',
    wisdomTitle: 'مبارک نبوی نباتات اور کامل شفا',
    wisdomSubtitle: 'مستند احادیث مبارکہ کی روشنی میں جدید سائنس اور روایتی حکمت کا حسین امتزاج۔',
    exploreSpiritual: 'روحانی سکون گاہ دیکھیں',
    contemporaryInsight: 'جدید سائنسی و طبی تحقیق:',
    viewFormula: 'نسخہ دیکھیں',

    // Herbarium
    herbariumBadge: 'دیسی جڑی بوٹیوں کی نمائش',
    herbariumTitle: 'پاکستانی قدرتی نباتاتی انسائیکلوپیڈیا',
    herbariumSubtitle: 'پاکستان کے زرخیز خطوں سے صبح کے وقت حاصل کی جانے والی جڑی بوٹیوں کے مزاج اور فوائد۔',
    filterAll: 'تمام نباتات',
    filterWarm: 'گرم و خشک مزاج',
    filterCooling: 'سرد مزاج',
    filterBalanced: 'معتدل مزاج',
    temperament: 'مزاج / کیفیت',
    traditionalMethod: 'روایتی طریقہ کشیدگی:',

    // Reviews
    reviewsBadge: 'گاہکوں کی شفا کی تصدیق',
    reviewsTitle: 'اہلِ ذوق کے تاثرات و تجربات',
    reviewsSubtitle: 'ان احباب کے صادقانہ الفاظ جنہوں نے فارابی کے قدرتی تیلوں کو اپنے روزمرہ کا حصہ بنایا۔',
    shareExperience: 'اپنا تجربہ بیان کریں',
    verifiedPatron: 'تصدیق شدہ خریدار',

    // Cart & Checkout
    cartTitle: 'آپ کا شاپنگ بیگ',
    cartEmpty: 'آپ کا تھیلا فی الوقت خالی ہے۔',
    subtotal: 'ذیلی کل',
    deliveryFee: 'ڈلیوری چارجز',
    freeDelivery: 'مفت ڈلیوری',
    grandTotal: 'کل رقم',
    proceedToCheckout: 'آرڈر مکمل کرنے کے لیے آگے بڑھیں',
    continueShopping: 'مزید مصنوعات دیکھیں',
    checkoutTitle: 'آرڈر مکمل فرمائیں',
    paymentMethod: 'طریقہ ادائیگی منتخب کریں',
    paymentCod: 'کیش آن ڈیلیوری (COD)',
    paymentCodDesc: 'پارسل موصول ہونے پر نقدی ادا فرمائیں',
    paymentBank: 'آن لائن بینک ٹرانسفر',
    paymentBankDesc: 'میزان بینک میں براہ راست رقوم کی منتقلی',
    paymentJazzCash: 'جاز کیش (JazzCash)',
    paymentJazzCashDesc: 'جاز کیش موبائل اکاؤنٹ کے ذریعے فوری ادائیگی',
    paymentEasyPaisa: 'ایزی پیسہ (Easypaisa)',
    paymentEasyPaisaDesc: 'ایزی پیسہ اکاؤنٹ سے فوری رقم ارسال کریں',
    onlineTransferNote: 'بینک و والٹ اکاؤنٹ کی تفصیلات:',
    tidPlaceholder: 'ٹرانزیکشن آئی ڈی (TID) یا حوالہ نمبر درج کریں',
    copyAccount: 'کاپی',
    copied: 'کاپی ہو گیا!',
    fullName: 'پورا نام *',
    phoneWhatsApp: 'فون / موبائل نمبر *',
    deliveryCity: 'شہر / بستی *',
    completeAddress: 'گھر کا مکمل پتہ *',
    orderNotes: 'کوئی خصوصی ہدایت یا نوٹ (اختیاری)',
    confirmOrder: 'آرڈر کنفرم کریں',
    placingOrder: 'آرڈر محفوظ ہو رہا ہے...',
    orderConfirmed: 'الحمد للہ، آپ کا آرڈر درج ہو گیا ہے',
    orderRefText: 'آپ کا آرڈر حوالہ نمبر:',

    // Audio Sanctuary
    sanctuaryAudio: 'روحانی ترنم',
    sanctuaryShifaPeace: 'قرآنی شفا و سکونِ قلب',
    selectRecitation: 'تلاوت کا انتخاب فرمائیں:',

    // Footer
    footerHeritage: 'فارابی کلاسیکی نباتیاتی نگہداشت اور کولڈ پریسڈ دیسی تیلوں کا ایک باوقار روایتی مرکز ہے۔',
    footerQuickLinks: 'اہم لنکس',
    footerContactUs: 'رابطہ و مشاورت',
    footerRights: 'تمام حقوق محفوظ ہیں۔ خالص قدرتی امانت کے ساتھ تیار کردہ۔',
  },
};
