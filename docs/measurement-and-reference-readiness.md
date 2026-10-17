# Measurement and reference readiness — 17 October 2026

## Verified state

- Production uses GA4, measurement ID in `lib/analytics/client.ts`.
- Vercel Web Analytics is not enabled (project API read on 17 October 2026).
- No connected GA4 report tool was available in this session. Actual traffic,
  qualified leads and conversion rates have not been verified.
- Private lead storage is the operational record. GA4 counts only consenting
  visitors; its numbers must not be presented as all submitted requests.

## Conversion contract

- `contact_submit` is rendered only after the server validates a stored-request
  receipt against its HTTP-only cookie and the service/audit context.
- The receipt deduplicates analytics within the current browser session. It is
  not sent to GA4. Session storage restrictions reduce this to in-memory
  deduplication; GA4 is not a transaction ledger.
- Consent given on a mounted confirmation page triggers the pending event.
- Confirmation receipts and submission/error flags are removed from the
  explicitly supplied GA4 page location. Campaign parameters are preserved.
- Tests exercise consent, reloads, different receipts, blocked session storage,
  repeated consent events and event-listener cleanup.

## First 30-day assessment

Use a fixed start/end date and exclude internal QA. Report separately:

| Stage | Evidence | Measurement |
| --- | --- | --- |
| Visits | GA4 report | Campaign sessions, consenting population |
| Intake | Private lead records | Actual persisted requests; exclude duplicates/QA |
| Qualified | Reviewed CRM row | Confirmed business need and suitable scope |
| Offer | Approved, sent offer record | Actual offers, product and price |
| Won | Written acceptance and payment evidence | Actual revenue; recurring revenue separately |

The master targets of at least 3% landing conversion and 25% offer-to-win are
initial test targets, not measured current results. Do not divide all persisted
leads by a consent-only session denominator and label it a sitewide conversion.
Track sales and delivery time so that sales volume can be assessed alongside
margin. A website project is one-time revenue; monthly service is MRR only
under an active paid recurring agreement.

## Reference publication gate

The commercial master, section 8, requires separate written permission for
customer logos, pictures, work samples, figures and case stories in Virella's
own marketing:
https://docs.google.com/document/d/1SrYSHWCNgNHAYBBIhPeWpOgx5n3x6pLjZC0XOY5mlwM/edit

The checked JKP correspondence approves content on JKP's own website. It does
not establish permission for Virella's portfolio. Checked Gmail searches did
not identify a separate customer permission. This is a search result, not a
claim that permission cannot exist elsewhere.

Before publishing, record the customer's authorized approver, approval message,
exact assets and copy, permitted brand/channel and any restrictions. Confirm
whether the delivery belongs to Virella, VIDO Social or GhoulHouse; do not
relabel another company's work. No customer references were published in this
change. Example materials remain explicitly labelled examples.
