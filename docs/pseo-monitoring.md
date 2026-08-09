# Programmatic page monitoring

> Phase 7. What to watch after launch, and the rule for removing a page that is
> not earning its place.
>
> **Nothing in this document can start yet.** The site has never been deployed to
> a real origin and has no Search Console property, so every measurement below is
> a procedure waiting for traffic rather than a result. `docs/launch-checklist.md`
> §0 lists what blocks the launch.

---

## 1. Why the sitemaps are split

`/sitemap.xml` is a sitemap index over five section files:

| Sitemap                     | URLs | What it answers                             |
| --------------------------- | ---- | ------------------------------------------- |
| `/sitemap/core.xml`         | 10   | Home, facility, resources, contact, RFQ     |
| `/sitemap/products.xml`     | 12   | Product index and the five grade pages      |
| `/sitemap/applications.xml` | 12   | Application index and the five sector pages |
| `/sitemap/solutions.xml`    | 20   | The hub and the nine grade x sector pages   |
| `/sitemap/guides.xml`       | 8    | Guide index and the guides                  |

Sixty-two URLs in total, which is nowhere near any limit. The split is not about
size. Search Console reports index coverage **per submitted sitemap**, and with
a single file the only available answer to "are the solution pages being
indexed" is a percentage covering the entire site. With a file per section the
question is answerable, and the policy in §3 becomes something somebody can act
on rather than an intention.

Submit all five separately, not just the index, so the per-file breakdown
appears. `robots.txt` lists them individually for that reason.

`lastmod` is the build time on every URL. There is no CMS and no per-document
revision history, so any per-route date would be invented, and a sitemap that
overstates freshness teaches a crawler to ignore the field. Build time is the
one thing that is true.

---

## 2. What to watch, and when

### Week 1 to 4, after the sitemaps are submitted

- **Indexed count per sitemap.** The solutions file should climb toward 18 of 20. Anything under half by week 4 is a signal about the pages, not about the
  crawler.
- **Coverage exclusions.** Watch specifically for "Duplicate without user
  selected canonical" and "Alternate page with proper canonical tag" on the
  solution URLs. Either would mean Google reads two solution pages as the same
  document, which is the thin-content failure showing up as an indexing symptom.
  `check:pseo` measures the same property before launch, so a finding here means
  the gate's overlap ceiling is too loose.
- **International Targeting.** hreflang errors for the first month, per
  `docs/launch-checklist.md` §3.

### Month 2 to 3

- **Impressions per page**, from the Search Console Pages report filtered to
  `/solutions/`. This is the number the policy in §3 is written against.
- **Queries actually matched.** The intent these pages target is
  `docs/keyword-clusters.md` cluster 3, application intent, at grade level. If
  the queries arriving are the sector-level ones already served by
  `/applications/`, the pages are cannibalising rather than adding, and the fix
  is internal linking and title differentiation before it is deletion.
- **Which page in the cluster ranks.** If `/applications/plastics-masterbatch`
  and `/solutions/gcc-1250-for-plastics-masterbatch` trade positions for the same
  query, one primary intent is being served by two pages, which
  `docs/keyword-clusters.md` names as the most common self-cannibalisation
  failure on a bilingual B2B site.

### Ongoing

- **Arabic and English separately.** The Arabic pages are the primary locale and
  a lower indexed count there is a more serious finding than the same gap in
  English, not a smaller one.

---

## 3. The de-indexing rule

From the phase brief:

> De-index any page that fails to earn impressions after 90 days rather than
> letting it dilute the site.

Applied here as follows, with the qualifications that make it safe to run.

**The rule.** A programmatic page with **zero impressions across both locales
after 90 days of being indexed** is removed from the sitemap and served with
`noindex`, not deleted.

**Four qualifications, because the rule as stated would misfire.**

1. **90 days of being indexed, not 90 days of existing.** If Search Console has
   not indexed the page, the measurement has not started. A page that was never
   crawled has not failed to earn impressions; it has not been asked.
2. **Zero, not low.** In this niche a single impression can precede a 500-tonne
   enquiry, and `docs/keyword-clusters.md` opens by saying volumes here are low
   and misleading. A page with four impressions in a quarter is performing
   normally. Only genuine silence counts.
3. **Never remove a page that a buyer path depends on.** These pages are linked
   from the grade pages and the sector pages and carry a prefilled RFQ. A page
   with no search impressions may still be converting internal traffic, so check
   the analytics path before the search data, not after.
4. **Removal is `noindex`, never deletion.** The page stays reachable and stays
   linked. Deleting it would break internal links, lose the URL for a future
   re-index, and throw away content that was written to a standard, all to solve
   a problem that `noindex` solves completely.

**What to do first, in every case.** A page with no impressions after 90 days is
more often a page with the wrong title than a page with the wrong reason to
exist. Before de-indexing, check that the title and description target the query
in `docs/keyword-clusters.md` cluster 3, and that the page is linked from more
than the hub. De-indexing is what happens after that fails, and `noindex` on a
page that could have been fixed with a title rewrite is a mistake with no
feedback signal to correct it.

**If a page is de-indexed:** record it in `docs/pseo-inventory.md` by moving its
row from ship to hold, with the impression data and the date, so the next person
does not regenerate it from the same predicate that produced it.

---

## 4. What would make the matrix grow

The predicate in `src/content/data/solutions.ts` publishes a page for a grade
and a sector when the grade's specification names an application in that sector.
It follows that the matrix grows only when `docs/technical-data.md` §3 grows.

| Change to the source data                      | Pages it unlocks                                                                   |
| ---------------------------------------------- | ---------------------------------------------------------------------------------- |
| A paper or paperboard application on any grade | Up to 5, per `docs/pseo-inventory.md` §1                                           |
| Lead time per city per packaging format        | All 6 held city pages, plus the pending note comes off the logistics section       |
| Loading levels per sector                      | No new pages, but the weakest section on all 9 existing ones becomes a real answer |

The third row is the one to push for. Every solution page currently describes
what governs the loading ceiling rather than where it sits, because no loading
data exists. That is honest and it is the section a formulation engineer most
wants a number in.
