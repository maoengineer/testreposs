"use client";
import { useState, useRef, useEffect } from "react";
import PrivacyNote from "@/components/tools/PrivacyNote";

export default function QrGeneratorClient() {
  const [text, setText] = useState("https://iusetools.site");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [errorLevel, setErrorLevel] = useState<"L"|"M"|"Q"|"H">("M");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    if (!text.trim() || !canvasRef.current) return;
    const QRCode = (await import("qrcode")).default;
    await QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      color: { dark: fgColor, light: bgColor },
      errorCorrectionLevel: errorLevel,
      margin: 2,
    });
    setGenerated(true);
  };

  useEffect(() => { generate(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qr-code.png";
    a.click();
  };

  return (
    <div className="space-y-6">
      <PrivacyNote />

      <div>
        <label htmlFor="qr-input" className="text-sm font-semibold text-foreground mb-2 block">
          URL or Text
        </label>
        <textarea
          id="qr-input"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="https://example.com or any text..."
          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
            Size: <span className="text-primary">{size}px</span>
          </label>
          <input type="range" min={128} max={512} step={32} value={size}
            onChange={e => setSize(Number(e.target.value))} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">QR Color</label>
          <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)}
            className="w-full h-9 rounded-lg border border-border cursor-pointer" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Background</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
            className="w-full h-9 rounded-lg border border-border cursor-pointer" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Error Correction</label>
          <select value={errorLevel} onChange={e => setErrorLevel(e.target.value as "L"|"M"|"Q"|"H")}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="L">Low (L)</option>
            <option value="M">Medium (M)</option>
            <option value="Q">Quartile (Q)</option>
            <option value="H">High (H)</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={generate} disabled={!text.trim()} className="btn-primary flex-1" id="generate-qr">
          Generate QR Code
        </button>
        {generated && (
          <button onClick={download} className="btn-secondary flex-1" id="download-qr">
            ⬇ Download PNG
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <div className="rounded-2xl border-2 border-border p-4 bg-white inline-block">
          <canvas ref={canvasRef} className="block" />
        </div>
      </div>
    </div>
  );
}
