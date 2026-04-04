import { Metadata } from "next";
import ToolLayout from "@/components/tools/ToolLayout";
import ColorConverterClient from "@/components/tools/ColorConverterClient";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Color Converter — HEX to RGB, HSL, HSV Free | iUseTools",
  description: "Convert colors between HEX, RGB, RGBA, HSL, HSLA, and HSV formats instantly. Pick any color with the visual picker and copy any format. Free, browser-based.",
  alternates: { canonical: "https://iusetools.site/color-converter" },
};

export default function ColorConverterPage() {
  const tool = getToolBySlug("color-converter");
  if (!tool) return null;
  return <ToolLayout tool={tool}><ColorConverterClient /></ToolLayout>;
}
