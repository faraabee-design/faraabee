import { SiteTheme, SiteCopyContent, ThemePreset } from '../types/customization';

export const DEFAULT_THEME: SiteTheme = {
  primaryColor: '#183F32',
  secondaryColor: '#285844',
  accentColor: '#AFC7A5',
  accentLightColor: '#E3EBDD',
  backgroundColor: '#FAF9F3',
  surfaceColor: '#FFFFFF',
  textColor: '#26312B',
  headerBgColor: '#FAF9F3',
  headerTextColor: '#183F32',
  footerBgColor: '#183F32',
  footerTextColor: '#FAF9F3',
  buttonBgColor: '#183F32',
  buttonTextColor: '#FFFFFF',
  bannerBgColor: '#183F32',
  bannerTextColor: '#FAF9F3',
  fontHeading: 'Cormorant Garamond',
  fontBody: 'Plus Jakarta Sans',
  borderRadius: 'rounded-2xl',
};

export const DEFAULT_CONTENT: SiteCopyContent = {
  announcementText: {
    text: '',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-xs',
    fontWeight: 'font-medium',
    color: '#FAF9F3',
  },

  heroBadge: {
    text: '100% ARTISANAL BOTANICAL PREPARATIONS',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-xs',
    fontWeight: 'font-bold',
    color: '#285844',
  },
  heroHeading: {
    text: 'Classical Herbal Care, Prepared for Everyday Vitality',
    fontFamily: 'Cormorant Garamond',
    fontSize: 'text-4xl sm:text-6xl',
    fontWeight: 'font-normal',
    color: '#183F32',
  },
  heroUrduHeading: {
    text: 'روایت سے وابستہ، خالص ہربل تیاری',
    fontFamily: 'Amiri',
    fontSize: 'text-2xl sm:text-3xl',
    fontWeight: 'font-normal',
    color: '#285844',
  },
  heroSubtitle: {
    text: 'Thoughtfully formulated oils, healing balms, and slow-macerated herbal drops inspired by classical Unani and botanical traditions. Made with pure carrier oils, dried whole herbs, and quiet daily patience in Pakistan.',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-base sm:text-lg',
    fontWeight: 'font-normal',
    color: '#26312B',
  },
  heroBtnPrimary: {
    text: 'Explore Formulations',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-xs sm:text-sm',
    fontWeight: 'font-bold',
    color: '#FFFFFF',
  },
  heroBtnSecondary: {
    text: 'Our Herbal Philosophy',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-xs sm:text-sm',
    fontWeight: 'font-bold',
    color: '#183F32',
  },

  trustItem1Title: {
    text: 'Slow Botanical Infusion',
    fontFamily: 'Cormorant Garamond',
    fontSize: 'text-base',
    fontWeight: 'font-bold',
    color: '#183F32',
  },
  trustItem1Desc: {
    text: 'Macerated gently over weeks, preserving the subtle vitality of every whole herb.',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-xs',
    fontWeight: 'font-normal',
    color: '#26312B',
  },
  trustItem2Title: {
    text: 'Pure Plant Carriers',
    fontFamily: 'Cormorant Garamond',
    fontSize: 'text-base',
    fontWeight: 'font-bold',
    color: '#183F32',
  },
  trustItem2Desc: {
    text: 'Cold-pressed extra virgin olive, sesame, and almond base oils without mineral oil fillers.',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-xs',
    fontWeight: 'font-normal',
    color: '#26312B',
  },
  trustItem3Title: {
    text: 'Apothecary Freshness',
    fontFamily: 'Cormorant Garamond',
    fontSize: 'text-base',
    fontWeight: 'font-bold',
    color: '#183F32',
  },
  trustItem3Desc: {
    text: 'Small, unhurried batches formulated to preserve bio-active freshness and scent.',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-xs',
    fontWeight: 'font-normal',
    color: '#26312B',
  },
  trustItem4Title: {
    text: 'Direct From Gujranwala',
    fontFamily: 'Cormorant Garamond',
    fontSize: 'text-base',
    fontWeight: 'font-bold',
    color: '#183F32',
  },
  trustItem4Desc: {
    text: 'Formulated and dispatched with care directly from our atelier across Pakistan.',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-xs',
    fontWeight: 'font-normal',
    color: '#26312B',
  },

  featuredBadge: {
    text: 'SELECTED APOTHECARY EDITIONS',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-xs',
    fontWeight: 'font-bold',
    color: '#285844',
  },
  featuredHeading: {
    text: 'Essential Herbal Preparations',
    fontFamily: 'Cormorant Garamond',
    fontSize: 'text-3xl sm:text-4xl',
    fontWeight: 'font-medium',
    color: '#183F32',
  },
  featuredSubtitle: {
    text: 'Time-tested botanical formulas handcrafted for hair wellness, skin nourishment, and holistic calm.',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-sm',
    fontWeight: 'font-normal',
    color: '#26312B',
  },

  whyFarabiBadge: {
    text: 'OUR BOTANICAL ROOTS',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-xs',
    fontWeight: 'font-bold',
    color: '#285844',
  },
  whyFarabiHeading: {
    text: 'Crafted with Ancient Wisdom, Grounded in Everyday Care',
    fontFamily: 'Cormorant Garamond',
    fontSize: 'text-3xl sm:text-5xl',
    fontWeight: 'font-medium',
    color: '#183F32',
  },
  whyFarabiParagraph1: {
    text: 'At FARAABEE, we look back to the classical apothecary tradition—where remedies were created slowly, using whole roots, aromatic seeds, and unrefined oils chosen for their wholesome affinity with the human body.',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-sm sm:text-base',
    fontWeight: 'font-normal',
    color: '#26312B',
  },
  whyFarabiParagraph2: {
    text: 'Every drop represents our promise: no synthetic fragrances, no harsh mineral petroleum, and no hurried commercial shortcuts. Only genuine herbal nutrition that speaks to tradition.',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-sm sm:text-base',
    fontWeight: 'font-normal',
    color: '#26312B',
  },

  storyBadge: {
    text: 'HERITAGE & CRAFTSMANSHIP',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-xs',
    fontWeight: 'font-bold',
    color: '#285844',
  },
  storyHeading: {
    text: 'The Art of Slow Botanical Maceration',
    fontFamily: 'Cormorant Garamond',
    fontSize: 'text-3xl sm:text-4xl',
    fontWeight: 'font-medium',
    color: '#183F32',
  },
  storyParagraph1: {
    text: 'Unlike modern industrial mass-production that extracts with harsh chemical solvents, our formulas undergo prolonged sun-steeping and gentle warm maceration. Whole cloves, amla, shikakai, and black seed yield their protective oils naturally over 21 days.',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-sm',
    fontWeight: 'font-normal',
    color: '#26312B',
  },
  storyParagraph2: {
    text: 'The result is a therapeutic viscosity, deep botanical aroma, and bio-available nourishment you feel from the very first application.',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-sm',
    fontWeight: 'font-normal',
    color: '#26312B',
  },
  storyQuote: {
    text: '"In the quiet preparation of natural roots lies the true medicine of well-being."',
    fontFamily: 'Cormorant Garamond',
    fontSize: 'text-lg sm:text-xl',
    fontWeight: 'font-medium',
    color: '#183F32',
  },

  journalBadge: {
    text: 'APOTHECARY ESSAYS & KNOWLEDGE',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-xs',
    fontWeight: 'font-bold',
    color: '#285844',
  },
  journalHeading: {
    text: 'From the Herbalist Desk',
    fontFamily: 'Cormorant Garamond',
    fontSize: 'text-3xl sm:text-4xl',
    fontWeight: 'font-medium',
    color: '#183F32',
  },
  journalSubtitle: {
    text: 'Guides on seasonal oiling, classical plant profiles, and daily restorative herbal rituals.',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-sm',
    fontWeight: 'font-normal',
    color: '#26312B',
  },

  footerBrandBio: {
    text: 'FARAABEE crafts thoughtful herbal wellness products inspired by classical botanical traditions. Pure carrier oils, whole herbs, and quiet daily care.',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-xs sm:text-sm',
    fontWeight: 'font-normal',
    color: '#FAF9F3',
  },
  footerUrduTagline: {
    text: 'روایت، خالص تیاری اور جدید دیکھ بھال',
    fontFamily: 'Amiri',
    fontSize: 'text-sm',
    fontWeight: 'font-medium',
    color: '#AFC7A5',
  },
  footerDisclaimer: {
    text: 'Disclaimer: Traditional herbal preparations. Statements have not been evaluated by regulatory agencies. Not intended to diagnose, treat, or cure any medical condition.',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'text-[11px]',
    fontWeight: 'font-normal',
    color: '#AFC7A5',
  },
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'farabi-classic',
    name: 'Farabi Imperial Botanical (Default)',
    description: 'Deep forest green, warm ivory, and soothing sage accents.',
    theme: {
      primaryColor: '#183F32',
      secondaryColor: '#285844',
      accentColor: '#AFC7A5',
      accentLightColor: '#E3EBDD',
      backgroundColor: '#FAF9F3',
      surfaceColor: '#FFFFFF',
      textColor: '#26312B',
      headerBgColor: '#FAF9F3',
      headerTextColor: '#183F32',
      footerBgColor: '#183F32',
      footerTextColor: '#FAF9F3',
      buttonBgColor: '#183F32',
      buttonTextColor: '#FFFFFF',
      bannerBgColor: '#183F32',
      bannerTextColor: '#FAF9F3',
      fontHeading: 'Cormorant Garamond',
      fontBody: 'Plus Jakarta Sans',
    },
  },
  {
    id: 'royal-sandalwood',
    name: 'Royal Sandalwood & Amber',
    description: 'Warm terracotta, rich cedar, and glowing golden tones.',
    theme: {
      primaryColor: '#5C3826',
      secondaryColor: '#8C5338',
      accentColor: '#D8A066',
      accentLightColor: '#F5E4D3',
      backgroundColor: '#FAF6F0',
      surfaceColor: '#FFFFFF',
      textColor: '#3A271D',
      headerBgColor: '#FAF6F0',
      headerTextColor: '#5C3826',
      footerBgColor: '#3A271D',
      footerTextColor: '#FAF6F0',
      buttonBgColor: '#5C3826',
      buttonTextColor: '#FFFFFF',
      bannerBgColor: '#5C3826',
      bannerTextColor: '#FAF6F0',
      fontHeading: 'Cinzel',
      fontBody: 'Lora',
    },
  },
  {
    id: 'rose-apothecary',
    name: 'Rose & Saffron Luxury',
    description: 'Burgundy wine, saffron gold, and blush parchment.',
    theme: {
      primaryColor: '#541A28',
      secondaryColor: '#7A283C',
      accentColor: '#D99B6A',
      accentLightColor: '#F8EAEF',
      backgroundColor: '#FDF7F8',
      surfaceColor: '#FFFFFF',
      textColor: '#33151D',
      headerBgColor: '#FDF7F8',
      headerTextColor: '#541A28',
      footerBgColor: '#33151D',
      footerTextColor: '#FDF7F8',
      buttonBgColor: '#541A28',
      buttonTextColor: '#FFFFFF',
      bannerBgColor: '#541A28',
      bannerTextColor: '#FDF7F8',
      fontHeading: 'Playfair Display',
      fontBody: 'Plus Jakarta Sans',
    },
  },
  {
    id: 'minimal-sage',
    name: 'Earthy Olive & Sage Herbalist',
    description: 'Muted olive, eucalyptus cream, and soft mineral gray.',
    theme: {
      primaryColor: '#2D3A2F',
      secondaryColor: '#455948',
      accentColor: '#8CA086',
      accentLightColor: '#E2EBE0',
      backgroundColor: '#F7FAF7',
      surfaceColor: '#FFFFFF',
      textColor: '#242B25',
      headerBgColor: '#F7FAF7',
      headerTextColor: '#2D3A2F',
      footerBgColor: '#242B25',
      footerTextColor: '#F7FAF7',
      buttonBgColor: '#2D3A2F',
      buttonTextColor: '#FFFFFF',
      bannerBgColor: '#2D3A2F',
      bannerTextColor: '#F7FAF7',
      fontHeading: 'Lora',
      fontBody: 'Inter',
    },
  },
  {
    id: 'midnight-botanical',
    name: 'Midnight Gold & Oud',
    description: 'Deep obsidian navy, antique gold foil, and crisp white surfaces.',
    theme: {
      primaryColor: '#121C24',
      secondaryColor: '#1E2C38',
      accentColor: '#C29B48',
      accentLightColor: '#EBE2CD',
      backgroundColor: '#F7F8FA',
      surfaceColor: '#FFFFFF',
      textColor: '#1A232A',
      headerBgColor: '#F7F8FA',
      headerTextColor: '#121C24',
      footerBgColor: '#0E161C',
      footerTextColor: '#F7F8FA',
      buttonBgColor: '#C29B48',
      buttonTextColor: '#FFFFFF',
      bannerBgColor: '#121C24',
      bannerTextColor: '#C29B48',
      fontHeading: 'Cinzel',
      fontBody: 'Montserrat',
    },
  },
];

export const AVAILABLE_FONTS = [
  { name: 'Cormorant Garamond', label: 'Cormorant Garamond (Classical Elegance, Serif)' },
  { name: 'Playfair Display', label: 'Playfair Display (Luxury Editorial, Serif)' },
  { name: 'Cinzel', label: 'Cinzel (Classical Roman Apothecary, Serif)' },
  { name: 'Lora', label: 'Lora (Literary Warmth, Serif)' },
  { name: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Modern Clean, Sans-Serif)' },
  { name: 'Inter', label: 'Inter (Contemporary Crisp, Sans-Serif)' },
  { name: 'Montserrat', label: 'Montserrat (Geometric Architectural, Sans-Serif)' },
  { name: 'Amiri', label: 'Amiri (Classic Arabic / Urdu Calligraphy)' },
  { name: 'Noto Nastaliq Urdu', label: 'Noto Nastaliq Urdu (Traditional Urdu Nasta\'liq)' },
];

export const FONT_SIZES = [
  { value: 'text-xs', label: 'Extra Small (12px)' },
  { value: 'text-sm', label: 'Small (14px)' },
  { value: 'text-base', label: 'Medium (16px)' },
  { value: 'text-lg', label: 'Large (18px)' },
  { value: 'text-xl', label: 'Extra Large (20px)' },
  { value: 'text-2xl', label: 'Heading 3 (24px)' },
  { value: 'text-3xl', label: 'Heading 2 (30px)' },
  { value: 'text-4xl', label: 'Heading 1 (36px)' },
  { value: 'text-5xl', label: 'Hero Display (48px)' },
  { value: 'text-6xl', label: 'Grand Display (60px)' },
];

export const FONT_WEIGHTS = [
  { value: 'font-light', label: 'Light (300)' },
  { value: 'font-normal', label: 'Regular (400)' },
  { value: 'font-medium', label: 'Medium (500)' },
  { value: 'font-semibold', label: 'Semibold (600)' },
  { value: 'font-bold', label: 'Bold (700)' },
  { value: 'font-extrabold', label: 'Extra Bold (800)' },
];

export const PRESET_COLORS = [
  '#183F32', // Farabi Primary Green
  '#285844', // Forest Secondary
  '#AFC7A5', // Soft Sage
  '#E3EBDD', // Pale Celadon
  '#FAF9F3', // Warm Ivory Cream
  '#26312B', // Deep Charcoal
  '#5C3826', // Sandalwood Terracotta
  '#8C5338', // Warm Cinnamon
  '#D8A066', // Amber Gold
  '#541A28', // Royal Wine / Rose
  '#D99B6A', // Saffron Gold
  '#121C24', // Midnight Navy
  '#C29B48', // Antique Gold Foil
  '#000000', // Pure Black
  '#FFFFFF', // Pure White
];
