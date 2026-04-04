"use client";
import { useState, useRef, useCallback } from "react";
import PrivacyNote from "@/components/tools/PrivacyNote";

type ResizeMode = "pixels" | "percent";

export default function ImageResizerClient() {
  const [original, setOriginal] = useState<{ file: File; url: string; w: number; h: number } | null>(null);
  const [mode, setMode] = useState<ResizeMode>("pixels");
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [percent, setPercent] = useState(50);
  const [keepAspect, setKeepAspect] = useState(true);
  const [format, setFormat] = useState<"jpeg"|"png"|"webp">("jpeg");
  const [result, setResult] = useState<{ url: string; w: number; h: number; size: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.src = url;
    img.onload = () => {
      setOriginal({ file, url, w: img.naturalWidth, h: img.naturalHeight });
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      setResult(null);
    };
  }, []);

  const handleWidthChange = (v: number) => {
    setWidth(v);
    if (keepAspect && original) setHeight(Math.round(v * (original.h / original.w)));
  };
  const handleHeightChange = (v: number) => {
    setHeight(v);
    if (keepAspect && original) setWidth(Math.round(v * (original.w / original.h)));
  };

  const resize = async () => {
    if (!original) return;
    setLoading(true);
    try {
      const img = new window.Image();
      img.src = original.url;
      await new Promise(r => { img.onload = r; });
      let tw = mode === "pixels" ? width : Math.round(original.w * percent / 100);
      let th = mode === "pixels" ? height : Math.round(original.h * percent / 100);
      if (keepAspect && mode === "pixels") { /* already set */ }
      const canvas = document.createElement("canvas");
      canvas.width = tw; canvas.height = th;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, tw, th);
      const mime = format === "jpeg" ? "image/jpeg" : format === "png" ? "image/png" : "image/webp";
      const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), mime, 0.92));
      setResult({ url: URL.createObjectURL(blob), w: tw, h: th, size: blob.size });
    } finally { setLoading(false); }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a"); a.href = result.url;
    a.download = `resized.${format === "jpeg" ? "jpg" : format}`; a.click();
  };

  return (
    <div className="space-y-6">
      <PrivacyNote />
      <div className="dropzone" onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
        <input ref={inputRef} type="file" accept="image/*" className="sr-only"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <div className="text-5xl mb-3">📐</div>
        <p className="font-semibold text-foreground">Click or drag your image</p>
        <p className="text-sm text-muted-foreground mt-1">JPG, PNG, WebP, BMP</p>
      </div>

      {original && (
        <>
          <div className="text-sm text-muted-foreground text-center">
            Original: {original.w} × {original.h}px
          </div>

          {/* Mode tabs */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(["pixels","percent"] as ResizeMode[]).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-semibold capitalize transition-colors ${mode===m?"bg-primary text-primary-foreground":"bg-card text-muted-foreground hover:bg-muted"}`}>
                {m === "pixels" ? "By Pixels" : "By Percent"}
              </button>
            ))}
          </div>

          {mode === "pixels" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Width (px)</label>
                <input type="number" value={width} min={1} max={8000}
                  onChange={e => handleWidthChange(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Height (px)</label>
                <input type="number" value={height} min={1} max={8000}
                  onChange={e => handleHeightChange(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input type="checkbox" id="aspect" checked={keepAspect} onChange={e => setKeepAspect(e.target.checked)} className="accent-primary" />
                <label htmlFor="aspect" className="text-sm text-muted-foreground">Lock aspect ratio</label>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                Scale: <span className="text-primary font-bold">{percent}%</span>
                {" "}→ {Math.round(original.w * percent / 100)} × {Math.round(original.h * percent / 100)}px
              </label>
              <input type="range" min={5} max={200} value={percent}
                onChange={e => setPercent(Number(e.target.value))} className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5%</span><span>100%</span><span>200%</span>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Output Format</label>
            <select value={format} onChange={e => setFormat(e.target.value as "jpeg"|"png"|"webp")}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button onClick={resize} disabled={loading} className="btn-primary flex-1" id="resize-image">
              {loading ? "Resizing…" : "Resize Image"}
            </button>
            {result && (
              <button onClick={download} className="btn-secondary flex-1" id="download-resized">
                ⬇ Download ({result.w}×{result.h}px)
              </button>
            )}
          </div>

          {result && (
            <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.url} alt="Resized" className="max-h-64 mx-auto object-contain rounded" />
              <p className="text-xs text-muted-foreground mt-2">
                {result.w} × {result.h}px · {(result.size/1024).toFixed(1)} KB
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
