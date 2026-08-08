import type { SVGProps } from 'react';

/**
 * The icon set.
 *
 * Drawn for this domain rather than pulled from a library. Two reasons, in
 * order of weight:
 *
 * 1. No general-purpose set ships a mesh screen, an air classifier, a jumbo bag
 *    or a pneumatic silo tanker. Substituting a generic "box" for a jumbo bag
 *    would be worse than drawing one.
 * 2. The library look is itself a tell. A page whose icons came from the same
 *    set as every other page reads as assembled, not designed.
 *
 * Construction rules, held across every glyph so the set reads as one hand:
 *
 * - 24x24 viewBox, 1.5 stroke, round caps and joins, no fills.
 * - Geometry snapped to the half-pixel grid so strokes stay crisp at 24px.
 * - `currentColor` throughout; size with a font-size or width utility.
 * - Nothing is direction-specific. An arrow that must point "forward" is
 *   handled by the consumer flipping it with a transform, because forward is
 *   left in Arabic and right in English.
 *
 * Every icon is decorative by default (`aria-hidden`). An icon that carries
 * meaning on its own gets a `title` from the caller, which switches it to
 * `role="img"` with an accessible name.
 */

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'children'> & {
  /** Accessible name. Omit for decorative icons sitting next to a text label. */
  title?: string;
};

function Icon({ title, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------ domain */

/** A woven test sieve seen at a slight angle: the mesh that names every grade. */
export function MeshScreenIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.25" y="5.25" width="17.5" height="13.5" rx="1" />
      <path d="M8.5 5.25v13.5M14 5.25v13.5M3.25 9.75h17.5M3.25 14.25h17.5" />
    </Icon>
  );
}

/** A jet mill with its feed hopper and discharge: where the D50 is set. */
export function MillIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.75 3.25h9.5l-2.5 4.5h-4.5z" />
      <circle cx="9.5" cy="13.5" r="4.25" />
      <path d="M9.5 10.75v5.5M6.75 13.5h5.5" />
      <path d="M13.75 13.5h5.5v7.25h-5.5z" />
    </Icon>
  );
}

/** A cyclone air classifier: the stage that separates fines from coarse. */
export function ClassifierIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5.25 3.25h13.5v4.5l-5 6.25v6.75h-3.5v-6.75l-5-6.25z" />
      <path d="M9.25 7.75h5.5" />
    </Icon>
  );
}

/** A storage silo with its conical discharge and support legs. */
export function SiloIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.75 8.25a5.25 5.25 0 0 1 10.5 0v6.5l-3.5 4h-3.5l-3.5-4z" />
      <path d="M6.75 11.25h10.5M10.25 18.75v2M13.75 18.75v2" />
    </Icon>
  );
}

/** A 25 kg paper valve bag: creased top, valve corner, stacked on a pallet. */
export function ValveBagIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5.75 4.75h12.5v11.5H5.75z" />
      <path d="M5.75 8.25h12.5M15.25 4.75v3.5" />
      <path d="M3.75 19.25h16.5M7.25 16.25v3M16.75 16.25v3" />
    </Icon>
  );
}

/** A jumbo bag: four lifting loops, woven body, tapered base. */
export function JumboBagIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7.75 3.25v1.5M12 3.25v1.5M16.25 3.25v1.5" />
      <path d="M6.25 6.25h11.5l-1.25 11.5H7.5z" />
      <path d="M9.5 17.75v2.5h5v-2.5" />
      <path d="M7.1 11.25h9.8" />
    </Icon>
  );
}

/** A pneumatic silo tanker: barrel body, tractor unit, discharge line. */
export function TankerIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.25 8.75h11.5v7.5H3.25z" rx="2" />
      <path d="M14.75 11.25h3l3 3v2h-6z" />
      <circle cx="7" cy="18.25" r="1.75" />
      <circle cx="17.5" cy="18.25" r="1.75" />
      <path d="M6.5 8.75v-1.5M11.5 8.75v-1.5" />
    </Icon>
  );
}

/** A laboratory flask with graduation marks: the QC stage. */
export function LabFlaskIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9.75 3.25h4.5M10.75 3.25v6l-5 9.5a1.5 1.5 0 0 0 1.35 2.25h9.8a1.5 1.5 0 0 0 1.35-2.25l-5-9.5v-6" />
      <path d="M7.9 15.25h8.2" />
    </Icon>
  );
}

/** A single-screw extruder: hopper, barrel, screw, die. */
export function ExtruderIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.75 4.75h5.5l-1.25 3.5h-3z" />
      <rect x="3.25" y="9.75" width="14.5" height="5.5" rx="1" />
      <path d="M6 9.75l2 5.5M9.5 9.75l2 5.5M13 9.75l2 5.5" />
      <path d="M17.75 11.25h3v2.5h-3z" />
    </Icon>
  );
}

/** A powder particle cloud with a size caliper: the D50 measurement. */
export function ParticleSizeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="8.25" cy="8.75" r="2.5" />
      <circle cx="15.5" cy="7.5" r="1.5" />
      <circle cx="14.25" cy="12.75" r="2" />
      <path d="M4.25 18.25h15.5M4.25 16.75v3M19.75 16.75v3" />
    </Icon>
  );
}

/* ---------------------------------------------------------------- utility */

/** Chevron pointing to the block end. Rotate for the inline directions. */
export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5.75 9.25 12 15.25l6.25-6" />
    </Icon>
  );
}

/**
 * Arrow pointing along the inline axis toward the end edge. The glyph points
 * right; callers in an RTL context wrap it in `rtl:-scale-x-100` so it points
 * the way the reader is going.
 */
export function ArrowInlineEndIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.75 12h14.5M13.25 6.25 19.25 12l-6 5.75" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.25 6.25l11.5 11.5M17.75 6.25 6.25 17.75" />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.75 12.5 9.5 17.25 19.25 6.75" />
    </Icon>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M12 11.25v5.5M12 7.75v.75" />
    </Icon>
  );
}

export function WarningIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3.75 21 19.5H3z" />
      <path d="M12 9.75v4.5M12 16.75v.75" />
    </Icon>
  );
}

export function DangerIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M12 7.25v5.5M12 15.75v.75" />
    </Icon>
  );
}

export function DocumentIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.25 3.25h8l4 4v13.5H6.25z" />
      <path d="M14.25 3.25v4h4" />
      <path d="M9 12.25h6M9 15.75h6" />
    </Icon>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8.25 3.75h-2a2 2 0 0 0-2 2.15c.55 7.4 6.45 13.3 13.85 13.85a2 2 0 0 0 2.15-2v-2l-4-1.5-1.75 2a13.5 13.5 0 0 1-6.75-6.75l2-1.75z" />
    </Icon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.25" y="5.75" width="17.5" height="12.5" rx="1" />
      <path d="m3.75 6.75 8.25 6 8.25-6" />
    </Icon>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20.25 11.75a7.75 7.75 0 0 1-11.4 6.85L4.25 19.75l1.2-4.55A7.75 7.75 0 1 1 20.25 11.75Z" />
    </Icon>
  );
}

export function LocationIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 20.75s6.25-5.4 6.25-10.25a6.25 6.25 0 1 0-12.5 0C5.75 15.35 12 20.75 12 20.75Z" />
      <circle cx="12" cy="10.25" r="2.25" />
    </Icon>
  );
}

export function SortIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8.25 9.75 12 6l3.75 3.75M8.25 14.25 12 18l3.75-3.75" />
    </Icon>
  );
}

/** Named export map, used by the styleguide to render the whole set. */
export const ICON_SET = {
  MeshScreen: MeshScreenIcon,
  Mill: MillIcon,
  Classifier: ClassifierIcon,
  Silo: SiloIcon,
  ValveBag: ValveBagIcon,
  JumboBag: JumboBagIcon,
  Tanker: TankerIcon,
  LabFlask: LabFlaskIcon,
  Extruder: ExtruderIcon,
  ParticleSize: ParticleSizeIcon,
  ChevronDown: ChevronDownIcon,
  ArrowInlineEnd: ArrowInlineEndIcon,
  Close: CloseIcon,
  Check: CheckIcon,
  Info: InfoIcon,
  Warning: WarningIcon,
  Danger: DangerIcon,
  Document: DocumentIcon,
  Phone: PhoneIcon,
  Mail: MailIcon,
  Chat: ChatIcon,
  Location: LocationIcon,
  Sort: SortIcon,
} as const;

export type IconName = keyof typeof ICON_SET;
