# CONTENT-TODO — المحتوى المطلوب من العميل / Content required from the client

> **بالعربية أولًا، ثم الإنجليزية.** كل بند هنا مساحة محجوزة في الموقع لم يُوضع فيها
> أي رقم أو اسم مخترع (القسم 4). أرسل القيمة، أو قل «لا ينطبق» ونحذف المساحة.
>
> **Arabic first, then English.** Every item here is a reserved space in the site.
> Nothing was invented to fill it (§4). Send the value, or say "not applicable"
> and the space comes out.

---

## كيف تقرأ هذا الملف / How to read this

| العمود | المعنى |
|---|---|
| **الموضع** | الملف والسطر الذي يحمل التعليق `TODO-CONTENT` |
| **ما يظهر الآن** | ما يراه الزائر اليوم في هذه المساحة |
| **المطلوب** | البيانات التي تملأ المساحة |

كل موضع في الكود مُعلَّم بـ `TODO-CONTENT` ويمكن العثور عليها كلها بـ:

```bash
grep -rn "TODO-CONTENT" src/
```

---

## 1. سنة التأسيس والمحطات / Founding year and milestones

- **الموضع:** `src/lib/site.ts` (`SITE.founded`) · `src/app/[lang]/about/page.tsx`
- **ما يظهر الآن:** كتلة `PlaceholderBlock` مصممة في صفحة «عن المجموعة»، مع سطر يوضح
  أن المحطات بانتظار الاعتماد. لا تظهر أي سنة.
- **المطلوب:** سنة التأسيس، وقائمة المحطات (سنة + سطر واحد لكل محطة) بالعربية
  والإنجليزية.

> Founding year and the milestone list (year + one line each, in both languages).
> Until then the About page shows a designed placeholder and states no year.

---

## 2. الجملة التعريفية القصيرة / Tagline

- **الموضع:** `src/lib/site.ts` (`SITE.taglineAr`, `SITE.taglineEn`)
- **ما يظهر الآن:** لا شيء. الهيرو يستخدم العنوان المعتمد في القسم 8.1، وهو جملة
  حقيقية لا شعار، فلم تُخترع جملة لملء الفراغ.
- **المطلوب:** جملة تعريفية بحد أقصى خمس كلمات، بالعربية والإنجليزية، **إن أردتموها**.
  الموقع كامل بدونها.

> A tagline of five words or fewer in each language, **if you want one**. The site
> is complete without it.

---

## 3. أسماء الاعتمادات والشهادات / Certification and accreditation names

- **الموضع:** `src/app/[lang]/quality-hse/page.tsx`
- **ما يظهر الآن:** كتلة `PlaceholderBlock` أسفل صفحة الجودة والسلامة والبيئة.
- **المطلوب:** أسماء الشهادات السارية فقط (ISO / SASO / غيرها)، مع رقم الشهادة وجهة
  الإصدار وتاريخ السريان. **لن يُنشر أي اسم شهادة بلا هذه البيانات.**

> Only certifications actually held, each with its number, issuing body and validity
> date. No certification name will be published without them.

---

## 4. أرقام الأثر البيئي والاستهلاك / Environmental impact and consumption figures

- **الموضع:** `src/app/[lang]/sustainability/page.tsx`
- **ما يظهر الآن:** كتلة `PlaceholderBlock` أسفل صفحة الاستدامة.
- **المطلوب:** أي رقم مقيس فعليًا: استهلاك الطاقة، استهلاك الماء، نسبة الطاقة
  المتجددة، المساحة المعاد تأهيلها. مع سنة القياس وطريقته.

> Any genuinely measured figure — energy use, water use, renewable share, land
> rehabilitated — with the year and the method of measurement.

---

> **تغيّر في النطاق:** حُذفت صفحتا الوظائف والتواصل ونماذجهما بالكامل، فسقطت معها
> ثلاثة بنود كانت هنا: قائمة الوظائف المفتوحة، وعنوان استقبال النماذج، ومساحة رفع
> الملفات. التواصل صار عبر البريد والجوال مباشرة من الفوتر وقسم الوجود.
>
> **Scope change:** the careers and contact pages and their forms were removed, so
> three items that used to be listed here are gone with them — the vacancy list, a
> form endpoint, and file storage. Contact is now a direct mailto: and tel: from
> the footer and the presence section.

---

## 5. الصور الفوتوغرافية / Photography

- **الموضع:** `src/components/sections/WhyMaterial.tsx` (خلية الصورة الكبيرة في شبكة
  «لماذا تهمّ هذه المادة»)
- **ما يظهر الآن:** سطح مادة مولَّد بالكامل بـ CSS، داخل الإطار المزدوج. لا توجد صورة
  مخزنية لمصنع شركة أخرى.
- **المطلوب:** صور حقيقية من مواقع كميت: المحجر، المطحنة، المختبر، التعبئة، النقل.
  بدقة لا تقل عن 2000px على الضلع الأطول.
- **ملاحظة تقنية:** الصور تُعالَج تلقائيًا بـ `grayscale` و`mix-blend-mode: luminosity`
  حتى لا تُدخل أي لون خارج الهوية (القسم 8.5).

> Real photography from KMIT sites: quarry, mill, laboratory, packing, transport, at
> 2000px or more on the long edge. Images are automatically desaturated and blended
> so no photograph introduces a colour from outside the identity (§8.5).

---

## 6. حسابات التواصل الاجتماعي / Social accounts

- **الموضع:** `src/lib/schema.ts` (`sameAs` في `Organization`)
- **ما يظهر الآن:** الحقل محذوف من البيانات المنظمة بالكامل، لا مملوء بروابط مخمّنة.
- **المطلوب:** روابط الحسابات الرسمية (LinkedIn، X، إنستغرام، يوتيوب) إن وُجدت.

> Official account URLs if they exist. The `sameAs` field is omitted entirely rather
> than filled with guessed profile links.

---

## 7. النطاق النهائي / Production domain

- **الموضع:** `src/lib/site.ts` (`SITE.origin`) ومتغير البيئة `SITE_URL`
- **ما يظهر الآن:** `https://kmit.co` كقيمة افتراضية، وتُبنى عليها الروابط القانونية
  و`hreflang` وخريطة الموقع.
- **المطلوب:** تأكيد النطاق النهائي قبل أول نشر. **تغييره بعد الفهرسة يحتاج إعادة
  توجيه 301 لكل مسار** (القسم 15.1.6).

> Confirm the final domain before the first deploy. Changing it after indexing needs
> a 301 for every path (§15.1.6).

---

## بيانات مؤكدة ومستخدمة فعليًا / Confirmed data already in use

هذه وردت في القسم 1 وهي مستخدمة في الموقع كما هي، بلا تعديل:

| البند | القيمة |
|---|---|
| الاسم | كميت الصناعية · KMIT Industrial |
| المقر | جدة، المملكة العربية السعودية |
| الجوال | <span dir="ltr">057 495 0950</span> · `+966574950950` |
| البريد | `mohanad@kmit.co` |
| القطاعات | معالجة المعادن الصناعية وكربونات الكالسيوم · نقل حجر الرخام · ألواح الطاقة الشمسية |
| الشعار | `public/brand/KMIT_Industrial_Logo.svg` · `public/brand/KMIT_Industrial_Icon.svg` |

---

## ما لم يُخترع، عمدًا / What was deliberately not invented

لم يظهر في أي صفحة، ولن يظهر قبل التزويد (القسم 4):

- طاقة إنتاجية أو كميات أو حصص سوقية
- نسب نقاء أو مقاسات ميكرونية أو أي مواصفة منتج
- عدد الموظفين أو سنوات الخبرة
- أسماء عملاء أو شركاء أو موردين، وشعاراتهم
- مواقع مصانع أو محاجر أو إحداثيات على الخريطة
- كفاءات الألواح الشمسية أو قدراتها بالواط
- أعداد أساطيل النقل أو الحمولات

> None of the above appears anywhere on the site, and none will appear before it is
> supplied. The knowledge centre describes calcium carbonate as general material
> science, with no figure attributed to KMIT.
