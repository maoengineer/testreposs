import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/tools/ToolLayout";
import JpgToWordClient from "@/components/tools/JpgToWordClient";

export const metadata: Metadata = {
  title: "JPG to Word Converter — Free Online OCR Tool",
  description: "Convert JPG, JPEG, or PNG images into editable Word DOCX files using OCR. Free, instant, browser-based. Your files never leave your device.",
  alternates: { canonical: "https://iusetools.site/jpg-to-word" },
};

export default function JpgToWordPage() {
  const tool = getToolBySlug("jpg-to-word")!;
  return (
    <ToolLayout tool={tool}>
      <JpgToWordClient />
    </ToolLayout>
  );
}
