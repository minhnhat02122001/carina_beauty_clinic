import { NextResponse } from "next/server";

const HUBSPOT_CONTACTS_URL = "https://api.hubapi.com/crm/v3/objects/contacts";

type LeadPayload = {
  name: string;
  phone: string;
  service: string;
  email?: string;
  note?: string;
  // Honeypot: real visitors never fill this hidden field — bots usually do.
  company?: string;
};

function hubspotHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function createOrUpdateContact(token: string, properties: Record<string, string>) {
  const createRes = await fetch(HUBSPOT_CONTACTS_URL, {
    method: "POST",
    headers: hubspotHeaders(token),
    body: JSON.stringify({ properties }),
  });

  if (createRes.ok) return createRes;

  const body = await createRes.json().catch(() => null);

  // HubSpot returns 409 when a contact with the same email already exists;
  // its error message embeds the existing contact's id so we can update it
  // instead of failing the whole submission.
  if (createRes.status === 409) {
    const existingId: string | undefined = body?.message?.match(/Existing ID:\s*(\d+)/)?.[1];
    if (existingId) {
      return fetch(`${HUBSPOT_CONTACTS_URL}/${existingId}`, {
        method: "PATCH",
        headers: hubspotHeaders(token),
        body: JSON.stringify({ properties }),
      });
    }
  }

  // Free HubSpot accounts don't have `service_of_interest`/`message` created
  // as contact properties until someone adds them once in HubSpot's UI. If
  // that hasn't happened yet, retry with only HubSpot's built-in properties
  // so the lead is still captured instead of being dropped entirely.
  if (createRes.status === 400 && /property .* does not exist/i.test(body?.message ?? "")) {
    const standardProperties = { ...properties };
    delete standardProperties.service_of_interest;
    delete standardProperties.message;
    return fetch(HUBSPOT_CONTACTS_URL, {
      method: "POST",
      headers: hubspotHeaders(token),
      body: JSON.stringify({ properties: standardProperties }),
    });
  }

  return createRes;
}

export async function POST(request: Request) {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) {
    console.error("HUBSPOT_ACCESS_TOKEN is not configured");
    return NextResponse.json({ error: "server_not_configured" }, { status: 500 });
  }

  let payload: LeadPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Silently accept honeypot-triggered submissions without forwarding them.
  if (payload.company) {
    return NextResponse.json({ ok: true });
  }

  const name = payload.name?.trim();
  const phone = payload.phone?.trim();
  const service = payload.service?.trim();
  if (!name || !phone || !service) {
    return NextResponse.json({ error: "missing_required_fields" }, { status: 400 });
  }

  const properties: Record<string, string> = {
    firstname: name,
    phone,
    service_of_interest: service,
  };
  if (payload.email?.trim()) properties.email = payload.email.trim();
  if (payload.note?.trim()) properties.message = payload.note.trim();

  const hubspotRes = await createOrUpdateContact(token, properties);

  if (!hubspotRes.ok) {
    const errorBody = await hubspotRes.text().catch(() => "");
    console.error("HubSpot contact submission failed", hubspotRes.status, errorBody);
    return NextResponse.json({ error: "hubspot_error" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
