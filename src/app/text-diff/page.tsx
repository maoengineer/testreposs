import { Metadata } from "next";
import ToolLayout from "@/components/tools/ToolLayout";
import TextDiffClient from "@/components/tools/TextDiffClient";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Text Diff Tool — Compare Two Texts Free | iUseTools",
  description: "Compare two pieces of text and highlight the differences. See added, removed, and unchanged lines instantly. Free, private, browser-based text comparison.",
  alternates: { canonical: "https://iusetools.site/text-diff" },
};

export default function TextDiffPage() {
  const tool = getToolBySlug("text-diff");
  if (!tool) return null;
  return <ToolLayout tool={tool}><TextDiffClient /></ToolLayout>;
}
