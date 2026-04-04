import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description: "Find answers to the most common questions about iUseTools's file conversion tools, privacy, supported formats, and more.",
  alternates: { canonical: "https://iusetools.site/faq" },
};

const faqs = [
  { q: "Is iUseTools completely free?", a: "Yes, all tools on iUseTools are completely free to use. There are no hidden fees, no premium tiers, and no subscription required. We support the site through non-intrusive advertising." },
  { q: "Do I need to create an account?", a: "No. iUseTools requires zero registration. No email, no password, no personal information. Just open any tool and start converting immediately." },
  { q: "Are my files safe? Do you store them?", a: "Your files are completely safe. All processing happens in your browser using WebAssembly technology. Your files are never uploaded to our servers and never leave your device. We have no file storage whatsoever." },
  { q: "What file types are supported?", a: "We accept PDF, JPG, JPEG, PNG, WebP, BMP, and TXT files as inputs, with output in DOCX, PDF, TXT, PNG, and JPG formats depending on the tool." },
  { q: "Is there a file size limit?", a: "We support PDF files up to 50MB and image files up to 20MB. Very large files may take longer to process depending on your device's processing power and available memory." },
  { q: "Why is OCR sometimes inaccurate?", a: "OCR accuracy depends on image quality, contrast, font type, and language. For best results, use high-resolution images (150+ DPI) with clear, dark text on a light background. Handwriting recognition is limited." },
  { q: "Can I use iUseTools on mobile?", a: "Yes. iUseTools is fully responsive and works on modern mobile browsers including Chrome for Android and Safari for iOS. Some heavy OCR operations may be slower on older mobile devices." },
  { q: "What powers the OCR technology?", a: "We use Tesseract.js, a JavaScript/WebAssembly port of Google's open-source Tesseract OCR engine. It supports over 100 languages and runs entirely in your browser." },
  { q: "Will my DOCX file work in Google Docs?", a: "Yes. The DOCX files we generate follow the standard Office Open XML format, which is compatible with Microsoft Word, Google Docs, LibreOffice, and most other word processors." },
  { q: "How do I download the converted file?", a: "After conversion is complete, your file downloads automatically to your browser's default downloads folder. Look for a success message on screen confirming the download." },
  { q: "What happens if a conversion fails?", a: "If a conversion fails, you'll see an error message with a description of the problem. You can retry with the same file or try a different file. Common issues include corrupted files, password-protected PDFs, or very large files." },
  { q: "Can iUseTools handle password-protected PDFs?", a: "No. Password-protected PDFs cannot be processed because the browser cannot read encrypted content without the password. Please remove password protection using Adobe Acrobat or another tool before converting." },
  { q: "Do you support languages other than English for OCR?", a: "Yes. The Image to Text (OCR) tool supports 13+ languages including French, German, Spanish, Italian, Portuguese, Dutch, Polish, Russian, Arabic, Chinese, Japanese, and Korean." },
  { q: "How accurate is PDF to Word conversion?", a: "For native (digital) PDFs, text content is extracted cleanly. Basic paragraph structure is preserved. Complex layouts with tables, columns, or images may need minor cleanup in Word after conversion." },
  { q: "Can I convert multiple files at once?", a: "The Image to PDF tool supports multiple images at once. Other tools currently process one file at a time for simplicity and reliability." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumb items={[{ label: "FAQ" }]} />
        <div className="mt-8 mb-10">
          <h1 className="font-display text-4xl font-extrabold text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">Everything you need to know about iUseTools. Can't find your answer? <a href="/contact" className="text-primary hover:underline">Contact us</a>.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group rounded-xl border border-border bg-card">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <span className="font-semibold text-foreground text-sm pr-4">{faq.q}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform shrink-0" />
              </summary>
              <div className="px-5 pb-5">
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 card bg-muted/30 text-center">
          <p className="text-sm text-muted-foreground mb-3">Still have questions?</p>
          <a href="/contact" className="btn-primary">Get in Touch</a>
        </div>
      </div>
    </>
  );
}
