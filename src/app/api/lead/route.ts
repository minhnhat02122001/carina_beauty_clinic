import { NextResponse, after } from "next/server";
import { sendLeadNotification, type LeadNotification } from "@/lib/lead-notification";

const HUBSPOT_CONTACTS_URL = "https://api.hubapi.com/crm/v3/objects/contacts";

type LeadPayload = {
  name: string;
  phone: string;
  services?: string[];
  email?: string;
  note?: string;
  scheduleDate?: string;
  locale?: string;
  // Honeypot: real visitors never fill this hidden field — bots usually do.
  hp_field?: string;
  elapsed_ms?: number;
};

// Bots post instantly; a person needs longer than this to fill in name and phone, even with autofill.
const MIN_FILL_TIME_MS = 1500;

function hubspotHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Custom contact properties that only exist once someone creates them in HubSpot's UI.
const CUSTOM_PROPERTIES = ["service_of_interest", "preferred_schedule_date"] as const;

async function sendContact(token: string, properties: Record<string, string>, existingId?: string) {
  return fetch(existingId ? `${HUBSPOT_CONTACTS_URL}/${existingId}` : HUBSPOT_CONTACTS_URL, {
    method: existingId ? "PATCH" : "POST",
    headers: hubspotHeaders(token),
    body: JSON.stringify({ properties }),
  });
}

const CUSTOM_PROPERTY_LABELS: Record<(typeof CUSTOM_PROPERTIES)[number], string> = {
  service_of_interest: "Service of interest",
  preferred_schedule_date: "Schedule date",
};

/** Custom properties HubSpot rejected as not existing, or an empty list for any other kind of response. */
async function missingCustomProperties(res: Response) {
  if (res.status !== 400) return [];
  const body = await res.clone().text().catch(() => "");
  if (!/does not exist/i.test(body)) return [];
  const named = CUSTOM_PROPERTIES.filter((key) => body.includes(key));
  return named.length ? named : [...CUSTOM_PROPERTIES];
}

// If a custom property hasn't been created in HubSpot yet, keep the lead instead of failing it: drop that
// property and append its value to the built-in `message` property so nothing is lost.
function moveToMessage(properties: Record<string, string>, keys: readonly (typeof CUSTOM_PROPERTIES)[number][]) {
  const adjusted = { ...properties };
  const extraLines = keys.filter((key) => adjusted[key]).map((key) => `${CUSTOM_PROPERTY_LABELS[key]}: ${adjusted[key]}`);
  for (const key of keys) delete adjusted[key];
  if (extraLines.length) adjusted.message = [adjusted.message, ...extraLines].filter(Boolean).join("\n");
  return adjusted;
}

async function sendWithFallback(token: string, properties: Record<string, string>, existingId?: string) {
  const res = await sendContact(token, properties, existingId);
  const missing = await missingCustomProperties(res);
  if (!missing.length) return res;
  console.warn("HubSpot custom properties missing, values moved to message:", missing.join(", "));
  return sendContact(token, moveToMessage(properties, missing), existingId);
}

async function createOrUpdateContact(token: string, properties: Record<string, string>) {
  const res = await sendWithFallback(token, properties);
  if (res.ok) return res;

  // HubSpot returns 409 when a contact with the same email already exists; its error message embeds the
  // existing contact's id so we can update that contact instead of failing the whole submission.
  if (res.status === 409) {
    const body = await res.json().catch(() => null);
    const existingId: string | undefined = body?.message?.match(/Existing ID:\s*(\d+)/)?.[1];
    if (existingId) return sendWithFallback(token, properties, existingId);
  }

  return res;
}

export async function POST(request: Request) {
  let payload: LeadPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Silently accept honeypot-triggered submissions without forwarding them, but log it: a real visitor
  // whose browser autofilled the hidden field would otherwise be dropped with no trace anywhere.
  if (payload.hp_field) {
    console.warn("Lead dropped by honeypot field");
    return NextResponse.json({ ok: true });
  }
  if (typeof payload.elapsed_ms === "number" && payload.elapsed_ms < MIN_FILL_TIME_MS) {
    console.warn("Lead dropped: submitted too quickly", payload.elapsed_ms);
    return NextResponse.json({ ok: true });
  }

  const name = payload.name?.trim();
  const phone = payload.phone?.trim();
  if (!name || !phone) {
    return NextResponse.json({ error: "missing_required_fields" }, { status: 400 });
  }

  const properties: Record<string, string> = {
    firstname: name,
    phone,
  };
  // "; " rather than ", " because some service names already contain commas.
  const services = Array.isArray(payload.services)
    ? payload.services.filter((service): service is string => typeof service === "string" && service.trim() !== "")
    : [];
  if (services.length) properties.service_of_interest = services.map((service) => service.trim()).join("; ");
  if (payload.email?.trim()) properties.email = payload.email.trim();
  if (payload.note?.trim()) properties.message = payload.note.trim();
  if (typeof payload.scheduleDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(payload.scheduleDate)) {
    properties.preferred_schedule_date = payload.scheduleDate;
  }

  const notification: Omit<LeadNotification, "hubspotOk"> = {
    name,
    phone,
    email: payload.email?.trim(),
    services: services.map((service) => service.trim()),
    note: payload.note?.trim(),
    scheduleDate: properties.preferred_schedule_date,
    locale: payload.locale,
  };

  // The email is the fallback that keeps a lead from being lost when HubSpot can't take it, so on every
  // HubSpot failure it is awaited: the customer must only see an error when the lead reached nowhere at all.
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) {
    console.error("HUBSPOT_ACCESS_TOKEN is not configured");
    const notified = await sendLeadNotification({ ...notification, hubspotOk: false });
    return notified
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: "server_not_configured" }, { status: 500 });
  }

  const hubspotRes = await createOrUpdateContact(token, properties);

  if (!hubspotRes.ok) {
    const errorBody = await hubspotRes.text().catch(() => "");
    console.error("HubSpot contact submission failed", hubspotRes.status, errorBody);
    const notified = await sendLeadNotification({ ...notification, hubspotOk: false });
    return notified
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: "hubspot_error" }, { status: 502 });
  }

  console.info("Lead sent to HubSpot", hubspotRes.status);

  // Happy path only: sent after the response so the customer never waits on the email provider.
  after(() => sendLeadNotification({ ...notification, hubspotOk: true }));

  return NextResponse.json({ ok: true });
}
