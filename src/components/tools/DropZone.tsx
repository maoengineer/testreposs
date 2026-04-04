"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileIcon, AlertCircle } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  label?: string;
  sublabel?: string;
  currentFile?: File | null;
  onRemove?: () => void;
  disabled?: boolean;
}

export default function DropZone({
  onFileSelect,
  accept = { "application/pdf": [".pdf"] },
  maxSize = 50 * 1024 * 1024,
  label = "Drop your file here",
  sublabel = "or click to browse",
  currentFile,
  onRemove,
  disabled = false,
}: DropZoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: unknown[]) => {
      setError(null);
      if (rejectedFiles && (rejectedFiles as File[]).length > 0) {
        const rej = rejectedFiles as Array<{ errors: Array<{ code: string; message: string }> }>;
        const errorCode = rej[0]?.errors?.[0]?.code;
        if (errorCode === "file-too-large") {
          setError(`File is too large. Maximum size is ${formatBytes(maxSize)}.`);
        } else if (errorCode === "file-invalid-type") {
          setError("File type not supported. Please check accepted formats.");
        } else {
          setError("File rejected. Please try again.");
        }
        return;
      }
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    disabled,
    multiple: false,
  });

  if (currentFile) {
    return (
      <div className="rounded-2xl border-2 border-primary/40 bg-primary/5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{currentFile.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(currentFile.size)}</p>
            </div>
          </div>
          {onRemove && (
            <button
              onClick={onRemove}
              className="ml-4 shrink-0 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "dropzone-active" : ""} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <input {...getInputProps()} id="file-upload" aria-label={label} />
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl mb-4 transition-all ${
          isDragActive ? "bg-primary text-primary-foreground scale-110" : "bg-muted text-muted-foreground"
        }`}>
          <Upload className="h-6 w-6" />
        </div>
        <p className="text-base font-semibold text-foreground mb-1">
          {isDragActive ? "Drop it here!" : label}
        </p>
        <p className="text-sm text-muted-foreground mb-3">
          {isDragActive ? "Release to upload" : sublabel}
        </p>
        <p className="text-xs text-muted-foreground">
          Max file size: {formatBytes(maxSize)}
        </p>
        {Object.values(accept).flat().length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            Supported: {Object.values(accept).flat().join(", ")}
          </p>
        )}
      </div>
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-950/30">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
