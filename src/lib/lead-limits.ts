// Shared by /api/lead (which rejects anything longer) and the registration form (whose inputs carry the same
// maxLength), so a real visitor is stopped while typing instead of losing the lead to a 400 on submit.
export const LEAD_FIELD_LIMITS = { name: 100, phone: 30, email: 254, note: 2000 } as const;
// Above the full treatment catalogue (~53), so ticking every service still submits; it only bounds scripts.
export const MAX_SERVICES = 100;
export const MAX_SERVICE_LENGTH = 200;
