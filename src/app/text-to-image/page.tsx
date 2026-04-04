import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/tools/ToolLayout";
import TextToImageClient from "@/components/tools/TextToImageClient";

export const metadata: Metadata = {
  title: "Text to Image Converter — Free Online Tool",
  description: "Convert text into a downloadable PNG or JPG image. Customize font, size, color, background, and canvas. Live preview. Free browser-based tool.",
  alternates: { canonical: "https://iusetools.site/text-to-image" },
};

export default function TextToImagePage() {
  const tool = getToolBySlug("text-to-image")!;
  return (
    <ToolLayout tool={tool}>
      <TextToImageClient />
    </ToolLayout>
  );
}
