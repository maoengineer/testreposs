import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Zap, Shield, Users, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "About iUseTools — Free Browser-Based File Conversion",
  description: "Learn about iUseTools, our mission to provide free, private, and instant file conversion tools that work entirely in your browser without any file uploads.",
  alternates: { canonical: "https://iusetools.site/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb items={[{ label: "About Us" }]} />

      <div className="mt-8">
        <h1 className="font-display text-4xl font-extrabold text-foreground mb-6">
          About iUseTools
        </h1>

        <div className="prose-content space-y-6 text-base leading-relaxed">
          <p className="text-lg text-muted-foreground">
            iUseTools is a free online file conversion platform built with one guiding principle: <strong className="text-foreground">your files are your business, not ours.</strong>
          </p>

          <p className="text-muted-foreground">
            We built iUseTools because we were frustrated with existing file conversion tools. Most require you to upload your documents to remote servers, create accounts, agree to data retention policies, or pay for "premium" features that should be free. We believed there was a better way.
          </p>

          <p className="text-muted-foreground">
            Thanks to modern browser technology — specifically WebAssembly — it's now possible to run powerful software directly in your web browser, with no server required. That's exactly what iUseTools does. When you convert a file here, the processing happens entirely on your own device. Your file is never transmitted anywhere. It never touches our servers, because we don't have any for file processing.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { icon: Shield, title: "Privacy by Design", desc: "File processing happens in your browser. No uploads, no storage, no risk.", color: "emerald" },
            { icon: Zap, title: "Always Free", desc: "Every tool on iUseTools is free with no hidden tiers or paywalls.", color: "violet" },
            { icon: Users, title: "No Registration", desc: "No accounts, no email, no personal data. Open a tool and start working.", color: "blue" },
            { icon: Target, title: "Accurate & Reliable", desc: "We use industry-standard open-source libraries trusted by millions of developers.", color: "orange" },
          ].map((item) => (
            <div key={item.title} className="card">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${
                item.color === "emerald" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" :
                item.color === "violet" ? "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400" :
                item.color === "blue" ? "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400" :
                "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400"
              }`}>
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-6 text-muted-foreground">
          <h2 className="font-display text-2xl font-bold text-foreground">The Technology</h2>
          <p>
            iUseTools uses a combination of cutting-edge browser technologies to deliver real conversion capabilities without a server:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong className="text-foreground">Tesseract.js</strong> — A JavaScript/WebAssembly port of Google's Tesseract OCR engine, supporting 100+ languages</li>
            <li><strong className="text-foreground">PDF.js</strong> — Mozilla's open-source PDF rendering library, the same engine used in Firefox</li>
            <li><strong className="text-foreground">docx</strong> — A TypeScript library for generating standards-compliant Word documents</li>
            <li><strong className="text-foreground">jsPDF</strong> — A JavaScript library for generating PDFs directly in the browser</li>
            <li><strong className="text-foreground">JSZip</strong> — For creating ZIP archives of multi-page exports</li>
          </ul>

          <h2 className="font-display text-2xl font-bold text-foreground mt-8">Our Commitment</h2>
          <p>
            iUseTools will always be free for basic document conversion needs. We monetize through non-intrusive advertising placed clearly away from tool controls. We are committed to Google AdSense publisher policies and will never use deceptive ad placement.
          </p>
          <p>
            We are also committed to data minimization. We don't collect your files. We don't profile your conversion habits. We use basic web analytics (aggregate traffic data only) to understand how to improve the site.
          </p>
        </div>

        <div className="mt-12 card bg-primary/5 border-primary/20">
          <h2 className="font-display text-xl font-bold text-foreground mb-3">Get in Touch</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Have a suggestion, found a bug, or want to request a new conversion tool? We'd love to hear from you.
          </p>
          <a href="/contact" className="btn-primary inline-flex">Contact Us</a>
        </div>
      </div>
    </div>
  );
}
