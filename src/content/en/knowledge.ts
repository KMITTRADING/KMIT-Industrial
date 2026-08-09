import type { Content } from '../schema';

/**
 * The technical articles, in English.
 *
 * Each one explains a number that is already published on the grade pages, and
 * that constraint is what keeps the hub from becoming a blog. An article about
 * particle size distribution earns its place because every grade page states a
 * D50 and none of them has room to say what a D50 is and is not. An article
 * about, say, sustainability in mining would have nothing behind it here.
 */
export const enKnowledge: Content['knowledge'] = {
  'reading-a-particle-size-distribution': {
    title: 'Reading a Particle Size Distribution | D50 Explained',
    description:
      'What D50 tells you about a mineral filler, what it hides, and why the coarse end of the distribution decides more outcomes than the median does.',
    h1: 'How to read a particle size distribution',
    cardSummary:
      'What the D50 on a datasheet actually says, and why the number that causes defects is usually the one nobody quotes.',
    answerFirst:
      'D50 is the median particle size: half the material by volume is finer, half is coarser. It is the number every filler datasheet leads with, including this one, and on its own it is not enough to specify against. Two grades can share a D50 and behave completely differently, because what causes a defect is usually the coarse end of the distribution rather than its middle.',
    s1Heading: 'What the D50 actually is',
    s1Body:
      'A milled mineral is not one particle size, it is a population spanning perhaps two orders of magnitude, and a distribution curve describes how much of the material sits at each size. D50 is the midpoint of that curve by volume: half the material is finer than it and half is coarser. It is a useful single number precisely because it is a summary, and it carries the same limitation every summary does. The published range for GCC-1250 is 4.5 to 6.0 microns, which tells you where the middle of the population sits and tells you nothing at all about how wide the population is or what the largest particles in it are doing.',
    s2Heading: 'Why the coarse end decides more than the median',
    s2Body:
      'Almost every defect a filler causes is caused by its largest particles rather than by its typical ones. A blown film fails where a particle approaches the film thickness, so a 25 micron film is at risk from anything near 25 microns regardless of what the median is. A gloss coating loses gloss where a particle disturbs the surface, which is a top-cut question. A drilling fluid bridges where particles arch across a pore throat, which is the one case in the range where the coarse fraction is the functional part rather than the liability. In all three the median is a poor predictor and the top of the distribution is a good one, which is why two grades with the same D50 and different distribution widths are not interchangeable.',
    s3Heading: 'Where the median is the right number',
    s3Body:
      'The median earns its place when the property in question scales with the bulk of the material rather than with its extremes. Surface area, and therefore binder demand and oil absorption, is dominated by the fine end and tracks the median closely enough to be useful. Cost per unit of volume filled behaves the same way. So does the broad question of which grade band a formulation belongs in: a process that needs single-digit microns is a different conversation from one that needs tens of microns, and D50 settles that in one number. The mistake is not using the median. It is using the median to answer a question about the extremes.',
    s4Heading: 'What to ask for when it matters',
    s4Body:
      'If a defect is size-related, the D50 will not diagnose it and asking for a finer grade may not fix it. Ask for the distribution rather than the median: the full curve if it is available, or the d97 and d98 figures, which state the size below which 97 or 98 percent of the material sits and are therefore a direct measure of the coarse tail. Ask which method produced it, since laser diffraction and sedimentation do not report identical numbers for the same powder and comparing across methods introduces a difference that is not in the material. And state the constraint that matters, the film gauge or the wall thickness or the gloss target, because that is what a particle size has to be chosen against.',
    tableHeading: 'The published range',
    tableIntro:
      'Median particle size for each grade, with the mesh designation it corresponds to. These are medians, and the section above is about what that means.',
  },

  'what-whiteness-r457-measures': {
    title: 'What Whiteness R457 Measures | ISO 2470',
    description:
      'Why a mineral filler is measured for brightness at 457 nanometres, what the ISO 2470 number governs, and where it stops mattering.',
    h1: 'What whiteness R457 measures, and what it does not',
    cardSummary:
      'The ISO 2470 brightness figure, what the 457 nanometre wavelength is for, and which formulations it actually constrains.',
    answerFirst:
      'Whiteness R457 is a reflectance measurement taken at a wavelength of 457 nanometres, in the blue part of the visible spectrum, to ISO 2470. The published range for this product family is 95.0 to 98.5 percent. It is not a measure of how white the material looks in general; it is a measure of one specific thing, and knowing which thing tells you when to care about it.',
    s1Heading: 'Why 457 nanometres',
    s1Body:
      'The wavelength is not arbitrary. Blue light at around 457 nanometres is where a yellow cast shows up most sharply, because a yellowish material absorbs blue and reflects the rest. Measuring reflectance there rather than across the whole spectrum turns a subtle discolouration into a number that moves. The method comes from the paper industry, which cared about this before anyone else did, and it carries the industry convention of calling the result brightness rather than whiteness even though both terms are used. A material can be bright by this measure and still not read as neutral white to the eye, because the eye integrates the whole spectrum and the instrument does not.',
    s2Heading: 'What the number governs',
    s2Body:
      'It sets a floor on the palest thing a formulation can be made without adding white pigment. An extender at 95 percent brightness in a paint base means every pale tint made from that base starts slightly darker and slightly warmer than one made from a brighter extender, and no amount of colourant recovers it: adding pigment to correct a cast changes the tint rather than restoring it. The same logic applies to a masterbatch carrier and to a paper coating. Where the finished product is deeply coloured, the extender contributes almost nothing to the perceived colour and the brightness figure stops constraining anything.',
    s3Heading: 'The number that usually explains it',
    s3Body:
      'When brightness is lower than expected the cause is normally iron. Fe₂O₃ is held to 0.03 percent or below in this family, and that limit is doing more work for the appearance of a pale formulation than the brightness figure itself, because iron oxide is what produces the yellow to reddish cast that a 457 nanometre measurement is designed to catch. Two other entries in the same table bear on it: SiO₂ at 0.20 percent or below and MgO at 0.40 percent or below are limits on the non-carbonate fraction generally, and a material running near the top of those limits is a material with more of something in it that is not calcium carbonate.',
    s4Heading: 'How to use it when comparing suppliers',
    s4Body:
      'Compare like with like, which is harder than it sounds. Confirm the method is ISO 2470 and not one of the several other brightness scales, because the numbers are not interchangeable and a figure quoted without a method is not a specification. Ask whether the figure is typical or guaranteed, since a range of 95.0 to 98.5 describes a family and a certificate of analysis describes the batch that will actually arrive. And check the iron figure alongside it rather than instead of it: brightness tells you where the material sits today and the iron limit tells you how much variation the process allows.',
    tableHeading: 'Where the figure sits',
    tableIntro:
      'The published family properties, each with the test method that produced it. Whiteness and Fe₂O₃ are the two rows this article is about.',
  },

  'oil-absorption-in-a-formulation': {
    title: 'Oil Absorption and What It Costs a Formulation',
    description:
      'What the ISO 787-5 oil absorption figure measures, why it sets the practical ceiling on filler loading, and how it interacts with cost.',
    h1: 'Oil absorption, and what it costs a formulation',
    cardSummary:
      'The one property that decides how much filler a formulation can carry before the binder runs out.',
    answerFirst:
      'Oil absorption measures how much liquid a mineral surface takes up before the powder turns from loose to a coherent paste, reported in grams per hundred grams to ISO 787-5. The published range for this family is 14 to 24. It is the single most useful number for predicting how a filler will behave at loading, because it governs how much binder, plasticiser or resin each unit of filler removes from the formulation.',
    s1Heading: 'What the test does',
    s1Body:
      'A known mass of powder is worked on a plate while oil is added drop by drop, until the mass just forms a coherent paste that does not crumble or smear. The quantity of oil at that point, per hundred grams of powder, is the oil absorption. It is a deliberately simple test and its simplicity is the point: it produces a number that correlates with real formulation behaviour without needing to model the surface directly. What it is really measuring is surface area plus the volume of the voids between the particles, which together determine how much liquid has to be present before every particle is wetted and the spaces between them are filled.',
    s2Heading: 'Why it sets the loading ceiling',
    s2Body:
      'Every unit of filler added to a formulation displaces binder, which is the saving, and simultaneously demands some binder to wet its own surface, which is the cost. Oil absorption is the exchange rate between those two. A filler with low oil absorption gives back most of the binder it displaces and can be loaded heavily before the formulation runs dry; a filler with high oil absorption takes much of it straight back and reaches the same point sooner. This is why the practical ceiling is rarely the number in a recipe: it is where viscosity, workability or the critical pigment volume concentration is reached, and all three are downstream of oil absorption.',
    s3Heading: 'How particle size moves it',
    s3Body:
      'Oil absorption rises as particle size falls, and it rises faster than intuition suggests, because surface area scales with the inverse of particle diameter. Halving the median particle size roughly doubles the area a given mass presents. That is why the coarse grades in a range sit at the bottom of a published oil absorption band and the micronized grades sit at the top, and why a finer grade both costs more per tonne and can be loaded less far before viscosity binds. A published family range of 14 to 24 is wide for exactly this reason: it spans a range of grades from 45 microns down to under 2.',
    s4Heading: 'Where it surprises people',
    s4Body:
      'The first surprise is that surface treatment changes it. A stearic acid coating alters how the surface interacts with an organic medium, so the figure obtained in an oil absorption test is not always a reliable guide to the same powder in a polymer melt, where the coating is doing its work. The second is that it is not a proxy for quality. A high oil absorption is not a defect; it is a property of fine particles, and a formulation that needs fine particles has to budget for it. The third is that it interacts with cost in the opposite direction to the one people expect: the cheaper coarse grade is also the one that leaves more binder in the formulation, so the coarse grade wins twice wherever the process tolerates it.',
    tableHeading: 'The published figure',
    tableIntro:
      'Family-level properties with their test methods. Oil absorption to ISO 787-5 is the row this article is about; bulk density sits next to it and is a different measurement.',
  },

  'moisture-and-shelf-life': {
    title: 'Moisture and Shelf Life in Coated Grades',
    description:
      'Why surface-coated calcium carbonate carries 12 months against 24 for uncoated, and what moisture does in a melt before it becomes visible.',
    h1: 'Moisture and shelf life in coated grades',
    cardSummary:
      'Why the coated grades carry half the shelf life, and what a wet filler does on a line before anyone sees it.',
    answerFirst:
      'Uncoated grades carry a 24 month shelf life and surface-coated grades carry 12. The difference is not the calcium carbonate, which is a mineral and does not age, but the stearic acid treatment on its surface. Moisture is specified at 0.20 percent or below, and that figure applies on despatch rather than indefinitely, which is why storage conditions are part of the specification rather than advice attached to it.',
    s1Heading: 'Why coated grades carry half the shelf life',
    s1Body:
      'The coating is the part with a lifespan. A stearic acid layer at 0.8 to 1.2 percent is what makes the particle organophilic, and it is a thin organic film on a mineral surface: it can migrate, it can be disturbed by heat during storage, and its effectiveness is what degrades rather than the carbonate underneath it. A coated grade past its shelf life is not contaminated and is not dangerous. It is a grade whose dispersion behaviour can no longer be assumed to match the specification, which matters most in exactly the applications coated grades are bought for, where dispersion is the reason for the premium.',
    s2Heading: 'What moisture does before you see it',
    s2Body:
      'Water entering a polymer melt flashes to steam, and the consequences appear as defects with other plausible explanations. In a film it produces voids and surface marks that look like dispersion faults. In rigid PVC it contributes to voids and to plate-out at the die, both of which are usually blamed on the lubricant package first. In a rubber compound it produces porosity during cure, worst in thick sections where the steam cannot escape. In hot-mix asphalt it foams the mastic at mixing temperature. The pattern is consistent: moisture rarely announces itself, and it is worth eliminating as a variable early rather than after the third formulation change.',
    s3Heading: 'Why fine powders are the sensitive ones',
    s3Body:
      'Moisture pickup scales with surface area, so the same storage conditions load a fine powder faster than a coarse one relative to its mass. That puts the finest grades in the range at the highest risk and it compounds unhelpfully with what those grades are used for: thin-gauge film and high-gloss coatings are also the applications where a small defect is visible. A poorly stored micronized grade will show on a thin-gauge line before it shows anywhere else in a plant, which means the first symptom often appears in the process least able to tolerate it.',
    s4Heading: 'What the storage specification is for',
    s4Body:
      'Cool, dry, ventilated, on pallets, out of direct sunlight and away from ambient humidity. In a Gulf coastal environment that is not a formality: ambient humidity is high for much of the year, and a warehouse that is merely under a roof is not the same as one that is dry. Two practical consequences follow. Stock rotation matters more with coated grades than with uncoated ones, because the shorter shelf life leaves less room for a slow-moving pallet. And material stored past its date is worth assessing rather than either discarding or assuming: the question is whether it still disperses to specification, and that is answered by a trial rather than by the date on the bag.',
    tableHeading: 'Shelf life by grade',
    tableIntro:
      'The published grade table. The shelf-life column follows directly from whether the grade is surface treated: 24 months uncoated, 12 months coated.',
  },
};

export const enKnowledgeFaqs: Content['knowledgeFaqs'] = {
  'reading-a-particle-size-distribution': {
    'same-d50': {
      question: 'Can two grades share a D50 and behave differently?',
      answer:
        'Yes, and that is the main reason to look past the median. Two grades with the same D50 can have very different distribution widths, and the wider one carries more coarse material. If a defect is caused by the largest particles, which most size-related defects are, the two will not perform the same way in the same process.',
    },
    'd97-meaning': {
      question: 'What do d97 and d98 mean?',
      answer:
        'They state the size below which 97 or 98 percent of the material sits, by volume. Because they sit near the top of the distribution they are a direct measure of the coarse tail, which is what a film gauge or a gloss target is actually constrained by. They are the figures to ask for when the median is not diagnosing the problem.',
    },
    'method-differences': {
      question: 'Do different measurement methods give the same number?',
      answer:
        'No. Laser diffraction and sedimentation report different values for the same powder, because they infer size from different physical properties. Comparing a figure from one method with a figure from another introduces a difference that is not in the material, so the method belongs with the number in any specification.',
    },
    'finer-is-safer': {
      question: 'If in doubt, is a finer grade the safer choice?',
      answer:
        'Not always, and in one case in this range it is actively wrong. Bridging in a drilling fluid depends on particles being coarse enough to arch across pore throats, so a finer grade passes through and causes the formation damage it was meant to prevent. Elsewhere finer usually raises cost and oil absorption without solving the problem, if the problem is not size-related.',
    },
  },

  'what-whiteness-r457-measures': {
    'brightness-vs-whiteness': {
      question: 'Is brightness the same as whiteness?',
      answer:
        'They are used interchangeably in practice and they are not identical concepts. Brightness to ISO 2470 is reflectance at a single blue wavelength; whiteness in the broader sense describes how neutral a material appears across the visible spectrum. A material can score well at 457 nanometres and still not read as neutral to the eye.',
    },
    'when-it-matters': {
      question: 'Does the brightness figure matter in a coloured product?',
      answer:
        'Much less. In a deeply coloured formulation the colourant dominates and the extender contributes almost nothing to the perceived colour. It matters most in whites and pale tints, where there is nothing to hide a cast, and most of all in a high-gloss white where there is no texture to break up the surface either.',
    },
    'iron-link': {
      question: 'Why does the iron content matter if brightness is already specified?',
      answer:
        'Because iron is usually the cause rather than a separate property. Fe₂O₃ at 0.03 percent or below is the limit on what produces a yellow to reddish cast, and it constrains how much the brightness can vary between batches. Brightness tells you where the material sits; the iron limit tells you how much room the process leaves.',
    },
    'typical-vs-guaranteed': {
      question: 'Is 95.0 to 98.5 percent a guarantee?',
      answer:
        'It is a typical range for the product family, published with its test method. The figure that describes a specific delivery is on the certificate of analysis issued for that production batch. When brightness is critical to a formulation, specify against the certificate rather than against the family range.',
    },
  },

  'oil-absorption-in-a-formulation': {
    'what-unit-means': {
      question: 'What does 14 to 24 g/100g actually mean?',
      answer:
        'Grams of oil taken up per hundred grams of powder before the mixture forms a coherent paste, measured to ISO 787-5. A grade at 14 takes up less liquid per unit mass than one at 24, so it removes less binder from a formulation at the same loading and can usually be loaded further.',
    },
    'why-a-range': {
      question: 'Why is the published range so wide?',
      answer:
        'Because it covers the whole family, from a 45 to 55 micron grade to one at 1.8 to 2.5 microns. Oil absorption rises as particle size falls, since surface area scales with the inverse of diameter, so the coarse grades sit near the bottom of the band and the micronized grades near the top.',
    },
    'coating-effect': {
      question: 'Does the stearic acid coating change oil absorption?',
      answer:
        'It changes how the surface interacts with an organic medium, so the figure from an oil absorption test is not always a reliable guide to how the same powder behaves in a polymer melt, where the coating is doing its work. Use it as an indicator for the uncoated case and validate coated grades in the actual compound.',
    },
    'high-is-bad': {
      question: 'Is a high oil absorption a defect?',
      answer:
        'No. It is a property of fine particles and follows from the surface area a fine grade necessarily has. A formulation that needs a fine particle has to budget for the binder demand that comes with it. It is a reason to prefer a coarser grade wherever the process tolerates one, not a reason to reject a fine grade that the process requires.',
    },
  },

  'moisture-and-shelf-life': {
    'why-half': {
      question: 'Why do coated grades carry 12 months rather than 24?',
      answer:
        'Because the stearic acid treatment is the part that ages, not the carbonate. A thin organic film on a mineral surface can migrate and can be disturbed by heat in storage, and it is the dispersion behaviour it provides that degrades. The mineral underneath is unchanged.',
    },
    'past-shelf-life': {
      question: 'Is material past its shelf life unusable?',
      answer:
        'Not necessarily, and it should be assessed rather than assumed either way. It is not contaminated or unsafe. The open question is whether it still disperses to specification, which matters most in the applications coated grades are bought for. A trial in the actual compound answers it; the date on the bag does not.',
    },
    'moisture-symptoms': {
      question: 'How would I know moisture is the cause of a defect?',
      answer:
        'You often would not at first, which is the difficulty. Water in a melt produces voids, surface marks and plate-out that look like dispersion or lubricant faults, and porosity in a cured rubber section that looks like a cure problem. Because it is cheap to eliminate as a variable, it is worth checking early rather than after several formulation changes.',
    },
    'storage-in-humidity': {
      question: 'How much does storage really matter in a humid climate?',
      answer:
        'Enough to be part of the specification rather than advice next to it. The 0.20 percent moisture limit applies on despatch, not indefinitely, and ambient humidity in a Gulf coastal environment is high for much of the year. Fine powders take up moisture faster relative to their mass, so the finest grades are the ones storage conditions bind hardest.',
    },
  },
};
