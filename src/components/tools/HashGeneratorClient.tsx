"use client";
import { useState } from "react";
import PrivacyNote from "@/components/tools/PrivacyNote";

export default function HashGeneratorClient() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateHashes = async () => {
    if (!input) return;
    setLoading(true);
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const results: Record<string, string> = {};
    for (const algo of ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const) {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      results[algo] = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    setHashes(results);
    setLoading(false);
  };

  const copy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <PrivacyNote />

      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Text to Hash</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter any text to generate its hash..."
          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          rows={4}
          id="hash-input"
        />
      </div>

      <button
        onClick={generateHashes}
        disabled={!input.trim() || loading}
        className="btn-primary w-full"
        id="hash-generate-btn"
      >
        {loading ? "Generating..." : "Generate Hashes"}
      </button>

      {Object.keys(hashes).length > 0 && (
        <div className="space-y-3">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">{algo}</span>
                <button
                  onClick={() => copy(algo, hash)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  {copied === algo ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <code className="text-xs font-mono text-foreground break-all select-all leading-relaxed">{hash}</code>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Hashing is done entirely in your browser using the Web Crypto API. No data is sent to any server.
      </p>
    </div>
  );
}
