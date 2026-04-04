import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/tools/ToolLayout";
import PdfToTextClient from "@/components/tools/PdfToTextClient";

export const metadata: Metadata = {
  title: "PDF to Text Converter — Free Online Tool",
  description: "Extract text from any PDF file instantly. Supports native PDFs and scanned documents with OCR. Free, private, browser-based.",
  alternates: { canonical: "https://iusetools.site/pdf-to-text" },
};

export default function PdfToTextPage() {
  const tool = getToolBySlug("pdf-to-text")!;
  return (
    <ToolLayout tool={tool}>
      <PdfToTextClient />
    </ToolLayout>
  );
}
