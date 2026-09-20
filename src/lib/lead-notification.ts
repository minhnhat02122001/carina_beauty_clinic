import { createHash } from "node:crypto";
import { Resend } from "resend";

// Staff-facing notification, not visitor-facing UI: the copy is Vietnamese-only and lives
// here rather than in src/messages/*.json, which covers strings rendered in components.
const LABELS = {
  name: "Họ và tên",
  phone: "Số điện thoại",
  email: "Email",
  services: "Dịch vụ quan tâm",
  scheduleDate: "Ngày hẹn",
  note: "Ghi chú",
  submittedAt: "Thời gian gửi",
  locale: "Ngôn ngữ trang",
  empty: "(không có)",
  hubspotFailed: "Lead này CHƯA được đồng bộ sang HubSpot — vui lòng nhập thủ công.",
} as const;

const LOCALE_NAMES: Record<string, string> = {
  vi: "Tiếng Việt",
  en: "Tiếng Anh",
  zh: "Tiếng Trung",
};

// Resend rejects a reused idempotency key whose payload changed, so the timestamp shown in
// the email is rounded to the same window the key is derived from — otherwise a resend of
// the very same submission would differ by a few seconds and be refused.
const DEDUPE_WINDOW_MS = 60_000;

export type LeadNotification = {
  name: string;
  phone: string;
  email?: string;
  services?: string[];
  note?: string;
  scheduleDate?: string;
  locale?: string;
  hubspotOk: boolean;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatTime(windowMs: number) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(windowMs));
}

function buildRows(lead: LeadNotification, windowMs: number): [string, string][] {
  return [
    [LABELS.name, lead.name],
    [LABELS.phone, lead.phone],
    [LABELS.email, lead.email?.trim() || LABELS.empty],
    [LABELS.services, lead.services?.length ? lead.services.join(", ") : LABELS.empty],
    [LABELS.scheduleDate, lead.scheduleDate?.trim() || LABELS.empty],
    [LABELS.note, lead.note?.trim() || LABELS.empty],
    [LABELS.submittedAt, formatTime(windowMs)],
    [LABELS.locale, lead.locale ? (LOCALE_NAMES[lead.locale] ?? lead.locale) : LABELS.empty],
  ];
}

function buildText(lead: LeadNotification, windowMs: number) {
  const rows = buildRows(lead, windowMs)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
  return lead.hubspotOk ? rows : `${LABELS.hubspotFailed}\n\n${rows}`;
}

function buildHtml(lead: LeadNotification, windowMs: number) {
  const rows = buildRows(lead, windowMs)
    .map(
      ([label, value]) =>
        `<tr>` +
        `<td style="padding:8px 16px 8px 0;vertical-align:top;color:#6b7280;white-space:nowrap">${escapeHtml(label)}</td>` +
        `<td style="padding:8px 0;vertical-align:top;color:#111827;font-weight:600;white-space:pre-wrap">${escapeHtml(value)}</td>` +
        `</tr>`,
    )
    .join("");

  const warning = lead.hubspotOk
    ? ""
    : `<p style="margin:0 0 16px;padding:12px 16px;border-radius:8px;background:#fef2f2;color:#991b1b;font-weight:600">` +
      `⚠ ${escapeHtml(LABELS.hubspotFailed)}</p>`;

  return (
    `<div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6">` +
    warning +
    `<table style="border-collapse:collapse">${rows}</table>` +
    `</div>`
  );
}

/** Sends the clinic's new-lead notification. Never throws — returns whether it was accepted. */
export async function sendLeadNotification(lead: LeadNotification): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_NOTIFICATION_FROM;
  // Comma-separated so recipients can be added or removed without a deploy.
  const to = (process.env.LEAD_NOTIFICATION_TO ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  if (!apiKey || !from || !to.length) {
    console.warn("Lead notification skipped: RESEND_API_KEY, LEAD_NOTIFICATION_FROM or LEAD_NOTIFICATION_TO is not configured");
    return false;
  }

  const windowMs = Math.floor(Date.now() / DEDUPE_WINDOW_MS) * DEDUPE_WINDOW_MS;
  const subject = `${lead.hubspotOk ? "" : "⚠ Chưa đồng bộ HubSpot — "}Yêu cầu tư vấn mới — ${lead.name} (${lead.phone})`;
  // Collapses a double-submitted form into one email; a genuinely different submission
  // hashes differently and still goes out.
  const idempotencyKey = `lead-notification/${createHash("sha256")
    .update(JSON.stringify({ lead, windowMs }))
    .digest("hex")
    .slice(0, 32)}`;

  try {
    const { error } = await new Resend(apiKey).emails.send(
      {
        from,
        to,
        subject,
        html: buildHtml(lead, windowMs),
        text: buildText(lead, windowMs),
        // Lets staff reply straight to the customer from their inbox.
        replyTo: lead.email?.trim() || undefined,
      },
      { idempotencyKey },
    );

    if (error) {
      console.error("Lead notification failed", error);
      return false;
    }

    console.info("Lead notification sent to", to.length, "recipient(s)");
    return true;
  } catch (error) {
    // The SDK reports API errors via `error` above; this only catches transport-level throws
    // so the caller's contract (never throws) holds.
    console.error("Lead notification threw", error);
    return false;
  }
}
