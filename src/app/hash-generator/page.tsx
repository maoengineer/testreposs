import { Metadata } from "next";
import ToolLayout from "@/components/tools/ToolLayout";
import HashGeneratorClient from "@/components/tools/HashGeneratorClient";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Hash Generator — SHA-1, SHA-256, SHA-512 Free | iUseTools",
  description: "Generate cryptographic hash values from any text. Supports SHA-1, SHA-256, SHA-384, and SHA-512 using the browser Web Crypto API. Free, private, instant.",
  alternates: { canonical: "https://iusetools.site/hash-generator" },
};

export default function HashGeneratorPage() {
  const tool = getToolBySlug("hash-generator");
  if (!tool) return null;
  return <ToolLayout tool={tool}><HashGeneratorClient /></ToolLayout>;
}
