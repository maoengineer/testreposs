import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    if (message.length < 10) {
      return NextResponse.json({ error: "Message too short" }, { status: 400 });
    }

    // In production, integrate with Resend, SendGrid, or your email provider
    // using the RESEND_API_KEY and CONTACT_EMAIL environment variables.
    // For now, log the submission (visible in Vercel function logs).
    console.log("[Contact Form Submission]", { name, email, subject, messageLength: message.length });

    // If RESEND_API_KEY is set, send an email
    const resendKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL || "contact@iusetools.site";

    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "iUseTools Contact <noreply@iusetools.site>",
          to: contactEmail,
          subject: `[iUseTools Contact] ${subject}`,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
        }),
      });
      if (!res.ok) console.error("Resend error:", await res.text());
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
