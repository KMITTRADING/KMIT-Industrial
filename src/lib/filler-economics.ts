import { CALCITE_DENSITY } from '@/content/data/polymers';

/**
 * The arithmetic behind the filler loading calculator.
 *
 * Kept out of the component so it can be tested directly, and because the one
 * thing this tool has to get right is the part nobody looks at.
 *
 * **What makes this worth publishing.** A filler is bought and dosed by weight,
 * and a moulded or extruded part is sold by volume: a pipe of a given length, a
 * film of a given area and gauge, a bottle of a given capacity. Calcium
 * carbonate is roughly three times denser than polyethylene, so filling by
 * weight makes every tonne of compound occupy less space. A saving that looks
 * like 25% on a cost-per-tonne basis can be closer to 7% per litre of finished
 * part, and the gap widens as loading rises.
 *
 * Naive filler calculators report the first number. It is the one that makes the
 * filler look best and it is not the one that reaches the profit and loss
 * account. This module reports both, and the honest one second, because that is
 * the one a formulator has to defend internally.
 *
 * **No price data is embedded here or anywhere else in this repository.** Both
 * costs are supplied by whoever is using the tool. `docs/technical-data.md` has
 * no price, KMIT does not publish one, and a calculator that invented an
 * indicative filler price to make its own output look better would be exactly
 * the kind of claim this site does not make.
 */

export type FillerEconomicsInput = {
  /** Filler content by weight, as a fraction from 0 to 1. */
  loading: number;
  /** Polymer density, g/cm³. */
  polymerDensity: number;
  /** Cost of the unfilled polymer, per tonne, in the reader's own currency. */
  polymerCost: number;
  /** Delivered cost of the filler, per tonne, same currency. */
  fillerCost: number;
  /** Filler density, g/cm³. Defaults to calcite. */
  fillerDensity?: number;
};

export type FillerEconomics = {
  /** Density of the filled compound, g/cm³. */
  compoundDensity: number;
  /** Cost of the compound per tonne. */
  compoundCostPerTonne: number;
  /** Saving per tonne against the unfilled polymer. Negative if the filler costs more. */
  savingPerTonne: number;
  /** The same as a fraction of the unfilled cost. */
  savingByWeight: number;
  /** Cost per litre of unfilled polymer. */
  polymerCostPerLitre: number;
  /** Cost per litre of the filled compound. */
  compoundCostPerLitre: number;
  /** Saving per litre, which is the figure that reaches the accounts. */
  savingPerLitre: number;
  /** The same as a fraction. Always smaller than `savingByWeight` for a denser filler. */
  savingByVolume: number;
  /**
   * How much of the apparent weight saving survives the change to volume,
   * from 0 to 1. A low number is the warning this tool exists to give.
   */
  volumeRetention: number;
};

/** Cost per litre from a cost per tonne and a density in g/cm³. */
const perLitre = (costPerTonne: number, density: number): number =>
  (costPerTonne * density) / 1000;

/**
 * Density of a filled compound from the mass fractions of its two phases.
 *
 * Volumes add, masses add, densities do not: the reciprocal of the compound
 * density is the mass-weighted sum of the reciprocals. Averaging the two
 * densities directly is the common mistake and overstates the compound density
 * at every loading except the endpoints.
 */
export function compoundDensity(
  loading: number,
  polymerDensity: number,
  fillerDensity: number = CALCITE_DENSITY,
): number {
  const specificVolume = (1 - loading) / polymerDensity + loading / fillerDensity;
  return 1 / specificVolume;
}

export function fillerEconomics({
  loading,
  polymerDensity,
  polymerCost,
  fillerCost,
  fillerDensity = CALCITE_DENSITY,
}: FillerEconomicsInput): FillerEconomics {
  const density = compoundDensity(loading, polymerDensity, fillerDensity);

  const compoundCostPerTonne = (1 - loading) * polymerCost + loading * fillerCost;
  const savingPerTonne = polymerCost - compoundCostPerTonne;
  const savingByWeight = polymerCost > 0 ? savingPerTonne / polymerCost : 0;

  const polymerCostPerLitre = perLitre(polymerCost, polymerDensity);
  const compoundCostPerLitre = perLitre(compoundCostPerTonne, density);
  const savingPerLitre = polymerCostPerLitre - compoundCostPerLitre;
  const savingByVolume = polymerCostPerLitre > 0 ? savingPerLitre / polymerCostPerLitre : 0;

  return {
    compoundDensity: density,
    compoundCostPerTonne,
    savingPerTonne,
    savingByWeight,
    polymerCostPerLitre,
    compoundCostPerLitre,
    savingPerLitre,
    savingByVolume,
    /*
      Guarded rather than a bare ratio. When the filler costs more than the
      polymer both savings are negative and their ratio is a meaningless
      positive number, so the retention figure is only defined where there is a
      saving to retain.
    */
    volumeRetention: savingByWeight > 0 ? Math.max(savingByVolume / savingByWeight, 0) : 0,
  };
}
