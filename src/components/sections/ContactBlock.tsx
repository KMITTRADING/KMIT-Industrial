import { getTranslations } from 'next-intl/server';

import {
  ChatIcon,
  LocationIcon,
  MailIcon,
  PhoneIcon,
  TrackedAnchor,
} from '@/components/primitives';
import { CONTACT_CHANNEL_IDS } from '@/content/schema';

import type { ComponentType } from 'react';
import type { ContactChannelId } from '@/content/schema';
import type { IconProps } from '@/components/primitives';

/**
 * Contact block.
 *
 * Ships in its empty state, on purpose. No phone number, WhatsApp number, sales
 * address or street address has been supplied (docs/technical-data.md §8), and
 * a placeholder number on a supplier site is worse than no number: a buyer who
 * dials it and reaches nothing does not try twice.
 *
 * So the component renders the channels KMIT will offer, says plainly that the
 * details are pending, and is built to fill in without a layout change. Each
 * channel takes an optional `value` and `href`; supplying them turns the row
 * into a live link.
 *
 * WhatsApp sits in the list as a first-class channel rather than an
 * afterthought, because in the GCC it is where B2B enquiries actually arrive.
 */

const ICONS: Record<ContactChannelId, ComponentType<IconProps>> = {
  phone: PhoneIcon,
  whatsapp: ChatIcon,
  email: MailIcon,
  location: LocationIcon,
};

export type ContactChannel = {
  id: ContactChannelId;
  /** The number, address, or line of text. Omit while pending. */
  value?: string;
  /** `tel:`, `https://wa.me/...`, `mailto:`, or a maps link. */
  href?: string;
};

export async function ContactBlock({
  channels = CONTACT_CHANNEL_IDS.map((id) => ({ id })),
  className,
}: {
  channels?: ContactChannel[];
  className?: string;
}) {
  const t = await getTranslations();
  const anyPending = channels.some((channel) => !channel.value);

  return (
    <div className={className}>
      <ul className="grid gap-px bg-border-subtle sm:grid-cols-2">
        {channels.map((channel) => {
          const Icon = ICONS[channel.id];
          return (
            <li key={channel.id} className="flex items-start gap-3 bg-surface-page p-5">
              <Icon className="mt-0.5 size-5 shrink-0 text-ink-accent" />
              <div className="min-w-0">
                <p className="text-2xs font-medium text-ink-muted">
                  {t(`contactChannels.${channel.id}`)}
                </p>
                {channel.value && channel.href ? (
                  <TrackedAnchor
                    event={channel.id === 'whatsapp' ? 'whatsapp_click' : 'contact_click'}
                    href={channel.href}
                    dir="ltr"
                    className="mt-1 block text-start text-sm text-ink-accent underline-offset-4 hover:underline"
                  >
                    {channel.value}
                  </TrackedAnchor>
                ) : channel.value ? (
                  <p dir="ltr" className="mt-1 text-start text-sm text-ink-primary">
                    {channel.value}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-ink-muted">{t('sections.contactPending')}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {anyPending ? (
        <p className="measure-prose mt-6 text-xs text-ink-muted">
          {t('sections.contactIntro')}
        </p>
      ) : null}
    </div>
  );
}

export default ContactBlock;
