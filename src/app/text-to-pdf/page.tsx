import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/tools/ToolLayout";
import TextToPdfClient from "@/components/tools/TextToPdfClient";

export const metadata: Metadata = {
  title: "Text to PDF Converter — Free Online Tool",
  description: "Convert plain text or .txt files into formatted PDF documents. Customize page size, font, margins, and line spacing. Free and browser-based.",
  alternates: { canonical: "https://iusetools.site/text-to-pdf" },
};

export default function TextToPdfPage() {
  const tool = getToolBySlug("text-to-pdf")!;
  return (
    <ToolLayout tool={tool}>
      <TextToPdfClient />
    </ToolLayout>
  );
}
