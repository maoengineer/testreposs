import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { FileImage, FileText, HelpCircle, BookOpen, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Get help using iUseTools's file conversion tools. Find guides, FAQs, troubleshooting tips, and contact support.",
  alternates: { canonical: "https://iusetools.site/help" },
};

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb items={[{ label: "Help Center" }]} />

      <div className="mt-8 mb-10">
        <h1 className="font-display text-4xl font-extrabold text-foreground mb-4">Help Center</h1>
        <p className="text-lg text-muted-foreground">Find answers, guides, and support for all iUseTools tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {[
          { icon: HelpCircle, title: "FAQ", desc: "Quick answers to the most common questions", href: "/faq", color: "violet" },
          { icon: BookOpen, title: "Blog & Guides", desc: "In-depth tutorials and conversion tips", href: "/blog", color: "blue" },
          { icon: Mail, title: "Contact Us", desc: "Can't find your answer? Reach out directly", href: "/contact", color: "emerald" },
        ].map((item) => (
          <Link key={item.title} href={item.href} className="card-hover flex items-start gap-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              item.color === "violet" ? "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400" :
              item.color === "blue" ? "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400" :
              "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
            }`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Tool Guides</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: "JPG to Word", href: "/jpg-to-word", desc: "Convert image text to editable Word documents using OCR" },
          { title: "PDF to Text", href: "/pdf-to-text", desc: "Extract all text from any PDF file" },
          { title: "PDF to Word", href: "/pdf-to-word", desc: "Convert PDF content into an editable DOCX file" },
          { title: "Text to PDF", href: "/text-to-pdf", desc: "Generate a formatted PDF from plain text" },
          { title: "Text to Word", href: "/text-to-word", desc: "Create a Word document from plain text" },
          { title: "Text to Image", href: "/text-to-image", desc: "Export custom text as a PNG or JPG image" },
          { title: "Image to PDF", href: "/image-to-pdf", desc: "Combine multiple images into a single PDF" },
          { title: "Image to Text (OCR)", href: "/image-to-text", desc: "Extract text from any image using OCR" },
          { title: "PDF to Images", href: "/pdf-to-images", desc: "Export each PDF page as a JPG or PNG image" },
        ].map((tool) => (
          <Link key={tool.title} href={tool.href} className="card-hover">
            <p className="font-semibold text-foreground mb-1 group-hover:text-primary">{tool.title}</p>
            <p className="text-sm text-muted-foreground">{tool.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 space-y-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Common Troubleshooting</h2>
        <div className="space-y-4">
          {[
            { title: "Conversion is slow", body: "OCR processing is CPU-intensive. Try closing other browser tabs to free memory. Larger files and images take longer — this is normal. Results may also vary by device speed." },
            { title: "Text extraction is inaccurate", body: "OCR accuracy depends on image quality. For best results, use high-contrast images with clear printed text, at least 150 DPI resolution. Handwriting has lower accuracy than printed text." },
            { title: "PDF conversion fails", body: "If a PDF fails to convert, check that: (1) it is not password-protected; (2) it is not corrupted; (3) it is under 50MB in size. Try reopening the PDF in a viewer to confirm it's readable." },
            { title: "Nothing downloads after conversion", body: "Check your browser's download settings and ensure downloads are not blocked. Some browsers ask for permission before downloading. Also check your downloads folder." },
            { title: "Tool is not working in my browser", body: "iUseTools requires a modern browser (Chrome 90+, Firefox 90+, Edge 90+, Safari 15+). WebAssembly must be enabled. Try updating your browser or using a different one." },
          ].map((item) => (
            <div key={item.title} className="card">
              <p className="font-semibold text-foreground mb-2">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
