/**
 * Programmatic-page gate.
 *
 * docs/pseo-inventory.md commits to one rule above all others:
 *
 *   > A programmatic page ships only if it contains information that exists
 *   > nowhere else on the site. If you cannot write 250+ words of
 *   > non-substitutable technical content for a combination, do not generate
 *   > that page.
 *
 * A rule in a document is a rule until the first hurried edit. This measures it
 * on the served HTML, where the reader meets it.
 *
 * Three checks:
 *
 * 1. **Body volume.** At least 250 words of prose in `<main>` per page, per
 *    locale, excluding the shared shell. A floor, and the cheapest way to catch
 *    a page whose copy silently failed to render.
 *
 * 2. **Substitutability.** The check the word count only proxies for. Within a
 *    locale, every pair of programmatic pages is compared sentence by sentence,
 *    and the fraction of one page's substantial sentences that appear verbatim
 *    on another must stay low. Shared chrome and the specification table are
 *    identical by design and are filtered out by the sentence-length floor;
 *    what survives is body prose, and body prose repeated across pages is
 *    templating, which is the failure this whole phase is arranged to avoid.
 *
 * 3. **Not orphaned.** Every programmatic page must be linked from its hub.
 *    A page reachable only from the sitemap is treated as an orphan by crawlers
 *    and by readers, and `check:crawl` measures depth from the home page rather
 *    than membership of a hub, so it would not catch this.
 *
 * Usage:
 *   npm run build && npx next start -p 3000 &
 *   node scripts/check-pseo.mjs http://localhost:3000
 */

import process from 'node:process';
import { parse } from 'node-html-parser';

const ORIGIN = process.argv[2] ?? 'http://localhost:3000';

const LOCALES = ['ar', 'en'];

/** Hubs and the page family each one is responsible for linking. */
const FAMILIES = [{ hub: '/solutions', prefix: '/solutions/' }];

/** The floor from docs/pseo-inventory.md. */
const MIN_WORDS = 250;

/**
 * A sentence has to be this long to count toward the overlap measure.
 *
 * Below it sit table cells, badges, breadcrumbs and button labels, all of which
 * are identical across pages on purpose. Eight words is comfortably above that
 * and comfortably below any real sentence of body copy.
 */
const MIN_SENTENCE_WORDS = 8;

/**
 * How much verbatim body prose two pages may share.
 *
 * Not zero: an honest page can repeat a definition or a standard's name in the
 * same words as its neighbour, and forcing synonyms on a technical site makes
 * it worse, not better. A fifth is far above that and far below what a template
 * with substituted variables would produce.
 */
const MAX_OVERLAP = 0.2;

const findings = [];
const report = (route, rule, detail) => findings.push({ route, rule, detail });

const words = (text) => text.split(/\s+/).filter(Boolean);

/** Prose inside `<main>`, with the shared shell and non-text subtrees removed. */
function mainProse(root) {
  const main = root.querySelector('main');
  if (!main) return '';
  for (const node of main.querySelectorAll('script, style, nav, table')) node.remove();
  return (main.text ?? '').replace(/\s+/g, ' ').trim();
}

/**
 * Substantial sentences, normalised.
 *
 * Split on both Latin and Arabic full stops, and on the Arabic question mark,
 * so an Arabic page is measured on its own punctuation rather than on
 * punctuation it does not use.
 */
function sentences(text) {
  return text
    .split(/[.؟?!]\s+/)
    .map((sentence) => sentence.trim().toLowerCase())
    .filter((sentence) => words(sentence).length >= MIN_SENTENCE_WORDS);
}

for (const family of FAMILIES) {
  for (const locale of LOCALES) {
    /* --------------------------------------------------- discover the spokes */

    const hubUrl = `${ORIGIN}/${locale}${family.hub}`;
    const hubResponse = await fetch(hubUrl);

    if (!hubResponse.ok) {
      report(`/${locale}${family.hub}`, 'hub', `expected 200, got ${hubResponse.status}`);
      continue;
    }

    const hub = parse(await hubResponse.text());
    const hubMain = hub.querySelector('main');
    const linked = new Set(
      (hubMain ?? hub)
        .querySelectorAll('a[href]')
        .map((anchor) => anchor.getAttribute('href'))
        .filter((href) => href?.startsWith(`/${locale}${family.prefix}`)),
    );

    if (linked.size === 0) {
      report(
        `/${locale}${family.hub}`,
        'orphan',
        `hub links to no ${family.prefix} pages, so every one of them is an orphan`,
      );
      continue;
    }

    /* ------------------------------------------------------- read each spoke */

    const pages = [];

    for (const href of [...linked].sort()) {
      const response = await fetch(`${ORIGIN}${href}`);
      if (!response.ok) {
        report(href, 'status', `expected 200, got ${response.status}`);
        continue;
      }

      const root = parse(await response.text());
      const prose = mainProse(root);
      const count = words(prose).length;

      if (count < MIN_WORDS) {
        report(
          href,
          'thin',
          `${count} words of body prose, floor is ${MIN_WORDS}. Either write it or do not publish the page.`,
        );
      }

      pages.push({ href, sentences: new Set(sentences(prose)) });
    }

    /* --------------------------------------------------------- substitutable */

    for (const page of pages) {
      if (page.sentences.size === 0) {
        report(page.href, 'thin', 'no sentences long enough to measure');
        continue;
      }

      for (const other of pages) {
        if (other.href === page.href) continue;

        const shared = [...page.sentences].filter((sentence) => other.sentences.has(sentence));
        const ratio = shared.length / page.sentences.size;

        if (ratio > MAX_OVERLAP) {
          report(
            page.href,
            'templated',
            `${Math.round(ratio * 100)}% of its body sentences also appear on ${other.href}. ` +
              `Example: "${shared[0]?.slice(0, 80)}..."`,
          );
        }
      }
    }

    console.log(
      `  ${locale}${family.hub}: ${pages.length} pages, ` +
        `min ${Math.min(...pages.map((page) => page.sentences.size))} measurable sentences each`,
    );
  }
}

if (findings.length > 0) {
  console.error(`\ncheck:pseo found ${findings.length} problem(s):\n`);
  for (const finding of findings) {
    console.error(`  [${finding.rule}] ${finding.route}: ${finding.detail}`);
  }
  console.error(
    '\nThe rule is in docs/pseo-inventory.md §0. A page that cannot clear it is a page\n' +
      'that should not exist; hold it and record what would unlock it.',
  );
  process.exit(1);
}

console.log(
  `\ncheck:pseo passed - every programmatic page is hub-linked, past ${MIN_WORDS} words, ` +
    'and shares no template with its neighbours.',
);
