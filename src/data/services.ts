import type { Localized } from '../i18n'

const L = (fr: string, ar: string, en: string): Localized => ({ fr, ar, en })

export const CATEGORIES = ['maintenance', 'brakes', 'diagnostics', 'aircon', 'tyres', 'bodywork', 'detailing', 'polishing'] as const
export type Category = (typeof CATEGORIES)[number]

export interface Service {
  id: string
  category: Category
  title: Localized
  text: Localized
  /** Indicative starting price in MAD; null = "sur devis" (quote only). */
  priceFrom: number | null
  /** Indicative duration. */
  duration: Localized
}

export interface CategoryInfo {
  id: Category
  image: string
  imageAlt: Localized
  title: Localized
  short: Localized
  intro: Localized
}

export const categories: CategoryInfo[] = [
  {
    id: 'maintenance',
    image: 'mecano',
    imageAlt: L('Un mécanicien contrôle le compartiment moteur, capot ouvert', 'ميكانيكي يفحص حجرة المحرك والغطاء مفتوح', 'A mechanic checks the engine bay with the bonnet open'),
    title: L('Entretien & vidange', 'الصيانة وتغيير الزيت', 'Servicing & oil change'),
    short: L('Vidange, filtres, révision', 'تغيير الزيت، الفلاتر، المراجعة', 'Oil, filters, service'),
    intro: L(
      'L’entretien courant selon le carnet de votre véhicule : huile adaptée, filtres, niveaux et points de contrôle.',
      'الصيانة الدورية حسب دفتر سيارتك: زيت مناسب، فلاتر، مستويات ونقاط مراقبة.',
      'Routine servicing following your vehicle’s schedule: the right oil, filters, fluid levels and checkpoints.',
    ),
  },
  {
    id: 'brakes',
    image: 'cle',
    imageAlt: L('Mains d’un mécanicien serrant une pièce avec une clé', 'يدا ميكانيكي تشدّان قطعة بمفتاح', 'A mechanic’s hands tightening a part with a wrench'),
    title: L('Freinage', 'الفرامل', 'Brakes'),
    short: L('Plaquettes, disques, liquide', 'الأقراص، الوسادات، السائل', 'Pads, discs, fluid'),
    intro: L(
      'Contrôle de l’usure, remplacement des plaquettes et disques, purge du liquide de frein.',
      'فحص التآكل، تغيير الوسادات والأقراص، وتجديد سائل الفرامل.',
      'Wear check, pad and disc replacement, brake fluid bleed.',
    ),
  },
  {
    id: 'diagnostics',
    image: 'compteur',
    imageAlt: L('Compte-tours éclairé d’un tableau de bord dans la pénombre', 'عداد دورات مضيء في لوحة القيادة', 'An illuminated rev counter on a dashboard in low light'),
    title: L('Diagnostic électronique', 'التشخيص الإلكتروني', 'Electronic diagnostics'),
    short: L('Voyants, valise, batterie', 'الأضواء التحذيرية، جهاز التشخيص، البطارية', 'Warning lights, scan tool, battery'),
    intro: L(
      'Lecture des codes défaut à la valise, recherche de panne et explication claire avant toute intervention.',
      'قراءة رموز الأعطال بجهاز التشخيص، البحث عن العطل وشرح واضح قبل أي تدخل.',
      'Fault codes read with a scan tool, fault finding and a clear explanation before any work.',
    ),
  },
  {
    id: 'aircon',
    image: 'moteur',
    imageAlt: L('Courroies et poulies d’un moteur, dont le compresseur de climatisation', 'أحزمة وبكرات محرك من بينها ضاغط التكييف', 'Engine belts and pulleys, including the air-con compressor'),
    title: L('Climatisation', 'التكييف', 'Air conditioning'),
    short: L('Recharge, fuite, désinfection', 'الشحن، التسرب، التعقيم', 'Recharge, leaks, cleaning'),
    intro: L(
      'Recharge du circuit, recherche de fuite et désinfection pour retrouver un air frais et sain.',
      'شحن الدائرة، البحث عن التسرب والتعقيم لاستعادة هواء بارد ونقي.',
      'System recharge, leak search and disinfection for cool, clean air again.',
    ),
  },
  {
    id: 'tyres',
    image: 'pneus',
    imageAlt: L('Pile de pneus dans un atelier', 'كومة إطارات في ورشة', 'A stack of tyres in a workshop'),
    title: L('Pneus', 'الإطارات', 'Tyres'),
    short: L('Montage, équilibrage, géométrie', 'التركيب، الموازنة، ضبط الزوايا', 'Fitting, balancing, alignment'),
    intro: L(
      'Montage et équilibrage, réparation de crevaison, contrôle et réglage de la géométrie.',
      'تركيب وموازنة، إصلاح الثقب، فحص وضبط زوايا العجلات.',
      'Fitting and balancing, puncture repair, alignment check and adjustment.',
    ),
  },
  {
    id: 'bodywork',
    image: 'carrosserie',
    imageAlt: L('Mains travaillant sur une pièce de carrosserie orange', 'يدان تعملان على قطعة هيكل برتقالية', 'Hands working on an orange body panel'),
    title: L('Carrosserie', 'هيكل السيارة', 'Bodywork'),
    short: L('Bosses, rayures, pare-chocs', 'الانبعاجات، الخدوش، الصدامات', 'Dents, scratches, bumpers'),
    intro: L(
      'Petites bosses, rayures et pare-chocs abîmés : on évalue sur photo ou sur place, puis on chiffre.',
      'انبعاجات صغيرة، خدوش وصدامات متضررة: نقيّم من الصورة أو في الورشة ثم نقدّم التقدير.',
      'Small dents, scratches and damaged bumpers: assessed from a photo or on site, then quoted.',
    ),
  },
  {
    id: 'detailing',
    image: 'lavage',
    imageAlt: L('Voiture noire couverte de mousse pendant un lavage à la main', 'سيارة سوداء مغطاة بالرغوة أثناء غسل يدوي', 'A black car covered in foam during a hand wash'),
    title: L('Detailing intérieur / extérieur', 'التنظيف التفصيلي الداخلي / الخارجي', 'Interior / exterior detailing'),
    short: L('Lavage main, habitacle, moteur', 'غسل يدوي، المقصورة، المحرك', 'Hand wash, cabin, engine bay'),
    intro: L(
      'Lavage à la main, nettoyage en profondeur de l’habitacle et des sièges, compartiment moteur.',
      'غسل يدوي، تنظيف عميق للمقصورة والمقاعد، وحجرة المحرك.',
      'Hand wash, deep cleaning of the cabin and seats, engine bay.',
    ),
  },
  {
    id: 'polishing',
    image: 'brillance',
    imageAlt: L('Silhouette brillante d’une berline noire dans l’obscurité', 'ظل لامع لسيارة سوداء في الظلام', 'Glossy silhouette of a black saloon in the dark'),
    title: L('Polissage & céramique', 'التلميع والسيراميك', 'Polishing & ceramic'),
    short: L('Polish, protection, optiques', 'التلميع، الحماية، المصابيح', 'Polish, protection, headlights'),
    intro: L(
      'Correction des micro-rayures, protection céramique et rénovation des optiques jaunies.',
      'إزالة الخدوش الدقيقة، حماية سيراميكية وتجديد المصابيح المصفرّة.',
      'Swirl correction, ceramic protection and restoration of yellowed headlights.',
    ),
  },
]

const S = (id: string, category: Category, title: Localized, text: Localized, priceFrom: number | null, duration: Localized): Service => ({
  id,
  category,
  title,
  text,
  priceFrom,
  duration,
})

const H1 = L('≈ 1 h', '≈ ساعة', '≈ 1 h')
const H2 = L('≈ 2 h', '≈ ساعتان', '≈ 2 h')
const HALF = L('≈ ½ journée', '≈ نصف يوم', '≈ ½ day')
const DAY = L('1 jour ou plus', 'يوم أو أكثر', '1 day or more')
const AFTER = L('Après diagnostic', 'بعد التشخيص', 'After diagnosis')

export const services: Service[] = [
  S('oil-change', 'maintenance', L('Vidange + filtre à huile', 'تغيير الزيت + فلتر الزيت', 'Oil + oil filter change'), L('Huile adaptée aux préconisations du véhicule, contrôle des niveaux.', 'زيت مناسب لتوصيات السيارة، مع فحص المستويات.', 'Oil matching the vehicle’s specs, fluid levels checked.'), 350, H1),
  S('service', 'maintenance', L('Révision complète', 'مراجعة شاملة', 'Full service'), L('Points de contrôle du carnet, filtres, niveaux, rapport détaillé.', 'نقاط المراقبة حسب الدفتر، الفلاتر، المستويات، وتقرير مفصل.', 'Schedule checkpoints, filters, fluids, detailed report.'), null, HALF),
  S('filters', 'maintenance', L('Filtres air / habitacle / carburant', 'فلاتر الهواء / المقصورة / الوقود', 'Air / cabin / fuel filters'), L('Remplacement selon l’usure constatée.', 'تغيير حسب التآكل الملاحظ.', 'Replaced according to observed wear.'), 150, H1),
  S('timing-belt', 'maintenance', L('Kit de distribution', 'طقم التوزيع', 'Timing belt kit'), L('Courroie, galets et pompe à eau selon le moteur.', 'الحزام والبكرات ومضخة الماء حسب المحرك.', 'Belt, rollers and water pump depending on the engine.'), null, DAY),

  S('brake-pads', 'brakes', L('Plaquettes de frein (par essieu)', 'وسادات الفرامل (لكل محور)', 'Brake pads (per axle)'), L('Remplacement et contrôle des étriers.', 'تغيير مع فحص الملاقط.', 'Replacement and caliper check.'), 300, H1),
  S('brake-discs', 'brakes', L('Disques + plaquettes', 'الأقراص + الوسادات', 'Discs + pads'), L('Quand les disques sont sous la cote minimale.', 'عندما تكون الأقراص تحت السمك الأدنى.', 'When discs are below minimum thickness.'), null, H2),
  S('brake-fluid', 'brakes', L('Purge du liquide de frein', 'تجديد سائل الفرامل', 'Brake fluid bleed'), L('Liquide neuf et purge du circuit.', 'سائل جديد وتفريغ الدائرة.', 'Fresh fluid and system bleed.'), 200, H1),

  S('obd-scan', 'diagnostics', L('Lecture des codes défaut', 'قراءة رموز الأعطال', 'Fault code reading'), L('Branchement valise et lecture commentée des défauts.', 'ربط جهاز التشخيص وشرح الأعطال.', 'Scan tool connected, faults explained.'), 200, L('≈ 30 min', '≈ 30 دقيقة', '≈ 30 min')),
  S('warning-light', 'diagnostics', L('Voyant allumé : recherche de panne', 'ضوء تحذيري: البحث عن العطل', 'Warning light: fault finding'), L('Tests complémentaires pour trouver l’origine exacte.', 'اختبارات إضافية لإيجاد السبب الدقيق.', 'Further tests to find the exact cause.'), null, AFTER),
  S('battery', 'diagnostics', L('Test batterie & charge', 'اختبار البطارية والشحن', 'Battery & charging test'), L('Batterie, alternateur et démarreur.', 'البطارية والمولد والمحرك الكهربائي للتشغيل.', 'Battery, alternator and starter.'), 100, L('≈ 30 min', '≈ 30 دقيقة', '≈ 30 min')),

  S('ac-recharge', 'aircon', L('Recharge climatisation', 'شحن المكيف', 'Air-con recharge'), L('Contrôle d’étanchéité puis recharge du gaz.', 'فحص الإحكام ثم شحن الغاز.', 'Leak test then gas recharge.'), 350, H1),
  S('ac-leak', 'aircon', L('Recherche de fuite', 'البحث عن التسرب', 'Leak detection'), L('Traceur et contrôle des raccords.', 'مادة كاشفة وفحص الوصلات.', 'Tracer dye and fittings check.'), null, AFTER),
  S('ac-clean', 'aircon', L('Désinfection du circuit', 'تعقيم الدائرة', 'System disinfection'), L('Contre les mauvaises odeurs, avec filtre habitacle.', 'ضد الروائح الكريهة، مع فلتر المقصورة.', 'Against bad smells, with cabin filter.'), 200, H1),

  S('tyre-fit', 'tyres', L('Montage + équilibrage (par pneu)', 'التركيب + الموازنة (لكل إطار)', 'Fitting + balancing (per tyre)'), L('Pneus fournis par vos soins ou commandés sur devis.', 'إطارات تحضرها أنت أو تُطلب حسب التقدير.', 'Your own tyres, or ordered on quote.'), 50, L('≈ 15 min / pneu', '≈ 15 دقيقة / إطار', '≈ 15 min / tyre')),
  S('alignment', 'tyres', L('Géométrie / parallélisme', 'ضبط الزوايا / التوازي', 'Wheel alignment'), L('Contrôle et réglage du train avant.', 'فحص وضبط المحور الأمامي.', 'Front axle check and adjustment.'), 200, H1),
  S('puncture', 'tyres', L('Réparation de crevaison', 'إصلاح الثقب', 'Puncture repair'), L('Si la zone et l’état du pneu le permettent.', 'إذا سمح موضع الثقب وحالة الإطار.', 'If the location and tyre condition allow it.'), 50, L('≈ 30 min', '≈ 30 دقيقة', '≈ 30 min')),

  S('dents', 'bodywork', L('Débosselage', 'إصلاح الانبعاجات', 'Dent removal'), L('Petites bosses, selon accès et peinture.', 'انبعاجات صغيرة حسب الوصول وحالة الطلاء.', 'Small dents, depending on access and paint.'), null, AFTER),
  S('scratches', 'bodywork', L('Retouche de rayures', 'إصلاح الخدوش', 'Scratch repair'), L('Évaluation sur photo, puis devis.', 'تقييم من الصورة ثم تقدير.', 'Assessed from a photo, then quoted.'), null, AFTER),
  S('bumper', 'bodywork', L('Réparation pare-chocs', 'إصلاح الصدّام', 'Bumper repair'), L('Fissures, fixations, remise en peinture.', 'الشقوق، التثبيت، إعادة الطلاء.', 'Cracks, mountings, repainting.'), null, DAY),

  S('interior', 'detailing', L('Nettoyage intérieur complet', 'تنظيف داخلي شامل', 'Full interior clean'), L('Aspiration, sièges, plastiques, vitres.', 'شفط، مقاعد، بلاستيك، زجاج.', 'Vacuum, seats, plastics, windows.'), 400, HALF),
  S('exterior', 'detailing', L('Lavage extérieur détaillé', 'غسل خارجي مفصل', 'Detailed exterior wash'), L('Prélavage mousse, lavage main, jantes, séchage.', 'رغوة أولية، غسل يدوي، الجنوط، تجفيف.', 'Snow foam, hand wash, wheels, drying.'), 250, H2),
  S('engine-bay', 'detailing', L('Nettoyage compartiment moteur', 'تنظيف حجرة المحرك', 'Engine bay clean'), L('Dégraissage maîtrisé et protection des plastiques.', 'إزالة الشحوم بعناية وحماية البلاستيك.', 'Careful degreasing and plastic dressing.'), 200, H1),

  S('polish', 'polishing', L('Polissage 1 étape', 'تلميع بمرحلة واحدة', 'One-step polish'), L('Ravive la brillance, atténue les micro-rayures.', 'يعيد اللمعان ويخفف الخدوش الدقيقة.', 'Restores gloss, reduces swirl marks.'), 900, DAY),
  S('ceramic', 'polishing', L('Protection céramique', 'حماية سيراميكية', 'Ceramic coating'), L('Après préparation de la peinture ; durée selon produit et entretien.', 'بعد تحضير الطلاء؛ المدة حسب المنتج والعناية.', 'After paint prep; lifespan depends on product and care.'), null, L('1 à 2 jours', 'يوم إلى يومين', '1 to 2 days')),
  S('headlights', 'polishing', L('Rénovation des optiques', 'تجديد المصابيح الأمامية', 'Headlight restoration'), L('Ponçage, polish et vernis de protection.', 'صنفرة وتلميع وطبقة حماية.', 'Sanding, polish and protective coat.'), 250, H2),
]

export const PACKS = ['essential', 'comfort', 'premium'] as const
export type PackId = (typeof PACKS)[number]

export interface Pack {
  id: PackId
  /** Service id used in the quote form. */
  serviceId: string
  priceFrom: number | null
  duration: Localized
  /** Feature keys from the comparison table that this pack includes. */
  features: PackFeature[]
  highlight?: boolean
}

export const PACK_FEATURES = ['foamWash', 'wheels', 'vacuum', 'plastics', 'windows', 'seats', 'decon', 'polish', 'protection', 'engineBay'] as const
export type PackFeature = (typeof PACK_FEATURES)[number]

export const packs: Pack[] = [
  { id: 'essential', serviceId: 'pack-essential', priceFrom: 350, duration: H2, features: ['foamWash', 'wheels', 'vacuum', 'plastics', 'windows'] },
  {
    id: 'comfort',
    serviceId: 'pack-comfort',
    priceFrom: 750,
    duration: HALF,
    features: ['foamWash', 'wheels', 'vacuum', 'plastics', 'windows', 'seats', 'decon', 'engineBay'],
    highlight: true,
  },
  { id: 'premium', serviceId: 'pack-premium', priceFrom: null, duration: L('1 à 2 jours', 'يوم إلى يومين', '1 to 2 days'), features: [...PACK_FEATURES] },
]

export const GALLERY_CATS = ['mechanics', 'tyres', 'bodywork', 'detailing'] as const
export type GalleryCat = (typeof GALLERY_CATS)[number]

export interface Work {
  id: string
  category: GalleryCat
  image: string
  alt: Localized
  title: Localized
  /** Shown with the before/after simulation slider. */
  beforeAfter?: boolean
}

export const works: Work[] = [
  { id: 'gloss', category: 'detailing', image: 'brillance', alt: categories[7].imageAlt, title: L('Brillance retrouvée après polissage', 'لمعان مستعاد بعد التلميع', 'Gloss restored after polishing'), beforeAfter: true },
  { id: 'foam', category: 'detailing', image: 'lavage', alt: categories[6].imageAlt, title: L('Lavage main, prélavage mousse', 'غسل يدوي مع رغوة أولية', 'Hand wash with snow foam'), beforeAfter: true },
  { id: 'engine', category: 'mechanics', image: 'mecano2', alt: L('Mécanicien ganté travaillant sur un moteur', 'ميكانيكي بقفازات يعمل على محرك', 'Gloved mechanic working on an engine'), title: L('Remplacement de pièces moteur', 'تغيير قطع المحرك', 'Engine parts replacement') },
  { id: 'belts', category: 'mechanics', image: 'moteur', alt: categories[3].imageAlt, title: L('Contrôle courroies & clim', 'فحص الأحزمة والتكييف', 'Belts & air-con check'), beforeAfter: true },
  { id: 'service', category: 'mechanics', image: 'mecano', alt: categories[0].imageAlt, title: L('Révision capot ouvert', 'مراجعة والغطاء مفتوح', 'Service with the bonnet up') },
  { id: 'tyres', category: 'tyres', image: 'pneus', alt: categories[4].imageAlt, title: L('Montage et équilibrage', 'التركيب والموازنة', 'Fitting and balancing') },
  { id: 'body', category: 'bodywork', image: 'carrosserie', alt: categories[5].imageAlt, title: L('Préparation carrosserie', 'تحضير الهيكل', 'Body prep') },
  { id: 'tools', category: 'mechanics', image: 'outils', alt: L('Mur d’outils dans un atelier mécanique', 'جدار أدوات في ورشة ميكانيك', 'A wall of tools in a mechanic’s workshop'), title: L('L’atelier, prêt à intervenir', 'الورشة جاهزة للعمل', 'The workshop, ready to go') },
  { id: 'bench', category: 'mechanics', image: 'atelier', alt: L('Établi et clés suspendues dans un atelier', 'طاولة عمل ومفاتيح معلقة في ورشة', 'A workbench and hanging wrenches in a workshop'), title: L('Outillage rangé, travail propre', 'أدوات مرتبة وعمل نظيف', 'Tidy tools, clean work') },
  { id: 'dash', category: 'mechanics', image: 'compteur', alt: categories[2].imageAlt, title: L('Diagnostic et essai routier', 'تشخيص واختبار على الطريق', 'Diagnosis and road test') },
]

export const findService = (id: string | null | undefined) => services.find((s) => s.id === id)
export const findPack = (id: string | null | undefined) => packs.find((p) => p.id === id || p.serviceId === id)
export const findCategory = (id: string | null | undefined) => categories.find((c) => c.id === id)
export const isCategory = (v: string | null | undefined): v is Category => CATEGORIES.includes(v as Category)
export const isGalleryCat = (v: string | null | undefined): v is GalleryCat => GALLERY_CATS.includes(v as GalleryCat)

export const imageSrc = (name: string, w: 640 | 1200 = 640) => `/images/${name}-${w}.webp`
export const imageSrcSet = (name: string) => `/images/${name}-640.webp 640w, /images/${name}-1200.webp 1200w`
