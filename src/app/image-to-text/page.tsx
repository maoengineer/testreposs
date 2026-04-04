import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/tools/ToolLayout";
import ImageToTextClient from "@/components/tools/ImageToTextClient";

export const metadata: Metadata = {
  title: "Image to Text (OCR) — Extract Text from Any Image Free",
  description: "Extract text from images using advanced OCR. Supports Khmer, Chinese, Vietnamese, Arabic, English, French and 100+ languages. Works with photos, screenshots, scanned docs. Free, private, browser-based.",
  alternates: { canonical: "https://iusetools.site/image-to-text" },
};

export default function ImageToTextPage() {
  const tool = getToolBySlug("image-to-text")!;
  return (
    <ToolLayout tool={tool}>
      <ImageToTextClient />
    </ToolLayout>
  );
}
