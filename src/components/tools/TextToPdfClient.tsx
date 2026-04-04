"use client";

import { useState } from "react";
import { RefreshCw, Upload } from "lucide-react";
import PrivacyNote from "@/components/tools/PrivacyNote";
import ProcessingState from "@/components/tools/ProcessingState";

type ConversionState = "idle" | "processing" | "success" | "error";

const PAGE_SIZES = [
  { label: "A4", value: "a4" },
  { label: "US Letter", value: "letter" },
  { label: "A3", value: "a3" },
  { label: "Legal", value: "legal" },
];

const FONT_SIZES = [10, 11, 12, 14, 16, 18];

export default function TextToPdfClient() {
  const [text, setText] = useState("");
  const [pageSize, setPageSize] = useState("a4");
  const [fontSize, setFontSize] = useState(12);
  const [margin, setMargin] = useState(20);
  const [lineSpacing, setLineSpacing] = useState(7);
  const [state, setState] = useState<ConversionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const txt = await f.text();
    setText(txt);
  };

  const handleConvert = async () => {
    if (!text.trim()) { setErrorMessage("Please enter some text first."); setState("error"); return; }
    setState("processing");
    setErrorMessage("");

    try {
      const { jsPDF } = await import("jspdf");
      const format = pageSize === "letter" ? "letter" : pageSize === "a3" ? "a3" : pageSize === "legal" ? "legal" : "a4";
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const usableWidth = pageWidth - margin * 2;

      doc.setFontSize(fontSize);
      doc.setFont("helvetica", "normal");

      let y = margin;
      const lines = doc.splitTextToSize(text, usableWidth) as string[];

      for (const line of lines) {
        if (y + lineSpacing > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineSpacing;
      }

      doc.save("document.pdf");
      setState("success");
    } catch (err) {
      console.error(err);
      setErrorMessage("PDF generation failed. Please try again.");
      setState("error");
    }
  };

  const reset = () => { setState("idle"); };

  return (
    <div className="space-y-6">
      <PrivacyNote />

      {/* Text Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="text-input" className="text-sm font-semibold text-foreground">Your Text</label>
          <label className="flex items-center gap-1.5 text-xs text-primary cursor-pointer hover:opacity-80">
            <Upload className="h-3.5 w-3.5" />
            Upload .txt file
            <input type="file" accept=".txt,text/plain" className="sr-only" onChange={handleFileUpload} />
          </label>
        </div>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here. Click 'Upload .txt file' to load a text file."
          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[200px]"
          disabled={state === "processing"}
        />
        <p className="text-xs text-muted-foreground">{text.length.toLocaleString()} characters</p>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Page Size</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {PAGE_SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Font Size</label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {FONT_SIZES.map((s) => <option key={s} value={s}>{s}pt</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Margin (mm)</label>
          <select
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value={10}>Narrow (10mm)</option>
            <option value={20}>Normal (20mm)</option>
            <option value={30}>Wide (30mm)</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Line Spacing</label>
          <select
            value={lineSpacing}
            onChange={(e) => setLineSpacing(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value={6}>1× Spacing</option>
            <option value={7}>1.5× Spacing</option>
            <option value={9}>2× Spacing</option>
          </select>
        </div>
      </div>

      {state !== "processing" && (
        <button
          onClick={handleConvert}
          disabled={!text.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          id="convert-text-to-pdf"
        >
          Convert to PDF
        </button>
      )}

      <ProcessingState state={state} message="Generating your PDF..." errorMessage={errorMessage} onRetry={reset} />

      {state === "success" && (
        <div className="flex justify-center">
          <button onClick={reset} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="h-4 w-4" /> Convert more text
          </button>
        </div>
      )}
    </div>
  );
}
