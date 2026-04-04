"use client";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

const ALL_TOOLS = [
  { slug: "jpg-to-word", name: "JPG to Word", category: "Image" },
  { slug: "pdf-to-text", name: "PDF to Text", category: "PDF" },
  { slug: "pdf-to-word", name: "PDF to Word", category: "PDF" },
  { slug: "text-to-pdf", name: "Text to PDF", category: "Text" },
  { slug: "text-to-word", name: "Text to Word", category: "Text" },
  { slug: "text-to-image", name: "Text to Image", category: "Text" },
  { slug: "image-to-pdf", name: "Image to PDF", category: "Image" },
  { slug: "image-to-text", name: "Image to Text", category: "Image" },
  { slug: "pdf-to-images", name: "PDF to Images", category: "PDF" },
  { slug: "image-compressor", name: "Image Compressor", category: "Image" },
  { slug: "image-resizer", name: "Image Resizer", category: "Image" },
  { slug: "image-converter", name: "Image Converter", category: "Image" },
  { slug: "image-watermark", name: "Image Watermark", category: "Image" },
  { slug: "pdf-merge", name: "PDF Merger", category: "PDF" },
  { slug: "pdf-split", name: "PDF Splitter", category: "PDF" },
  { slug: "word-counter", name: "Word Counter", category: "Utility" },
  { slug: "case-converter", name: "Case Converter", category: "Utility" },
  { slug: "qr-generator", name: "QR Generator", category: "Utility" },
  { slug: "password-generator", name: "Password Generator", category: "Utility" },
  { slug: "base64", name: "Base64 Encoder", category: "Utility" },
  { slug: "json-formatter", name: "JSON Formatter", category: "Utility" },
];

const STAT_CARDS = [
  { label: "Total Tools", value: ALL_TOOLS.length, icon: "🔧", color: "from-violet-600 to-purple-600", trend: "+10 new" },
  { label: "Page Views", value: "—", icon: "👁️", color: "from-blue-600 to-cyan-600", trend: "localStorage" },
  { label: "Messages", value: "—", icon: "💬", color: "from-emerald-600 to-teal-600", trend: "From contact" },
  { label: "Categories", value: 4, icon: "📁", color: "from-orange-600 to-amber-600", trend: "Image·PDF·Text·Utility" },
];

export default function AdminDashboard() {
  const [messagesCount, setMessagesCount] = useState(0);
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    const msgs = JSON.parse(localStorage.getItem("ciq_messages") || "[]");
    setMessagesCount(msgs.length);
    const v = parseInt(localStorage.getItem("ciq_visits") || "0");
    setVisits(v);
  }, []);

  const toolsByCategory = ALL_TOOLS.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome back, Admin 👋</h2>
          <p className="text-slate-400 text-sm mt-1">Here&apos;s your iUseTools site overview</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { ...STAT_CARDS[0], value: ALL_TOOLS.length },
            { ...STAT_CARDS[1], value: visits || 0 },
            { ...STAT_CARDS[2], value: messagesCount },
            { ...STAT_CARDS[3] },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 relative overflow-hidden group hover:border-slate-700 transition-colors">
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className="text-3xl font-bold text-white tabular-nums">{s.value}</div>
              <div className="text-sm text-slate-400 mt-1">{s.label}</div>
              <div className="text-xs text-slate-600 mt-0.5">{s.trend}</div>
            </div>
          ))}
        </div>

        {/* Tools by category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold text-white mb-4">Tools by Category</h3>
            <div className="space-y-3">
              {Object.entries(toolsByCategory).map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{cat}</span>
                    <span className="text-slate-400">{count} tools</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full transition-all duration-700"
                      style={{ width: `${(count / ALL_TOOLS.length) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "View Site", href: "/", icon: "🌐" },
                { label: "Contact Messages", href: "/admin/messages", icon: "💬" },
                { label: "Manage Tools", href: "/admin/tools", icon: "🔧" },
                { label: "Site Settings", href: "/admin/settings", icon: "⚙️" },
              ].map(a => (
                <a key={a.label} href={a.href}
                  className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 px-4 py-3 text-sm text-slate-300 hover:text-white transition-all">
                  <span>{a.icon}</span>{a.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* All tools list */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
          <h3 className="font-semibold text-white mb-4">All Tools ({ALL_TOOLS.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {ALL_TOOLS.map(t => (
              <a key={t.slug} href={`/${t.slug}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 rounded-xl hover:bg-slate-800 px-3 py-2.5 transition-colors group">
                <span className="text-xs bg-slate-700 text-slate-300 rounded-lg px-2 py-0.5 font-mono w-20 text-center flex-shrink-0">{t.category}</span>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{t.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
