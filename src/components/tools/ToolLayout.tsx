import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { CheckCircle, Info, ChevronDown, ArrowRight } from "lucide-react";
import { tools } from "@/lib/tools";

interface FlexTool {
  name: string;
  description?: string;
  longDescription?: string;
  icon?: string;
  id?: string;
  slug?: string;
  color?: string;
  bgGradient?: string;
  category?: string;
  inputFormats: string[];
  outputFormat: string;
  howTo: string[];
  features: string[];
  faqs: { q: string; a: string }[];
}

interface ToolLayoutProps {
  tool: FlexTool;
  children: React.ReactNode;
}

export default function ToolLayout({ tool, children }: ToolLayoutProps) {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.name}`,
    step: tool.howTo.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  // Related tools — same category, excluding current
  const related = tool.category && tool.id
    ? tools.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 4)
    : [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── Compact tool header banner ── */}
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <Breadcrumb items={[{ label: "All Tools", href: "/tools" }, { label: tool.name }]} />
          <div className="flex items-center gap-2 flex-wrap">
            {tool.inputFormats.slice(0, 3).map((f) => (
              <span key={f} className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                {f}
              </span>
            ))}
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {tool.outputFormat}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main column (2/3 width) ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* 1. TOOL FORM — appears FIRST, right below header */}
            <div className="card">
              <div className="mb-5">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground mb-1">
                  {tool.name}
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">{tool.longDescription ?? tool.description ?? ""}</p>
              </div>
              {children}
            </div>

            {/* 2. HOW IT WORKS — below the form */}
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-4">How to Use {tool.name}</h2>
              <ol className="space-y-3">
                {tool.howTo.map((step, i) => (
                  <li key={i} className="flex gap-3 p-4 rounded-xl border border-border bg-card">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* 3. FAQ */}
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {tool.faqs.map((faq, i) => (
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
            </div>
          </div>

          {/* ── Sidebar (1/3 width) ── */}
          <div className="space-y-5">

            {/* Features */}
            <div className="card">
              <h2 className="font-display text-base font-bold text-foreground mb-4">Features</h2>
              <ul className="space-y-2">
                {tool.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Supported Formats */}
            <div className="card">
              <h2 className="font-display text-base font-bold text-foreground mb-4">Supported Formats</h2>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Input</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.inputFormats.map((f) => (
                      <span key={f} className="rounded-lg bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">{f}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Output</p>
                  <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">{tool.outputFormat}</span>
                </div>
              </div>
            </div>

            {/* Privacy badge */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20 p-4">
              <div className="flex items-start gap-2.5">
                <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-1">Privacy First</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                    All conversions happen in your browser. Nothing is uploaded to our servers. Your files remain completely private.
                  </p>
                </div>
              </div>
            </div>

            {/* Related tools — same category */}
            {related.length > 0 && (
              <div className="card">
                <h2 className="font-display text-base font-bold text-foreground mb-4">Related Tools</h2>
                <div className="space-y-1.5">
                  {related.map((t) => (
                    <Link
                      key={t.id}
                      href={`/${t.slug}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors group"
                    >
                      <span>{t.name}</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                  <Link href="/tools" className="flex items-center gap-1 mt-2 text-xs font-semibold text-primary hover:underline">
                    Browse all 9 tools <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
