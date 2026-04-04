"use client";

import { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Mail, MessageSquare, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", honeypot: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot check
    if (form.honeypot) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, subject: form.subject, message: form.message }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Failed to send message. Please email us directly at contact@iusetools.site");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb items={[{ label: "Contact Us" }]} />

      <div className="mt-8 mb-10">
        <h1 className="font-display text-4xl font-extrabold text-foreground mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          Have a question, feedback, or a bug to report? Fill in the form below and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {submitted ? (
            <div className="card text-center py-12">
              <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Message Sent!</h2>
              <p className="text-muted-foreground">Thank you for reaching out. We'll get back to you within 1–2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-5" noValidate>
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                value={form.honeypot}
                onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                className="sr-only"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-semibold text-foreground mb-1.5">Name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-foreground mb-1.5">Email *</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-sm font-semibold text-foreground mb-1.5">Subject *</label>
                <select
                  id="contact-subject"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select a subject...</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="General Question">General Question</option>
                  <option value="Business Inquiry">Business Inquiry</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-semibold text-foreground mb-1.5">Message *</label>
                <textarea
                  id="contact-message"
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what's on your mind..."
                  rows={6}
                  className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full disabled:opacity-50"
                id="contact-submit"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                We typically respond within 1–2 business days. We do not share your contact information.
              </p>
            </form>
          )}
        </div>

        <div className="space-y-5">
          <div className="card">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Email</p>
                <a href="mailto:contact@iusetools.site" className="text-sm text-primary hover:underline">contact@iusetools.site</a>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Response Time</p>
                <p className="text-sm text-muted-foreground">We aim to reply within 1–2 business days.</p>
              </div>
            </div>
          </div>
          <div className="card">
            <p className="text-sm font-semibold text-foreground mb-2">Quick Links</p>
            <ul className="space-y-1">
              <li><a href="/faq" className="text-sm text-primary hover:underline">View FAQ</a></li>
              <li><a href="/help" className="text-sm text-primary hover:underline">Help Center</a></li>
              <li><a href="/privacy-policy" className="text-sm text-primary hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
