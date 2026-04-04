import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/tools/ToolLayout";
import ImageToPdfClient from "@/components/tools/ImageToPdfClient";

export const metadata: Metadata = {
  title: "Image to PDF Converter — Merge Multiple Images into One PDF",
  description: "Combine JPG, PNG, and WebP images into a single PDF. Drag and drop to reorder pages. Free, instant, browser-based. No signup needed.",
  alternates: { canonical: "https://iusetools.site/image-to-pdf" },
};

export default function ImageToPdfPage() {
  const tool = getToolBySlug("image-to-pdf")!;
  return (
    <ToolLayout tool={tool}>
      <ImageToPdfClient />
    </ToolLayout>
  );
}
