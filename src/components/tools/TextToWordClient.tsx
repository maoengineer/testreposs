"use client";

import { useState } from "react";
import { RefreshCw, Upload } from "lucide-react";
import type { Paragraph } from "docx";
import PrivacyNote from "@/components/tools/PrivacyNote";
import ProcessingState from "@/components/tools/ProcessingState";
import { downloadBlob } from "@/lib/utils";

type ConversionState = "idle" | "processing" | "success" | "error";

const FONTS = ["Arial", "Times New Roman", "Calibri", "Courier New", "Georgia"];
const FONT_SIZES = [10, 11, 12, 14, 16, 18];

export default function TextToWordClient() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [fontName, setFontName] = useState("Arial");
  const [fontSize, setFontSize] = useState(12);
  const [lineSpacing, setLineSpacing] = useState(240);
  const [state, setState] = useState<ConversionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setText(await f.text());
  };

  const handleConvert = async () => {
    if (!text.trim()) { setErrorMessage("Please enter some text."); setState("error"); return; }
    setState("processing");

    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
      const children: Paragraph[] = [];

      if (title.trim()) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: title.trim(), bold: true, size: (fontSize + 6) * 2, font: fontName })],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          })
        );
      }

      for (const line of text.split("\n")) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: line, size: fontSize * 2, font: fontName })],
            spacing: { after: 120, line: lineSpacing },
          })
        );
      }

      const doc = new Document({ sections: [{ children }] });
      const blob = await Packer.toBlob(doc);
      downloadBlob(blob, "document.docx");
      setState("success");
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to create Word document. Please try again.");
      setState("error");
    }
  };

  const reset = () => setState("idle");

  return (
    <div className="space-y-6">
      <PrivacyNote />

      <div className="space-y-2">
        <label htmlFor="doc-title" className="text-sm font-semibold text-foreground">Document Title (optional)</label>
        <input
          id="doc-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for your document..."
          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="word-text-input" className="text-sm font-semibold text-foreground">Your Text</label>
          <label className="flex items-center gap-1.5 text-xs text-primary cursor-pointer hover:opacity-80">
            <Upload className="h-3.5 w-3.5" /> Upload .txt file
            <input type="file" accept=".txt" className="sr-only" onChange={handleFileUpload} />
          </label>
        </div>
        <textarea
          id="word-text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[180px]"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Font</label>
          <select value={fontName} onChange={(e) => setFontName(e.target.value)} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Font Size</label>
          <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            {FONT_SIZES.map((s) => <option key={s} value={s}>{s}pt</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Line Spacing</label>
          <select value={lineSpacing} onChange={(e) => setLineSpacing(Number(e.target.value))} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value={240}>Single</option>
            <option value={360}>1.5×</option>
            <option value={480}>Double</option>
          </select>
        </div>
      </div>

      {state !== "processing" && (
        <button onClick={handleConvert} disabled={!text.trim()} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed" id="convert-text-to-word">
          Convert to Word Document
        </button>
      )}

      <ProcessingState state={state} message="Creating your Word document..." errorMessage={errorMessage} onRetry={reset} />
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
