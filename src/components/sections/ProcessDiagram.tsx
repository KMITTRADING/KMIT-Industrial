import { getTranslations } from 'next-intl/server';

import {
  ClassifierIcon,
  LabFlaskIcon,
  MeshScreenIcon,
  MillIcon,
  ParticleSizeIcon,
  ValveBagIcon,
} from '@/components/primitives';
import { PROCESS_STEP_IDS } from '@/content/schema';

import type { ComponentType } from 'react';
import type { IconProps } from '@/components/primitives';
import type { ProcessStepId } from '@/content/schema';

/**
 * Process diagram.
 *
 * Six stages the material passes through, from quarried feed to a packed
 * pallet. The connector between stages is drawn with CSS logical properties and
 * the whole strip is laid out with flex, so it runs right to left in Arabic and
 * left to right in English without a mirrored asset or a direction-specific
 * rule. That is the whole reason it is not a single wide SVG: an SVG path would
 * have to be authored twice.
 *
 * The register of the copy is deliberate. These are stages of the product, not
 * a claim about which operations KMIT performs in-house. Whether KMIT mills its
 * own material or processes sourced material is an open question
 * (docs/technical-data.md §8), and the diagram must not settle it by
 * implication. See docs/decisions.md ADR-016.
 *
 * The reveal is a scroll-driven CSS animation with a staggered delay per stage.
 * Content is visible by default; the animation only enhances it.
 */

const ICONS: Record<ProcessStepId, ComponentType<IconProps>> = {
  feed: MeshScreenIcon,
  milling: MillIcon,
  classification: ClassifierIcon,
  'surface-treatment': ParticleSizeIcon,
  'quality-control': LabFlaskIcon,
  packaging: ValveBagIcon,
};

export async function ProcessDiagram({ className }: { className?: string }) {
  const t = await getTranslations();

  return (
    <ol
      className={className}
      style={{
        display: 'grid',
        gap: '1px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))',
        backgroundColor: 'var(--color-border-subtle)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      {PROCESS_STEP_IDS.map((step, index) => {
        const Icon = ICONS[step];
        return (
          <li
            key={step}
            className="reveal flex flex-col gap-3 bg-surface-page p-5"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <Icon className="size-6 text-ink-accent" />
            <h3 className="text-sm font-semibold text-ink-primary">
              {t(`processSteps.${step}`)}
            </h3>
            <p className="text-xs text-ink-secondary">{t(`processStepDetails.${step}`)}</p>
          </li>
        );
      })}
    </ol>
  );
}

export default ProcessDiagram;
