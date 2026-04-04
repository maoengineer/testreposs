import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Read iUseTools's disclaimer covering the accuracy of conversions, OCR results, and the limitations of free browser-based tools.",
  alternates: { canonical: "https://iusetools.site/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb items={[{ label: "Disclaimer" }]} />
      <div className="mt-8 space-y-6">
        <h1 className="font-display text-4xl font-extrabold text-foreground">Disclaimer</h1>
        <p className="text-muted-foreground text-sm">Last updated: January 1, 2025</p>

        {[
          { title: "Accuracy of Conversion Results", body: "iUseTools provides file conversion tools on a best-effort basis. OCR results, PDF extractions, and document conversions may not always be 100% accurate. The accuracy of results can vary significantly based on file quality, format complexity, fonts used, and language. We strongly recommend reviewing all converted documents for accuracy before using them for important purposes." },
          { title: "No Professional Advice", body: "iUseTools is a general-purpose file conversion tool. Nothing on this website should be construed as legal, medical, financial, or other professional advice. If you are processing sensitive documents, consult the appropriate professional." },
          { title: "No Warranty", body: "While we strive to ensure tools work reliably, iUseTools makes no warranty that the service will be uninterrupted, error-free, or that results will meet your specific requirements. The service is provided 'as is'." },
          { title: "Third-Party Libraries", body: "iUseTools uses open-source libraries (Tesseract.js, PDF.js, docx, jsPDF). These libraries are maintained by their respective open-source communities. We cannot guarantee the behavior of third-party software." },
          { title: "External Links", body: "Our website may contain links to third-party websites or resources. These links are provided for convenience only. We have no control over the content of those sites and accept no responsibility for them." },
          { title: "Advertising", body: "iUseTools displays advertisements. The presence of an ad on this site does not constitute our endorsement of the advertised product or service. Ad content is controlled by Google AdSense." },
          { title: "File Processing", body: "All file processing occurs client-side in your browser. While we implement security best practices in our code, we cannot be responsible for vulnerabilities in your local browser environment, device, or the open-source libraries we use." },
          { title: "Contact", body: "For questions about this disclaimer: contact@iusetools.site" },
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
