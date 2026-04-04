import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "iUseTools's cookie policy explaining the types of cookies we use and how to manage your cookie preferences.",
  alternates: { canonical: "https://iusetools.site/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb items={[{ label: "Cookie Policy" }]} />
      <div className="mt-8 space-y-6">
        <h1 className="font-display text-4xl font-extrabold text-foreground">Cookie Policy</h1>
        <p className="text-muted-foreground text-sm">Last updated: January 1, 2025</p>

        <p className="text-muted-foreground">This Cookie Policy explains how iUseTools uses cookies and similar technologies.</p>

        <h2 className="font-display text-xl font-bold text-foreground">What Are Cookies?</h2>
        <p className="text-muted-foreground text-sm">Cookies are small text files stored on your device by your browser. They allow websites to remember information about your visit, like your preferences or login status.</p>

        <h2 className="font-display text-xl font-bold text-foreground">Types of Cookies We Use</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="text-left px-4 py-3 text-foreground font-semibold rounded-tl-lg">Type</th>
                <th className="text-left px-4 py-3 text-foreground font-semibold">Purpose</th>
                <th className="text-left px-4 py-3 text-foreground font-semibold rounded-tr-lg">Required?</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">Essential</td>
                <td className="px-4 py-3 text-muted-foreground">Stores your cookie consent preference (cookie-consent). Required for the cookie banner to work correctly.</td>
                <td className="px-4 py-3 text-emerald-600 font-medium">Yes</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">Analytics</td>
                <td className="px-4 py-3 text-muted-foreground">Google Analytics cookies (_ga, _gid) for aggregate usage statistics. Only active with your consent.</td>
                <td className="px-4 py-3 text-muted-foreground">Optional</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">Advertising</td>
                <td className="px-4 py-3 text-muted-foreground">Google AdSense cookies for ad delivery and frequency capping. Only active if AdSense is configured and you have consented.</td>
                <td className="px-4 py-3 text-muted-foreground">Optional</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="font-display text-xl font-bold text-foreground">Managing Cookies</h2>
        <p className="text-muted-foreground text-sm">You can control cookies through the cookie banner that appears when you first visit the site. You may choose "Essential Only" to decline analytics and advertising cookies. You can also clear cookies through your browser settings at any time.</p>
        <p className="text-muted-foreground text-sm">Most browsers allow you to refuse all cookies, accept only certain types, or delete cookies. Removing essential cookies may affect site functionality.</p>

        <h2 className="font-display text-xl font-bold text-foreground">Third-Party Cookies</h2>
        <p className="text-muted-foreground text-sm">Google Analytics and Google AdSense operate under their own cookie policies. Please review Google's <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a> for details.</p>

        <h2 className="font-display text-xl font-bold text-foreground">Contact</h2>
        <p className="text-muted-foreground text-sm">Questions about cookies: <a href="mailto:privacy@iusetools.site" className="text-primary hover:underline">privacy@iusetools.site</a></p>
      </div>
    </div>
  );
}
