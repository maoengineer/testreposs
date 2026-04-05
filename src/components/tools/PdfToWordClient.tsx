"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import DropZone from "@/components/tools/DropZone";
import PrivacyNote from "@/components/tools/PrivacyNote";
import ProcessingState from "@/components/tools/ProcessingState";
import { downloadBlob, validatePdfFile, sanitizeFilename } from "@/lib/utils";

type ConversionState = "idle" | "processing" | "success" | "error";

export default function PdfToWordClient() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<ConversionState>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileSelect = (f: File) => {
    const err = validatePdfFile(f);
    if (err) { setErrorMessage(err); setState("error"); return; }
    setFile(f);
    setState("idle");
  };

  const handleConvert = async () => {
    if (!file) return;
    setState("processing");
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(10);

      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
      const paragraphsAll: unknown[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const lines: string[] = [];
        let currentLine = "";
        let lastY = -1;

        for (const item of textContent.items as Array<{ str: string; transform: number[] }>) {
          const y = Math.round(item.transform[5]);
          if (lastY !== -1 && Math.abs(y - lastY) > 5 && currentLine.trim()) {
            lines.push(currentLine.trim());
            currentLine = "";
          }
          currentLine += item.str;
          lastY = y;
        }
        if (currentLine.trim()) lines.push(currentLine.trim());

        if (i > 1) {
          paragraphsAll.push(
            new Paragraph({ children: [new TextRun({ text: `— Page ${i} —`, color: "888888", size: 18 })], spacing: { before: 400, after: 200 } })
          );
        }

        for (const line of lines) {
          paragraphsAll.push(
            new Paragraph({
              children: [new TextRun({ text: line, size: 24 })],
              spacing: { after: 120 },
            })
          );
        }

        setProgress(10 + (i / numPages) * 80);
      }

      setProgress(92);
      const doc = new Document({ sections: [{ children: paragraphsAll as any[] }] });
      const blob = await Packer.toBlob(doc);
      setProgress(100);
      downloadBlob(blob, `${sanitizeFilename(file.name.replace(".pdf", ""))}.docx`);
      setState("success");
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to convert PDF. The file may be password-protected or corrupted.");
      setState("error");
    }
  };

  const reset = () => { setFile(null); setState("idle"); };

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
        <button onClick={handleConvert} className="btn-primary w-full" id="convert-pdf-to-word">
          Convert to Word
        </button>
      )}
      <ProcessingState state={state} progress={progress} message="Converting PDF to Word..." errorMessage={errorMessage} onRetry={reset} />
      {state === "success" && (
        <div className="flex justify-center">
          <button onClick={reset} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="h-4 w-4" /> Convert another PDF
          </button>
        </div>
      )}
    </div>
  );
}
