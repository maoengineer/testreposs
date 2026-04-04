import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/tools/ToolLayout";
import PdfToImagesClient from "@/components/tools/PdfToImagesClient";

export const metadata: Metadata = {
  title: "PDF to Images Converter — Convert PDF Pages to JPG or PNG",
  description: "Convert each PDF page into a JPG or PNG image. Download all pages as a ZIP or individually. Free, browser-based, no signup needed.",
  alternates: { canonical: "https://iusetools.site/pdf-to-images" },
};

export default function PdfToImagesPage() {
  const tool = getToolBySlug("pdf-to-images")!;
  return (
    <ToolLayout tool={tool}>
      <PdfToImagesClient />
    </ToolLayout>
  );
}
