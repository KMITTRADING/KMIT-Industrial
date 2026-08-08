import { getTranslations } from 'next-intl/server';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableRowHeader,
  TableScroll,
} from '@/components/primitives';
import { STANDARD_IDS } from '@/content/schema';

/**
 * Certification strip.
 *
 * A table, not a row of badges. Certificate imagery does not exist in the asset
 * drop and certificate numbers have not been supplied, so a wall of authentic
 * looking seals would be a fabrication. A standards table states exactly what
 * is known, names the scope of each standard, and leaves the certificate number
 * column visibly pending rather than quietly absent.
 *
 * When the numbers arrive this component does not change shape: the pending
 * cells fill in. That is the point of building the empty state first.
 */

export async function CertificationStrip({ className }: { className?: string }) {
  const t = await getTranslations();

  return (
    <div className={className}>
      <TableScroll label={t('sections.certificationsHeading')}>
        <Table className="min-w-[36rem]">
          <TableCaption>{t('sections.certificationsIntro')}</TableCaption>
          <TableHead>
            <TableRow className="hover:bg-transparent">
              <TableHeaderCell>{t('sections.certificationsColumnStandard')}</TableHeaderCell>
              <TableHeaderCell>{t('sections.certificationsColumnScope')}</TableHeaderCell>
              <TableHeaderCell>{t('sections.certificationsColumnCertificate')}</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {STANDARD_IDS.map((standard) => (
              <TableRow key={standard}>
                <TableRowHeader numeric>{t(`standards.${standard}`)}</TableRowHeader>
                <TableCell>{t(`standardScopes.${standard}`)}</TableCell>
                <TableCell className="text-ink-muted">
                  {t('sections.certificatePending')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableScroll>
    </div>
  );
}

export default CertificationStrip;
