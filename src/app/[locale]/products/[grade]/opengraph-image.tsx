import { GRADES, gradeSlug } from '@/content/data/grades';
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og';
import { formatRange } from '@/lib/utils';
import { locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';

/**
 * The share card for one grade: the code, and the four numbers that decide
 * whether it is the right grade.
 *
 * This is the case the brief names, and the reason a single static card for the
 * whole site would have been wrong. A link to GCC-2500 pasted into a buyer's
 * channel should say 2500 mesh and 1.8 to 2.5 microns, not "calcium carbonate
 * supplier".
 */

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Calcium carbonate grade specification';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    GRADES.map((grade) => ({ locale, grade: gradeSlug(grade.code) })),
  );
}

export default async function GradeOpengraphImage({
  params,
}: {
  params: Promise<{ grade: string }>;
}) {
  const { grade: slug } = await params;
  const grade = GRADES.find((entry) => gradeSlug(entry.code) === slug.toLowerCase());
  if (!grade) notFound();

  return ogImage({
    headline: grade.code,
    subline: grade.coatingLevel
      ? 'Surface-coated ground calcium carbonate'
      : 'Ground calcium carbonate',
    specs: [
      { label: 'Mesh', value: String(grade.mesh) },
      { label: 'D50 (micron)', value: formatRange(grade.d50Min, grade.d50Max) },
      {
        label: 'Surface coating',
        value: grade.coatingLevel
          ? `Stearic acid ${grade.coatingLevel.min.toFixed(1)} - ${grade.coatingLevel.max.toFixed(1)}%`
          : 'Uncoated',
      },
      { label: 'Shelf life', value: `${grade.shelfLifeMonths} months` },
    ],
  });
}
