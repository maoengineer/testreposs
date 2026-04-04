import { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { blogPosts } from "@/lib/blog/posts";

const baseUrl = "https://iusetools.site";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolUrls = tools.map((tool) => ({
    url: `${baseUrl}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/tools`, priority: 0.95, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/about`, priority: 0.6, changeFrequency: "yearly" as const },
    { url: `${baseUrl}/faq`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/contact`, priority: 0.5, changeFrequency: "yearly" as const },
    { url: `${baseUrl}/help`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/privacy-policy`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${baseUrl}/terms-of-service`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${baseUrl}/cookie-policy`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${baseUrl}/disclaimer`, priority: 0.3, changeFrequency: "yearly" as const },
  ].map((page) => ({
    ...page,
    lastModified: new Date(),
  }));

  return [...staticPages, ...toolUrls, ...blogUrls];
}
