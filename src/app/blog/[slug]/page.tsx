import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { getBlogPostBySlug, blogPosts } from "@/lib/blog/posts";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://iusetools.site/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      images: post.featureImage
        ? [{ url: `https://iusetools.site${post.featureImage}`, width: 1200, height: 630, alt: post.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.featureImage ? [`https://iusetools.site${post.featureImage}`] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    image: post.featureImage ? `https://iusetools.site${post.featureImage}` : undefined,
    author: { "@type": "Organization", name: "iUseTools" },
    publisher: { "@type": "Organization", name: "iUseTools", url: "https://iusetools.site" },
  };

  // Convert markdown-like content to HTML
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith("## ")) {
        elements.push(<h2 key={i} className="font-display text-2xl font-bold text-foreground mt-8 mb-4">{line.slice(3)}</h2>);
      } else if (line.startsWith("### ")) {
        elements.push(<h3 key={i} className="font-display text-lg font-bold text-foreground mt-6 mb-3">{line.slice(4)}</h3>);
      } else if (line.startsWith("- ")) {
        const items: string[] = [];
        while (i < lines.length && lines[i].startsWith("- ")) {
          items.push(lines[i].slice(2));
          i++;
        }
        elements.push(
          <ul key={`ul-${i}`} className="list-disc list-inside space-y-1 my-4 text-muted-foreground">
            {items.map((item, j) => <li key={j} className="text-sm leading-relaxed">{item}</li>)}
          </ul>
        );
        continue;
      } else if (line.startsWith("| ")) {
        // Simple table parsing
        const rows: string[][] = [];
        while (i < lines.length && lines[i].startsWith("|")) {
          if (!lines[i].includes("---")) {
            rows.push(lines[i].split("|").filter(Boolean).map((c) => c.trim()));
          }
          i++;
        }
        elements.push(
          <div key={`table-${i}`} className="my-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              {rows.map((row, ri) => (
                <tr key={ri} className={ri === 0 ? "bg-muted font-semibold" : "border-t border-border"}>
                  {row.map((cell, ci) => (
                    ri === 0 ? <th key={ci} className="px-4 py-2 text-left text-foreground">{cell}</th>
                             : <td key={ci} className="px-4 py-2 text-muted-foreground">{cell}</td>
                  ))}
                </tr>
              ))}
            </table>
          </div>
        );
        continue;
      } else if (line.startsWith("---")) {
        elements.push(<hr key={i} className="my-6 border-border" />);
      } else if (line.trim().startsWith("![")) {
        // Parse Image markdown: ![alt text](url)
        const altMatch = line.match(/!\[(.*?)\]/);
        const urlMatch = line.match(/\((.*?)\)/);
        const altText = altMatch ? altMatch[1] : "Blog image";
        const url = urlMatch ? urlMatch[1] : "";
        if (url) {
          elements.push(
            <div key={i} className="my-8 rounded-xl border border-border shadow-md overflow-hidden bg-muted/20">
              <img src={url} alt={altText} className="w-full h-auto object-cover" />
            </div>
          );
        }
      } else if (line.trim()) {
        // Handle inline **bold** and links
        const formatted = line
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');
        elements.push(
          <p key={i} className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: formatted }} />
        );
      }
      i++;
    }
    return elements;
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

        <article className="mt-8">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{post.category}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{post.readTime}</span>
              <time className="text-xs text-muted-foreground" dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </time>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{post.description}</p>
          </header>

          <div className="prose-content">
            {renderContent(post.content)}
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`} className="card-hover flex items-center gap-3">
              <ArrowLeft className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Previous</p>
                <p className="text-sm font-semibold text-foreground line-clamp-1">{prevPost.title}</p>
              </div>
            </Link>
          ) : <div />}
          {nextPost && (
            <Link href={`/blog/${nextPost.slug}`} className="card-hover flex items-center justify-end gap-3 text-right">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Next</p>
                <p className="text-sm font-semibold text-foreground line-clamp-1">{nextPost.title}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </Link>
          )}
        </div>

        {/* Back to blog */}
        <div className="mt-8 text-center">
          <Link href="/blog" className="btn-secondary">
            ← Back to All Articles
          </Link>
        </div>
      </div>
    </>
  );
}
