"use client";
import { useState, useRef } from "react";
import PrivacyNote from "@/components/tools/PrivacyNote";

export default function ImageWatermarkClient() {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [text, setText] = useState("© My Name 2024");
  const [position, setPosition] = useState<"center"|"bottom-right"|"bottom-left"|"top-right"|"top-left">("bottom-right");
  const [opacity, setOpacity] = useState(60);
  const [fontSize, setFontSize] = useState(32);
  const [color, setColor] = useState("#ffffff");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const apply = async () => {
    if (!imgUrl || !text.trim()) return;
    setLoading(true);
    try {
      const img = new window.Image();
      img.src = imgUrl;
      await new Promise(r => { img.onload = r; });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      ctx.globalAlpha = opacity / 100;
      ctx.fillStyle = color;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textBaseline = "middle";
      const pad = 20;
      const textW = ctx.measureText(text).width;
      let x = canvas.width / 2 - textW / 2;
      let y = canvas.height / 2;
      if (position === "bottom-right") { x = canvas.width - textW - pad; y = canvas.height - fontSize - pad; }
      if (position === "bottom-left") { x = pad; y = canvas.height - fontSize - pad; }
      if (position === "top-right") { x = canvas.width - textW - pad; y = pad + fontSize; }
      if (position === "top-left") { x = pad; y = pad + fontSize; }
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.fillText(text, x, y);
      setResult(canvas.toDataURL("image/png"));
    } finally { setLoading(false); }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a"); a.href = result; a.download = "watermarked.png"; a.click();
  };

  return (
    <div className="space-y-6">
      <PrivacyNote />
      <div className="dropzone" onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if(f) setImgUrl(URL.createObjectURL(f)); }}>
        <input ref={inputRef} type="file" accept="image/*" className="sr-only"
          onChange={e => { const f = e.target.files?.[0]; if(f) { setImgUrl(URL.createObjectURL(f)); setResult(null); }}} />
        <div className="text-5xl mb-3">💧</div>
        <p className="font-semibold text-foreground">Drop your image here</p>
      </div>

      {imgUrl && (
        <>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Watermark Text</label>
            <input type="text" value={text} onChange={e => setText(e.target.value)}
              placeholder="© Your Name" className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Position</label>
              <select value={position} onChange={e => setPosition(e.target.value as typeof position)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
                <option value="center">Center</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                Opacity: <span className="text-primary">{opacity}%</span>
              </label>
              <input type="range" min={10} max={100} value={opacity}
                onChange={e => setOpacity(Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                Font Size: <span className="text-primary">{fontSize}px</span>
              </label>
              <input type="range" min={12} max={120} value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Color</label>
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                className="w-full h-9 rounded-lg border border-border cursor-pointer" />
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={apply} disabled={loading || !text.trim()} className="btn-primary flex-1" id="apply-watermark">
              {loading ? "Applying…" : "Apply Watermark"}
            </button>
            {result && <button onClick={download} className="btn-secondary flex-1" id="download-watermark">⬇ Download</button>}
          </div>

          {result && (
            <div className="rounded-xl border border-border overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result} alt="Watermarked" className="w-full object-contain max-h-80" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
