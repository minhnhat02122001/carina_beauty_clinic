# Registration Form / Lead Capture

The registration form (`src/app/[locale]/_home-sections/registration-form.tsx`,
reused on several pages) POSTs to `src/app/api/lead/route.ts`, which creates or
updates a HubSpot contact. There is no database and no booking system — a lead
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

Only `name` and `phone` are required. `scheduleDate` must match `YYYY-MM-DD` or
it is dropped.
