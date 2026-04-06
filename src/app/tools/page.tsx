"use client";

import Link from "next/link";
import { tools } from "@/lib/tools";
import {
  ArrowRight, FileImage, FileText, FileType, Type, Image,
  Layers, ScanText, FileOutput, Wrench, Search, X,
} from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { useState, useMemo } from "react";

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

const CATEGORIES = [
  { value: "all", label: "All Tools" },
  { value: "image", label: "Image" },
  { value: "pdf", label: "PDF" },
  { value: "text", label: "Text" },
  { value: "utility", label: "Utility" },
] as const;

type Category = typeof CATEGORIES[number]["value"];

export default function ToolsPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return tools.filter((t) => {
      const matchesCategory = activeCategory === "all" || t.category === activeCategory;
      const matchesQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.inputFormats.some((f) => f.toLowerCase().includes(q)) ||
        t.outputFormat.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  // Group filtered results by category for sectioned display
  const groupedByCategory = useMemo(() => {
    const groups: Record<string, typeof tools> = {};
    filtered.forEach((t) => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    });
    return groups;
  }, [filtered]);

  const categoryOrder = ["image", "pdf", "text", "utility"];
  const categoryMeta: Record<string, { label: string; icon: React.ElementType; colorClass: string }> = {
    image: { label: "Image Tools", icon: FileImage, colorClass: "bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400" },
    pdf: { label: "PDF Tools", icon: FileText, colorClass: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400" },
    text: { label: "Text Tools", icon: Type, colorClass: "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" },
    utility: { label: "Utility Tools", icon: Wrench, colorClass: "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400" },
  };

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

      <div className="mt-8 mb-8 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
          All {tools.length}+ Free Tools
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Pick any tool below and start converting immediately. No registration, no uploads to servers, no hidden limits.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools by name, format, or category…"
          className="w-full pl-11 pr-10 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
          id="tools-search-input"
          aria-label="Search tools"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
        {CATEGORIES.map((cat) => {
          const count = cat.value === "all"
            ? tools.length
            : tools.filter((t) => t.category === cat.value).length;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.value
                  ? "bg-primary text-white shadow-md"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
              id={`filter-${cat.value}`}
            >
              {cat.label}
              <span className={`ml-1.5 text-xs ${activeCategory === cat.value ? "opacity-80" : "opacity-60"}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Result count when searching */}
      {query && (
        <p className="text-sm text-muted-foreground mb-6 text-center">
          {filtered.length > 0 ? (
            <>Found <span className="font-semibold text-foreground">{filtered.length}</span> tool{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;</>
          ) : (
            <>No tools found for &ldquo;{query}&rdquo;</>
          )}
        </p>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="font-semibold text-lg mb-1">No tools found</p>
          <p className="text-sm opacity-70">Try a different keyword or clear the filters</p>
          <div className="flex items-center justify-center gap-3 mt-4">
            {query && (
              <button onClick={() => setQuery("")} className="text-sm text-primary hover:underline">
                Clear search
              </button>
            )}
            {activeCategory !== "all" && (
              <button onClick={() => setActiveCategory("all")} className="text-sm text-primary hover:underline">
                Show all categories
              </button>
            )}
          </div>
        </div>
      ) : activeCategory !== "all" || query ? (
        /* Flat grid when filtering */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(renderToolCard)}
        </div>
      ) : (
        /* Sectioned layout for default "All" view */
        <div className="space-y-12">
          {categoryOrder.map((cat) => {
            const catTools = groupedByCategory[cat];
            if (!catTools?.length) return null;
            const meta = categoryMeta[cat];
            const IconComp = meta.icon;
            return (
              <section key={cat}>
                <h2 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${meta.colorClass}`}>
                    <IconComp className="h-4 w-4" />
                  </span>
                  {meta.label}
                  <span className="text-sm font-normal text-muted-foreground ml-1">({catTools.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {catTools.map(renderToolCard)}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
