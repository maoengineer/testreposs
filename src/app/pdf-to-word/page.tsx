import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/tools/ToolLayout";
import PdfToWordClient from "@/components/tools/PdfToWordClient";

export const metadata: Metadata = {
  title: "PDF to Word Converter — Free Online Tool",
  description: "Convert PDF files into editable Microsoft Word DOCX documents. Free, browser-based, no signup required.",
  alternates: { canonical: "https://iusetools.site/pdf-to-word" },
};

export default function PdfToWordPage() {
  const tool = getToolBySlug("pdf-to-word")!;
  return (
    <ToolLayout tool={tool}>
      <PdfToWordClient />
    </ToolLayout>
  );
}
