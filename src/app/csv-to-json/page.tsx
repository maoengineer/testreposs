import { Metadata } from "next";
import ToolLayout from "@/components/tools/ToolLayout";
import CsvToJsonClient from "@/components/tools/CsvToJsonClient";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "CSV to JSON Converter — Free Online Tool | iUseTools",
  description: "Convert CSV data to JSON format instantly. Paste your CSV, click convert, and download the JSON file. Free, private, browser-based conversion.",
  alternates: { canonical: "https://iusetools.site/csv-to-json" },
};

export default function CsvToJsonPage() {
  const tool = getToolBySlug("csv-to-json");
  if (!tool) return null;
  return <ToolLayout tool={tool}><CsvToJsonClient /></ToolLayout>;
}
