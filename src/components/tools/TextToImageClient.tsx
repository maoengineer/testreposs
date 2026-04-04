"use client";

import { useState, useRef, useEffect } from "react";
import { RefreshCw, Download } from "lucide-react";
import PrivacyNote from "@/components/tools/PrivacyNote";

const FONTS = ["Arial", "Georgia", "Verdana", "Times New Roman", "Courier New", "Impact", "Trebuchet MS"];
const ALIGNMENTS = ["left", "center", "right"] as const;
type Alignment = typeof ALIGNMENTS[number];

export default function TextToImageClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("Type your text here");
  const [font, setFont] = useState("Arial");
  const [fontSize, setFontSize] = useState(32);
  const [textColor, setTextColor] = useState("#111827");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [transparent, setTransparent] = useState(false);
  const [align, setAlign] = useState<Alignment>("center");
  const [padding, setPadding] = useState(40);
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(400);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    if (transparent) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px "${font}"`;
    ctx.textBaseline = "top";
    ctx.textAlign = align;

    const maxWidth = canvasWidth - padding * 2;
    const lineHeight = fontSize * 1.4;
    const lines = wrapText(ctx, text, maxWidth);
    const totalHeight = lines.length * lineHeight;
    let y = (canvasHeight - totalHeight) / 2;

    const x = align === "left" ? padding : align === "right" ? canvasWidth - padding : canvasWidth / 2;

    for (const line of lines) {
      ctx.fillText(line, x, y);
      y += lineHeight;
    }
  };

  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const paragraphs = text.split("\n");
    const lines: string[] = [];
    for (const para of paragraphs) {
      const words = para.split(" ");
      let line = "";
      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word;
        if (ctx.measureText(testLine).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = testLine;
        }
      }
      lines.push(line);
    }
    return lines;
  }

  useEffect(() => { redraw(); }, [text, font, fontSize, textColor, bgColor, transparent, align, padding, canvasWidth, canvasHeight]);

  const download = (format: "png" | "jpeg") => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `text-image.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    }, format === "jpeg" ? "image/jpeg" : "image/png", 0.95);
  };

  return (
    <div className="space-y-6">
      <PrivacyNote />

      {/* Text Input */}
      <div>
        <label htmlFor="image-text" className="text-sm font-semibold text-foreground mb-2 block">Your Text</label>
        <textarea
          id="image-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[80px]"
          placeholder="Type or paste text here..."
        />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Font Family</label>
          <select value={font} onChange={(e) => setFont(e.target.value)} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm">
            {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Font Size</label>
          <input type="number" value={fontSize} min={8} max={200} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Text Color</label>
          <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-9 rounded-lg border border-border cursor-pointer" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Background</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); setTransparent(false); }} disabled={transparent} className="flex-1 h-9 rounded-lg border border-border cursor-pointer disabled:opacity-40" />
            <label className="flex items-center gap-1 text-xs whitespace-nowrap">
              <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} className="rounded" />
              Transparent
            </label>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Alignment</label>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {ALIGNMENTS.map((a) => (
              <button key={a} onClick={() => setAlign(a)} className={`flex-1 py-2 text-xs font-medium capitalize transition-colors ${align === a ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}>
                {a}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Padding (px)</label>
          <input type="number" value={padding} min={0} max={200} onChange={(e) => setPadding(Number(e.target.value))} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Width (px)</label>
          <input type="number" value={canvasWidth} min={100} max={4000} onChange={(e) => setCanvasWidth(Number(e.target.value))} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Height (px)</label>
          <input type="number" value={canvasHeight} min={100} max={4000} onChange={(e) => setCanvasHeight(Number(e.target.value))} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
        </div>
      </div>

      {/* Preview */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">Live Preview</p>
        <div className="rounded-xl border border-border overflow-hidden bg-muted/20" style={{ maxHeight: 400, overflow: "auto" }}>
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: "100%",
              display: "block",
              backgroundImage: transparent ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='8' height='8' fill='%23ccc'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23ccc'/%3E%3C/svg%3E\")" : undefined,
            }}
          />
        </div>
      </div>

      {/* Download Buttons */}
      <div className="flex gap-3">
        <button onClick={() => download("png")} className="btn-primary flex-1" id="download-png">
          <Download className="h-4 w-4" /> Download PNG
        </button>
        <button onClick={() => download("jpeg")} className="btn-secondary flex-1" id="download-jpg">
          <Download className="h-4 w-4" /> Download JPG
        </button>
      </div>
    </div>
  );
}
