"use client";

import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { blogPosts } from "@/lib/blog/posts";
import { ArrowRight, Search, X } from "lucide-react";
import { useState, useMemo } from "react";

export default function BlogPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return blogPosts;
    return blogPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb items={[{ label: "Blog" }]} />

      <div className="mt-8 mb-8">
        <h1 className="font-display text-4xl font-extrabold text-foreground mb-3">
          Blog &amp; Guides
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Everything you need to know about converting files, using OCR, and keeping your documents private.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-10 max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${blogPosts.length} blog posts…`}
          className="w-full pl-11 pr-10 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
          id="blog-search-input"
          aria-label="Search blog posts"
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

      {/* Result count when searching */}
      {query && (
        <p className="text-sm text-muted-foreground mb-6">
          {filtered.length > 0 ? (
            <>
              Found <span className="font-semibold text-foreground">{filtered.length}</span> post
              {filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </>
          ) : (
            <>No posts found for &ldquo;{query}&rdquo;</>
          )}
        </p>
      )}

      {/* Posts grid — text cards only, no thumbnail */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card-hover group flex flex-col rounded-xl border border-border bg-card p-5"
              id={`blog-${post.slug}`}
            >
              <div className="mb-3 flex items-center gap-2 flex-wrap">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {post.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{post.readTime}</span>
              </div>
              <h2 className="font-display text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 flex-1">
                {post.description}
              </p>
              <div className="flex items-center gap-1 text-xs font-semibold text-primary mt-auto">
                Read more <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="font-semibold text-lg mb-1">No posts found</p>
          <p className="text-sm opacity-70">Try a different keyword</p>
          <button
            onClick={() => setQuery("")}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
