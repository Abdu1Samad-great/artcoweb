import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { isKnownService } from "@/lib/inquiry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type InquiryBody = {
  name?: unknown;
  phone?: unknown;
  service?: unknown;
  description?: unknown;
  company?: unknown;
};

type RateEntry = { count: number; resetAt: number };

const globalForRate = globalThis as unknown as {
  __artcoInquiryRate?: Map<string, RateEntry>;
};

const rateLimit =
  globalForRate.__artcoInquiryRate ??
  (globalForRate.__artcoInquiryRate = new Map<string, RateEntry>());

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 6;

function isRateLimited(key: string) {
  const now = Date.now();

  if (rateLimit.size > 500) {
    for (const [entryKey, entry] of rateLimit) {
      if (entry.resetAt <= now) rateLimit.delete(entryKey);
    }
  }

  const existing = rateLimit.get(key);
  if (!existing || existing.resetAt <= now) {
    rateLimit.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  existing.count += 1;
  return existing.count > MAX_ATTEMPTS;
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function storeLocally(record: Record<string, unknown>) {
  const directory = path.join(process.cwd(), ".data");
  await fs.mkdir(directory, { recursive: true });
  await fs.appendFile(
    path.join(directory, "inquiries.jsonl"),
    `${JSON.stringify(record)}\n`,
    "utf8",
  );
}

async function sendEmail(inquiry: {
  name: string;
  phone: string;
  service: string;
  description: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  if (!apiKey || !to) return false;

  const from =
    process.env.INQUIRY_FROM_EMAIL ?? "ARTCO Website <onboarding@resend.dev>";

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6;max-width:640px">
      <p style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#666">New project inquiry</p>
      <h1 style="font-size:26px;font-weight:400;margin:0 0 20px">${escapeHtml(inquiry.name)}</h1>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <tr><td style="padding:10px 0;border-top:1px solid #ddd;color:#666;width:120px">Phone</td><td style="padding:10px 0;border-top:1px solid #ddd">${escapeHtml(inquiry.phone)}</td></tr>
        <tr><td style="padding:10px 0;border-top:1px solid #ddd;color:#666">Service</td><td style="padding:10px 0;border-top:1px solid #ddd">${escapeHtml(inquiry.service)}</td></tr>
        <tr><td style="padding:10px 0;border-top:1px solid #ddd;color:#666;vertical-align:top">Project</td><td style="padding:10px 0;border-top:1px solid #ddd;white-space:pre-wrap">${escapeHtml(inquiry.description)}</td></tr>
      </table>
      <p style="margin-top:24px;font-size:12px;color:#888">Sent from the ARTCO website inquiry form.</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `New ARTCO inquiry — ${inquiry.name} (${inquiry.service})`,
      html,
      reply_to: to,
    }),
  });

  if (!response.ok) {
    console.error("Resend delivery failed", response.status);
    return false;
  }

  return true;
}

async function sendWebhook(inquiry: Record<string, unknown>) {
  const url = process.env.INQUIRY_WEBHOOK_URL;
  if (!url) return false;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.INQUIRY_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.INQUIRY_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(inquiry),
    });

    if (!response.ok) {
      console.error("Inquiry webhook failed", response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Inquiry webhook error", error);
    return false;
  }
}

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many inquiries have been sent. Please try again later." },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: InquiryBody;
  try {
    body = (await request.json()) as InquiryBody;
  } catch {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  // Honeypot: pretend success for bots without processing the inquiry.
  if (clean(body.company, 200)) {
    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 32);
  const service = clean(body.service, 80);
  const description = clean(body.description, 2000);
  const digits = phone.replace(/\D/g, "");

  const valid =
    name.length >= 2 &&
    /^[+()\d\s.-]{7,24}$/.test(phone) &&
    digits.length >= 7 &&
    digits.length <= 15 &&
    isKnownService(service) &&
    description.length >= 10 &&
    description.length <= 2000;

  if (!valid) {
    return NextResponse.json(
      { error: "Please complete all required fields with valid details." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const inquiry = {
    name,
    phone,
    service,
    description,
    receivedAt: new Date().toISOString(),
  };

  let delivered = false;
  let stored = false;

  try {
    delivered = await sendEmail(inquiry);
  } catch (error) {
    console.error("Inquiry email error", error);
  }

  try {
    delivered = (await sendWebhook(inquiry)) || delivered;
  } catch (error) {
    console.error("Inquiry webhook error", error);
  }

  try {
    await storeLocally(inquiry);
    stored = true;
  } catch (error) {
    console.error("Local inquiry storage failed", error);
  }

  if (!delivered && !stored) {
    return NextResponse.json(
      {
        error:
          "We couldn't deliver your inquiry just now. Please try again, or reach us through WhatsApp or email.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
