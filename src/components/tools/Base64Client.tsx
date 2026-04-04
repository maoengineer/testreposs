"use client";
import { useState } from "react";

type Mode = "encode"|"decode";

export default function Base64Client() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState<string|null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const output = (() => {
    if (!input.trim()) return "";
    try {
      setError("");
      if (mode === "encode") return btoa(unescape(encodeURIComponent(input)));
      else return decodeURIComponent(escape(atob(input.trim())));
    } catch {
      setError(mode === "decode" ? "Invalid Base64 string" : "Encoding failed");
      return "";
    }
  })();

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setInput(b64.split(",")[1]);
      setImageUrl(b64);
      setMode("decode");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex rounded-lg border border-border overflow-hidden">
        {(["encode","decode"] as Mode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setInput(""); setError(""); }}
            className={`flex-1 py-2 text-sm font-semibold capitalize transition-colors ${
              mode===m?"bg-primary text-primary-foreground":"bg-card text-muted-foreground hover:bg-muted"
            }`}>
            {m === "encode" ? "Text → Base64" : "Base64 → Text"}
          </button>
        ))}
      </div>

      <div>
        <label htmlFor="base64-input" className="text-sm font-semibold text-foreground mb-2 block">
          {mode === "encode" ? "Plain Text Input" : "Base64 Input"}
        </label>
        <textarea
          id="base64-input"
          value={input}
          onChange={e => { setInput(e.target.value); setError(""); }}
          placeholder={mode === "encode" ? "Enter text to encode..." : "Paste Base64 string to decode..."}
          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[120px]"
        />
      </div>

      {/* Image to Base64 shortcut */}
      {mode === "encode" && (
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">
            Or encode an image to Base64:
          </label>
          <input type="file" accept="image/*"
            onChange={e => { const f = e.target.files?.[0]; if(f) handleImage(f); }}
            className="text-sm text-muted-foreground file:btn-secondary file:mr-3 file:cursor-pointer" />
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 text-sm">
          ⚠️ {error}
        </div>
      )}

      {output && !error && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-foreground">
              {mode === "encode" ? "Base64 Output" : "Decoded Text"}
            </label>
            <button onClick={copy} className="text-xs font-semibold text-primary hover:text-primary/80" id="copy-base64">
              {copied ? "✅ Copied!" : "Copy"}
            </button>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-4 max-h-48 overflow-y-auto">
            <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-all">{output}</pre>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {mode === "encode" ? `${output.length} chars (${Math.ceil(output.length/4*3)} bytes)` : `${output.length} chars`}
          </p>
        </div>
      )}

      {/* Preview if decoded is an image */}
      {imageUrl && mode === "decode" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="Decoded" className="max-h-48 mx-auto rounded-xl border border-border" />
      )}

      <div className="flex gap-3">
        {output && !error && (
          <button onClick={() => { setInput(output); setMode(mode==="encode"?"decode":"encode"); }}
            className="btn-secondary flex-1 text-sm" id="swap-base64">
            ⇄ Swap (use as input)
          </button>
        )}
        <button onClick={() => { setInput(""); setError(""); setImageUrl(null); }}
          className="btn-secondary flex-1 text-sm" id="clear-base64">
          Clear
        </button>
      </div>
    </div>
  );
}
