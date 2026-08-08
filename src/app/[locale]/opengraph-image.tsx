import { GRADES } from '@/content/data/grades';
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og';
import { formatRange } from '@/lib/utils';
import { locales } from '@/i18n/routing';

/**
 * The default share card, inherited by every page that does not define its own.
 *
 * It states the range rather than the company: a link to this site is shared
 * because of what it supplies, and "200 to 2500 mesh" is the fact that makes a
 * procurement manager open it.
 */

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'KMIT industrial calcium carbonate, 200 to 2500 mesh';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function OpengraphImage() {
  const meshes = GRADES.map((grade) => grade.mesh);
  const finest = GRADES.reduce((best, grade) => (grade.d50Min < best.d50Min ? grade : best));
  const coarsest = GRADES.reduce((best, grade) => (grade.d50Max > best.d50Max ? grade : best));

  return ogImage({
    headline: 'CaCO3',
    subline: 'Ground and surface-coated calcium carbonate. Jeddah, Saudi Arabia.',
    specs: [
      {
        label: 'Mesh',
        value: `${Math.min(...meshes)} - ${Math.max(...meshes)}`,
      },
      {
        label: 'D50 (micron)',
        value: formatRange(finest.d50Min, coarsest.d50Max),
      },
      { label: 'Purity', value: '>= 98.5%' },
      { label: 'Whiteness R457', value: '95.0 - 98.5%' },
    ],
  });
}
