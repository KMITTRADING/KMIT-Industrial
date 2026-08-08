# Launch checklist

> Phase 6. Everything that has to be true before this site serves a real buyer.
> Ordered so that a blocker is found before the work that depends on it.

---

## 0. Blocking on client data

None of the rest matters if the site still says "pending documentation" where a
buyer expects a number. These are open in `docs/technical-data.md` §8 and every
one of them is visible on a page today.

- [ ] Legal entity name, CR number, VAT number
- [ ] Full address, phone, WhatsApp, sales email, technical email
- [ ] ISO certificate numbers, issuing bodies, issue and expiry dates
- [ ] Plant capacity and current utilisation
- [ ] Lead times per city and per packaging format
- [ ] Minimum order quantity per grade and per packaging format
- [ ] Sampling policy: free sample size and turnaround
- [ ] TDS, MSDS and COA PDFs
- [ ] Reference clients or named sectors, with written permission
- [ ] Year founded
- [ ] **Whether KMIT mills its own material or processes sourced feed.** This one
      changes the home page, the facility page and the strongest claim on the
      site. Nothing should launch implying own-production until it is answered.

---

## 1. Environment

| Variable                                           | Required     | Notes                                                                                                                                                           |
| -------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                             | **yes**      | Absolute, no trailing slash. Canonicals, hreflang, sitemap, OG tags and JSON-LD `@id` all derive from it. A wrong value here poisons every one of them at once. |
| `RFQ_DRIVER`                                       | **yes**      | `console` today, which writes to the log and sends nothing. Must be `resend` or `webhook` before launch.                                                        |
| `RESEND_API_KEY`, `RFQ_TO_EMAIL`, `RFQ_FROM_EMAIL` | if `resend`  |                                                                                                                                                                 |
| `RFQ_WEBHOOK_URL`, `RFQ_WEBHOOK_SECRET`            | if `webhook` |                                                                                                                                                                 |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER`                   | no           | `none` today. See `docs/measurement-plan.md`.                                                                                                                   |
| `NEXT_PUBLIC_ANALYTICS_ID`                         | if analytics |                                                                                                                                                                 |

`src/lib/env.ts` validates all of these at boot and throws on a malformed value,
so a missing variable fails the deploy rather than the first buyer.

- [ ] `NEXT_PUBLIC_SITE_URL` set to the real origin in the production environment
- [ ] Same value set in the deploy-preview environment, or accept that preview
      canonicals point at production

---

## 2. The RFQ path, end to end

This is the only conversion on the site. Test it as a buyer, not as a developer.

- [ ] `RFQ_DRIVER` switched off `console`
- [ ] Submit a real request in **Arabic** and confirm it arrives, with the Arabic
      field values intact and not mojibake
- [ ] Submit a real request in **English**
- [ ] Confirm the reference shown to the buyer appears in the received message
- [ ] Confirm the reply-to address is a mailbox somebody reads
- [ ] Trip the rate limiter deliberately (six submissions inside ten minutes) and
      confirm the sixth is refused and the message is comprehensible
- [ ] Fill the honeypot in devtools and confirm the submission is silently
      accepted-looking but not delivered

### Email deliverability, for the human doing DNS

If `RFQ_DRIVER=resend`, the sending domain needs:

- [ ] **SPF**: a TXT record authorising the provider to send for the domain
- [ ] **DKIM**: the provider's public key published as the CNAME or TXT records
      they specify
- [ ] **DMARC**: at minimum `v=DMARC1; p=none; rua=mailto:...` so failures are
      reported before the policy is tightened
- [ ] Send a test to a Gmail address and a Microsoft 365 address and check the
      headers show `spf=pass` and `dkim=pass`. Saudi B2B buyers are
      disproportionately on Microsoft 365, which is stricter than most.

Without these the quotation replies land in spam and the site converts nothing
while appearing to work.

---

## 3. Search and indexing

- [ ] Domain property created in Google Search Console, verified by **DNS TXT**
      rather than by an HTML file, so it survives a redeploy
- [ ] Bing Webmaster Tools property created; it can import the Search Console
      verification
- [ ] `https://<domain>/sitemap.xml` submitted in both. It carries 42 URLs with
      hreflang alternates.
- [ ] `robots.txt` checked on the live origin: it must allow all and disallow
      only `/ar/styleguide` and `/en/styleguide`
- [ ] `llms.txt` checked on the live origin
- [ ] Rich Results Test run against a live grade page and a live sector page.
      `check:schema` verifies the structural requirements; only Google can say
      what it will show.
- [ ] International Targeting watched for hreflang errors for the first month

### If an old site exists

- [ ] Crawl it and export every indexed URL
- [ ] Map each to its counterpart here, choosing the Arabic URL where a page
      exists in both
- [ ] Implement as **301** redirects at the edge, not as meta refreshes
- [ ] Anything with no counterpart redirects to the nearest section index, never
      to the home page and never to a 404
- [ ] Keep the redirect map in the repository so the next person can read it

---

## 4. Security and headers

Set in `next.config.ts` and applied to every response. Verify on the live origin,
because a CDN or host can strip or override them.

- [ ] `Content-Security-Policy` present. Note it carries `'unsafe-inline'` for
      `script-src`, which is a deliberate compromise: Next inlines the RSC
      payload and the hydration bootstrap, and the nonce alternative forces every
      route to render dynamically. `'unsafe-eval'` is not granted and
      `object-src` is closed. See ADR-041.
- [ ] `Strict-Transport-Security` present, and HTTPS actually enforced. Do not
      submit to the HSTS preload list until the domain has run on HTTPS
      without incident for a while; it is hard to undo.
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` present
- [ ] `X-Frame-Options: DENY` and `frame-ancestors 'none'`
- [ ] If analytics is enabled, confirm the provider's domain is in `script-src`
      and `connect-src`. Plausible and Google are already listed; another
      provider needs adding or its script will be blocked and fail silently.

---

## 5. Consent and privacy

- [ ] Decide the provider, or leave `NEXT_PUBLIC_ANALYTICS_PROVIDER=none`
- [ ] With a provider set, confirm in devtools that **no request** to it is made
      before consent is given
- [ ] Confirm declining is remembered across a reload
- [ ] Confirm the queued events flush on acceptance and are discarded on refusal
- [ ] Have the consent copy reviewed by somebody with a view on PDPL
      specifically. It is written and translated but has not been reviewed.
- [ ] Add a privacy notice page if analytics is enabled. There is none today,
      which is defensible while nothing is collected and not afterwards.

---

## 6. Error handling and monitoring

- [ ] Confirm a 404 returns status 404, not 200. `curl -I` a nonsense path.
- [ ] Confirm `/` returns 308 to `/ar`
- [ ] Trigger the error boundary in production and confirm it renders in both
      locales rather than a stack trace
- [ ] Wire an error monitor. Sentry's Next.js SDK is the low-friction choice;
      whatever is chosen, its domain must be added to `connect-src` in the CSP
      or reports will be blocked by the header set in §4.
- [ ] Confirm uptime monitoring hits `/ar` rather than `/`, so a broken redirect
      is not reported as healthy

---

## 7. Before the announcement

- [ ] Full gate run green: `npm run check`, `npm run test`, `npm run check:runtime`
- [ ] Lighthouse run against the **live** origin, not a preview. Preview deploys
      carry noindex headers and a redirect hop that depress the numbers.
- [ ] Safari on macOS and iOS checked by hand. This is the largest untested
      surface; see `docs/qa-report.md` §5.
- [ ] Both locales opened on a real phone, in Arabic first
- [ ] The RFQ form completed on that phone, in Arabic, by somebody who did not
      build it
