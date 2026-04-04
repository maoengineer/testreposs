import { Metadata } from "next";
import ToolLayout from "@/components/tools/ToolLayout";
import MarkdownPreviewClient from "@/components/tools/MarkdownPreviewClient";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Markdown Preview — Convert Markdown to HTML | iUseTools",
  description: "Write or paste Markdown and instantly preview the rendered output. Convert Markdown to HTML and copy the result. Split view, preview mode, and HTML output. Free, browser-based.",
  alternates: { canonical: "https://iusetools.site/markdown-preview" },
};

export default function MarkdownPreviewPage() {
  const tool = getToolBySlug("markdown-preview");
  if (!tool) return null;
  return <ToolLayout tool={tool}><MarkdownPreviewClient /></ToolLayout>;
}
