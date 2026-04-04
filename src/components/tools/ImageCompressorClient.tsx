"use client";
import { useState, useRef, useCallback } from "react";
import PrivacyNote from "@/components/tools/PrivacyNote";

export default function ImageCompressorClient() {
  const [original, setOriginal] = useState<{ file: File; url: string; size: number } | null>(null);
  const [compressed, setCompressed] = useState<{ url: string; size: number; blob: Blob } | null>(null);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setOriginal({ file, url, size: file.size });
    setCompressed(null);
  }, []);

  const compress = async () => {
    if (!original) return;
    setLoading(true);
    try {
      const img = new window.Image();
      img.src = original.url;
      await new Promise(r => { img.onload = r; });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const mime = format === "jpeg" ? "image/jpeg" : format === "png" ? "image/png" : "image/webp";
      const q = format === "png" ? 1 : quality / 100;
      const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), mime, q));
      const url = URL.createObjectURL(blob);
      setCompressed({ url, size: blob.size, blob });
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!compressed) return;
    const a = document.createElement("a");
    a.href = compressed.url;
    a.download = `compressed.${format === "jpeg" ? "jpg" : format}`;
    a.click();
  };

  const fmt = (n: number) => n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 / 1024).toFixed(2)} MB`;
  const savings = original && compressed ? Math.round((1 - compressed.size / original.size) * 100) : 0;

  return (
    <div className="space-y-6">
      <PrivacyNote />

      {/* Upload */}
      <div
        className="dropzone"
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      >
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <div className="text-5xl mb-3">🖼️</div>
        <p className="font-semibold text-foreground">Click or drag an image here</p>
        <p className="text-sm text-muted-foreground mt-1">JPG, PNG, or WebP</p>
      </div>

      {original && (
        <>
          {/* Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Output Format</label>
              <select value={format} onChange={e => setFormat(e.target.value as "jpeg"|"png"|"webp")}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="jpeg">JPEG (best compression)</option>
                <option value="webp">WebP (modern, small)</option>
                <option value="png">PNG (lossless)</option>
              </select>
            </div>
            {format !== "png" && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                  Quality: <span className="text-primary font-bold">{quality}%</span>
                </label>
                <input type="range" min={10} max={100} value={quality}
                  onChange={e => setQuality(Number(e.target.value))}
                  className="w-full accent-primary" />
              </div>
            )}
          </div>

          {/* Preview comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Original — {fmt(original.size)}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={original.url} alt="Original" className="max-h-48 mx-auto object-contain rounded" />
            </div>
            {compressed && (
              <div className="rounded-xl border border-primary/40 bg-primary/5 p-3 text-center">
                <p className="text-xs font-semibold text-primary mb-2">
                  Compressed — {fmt(compressed.size)}
                  <span className="ml-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded px-1.5">
                    -{savings}%
                  </span>
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={compressed.url} alt="Compressed" className="max-h-48 mx-auto object-contain rounded" />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={compress} disabled={loading}
              className="btn-primary flex-1" id="compress-image">
              {loading ? "Compressing…" : "Compress Image"}
            </button>
            {compressed && (
              <button onClick={download} className="btn-secondary flex-1" id="download-compressed">
                ⬇ Download
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
