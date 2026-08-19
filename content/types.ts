/**
 * The content contract.
 *
 * `en.ts` and `ar.ts` are both declared `: Copy`, so a key present in one and
 * missing from the other is a compile error rather than a blank space that
 * ships. Counts are tuples, not arrays — the site has exactly three areas of
 * work, four principles and four signature-scroll steps, and a translation
 * that supplies three steps should not typecheck.
 *
 * Arabic is written against this shape, not translated into it (§6).
 */

/** One row in the areas-of-work list. Not a card — a row on a geological log. */
export type Area = {
  /** Presentational figure number: 01, 02, 03. */
  readonly index: string;
  readonly title: string;
  /** One line. Sits beside the title. */
  readonly descriptor: string;
  /** One sentence. No more. */
  readonly body: string;
};

/** One of the four principles in the Approach section. */
export type Principle = {
  readonly index: string;
  readonly title: string;
  /** One sentence. */
  readonly body: string;
};

/** One step of the signature scroll: Material, Extraction, Application, Energy. */
export type Step = {
  readonly index: string;
  readonly title: string;
  readonly body: string;
};

export type Copy = {
  /** <html lang> is set from lib/locales; this is the human-facing name. */
  readonly languageName: string;
  /** The label on the switch that leads to the other locale. */
  readonly switchTo: string;

  readonly nav: {
    readonly home: string;
    readonly solutions: string;
    readonly approach: string;
    readonly about: string;
    readonly contact: string;
    /* Names the header's navigation landmark. It must differ from
       footer.navLabel: two landmarks with the same role and the same
       accessible name are indistinguishable to a screen reader. */
    readonly primaryLabel: string;
    readonly openMenu: string;
    readonly closeMenu: string;
    readonly skipToContent: string;
  };

  readonly hero: {
    readonly eyebrow: string;
    /** The three display words. The third carries the gradient. */
    readonly words: readonly [string, string, string];
    readonly lead: string;
    readonly cta: string;
    readonly scrollCue: string;
  };

  readonly areas: {
    readonly label: string;
    readonly heading: string;
    readonly items: readonly [Area, Area, Area];
  };

  readonly approach: {
    readonly label: string;
    readonly heading: string;
    readonly lead: string;
    readonly items: readonly [Principle, Principle, Principle, Principle];
  };

  readonly strata: {
    readonly label: string;
    readonly heading: string;
    readonly steps: readonly [Step, Step, Step, Step];
  };

  readonly region: {
    readonly label: string;
    readonly heading: string;
    readonly body: string;
    /** Names the coordinate readout for assistive technology. */
    readonly nodeLabel: string;
  };

  readonly about: {
    readonly label: string;
    readonly heading: string;
    readonly body: readonly string[];
    /** Prefixes the parent company name from FACTS. */
    readonly groupPrefix: string;
    readonly audienceLabel: string;
    readonly audience: readonly string[];
  };

  readonly cta: {
    readonly label: string;
    readonly heading: string;
    readonly primary: string;
    /** Subject line of the mailto, so the first message already has a header. */
    readonly mailSubject: string;
    readonly emailLabel: string;
    readonly phoneLabel: string;
  };

  readonly footer: {
    readonly statement: string;
    readonly navLabel: string;
    readonly areasLabel: string;
    readonly contactLabel: string;
    /** Takes the year as an argument so no date is hardcoded in a template. */
    readonly copyright: (year: number) => string;
  };

  readonly meta: {
    readonly title: string;
    readonly description: string;
  };
};
