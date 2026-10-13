import { SpiritualPost, SpiritualSettings } from '../types';

export const fallbackSpiritualSettings: SpiritualSettings = {
  badge: 'FARAABEE SPIRITUAL SANCTUARY • روحانی حکمت و شفا',
  title: 'Spiritual Sanctuary & Botanical Wisdom',
  subtitle:
    'A contemplative sanctuary dedicated to spiritual wellbeing, heart serenity, prophetic botanicals (Tibb-e-Nabawi), and holistic healing for soul, mind, and body.',
  headerQuote: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
  headerQuoteTranslation: 'Unquestionably, by the remembrance of Allah do hearts find rest. (Surah Ar-Ra’d 13:28)',
  contactButtonText: 'Consult on Spiritual Formulations',
  consultationText:
    'Seeking personalized guidance on prophetic herbs, spiritual wellness, or restorative botanical regimens? Connect directly with our apothecary concierge.',
};

export const fallbackSpiritualPosts: SpiritualPost[] = [
  {
    id: 'sacred-sidr-lote-tree',
    title: 'The Sacred Sidr (Lote Tree): Purification of Mind & Heart',
    subtitle: 'Ancient leaves for inner calm, spiritual cleansing, and restorative sleep',
    category: 'Prophetic Botanicals',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    arabicQuote: 'فِي سِدْرٍ مَّخْضُودٍ',
    quoteTranslation: 'Among thornless lote trees (Surah Al-Waqi’ah 56:28)',
    description: `The Sidr (Ziziphus spina-christi / Lote Tree) holds an exceptional station in Islamic spiritual history and traditional botanical care. Mentioned repeatedly in the Holy Quran, its leaves have been used for centuries to prepare purifying warm infusions, soothing spiritual bath washes (Ruqyah baths), and balms that dissipate mental agitation and heaviness.

In traditional Eastern apothecary wisdom, when an individual feels weighed down by emotional unrest, sleepless restlessness, or spiritual fatigue, Sidr leaves are infused in water accompanied by heartfelt prayer. The aroma and bitter saponin compounds work synergistically to ground nervous tension and bring clarity to the chest.`,
    contactPrompt: 'Inquire About Pure Sidr Preparations',
    relatedProductSlug: 'faraabee-sacred-sidr-bath-infusion',
    featured: true,
    active: true,
    displayOrder: 1,
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'blessed-olive-black-seed',
    title: 'The Blessed Olive & Black Seed: Fortifying the Body as a Temple',
    subtitle: 'Nourishing the soul through the sacred olive tree and Habbat al-Barakah',
    category: 'Sacred Remedies',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80',
    arabicQuote: 'يُوقَدُ مِن شَجَرَةٍۢ مُّبَـٰرَكَةٍۢ زَيْتُونَةٍۢ',
    quoteTranslation: 'Lit from a blessed olive tree, neither of the east nor of the west (Surah An-Nur 24:35)',
    description: `Prophetic tradition describes the olive tree as Mubarakah (blessed) and the black seed (Nigella Sativa / Kalonji) as a remedy rich in barakah for every ailment except death itself.

Beyond physical nutrition, these oils possess an inherent spiritual sanctity. Massaging pure cold-pressed extra-virgin olive oil into the crown of the head and over tired joints dispels fatigue, restores deep circulation, and honors the physical body as an entrusted sanctuary (Amanah). When combined with slow, contemplative breathing and remembrance, it anchors the believer in tranquility.`,
    contactPrompt: 'Consult on Blessed Oil Blends',
    relatedProductSlug: 'faraabee-black-seed-elixir',
    featured: true,
    active: true,
    displayOrder: 2,
    createdAt: '2026-10-02T12:00:00Z',
  },
  {
    id: 'rose-frankincense-heart-serenity',
    title: 'Damascus Rose & Pure Luban: Aromatic Paths to Spiritual Tranquility',
    subtitle: 'Elevating contemplation and clearing melancholy with sacred scents',
    category: 'Heart & Mindfulness',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80',
    arabicQuote: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    quoteTranslation: 'Unquestionably, by the remembrance of Allah do hearts find rest (Surah Ar-Ra’d 13:28)',
    description: `The sacred aroma of steam-distilled Damascus Rose water (Gulab) and resinous tears of Frankincense (Luban / Boswellia) have graced prayer chambers, courtyards, and sanctuaries for over a millennium.

Traditional physicians observed that fine natural aromatics act directly on the Ruh (vital spirit), lightening melancholy, softening irritability, and awakening devotion during night prayers (Tahajjud) and meditation. A single drop of authentic floral dew upon the palms can transform the atmosphere of a room and still a racing mind.`,
    contactPrompt: 'Inquire About Floral Dews & Frankincense',
    relatedProductSlug: 'faraabee-damascus-rose-mist',
    featured: false,
    active: true,
    displayOrder: 3,
    createdAt: '2026-10-03T14:30:00Z',
  },
  {
    id: 'wild-honey-herbal-vitality',
    title: 'Forest Honey & Bitter Herbs: Balance, Gratitude & Physical Vitality',
    subtitle: 'Honoring natural provisions as divinely ordained vessels of healing',
    category: 'Holistic Living',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80',
    arabicQuote: 'فِيهِ شِفَاءٌ لِّلنَّاسِ',
    quoteTranslation: 'Wherein is healing for humankind (Surah An-Nahl 16:69)',
    description: `In the philosophy of FARAABEE Apothecary, true healing acknowledges that human beings are multifaceted: physical strength sustains spiritual duty, while a tranquil soul invigorates the immune constitution.

Raw mountain honey, steeped with warming ginger, sweet fennel, and mountain herbs, represents a covenant of gratitude with nature. When consumed mindfully with intention (Niyyah), every spoonful becomes an act of wholesome sustenance and conscious living.`,
    contactPrompt: 'Ask About Mountain Honey Infusions',
    relatedProductSlug: 'faraabee-herbal-honey-infusion',
    featured: false,
    active: true,
    displayOrder: 4,
    createdAt: '2026-10-04T09:15:00Z',
  },
];
