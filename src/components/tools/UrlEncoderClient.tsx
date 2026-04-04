"use client";
import { useState } from "react";
import PrivacyNote from "@/components/tools/PrivacyNote";

export default function UrlEncoderClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const process = () => {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setError("Invalid input for decoding. Make sure your URL-encoded string is valid.");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swap = () => {
    setInput(output);
    setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <div className="space-y-6">
      <PrivacyNote />

      {/* Mode toggle */}
      <div className="flex rounded-xl border border-border overflow-hidden">
        {(["encode", "decode"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors capitalize ${
              mode === m ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground hover:bg-muted"
            }`}
            id={`url-mode-${m}`}
          >
            {m === "encode" ? "URL Encode" : "URL Decode"}
          </button>
        ))}
      </div>

      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">
          {mode === "encode" ? "Text to Encode" : "Encoded URL to Decode"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "Hello World! / path?q=test&foo=bar" : "Hello%20World%21%20%2F%20path%3Fq%3Dtest%26foo%3Dbar"}
          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          rows={5}
          id="url-input"
        />
      </div>

      <div className="flex gap-3">
        <button onClick={process} disabled={!input.trim()} className="btn-primary flex-1" id="url-convert-btn">
          {mode === "encode" ? "Encode URL" : "Decode URL"}
        </button>
        {output && (
          <button onClick={swap} className="btn-secondary px-4" title="Swap input/output">⇄ Swap</button>
        )}
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl px-4 py-3">{error}</p>}

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-foreground">Result</label>
            <button onClick={copy} className="text-xs font-semibold text-primary hover:underline" id="url-copy-btn">
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <div className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-mono text-foreground break-all select-all">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
