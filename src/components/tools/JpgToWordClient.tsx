"use client";

import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import DropZone from "@/components/tools/DropZone";
import PrivacyNote from "@/components/tools/PrivacyNote";
import ProcessingState from "@/components/tools/ProcessingState";
import { downloadBlob, validateImageFile, sanitizeFilename } from "@/lib/utils";

type ConversionState = "idle" | "processing" | "success" | "error";

export default function JpgToWordClient() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<ConversionState>("idle");
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileSelect = (f: File) => {
    const err = validateImageFile(f);
    if (err) {
      setErrorMessage(err);
      setState("error");
      return;
    }
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
      // Dynamically import Tesseract to keep bundle small
      const Tesseract = await import("tesseract.js");
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            setProgress(m.progress * 70);
          }
        },
      });

      const text = result.data.text.trim();
      setExtractedText(text);
      setProgress(80);

      // Build DOCX using docx library
      const { Document, Packer, Paragraph, TextRun } = await import("docx");
      const paragraphs = text.split("\n").map(
        (line: string) =>
          new Paragraph({
            children: [new TextRun({ text: line, size: 24 })],
          })
      );

      const doc = new Document({
        sections: [{ children: paragraphs }],
      });

      setProgress(95);
      const blob = await Packer.toBlob(doc);
      setProgress(100);

      downloadBlob(blob, `${sanitizeFilename(file.name.replace(/\.[^.]+$/, ""))}.docx`);
      setState("success");
    } catch (err) {
      console.error(err);
      setErrorMessage("OCR processing failed. Please try a clearer image.");
      setState("error");
    }
  };

  const reset = () => {
    setFile(null);
    setState("idle");
    setProgress(0);
    setExtractedText("");
  };

  return (
    <div className="space-y-6">
      <PrivacyNote />

      <DropZone
        onFileSelect={handleFileSelect}
        accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
        maxSize={20 * 1024 * 1024}
        label="Drop your JPG or PNG image here"
        sublabel="or click to browse — JPG, JPEG, PNG accepted"
        currentFile={file}
        onRemove={reset}
        disabled={state === "processing"}
      />

      {file && state === "idle" && (
        <button
          onClick={handleConvert}
          className="btn-primary w-full"
          id="convert-jpg-to-word"
        >
          Extract Text & Convert to Word
        </button>
      )}

      <ProcessingState
        state={state}
        progress={progress}
        message="Running OCR on your image..."
        errorMessage={errorMessage}
        onRetry={reset}
      />

      {extractedText && state === "success" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Extracted Text Preview</p>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Convert another file
            </button>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-4 max-h-60 overflow-y-auto">
            <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
              {extractedText}
            </pre>
          </div>
          <p className="text-xs text-muted-foreground">
            Your DOCX file has been downloaded. Check your downloads folder.
          </p>
        </div>
      )}
    </div>
  );
}
