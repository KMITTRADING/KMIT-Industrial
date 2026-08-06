# Product marketing context — KMIT Industrial

> Written in Phase 1 using the `product-marketing` skill. Every marketing, copy,
> SEO and CRO task on this project reads this file first.
>
> **Provenance rule.** Facts come from `docs/technical-data.md`. Market context
> comes from `docs/keyword-clusters.md` and is marked as _unverified_ where it
> is. Anything not in either is an open question in §12, not an assumption.

---

## 1. Product overview

**One line.** Saudi supplier and processor of industrial calcium carbonate,
selling specified grades — not "quality powder" — to plants in the Kingdom and
the GCC.

**What it is.** Ground calcium carbonate (GCC) from high-purity limestone and
marble, milled from coarse construction grades down to micronized 2500 mesh,
with the fine grades surface-treated with stearic acid. Also precipitated
calcium carbonate (PCC) for applications needing controlled crystal morphology
and sub-micron particle size.

**Category / the shelf we sit on.** Industrial mineral fillers and extenders.
Buyers search for us as a _calcium carbonate supplier_, a _CaCO₃ manufacturer_,
or by grade — "1250 mesh", "coated caco3", "D50 5 micron".

**Business model.** B2B bulk material supply. Enquiry-led: the conversion event
is a qualified RFQ carrying grade, tonnage, application and destination — not a
purchase and not a signup. There is no published price and there should not be;
price is a function of grade, volume, packaging and destination.

**Product range** (`docs/technical-data.md` §1, §3):

| Grade    | Mesh | D50        | Coating               | Typical destination                      |
| -------- | ---- | ---------- | --------------------- | ---------------------------------------- |
| GCC-200  | 200  | 45–55 µm   | uncoated              | construction, drilling muds, asphalt     |
| GCC-400  | 400  | 25–35 µm   | uncoated              | tile adhesives, basic paints, rubber     |
| GCC-800  | 800  | 10–15 µm   | uncoated              | PVC pipe, cable compound, emulsion paint |
| GCC-1250 | 1250 | 4.5–6.0 µm | stearic acid 0.8–1.2% | PVC fittings, masterbatch, PE film       |
| GCC-2500 | 2500 | 1.8–2.5 µm | stearic acid 0.8–1.2% | high-end masterbatch, fine coatings      |

---

## 2. Target audience

**Company type.** Manufacturing plants that consume mineral filler by the tonne:
plastics converters and masterbatch producers, paint and coating manufacturers,
construction-chemical formulators, drilling-fluid service companies, rubber
compounders, and paper and board mills. Located in Saudi Arabia first, then the
wider GCC.

**Primary use case.** Securing a consistent, specified filler at a landed cost
and lead time that beats imported material — without re-qualifying the
formulation every time a shipment arrives.

**Jobs to be done.**

1. _Qualify a supplier_ — prove on paper that the material meets spec, before
   anyone requests a sample.
2. _Select a grade_ — map an application and a process constraint onto a mesh
   size and a D50.
3. _De-risk supply_ — replace or second-source an import that is exposed to
   freight, currency and lead-time variance.

---

## 3. Personas

Two people decide this, and they do not read the same page. The site must serve
both without diluting either — this drives the whole information architecture.

### 3.1 The formulation / QC engineer — technical influencer

- **Cares about:** CaCO₃ purity, whiteness (R457), Fe₂O₃, oil absorption, D50
  and the shape of the distribution, coating level and coating consistency,
  moisture, and _which test method produced each number_.
- **Challenge:** an unspecified filler forces re-trials. Coating variance shows
  up as dispersion problems and screen-pack pressure on an extrusion line;
  whiteness variance shows up in a paint batch that no longer matches.
- **What we promise:** every number published with its test method, a COA per
  batch, and grade data that does not change between the website, the TDS and
  the delivery.
- **Fails us if:** the site says "high purity" without a figure. That single
  phrase costs the enquiry — it signals a trader, not a processor.

### 3.2 The procurement manager — decision maker and financial buyer

- **Cares about:** in-Kingdom supply, lead time to their city, MOQ, packaging
  format that matches their intake (25 kg bags vs jumbo vs bulk tanker),
  documented compliance (ISO, SASO, REACH, RoHS), price stability, and how fast
  a quote comes back.
- **Challenge:** import exposure — freight, lead time, customs, currency — and
  the cost of a stock-out on a line running to schedule.
- **What we promise:** a Saudi source, packaging that matches their handling,
  and a quote that comes back with the technical detail already attached.
- **Fails us if:** they cannot tell within thirty seconds whether we can serve
  their city, their tonnage and their packaging format.

### 3.3 Anti-persona

Retail, laboratory-scale, food-grade and pharmaceutical-grade buyers. Nothing in
`docs/technical-data.md` supports a food or pharma claim, and the packaging
formats start at 25 kg. Do not write copy that attracts them.

---

## 4. Problems and pain points

| Pain                                           | Cost to them                                                 | What the site must do                                                           |
| ---------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| Supplier pages publish no real data            | Every shortlist entry needs a phone call to establish basics | Publish the full property table and grade matrix on the page, not behind a form |
| "Calcium carbonate" is sold as one product     | Wrong grade specified, wasted trials, line problems          | Make the grade × application relationship explicit and navigable both ways      |
| Import lead time and freight exposure          | Stock-outs, buffer inventory, currency risk                  | Lead the positioning on in-Kingdom supply — once real lead-time data exists     |
| Coating variance between shipments             | Dispersion failures, throughput loss                         | State the coating level as a controlled range with the agent named              |
| Compliance documents arrive late or not at all | Audit findings, delayed qualification                        | A resources page built around TDS / MSDS / COA as first-class objects           |

---

## 5. Competitive landscape

_Unverified — sourced from `docs/keyword-clusters.md`, which flags it for
verification before publication. Do not name a competitor on the site._

- **In-Kingdom / regional:** Saudi Carbonate Co. (Omya joint venture), Astra
  Mining, National Calcium Carbonate Company, Al-Jazira Factories, Al Sorayai
  Group.
- **Global reference brands:** Omya, Imerys, Minerals Technologies.
- **The real alternative:** imported Egyptian, Turkish, Vietnamese and Chinese
  GCC, and — for a large converter — buying unprocessed limestone and milling
  in-house.

**Where they fall short for the buyer:** most regional supplier sites publish a
company profile and a phone number, not a specification. That is the opening.

**What we cannot win on:** being _a supplier_. That contest is over. Grade-level
technical specificity, published TDS data, and in-Kingdom lead time are
winnable.

---

## 6. Differentiation

1. **Published, method-attributed specification.** Every value on the site is
   stated with the standard used to determine it. This is a positioning choice
   before it is an SEO choice.
2. **Grade-level navigation.** Five grades, each with its own page, its own PSD
   position, and its own application set — instead of one "products" page.
3. **In-Kingdom supply.** Jeddah-based, serving KSA and the GCC. _The strength
   of this claim depends on an open question — see §12._
4. **Surface treatment as an engineering answer.** Coating is presented as what
   it does on the line — dispersion, moisture pick-up, throughput, machine wear
   — not as a product tier.
5. **Documentation as a product.** TDS, MSDS and per-batch COA treated as
   deliverables, not attachments.

---

## 7. Objections and how the site answers them

| Objection                                         | Where it is answered      | How                                                                                  |
| ------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------ |
| "Can you actually hold this spec batch to batch?" | Quality page, grade pages | Property table with test methods; per-batch COA; ISO 9001 quality management         |
| "Are you a producer or a trader?"                 | Facility page             | Extraction → milling → classification → QC, shown as a process. **Blocked on §12.1** |
| "What is your lead time to my city?"              | Contact / RFQ             | **Blocked — no lead-time data exists.** Do not imply one                             |
| "What is your minimum order?"                     | Products, RFQ             | **Blocked — no MOQ data exists**                                                     |
| "Can you supply the volume we need?"              | Facility                  | **Blocked — no capacity figure exists.** Do not write "large capacity"               |
| "Are you certified?"                              | Quality                   | ISO 9001 / 14001 / 45001, SASO, REACH, RoHS. **Certificate numbers blocked**         |
| "Can I test it first?"                            | RFQ                       | Sample request path. **Sampling policy blocked**                                     |
| "Why not keep importing?"                         | Home, applications        | In-Kingdom source, packaging match, documentation. Strengthens once lead times exist |

Seven of eight objections are partially or wholly blocked on client data. That
is the single largest risk to conversion on this site, and it is a data-
collection problem, not a copy problem.

---

## 8. Switching dynamics (JTBD four forces)

- **Push** — import lead time and freight exposure; batch inconsistency from a
  trader; a supplier who cannot produce a COA on request.
- **Pull** — a local source with published specification, packaging that matches
  their intake, and a quote that arrives with the technical detail attached.
- **Habit** — the incumbent is qualified. Re-qualification costs lab time and
  line time, and nobody is rewarded for changing a filler that works.
- **Anxiety** — "if this new material is inconsistent, my line stops and it is
  my name on the decision."

**Implication for the site:** the anxiety is the binding constraint, not the
pull. Every page must reduce the perceived risk of _trying_ — sample path,
per-batch COA, method-attributed data — rather than amplify the upside.

---

## 9. Customer language

**Use.** Grade code (GCC-1250). Mesh. D50. Micron / ميكرون. Coated / uncoated,
معالجة سطحياً / غير معالجة. Whiteness, درجة البياض. Purity, النقاء. Oil
absorption, امتصاص الزيت. Filler, حشو. Extender, موسّع. Masterbatch, ماستر
باتش. Bridging agent, عامل سدّ. Acid-soluble, قابل للذوبان في الحمض. TDS, MSDS,
COA. Tonne / طن. Jumbo bag / كيس جامبو.

**Never use.** "Innovative solutions", "world-class quality", "your trusted
partner", "premium quality", "best prices", "حلول مبتكرة", "شريكك الموثوق",
"جودة عالمية", "أفضل الأسعار". Every one of these is a substitute for a number,
and a technical buyer reads them as an admission that no number exists.

**Bilingual convention.** Keep the English technical term in parentheses on
first mention in Arabic — `كربونات الكالسيوم المطحونة (GCC)` — because that is
how the specification is written on a Saudi purchase order. Grade codes, units
and standard numbers stay Latin in both locales.

---

## 10. Brand voice

- **Tone:** technical, precise, unhurried. The voice of a plant engineer writing
  a data sheet, not a marketer writing a landing page.
- **Style:** declarative. Number first, claim second — or no claim. No
  exclamation marks. British-neutral technical English; Modern Standard Arabic
  in a technical register.
- **Personality:** exacting · specific · industrial · plainspoken · accountable.

**The test for any sentence:** if it would look wrong in a technical data sheet,
it is wrong on this site.

---

## 11. Proof points

**Available now** (`docs/technical-data.md`):

- ≥ 98.5% CaCO₃ purity, ISO 3262-1
- 95.0–98.5% whiteness R457, ISO 2470 (Elrepho)
- Fe₂O₃ ≤ 0.03%, SiO₂ ≤ 0.20%, MgO ≤ 0.40%
- Five grades, 200 to 2500 mesh, D50 55 µm down to 1.8 µm
- Stearic acid coating controlled to 0.8–1.2%
- Three packaging formats: 25 kg valve bags, 1000–1250 kg jumbo bags, bulk silo tankers
- Shelf life 24 months uncoated, 12 months coated
- ISO 9001, ISO 14001, ISO 45001; SASO; REACH; RoHS
- TDS, MSDS/SDS, and per-batch COA available

**Not available — do not imply.** Capacity, utilisation, lead times, MOQ,
sampling policy, certificate numbers, client names, year founded, and whether
KMIT mills its own material.

---

## 12. Open questions blocking positioning

Ordered by how much each one changes the site.

1. **Does KMIT mill its own material, or process and trade sourced material?**
   This decides whether the site can say "we produce" or must say "we supply and
   process". It changes the home page, the facility page, and the strongest
   differentiator in §6. Nothing should be written that implies own-production
   until this is answered.
2. **Lead times per city and packaging format.** Without these, the in-Kingdom
   advantage is asserted rather than demonstrated, and the strongest objection
   in §7 stays unanswered.
3. **Plant capacity and current utilisation.** Decides whether the site can
   credibly address a large converter.
4. **MOQ per grade and per packaging format.** Decides who self-qualifies out
   before submitting an RFQ.
5. **Certificate numbers, issuing bodies, validity dates.** Needed before any
   standard is rendered as a badge rather than as a line of text.
6. **Sampling policy** — free sample size and turnaround.
7. **Legal entity, CR number, VAT number, full address, phone, WhatsApp, sales
   and technical email.** Needed for the contact page, the Organization JSON-LD,
   and basic trust.
8. **Reference clients or named sectors, with permission.**
9. **Actual TDS / MSDS / COA PDFs.**

Items 1–4 are positioning-blocking. Items 5–9 are page-blocking.
