"use client";
import { useState } from "react";
import PrivacyNote from "@/components/tools/PrivacyNote";

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hexToHsv(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (max !== min) {
    switch (max) {
      case rr: h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6; break;
      case gg: h = ((bb - rr) / d + 2) / 6; break;
      case bb: h = ((rr - gg) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

export default function ColorConverterClient() {
  const [hex, setHex] = useState("#6d28d9");
  const [copied, setCopied] = useState<string | null>(null);

  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const hsv = hexToHsv(hex);

  const formats = [
    { label: "HEX", value: hex.toUpperCase() },
    { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
    { label: "RGBA", value: `rgba(${r}, ${g}, ${b}, 1)` },
    { label: "HSL", value: `hsl(${h}, ${s}%, ${l}%)` },
    { label: "HSLA", value: `hsla(${h}, ${s}%, ${l}%, 1)` },
    { label: "HSV", value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
    { label: "CSS Name", value: "—" },
    { label: "R", value: String(r) },
    { label: "G", value: String(g) },
    { label: "B", value: String(b) },
  ];

  const copy = (key: string, val: string) => {
    if (val === "—") return;
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <PrivacyNote />

      {/* Color picker */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Pick a Color</label>
          <input
            type="color" value={hex} onChange={(e) => setHex(e.target.value)}
            className="w-24 h-24 rounded-2xl border-4 border-border cursor-pointer shadow-lg"
            id="color-picker"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-semibold text-foreground mb-2 block">HEX Value</label>
          <input
            type="text" value={hex.toUpperCase()}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setHex(v.toLowerCase());
            }}
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase"
            id="color-hex-input"
            maxLength={7}
          />
          {/* Color preview bar */}
          <div className="mt-3 h-12 rounded-xl shadow-inner border border-border" style={{ backgroundColor: hex }} />
        </div>
      </div>

      {/* Format results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {formats.map(({ label, value }) => (
          <div
            key={label}
            className={`flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3 gap-3 ${value === "—" ? "opacity-50" : ""}`}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-0.5">{label}</p>
              <code className="text-sm font-mono text-foreground">{value}</code>
            </div>
            {value !== "—" && (
              <button onClick={() => copy(label, value)} className="text-xs font-semibold text-primary hover:underline shrink-0">
                {copied === label ? "✓" : "Copy"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
