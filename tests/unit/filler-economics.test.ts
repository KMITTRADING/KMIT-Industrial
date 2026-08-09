import { describe, expect, it } from 'vitest';

import { CALCITE_DENSITY, POLYMERS } from '@/content/data/polymers';
import { compoundDensity, fillerEconomics } from '@/lib/filler-economics';

/**
 * The calculator's arithmetic.
 *
 * This is the one piece of the site that produces a number the reader did not
 * supply, so it is the one piece that can be confidently wrong. The volume
 * assertions matter most: they are the whole reason the tool is worth
 * publishing, and getting them backwards would turn an honest tool into a
 * misleading one that still looks plausible.
 */

describe('compound density', () => {
  it('returns the polymer density at zero loading and the filler density at full', () => {
    expect(compoundDensity(0, 0.923)).toBeCloseTo(0.923, 6);
    expect(compoundDensity(1, 0.923)).toBeCloseTo(CALCITE_DENSITY, 6);
  });

  it('combines by specific volume, not by averaging the densities', () => {
    // 30% calcite in LDPE: 1 / (0.7/0.923 + 0.3/2.7) = 1.150
    expect(compoundDensity(0.3, 0.923)).toBeCloseTo(1.15, 2);
    // The naive arithmetic mean would give 0.7*0.923 + 0.3*2.7 = 1.456.
    expect(compoundDensity(0.3, 0.923)).toBeLessThan(1.456);
  });

  it('rises monotonically with loading for a filler denser than the polymer', () => {
    const densities = [0, 0.1, 0.2, 0.3, 0.4, 0.5].map((load) => compoundDensity(load, 0.923));
    densities.forEach((density, index) => {
      if (index === 0) return;
      expect(density).toBeGreaterThan(densities[index - 1] as number);
    });
  });
});

describe('filler economics', () => {
  const base = {
    loading: 0.3,
    polymerDensity: 0.923,
    polymerCost: 5000,
    fillerCost: 800,
  };

  it('computes the compound cost as a mass-weighted blend', () => {
    // 0.7 * 5000 + 0.3 * 800
    expect(fillerEconomics(base).compoundCostPerTonne).toBeCloseTo(3740, 6);
  });

  it('reports a much smaller saving by volume than by weight', () => {
    const result = fillerEconomics(base);
    expect(result.savingByWeight).toBeCloseTo(0.252, 3);
    expect(result.savingByVolume).toBeCloseTo(0.068, 3);
    expect(result.savingByVolume).toBeLessThan(result.savingByWeight);
  });

  it('reports how much of the weight saving survives the change to volume', () => {
    const result = fillerEconomics(base);
    expect(result.volumeRetention).toBeGreaterThan(0);
    expect(result.volumeRetention).toBeLessThan(0.35);
  });

  it('widens the gap between the two savings as loading rises', () => {
    const low = fillerEconomics({ ...base, loading: 0.1 });
    const high = fillerEconomics({ ...base, loading: 0.5 });
    expect(high.savingByWeight - high.savingByVolume).toBeGreaterThan(
      low.savingByWeight - low.savingByVolume,
    );
  });

  it('reports a negative saving when the filler costs more than the polymer', () => {
    const result = fillerEconomics({ ...base, fillerCost: 6000 });
    expect(result.savingPerTonne).toBeLessThan(0);
    expect(result.savingByWeight).toBeLessThan(0);
    // Retention is undefined when there is no saving, and must not invent one.
    expect(result.volumeRetention).toBe(0);
  });

  it('leaves cost unchanged and density unchanged at zero loading', () => {
    const result = fillerEconomics({ ...base, loading: 0 });
    expect(result.compoundCostPerTonne).toBeCloseTo(base.polymerCost, 6);
    expect(result.savingPerLitre).toBeCloseTo(0, 6);
    expect(result.compoundDensity).toBeCloseTo(base.polymerDensity, 6);
  });

  it('offers a density for every polymer the interface lists', () => {
    for (const polymer of POLYMERS) {
      expect(polymer.density, polymer.id).toBeGreaterThan(0);
      expect(polymer.density, polymer.id).toBeLessThan(CALCITE_DENSITY);
    }
  });
});
