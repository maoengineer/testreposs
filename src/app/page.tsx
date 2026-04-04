import Link from "next/link";
import type { Metadata } from "next";
import {
  Zap, FileImage, FileText, FileType, Type, Image, Layers, ScanText, FileOutput,
  Shield, Lock, Star, ArrowRight, CheckCircle, ChevronDown, Sparkles, Globe, Clock, Wrench
} from "lucide-react";
import { tools } from "@/lib/tools";
import { getRecentPosts } from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: "iUseTools \u2014 30+ Free Online Tools | PDF, Image, Text & Developer",
  description:
    "30+ free browser-based tools. Convert PDFs, images, and text. Generate QR codes, passwords, UUIDs. Format JSON, encode Base64, and more. No signup. 100% private.",
  alternates: { canonical: "https://iusetools.site" },
};

const iconMap: Record<string, React.ElementType> = {
  FileImage, FileText, FileType, Type, Image, Layers, ScanText, FileOutput, Wrench,
};

const colorMap: Record<string, { gradient: string; bg: string; text: string; border: string; glow: string }> = {
  violet: { gradient: "from-violet-500 to-purple-600", bg: "bg-violet-50 dark:bg-violet-950/30", text: "text-violet-600 dark:text-violet-400", border: "border-violet-200 dark:border-violet-800", glow: "shadow-violet-200/60 dark:shadow-violet-900/30" },
  blue:   { gradient: "from-blue-500 to-cyan-600",     bg: "bg-blue-50 dark:bg-blue-950/30",   text: "text-blue-600 dark:text-blue-400",   border: "border-blue-200 dark:border-blue-800",   glow: "shadow-blue-200/60 dark:shadow-blue-900/30" },
  indigo: { gradient: "from-indigo-500 to-blue-600",   bg: "bg-indigo-50 dark:bg-indigo-950/30", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-800", glow: "shadow-indigo-200/60 dark:shadow-indigo-900/30" },
  emerald:{ gradient: "from-emerald-500 to-teal-600",  bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800", glow: "shadow-emerald-200/60 dark:shadow-emerald-900/30" },
  orange: { gradient: "from-orange-500 to-amber-600",  bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800", glow: "shadow-orange-200/60 dark:shadow-orange-900/30" },
  pink:   { gradient: "from-pink-500 to-rose-600",     bg: "bg-pink-50 dark:bg-pink-950/30",   text: "text-pink-600 dark:text-pink-400",   border: "border-pink-200 dark:border-pink-800",   glow: "shadow-pink-200/60 dark:shadow-pink-900/30" },
  teal:   { gradient: "from-teal-500 to-green-600",    bg: "bg-teal-50 dark:bg-teal-950/30",   text: "text-teal-600 dark:text-teal-400",   border: "border-teal-200 dark:border-teal-800",   glow: "shadow-teal-200/60 dark:shadow-teal-900/30" },
  cyan:   { gradient: "from-cyan-500 to-blue-600",     bg: "bg-cyan-50 dark:bg-cyan-950/30",   text: "text-cyan-600 dark:text-cyan-400",   border: "border-cyan-200 dark:border-cyan-800",   glow: "shadow-cyan-200/60 dark:shadow-cyan-900/30" },
  purple: { gradient: "from-purple-500 to-violet-600", bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800", glow: "shadow-purple-200/60 dark:shadow-purple-900/30" },
};

const homeFaqs = [
  { q: "Is iUseTools really free?", a: "Yes, completely free. All 30+ tools are available without any payment, subscription, or account creation." },
  { q: "Are my files safe when I use iUseTools?", a: "Your files never leave your device. All processing is done entirely in your browser. We have no servers that receive your files." },
  { q: "Do I need to create an account?", a: "No. iUseTools requires no registration, no email, and no personal information." },
  { q: "What file types are supported?", a: "We support PDF, JPG, JPEG, PNG, WebP, BMP, TXT, CSV, JSON, and Markdown files as inputs, with outputs in DOCX, PDF, TXT, PNG, JPG, and JSON formats." },
  { q: "Is there a file size limit?", a: "PDF files up to 50MB and image files up to 20MB are supported." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};

const categoryMeta: Record<string, { label: string; icon: React.ElementType; color: string; desc: string }> = {
  image:   { label: "Image Tools",   icon: FileImage, color: "violet",  desc: "Convert, compress, resize, watermark, and transform image files" },
  pdf:     { label: "PDF Tools",     icon: FileText,  color: "blue",    desc: "Work with PDF files \u2014 convert, merge, split, and extract" },
  text:    { label: "Text Tools",    icon: Type,      color: "emerald", desc: "Turn text into beautifully formatted documents" },
  utility: { label: "Utility Tools", icon: Wrench,    color: "orange",  desc: "Developer and productivity tools \u2014 QR, Base64, JSON, UUID, and more" },
};

export default function HomePage() {
  const recentPosts = getRecentPosts(3);

  const imageTools   = tools.filter(t => t.category === "image");
  const pdfTools     = tools.filter(t => t.category === "pdf");
  const textTools    = tools.filter(t => t.category === "text");
  const utilityTools = tools.filter(t => t.category === "utility");

  const grouped = [
    { key: "image",   tools: imageTools },
    { key: "pdf",     tools: pdfTools },
    { key: "text",    tools: textTools },
    { key: "utility", tools: utilityTools },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-blue-600 to-indigo-700 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-violet-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm text-white/90 mb-8 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5 text-yellow-300" />
            100% Free &middot; No Signup &middot; 30+ Tools &middot; Browser-Based
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Convert Anything.
            <br />
            <span className="text-yellow-300">Instantly.</span> For Free.
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-white/80 mb-10 leading-relaxed">
            30+ powerful browser-based tools &mdash; PDF, images, text conversion, and developer utilities with zero uploads.
            Your files <strong className="text-white">stay on your device</strong>, always.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <a href="#all-tools" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-violet-700 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200" id="hero-cta-tools">
              <Sparkles className="h-5 w-5" />
              Explore All Tools
            </a>
            <Link href="/jpg-to-word" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all duration-200" id="hero-cta-jpgtoword">
              Try JPG to Word <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { value: "30+", label: "Free Tools" },
              { value: "100+", label: "Languages" },
              { value: "100%", label: "Private" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-white font-display">{stat.value}</p>
                <p className="text-xs text-white/65 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL TOOLS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="all-tools">
        <div className="text-center mb-14">
          <p className="section-label mb-3">All 30+ Free Tools</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need &mdash; Right Here
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            No account needed. No file size tricks. No hidden paywall. Pick a tool and start converting in seconds.
          </p>
        </div>

        <div className="space-y-16">
          {grouped.map(({ key, tools: catTools }) => {
            const meta = categoryMeta[key];
            const CatIcon = meta.icon;
            const c = colorMap[meta.color] || colorMap["violet"];
            return (
              <div key={key}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient} shadow-md`}>
                    <CatIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {meta.label} <span className="text-sm font-normal text-muted-foreground">({catTools.length})</span>
                    </h3>
                    <p className="text-xs text-muted-foreground">{meta.desc}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {catTools.map((tool) => {
                    const IconComponent = iconMap[tool.icon] || FileText;
                    const colors = colorMap[tool.color] || colorMap["violet"];
                    return (
                      <Link key={tool.id} href={`/${tool.slug}`} className={`group relative flex flex-col rounded-2xl border ${colors.border} bg-card p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`} id={`tool-card-${tool.id}`}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
                        <div className="flex items-start justify-between mb-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${colors.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          {tool.featured && (
                            <span className={`rounded-full ${colors.bg} ${colors.text} px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${colors.border}`}>Popular</span>
                          )}
                        </div>
                        <h3 className="font-display text-base font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{tool.description}</p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {tool.inputFormats.slice(0, 2).map((f) => (
                            <span key={f} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{f}</span>
                          ))}
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span className={`rounded-full ${colors.bg} ${colors.text} px-2 py-0.5 text-[10px] font-semibold border ${colors.border}`}>{tool.outputFormat}</span>
                        </div>
                        <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${colors.text} opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0`}>
                          Open Tool <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label mb-3">How It Works</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">Three Steps. That&apos;s It.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Open a Tool", desc: "Choose any of the 30+ free tools. No account or registration required.", icon: "Launch" },
              { step: "02", title: "Upload or Paste", desc: "Drop your file, paste from clipboard, or type text directly.", icon: "Upload" },
              { step: "03", title: "Convert & Download", desc: "Click convert and download instantly. Everything stays in your browser.", icon: "Download" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-card shadow-lg border border-border mb-5">
                  <span className="text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Step {item.step}</p>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY iUseTools */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Why iUseTools</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">Built Different. Built for You.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Lock,  title: "100% Private",    desc: "Your files stay in your browser. Zero server uploads, zero storage.", color: "emerald" },
            { icon: Zap,   title: "Instant Results", desc: "WASM-based processing runs locally, delivering results in seconds.", color: "yellow" },
            { icon: Globe, title: "100+ Languages",  desc: "OCR supports Khmer, Chinese, Vietnamese, Arabic, French, English and more.", color: "blue" },
            { icon: Star,  title: "Always Free",     desc: "Every tool is free with no hidden tiers, no file limits, no credit card.", color: "violet" },
          ].map((item) => (
            <div key={item.title} className="card text-center">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${
                item.color === "emerald" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" :
                item.color === "yellow"  ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400" :
                item.color === "blue"    ? "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400" :
                "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
              }`}>
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-base font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label mb-3">FAQ</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {homeFaqs.map((faq, i) => (
              <details key={i} className="group rounded-xl border border-border bg-card">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-semibold text-foreground text-sm">{faq.q}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform shrink-0 ml-4" />
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/faq" className="btn-secondary">View All FAQs</Link>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Blog &amp; Guides</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">Learn More About File Conversion</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card-hover group" id={`blog-card-${post.slug}`}>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{post.category}</span>
                <span className="text-xs text-muted-foreground">{post.readTime}</span>
              </div>
              <h3 className="font-display text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">{post.description}</p>
              <div className="flex items-center gap-1 text-xs font-semibold text-primary">Read More <ArrowRight className="h-3.5 w-3.5" /></div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/blog" className="btn-secondary">View All Articles</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-bg">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            No signup. No waiting. No file uploads. Just open a tool and start converting.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a href="#all-tools" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-violet-700 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200" id="cta-browse-tools">
              Browse All 30+ Tools <ArrowRight className="h-5 w-5" />
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {["No Registration", "No File Uploads", "100% Free", "Private & Secure", "Works on Mobile"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-white/80 text-sm">
                <CheckCircle className="h-4 w-4 text-green-300" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
