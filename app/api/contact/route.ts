import { Resend } from "resend";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  message?: string;
};

const TO = process.env.CONTACT_TO || "hello@thelontech.com";
// Until you verify your own domain in Resend, their shared sender works for testing.
const FROM = process.env.CONTACT_FROM || "Thelon Website <onboarding@resend.dev>";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const company = (body.company || "").trim();
  const phone = (body.phone || "").trim();
  const message = (body.message || "").trim();

  // Server-side validation
  if (name.length < 2 || message.length < 5 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json(
      { error: "Please provide a valid name, email, and message." },
      { status: 422 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;

  // Graceful fallback so the form works in dev before a key is configured.
  if (!apiKey) {
    console.warn(
      "[contact] RESEND_API_KEY not set — logging submission instead of sending.",
      { name, email, company, phone, message }
    );
    return Response.json({ ok: true, delivered: false });
  }

  const resend = new Resend(apiKey);

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#0b1b34;line-height:1.6">
      <h2 style="margin:0 0 12px">New project enquiry</h2>
      <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0 0 4px"><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${company ? `<p style="margin:0 0 4px"><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
      ${phone ? `<p style="margin:0 0 4px"><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
      <p style="margin:12px 0 4px"><strong>Message:</strong></p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `New enquiry from ${name}${company ? ` · ${company}` : ""}`,
      html,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return Response.json({ error: "Could not send message." }, { status: 502 });
    }

    return Response.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return Response.json({ error: "Could not send message." }, { status: 500 });
  }
}
