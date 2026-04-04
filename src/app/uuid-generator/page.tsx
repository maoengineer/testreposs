import { Metadata } from "next";
import ToolLayout from "@/components/tools/ToolLayout";
import UuidGeneratorClient from "@/components/tools/UuidGeneratorClient";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "UUID Generator — Generate Random UUIDs Free | iUseTools",
  description: "Generate one or multiple random UUIDs (v4) instantly. Choose lowercase or uppercase format. Copy individually or all at once. Free, private, browser-based.",
  alternates: { canonical: "https://iusetools.site/uuid-generator" },
};

export default function UuidGeneratorPage() {
  const tool = getToolBySlug("uuid-generator");
  if (!tool) return null;
  return <ToolLayout tool={tool}><UuidGeneratorClient /></ToolLayout>;
}
