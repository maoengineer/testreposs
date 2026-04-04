"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, GripVertical, Upload, RefreshCw } from "lucide-react";
import PrivacyNote from "@/components/tools/PrivacyNote";
import ProcessingState from "@/components/tools/ProcessingState";
import { formatBytes } from "@/lib/utils";

type ConversionState = "idle" | "processing" | "success" | "error";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

const PAGE_SIZES: Record<string, [number, number]> = {
  a4: [210, 297],
  letter: [215.9, 279.4],
};

export default function ImageToPdfClient() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4");
  const [state, setState] = useState<ConversionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((f) => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setImages((prev) => [...prev, ...newImages]);
    setState("idle");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] },
    maxSize: 20 * 1024 * 1024,
    multiple: true,
  });

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const moveImage = (from: number, to: number) => {
    setImages((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    setState("processing");
    setErrorMessage("");

    try {
      const { jsPDF } = await import("jspdf");
      const [w, h] = PAGE_SIZES[pageSize];
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: pageSize });
      let first = true;

      for (const imgFile of images) {
        const dataUrl = await readAsDataURL(imgFile.file);
        const imgType = imgFile.file.type === "image/png" ? "PNG" : "JPEG";

        if (!first) doc.addPage();
        first = false;

        // Fit image to page
        const img = await loadImage(dataUrl);
        const imgAspect = img.width / img.height;
        const pageAspect = w / h;

        let dw = w, dh = h;
        if (imgAspect > pageAspect) {
          dh = w / imgAspect;
        } else {
          dw = h * imgAspect;
        }

        const x = (w - dw) / 2;
        const y = (h - dh) / 2;

        doc.addImage(dataUrl, imgType, x, y, dw, dh);
      }

      doc.save("images.pdf");
      setState("success");
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to create PDF. Please try again.");
      setState("error");
    }
  };

  const reset = () => {
    images.forEach((i) => URL.revokeObjectURL(i.preview));
    setImages([]);
    setState("idle");
  };

  return (
    <div className="space-y-6">
      <PrivacyNote />

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "dropzone-active" : ""}`}
      >
        <input {...getInputProps()} id="image-upload" aria-label="Upload images" />
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl mb-4 ${isDragActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          <Upload className="h-6 w-6" />
        </div>
        <p className="text-base font-semibold text-foreground mb-1">
          {isDragActive ? "Drop images here!" : "Drop images here"}
        </p>
        <p className="text-sm text-muted-foreground">JPG, PNG, WebP supported · Max 20MB each · Multiple files OK</p>
      </div>

      {images.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{images.length} image{images.length !== 1 ? "s" : ""} — drag to reorder</p>
            <div className="flex items-center gap-3">
              <select value={pageSize} onChange={(e) => setPageSize(e.target.value as "a4" | "letter")} className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm">
                <option value="a4">A4</option>
                <option value="letter">US Letter</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={() => { if (dragIndex !== null && dragIndex !== index) moveImage(dragIndex, index); setDragIndex(null); }}
                className="relative group rounded-xl overflow-hidden border border-border bg-muted/30 cursor-grab active:cursor-grabbing aspect-[3/4]"
              >
                <img src={img.preview} alt={img.file.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <GripVertical className="h-5 w-5 text-white" />
                </div>
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {state !== "processing" && (
            <button onClick={handleConvert} className="btn-primary w-full" id="convert-image-to-pdf">
              Merge Into PDF
            </button>
          )}
        </>
      )}

      <ProcessingState state={state} message="Creating your PDF..." errorMessage={errorMessage} onRetry={reset} />
      {state === "success" && (
        <div className="flex justify-center">
          <button onClick={reset} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="h-4 w-4" /> Start over
          </button>
        </div>
      )}
    </div>
  );
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
