---
paths:
  - "src/app/api/lead/**"
  - "src/app/api/services/**"
  - "src/components/registration-form/**"
  - "src/lib/lead-notification.ts"
---

# Registration Form / Lead Capture

The registration form (`src/components/registration-form/registration-form.tsx`,
with its service picker, date field and success dialog beside it; reused on
several pages) POSTs to `src/app/api/lead/route.ts`, which creates or updates a
HubSpot contact. There is no database and no booking system — a lead
in HubSpot is the end of the flow.

`src/app/api/services/route.ts` feeds the form's service picker from Sanity
(`getServiceOptions(locale)`), cached with `s-maxage=300`.

## Deliberate behaviour in `/api/lead` — don't "clean it up"

- **Spam filtering returns success.** A filled `hp_field` honeypot, or a
  submission faster than `MIN_FILL_TIME_MS`, is dropped and answered with
  `{ok: true}` — silence tells a bot nothing. Both paths `console.warn` so a
  real visitor caught by autofill leaves a trace.
- **409 is not a failure.** HubSpot returns 409 when the email already exists
  and embeds the existing contact id in the error message; the route parses it
  out and retries as a PATCH against that contact.
- **Missing custom properties degrade, they don't fail.** `service_of_interest`
  and `preferred_schedule_date` only exist if someone created them in the
  HubSpot UI. If HubSpot rejects them, the route strips them and appends their
  values to the built-in `message` property rather than losing the lead.

## Rate limit lives in Vercel, not in the code

A Vercel Firewall rule named "Rate limit lead form" caps `/api/lead` at 10
requests per 60 s per IP (the 11th gets `429`). It's set in the Vercel
dashboard (Firewall), so nothing in this repo shows it — don't add a second
limiter in the route. It's deliberately looser than 5 per 10 min because
Vietnamese mobile carriers put many customers behind one shared IP.

Only `name` and `phone` are required. `scheduleDate` must match `YYYY-MM-DD` or
it is dropped.
