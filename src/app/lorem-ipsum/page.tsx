import { Metadata } from "next";
import ToolLayout from "@/components/tools/ToolLayout";
import LoremIpsumClient from "@/components/tools/LoremIpsumClient";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator — Free Placeholder Text | iUseTools",
  description: "Generate Lorem Ipsum placeholder text by paragraphs, sentences, or words. Customize length and start text. Free, instant, browser-based.",
  alternates: { canonical: "https://iusetools.site/lorem-ipsum" },
};

export default function LoremIpsumPage() {
  const tool = getToolBySlug("lorem-ipsum");
  if (!tool) return null;
  return <ToolLayout tool={tool}><LoremIpsumClient /></ToolLayout>;
}
