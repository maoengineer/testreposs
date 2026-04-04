import type { Metadata } from "next";
import ToolLayout from "@/components/tools/ToolLayout";
import ImageCompressorClient from "@/components/tools/ImageCompressorClient";

export const metadata: Metadata = {
  title: "Image Compressor — Reduce Image File Size | iUseTools",
  description: "Compress JPG, PNG, and WebP images in your browser. Adjust quality to reduce file size without losing too much detail. 100% free, no upload.",
};

const tool = {
  name: "Image Compressor",
  description: "Reduce image file size while preserving quality",
  icon: "🖼️",
  color: "violet",
  bgGradient: "from-violet-500 to-purple-600",
  inputFormats: ["JPG","PNG","WebP"],
  outputFormat: "JPG / PNG / WebP",
  howTo: ["Upload your image","Choose output format and quality","Click Compress","Download compressed image"],
  features: ["Quality slider for balance between size and clarity","Compare original vs compressed side by side","Supports JPG, PNG, WebP output","All processing in browser — files stay private","See exact file size reduction percentage"],
  faqs: [
    { q: "How much can I reduce the file size?", a: "Depending on quality setting and format, you can reduce file size by 30–90%. JPEG and WebP give the best compression ratios." },
    { q: "Will the image look different?", a: "At quality 70–80%, most people cannot see the difference. Lower settings may show visible compression artifacts." },
    { q: "Is PNG lossless?", a: "Yes, PNG output is always lossless. For size reduction with PNG, converting to WebP or JPEG is more effective." },
  ],
};

export default function ImageCompressorPage() {
  return <ToolLayout tool={tool}><ImageCompressorClient /></ToolLayout>;
}
