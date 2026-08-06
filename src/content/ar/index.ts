import type { Content } from '../schema';

/**
 * Arabic content — the primary locale.
 *
 * Register: Modern Standard Arabic, technical, procurement- and
 * formulation-facing. Gulf industry terminology. The English technical term is
 * kept in parentheses on first mention, because that is how the specification
 * is actually written on a Saudi purchase order.
 *
 * Grade codes, units, test-method identifiers and numerals stay Latin in both
 * locales — GCC-1250 is GCC-1250 on an Arabic page.
 *
 * Every factual claim traces to docs/technical-data.md. Nothing here asserts a
 * capacity, a lead time, a certificate number or a client name.
 */
export const ar = {
  meta: {
    siteName: 'KMIT',
    tagline: 'حلول صناعية',
    defaultTitle: 'KMIT | كربونات الكالسيوم الصناعية — جدة',
    defaultDescription:
      'مورّد سعودي لكربونات الكالسيوم المطحونة والمعالجة سطحياً، من 200 إلى 2500 مش، بنقاء ≥ 98.5% وبيانات فنية منشورة لكل درجة.',
    localeName: 'العربية',
    otherLocaleName: 'English',
  },

  a11y: {
    skipToContent: 'تخطَّ إلى المحتوى الرئيسي',
    primaryNavigation: 'التنقل الرئيسي',
    localeSwitcher: 'تبديل اللغة',
    switchToOtherLocale: 'التبديل إلى الإنجليزية',
    mainContent: 'المحتوى الرئيسي',
    footerLandmark: 'تذييل الصفحة',
  },

  nav: {
    home: 'الرئيسية',
    products: 'المنتجات',
    applications: 'التطبيقات',
    quality: 'الجودة والمطابقة',
    resources: 'الوثائق الفنية',
    contact: 'تواصل معنا',
    rfq: 'اطلب عرض سعر',
  },

  home: {
    title: 'مورّد كربونات الكالسيوم في السعودية | KMIT',
    description:
      'درجات كربونات كالسيوم من 200 إلى 2500 مش، مطحونة ومعالجة سطحياً، مع قيم D50 والنقاء والبياض وطرق الاختبار لكل درجة.',
    h1: 'كربونات كالسيوم صناعية بمواصفات معلنة، من جدة',
    answerFirst:
      'تورّد KMIT كربونات الكالسيوم المطحونة (GCC) والمعالجة سطحياً من جدة إلى مصانع البلاستيك والدهانات ومواد البناء وسوائل الحفر في المملكة ودول مجلس التعاون الخليجي. تمتد الدرجات من 200 مش إلى 2500 مش، أي متوسط حجم جسيمات (D50) من 55 ميكرون نزولاً إلى 1.8 ميكرون، بنقاء لا يقل عن 98.5% ودرجة بياض بين 95.0% و98.5% وفق ISO 3262-1 وISO 2470.',
    gradesHeading: 'مصفوفة الدرجات وتوزيع حجم الجسيمات',
    gradesIntro:
      'اختر الدرجة بمقاس المش أو بمتوسط حجم الجسيمات (D50). الدرجات الميكرونية معالجة بحمض الستياريك لتحسين التشتّت في البوليمرات وخفض امتصاص الرطوبة.',
    propertiesHeading: 'الخصائص الكيميائية والفيزيائية النموذجية',
    propertiesIntro:
      'القيم أدناه نموذجية لعائلة المنتج، وكل قيمة مقترنة بطريقة الاختبار المعتمدة في تحديدها.',
    ctaRfq: 'اطلب عرض سعر',
    ctaProducts: 'تصفّح الدرجات',
  },

  grades: {
    caption:
      'مصفوفة درجات كربونات الكالسيوم: المش، ومتوسط حجم الجسيمات، والمعالجة السطحية، والتطبيقات',
    columnCode: 'رمز الدرجة',
    columnMesh: 'المش',
    columnD50: 'D50',
    columnCoating: 'المعالجة السطحية',
    columnApplications: 'التطبيقات الأساسية',
    coated: 'معالجة سطحياً',
    uncoated: 'غير معالجة',
    coatingWithLevel: 'معالجة بـ{agent} {min}–{max}%',
    shelfLife: 'العمر الافتراضي {months} شهراً',
  },

  properties: {
    caption: 'الخصائص الكيميائية والفيزيائية النموذجية لكربونات الكالسيوم مع طرق الاختبار',
    columnParameter: 'المعيار',
    columnValue: 'القيمة النموذجية',
    columnMethod: 'طريقة الاختبار',
    familyLevelNote:
      'هذه القيم على مستوى عائلة المنتج. تُصدر شهادة تحليل (COA) لكل دفعة إنتاج بالقيم الفعلية.',
  },

  parameters: {
    'caco3-purity': 'نقاء كربونات الكالسيوم',
    whiteness: 'درجة البياض (R457)',
    fe2o3: 'أكسيد الحديد Fe₂O₃',
    sio2: 'أكسيد السيليكون SiO₂',
    mgo: 'أكسيد المغنيسيوم MgO',
    moisture: 'الرطوبة عند 105 °م',
    ph: 'الرقم الهيدروجيني pH',
    'bulk-density': 'الكثافة الظاهرية',
    'oil-absorption': 'امتصاص الزيت (DOP)',
    'mohs-hardness': 'صلادة موس',
  },

  applications: {
    construction: 'مواد البناء',
    'drilling-muds': 'طين الحفر',
    asphalt: 'الأسفلت',
    'tile-adhesives': 'غراء السيراميك',
    'basic-paints': 'الدهانات الأساسية',
    rubber: 'المطاط',
    'pvc-pipes': 'أنابيب PVC',
    cables: 'مركّبات الكابلات',
    'emulsion-paints': 'الدهانات المائية',
    'pvc-fittings': 'وصلات PVC',
    masterbatch: 'ماستر باتش الحشو',
    'pe-films': 'أفلام PE',
    'high-end-masterbatch': 'ماستر باتش عالي الجودة',
    'fine-coatings': 'الطلاءات الدقيقة',
  },

  sectors: {
    plastics: 'البلاستيك والماسترباتش',
    'paints-construction': 'الدهانات والطلاءات ومواد البناء',
    'oil-gas': 'سوائل الحفر — النفط والغاز',
    rubber: 'المطاط واللدائن',
    paper: 'الورق والكرتون',
  },

  packaging: {
    'paper-valve-bag-25kg': 'أكياس ورقية صمامية 25 كجم على منصات ملفوفة',
    'jumbo-bag': 'أكياس جامبو 1000–1250 كجم ببطانة داخلية',
    'bulk-tanker': 'صهاريج صومعية سائبة بتفريغ هوائي',
  },

  coatingAgents: {
    'stearic-acid': 'حمض الستياريك',
  },

  units: {
    micron: 'ميكرون',
    mesh: 'مش',
    months: 'شهر',
    percent: '%',
  },

  footer: {
    headquarters: 'المقر الرئيسي: جدة، المملكة العربية السعودية',
    marketsServed: 'الأسواق المخدومة: المملكة ودول مجلس التعاون الخليجي',
    compliance: 'ISO 9001 · ISO 14001 · ISO 45001 · SASO · REACH · RoHS',
    dataProvenance:
      'القيم الفنية المنشورة قيم نموذجية مقترنة بطرق اختبارها. تُرفق شهادة تحليل (COA) مع كل دفعة إنتاج.',
    rights: '© {year} KMIT. جميع الحقوق محفوظة.',
  },

  styleguide: {
    title: 'دليل النظام البصري | KMIT',
    description: 'صفحة داخلية لعرض توكنز التصميم والمكوّنات الأساسية. غير مفهرسة.',
    h1: 'دليل النظام البصري',
    intro:
      'صفحة داخلية غير مفهرسة. تُبنى بالكامل في المرحلة الثانية لعرض التوكنز والمكوّنات في الاتجاهين.',
  },

  notFound: {
    title: 'الصفحة غير موجودة | KMIT',
    h1: 'الصفحة غير موجودة',
    body: 'الرابط الذي طلبته غير متاح. تحقّق من العنوان أو ابدأ من الصفحة الرئيسية.',
    backHome: 'العودة إلى الصفحة الرئيسية',
  },
} satisfies Content;

export default ar;
