import { dict } from '@/content';
import { pathFor, type Locale } from '@/lib/i18n';
import { ArrowLink, Bezel, Section } from '../primitives';
import { Reveal } from '../Reveal';

/**
 * Why this material matters (§8.5).
 *
 * A five-cell Bento of deliberately unequal weight, `grid-auto-flow: dense` so
 * no cell is left empty. There is no icon anywhere in it: the first draft of this
 * section was four matching icon-title-paragraph cells, which is the banned
 * pattern in a Bento costume (§14, design-plan §6.3). Every cell uses the double
 * bezel (§5.4.1).
 *
 * The image cell is processed to greyscale and blended, so no photograph
 * introduces a colour from outside the identity (§8.5).
 */
export function WhyMaterial({ locale }: { locale: Locale }) {
  const d = dict(locale);

  return (
    <Section labelledBy="why-heading">
      <div className="content">
        <Reveal>
          <h2 id="why-heading" className="t-h2">
            {d.home.whyHeading}
          </h2>
        </Reveal>

        <div className="bento" style={{ marginBlockStart: 'var(--s-12)' }}>
          {/* Large image cell. */}
          <Reveal className="bento-image" delay={0}>
            <Bezel style={{ height: '100%' }} chamfer>
              <figure className="why-figure">
                <div className="why-image">
                  {/*
                    TODO-CONTENT: no approved photography supplied. Until a real
                    plant or material photograph is provided, the cell carries a
                    generated material surface rather than a stock image of
                    somebody else's factory (§4).
                  */}
                  <div className="why-image-material" role="img" aria-label={d.home.whyImageAlt} />
                </div>
                <figcaption className="t-label why-caption">{d.home.whyMaterialTitle}</figcaption>
              </figure>
            </Bezel>
          </Reveal>

          {/* Lead text cell — the largest text block, spanning two rows. */}
          <Reveal className="bento-lead" delay={80}>
            <Bezel style={{ height: '100%' }}>
              <div className="bento-cell">
                <p className="t-body-l">{d.home.whyLeadBody}</p>
                <p className="t-body" style={{ color: 'var(--ink-soft)' }}>
                  {d.home.whyMaterialBody}
                </p>
              </div>
            </Bezel>
          </Reveal>

          {/* Uses cell — a list, at a different weight to the lead. */}
          <Reveal className="bento-uses" delay={160}>
            <Bezel style={{ height: '100%' }}>
              <div className="bento-cell">
                <h3 className="t-label" style={{ color: 'var(--ink-soft)' }}>
                  {d.home.whyUsesTitle}
                </h3>
                <ul className="why-uses">
                  {d.home.whyUses.map((use) => (
                    <li key={use} className="t-body why-use">
                      {use}
                    </li>
                  ))}
                </ul>
              </div>
            </Bezel>
          </Reveal>

          {/* Pure-CSS material cell: ground stone to powder, no image at all. */}
          <Reveal className="bento-material" delay={240}>
            <Bezel style={{ height: '100%' }}>
              <div className="bento-cell">
                <div className="material-swatch" aria-hidden="true" />
                <p className="t-label" style={{ color: 'var(--ink-soft)' }}>
                  {d.home.whyMaterialTitle}
                </p>
              </div>
            </Bezel>
          </Reveal>

          {/* Quiet cell: mostly empty space, one line and the link out. */}
          <Reveal className="bento-quiet" delay={320}>
            <Bezel style={{ height: '100%' }}>
              <div className="bento-cell why-quiet">
                <p className="t-body">{d.home.whyQuietLine}</p>
                <ArrowLink href={pathFor(locale, 'calcium-carbonate')}>{d.home.whyLink}</ArrowLink>
              </div>
            </Bezel>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
