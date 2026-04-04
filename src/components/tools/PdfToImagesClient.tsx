"use client";

import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import DropZone from "@/components/tools/DropZone";
import PrivacyNote from "@/components/tools/PrivacyNote";
import ProcessingState from "@/components/tools/ProcessingState";
import { validatePdfFile } from "@/lib/utils";

type ConversionState = "idle" | "processing" | "success" | "error";

interface PageImage {
  pageNum: number;
  dataUrl: string;
}

export default function PdfToImagesClient() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<ConversionState>("idle");
  const [progress, setProgress] = useState(0);
  const [pageImages, setPageImages] = useState<PageImage[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [outputFormat, setOutputFormat] = useState<"jpeg" | "png">("jpeg");
  const [scale, setScale] = useState(1.5);

  const handleFileSelect = (f: File) => {
    const err = validatePdfFile(f);
    if (err) { setErrorMessage(err); setState("error"); return; }
    setFile(f);
    setState("idle");
    setPageImages([]);
  };

  const handleConvert = async () => {
    if (!file) return;
    setState("processing");
    setProgress(0);
    setPageImages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const results: PageImage[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext("2d")!;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (page.render as any)({ canvasContext: ctx, viewport }).promise;
        const dataUrl = canvas.toDataURL(outputFormat === "jpeg" ? "image/jpeg" : "image/png", 0.92);
        results.push({ pageNum: i, dataUrl });
        setProgress((i / numPages) * 100);
      }

      setPageImages(results);
      setState("success");
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to convert PDF. The file may be corrupted or password-protected.");
      setState("error");
    }
  };

  const downloadPage = (img: PageImage) => {
    const a = document.createElement("a");
    a.href = img.dataUrl;
    a.download = `page-${img.pageNum}.${outputFormat}`;
    a.click();
  };

  const downloadAll = async () => {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    for (const img of pageImages) {
      const base64 = img.dataUrl.split(",")[1];
      zip.file(`page-${img.pageNum}.${outputFormat}`, base64, { base64: true });
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.replace(".pdf", "") || "pages"}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => { setFile(null); setState("idle"); setPageImages([]); };

  return (
    <div className="space-y-6">
      <PrivacyNote />

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Output Format</label>
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(["jpeg", "png"] as const).map((f) => (
              <button key={f} onClick={() => setOutputFormat(f)} className={`flex-1 py-2 text-sm font-semibold uppercase transition-colors ${outputFormat === f ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Quality / Scale</label>
          <select value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <option value={1}>Low (1×)</option>
            <option value={1.5}>Medium (1.5×)</option>
            <option value={2}>High (2×)</option>
          </select>
        </div>
      </div>

      <DropZone
        onFileSelect={handleFileSelect}
        accept={{ "application/pdf": [".pdf"] }}
        label="Drop your PDF here"
        currentFile={file}
        onRemove={reset}
        disabled={state === "processing"}
      />

      {file && state === "idle" && (
        <button onClick={handleConvert} className="btn-primary w-full" id="convert-pdf-to-images">
          Convert to Images
        </button>
      )}

      <ProcessingState state={state} progress={progress} message={`Converting pages to ${outputFormat.toUpperCase()}...`} errorMessage={errorMessage} onRetry={reset} />

      {pageImages.length > 0 && state === "success" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{pageImages.length} page{pageImages.length !== 1 ? "s" : ""} converted</p>
            <div className="flex gap-2">
              <button onClick={downloadAll} className="btn-primary text-xs px-4 py-2" id="download-all-zip">
                <Download className="h-3.5 w-3.5" /> Download All (ZIP)
              </button>
              <button onClick={reset} className="btn-secondary text-xs px-3 py-2">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {pageImages.map((img) => (
              <div key={img.pageNum} className="group relative rounded-xl overflow-hidden border border-border bg-muted/20 cursor-pointer" onClick={() => downloadPage(img)}>
                <img src={img.dataUrl} alt={`Page ${img.pageNum}`} className="w-full object-contain" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <Download className="h-6 w-6 text-white" />
                  <span className="text-white text-xs font-semibold">Download</span>
                </div>
                <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white font-medium">
                  Page {img.pageNum}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
