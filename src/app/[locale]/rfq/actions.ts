'use server';

import { headers } from 'next/headers';

import { checkRateLimit, clientKeyFromHeaders } from '@/lib/rate-limit';
import { submitRfq } from '@/lib/rfq-adapter';

import type { RfqResult } from '@/lib/rfq-adapter';

/**
 * The RFQ server action.
 *
 * Three things happen here and nowhere else: the rate limit, the re-validation,
 * and the dispatch. The client validates too, but only so the buyer gets an
 * error next to the field rather than after a round trip. Client validation is
 * a convenience; this is the check that counts.
 */
export async function submitRfqAction(payload: unknown): Promise<RfqResult> {
  const requestHeaders = await headers();
  const limit = checkRateLimit(clientKeyFromHeaders(requestHeaders));

  if (!limit.allowed) {
    return {
      ok: false,
      error: 'delivery',
      message: `Rate limited. Retry in ${limit.retryAfterSeconds} seconds.`,
    };
  }

  return submitRfq(payload);
}
