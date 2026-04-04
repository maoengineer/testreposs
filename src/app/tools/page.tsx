import type { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/lib/tools";
import { ArrowRight, FileImage, FileText, FileType, Type, Image, Layers, ScanText, FileOutput, Wrench } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "All Free File Conversion Tools | 21+ Tools",
  description: "Browse all 21+ free tools: JPG to Word, PDF to Text, PDF to Word, Image Resizer, Image Compressor, QR Generator, Password Generator, JSON Formatter, and more. No signup, no upload, instant results.",
  alternates: { canonical: "https://iusetools.site/tools" },
};

const iconMap: Record<string, React.ElementType> = {
  FileImage, FileText, FileType, Type, Image, Layers, ScanText, FileOutput, Wrench,
};

const colorMap: Record<string, string> = {
  violet: "from-violet-500 to-purple-600",
  blue: "from-blue-500 to-cyan-600",
  indigo: "from-indigo-500 to-blue-600",
  emerald: "from-emerald-500 to-teal-600",
  orange: "from-orange-500 to-amber-600",
  pink: "from-pink-500 to-rose-600",
  teal: "from-teal-500 to-green-600",
  cyan: "from-cyan-500 to-blue-600",
  purple: "from-purple-500 to-violet-600",
};

export default function ToolsPage() {
  const imageTools   = tools.filter((t) => t.category === "image");
  const pdfTools     = tools.filter((t) => t.category === "pdf");
  const textTools    = tools.filter((t) => t.category === "text");
  const utilityTools = tools.filter((t) => t.category === "utility");

  const renderToolCard = (tool: typeof tools[0]) => {
    const IconComponent = iconMap[tool.icon] || FileText;
    return (
      <Link key={tool.id} href={`/${tool.slug}`} className="card-hover group" id={`all-tools-${tool.id}`}>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${colorMap[tool.color] ?? "from-violet-500 to-purple-600"} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
          <div className="flex items-center gap-1">
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{tool.inputFormats[0]}</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{tool.outputFormat}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
      </Link>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb items={[{ label: "All Tools" }]} />

      <div className="mt-8 mb-12 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
          All 21+ Free Tools
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Pick any tool below and start converting immediately. No registration, no uploads to servers, no hidden limits. Everything runs privately in your browser.
        </p>
      </div>

      <div className="space-y-12">
        {/* Image Tools */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400"><FileImage className="h-4 w-4" /></span>
            Image Tools
            <span className="text-sm font-normal text-muted-foreground ml-1">({imageTools.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {imageTools.map(renderToolCard)}
          </div>
        </section>

        {/* PDF Tools */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"><FileText className="h-4 w-4" /></span>
            PDF Tools
            <span className="text-sm font-normal text-muted-foreground ml-1">({pdfTools.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pdfTools.map(renderToolCard)}
          </div>
        </section>

        {/* Text Tools */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"><Type className="h-4 w-4" /></span>
            Text Tools
            <span className="text-sm font-normal text-muted-foreground ml-1">({textTools.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {textTools.map(renderToolCard)}
          </div>
        </section>

        {/* Utility Tools */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400"><Wrench className="h-4 w-4" /></span>
            Utility Tools
            <span className="text-sm font-normal text-muted-foreground ml-1">({utilityTools.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {utilityTools.map(renderToolCard)}
          </div>
        </section>
      </div>
    </div>
  );
}
