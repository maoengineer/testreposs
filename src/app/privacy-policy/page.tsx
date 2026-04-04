import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "iUseTools's privacy policy explaining how we handle your data, our use of cookies, analytics, and our commitment to browser-based processing.",
  alternates: { canonical: "https://iusetools.site/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb items={[{ label: "Privacy Policy" }]} />
      <div className="mt-8 prose-content space-y-6">
        <h1 className="font-display text-4xl font-extrabold text-foreground">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm">Last updated: January 1, 2025</p>

        <p className="text-muted-foreground">This Privacy Policy describes how iUseTools ("we", "us", or "our") collects, uses, and shares information when you use our website at iusetools.site. We are committed to protecting your privacy and being transparent about our practices.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8">1. File Processing and Privacy</h2>
        <p className="text-muted-foreground">The most important thing to understand about iUseTools is that <strong className="text-foreground">your files are never uploaded to our servers</strong>. All file processing — including PDF conversion, OCR, and document generation — happens entirely in your browser using WebAssembly technology. Your files remain on your device throughout the process and are never transmitted to iUseTools or any third party.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8">2. Information We Collect</h2>
        <h3 className="font-semibold text-foreground mt-4">Analytics Data</h3>
        <p className="text-muted-foreground">We may use Google Analytics to collect aggregate, anonymized usage data including pages visited, time on site, and geographic region. This data does not identify you individually and is used only to improve the site.</p>
        <h3 className="font-semibold text-foreground mt-4">Contact Form</h3>
        <p className="text-muted-foreground">If you submit the contact form, we collect your name, email address, and message content. We use this solely to respond to your inquiry and do not use it for marketing purposes.</p>
        <h3 className="font-semibold text-foreground mt-4">Cookies</h3>
        <p className="text-muted-foreground">We use essential cookies to store your cookie consent preference. We may also use analytics cookies (with your consent) and advertising cookies if Google AdSense is active. See our <Link href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link> for details.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8">3. Advertising</h2>
        <p className="text-muted-foreground">We may display advertisements served by Google AdSense. Google may use cookies to serve ads based on your browsing history. You can opt out of personalized advertising at <a href="https://www.google.com/settings/ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Ad Settings</a> or through the <a href="https://optout.networkadvertising.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">NAI opt-out page</a>.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8">4. Third-Party Services</h2>
        <p className="text-muted-foreground">We use the following third-party services:</p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
          <li>Google Analytics (aggregate usage statistics)</li>
          <li>Google AdSense (advertising, if active)</li>
          <li>Vercel (hosting and deployment)</li>
          <li>Resend (contact form email delivery, if configured)</li>
        </ul>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8">5. Data Retention</h2>
        <p className="text-muted-foreground">We do not store your files or conversion results. Contact form submissions may be retained for up to 90 days to ensure we respond to all inquiries. Analytics data is retained according to Google Analytics default settings (26 months).</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8">6. Your Rights</h2>
        <p className="text-muted-foreground">Depending on your location, you may have rights including access, correction, deletion, and data portability. To exercise any rights related to data we hold about you (contact form data only), please email us at privacy@iusetools.site.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8">7. Children's Privacy</h2>
        <p className="text-muted-foreground">iUseTools is not directed at children under 13. We do not knowingly collect personal information from children under 13.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8">8. Changes to This Policy</h2>
        <p className="text-muted-foreground">We may update this policy from time to time. We will notify users of significant changes by posting the new policy on this page with an updated date.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8">9. Contact</h2>
        <p className="text-muted-foreground">For privacy-related questions: <a href="mailto:privacy@iusetools.site" className="text-primary hover:underline">privacy@iusetools.site</a></p>
      </div>
    </div>
  );
}
