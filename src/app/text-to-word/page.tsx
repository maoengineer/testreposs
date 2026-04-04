import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/tools/ToolLayout";
import TextToWordClient from "@/components/tools/TextToWordClient";

export const metadata: Metadata = {
  title: "Text to Word Converter — Free Online Tool",
  description: "Convert plain text into a formatted Microsoft Word DOCX document. Add a title, choose font, size, and spacing. Free, instant, browser-based.",
  alternates: { canonical: "https://iusetools.site/text-to-word" },
};

export default function TextToWordPage() {
  const tool = getToolBySlug("text-to-word")!;
  return (
    <ToolLayout tool={tool}>
      <TextToWordClient />
    </ToolLayout>
  );
}
