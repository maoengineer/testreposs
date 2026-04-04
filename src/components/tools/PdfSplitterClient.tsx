"use client";
import { useState, useRef } from "react";
import PrivacyNote from "@/components/tools/PrivacyNote";

export default function PdfSplitterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState("");
  const [mode, setMode] = useState<"all"|"range">("all");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (f: File) => {
    setFile(f); setDone(false);
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(await f.arrayBuffer());
    setPageCount(doc.getPageCount());
  };

  const split = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      let indices: number[] = [];
      if (mode === "all") {
        indices = src.getPageIndices();
      } else {
        // Parse range like "1,3,5-8"
        const parts = pages.split(",").map(s => s.trim());
        for (const p of parts) {
          if (p.includes("-")) {
            const [start, end] = p.split("-").map(Number);
            for (let i = start; i <= Math.min(end, pageCount); i++) indices.push(i - 1);
          } else {
            const n = Number(p);
            if (!isNaN(n) && n >= 1 && n <= pageCount) indices.push(n - 1);
          }
        }
      }

      for (const idx of indices) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(src, [idx]);
        newPdf.addPage(page);
        const bytes = await newPdf.save();
        zip.file(`page-${idx+1}.pdf`, bytes as Uint8Array<ArrayBuffer>);
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url;
      a.download = `${file.name.replace(".pdf","")}_split.zip`; a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <PrivacyNote />
      <div className="dropzone" onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if(f) loadFile(f); }}>
        <input ref={inputRef} type="file" accept="application/pdf" className="sr-only"
          onChange={e => { const f = e.target.files?.[0]; if(f) loadFile(f); }} />
        <div className="text-5xl mb-3">✂️</div>
        <p className="font-semibold text-foreground">Drop your PDF here</p>
        <p className="text-sm text-muted-foreground mt-1">We&apos;ll split it into individual pages</p>
      </div>

      {file && pageCount > 0 && (
        <>
          <div className="rounded-xl bg-muted/30 border border-border p-4 text-sm text-center text-muted-foreground">
            <span className="font-semibold text-foreground">{file.name}</span> — {pageCount} pages
          </div>

          <div className="flex rounded-lg border border-border overflow-hidden">
            {(["all","range"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-semibold capitalize transition-colors ${mode===m?"bg-primary text-primary-foreground":"bg-card text-muted-foreground hover:bg-muted"}`}>
                {m === "all" ? "All Pages" : "Custom Range"}
              </button>
            ))}
          </div>

          {mode === "range" && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                Pages to extract (e.g. 1,3,5-8)
              </label>
              <input type="text" value={pages} onChange={e => setPages(e.target.value)}
                placeholder={`1,3,5-8 (max: ${pageCount})`}
                className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          )}

          <button onClick={split} disabled={loading || (mode==="range" && !pages.trim())}
            className="btn-primary w-full" id="split-pdf">
            {loading ? "Splitting…" : mode==="all" ? `Split All ${pageCount} Pages` : "Extract Selected Pages"}
          </button>

          {done && (
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 p-4 text-center text-sm font-semibold">
              ✅ Pages split and downloaded as ZIP!
            </div>
          )}
        </>
      )}
    </div>
  );
}
