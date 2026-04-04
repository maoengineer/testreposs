"use client";
import { useState, useRef } from "react";
import PrivacyNote from "@/components/tools/PrivacyNote";

export default function PdfMergerClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: FileList) => {
    const pdfs = Array.from(newFiles).filter(f => f.type === "application/pdf");
    setFiles(prev => [...prev, ...pdfs]);
    setDone(false);
  };

  const remove = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));
  const moveUp = (i: number) => { if (i === 0) return; const a = [...files]; [a[i-1], a[i]] = [a[i], a[i-1]]; setFiles(a); };
  const moveDown = (i: number) => { if (i === files.length-1) return; const a = [...files]; [a[i], a[i+1]] = [a[i+1], a[i]]; setFiles(a); };

  const merge = async () => {
    if (files.length < 2) return;
    setLoading(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const pdfBytes = await merged.save();
      const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "merged.pdf"; a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } finally { setLoading(false); }
  };

  const fmt = (n: number) => n < 1024*1024 ? `${(n/1024).toFixed(0)} KB` : `${(n/1024/1024).toFixed(1)} MB`;

  return (
    <div className="space-y-6">
      <PrivacyNote />
      <div className="dropzone" onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
        <input ref={inputRef} type="file" accept="application/pdf" multiple className="sr-only"
          onChange={e => { if (e.target.files) addFiles(e.target.files); }} />
        <div className="text-5xl mb-3">📎</div>
        <p className="font-semibold text-foreground">Click or drag to add PDFs</p>
        <p className="text-sm text-muted-foreground mt-1">Add multiple PDFs — you can reorder them</p>
      </div>

      {files.length > 0 && (
        <>
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                <span className="text-muted-foreground text-sm font-bold w-6 text-center">{i+1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{fmt(f.size)}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => moveUp(i)} disabled={i===0}
                    className="rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted disabled:opacity-30">↑</button>
                  <button onClick={() => moveDown(i)} disabled={i===files.length-1}
                    className="rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted disabled:opacity-30">↓</button>
                  <button onClick={() => remove(i)}
                    className="rounded-lg px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">✕</button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => inputRef.current?.click()}
            className="btn-secondary w-full text-sm" id="add-more-pdfs">
            + Add More PDFs
          </button>

          <button onClick={merge} disabled={loading || files.length < 2} className="btn-primary w-full" id="merge-pdfs">
            {loading ? "Merging…" : `Merge ${files.length} PDFs into One`}
          </button>

          {done && (
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 p-4 text-center text-sm font-semibold">
              ✅ PDFs merged and downloaded successfully!
            </div>
          )}
        </>
      )}
    </div>
  );
}
