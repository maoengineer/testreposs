import type { Metadata } from "next";
import ToolLayout from "@/components/tools/ToolLayout";
import ImageConverterClient from "@/components/tools/ImageConverterClient";
export const metadata: Metadata = { title: "Image Format Converter — JPG, PNG, WebP | iUseTools", description: "Convert images between JPG, PNG, and WebP formats instantly in your browser. No upload, completely free." };
const tool = { name: "Image Converter", description: "Convert images between JPG, PNG, and WebP formats", icon: "🔄", color: "teal", bgGradient: "from-teal-500 to-emerald-600", inputFormats: ["JPG","PNG","WebP","BMP"], outputFormat: "JPG / PNG / WebP", howTo: ["Upload your image","Select the output format","Adjust quality if needed","Download converted image"], features: ["Convert to JPG, PNG, or WebP","Quality control for lossy formats","Instant conversion in browser","No file size limits","All files stay on your device"], faqs: [{ q:"Which format is smallest?", a:"WebP is generally 25–35% smaller than JPEG at the same quality. JPEG is universally supported." }] };
export default function Page() { return <ToolLayout tool={tool}><ImageConverterClient /></ToolLayout>; }
