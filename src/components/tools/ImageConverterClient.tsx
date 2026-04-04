"use client";
import { useState, useRef } from "react";
import PrivacyNote from "@/components/tools/PrivacyNote";

type Fmt = "jpeg" | "png" | "webp";

export default function ImageConverterClient() {
  const [original, setOriginal] = useState<{ url: string; name: string; size: number; type: string } | null>(null);
  const [targetFmt, setTargetFmt] = useState<Fmt>("webp");
  const [quality, setQuality] = useState(90);
  const [result, setResult] = useState<{ url: string; size: number; blob: Blob } | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setOriginal({ url: URL.createObjectURL(file), name: file.name, size: file.size, type: file.type });
    setResult(null);
  };

  const convert = async () => {
    if (!original) return;
    setLoading(true);
    try {
      const img = new window.Image();
      img.src = original.url;
      await new Promise(r => { img.onload = r; });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      const mime = `image/${targetFmt}`;
      const q = targetFmt === "png" ? 1 : quality / 100;
      const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), mime, q));
      setResult({ url: URL.createObjectURL(blob), size: blob.size, blob });
    } finally { setLoading(false); }
  };

  const download = () => {
    if (!result || !original) return;
    const a = document.createElement("a");
    a.href = result.url;
    const base = original.name.replace(/\.[^.]+$/, "");
    a.download = `${base}.${targetFmt === "jpeg" ? "jpg" : targetFmt}`;
    a.click();
  };

  const fmt = (n: number) => n < 1024*1024 ? `${(n/1024).toFixed(1)} KB` : `${(n/1024/1024).toFixed(2)} MB`;

  return (
    <div className="space-y-6">
      <PrivacyNote />
      <div className="dropzone" onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if(f) handleFile(f); }}>
        <input ref={inputRef} type="file" accept="image/*" className="sr-only"
          onChange={e => { const f = e.target.files?.[0]; if(f) handleFile(f); }} />
        <div className="text-5xl mb-3">🔄</div>
        <p className="font-semibold text-foreground">Drop your image here</p>
        <p className="text-sm text-muted-foreground mt-1">Supports JPG, PNG, WebP, BMP, GIF</p>
      </div>

      {original && (
        <>
          <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={original.url} alt="" className="h-16 w-16 object-cover rounded-lg flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground text-sm truncate">{original.name}</p>
              <p className="text-xs text-muted-foreground">{original.type} · {fmt(original.size)}</p>
            </div>
          </div>

          {/* Format selector */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">Convert to:</label>
            <div className="grid grid-cols-3 gap-3">
              {(["jpeg","png","webp"] as Fmt[]).map(f => (
                <button key={f} onClick={() => setTargetFmt(f)}
                  className={`rounded-xl border-2 p-3 text-sm font-bold uppercase transition-all ${
                    targetFmt === f
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  }`}>
                  {f === "jpeg" ? "JPG" : f.toUpperCase()}
                  <div className="text-xs font-normal mt-0.5 normal-case">
                    {f === "jpeg" ? "Smallest" : f === "png" ? "Lossless" : "Modern"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {targetFmt !== "png" && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                Quality: <span className="text-primary font-bold">{quality}%</span>
              </label>
              <input type="range" min={10} max={100} value={quality}
                onChange={e => setQuality(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={convert} disabled={loading} className="btn-primary flex-1" id="convert-image-format">
              {loading ? "Converting…" : `Convert to ${targetFmt === "jpeg" ? "JPG" : targetFmt.toUpperCase()}`}
            </button>
            {result && (
              <button onClick={download} className="btn-secondary flex-1" id="download-converted">
                ⬇ Download ({fmt(result.size)})
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
