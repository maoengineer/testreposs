"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Wrench, FileText, ArrowRight, X } from "lucide-react";
import { tools } from "@/lib/tools";
import { blogPosts } from "@/lib/blog/posts";
import Breadcrumb from "@/components/layout/Breadcrumb";

interface SearchResult {
  type: "tool" | "blog";
  title: string;
  description: string;
  href: string;
  category: string;
}

const ALL_ITEMS: SearchResult[] = [
  ...tools.map((t) => ({
    type: "tool" as const,
    title: t.name,
    description: t.description,
    href: `/${t.slug}`,
    category: t.category,
  })),
  ...blogPosts.map((p) => ({
    type: "blog" as const,
    title: p.title,
    description: p.description,
    href: `/blog/${p.slug}`,
    category: p.category,
  })),
];

function performSearch(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return ALL_ITEMS.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
  );
}

const categoryLabel: Record<string, string> = {
  image: "Image",
  pdf: "PDF",
  text: "Text",
  utility: "Utility",
};

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<SearchResult[]>(() => performSearch(initialQ));

  useEffect(() => {
    const res = performSearch(query);
    setResults(res);
    // Update URL without navigation
    const url = query ? `/search?q=${encodeURIComponent(query)}` : "/search";
    window.history.replaceState({}, "", url);
  }, [query]);

  const toolResults = results.filter((r) => r.type === "tool");
  const blogResults = results.filter((r) => r.type === "blog");

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb items={[{ label: "Search" }]} />

      <div className="mt-8 mb-10">
        <h1 className="font-display text-4xl font-extrabold text-foreground mb-2">Search</h1>
        <p className="text-muted-foreground">
          Find tools and blog posts across the entire iUseTools library.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools and blog posts…"
          className="w-full pl-12 pr-12 py-4 rounded-xl border border-border bg-card text-foreground text-base placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
          autoFocus
          id="search-page-input"
          aria-label="Search tools and posts"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Empty state */}
      {!query && (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium mb-1">Start typing to search</p>
          <p className="text-sm opacity-70">
            Searches across {tools.length} tools and {blogPosts.length} blog posts
          </p>
        </div>
      )}

      {/* No results */}
      {query && results.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium mb-1">No results for &ldquo;{query}&rdquo;</p>
          <p className="text-sm opacity-70">Try a different keyword, like &ldquo;PDF&rdquo; or &ldquo;OCR&rdquo;</p>
        </div>
      )}

      {/* Results summary */}
      {query && results.length > 0 && (
        <p className="text-sm text-muted-foreground mb-6">
          Found <span className="font-semibold text-foreground">{results.length}</span> result
          {results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
        </p>
      )}

      <div className="space-y-10">
        {/* Tools */}
        {toolResults.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Tools
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {toolResults.length} result{toolResults.length !== 1 ? "s" : ""}
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {toolResults.map((result) => (
                <Link
                  key={result.href}
                  href={result.href}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {result.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {result.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                      {categoryLabel[result.category] ?? result.category}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Blog Posts */}
        {blogResults.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-violet-500" />
              Blog Posts
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {blogResults.length} result{blogResults.length !== 1 ? "s" : ""}
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {blogResults.map((result) => (
                <Link
                  key={result.href}
                  href={result.href}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-violet-500/40 hover:bg-violet-500/5 transition-all group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors">
                    <FileText className="h-5 w-5 text-violet-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground text-sm line-clamp-1 group-hover:text-violet-500 transition-colors">
                      {result.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {result.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {result.category}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-5xl px-4 py-20 text-center text-muted-foreground">
        <Search className="h-10 w-10 mx-auto mb-3 opacity-30 animate-pulse" />
        <p>Loading search…</p>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
