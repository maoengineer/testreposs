"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

const ALL_TOOLS = [
  { slug: "jpg-to-word", name: "JPG to Word", category: "Image", status: true },
  { slug: "pdf-to-text", name: "PDF to Text", category: "PDF", status: true },
  { slug: "pdf-to-word", name: "PDF to Word", category: "PDF", status: true },
  { slug: "text-to-pdf", name: "Text to PDF", category: "Text", status: true },
  { slug: "text-to-word", name: "Text to Word", category: "Text", status: true },
  { slug: "text-to-image", name: "Text to Image", category: "Text", status: true },
  { slug: "image-to-pdf", name: "Image to PDF", category: "Image", status: true },
  { slug: "image-to-text", name: "Image to Text (OCR)", category: "Image", status: true },
  { slug: "pdf-to-images", name: "PDF to Images", category: "PDF", status: true },
  { slug: "image-compressor", name: "Image Compressor", category: "Image", status: true },
  { slug: "image-resizer", name: "Image Resizer", category: "Image", status: true },
  { slug: "image-converter", name: "Image Converter", category: "Image", status: true },
  { slug: "image-watermark", name: "Image Watermark", category: "Image", status: true },
  { slug: "pdf-merge", name: "PDF Merger", category: "PDF", status: true },
  { slug: "pdf-split", name: "PDF Splitter", category: "PDF", status: true },
  { slug: "word-counter", name: "Word Counter", category: "Utility", status: true },
  { slug: "case-converter", name: "Case Converter", category: "Utility", status: true },
  { slug: "qr-generator", name: "QR Generator", category: "Utility", status: true },
  { slug: "password-generator", name: "Password Generator", category: "Utility", status: true },
  { slug: "base64", name: "Base64 Encoder", category: "Utility", status: true },
  { slug: "json-formatter", name: "JSON Formatter", category: "Utility", status: true },
];

const categoryColors: Record<string, string> = {
  Image: "text-violet-400 bg-violet-400/10",
  PDF: "text-blue-400 bg-blue-400/10",
  Text: "text-emerald-400 bg-emerald-400/10",
  Utility: "text-orange-400 bg-orange-400/10",
};

export default function AdminTools() {
  const [tools, setTools] = useState(ALL_TOOLS);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Load hidden tools on mount
    try {
      const hiddenStr = localStorage.getItem("ciq_hidden_tools");
      if (hiddenStr) {
        const hidden = JSON.parse(hiddenStr);
        setTools(prev => prev.map(t => ({ ...t, status: !hidden.includes(t.slug) })));
      }
    } catch (e) {}
  }, []);

  const toggle = (slug: string) => {
    setTools(prev => {
      const nextTools = prev.map(t => t.slug === slug ? { ...t, status: !t.status } : t);
      // Save hidden tools to localStorage
      const hidden = nextTools.filter(t => !t.status).map(t => t.slug);
      localStorage.setItem("ciq_hidden_tools", JSON.stringify(hidden));
      return nextTools;
    });
  };

  const categories = ["All", ...Array.from(new Set(ALL_TOOLS.map(t => t.category)))];
  const filtered = tools.filter(t =>
    (filter === "All" || t.category === filter) &&
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = tools.filter(t => t.status).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white">Manage Tools</h2>
            <p className="text-slate-400 text-sm mt-1">{activeCount} of {tools.length} tools active</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tools…"
            className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 w-full sm:w-48" />
          <div className="flex gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  filter === c ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Tools table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Tool</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">Category</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">URL</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(t => (
                <tr key={t.slug} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${categoryColors[t.category]}`}>
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a href={`/${t.slug}`} target="_blank" rel="noreferrer"
                      className="text-xs text-slate-500 hover:text-violet-400 transition-colors font-mono">
                      /{t.slug}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => toggle(t.slug)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        t.status ? "bg-violet-600" : "bg-slate-700"
                      }`}>
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        t.status ? "translate-x-6" : "translate-x-1"
                      }`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
