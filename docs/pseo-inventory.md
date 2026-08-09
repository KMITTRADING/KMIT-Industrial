# Programmatic SEO inventory

> Phase 7. Every candidate page, with a ship / hold / reject decision and the
> reason. Written **before** any page was generated, which is the point: a
> decision made after the template exists is a rationalisation.
>
> The counts at the bottom are the honest summary. 9 of 25 grade x sector
> combinations ship. All 6 city pages are held. That is not underdelivery; it is
> what the data supports.

---

## 0. The rule this document applies

From the phase brief, and it governs everything below:

> A programmatic page ships **only if it contains information that exists nowhere
> else on the site.** If you cannot write 250+ words of non-substitutable
> technical content for a combination, do not generate that page.

Two things follow that are worth stating plainly, because they are what makes
this inventory more than a formality.

**A decision rule beats a judgement call.** For the grade x sector matrix the
ship set is not hand-picked. It is derived: a combination ships if and only if
the grade's own `applications` list in `src/content/data/grades.ts` contains at
least one application that `APPLICATION_SECTOR` maps to that sector. That
predicate is computable, lives in `src/content/data/solutions.ts`, and is
executed at build time. Nobody can quietly add a page by having an opinion, and
adding an application to the dataset produces its page with no second edit.

**The predicate is the no-invented-data rule wearing different clothes.**
`docs/technical-data.md` §3 states which industries each grade targets. A page
saying "GCC-1250 for drilling fluids" would be me deciding that, not KMIT. The
whole matrix reduces to: publish what the specification already claims, at the
level of detail a specification cannot carry.

---

## 1. Grade x sector matrix

`/[locale]/solutions/[grade]-for-[sector]`

### The grid

S = ship, H = hold, R = reject.

|                                   | plastics-masterbatch | paints-coatings-construction | oil-gas-drilling | rubber-elastomers | paper-paperboard |
| --------------------------------- | -------------------- | ---------------------------- | ---------------- | ----------------- | ---------------- |
| **GCC-200** (45-55 µm)            | R                    | **S**                        | **S**            | R                 | H                |
| **GCC-400** (25-35 µm)            | R                    | **S**                        | R                | **S**             | H                |
| **GCC-800** (10-15 µm)            | **S**                | **S**                        | R                | R                 | H                |
| **GCC-1250** (4.5-6.0 µm, coated) | **S**                | R                            | R                | R                 | H                |
| **GCC-2500** (1.8-2.5 µm, coated) | **S**                | **S**                        | R                | R                 | H                |

**9 ship, 5 hold, 11 reject.**

### The 9 that ship

Each is backed by a named application in the grade's dataset entry, so the page
is documenting an existing claim rather than making a new one.

| #   | Page                                        | Backed by                           | The non-substitutable content                                                                                                                                        |
| --- | ------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `gcc-200-for-oil-gas-drilling`              | drilling-muds                       | Bridging particle sizing against pore-throat diameter, acid solubility for cleanup, why the coarse cut is the functional one here and a fine grade is actively wrong |
| 2   | `gcc-200-for-paints-coatings-construction`  | construction, asphalt               | Extender economics at the coarse end, why 45-55 µm belongs in mortar and asphalt rather than in a topcoat, the surface-finish ceiling this grade imposes             |
| 3   | `gcc-400-for-paints-coatings-construction`  | tile-adhesives, basic-paints        | The oil-absorption / binder-demand tradeoff at 25-35 µm, why tile adhesive tolerates a coarser cut than a wall paint                                                 |
| 4   | `gcc-400-for-rubber-elastomers`             | rubber                              | Reinforcement versus dilution, Mohs 3.0 and equipment wear, why an ultrafine coated grade is economically wrong in a rubber compound                                 |
| 5   | `gcc-800-for-plastics-masterbatch`          | pvc-pipes, cables                   | Top-cut versus wall thickness in rigid PVC, impact and flexural behaviour, why the uncoated grade still works in rigid extrusion where it fails in film              |
| 6   | `gcc-800-for-paints-coatings-construction`  | emulsion-paints                     | TiO2 extension and opacity, scrub resistance, PVC (pigment volume concentration) and the point where extension stops paying                                          |
| 7   | `gcc-1250-for-plastics-masterbatch`         | pvc-fittings, masterbatch, pe-films | The flagship. Film gauge versus D50 top-cut, why the stearic coating is not optional at this loading, throughput and screw torque                                    |
| 8   | `gcc-2500-for-plastics-masterbatch`         | high-end-masterbatch                | Where 2500 mesh earns its cost premium over 1250 and where it does not, thin-gauge film and surface defects                                                          |
| 9   | `gcc-2500-for-paints-coatings-construction` | fine-coatings                       | Gloss retention and haze, why particle top-cut governs gloss, the matting tradeoff                                                                                   |

Every one of these also carries: the spec extract from the shared property
table, an explicit comparison against the adjacent grade in the same sector or
the next size step, a sector-specific FAQ set of 6 to 10 questions written for
that combination, and an RFQ prefilled with both the grade and the application.

### The 5 held: everything x paper-paperboard

`docs/technical-data.md` §4.5 documents the paper and paperboard sector in full:
wet-end filler and surface coating pigment, brightness, opacity, smoothness, ink
receptivity, fibre replacement. §3 maps **no grade to it.** Not one of the five
grade entries lists a paper application.

That is a data gap, not a technical impossibility, so these are held rather than
rejected. Ground calcium carbonate is used in paper at industrial scale
worldwide; the question is which of KMIT's grades is positioned for it, and only
KMIT can answer that.

**Unlock:** add the paper applications to the relevant grade entries in
`docs/technical-data.md` §3. The pages then generate from the existing predicate
with no template work. Note that `/applications/paper-paperboard` already exists
and ranks for the sector query; the held pages are the grade-level layer beneath
it, so nothing is missing from the site today, only from the matrix.

### The 11 rejected, and why

Rejections are on technical grounds. A page recommending the wrong particle size
for a process is worse than no page: it costs a formulator a trial batch, and it
is the exact failure mode that makes buyers distrust supplier content.

| Combination                             | Reason                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GCC-200 x plastics-masterbatch          | 45-55 µm exceeds the wall thickness of thin-gauge film and produces visible defects and web breaks. Genuinely wrong, not merely suboptimal.                                                                                                                                                                                                                                                                                                                                            |
| GCC-200 x rubber-elastomers             | The dataset positions rubber at GCC-400. A coarser cut dilutes without reinforcing and accelerates die wear.                                                                                                                                                                                                                                                                                                                                                                           |
| GCC-400 x oil-gas-drilling              | Bridging is a particle-size-distribution problem matched to formation permeability. 25-35 µm sits below the range the drilling grade is specified at, and substituting it changes the seal.                                                                                                                                                                                                                                                                                            |
| GCC-800 x oil-gas-drilling              | Same, further off. 10-15 µm passes through the pore throats it is meant to bridge.                                                                                                                                                                                                                                                                                                                                                                                                     |
| GCC-800 x rubber-elastomers             | No dataset backing; GCC-400 is the rubber grade. The finer cut raises cost with no compounding benefit at typical loadings.                                                                                                                                                                                                                                                                                                                                                            |
| GCC-1250 x paints-coatings-construction | The dataset places coated 1250 exclusively in plastics, and that is the reason. Worth stating the contrast, since GCC-2500 is also coated and does ship into this sector: the dataset routes 2500 to fine coatings, which are the solvent-borne systems an organophilic surface suits, while the coated 1250 is claimed only for polymer melts. Inferring a paints use for it from the fact that its neighbour has one is exactly the kind of reasoning this matrix exists to prevent. |
| GCC-1250 x oil-gas-drilling             | 4.5-6.0 µm cannot bridge a permeable formation.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| GCC-1250 x rubber-elastomers            | Cost per tonne unjustifiable at rubber loadings; no dataset backing.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| GCC-2500 x oil-gas-drilling             | As above, and more so at 1.8-2.5 µm.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| GCC-2500 x rubber-elastomers            | The most expensive grade in the range used where the cheapest works.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| GCC-400 x plastics-masterbatch          | 25-35 µm uncoated in a polymer melt: poor dispersion, no surface treatment, and the dataset routes plastics to 800 and finer.                                                                                                                                                                                                                                                                                                                                                          |

---

## 2. City and logistics pages

`/[locale]/supply/[city]` for Riyadh, Jeddah, Dammam, Jubail, Yanbu, Khobar.

**Decision: all 6 held. None ship.**

The brief is unusually specific about the bar here, and it is the right bar:

> Never ship a city page whose only variable is the city name. That is the
> classic programmatic penalty case.

It names four content requirements. Against the data that exists:

| Required                         | Available?                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Industrial cluster served        | Partially, and only as public geography, not as a KMIT fact                                            |
| Typical transit time from Jeddah | **No.** `docs/technical-data.md` §8: "Stated lead times per city / per packaging type" is an open item |
| Packaging suited to that route   | **No.** §5 lists three formats at family level; which suits which route is not stated                  |
| Port and customs notes           | **No** for anything KMIT-specific                                                                      |

Three of the four required fields are missing, and the missing one that matters
most is transit time, which is the entire reason a buyer opens a city page. What
remains is the city name and a paragraph of public geography. That is precisely
the page the brief forbids.

Writing them anyway with `TODO(data)` in place of the numbers was considered and
rejected: a page whose differentiating content is all placeholders is not a page
held back by a gap, it is a thin page with a note attached.

**Unlock, in order of how much each buys:**

1. Lead time per city, per packaging format. This alone converts hold to ship
   for all six, because it is the differentiating fact.
2. Minimum order quantity per city or per format, if it varies by route.
3. Which packaging formats are actually offered on which route (bulk tanker to
   Riyadh is a different operation to jumbo bags to Jubail).
4. Any customs or port specifics for GCC destinations outside KSA.

**What the site does instead, today:** `/sustainability-and-facility` carries the
logistics section with the Jeddah base and the markets served, and states openly
that lead times are pending. One honest page beats six padded ones, and the
honest page is already live.

**Where the intent goes meanwhile:** the transactional city queries in
`docs/keyword-clusters.md` cluster 1 (`بودرة كربونات الكالسيوم جدة`,
`caco3 supplier riyadh`) currently resolve to the home page and `/products`.
That is a weaker match than a city page would be, and it is the accepted cost of
not shipping a page that cannot answer the question it invites.

---

## 3. Comparison pages

Two of the four the brief lists shipped in Phase 4 as `/guides/gcc-vs-pcc` and
`/guides/coated-vs-uncoated`. The remaining two ship here, as guides rather than
as a new route type, because the guide template already carries the comparison
table, the FAQ wiring and the schema.

| Page                                   | Decision        | Note                                                                                                                                                                                                                                                                                                    |
| -------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/guides/local-vs-imported`            | **ship**        | Structural comparison only: freight, lead-time exposure, currency and payment terms, QC recourse, documentation turnaround. Deliberately carries **no KMIT lead-time number**, because none exists. The argument is about the shape of the two supply routes, which is true independent of the figures. |
| `/guides/caco3-vs-alternative-fillers` | **ship**        | CaCO3 against talc, kaolin and barite. Comparative properties are public materials science, attributed to the property rather than asserted as a KMIT test result.                                                                                                                                      |
| `/guides/gcc-vs-pcc`                   | shipped Phase 4 |                                                                                                                                                                                                                                                                                                         |
| `/guides/coated-vs-uncoated`           | shipped Phase 4 |                                                                                                                                                                                                                                                                                                         |

The brief's instruction on tone is followed literally: no competitor is named or
disparaged. `docs/keyword-clusters.md` already records that established
producers exist in this market and that competing on "we are a supplier" is
hopeless. Attacking them would be both wrong and ineffective.

---

## 4. Knowledge hub

`/[locale]/knowledge` and `/[locale]/knowledge/[article]`.

The brief asks for 12 articles and names 8 topics. **4 ship in this phase.** The
other 4 named topics are held, and the reasons differ, so they are set out
separately rather than lumped together.

The rule applied is narrower than the brief's: an article ships only if it
explains a value that is **already published on the grade pages with its test
method**. That constraint is what stops a knowledge hub becoming a blog. It also
means every shipped article has a real data table behind it, rendered from the
same component the grade pages use rather than from numbers copied into prose.

### Shipped

| #   | Article                                        | Explains                      | Table it renders |
| --- | ---------------------------------------------- | ----------------------------- | ---------------- |
| 1   | Reading a particle size distribution           | D50, and what it hides        | Grade matrix     |
| 2   | What whiteness R457 measures                   | ISO 2470, 95.0-98.5%, Fe₂O₃   | Property table   |
| 3   | Oil absorption and what it costs a formulation | 14-24 g/100g, ISO 787-5       | Property table   |
| 4   | Moisture and shelf life in coated grades       | ≤ 0.20%, 12 against 24 months | Grade matrix     |

### Held, and why each is different

| Topic                                      | Decision            | Reason                                                                                                                                                                                                                                                             |
| ------------------------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Why CaCO₃ is coated with stearic acid      | **held, permanent** | `/guides/coated-vs-uncoated` already owns this primary intent. A second page on it is self-cannibalisation, which `docs/keyword-clusters.md` names as the most common failure on a bilingual B2B site.                                                             |
| Filler loading economics                   | **held, permanent** | `/tools/filler-loading` answers it better, interactively, and with the reader's own numbers. An article restating the method beside the tool would compete with it.                                                                                                |
| Dispersion troubleshooting                 | **held, capacity**  | No overlap and real value. Deferred on phase capacity, not on data or on principle. It is the first article to write next.                                                                                                                                         |
| Acid solubility in drilling applications   | **held, capacity**  | Partly covered by `/solutions/gcc-200-for-oil-gas-drilling`, which carries the acid-solubility argument in its processing section. A standalone article would deepen it rather than duplicate it, so it is worth writing, but second.                              |
| SASO / REACH compliance, local vs imported | **held, data**      | Needs the ISO certificate numbers and issuing bodies from §8. A compliance article that cannot name a certificate is an article about compliance in general, which every competitor already has. `/resources` covers the documentation surface honestly meanwhile. |

Two of the five are held permanently because publishing them would compete with
a better page that already exists, which is worth stating plainly: the honest
count of articles this site should eventually carry is 7, not 12.

Every article: answer-first opening, at least one real data table, internal
links to the grade pages the topic bears on, `Article` plus `FAQPage` schema,
bilingual and key-mirrored.

---

## 5. Gated and interactive assets

| Asset                         | Decision          | Reason                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Filler loading calculator** | **ship, ungated** | The brief calls it the best link-earning asset in the niche and that is right. Built so it computes only on numbers the visitor enters: their resin cost, their filler cost, their target load. It recommends a grade from the dataset and shows the arithmetic. It invents no KMIT price, because none exists, and it does not need one to be useful. |
| Grade selection guide, PDF    | **hold**          | `/guides/grade-selection` already exists as a page and is better than a PDF for both search and AI citation. A PDF version is a production task once the TDS documents exist, not a content task. §8 has no PDFs at all.                                                                                                                               |
| Sample request flow           | **hold**          | Buildable as a form. Not shippable as a promise: sampling policy, free sample size and turnaround are all open in §8. A low-friction form that cannot say what happens next or how much material arrives converts worse than the RFQ it would sit beside.                                                                                              |

---

## 6. Summary

| Candidate set              | Ship   | Hold   | Reject |
| -------------------------- | ------ | ------ | ------ |
| Grade x sector             | 9      | 5      | 11     |
| City / logistics           | 0      | 6      | 0      |
| Comparison guides          | 2      | 0      | 0      |
| Knowledge articles         | 4      | 5      | 0      |
| Interactive / gated assets | 1      | 2      | 0      |
| **Total**                  | **16** | **18** | **11** |

**16 pages ship out of 45 candidates.** Of the 18 held, 12 are blocked on data
KMIT has and this repository does not, and each names the specific field that
unlocks it; 4 are held on phase capacity and are ready to write; 2 are held
permanently because a better page already answers the same query. 11 are
rejected permanently on technical grounds.

The single highest-value unlock is **lead time per city per packaging format**.
It converts 6 held pages to shippable, completes the strongest argument on the
home page, removes the pending note from the logistics section, and fills the
gap in the local-versus-imported guide. Nothing else in §8 unlocks as much.
