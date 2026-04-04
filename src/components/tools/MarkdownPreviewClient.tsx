"use client";
import { useState } from "react";
import PrivacyNote from "@/components/tools/PrivacyNote";

// Simple markdown to HTML converter (no external lib needed)
function mdToHtml(md: string): string {
  let html = md
    // Escape HTML
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    // Headings
    .replace(/^###### (.+)$/gm, "<h6>$1</h6>")
    .replace(/^##### (.+)$/gm, "<h5>$1</h5>")
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold, italic, code
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    // Links & images
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Blockquote
    .replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>")
    // Horizontal rule
    .replace(/^---$/gm, "<hr />")
    // Unordered lists
    .replace(/^\* (.+)$/gm, "<li>$1</li>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Paragraphs (double newline = paragraph break)
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br />");
  
  return `<p>${html}</p>`;
}

export default function MarkdownPreviewClient() {
  const [markdown, setMarkdown] = useState(`# Hello iUseTools!

This is a **bold** text and *italic* text.

## Features
- Convert \`markdown\` to HTML
- Live **preview** in real-time
- Copy the generated HTML

## Code Example
Here is some \`inline code\` in a sentence.

[Visit iUseTools](https://iusetools.site)

---

> Blockquotes look like this.`);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"split" | "preview" | "html">("split");

  const html = mdToHtml(markdown);

  const copy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PrivacyNote />

      {/* View toggle */}
      <div className="flex rounded-xl border border-border overflow-hidden">
        {(["split", "preview", "html"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 py-2 text-sm font-semibold transition-colors capitalize ${
              view === v ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted"
            }`}
            id={`md-view-${v}`}
          >
            {v === "split" ? "Split View" : v === "preview" ? "Preview" : "HTML Output"}
          </button>
        ))}
      </div>

      <div className={`grid gap-4 ${view === "split" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
        {/* Editor */}
        {(view === "split" || view === "html") && (
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Markdown Input</label>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={16}
              id="md-input"
            />
          </div>
        )}

        {/* Preview or HTML */}
        {(view === "split" || view === "preview") && (
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Preview</label>
            <div
              className="rounded-xl border border-border bg-card px-6 py-4 prose prose-sm dark:prose-invert max-w-none min-h-[200px] overflow-auto"
              style={{ minHeight: "250px" }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}

        {view === "html" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-foreground">HTML Output</label>
              <button onClick={copy} className="text-xs font-semibold text-primary hover:underline" id="md-copy-btn">
                {copied ? "✓ Copied!" : "Copy HTML"}
              </button>
            </div>
            <textarea
              readOnly value={html}
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-mono text-foreground resize-none"
              rows={16}
            />
          </div>
        )}
      </div>

      {view !== "html" && (
        <button onClick={copy} className="btn-secondary w-full" id="md-copy-html-btn">
          {copied ? "✓ HTML Copied!" : "Copy HTML Output"}
        </button>
      )}
    </div>
  );
}
