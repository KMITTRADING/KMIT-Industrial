import { POLYMER_IDS } from '../schema';

import type { PolymerId } from '../schema';

/**
 * Nominal densities for the filler loading calculator.
 *
 * **None of this is KMIT data and none of it belongs in
 * `docs/technical-data.md`.** These are published nominal densities for the
 * polymers themselves, of the same kind as the Mohs hardness values in the
 * filler comparison guide: textbook constants a formulator already knows, put
 * here so the calculator has a starting point rather than an empty field.
 *
 * Every one is editable in the interface, and it should be. A specific grade of
 * HDPE is not 0.955, it is whatever its datasheet says, and a formulator with
 * that number in front of them should use it.
 *
 * The calcium carbonate figure is the one to be careful about, and it is the
 * reason this file has a long comment. `docs/technical-data.md` §2 publishes a
 * **bulk density** of 0.7 to 1.3 g/cm³, which is poured powder including the
 * air between the particles. Using that in a volume calculation would be wrong
 * by roughly a factor of three, because once the filler is dispersed in a melt
 * the air is gone and what matters is the density of the mineral itself.
 * Calcite is close to 2.7 g/cm³, and that is what a compound's density is
 * calculated from.
 */

export type Polymer = {
  id: PolymerId;
  /** Nominal density, g/cm³. Published property of the polymer, not of a KMIT product. */
  density: number;
};

export const POLYMERS: Polymer[] = [
  { id: 'ldpe', density: 0.923 },
  { id: 'hdpe', density: 0.955 },
  { id: 'pp', density: 0.905 },
  { id: 'rigid-pvc', density: 1.4 },
  { id: 'flexible-pvc', density: 1.3 },
];

/**
 * Density of calcite, g/cm³.
 *
 * The mineral's own density, not the bulk density on the technical data sheet.
 * See the note above; confusing the two is the single easiest way to make this
 * calculator produce a confidently wrong answer.
 */
export const CALCITE_DENSITY = 2.7;

export function findPolymer(id: string): Polymer | undefined {
  return POLYMERS.find((polymer) => polymer.id === id);
}

if (POLYMERS.length !== POLYMER_IDS.length) {
  throw new Error('POLYMERS must carry one entry per POLYMER_IDS entry.');
}
