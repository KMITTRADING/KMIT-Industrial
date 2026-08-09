import { ARTICLE_IDS } from '../schema';

import type { ArticleId, ArticleTableId } from '../schema';

/**
 * What each article renders and links to.
 *
 * Held as data rather than written into each page, so an article carries its
 * table and its internal links by declaration. The alternative is a prose link
 * to `/products/gcc-1250` inside a translated string, which rots silently the
 * first time a grade code changes and rots differently in each locale.
 */

export type Article = {
  id: ArticleId;
  /** Which of the site's existing tables the article renders. */
  table: ArticleTableId;
  /**
   * Grade codes the article bears on directly, linked at the foot of the page.
   * Empty means the article is about the family rather than about any grade.
   */
  grades: string[];
};

export const ARTICLES: Article[] = [
  {
    id: 'reading-a-particle-size-distribution',
    table: 'grades',
    grades: ['GCC-200', 'GCC-1250', 'GCC-2500'],
  },
  {
    id: 'what-whiteness-r457-measures',
    table: 'properties',
    grades: ['GCC-800', 'GCC-2500'],
  },
  {
    id: 'oil-absorption-in-a-formulation',
    table: 'properties',
    grades: ['GCC-400', 'GCC-800'],
  },
  {
    id: 'moisture-and-shelf-life',
    table: 'grades',
    grades: ['GCC-1250', 'GCC-2500'],
  },
];

export function findArticle(id: string): Article | undefined {
  return ARTICLES.find((article) => article.id === id);
}

if (ARTICLES.length !== ARTICLE_IDS.length) {
  throw new Error('ARTICLES must carry one entry per ARTICLE_IDS entry.');
}
