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
    defaultTitle: 'KMIT | كربونات الكالسيوم الصناعية - جدة',
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
    coatingWithLevel: 'معالجة بـ{agent} {min}-{max}%',
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
    'oil-gas': 'سوائل الحفر - النفط والغاز',
    rubber: 'المطاط واللدائن',
    paper: 'الورق والكرتون',
  },

  packaging: {
    'paper-valve-bag-25kg': 'أكياس ورقية صمامية 25 كجم على منصات ملفوفة',
    'jumbo-bag': 'أكياس جامبو 1000-1250 كجم ببطانة داخلية',
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

  standards: {
    'iso-9001': 'ISO 9001',
    'iso-14001': 'ISO 14001',
    'iso-45001': 'ISO 45001',
    saso: 'SASO',
    reach: 'REACH',
    rohs: 'RoHS',
  },

  standardScopes: {
    'iso-9001': 'إدارة الجودة',
    'iso-14001': 'الإدارة البيئية',
    'iso-45001': 'السلامة والصحة المهنية',
    saso: 'مطابقة الهيئة السعودية للمواصفات والمقاييس والجودة',
    reach: 'مطابقة لائحة REACH الأوروبية',
    rohs: 'خلوّ من المواد الخطرة المقيّدة',
  },

  documents: {
    tds: 'ورقة البيانات الفنية (TDS)',
    msds: 'صحيفة بيانات السلامة (MSDS/SDS)',
    coa: 'شهادة التحليل (COA)',
  },

  documentDescriptions: {
    tds: 'الخصائص الكيميائية والفيزيائية النموذجية للدرجة مع طرق الاختبار المعتمدة.',
    msds: 'بيانات المناولة والتخزين والنقل والاستجابة للطوارئ.',
    coa: 'القيم الفعلية المقيسة لكل دفعة إنتاج، تُصدر مع الشحنة.',
  },

  processSteps: {
    feed: 'المادة الخام',
    milling: 'الطحن',
    classification: 'التصنيف',
    'surface-treatment': 'المعالجة السطحية',
    'quality-control': 'ضبط الجودة',
    packaging: 'التعبئة',
  },

  processStepDetails: {
    feed: 'حجر جيري ورخام عالي النقاء.',
    milling: 'طحن ميكانيكي دقيق يحدد النطاق الخشن والمتوسط من 200 إلى 500 مش.',
    classification: 'تصنيف هوائي يضبط متوسط حجم الجسيمات حتى 2500 مش، أي D50 يبلغ 1.8 ميكرون.',
    'surface-treatment': 'معالجة بحمض الستياريك بنسبة 0.8% إلى 1.2% للدرجات الميكرونية.',
    'quality-control': 'اختبار النقاء والبياض والرطوبة وامتصاص الزيت وفق طرق ISO المعلنة.',
    packaging: 'أكياس صمامية 25 كجم، أو أكياس جامبو، أو صهاريج سائبة.',
  },

  faqQuestions: {
    'gcc-vs-pcc': 'ما الفرق بين GCC وPCC؟',
    'why-coated': 'لماذا تُعالج كربونات الكالسيوم بحمض الستياريك؟',
    'choose-grade': 'كيف أختار الدرجة المناسبة لتطبيقي؟',
    'storage-shelf-life': 'كيف تُخزّن المادة وما عمرها الافتراضي؟',
  },

  faqAnswers: {
    'gcc-vs-pcc':
      'تُنتج كربونات الكالسيوم المطحونة (GCC) بالطحن الميكانيكي الدقيق لصخور الحجر الجيري والرخام عالي النقاء، وتتميز بالاستقرار الكيميائي وارتفاع درجة البياض وانخفاض الشوائب. أما المترسبة (PCC) فتُنتج كيميائياً عبر إعادة كربنة الجير المطفأ، وهو ما يتيح تحكماً دقيقاً في شكل البلورات وحجم الجسيمات ضمن النطاق دون الميكروني.',
    'why-coated':
      'تجعل المعالجة بحمض الستياريك سطح الجسيم كارهاً للماء. النتيجة على خط الإنتاج: تشتّت أفضل في البوليمرات، وامتصاص أقل للرطوبة، وإنتاجية أعلى في البثق، وتآكل أقل للماكينة. نسبة المعالجة مضبوطة بين 0.8% و1.2%.',
    'choose-grade':
      'ابدأ من التطبيق ثم اقرأ متطلب حجم الجسيمات. الدرجات الخشنة من 200 إلى 400 مش لمواد البناء وطين الحفر وغراء السيراميك، و800 مش لأنابيب PVC والكابلات والدهانات المائية، و1250 و2500 مش المعالجتان لماستر باتش الحشو وأفلام PE والطلاءات الدقيقة.',
    'storage-shelf-life':
      'يُحفظ المنتج في مستودع بارد وجاف وجيد التهوية، على منصات، بعيداً عن أشعة الشمس المباشرة ورطوبة الجو. العمر الافتراضي 24 شهراً للدرجات غير المعالجة و12 شهراً للدرجات المعالجة سطحياً.',
  },

  contactChannels: {
    phone: 'الهاتف',
    whatsapp: 'واتساب',
    email: 'البريد الإلكتروني',
    location: 'الموقع',
  },

  sections: {
    certificationsHeading: 'المعايير والمطابقة',
    certificationsIntro:
      'تُدار عمليات الجودة والبيئة والسلامة وفق معايير ISO المعتمدة، مع مطابقة المواصفات السعودية واللوائح الأوروبية.',
    certificationsColumnStandard: 'المعيار',
    certificationsColumnScope: 'النطاق',
    certificationsColumnCertificate: 'رقم الشهادة',
    certificatePending: 'قيد التوثيق',

    packagingHeading: 'التعبئة والتخزين',
    packagingIntro:
      'ثلاثة أشكال تعبئة تغطي الاستلام اليدوي والرافعات والتفريغ الهوائي المباشر.',
    storageHeading: 'شروط التخزين',
    storageBody:
      'مستودع بارد وجاف وجيد التهوية، على منصات، بعيداً عن أشعة الشمس المباشرة والرطوبة.',
    shelfLifeUncoated: '24 شهراً للدرجات غير المعالجة',
    shelfLifeCoated: '12 شهراً للدرجات المعالجة سطحياً',

    processHeading: 'من المادة الخام إلى الشحنة',
    processIntro:
      'ست مراحل يمر بها المنتج. كل مرحلة تحدد خاصية معلنة في ورقة البيانات الفنية: المش، وD50، ونسبة المعالجة، وقيم الاختبار.',

    logisticsHeading: 'التغطية والتوريد',
    logisticsIntro: 'انطلاقاً من جدة إلى المملكة ودول مجلس التعاون الخليجي.',
    logisticsHqLabel: 'المقر',
    logisticsMarketsLabel: 'الأسواق',
    logisticsLeadTimePending: 'أزمنة التوريد لكل مدينة قيد التوثيق.',

    documentsHeading: 'الوثائق الفنية',
    documentsIntro:
      'ثلاث وثائق مضبوطة لكل درجة. تُصدر شهادة التحليل مع كل دفعة إنتاج بالقيم الفعلية المقيسة.',
    documentRequest: 'اطلب الوثيقة',
    documentOnRequest: 'تُرسل عند الطلب',

    faqHeading: 'أسئلة فنية متكررة',
    faqIntro: 'إجابات مباشرة على ما يسأل عنه مهندسو الصياغة ومسؤولو المشتريات قبل طلب العينة.',

    contactHeading: 'تواصل معنا',
    contactIntro: 'للاستفسارات الفنية وطلبات التسعير.',
    contactPending: 'بيانات التواصل قيد التوثيق.',

    rfqTeaserHeading: 'اطلب عرض سعر بمواصفة محددة',
    rfqTeaserBody:
      'حدد الدرجة والكمية والتطبيق وجهة الوصول، ويصلك العرض ومعه البيانات الفنية للدرجة المطلوبة.',

    applicationGradesLabel: 'الدرجات الموصى بها',
    applicationViewSector: 'تفاصيل القطاع',

    gradeMatrixFilterLabel: 'تصفية حسب المعالجة السطحية',
    gradeMatrixFilterAll: 'الكل',
    gradeMatrixShowing: 'يُعرض {count} من {total} درجة',
    gradeMatrixEmpty: 'لا توجد درجة مطابقة لهذه التصفية.',
    gradeMatrixReset: 'إلغاء التصفية',
    gradeMatrixScrollHint: 'مرّر أفقياً لعرض بقية الأعمدة',
  },

  ui: {
    close: 'إغلاق',
    dismiss: 'إخفاء',
    loading: 'جارٍ التحميل',
    expand: 'توسيع',
    collapse: 'طي',
    openMenu: 'فتح القائمة',
    closeMenu: 'إغلاق القائمة',
    sortAscending: 'ترتيب تصاعدي',
    sortDescending: 'ترتيب تنازلي',
    sortNone: 'بدون ترتيب',
    previousPage: 'الصفحة السابقة',
    nextPage: 'الصفحة التالية',
    pagination: 'ترقيم الصفحات',
    pageStatus: 'صفحة {page} من {total}',
    breadcrumb: 'مسار التنقل',
    required: 'مطلوب',
    optional: 'اختياري',
    chooseFile: 'اختر ملفاً',
    noFileChosen: 'لم يُختر ملف',
    infoLabel: 'معلومة',
    successLabel: 'تم',
    warningLabel: 'تنبيه',
    dangerLabel: 'خطأ',
  },

  footer: {
    headquarters: 'المقر الرئيسي: جدة، المملكة العربية السعودية',
    marketsServed: 'الأسواق المخدومة: المملكة ودول مجلس التعاون الخليجي',
    complianceHeading: 'المعايير',
    navHeading: 'الموقع',
    productsHeading: 'الدرجات',
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
