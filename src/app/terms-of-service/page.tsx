import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read iUseTools's Terms of Service governing the use of our free file conversion tools.",
  alternates: { canonical: "https://iusetools.site/terms-of-service" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb items={[{ label: "Terms of Service" }]} />
      <div className="mt-8 space-y-6">
        <h1 className="font-display text-4xl font-extrabold text-foreground">Terms of Service</h1>
        <p className="text-muted-foreground text-sm">Last updated: January 1, 2025</p>

        <p className="text-muted-foreground">By using iUseTools (iusetools.site), you agree to these Terms of Service. Please read them carefully.</p>

        {[
          { title: "1. Acceptance of Terms", body: "By accessing and using iUseTools, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use the service." },
          { title: "2. Description of Service", body: "iUseTools provides free browser-based file conversion tools including PDF conversion, OCR, document generation, and image processing. The service is provided 'as is' without warranty of any kind." },
          { title: "3. Free Service", body: "iUseTools is provided free of charge. We reserve the right to introduce optional premium features in the future, but core conversion functionality will remain free." },
          { title: "4. Acceptable Use", body: "You may use iUseTools for personal and commercial purposes within the bounds of these Terms. You agree not to: (a) use the service to process illegal content; (b) attempt to reverse-engineer or copy the service; (c) use automated bots or scrapers to abuse the service; (d) circumvent any rate limits or security measures." },
          { title: "5. Privacy and File Processing", body: "All file processing occurs in your browser. We do not receive, store, or process your files on our servers. You are solely responsible for the content of files you process." },
          { title: "6. Intellectual Property", body: "iUseTools and its original content are owned by iUseTools. The open-source libraries used (Tesseract.js, PDF.js, docx, jsPDF) are subject to their respective open-source licenses." },
          { title: "7. Disclaimer of Warranties", body: "THE SERVICE IS PROVIDED 'AS IS' WITHOUT WARRANTIES OF ANY KIND. WE DO NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE, ACCURATE, OR UNINTERRUPTED. OCR AND CONVERSION RESULTS ARE PROVIDED ON A BEST-EFFORT BASIS AND MAY CONTAIN ERRORS." },
          { title: "8. Limitation of Liability", body: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, iUseTools SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE." },
          { title: "9. Advertising", body: "iUseTools displays third-party advertisements. We are not responsible for the content of third-party ads. Clicking on ads is entirely at your discretion." },
          { title: "10. Changes to Terms", body: "We reserve the right to update these Terms at any time. Continued use of the service after changes constitutes acceptance of the new Terms." },
          { title: "11. Contact", body: "For questions about these Terms: contact@iusetools.site" },
        ].map((section) => (
          <div key={section.title} className="space-y-2">
            <h2 className="font-display text-xl font-bold text-foreground">{section.title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
