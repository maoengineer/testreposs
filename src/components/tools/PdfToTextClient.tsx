"use client";

import { useState } from "react";
import { RefreshCw, Copy, Check } from "lucide-react";
import DropZone from "@/components/tools/DropZone";
import PrivacyNote from "@/components/tools/PrivacyNote";
import ProcessingState from "@/components/tools/ProcessingState";
import { downloadText, validatePdfFile } from "@/lib/utils";

type ConversionState = "idle" | "processing" | "success" | "error";

export default function PdfToTextClient() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<ConversionState>("idle");
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFileSelect = (f: File) => {
    const err = validatePdfFile(f);
    if (err) { setErrorMessage(err); setState("error"); return; }
    setFile(f);
    setState("idle");
    setExtractedText("");
  };

  const handleConvert = async () => {
    if (!file) return;
    setState("processing");
    setProgress(0);
    setErrorMessage("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(10);

      // Dynamically import PDF.js
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      let fullText = "";

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: unknown) => (item as { str: string }).str)
          .join(" ");
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
        setProgress(10 + (i / numPages) * 80);
      }

      // If no text found, use OCR
      if (fullText.trim().replace(/--- Page \d+ ---/g, "").trim().length < 50) {
        setProgress(90);
        fullText = await ocrFallback(pdf, numPages, setProgress);
      }

      setExtractedText(fullText.trim());
      setProgress(100);
      downloadText(fullText, `${file.name.replace(".pdf", "")}.txt`);
      setState("success");
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to extract text from PDF. The file may be corrupted or password-protected.");
      setState("error");
    }
  };

  async function ocrFallback(pdf: unknown, numPages: number, setProgress: (n: number) => void): Promise<string> {
    const Tesseract = await import("tesseract.js");
    let text = "";
    const pdfDoc = pdf as { getPage: (n: number) => Promise<{ getViewport: (opts: object) => { width: number; height: number }; render: (ctx: object) => { promise: Promise<void> } }> };

    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (page.render as any)({ canvasContext: ctx, viewport }).promise;

      const result = await Tesseract.recognize(canvas, "eng");
      text += `--- Page ${i} ---\n${result.data.text}\n\n`;
      setProgress(90 + (i / numPages) * 8);
    }
    return text;
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => { setFile(null); setState("idle"); setExtractedText(""); };

  return (
    <div className="space-y-6">
      <PrivacyNote />
      <DropZone
        onFileSelect={handleFileSelect}
        accept={{ "application/pdf": [".pdf"] }}
        label="Drop your PDF here"
        sublabel="or click to browse"
        currentFile={file}
        onRemove={reset}
        disabled={state === "processing"}
      />
      {file && state === "idle" && (
        <button onClick={handleConvert} className="btn-primary w-full" id="convert-pdf-to-text">
          Extract Text from PDF
        </button>
      )}
      <ProcessingState state={state} progress={progress} message="Extracting text from PDF..." errorMessage={errorMessage} onRetry={reset} />
      {extractedText && state === "success" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Extracted Text Preview</p>
            <div className="flex gap-2">
              <button onClick={copyToClipboard} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <RefreshCw className="h-3.5 w-3.5" />
                New file
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-4 max-h-72 overflow-y-auto">
            <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">{extractedText}</pre>
          </div>
          <p className="text-xs text-muted-foreground">Your .txt file has been downloaded. Check your downloads folder.</p>
        </div>
      )}
    </div>
  );
}
