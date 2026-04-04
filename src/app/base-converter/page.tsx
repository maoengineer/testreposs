import { Metadata } from "next";
import ToolLayout from "@/components/tools/ToolLayout";
import BaseConverterClient from "@/components/tools/BaseConverterClient";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Number Base Converter — Binary, Octal, Hex Free | iUseTools",
  description: "Convert numbers between Binary (Base 2), Octal (Base 8), Decimal (Base 10), and Hexadecimal (Base 16) instantly. Free, browser-based number base conversion.",
  alternates: { canonical: "https://iusetools.site/base-converter" },
};

export default function BaseConverterPage() {
  const tool = getToolBySlug("base-converter");
  if (!tool) return null;
  return <ToolLayout tool={tool}><BaseConverterClient /></ToolLayout>;
}
