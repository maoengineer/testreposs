export function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .substring(0, 100);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadText(text: string, filename: string): void {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, filename);
}

export function validateImageFile(file: File): string | null {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/bmp"];
  if (!allowed.includes(file.type)) return "Please upload a JPG, PNG, WebP, or BMP image.";
  if (file.size > 20 * 1024 * 1024) return "Image must be smaller than 20MB.";
  return null;
}

export function validatePdfFile(file: File): string | null {
  if (file.type !== "application/pdf") return "Please upload a PDF file.";
  if (file.size > 50 * 1024 * 1024) return "PDF must be smaller than 50MB.";
  return null;
}

export function validateTextFile(file: File): string | null {
  const allowed = ["text/plain", "text/txt", ""];
  if (file.name.endsWith(".txt") || file.type === "text/plain") return null;
  return "Please upload a .txt file.";
}
