/**
 * The structural signature (§3): a divider of three or four hairlines of
 * varying length and weight, read as a geological log or the section drawing
 * on an engineering plate. It replaces cards and boxes everywhere on the site —
 * if something needs separating, it gets one of these, not a border-radius.
 *
 * The patterns are authored rather than generated. A random rule would read as
 * noise; these are three specific rhythms, each tuned to how much weight the
 * break has to carry.
 */

type Variant = 'section' | 'row' | 'close';

type Line = { readonly w: string; readonly h: number; readonly strong?: boolean };

const PATTERNS: Record<Variant, readonly Line[]> = {
  // Between major sections. Four lines, widest first, tapering — the eye reads
  // it as a depth marker rather than as a border.
  section: [
    { w: '100%', h: 1 },
    { w: '58%', h: 2, strong: true },
    { w: '31%', h: 1 },
    { w: '11%', h: 2, strong: true },
  ],
  // Between rows in a list. Quiet: it separates without announcing itself.
  row: [
    { w: '100%', h: 1 },
    { w: '24%', h: 1, strong: true },
  ],
  // Above the closing statement and in the footer. Heavier, to land.
  close: [
    { w: '100%', h: 1 },
    { w: '44%', h: 2, strong: true },
    { w: '17%', h: 1 },
  ],
};

export function StrataRule({
  variant = 'section',
  className = '',
}: {
  variant?: Variant;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`flex flex-col gap-[3px] ${className}`}>
      {PATTERNS[variant].map((line, i) => (
        <span
          key={i}
          className={line.strong ? 'bg-line-strong' : 'bg-line'}
          style={{ inlineSize: line.w, blockSize: `${line.h}px` }}
        />
      ))}
    </div>
  );
}
