import type { Content } from '../schema';

/**
 * The nine grade x sector pages, in English.
 *
 * Held in their own module because these are the longest bodies of prose on the
 * site and folding them into `en/index.ts` would have pushed one file past two
 * thousand lines.
 *
 * Every page is written for its combination. That is the entire justification
 * for the matrix existing: docs/pseo-inventory.md commits to shipping a
 * combination only where there are 250+ words that could not be moved to the
 * grade page or the sector page without becoming wrong. If any block below
 * reads as though the grade code could be swapped out, it is a defect.
 *
 * Every number traces to docs/technical-data.md. Nothing here states a loading
 * level, a lead time or a concentration, because none of those exist in the
 * source document; the `loading` blocks describe what sets the ceiling instead.
 */
export const enSolutions: Content['solutions'] = {
  'gcc-200-for-oil-gas-drilling': {
    title: 'GCC-200 for Drilling Fluids | Acid-Soluble Bridging',
    description:
      'Why a 45-55 micron D50 bridges a permeable face, and why ≥ 98.5% purity with SiO₂ at or below 0.20% decides what acid cleanup can remove.',
    h1: 'GCC-200 in water-based and oil-based drilling fluids',
    answerFirst:
      'GCC-200 is the bridging grade in the KMIT range. Its median particle size (D50) of 45-55 microns is sized to seal the pore throats of a permeable formation at the sand face rather than inside it, and at a minimum 98.5% CaCO₃ with SiO₂ held to 0.20% or below, the bridge it forms is substantially removable by acid on cleanup instead of remaining as permanent formation damage.',
    cardSummary:
      'The bridging grade: how 45-55 microns seals a permeable face, and why acid solubility is the specification that decides the outcome.',
    problem:
      'Drilling through a permeable zone, the mud column sits at higher pressure than the formation, so filtrate and whole mud move into the rock. Two consequences follow and the second is the expensive one. Fluid loss costs mud volume and destabilises the wellbore. Formation damage costs production: solids and filtrate that invade the near-wellbore region reduce permeability in exactly the interval the well was drilled to produce from. A bridging agent addresses both, but only if it seals at the face. A solid that passes through the pore throats and lodges deeper builds an internal filter cake, which is the damage mechanism rather than the cure, and no cleanup treatment reaches it reliably.',
    sizing:
      'Bridging is a geometry problem before it is a chemistry one. To arch across a pore throat and hold, a particle has to be a substantial fraction of that throat diameter, conventionally around one third. Much smaller and it travels straight through; much larger and it never enters, contributing nothing but inert solids to the mud. A 45-55 micron D50 places the bulk of the distribution in the range that bridges the pore throats of the clastic reservoirs typically drilled in the region. The D50 is a summary rather than the whole specification: a bridging pack works because it carries a spread of sizes, the coarse fraction arching first and the finer fraction sealing the gaps behind it. That is why this grade is specified by its distribution and not only by its median.',
    loading:
      'Concentration is set by the fluid-loss target and by how much total solids the mud can carry before its rheology and equivalent circulating density move outside the drilling window. It is not a fixed percentage, and a supplier quoting one without knowing the formation is guessing. Two published values bear on it directly. Bulk density of 0.7-1.3 g/cm³ determines what a given quantity adds to the active volume and how it mixes through the hopper. Oil absorption of 14-24 g/100g bears on oil-based and synthetic systems, where the solid competes with the base fluid for the continuous phase. KMIT does not publish a recommended concentration for this duty, because the correct one is a property of the well rather than of the product.',
    processing:
      'Acid solubility is why calcium carbonate is specified here rather than a cheaper mineral, and two numbers in the published specification decide how well it delivers. At a minimum 98.5% CaCO₃, the great majority of the bridge dissolves in hydrochloric acid during cleanup, restoring the near-wellbore permeability the bridge was there to protect. SiO₂ held to 0.20% or below is the more revealing figure, because silica is acid-insoluble: whatever fraction of the material is silica is the fraction that stays in the formation permanently. Mohs hardness of 3.0 matters on the way in rather than on the way out. Calcium carbonate is soft enough to pass through pumps, bit nozzles and measurement-while-drilling tools with far less abrasion than a silica-based bridging solid at Mohs 7.',
    versus:
      'GCC-400 is the next grade finer at a 25-35 micron D50, and it is not a substitute for this duty. Sized below the throats it would need to bridge, it passes the face and lodges inside the pore network, producing the internal filter cake the bridging strategy exists to avoid, and doing so where acid cleanup reaches unevenly. The finer grade is not a lower-performance version of the coarser one here; it is a grade for a different job, and the two are not interchangeable on price. If a formation is finer than GCC-200 is sized for, the answer is a distribution matched to that formation, which is a conversation about the well rather than a step down the product range.',
  },

  'gcc-200-for-paints-coatings-construction': {
    title: 'GCC-200 for Mortar, Asphalt and Construction Fill',
    description:
      'A 45-55 micron filler for cementitious and bituminous systems: low binder demand, pH 8.5-9.5 cement compatibility, and where the finish limit sits.',
    h1: 'GCC-200 in mortar, asphalt mastic and construction products',
    answerFirst:
      'GCC-200 is the coarse end of the KMIT range and the grade specified where bulk volume matters more than surface finish. At a 45-55 micron median particle size (D50) it fills between larger aggregate without the binder demand a fine powder imposes, and at pH 8.5-9.5 it is chemically at home in cementitious systems. It is the wrong grade wherever the finished surface is the product.',
    cardSummary:
      'Bulk volume at the lowest binder demand in the range, for cementitious and bituminous systems where finish is not the deliverable.',
    problem:
      'In mortar, jointing compounds, wall putty and asphalt mastic, the binder is the expensive component and the filler is what the binder has to wet, carry and hold in place. The formulator is working against two limits at once. Push the filler content up and the cost per cubic metre falls, but the mix stiffens, workability drops and the binder is spread too thin to develop strength. Push it down and the economics stop working. What the filler brings to that balance is decided less by how much of it there is than by how much binder its surface demands, and surface demand is governed by particle size.',
    sizing:
      'A 45-55 micron D50 sits in the size neighbourhood of a fine sand fraction, and that placement is the whole point. Particles at this scale occupy the voids between larger aggregate while presenting comparatively little surface area per unit mass, so they add volume without absorbing the binder that a micronized powder would. Published oil absorption for the family is 14-24 g/100g, and the coarse grades sit at the low end of that band: this is the grade in the range that takes the least binder to wet. The same coarseness sets the ceiling on what it can be used for. Individual particles at 45-55 microns are at or above the threshold where a trowelled or rolled surface begins to read as textured rather than smooth.',
    loading:
      'The ceiling is set by the binder demand of the whole aggregate skeleton rather than by a filler percentage, which is why no percentage appears here. Two published values are the ones to work against. Oil absorption of 14-24 g/100g scales the binder each unit of filler will take up. Bulk density of 0.7-1.3 g/cm³ is what converts a volumetric mix design into a weighed batch, and in this sector mixes are designed by volume and batched by mass, so it is the number that reconciles the two. The practical limit is reached when workability or green strength falls below what the placement method needs, and that depends on the binder, the water content and the other aggregate rather than on the calcium carbonate alone.',
    processing:
      'pH 8.5-9.5 makes this grade chemically compatible with cement, where an alkaline environment is where the binder already lives, and chemically wrong for any acid-catalysed or acid-cure system, where it will neutralise the catalyst. In hot-mix asphalt the filler stiffens the mastic and raises the softening point of the binder film, and moisture held to 0.20% or below matters more than it first appears: a filler carrying free water flashes to steam at mixing temperature, which foams the mastic and disrupts the coating of the aggregate. Mohs hardness of 3.0 means low wear on mixers, pumps and screw conveyors compared with siliceous fillers, which is a maintenance cost rather than a formulation one and is usually noticed only in its absence.',
    versus:
      'GCC-400 at a 25-35 micron D50 is the next grade finer, and moving to it buys a smoother finished surface at the cost of higher binder demand and a higher price per tonne. That trade is worth making in a tile adhesive or a decorative render where the surface is the deliverable, and it is not worth making in a structural mortar, a levelling screed or an asphalt mastic where the surface will be covered, worn or overlaid. Specifying the finer grade for a body application is the most common way to spend money on this material without getting anything back for it.',
  },

  'gcc-400-for-paints-coatings-construction': {
    title: 'GCC-400 for Tile Adhesive and Economy Paint',
    description:
      'The 25-35 micron middle grade: enough fineness for a trowelled or rolled finish, without the binder demand that micronized fillers impose.',
    h1: 'GCC-400 in tile adhesives and economy emulsion paints',
    answerFirst:
      'GCC-400 is the middle of the KMIT range at a 25-35 micron median particle size (D50), and it is the grade specified where the finished surface matters but a micronized filler cannot be justified. It is fine enough not to read as texture under a trowel or a roller, and coarse enough that binder demand and price per tonne both stay well below the micronized grades.',
    cardSummary:
      'The compromise grade: fine enough for a finished surface, coarse enough to keep binder demand and cost down.',
    problem:
      'A tile adhesive has to stay where it is put on a vertical wall, keep working for the length of the open time, and then develop bond. An economy emulsion has to hide the substrate, resist a wash cloth, and cost less per litre than the coating above it in the range. Both formulations depend on a filler for the bulk of their solids, and both fail in visible ways if the filler is wrong: an adhesive with too much surface area stiffens and loses open time, and a paint with too coarse a filler leaves a film that feels rough and burnishes when it is cleaned.',
    sizing:
      'A 25-35 micron D50 is the point where those two failure modes are both far enough away. It is below the threshold at which particles read as texture in a trowelled bed or a rolled film, so the finish is acceptable in both. It is above the size at which surface area begins to climb steeply, so binder and water demand stay moderate: published oil absorption for the family is 14-24 g/100g, and this grade sits in the middle of that band rather than at the top of it. The result is a grade with no outstanding property and no disqualifying one, which is exactly what a high-volume, cost-driven formulation needs. Whiteness of 95.0-98.5% to ISO 2470 sets the floor for how light a tinted system can be brought without additional white pigment.',
    loading:
      'In a tile adhesive the limit is rheological: filler goes in until sag resistance, open time or trowel feel reaches the edge of what the applicator will accept. In an emulsion paint the limit has a name, the critical pigment volume concentration, which is the loading above which there is no longer enough binder to fill the space between particles. Below it the film is continuous and scrub resistance holds; above it the film becomes porous, dry hiding rises and scrub resistance falls away quickly. Where that point sits depends on the binder and on the oil absorption of the whole pigment package, which is why the published 14-24 g/100g range is the number to formulate against rather than any recommended percentage.',
    processing:
      'At pH 8.5-9.5 this grade raises the pH of a water-borne system, which suits an ordinary acrylic or vinyl emulsion and rules out anything acid-catalysed. The same alkalinity is why it belongs in cementitious adhesives, where it is compatible with the binder chemistry rather than merely tolerated by it. The grade is uncoated, which is correct for water-borne systems: an untreated calcium carbonate surface is hydrophilic and wets readily in the aqueous phase, where a stearic-coated particle would resist it. Moisture at 0.20% or below matters in the dry-mix adhesive case, where the powder is bagged with cement and any free water shortens the shelf life of the blend rather than of the filler.',
    versus:
      'GCC-200 at 45-55 microns costs less and takes less binder, and it is the right choice in any layer that will be covered. Use it below this grade, not instead of it, because the surface difference is visible. GCC-800 at 10-15 microns moves the other way: a smoother film, better scrub resistance and better TiO₂ spacing in a paint, at a higher price per tonne and a higher binder demand. The honest boundary between GCC-400 and GCC-800 in an emulsion paint is the quality tier of the paint itself. An economy matt emulsion does not recover the cost of the finer grade; a mid-tier washable one does.',
  },

  'gcc-400-for-rubber-elastomers': {
    title: 'GCC-400 for Rubber Compounding | Filler Selection',
    description:
      'A 25-35 micron semi-reinforcing filler for rubber: hardness and cost control without the tear loss of a coarse filler, at Mohs 3.0.',
    h1: 'GCC-400 in rubber and elastomer compounds',
    answerFirst:
      'GCC-400 is the grade in the KMIT range specified for rubber compounding. At a 25-35 micron median particle size (D50) it raises hardness and reduces compound cost while staying below the size at which a filler particle starts acting as a flaw, and at Mohs hardness 3.0 it is far gentler on mixing equipment than a siliceous filler.',
    cardSummary:
      'Cost and hardness in a rubber compound without the tear-strength penalty of a coarse filler, and without paying for reinforcement it cannot deliver.',
    problem:
      'Calcium carbonate in a rubber compound is a semi-reinforcing filler, and being clear about that is the beginning of specifying it correctly. It is not carbon black and it is not precipitated silica: it will not build the tensile and abrasion properties those fillers build, and a compound that needs them will not get them here at any particle size. What it does is add hardness and volume at a fraction of the cost per tonne, in compounds where the mechanical requirement leaves room for it. The failure mode is well known. Every filler particle that is large relative to the surrounding matrix behaves as a stress concentrator, and tear strength and fatigue life fall as the coarse tail of the distribution grows.',
    sizing:
      'A 25-35 micron D50 is where the two opposing penalties are both tolerable. Coarser, and the stress-concentration effect starts to show up as reduced tear strength and earlier fatigue failure, particularly in dynamic applications. Finer, and surface area rises: mixing energy, compound viscosity and the risk of poor dispersion all climb, and beyond a point the compound becomes difficult to process without a gain in properties to justify it. Because calcium carbonate does not reinforce, spending money on a finer particle buys processing difficulty rather than performance, which is why the range positions rubber at this grade and not at a micronized one.',
    loading:
      'Loading is set by the target hardness and by how much loss of tensile, tear and elongation the specification tolerates. Both are compound properties rather than filler properties, so no loading figure appears here or in the technical data. Oil absorption of 14-24 g/100g is the value that bears on it most directly: it governs how much plasticiser the filler takes up, and a compound whose plasticiser has been absorbed by the filler processes stiffer than the recipe suggests. Bulk density of 0.7-1.3 g/cm³ matters for volumetric feeding and for how the filler behaves in an internal mixer. The practical route to a loading is a ladder study on the actual compound.',
    processing:
      'Mohs hardness 3.0 is the quiet advantage. Calcium carbonate is soft enough that mixer rotors, extruder screws and dies wear far more slowly than with a siliceous filler at Mohs 7, and in a high-volume compounding operation that difference shows in maintenance intervals rather than in any laboratory measurement. Two other published values need watching. Moisture at 0.20% or below matters because water in a compound produces porosity and blisters during cure, and the effect is worse in thick sections. pH 8.5-9.5 means the filler is alkaline, so it interacts with acidic accelerator systems and can alter cure rate; the cure package should be checked against the filler rather than assumed to be independent of it.',
    versus:
      'GCC-200 at 45-55 microns is cheaper again, and in a low-specification compound with no dynamic requirement it can be the correct answer. Where tear strength or fatigue life is in the specification, its coarser tail is the first thing to show. In the other direction, the micronized grades are the wrong purchase for this sector: GCC-1250 and GCC-2500 cost substantially more per tonne, and because calcium carbonate does not reinforce, the finer particle returns processing difficulty and expense rather than properties. Their stearic-acid surface treatment is designed for dispersion in a polymer melt and is not what a rubber compound is short of.',
  },

  'gcc-800-for-plastics-masterbatch': {
    title: 'GCC-800 for Rigid PVC Pipe and Cable Compound',
    description:
      'A 10-15 micron uncoated filler for rigid extrusion: why wall thickness makes the top cut acceptable here and unacceptable in film.',
    h1: 'GCC-800 in rigid PVC pipe and cable compounds',
    answerFirst:
      'GCC-800 is the grade specified for rigid PVC extrusion in the KMIT range. At a 10-15 micron median particle size (D50) it adds stiffness and reduces compound cost in sections where the wall is measured in millimetres, which is why an uncoated grade is still workable here even though the same particle size would be a defect source in thin film.',
    cardSummary:
      'Why an uncoated 10-15 micron grade works in a pipe wall and fails in a film, and what the compounding step has to do to earn it.',
    problem:
      'A rigid PVC pipe or a cable sheathing compound is designed against stiffness, impact and cost, and the filler is where most of the cost reduction comes from. The tension is between the first two. Calcium carbonate raises flexural modulus, which is wanted, and above a certain loading it reduces impact strength, which is not, because the filler particles interrupt the continuous polymer phase that absorbs the energy. It also changes how the compound fuses and how much heat the extruder puts into it, so the same recipe that passes a stiffness test can fail on the line.',
    sizing:
      'A 10-15 micron D50 is fine relative to the section being extruded, and that relationship is what makes the grade viable. In a pipe wall of two millimetres or more, the coarse tail of this distribution is two orders of magnitude below the wall thickness, so an individual particle is not a through-thickness flaw and does not become a burst-pressure initiation point. The same distribution in a 25 micron blown film would be a defect in every sense: it would be a visible gel, a printing fault and a web break. That difference, section thickness rather than the grade itself, is the reason this page and the film pages recommend different grades from the same range for the same polymer family.',
    loading:
      'The ceiling is the impact specification. Filler goes in until notched impact, or whatever drop test the product is qualified against, reaches its limit, and where that point falls depends on the impact modifier, the processing aid package and the fusion level far more than on the filler. There is a second and less obvious limit on the extruder itself: filler changes the frictional heat generation of a PVC dry blend, so a formulation that fuses correctly at one loading may under-fuse or over-fuse at another, with the mechanical consequences following from that rather than from the filler content directly. Bulk density of 0.7-1.3 g/cm³ is the number to work with when converting a recipe into a volumetric dosing setting.',
    processing:
      'This grade is uncoated, and in rigid PVC that is a deliberate and defensible choice rather than a compromise. A PVC dry blend already carries a lubricant package, internal and external, and the high-shear mixing step it goes through is designed to break down agglomerates and coat particles with that package. The filler gets its dispersion from the process rather than from a surface treatment. Two published values still need attention. Moisture at 0.20% or below matters because water in a PVC melt produces voids and contributes to plate-out on the die. pH 8.5-9.5 means the filler is alkaline and will scavenge hydrogen chloride as the polymer degrades, which is a genuine secondary benefit to thermal stability rather than a marketing claim.',
    versus:
      'GCC-1250 at 4.5-6.0 microns with a stearic-acid coating is the grade above, and the honest position is that rigid pipe usually does not need it. The coating buys dispersion in a melt and lower viscosity at high loading, both of which matter enormously in a film line and matter much less where a lubricated dry blend and a high-shear mixer are already doing that work. What the finer grade does buy in rigid extrusion is a better surface finish and slightly less impact loss at the same loading, so the boundary is a pressure pipe or a visible-surface profile rather than a buried drainage pipe. Below this grade, GCC-400 at 25-35 microns is too coarse for the polymer regardless of section.',
  },

  'gcc-800-for-paints-coatings-construction': {
    title: 'GCC-800 for Emulsion Paint | TiO₂ Extension',
    description:
      'How a 10-15 micron uncoated extender spaces titanium dioxide, and where scrub resistance stops the loading from going any further.',
    h1: 'GCC-800 in emulsion paints and TiO₂ extension',
    answerFirst:
      'GCC-800 is the extender grade in the KMIT range for water-borne emulsion paints. At a 10-15 micron median particle size (D50) it is fine enough to sit inside a dried paint film and space titanium dioxide particles so that more of the expensive pigment actually contributes to opacity, and it is uncoated, which is what a water-borne system needs.',
    cardSummary:
      'Extending the most expensive ingredient in a paint, and the scrub-resistance limit that decides how far the extension can go.',
    problem:
      'Titanium dioxide is almost always the largest single cost in an emulsion paint, and above a certain concentration much of it stops earning its place. Individual TiO₂ particles scatter light efficiently when they are separated by roughly half a wavelength; packed closer than that they interfere with one another and each additional particle returns less opacity than the one before it. That is crowding, and it means a paint can be made whiter and more expensive without being made more opaque. An extender addresses it directly by occupying volume between the pigment particles, so the same mass of TiO₂ does more work.',
    sizing:
      'A 10-15 micron D50 is fine enough to sit within a typical dried film without protruding through it, which is what keeps the surface smooth and the sheen even, and coarse enough to remain inexpensive and to keep binder demand moderate. In a matt or low-sheen paint applied at ordinary spreading rates, particles in this range distribute through the film thickness rather than sitting proud of it. Whiteness of 95.0-98.5% to ISO 2470 and Fe₂O₃ held to 0.03% or below are the values that decide whether the extender is optically neutral, which matters more here than in any other sector: an extender with a colour cast shifts every tint made from the base and is very difficult to correct downstream.',
    loading:
      'The governing concept is the critical pigment volume concentration, the loading at which there is exactly enough binder to fill the voids between all the solid particles. Below it the film is continuous, scrub resistance and stain resistance hold up, and opacity comes from the pigment. Above it the film contains air voids, which raises dry hiding and lowers the apparent cost of opacity, and scrub resistance, stain resistance and film integrity fall off sharply. Most economy paints sit above it deliberately and most premium paints sit below it deliberately. Where that point falls depends on the binder and on the oil absorption of the whole solids package, published here as 14-24 g/100g, rather than on any single recommended loading.',
    processing:
      'The uncoated surface is the correct specification for a water-borne system, and this is the one place in the range where that needs saying plainly. An untreated calcium carbonate particle is hydrophilic: it wets readily in the aqueous phase and disperses with the pigment. The stearic-acid-coated grades are engineered for the opposite environment, a polymer melt, and putting one into an emulsion paint gives a hydrophobic particle that resists wetting, floats and flocculates. At pH 8.5-9.5 this grade raises the pH of the paint, which suits ordinary acrylic and vinyl acetate binders and rules out acid-catalysed systems. Moisture at 0.20% or below is less critical in a water-borne product than elsewhere, but it still governs how the powder handles and stores before it reaches the dissolver.',
    versus:
      'GCC-400 at 25-35 microns is cheaper and appropriate in an economy matt paint where the film is thick, the sheen is low and scrub resistance is not being claimed. It cannot space TiO₂ as effectively, because the spacing benefit depends on the extender occupying volume at a scale comparable with the pigment. GCC-2500 at 1.8-2.5 microns is a genuine step up for gloss and film smoothness and is the grade for a high-quality coating, at a cost per tonne that an emulsion paint at this tier will not recover. GCC-1250 is not an alternative in this sector at all: it is coated, and the surface treatment is wrong for water.',
  },

  'gcc-1250-for-plastics-masterbatch': {
    title: 'GCC-1250 for Filler Masterbatch and PE Film',
    description:
      'Why 4.5-6.0 microns and a 0.8-1.2% stearic-acid coating are what make high filler loading possible in thin-gauge blown film.',
    h1: 'GCC-1250 in filler masterbatch, PE film and PVC fittings',
    answerFirst:
      'GCC-1250 is the grade the KMIT range is built around for filler masterbatch. Its 4.5-6.0 micron median particle size (D50) keeps the coarse tail of the distribution well below the gauge of a blown film, and its 0.8-1.2% stearic-acid surface treatment is what allows the filler to be loaded heavily into a polyolefin melt without the viscosity and dispersion penalties that would otherwise make the loading impossible.',
    cardSummary:
      'The flagship combination: how particle top cut and surface treatment together decide the maximum filler loading a film line can run.',
    problem:
      'A filler masterbatch exists to carry as much mineral as possible into a polymer at the converter, and every one of its problems follows from that. Calcium carbonate is a polar, hydrophilic mineral and polyethylene is a non-polar melt: the two have no natural affinity, so an untreated filler agglomerates, disperses badly and drives melt viscosity up steeply as loading rises. On a blown film line the consequences are immediate and visible. Agglomerates appear as gels, gels become print defects and web breaks, screw torque rises, output falls, and the die builds up and needs cleaning more often than the production schedule allows.',
    sizing:
      'The controlling relationship is between the coarse end of the particle size distribution and the film gauge, not between the D50 and anything. A blown film at 20 to 30 microns is only a few times thicker than the largest particles in a coarse grade, and any particle approaching the gauge is a hole rather than a filler. A 4.5-6.0 micron D50 with a controlled distribution keeps the whole population an order of magnitude below the film thickness, which is what makes high loading survivable in thin gauge. The same reasoning explains why this grade is also specified for PVC fittings: an injection-moulded fitting has a visible surface and thin ribs, and surface defects there come from the same coarse tail that spoils a film.',
    loading:
      'Two limits arrive before any recipe limit. The first is melt viscosity: filler raises it, the extruder has a finite torque and pressure envelope, and the loading stops where the machine stops. The second is bubble stability on a film line, where a highly filled melt has less strength and the bubble becomes harder to hold. The stearic-acid coating moves both limits outward, which is precisely what it is for, and it is the reason high-loading masterbatch is built on coated grades. Oil absorption of 14-24 g/100g indicates how much of the melt the filler surface will take up, and bulk density of 0.7-1.3 g/cm³ is what a gravimetric feeder needs. No loading percentage appears here because it belongs to the compound and the line, not to the filler.',
    processing:
      'The 0.8-1.2% stearic-acid treatment is not an optional upgrade at masterbatch loadings; it is what makes them work. The coating renders the particle surface organophilic, so it wets into the polymer instead of resisting it, which lowers melt viscosity at a given loading, reduces screw torque, improves dispersion and reduces die build-up. It carries one consequence that has to be planned for: coated grades have a 12 month shelf life against 24 months for the uncoated grades, because the surface treatment is what ages. Moisture at 0.20% or below matters more here than in most sectors, since water entering a polyolefin melt produces voids and surface defects and can force a drying step that the process was not designed around.',
    versus:
      'GCC-800 at 10-15 microns and uncoated is the grade below, and substituting it into a film application is the single most common and most expensive mistake in this sector. It is cheaper per tonne, and it brings a coarse tail that shows as gels and web breaks at thin gauge and an untreated surface that fights the melt and limits how much can be loaded before viscosity becomes unmanageable. It is a good grade in a millimetre-thick pipe wall for exactly the reasons it is a poor one here. GCC-2500 at 1.8-2.5 microns is the grade above and is worth its premium only where the gauge is thinner or the surface more demanding than this grade can serve.',
  },

  'gcc-2500-for-plastics-masterbatch': {
    title: 'GCC-2500 for Thin-Gauge Film and Fine Masterbatch',
    description:
      'Where a 1.8-2.5 micron coated grade earns its premium over GCC-1250, and the surface-area penalty that comes with the finer particle.',
    h1: 'GCC-2500 in high-specification masterbatch and thin-gauge film',
    answerFirst:
      'GCC-2500 is the finest grade in the KMIT range at a 1.8-2.5 micron median particle size (D50), stearic-acid coated at 0.8-1.2%. It is specified where the gauge or the surface requirement leaves no margin for the coarse tail of GCC-1250, and it costs more per tonne for reasons that are worth understanding before it is specified by default.',
    cardSummary:
      'What the finest grade buys over GCC-1250, what it costs in surface area and dispersion energy, and when not to specify it.',
    problem:
      'As film gauge falls and surface requirements tighten, the margin between the largest filler particles and the thickness of the material they sit in narrows until it disappears. A grade that runs cleanly at 30 microns starts producing visible defects at 12 or 15, and the defects are the same ones as before, gels, pinholes, print faults and web breaks, arriving at a loading that used to be safe. The instinct is to reduce the loading, which surrenders the economics the filler was there to deliver. The alternative is to restore the margin by making the particle smaller.',
    sizing:
      'A 1.8-2.5 micron D50 restores roughly a factor of two and a half against GCC-1250 in every dimension of that margin. In a thin-gauge film, that is the difference between a coarse tail that intrudes on the wall and one that remains comfortably inside it. In a high-gloss or high-clarity moulded part it is the difference between a surface that reads as filled and one that does not. What has to be understood alongside it is that surface area rises as particle size falls: halving the particle diameter roughly doubles the area a given mass presents to the polymer, and everything that scales with surface area scales with it.',
    loading:
      'This is the counterintuitive part of specifying the finest grade, and it is worth stating explicitly because it catches people out. Because surface area is higher, the same mass of GCC-2500 raises melt viscosity more than the same mass of GCC-1250, so the practical loading ceiling on a given line is usually lower, not higher. The finer grade buys defect margin at thin gauge, not more filler. It also demands more of the coating: a larger surface needs proportionally more stearic acid to reach the same degree of treatment, which is part of why the grade costs more. Oil absorption of 14-24 g/100g is a family figure and the fine grades sit at the top of that band rather than the bottom.',
    processing:
      'Dispersion energy is the thing to plan for. Finer particles agglomerate more readily because the attractive forces between them are larger relative to their mass, so the compounding step has to work harder to break agglomerates down, and an agglomerate that survives is more visible in the finished part than the same agglomerate would be in a thicker section. The 0.8-1.2% coating is doing more work here than at 1250 for the same reason. Shelf life is 12 months as for all coated grades, and moisture at 0.20% or below is critical: fine powders pick up moisture faster, and a filler that has been stored badly will show it on a thin-gauge line before it shows anywhere else.',
    versus:
      'GCC-1250 at 4.5-6.0 microns is the working grade for most masterbatch, and the honest recommendation is to specify it unless there is a reason not to. It costs less per tonne, tolerates a higher loading before viscosity becomes the limit, and disperses with less energy. GCC-2500 is the answer to a specific and identifiable problem: film below roughly 15 microns, a surface finish that has to hide the filler completely, or a defect count that will not come down at the loading the economics require. Specifying it as a general upgrade raises cost and lowers the achievable loading at the same time, which is the opposite of what a filler is for.',
  },

  'gcc-2500-for-paints-coatings-construction': {
    title: 'GCC-2500 for High-Gloss and Fine Coatings',
    description:
      'Why gloss is governed by particle top cut rather than by D50, and where a 1.8-2.5 micron coated grade belongs in a coating.',
    h1: 'GCC-2500 in high-gloss and fine industrial coatings',
    answerFirst:
      'GCC-2500 is the grade specified where a coating has to hold gloss. At a 1.8-2.5 micron median particle size (D50) its coarse tail stays below the scale at which particles disturb the surface of a dried film, which is what gloss depends on, and its 0.8-1.2% stearic-acid treatment suits the solvent-borne systems where fine coatings usually live.',
    cardSummary:
      'Gloss is a surface-roughness measurement: how the finest grade keeps the top cut below the scale that scatters light.',
    problem:
      'Gloss is not a property of a formulation so much as a measurement of the smoothness of its dried surface. A gloss meter reports how much light reflects specularly rather than scattering, and anything that disturbs the surface at a scale comparable with the wavelength of visible light lowers the reading. Filler particles that protrude through the film, or that sit close enough beneath it to deform its surface as it dries and shrinks, do exactly that. The result is a coating that is correctly formulated on paper, passes every other test, and reads as hazy or low in gloss when it is measured.',
    sizing:
      'The number that matters here is the top of the distribution rather than its middle, and this is the clearest case on the site where the D50 alone is the wrong thing to specify against. A 1.8-2.5 micron D50 with a controlled distribution keeps essentially the whole population well below the thickness of a typical coating film and below the scale at which surface disturbance reads as haze. Two other published values carry unusual weight in this sector. Whiteness of 95.0-98.5% to ISO 2470 sets how clean a white or a pale tint can be made, and Fe₂O₃ held to 0.03% or below is what keeps the extender from imparting a yellow cast that becomes visible precisely in the high-gloss white where it is least wanted.',
    loading:
      'Gloss falls before opacity does, and that ordering is what sets the ceiling. As extender loading rises the surface roughens gradually and the gloss reading drops well before any hiding or mechanical property has moved, so in a gloss coating the limit is reached earlier and more sharply than in a matt one. Oil absorption of 14-24 g/100g is the value to formulate against, and the fine grades sit at the top of that band because of their surface area, which means each unit of extender takes up more binder here than in a coarser grade. There is no recommended loading in the technical data and none is offered: the correct one is whatever holds the gloss specification on the actual binder system.',
    processing:
      'The stearic-acid coating is appropriate to the solvent-borne and high-solids systems that most fine industrial coatings use, where an organophilic surface wets into the resin readily. It is the wrong specification for a water-borne coating, where the hydrophobic surface resists the aqueous phase, and for those systems the uncoated grades are the correct choice. Dispersion equipment matters more at this fineness than at any coarser grade: fine particles agglomerate readily, and an agglomerate that survives the mill is a defect at exactly the scale that gloss measurement is sensitive to. Shelf life is 12 months, as for all coated grades, against 24 for the uncoated ones.',
    versus:
      'GCC-1250 at 4.5-6.0 microns is not offered into this sector in the KMIT range, so the real comparison from a coatings formulator is with GCC-800 at 10-15 microns, uncoated. That grade is the correct and considerably cheaper answer for matt and low-sheen emulsion paints, where surface roughness is not being minimised and the water-borne system needs an untreated surface anyway. The two grades are not competing for the same specification: one extends an economy emulsion, the other holds gloss in a fine coating, and choosing between them is a question about the coating rather than about the filler.',
  },
};
