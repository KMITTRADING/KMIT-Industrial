import type { Content } from '../schema';

/**
 * FAQ sets for the nine grade x sector pages, in English.
 *
 * These are the narrowest questions on the site, and they are the reason the
 * pages clear the thin-content bar rather than an ornament on top of it. A
 * question like "can I run the uncoated grade in blown film" has an answer that
 * neither the grade page nor the sector page can give, because each knows only
 * one half of it.
 *
 * Written to be extracted. An answer engine lifts a passage whole or not at
 * all, so each answer opens with the answer and then justifies it, and none
 * runs past the length a reader will accept as an answer rather than an
 * article.
 */
export const enSolutionFaqs: Content['solutionFaqs'] = {
  'gcc-200-for-oil-gas-drilling': {
    'size-for-formation': {
      question: 'How do I know if a 45-55 micron D50 is right for my formation?',
      answer:
        'Size the bridge against the pore throats, not against the permeability figure directly. The conventional starting point is a particle around one third of the throat diameter, with a distribution rather than a single size so the coarse fraction arches and the finer fraction seals behind it. GCC-200 is sized for the clastic reservoirs typically drilled in the region. If your formation sits outside that, the answer is a distribution matched to it, which is a conversation about the well rather than a different grade.',
    },
    'acid-cleanup': {
      question: 'How much of the bridge dissolves during acid cleanup?',
      answer:
        'The material is a minimum 98.5% CaCO₃, so the great majority of it dissolves in hydrochloric acid. The figure that decides what stays behind is the silica content: SiO₂ is held to 0.20% or below, and silica is acid-insoluble, so that fraction is what remains in the formation permanently. Purity and silica content are the two specification lines to compare when evaluating any bridging carbonate.',
    },
    'obm-suitability': {
      question: 'Is GCC-200 suitable for oil-based and synthetic muds as well as water-based?',
      answer:
        'Yes, and the technical data covers both. The bridging mechanism is mechanical and does not depend on the continuous phase. What changes in an oil-based or synthetic system is the interaction with the base fluid, where oil absorption of 14-24 g/100g indicates how much of the continuous phase the solid surface will take up. That affects rheology and should be accounted for in the mud design.',
    },
    'equipment-wear': {
      question: 'Will calcium carbonate damage mud pumps, bit nozzles or MWD tools?',
      answer:
        'Far less than a siliceous bridging solid. Calcium carbonate is Mohs 3.0 against roughly Mohs 7 for silica, and abrasion scales steeply with hardness relative to the surfaces being worn. That difference is one of the reasons carbonate is the default bridging solid in reservoir drilling fluids, alongside its acid solubility.',
    },
    'finer-grade': {
      question: 'Why not use a finer grade to be safe?',
      answer:
        'Because finer is not safer here, it is wrong. A particle sized below the pore throat passes the face and lodges inside the pore network, building an internal filter cake. That is the formation damage the bridging strategy exists to prevent, and it sits where acid cleanup reaches unevenly. GCC-400 at 25-35 microns is a good grade for other duties and is not a cautious substitute for this one.',
    },
    concentration: {
      question: 'What concentration should I run?',
      answer:
        'KMIT does not publish one, and any figure quoted without knowledge of the well would be a guess. The concentration is set by the fluid-loss target and by how much total solids the mud can carry before rheology and equivalent circulating density leave the drilling window. Bulk density of 0.7-1.3 g/cm³ is the published value that converts a designed concentration into a mixing plan.',
    },
  },

  'gcc-200-for-paints-coatings-construction': {
    'why-coarse': {
      question: 'Why specify the coarsest grade in the range for a construction product?',
      answer:
        'Because binder is the expensive component and surface area is what consumes it. At 45-55 microns this grade presents the least surface area per tonne in the range, so it takes up the least binder while adding the most volume. In a mortar, a screed or an asphalt mastic, where the finished surface will be covered or worn, there is nothing to gain from paying for a finer particle.',
    },
    'surface-finish': {
      question: 'Will GCC-200 show in a trowelled or rendered finish?',
      answer:
        'It can. Particles at 45-55 microns sit at or above the scale where a finished surface begins to read as textured rather than smooth. That is acceptable in a backing coat, a levelling layer or anything that will be overlaid, and it is the reason to move to GCC-400 at 25-35 microns where the surface is the deliverable.',
    },
    'cement-compatibility': {
      question: 'Is it compatible with cement chemistry?',
      answer:
        'Yes. At pH 8.5-9.5 the filler is alkaline, which is the environment cement hydration already occupies, so it is chemically at home rather than merely tolerated. The same alkalinity makes it unsuitable for acid-catalysed or acid-cure systems, where it will neutralise the catalyst.',
    },
    'asphalt-moisture': {
      question: 'Does moisture content matter in hot-mix asphalt?',
      answer:
        'It matters more than it looks. Moisture is held to 0.20% or below, and free water in a filler flashes to steam at mixing temperature, which foams the mastic and disrupts the binder film on the aggregate. Storage conditions matter as much as the specification: the material should be kept dry, ventilated and off the ground.',
    },
    'equipment-wear': {
      question: 'How does it affect wear on mixers and conveyors?',
      answer:
        'Favourably, compared with siliceous fillers. Mohs hardness is 3.0 against roughly 7 for silica, so wear on mixer blades, screw conveyors and pumps is substantially lower. It is a maintenance cost rather than a formulation property, and it tends to be noticed only when a harder filler is substituted.',
    },
    'batching-by-mass': {
      question: 'Our mix designs are volumetric. How do I convert to a weighed batch?',
      answer:
        'Bulk density of 0.7-1.3 g/cm³ is the published range to work from, and the width of that range is itself the point: it depends on how the material has been handled, settled and aerated. For anything where the tolerance is tight, use the measured value for the delivered material rather than the family range.',
    },
  },

  'gcc-400-for-paints-coatings-construction': {
    'why-middle-grade': {
      question: 'What does GCC-400 do that GCC-200 and GCC-800 do not?',
      answer:
        'It sits between two failure modes rather than optimising for either. At 25-35 microns it is below the size at which particles read as texture in a trowelled bed or a rolled film, and above the size at which surface area and binder demand start climbing steeply. It has no outstanding property, which is what a high-volume cost-driven formulation needs.',
    },
    'open-time': {
      question: 'Will the filler affect open time in a tile adhesive?',
      answer:
        'Yes, through surface area and water demand. A filler with more surface area takes up more of the mixing water and stiffens the adhesive sooner, which shortens open time and makes the bed harder to work. That is the practical reason a tile adhesive tolerates a coarser filler than a paint does, and why moving to a micronized grade here usually costs more than it returns.',
    },
    'scrub-resistance': {
      question: 'How far can I extend an emulsion paint before scrub resistance falls?',
      answer:
        'Until the critical pigment volume concentration, which is where there is exactly enough binder to fill the space between particles. Below it the film is continuous and scrub resistance holds; above it the film becomes porous, dry hiding rises and scrub resistance falls away quickly. Where the point sits depends on the binder and on the oil absorption of the whole solids package, published as 14-24 g/100g.',
    },
    'coated-in-paint': {
      question: 'Should I use a coated grade in a water-borne paint?',
      answer:
        'No. GCC-400 is uncoated and that is correct for water-borne systems: the untreated surface is hydrophilic and wets readily in the aqueous phase. The stearic-acid coated grades are engineered for a polymer melt, and in an emulsion paint the hydrophobic surface resists wetting, floats and flocculates.',
    },
    'tint-strength': {
      question: 'Does the extender affect tint strength or colour?',
      answer:
        'It sets a floor. Whiteness of 95.0-98.5% to ISO 2470 determines how clean a white or pale tint can be brought without additional pigment, and Fe₂O₃ at 0.03% or below is what keeps a yellow cast out of it. Both matter more in pale tints than in deep ones, where the colourant dominates.',
    },
    'dry-mix-storage': {
      question: 'Does moisture matter if the filler is bagged with cement?',
      answer:
        'Yes, and the constraint moves from the filler to the blend. Moisture is held to 0.20% or below, and in a dry-mix adhesive any free water starts hydrating the cement in the bag, which shortens the shelf life of the product rather than of the filler. Dry, ventilated, palletised storage is what the technical data specifies.',
    },
  },

  'gcc-400-for-rubber-elastomers': {
    reinforcing: {
      question: 'Is calcium carbonate a reinforcing filler in rubber?',
      answer:
        'No, and specifying it correctly starts with accepting that. It is semi-reinforcing: it adds hardness and volume at low cost, and it will not build the tensile and abrasion properties that carbon black or precipitated silica build. A compound that needs those will not get them from calcium carbonate at any particle size, which is also why paying for a finer grade here buys nothing.',
    },
    'tear-strength': {
      question: 'Why does a coarser grade reduce tear strength?',
      answer:
        'Because a filler particle that is large relative to the surrounding matrix acts as a stress concentrator. A tear propagating through the compound finds those particles as ready initiation and continuation points, so tear strength and fatigue life fall as the coarse tail of the distribution grows. That is the reason rubber is positioned at 25-35 microns rather than at the coarser grades.',
    },
    'why-not-finer': {
      question: 'Would a micronized grade give a better compound?',
      answer:
        'It would give a more difficult one. As particle size falls, surface area, mixing energy and compound viscosity all rise, and because calcium carbonate does not reinforce, none of that returns mechanical properties. The stearic-acid treatment on the micronized grades is designed for dispersion in a polymer melt, which is not what a rubber compound is short of.',
    },
    'cure-interaction': {
      question: 'Will the filler interfere with the cure system?',
      answer:
        'It can, and it should be checked rather than assumed. At pH 8.5-9.5 the filler is alkaline, so it interacts with acidic accelerator systems and can change cure rate. The practical approach is to evaluate the cure package against the filler in a trial compound rather than treating the two as independent.',
    },
    porosity: {
      question: 'We are seeing porosity in thick sections. Could the filler be the cause?',
      answer:
        'Moisture is the first thing to check. It is held to 0.20% or below on despatch, but a filler that has picked up water in storage will produce steam during cure, and the effect is worst in thick sections where it cannot escape. Storage is specified as cool, dry and ventilated, on pallets and away from ambient humidity, and in a humid coastal environment that is not a formality.',
    },
    'equipment-wear': {
      question: 'How does it compare with silica for equipment wear?',
      answer:
        'Considerably better. Mohs 3.0 against roughly 7 for silica means mixer rotors, extruder screws and dies wear much more slowly. In a high-volume compounding operation the difference appears in maintenance intervals rather than in any laboratory property, which is why it is easy to overlook when comparing fillers on a datasheet.',
    },
  },

  'gcc-800-for-plastics-masterbatch': {
    'uncoated-in-pvc': {
      question: 'Why is an uncoated grade acceptable in rigid PVC?',
      answer:
        'Because the process already does the work a coating would do. A PVC dry blend carries an internal and external lubricant package and goes through a high-shear mixing step designed to break down agglomerates and coat particles with it. The filler takes its dispersion from that process rather than from a surface treatment, which is why the uncoated grade performs here and struggles in a polyolefin film line.',
    },
    'film-substitution': {
      question: 'Can I use GCC-800 in blown film to save cost?',
      answer:
        'No, and it is the most expensive mistake in this sector. At 10-15 microns the coarse tail of the distribution is a significant fraction of a 25 micron film wall, so it shows as gels, print defects and web breaks, and the untreated surface limits how much can be loaded before melt viscosity becomes unmanageable. GCC-1250 exists for that application.',
    },
    'impact-strength': {
      question: 'How much filler can I add before impact strength suffers?',
      answer:
        'That limit belongs to the compound rather than to the filler, and it depends on the impact modifier, the processing aid package and the fusion level far more than on the calcium carbonate. There is a second limit on the line itself: filler changes frictional heat generation in a dry blend, so a formulation that fuses correctly at one loading may under-fuse or over-fuse at another.',
    },
    'hcl-scavenging': {
      question: 'Does the filler help with thermal stability?',
      answer:
        'Secondarily, yes. At pH 8.5-9.5 the filler is alkaline and will scavenge hydrogen chloride released as PVC degrades. It is a genuine effect rather than a marketing claim, and it is not a substitute for a stabiliser package: the filler is not dosed or distributed for that purpose.',
    },
    'plate-out': {
      question: 'We have plate-out on the die. Is the filler involved?',
      answer:
        'It can be, through moisture. Moisture is held to 0.20% or below, and water in a PVC melt produces voids and contributes to deposits at the die. Plate-out has several causes and the lubricant and stabiliser package is usually the dominant one, so the filler is worth eliminating as a variable rather than assuming as a cause.',
    },
    'cable-compounds': {
      question: 'Is the same grade appropriate for cable compounds?',
      answer:
        'Yes, and it is listed for both. Cable sheathing is a filled extrusion with wall thicknesses comparable to pipe, so the same relationship between particle size and section holds. Where a cable specification adds electrical requirements, purity is the relevant line: the material is a minimum 98.5% CaCO₃ with Fe₂O₃ at 0.03% or below.',
    },
  },

  'gcc-800-for-paints-coatings-construction': {
    'tio2-spacing': {
      question: 'How does an extender reduce titanium dioxide consumption?',
      answer:
        'By occupying volume between the pigment particles. TiO₂ scatters light efficiently only when particles are separated by roughly half a wavelength; packed closer they interfere and each additional particle returns less opacity. An extender at a comparable scale spaces them, so the same mass of pigment does more work. That is why extender particle size, not just extender loading, affects how much TiO₂ can be removed.',
    },
    'cpvc-limit': {
      question: 'What sets the maximum extender loading?',
      answer:
        'The critical pigment volume concentration: the loading at which there is exactly enough binder to fill the voids between all solid particles. Below it the film is continuous and scrub and stain resistance hold. Above it the film contains air voids, dry hiding rises and those properties fall away sharply. Economy paints often sit above it deliberately and premium paints below it deliberately.',
    },
    'coated-grade': {
      question: 'Can I use a stearic-acid coated grade in an emulsion paint?',
      answer:
        'No. The coating makes the particle hydrophobic, which is exactly right in a polymer melt and exactly wrong in water: it resists wetting, floats and flocculates. The uncoated grades are the correct specification for any water-borne system, and this is the clearest case in the range where the coating is a disqualifier rather than an upgrade.',
    },
    'colour-neutrality': {
      question: 'Will the extender shift the colour of my tints?',
      answer:
        'It can if its iron content is high, which is why Fe₂O₃ at 0.03% or below matters more in this sector than in most. Whiteness of 95.0-98.5% to ISO 2470 sets how clean a white can be brought. A cast in the extender shifts every tint made from the base and is very difficult to correct downstream, so it is worth checking on the certificate of analysis rather than assuming.',
    },
    'film-roughness': {
      question: 'Will a 10-15 micron particle roughen the film?',
      answer:
        'Not in a matt or low-sheen paint at normal spreading rates, where particles in this range sit within the film thickness rather than protruding. In a gloss coating the answer changes, because gloss is a measurement of surface smoothness and is sensitive to exactly this scale. That is where the finer grades belong.',
    },
    'ph-compatibility': {
      question: 'Does the filler affect paint pH?',
      answer:
        'Yes, it raises it. At pH 8.5-9.5 the filler suits ordinary acrylic and vinyl acetate emulsions, which are formulated alkaline anyway, and rules out acid-catalysed systems. It is also worth accounting for when selecting thickeners and biocides, some of which are pH sensitive.',
    },
  },

  'gcc-1250-for-plastics-masterbatch': {
    'coating-necessity': {
      question: 'Is the stearic-acid coating necessary, or is it an upgrade?',
      answer:
        'At masterbatch loadings it is necessary. Calcium carbonate is polar and polyethylene is not, so an untreated filler agglomerates and drives melt viscosity up steeply as loading rises. The 0.8-1.2% treatment makes the surface organophilic, which lowers viscosity at a given loading, reduces screw torque, improves dispersion and reduces die build-up. High-loading masterbatch is built on coated grades for that reason.',
    },
    'gauge-relationship': {
      question: 'How do I know the particle size is fine enough for my film gauge?',
      answer:
        'Compare the coarse end of the distribution with the gauge, not the D50. A film at 20 to 30 microns is only a few times thicker than the largest particles in a coarse grade, and any particle approaching the gauge is a hole rather than a filler. A 4.5-6.0 micron D50 with a controlled distribution keeps the population an order of magnitude below that thickness.',
    },
    'shelf-life': {
      question: 'Why is the shelf life 12 months rather than 24?',
      answer:
        'Because the surface treatment is what ages. Uncoated grades carry 24 months and coated grades 12, and the difference is the stearic acid rather than the carbonate underneath it. Stock rotation matters more with coated grades, and material stored beyond its shelf life should be assessed for dispersion behaviour rather than assumed to be equivalent.',
    },
    'maximum-loading': {
      question: 'What is the maximum loading I can run?',
      answer:
        'It is set by the line rather than by the filler. Two limits arrive first: melt viscosity against the extruder torque and pressure envelope, and bubble stability on a film line, where a highly filled melt has less strength. The coating moves both outward, which is what it is for. No percentage is published because it belongs to the compound and the machine.',
    },
    'moisture-defects': {
      question: 'We are getting surface defects. Could moisture be the cause?',
      answer:
        'It is worth checking early. Moisture is held to 0.20% or below on despatch, and water entering a polyolefin melt produces voids and surface defects. Coated fine powders stored in a humid environment can exceed that, and the failure appears on thin gauge before anywhere else. Storage is specified as cool, dry and ventilated, on pallets.',
    },
    'pvc-fittings': {
      question: 'Why is the same grade listed for PVC fittings as for film?',
      answer:
        'Because both are governed by the coarse tail rather than by section thickness alone. An injection-moulded fitting has a visible surface and thin ribs, and surface defects there originate from the same large particles that spoil a film. The requirement they share is a distribution with nothing coarse in it.',
    },
  },

  'gcc-2500-for-plastics-masterbatch': {
    'when-to-specify': {
      question: 'When is GCC-2500 worth the premium over GCC-1250?',
      answer:
        'When there is an identifiable problem it solves: film below roughly 15 microns, a surface finish that has to hide the filler completely, or a defect count that will not come down at the loading the economics require. Specified as a general upgrade it raises cost and lowers the achievable loading at the same time, which is the opposite of what a filler is for.',
    },
    'lower-loading': {
      question: 'Why would the finest grade allow a lower loading, not a higher one?',
      answer:
        'Because surface area rises as particle size falls. Halving the particle diameter roughly doubles the area a given mass presents to the polymer, and melt viscosity scales with that area. So the same mass of GCC-2500 raises viscosity more than GCC-1250 and the practical ceiling on a given line is usually lower. The finer grade buys defect margin at thin gauge, not more filler.',
    },
    'coating-demand': {
      question: 'Does the finer grade need more surface treatment?',
      answer:
        'Proportionally, yes. A larger surface area needs more stearic acid to reach the same degree of treatment, and the coating range is 0.8-1.2% for both coated grades. That is part of why the finer grade costs more per tonne, alongside the additional milling and classification.',
    },
    dispersion: {
      question: 'Do I need to change my compounding step?',
      answer:
        'Plan for more dispersion energy. Finer particles agglomerate more readily because attractive forces between them are larger relative to their mass, so agglomerates take more work to break down. An agglomerate that survives is also more visible in a thin section than the same agglomerate would be in a thick one, so the tolerance for incomplete dispersion is lower.',
    },
    'storage-sensitivity': {
      question: 'Is the finest grade more sensitive to storage?',
      answer:
        'Yes, on both counts that matter. Fine powders pick up moisture faster relative to their mass, and the specification of 0.20% or below applies on despatch rather than indefinitely. Shelf life is 12 months as for all coated grades. Poorly stored material shows on a thin-gauge line before it shows anywhere else.',
    },
    'clarity-applications': {
      question: 'Can it be used where clarity matters?',
      answer:
        'It is the best grade in the range for it, and clarity still needs to be tested rather than assumed. Calcium carbonate has a different refractive index from polyethylene, so any loading scatters some light. What the fine grade removes is the visible defect, not the haze that comes from the filler being present at all.',
    },
  },

  'gcc-2500-for-paints-coatings-construction': {
    'gloss-mechanism': {
      question: 'Why does particle size affect gloss?',
      answer:
        'Because gloss is a measurement of surface smoothness. A gloss meter reports how much light reflects specularly rather than scattering, and anything disturbing the surface at a scale comparable with the wavelength of visible light lowers the reading. Filler particles that protrude through the film, or sit close enough beneath it to deform it as it dries and shrinks, do exactly that.',
    },
    'top-cut-not-d50': {
      question: 'Should I specify against the D50 or something else?',
      answer:
        'Against the coarse end of the distribution. This is the clearest case in the range where the D50 alone is the wrong thing to specify: a grade can have an acceptable median and still carry enough coarse material to cost gloss. A 1.8-2.5 micron D50 with a controlled distribution is what keeps the whole population below the scale that reads as haze.',
    },
    'water-borne': {
      question: 'Can I use this grade in a water-borne coating?',
      answer:
        'It is not the right choice. The stearic-acid coating suits solvent-borne and high-solids systems, where an organophilic surface wets into the resin readily. In a water-borne coating the hydrophobic surface resists the aqueous phase, and the uncoated grades are the correct specification there.',
    },
    'gloss-before-opacity': {
      question: 'What limits how much extender I can use in a gloss coating?',
      answer:
        'Gloss, and it moves before anything else does. As extender loading rises the surface roughens gradually and the gloss reading falls well before hiding or any mechanical property has shifted. That makes the limit both earlier and sharper than in a matt coating, and it is why a gloss formulation cannot be extended on the same reasoning as an emulsion paint.',
    },
    'colour-cast': {
      question: 'How do I avoid a yellow cast in a high-gloss white?',
      answer:
        'Check the iron content. Fe₂O₃ is held to 0.03% or below and whiteness is 95.0-98.5% to ISO 2470. A cast becomes visible precisely in a high-gloss white, where there is no texture to hide it and no colourant to dominate it, so this is the sector where those two lines on the certificate of analysis are worth reading rather than filing.',
    },
    'dispersion-equipment': {
      question: 'Does this grade need different dispersion equipment?',
      answer:
        'It needs adequate equipment, and the tolerance is narrower than at coarser grades. Fine particles agglomerate readily, and an agglomerate that survives the mill is a defect at exactly the scale gloss measurement is sensitive to. A gloss reading that will not come up is more often incomplete dispersion than an incorrect grade.',
    },
  },
};
