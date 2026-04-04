import { Metadata } from "next";
import ToolLayout from "@/components/tools/ToolLayout";
import UrlEncoderClient from "@/components/tools/UrlEncoderClient";
import { getToolBySlug } from "@/lib/tools";

export const metadata: Metadata = {
  title: "URL Encoder / Decoder — Encode & Decode URLs Free | iUseTools",
  description: "Encode or decode URLs and query strings instantly. Convert special characters to percent-encoded format or reverse. Free, private, browser-based.",
  alternates: { canonical: "https://iusetools.site/url-encoder" },
};

export default function UrlEncoderPage() {
  const tool = getToolBySlug("url-encoder");
  if (!tool) return null;
  return <ToolLayout tool={tool}><UrlEncoderClient /></ToolLayout>;
}
