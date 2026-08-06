# KMIT — Authoritative Technical Data

> Copy to `docs/technical-data.md`. **This file is the only source of technical facts for the website.**
> If a value is not here, it does not go on the site — write `TODO(data): <field>` instead.
> Bilingual: Arabic and English descriptions are both authoritative and must carry identical facts.

---

## 1. Product classification / تصنيف المنتجات

### 1.1 GCC — Ground Calcium Carbonate / كربونات الكالسيوم المطحونة

- **AR:** تُنتج عبر الطحن الميكانيكي الدقيق لصخور الحجر الجيري والرخام عالي النقاء. تتميز بالاستقرار الكيميائي وارتفاع درجة البياض وانخفاض نسبة الشوائب.
- **EN:** Produced through advanced mechanical milling of high-purity limestone/marble deposits. Characterised by chemical stability, high whiteness, and low impurity levels.
- **Coarse & medium grades:** 200–500 mesh / 30–75 µm
- **Ultra-fine / micronized grades:** 800–2500 mesh / 2–15 µm (D50)

### 1.2 Coated / Surface-Treated GCC / كربونات الكالسيوم المعالجة سطحياً

- **AR:** كربونات كالسيوم ميكرونية معالجة بنسبة محددة من حمض الستياريك (0.8%–1.2%).
- **EN:** Micronized GCC treated with high-grade stearic acid to render the particle hydrophobic and improve dispersion.
- **Coating level:** 0.8%–1.2% stearic acid
- **Industrial purpose:** improved dispersion in polymers, reduced moisture pick-up, faster throughput on extrusion lines, reduced machine wear.

### 1.3 PCC — Precipitated Calcium Carbonate / كربونات الكالسيوم المترسبة

- **AR:** تُنتج كيميائياً عبر إعادة كربنة الجير المطفأ، مما يتيح التحكم الدقيق في شكل البلورات وحجم الجسيمات (نطاق دون الميكروني/النانوي).
- **EN:** Synthesised via chemical precipitation (recarbonation), allowing precise control over crystal morphology, particle size distribution, and ultra-high purity.

---

## 2. Typical chemical & physical properties (TDS)

| Parameter (EN) | المعيار (AR) | Typical value | Test method |
|---|---|---|---|
| CaCO₃ purity | نقاء كربونات الكالسيوم | ≥ 98.5% | ISO 3262-1 |
| Whiteness (R457) | درجة البياض | 95.0% – 98.5% | ISO 2470 (Elrepho) |
| Fe₂O₃ | أكسيد الحديد | ≤ 0.03% | AAS / XRF |
| SiO₂ | أكسيد السيليكون | ≤ 0.20% | XRF |
| MgO | أكسيد المغنيسيوم | ≤ 0.40% | XRF |
| Moisture @105 °C | الرطوبة | ≤ 0.20% | ISO 787-2 |
| pH | الرقم الهيدروجيني | 8.5 – 9.5 | ISO 787-9 |
| Bulk density | الكثافة الظاهرية | 0.7 – 1.3 g/cm³ | ISO 787-11 |
| Oil absorption (DOP) | امتصاص الزيت | 14 – 24 g/100g | ISO 787-5 |
| Mohs hardness | صلادة موس | 3.0 | Mohs scale |

Render these as a real `<table>` with `<caption>` and `<th scope>`, and mirror every row into `Product.additionalProperty` JSON-LD as a `PropertyValue` with `unitText`.

---

## 3. Grade / PSD matrix

| Grade code | Mesh | D50 | Coating | Primary target industries |
|---|---|---|---|---|
| GCC-200 | 200 | 45–55 µm | Uncoated | Construction, drilling muds, asphalt |
| GCC-400 | 400 | 25–35 µm | Uncoated | Tile adhesives, basic paints, rubber |
| GCC-800 | 800 | 10–15 µm | Uncoated | PVC pipes, cables, emulsion paints |
| GCC-1250 | 1250 | 4.5–6.0 µm | Coated | PVC fittings, masterbatch, PE films |
| GCC-2500 | 2500 | 1.8–2.5 µm | Coated | High-end masterbatch, fine coatings |

Model this as the typed dataset `src/content/data/grades.ts`, with each grade carrying: `code`, `mesh`, `d50Min`, `d50Max`, `coated`, `coatingLevel?`, `industries[]`, `properties[]` (parameter/value/unit/method), `packaging[]`, `shelfLifeMonths`, and `relatedGrades[]`. Every page that shows grade data reads from this single object — no duplicated numbers in copy.

---

## 4. Applications by sector

### 4.1 Plastics & masterbatch / البلاستيك والماسترباتش
- **Applications:** rigid & flexible PVC pipes, fittings, cable compounds, PE/PP blown films, injection moulding, filler masterbatch.
- **Technical value:** raises flexural modulus and impact strength, improves thermal conductivity (shorter cooling cycles), lowers formulation cost, improves surface opacity and printability.
- **AR:** أنابيب PVC الصلبة والمرنة، الوصلات، مركّبات الكابلات، أفلام PE/PP، الحقن، ماستر باتش الحشو — زيادة الصلابة، تحسين التوصيل الحراري وتقليل زمن الدورة، خفض التكلفة، تحسين القابلية للطباعة.

### 4.2 Paints, coatings & construction / الدهانات والطلاءات ومواد البناء
- **Applications:** emulsion paints, protective industrial coatings, wall putty, tile adhesives, joint fillers, waterproofing membranes.
- **Technical value:** cost-effective TiO₂ extender, opacity, rheology and gloss/matting control, improved scrub and abrasion resistance.
- **AR:** الدهانات المائية والزيتية، المعجون، غراء السيراميك، مواد العزل — موسّع لثاني أكسيد التيتانيوم، عتامة، ضبط اللزوجة واللمعان، مقاومة غسيل أعلى.

### 4.3 Oil & gas drilling fluids / سوائل الحفر
- **Applications:** water-based muds (WBM) and synthetic/oil-based muds (OBM).
- **Technical value:** sized bridging agent for fluid-loss control and formation-damage prevention; fully acid-soluble for post-drilling wellbore cleanup.
- **AR:** عامل سدّ وإغلاق للمسام لمنع فقد سائل الحفر في الطبقات المنفذة، وقابل للذوبان في الحمض لتنظيف الآبار لاحقاً.

### 4.4 Rubber & elastomers / المطاط
- **Applications:** tyres, conveyor belts, technical hoses, footwear soles, rubber flooring.
- **Technical value:** increased tensile, tear and abrasion resistance; optimised vulcanisation processing time.

### 4.5 Paper & paperboard / الورق والكرتون
- **Applications:** wet-end filler and surface coating pigment for graphic paper and packaging board.
- **Technical value:** higher brightness, opacity and smoothness; better ink receptivity; replaces costly virgin cellulose fibre.

---

## 5. Packaging, storage & logistics

- **25 kg paper valve bags** — palletised and shrink-wrapped.
- **Jumbo / big bags** — 1000–1250 kg, woven inner liner for moisture protection, four lifting loops.
- **Bulk silo tankers** — pneumatic discharge directly into plant silos.

**Storage:** cool, dry, ventilated warehouse, on pallets, away from direct sunlight and ambient humidity.
**Shelf life:** 24 months uncoated / 12 months surface-coated.
**AR:** يُحفظ في مكان جاف ومهوّى بعيداً عن أشعة الشمس المباشرة والرطوبة — العمر الافتراضي 24 شهراً للدرجات غير المعالجة و12 شهراً للمعالجة سطحياً.

---

## 6. Quality & compliance

- **ISO 9001** (quality management), **ISO 14001** (environmental), **ISO 45001** (occupational health & safety)
- **SASO** — Saudi Standards, Metrology and Quality Organization compliance
- **REACH** compliant; **RoHS** compliant (free of restricted hazardous substances)
- **Available documentation:** TDS (Technical Data Sheets), MSDS/SDS (Safety Data Sheets), COA (Certificate of Analysis, per production batch)

---

## 7. Company facts

- Headquarters: Jeddah, Saudi Arabia
- Market served: KSA and the wider GCC

---

## 8. TODO(data) — required before launch

The following are **not** in this document and must not be invented. Collect from the client:

- [ ] Legal company name, CR number, VAT number
- [ ] Full HQ address, phone, WhatsApp, sales email, technical email
- [ ] Certificate numbers and issuing bodies for each ISO standard, with issue/expiry dates
- [ ] Actual plant capacity (t/month or t/year) and current utilisation
- [ ] Stated lead times per city / per packaging type
- [ ] Minimum order quantity per grade and per packaging type
- [ ] Sampling policy (free sample size, turnaround)
- [ ] Actual TDS/MSDS/COA PDF files for upload
- [ ] Reference clients or sectors served, with permission to name
- [ ] Year founded; whether KMIT mills its own material or processes/trades sourced material (this materially changes the positioning claim)
