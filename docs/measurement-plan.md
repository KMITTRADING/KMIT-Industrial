# Measurement plan

> Written in Phase 5. The implementation lives in `src/lib/analytics.ts` and
> `src/components/layout/AnalyticsConsent.tsx`. This document is the contract
> those two files implement.

---

## 1. What this site is measuring for

The conversion event is a **qualified RFQ**: a request carrying grade, tonnage,
application and destination. Everything else on the site exists to produce one
or to make one better qualified.

That makes the measurement question narrow. It is not "how many visitors"; it is:

1. Which grades and sectors do readers actually study before they enquire?
2. Where in the three-step RFQ form do they stop?
3. Which documents do they ask for, and for which grade?
4. Does the Arabic side or the English side carry the enquiry?

A vanity dashboard answers none of those. Every event below exists because one
of them does.

---

## 2. Current state

`NEXT_PUBLIC_ANALYTICS_PROVIDER` is unset, so it resolves to `none`. **No
analytics script loads, no request is made, and no consent prompt is shown.**
There is no measurement ID because no property has been created yet.

The consent machinery ships anyway. Retrofitting consent onto a property that is
already collecting is how a site ends up holding data it should not have, and
the queue in `track()` means the call sites are already correct on the day an ID
is issued.

---

## 3. Provider choice

| Option      | When it is right                                                                                                                                                                    |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `none`      | Today. No property, no collection.                                                                                                                                                  |
| `plausible` | Recommended. No cookies, no cross-site identifiers, EU-hosted, and the reporting model matches a low-volume, high-value B2B site far better than a session-and-funnel product does. |
| `ga4`       | If the client already runs GA4 across their estate and wants this property inside it. Configured with `anonymize_ip`.                                                               |

Set both variables to switch:

```
NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible
NEXT_PUBLIC_ANALYTICS_ID=kmit.example        # Plausible: the domain
# or
NEXT_PUBLIC_ANALYTICS_PROVIDER=ga4
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX        # GA4: the measurement ID
```

---

## 4. Consent

Saudi Arabia's PDPL and, for GCC-wide and European traffic, the GDPR both make
non-essential analytics opt-in. The implementation takes the strict reading,
which is also the simple one:

- **Nothing loads before consent.** The vendor `<script>` element is not
  rendered while consent is `unknown` or `denied`. There is no request, no
  cookie, and no identifier.
- **Events are queued, not sent.** `track()` appends to an in-memory array from
  the first paint. On consent the queue is replayed; on refusal it is discarded.
  Call sites never branch on consent, which is what stops one component leaking
  a hit because somebody forgot a check.
- **The prompt is symmetric.** Accept and decline are the same size, the same
  shape and the same distance from the reader's hand. Declining is stored as
  firmly as accepting, so the prompt is shown once either way.
- **The preference is local.** It is written to `localStorage` under
  `kmit.analytics-consent`, not to a cookie, so refusing analytics does not
  itself set a tracker.

---

## 5. Events

Eight events, declared in `src/lib/analytics.ts` and typed, so a component
cannot invent a ninth by typo.

| Event                 | Fires when                                 | Parameters          | Answers                                               |
| --------------------- | ------------------------------------------ | ------------------- | ----------------------------------------------------- |
| `rfq_started`         | First edit to any RFQ field, once per form | `grade`, `sector`   | How many readers begin, against how many arrive       |
| `rfq_field_completed` | Blur on a completed field                  | `field`, `step`     | Which field is the one people stop on                 |
| `rfq_submitted`       | Submit passes validation                   | `grade`, `sector`   | Completion rate, and which grades convert             |
| `tds_download`        | A document row is followed                 | `grade`, `document` | Which grade and which document type is in demand      |
| `grade_compared`      | A grade is added to the comparison         | `grade`, `count`    | Which grades are genuinely alternatives to each other |
| `locale_switched`     | The locale switcher is used                | `locale`            | Whether the Arabic or English page is landed on first |
| `contact_click`       | A phone or email channel is followed       | `grade`             | Enquiries that bypass the form                        |
| `whatsapp_click`      | The WhatsApp channel is followed           | `grade`             | Same, for the channel Gulf buyers actually use        |

### What is deliberately not collected

- **No field values.** `rfq_field_completed` carries the field _name_. The RFQ
  form holds a company name, a contact name, an email address and a phone
  number, and none of them belongs in an analytics payload.
- **No free-form strings.** Parameters are grade codes, sector ids, document
  types, locales and integers. Everything that could carry personal data by
  accident is excluded by the type.
- **No scroll depth, no heatmaps, no session recording.** A recording of a
  procurement manager filling in a quotation request is a copy of their
  commercial intent held by a third party.

---

## 6. The funnel

```
page view
  -> rfq_started            (began the form)
    -> rfq_field_completed  (per field: where it stalls)
      -> rfq_submitted      (qualified enquiry)
```

Two ratios are worth watching and nothing else is, at this volume:

- **started / sessions on `/rfq`** — is the form itself the obstacle, or is it
  the pages that route to it?
- **submitted / started** — is the three-step form too long, and which step
  loses people?

At this traffic level, statistical significance on anything narrower is not
achievable, and treating small differences as signal is worse than not
measuring. Read these quarterly, not weekly.

---

## 7. Search Console

Two properties are needed, because the locales are separate document sets:

1. **Domain property** for the whole site, which covers both locales and every
   subdomain. This is the one to create first.
2. Optionally, **URL-prefix properties** for `/ar/` and `/en/` if the client
   wants the two locales reported separately without filtering.

Verification: use the **DNS TXT record** method on the domain property. It
survives a redeploy, a hosting change and a framework upgrade, none of which is
true of an HTML file or a meta tag. If a file must be used instead, drop it in
`public/` where it is served verbatim; the proxy matcher already excludes any
path containing a dot, so a verification file will not be locale-redirected.

After verification:

- Submit `https://<domain>/sitemap.xml` under Sitemaps. It carries all
  42 URLs with their `hreflang` alternates.
- Watch **International Targeting** for hreflang errors for the first month.
  Reciprocity errors there are the earliest signal that a canonical and an
  alternate have drifted apart.
- Revisit `docs/keyword-clusters.md` after 60 days against real query data, as
  that document already instructs.

---

## 8. UTM convention

Campaign traffic is tagged consistently or it is not attributable at all. The
convention:

```
utm_source    = the platform            linkedin | google | email | tradeshow | partner
utm_medium    = the mechanism           cpc | organic-social | newsletter | qr | referral
utm_campaign  = <year>-<quarter>-<subject>    2026-q3-coated-grades
utm_content   = the specific creative   carousel-a | text-b | banner-728
utm_term      = the keyword, paid search only
```

Rules:

- Lower case, hyphen-separated. `Coated_Grades` and `coated-grades` are two
  campaigns in every report that exists.
- `utm_campaign` always starts with the period, so campaigns sort
  chronologically and a report is readable a year later.
- Never tag an internal link. An internal UTM restarts the session in most
  tools and destroys the attribution of the visit that produced the enquiry.
- Print and trade-show QR codes point at `/ar/rfq` with
  `utm_medium=qr`, not at the home page. A buyer scanning a code at a stand
  wants the form.

---

## 9. Open items

- No property has been created and no measurement ID exists.
- The consent copy is written and translated but has never been reviewed by
  anyone with a view on PDPL specifically.
- `contact_click` and `whatsapp_click` are wired but cannot fire: the contact
  channels have no `href` while the phone number, WhatsApp number and email
  addresses remain open items in `docs/technical-data.md` §8.
