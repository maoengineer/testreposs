"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, Wrench, ArrowRight } from "lucide-react";
import { tools } from "@/lib/tools";
import { blogPosts } from "@/lib/blog/posts";

interface SearchResult {
  type: "tool" | "blog";
  title: string;
  description: string;
  href: string;
  category: string;
}

function buildIndex(): SearchResult[] {
  const toolResults: SearchResult[] = tools.map((t) => ({
    type: "tool",
    title: t.name,
    description: t.description,
    href: `/${t.slug}`,
    category: t.category,
  }));

  const blogResults: SearchResult[] = blogPosts.map((p) => ({
    type: "blog",
    title: p.title,
    description: p.description,
    href: `/blog/${p.slug}`,
    category: p.category,
  }));

  return [...toolResults, ...blogResults];
}

const ALL_RESULTS = buildIndex();

function searchIndex(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return ALL_RESULTS.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
  ).slice(0, 12);
}

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Reset on open/close
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Search as user types
  useEffect(() => {
    const res = searchIndex(query);
    setResults(res);
    setActiveIndex(0);
  }, [query]);

  const navigate = useCallback(
    (result: SearchResult) => {
      router.push(result.href);
      onClose();
    },
    [router, onClose]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[activeIndex]) {
        navigate(results[activeIndex]);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, results, activeIndex, navigate, onClose]);

  if (!open) return null;

  const toolResults = results.filter((r) => r.type === "tool");
  const blogResults = results.filter((r) => r.type === "blog");

  const categoryLabel: Record<string, string> = {
    image: "Image",
    pdf: "PDF",
    text: "Text",
    utility: "Utility",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[101] flex items-start justify-center pt-[10vh] px-4"
        role="dialog"
        aria-modal="true"
        aria-label="Search tools and blog posts"
      >
        <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools and blog posts…"
              className="flex-1 bg-transparent text-foreground text-base placeholder:text-muted-foreground outline-none"
              autoComplete="off"
              spellCheck={false}
              id="global-search-input"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-muted text-xs text-muted-foreground font-mono">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {!query && (
              <div className="px-4 py-10 text-center text-muted-foreground text-sm">
                <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Search anything</p>
                <p className="text-xs mt-1 opacity-70">
                  Find tools like &ldquo;PDF to Word&rdquo; or blog posts like &ldquo;OCR&rdquo;
                </p>
              </div>
            )}

            {query && results.length === 0 && (
              <div className="px-4 py-10 text-center text-muted-foreground text-sm">
                <p className="font-medium">No results for &ldquo;{query}&rdquo;</p>
                <p className="text-xs mt-1 opacity-70">Try a different keyword</p>
              </div>
            )}

            {/* Tools Group */}
            {toolResults.length > 0 && (
              <div className="px-2 pt-3 pb-1">
                <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Tools
                </p>
                {toolResults.map((result) => {
                  const globalIdx = results.indexOf(result);
                  return (
                    <button
                      key={result.href}
                      onClick={() => navigate(result)}
                      onMouseEnter={() => setActiveIndex(globalIdx)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                        activeIndex === globalIdx
                          ? "bg-primary/10 text-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Wrench className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground line-clamp-1">
                          {result.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {result.description}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                        {categoryLabel[result.category] ?? result.category}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Blog Group */}
            {blogResults.length > 0 && (
              <div className="px-2 pt-2 pb-3">
                {toolResults.length > 0 && (
                  <div className="mx-3 my-2 border-t border-border" />
                )}
                <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Blog Posts
                </p>
                {blogResults.map((result) => {
                  const globalIdx = results.indexOf(result);
                  return (
                    <button
                      key={result.href}
                      onClick={() => navigate(result)}
                      onMouseEnter={() => setActiveIndex(globalIdx)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                        activeIndex === globalIdx
                          ? "bg-primary/10 text-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                        <FileText className="h-4 w-4 text-violet-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground line-clamp-1">
                          {result.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {result.description}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {result.category}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer hint */}
          {results.length > 0 && (
            <div className="border-t border-border px-4 py-2.5 flex items-center gap-3 text-xs text-muted-foreground bg-muted/30">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-card font-mono">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-card font-mono">↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-card font-mono">↵</kbd>
                open
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-card font-mono">esc</kbd>
                close
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
