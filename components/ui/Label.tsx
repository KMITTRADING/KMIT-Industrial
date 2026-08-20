/**
 * An eyebrow, optionally carrying a figure number. The wide tracking in
 * .t-label is where the technical register comes from — it annotates rather
 * than heads. Arabic loses the tracking and gains the weight automatically,
 * through the variables in tokens.css.
 *
 * The index is presentational: the section it labels already carries its
 * position in the document order, so repeating "01" to a screen reader adds
 * nothing.
 */
export function Label({
  children,
  index,
  tone = 'default',
  className = '',
}: {
  children: React.ReactNode;
  index?: string;
  tone?: 'default' | 'on-dark';
  className?: string;
}) {
  const muted = tone === 'on-dark' ? 'text-on-dark-soft' : 'text-ink-soft';
  return (
    <p className={`flex items-center gap-3 ${className}`}>
      {index ? (
        <span aria-hidden="true" className={`t-index ${muted}`}>
          {index}
        </span>
      ) : null}
      <span className={`t-label ${tone === 'on-dark' ? 'text-on-dark' : 'text-brand'}`}>
        {children}
      </span>
    </p>
  );
}
