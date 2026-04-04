import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { blogPosts } from "@/lib/blog/posts";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — File Conversion Guides & Tips",
  description: "In-depth guides, tutorials, and tips on PDF conversion, image OCR, document tools, and file privacy. Learn how to convert files efficiently and safely.",
  alternates: { canonical: "https://iusetools.site/blog" },
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb items={[{ label: "Blog" }]} />
      <div className="mt-8 mb-12">
        <h1 className="font-display text-4xl font-extrabold text-foreground mb-4">
          Blog & Guides
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Everything you need to know about converting files, using OCR, and keeping your documents private. Written for beginners and professionals alike.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card-hover group" id={`blog-${post.slug}`}>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{post.category}</span>
              <span className="text-xs text-muted-foreground">{post.readTime}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            <h2 className="font-display text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">{post.description}</p>
            <div className="flex items-center gap-1 text-xs font-semibold text-primary">
              Read Article <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
