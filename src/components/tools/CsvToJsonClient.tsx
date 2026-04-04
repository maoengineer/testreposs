"use client";
import { useState } from "react";
import PrivacyNote from "@/components/tools/PrivacyNote";

function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = values[i] ?? ""; });
    return obj;
  });
  return { headers, rows };
}

export default function CsvToJsonClient() {
  const [csvInput, setCsvInput] = useState("name,age,city\nAlice,30,New York\nBob,25,London\nCarol,35,Tokyo");
  const [jsonOutput, setJsonOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [compact, setCompact] = useState(false);

  const convert = () => {
    setError("");
    try {
      const { headers, rows } = parseCSV(csvInput);
      if (!headers.length) throw new Error("No headers found. Make sure the first row contains column headers.");
      const json = compact ? JSON.stringify(rows) : JSON.stringify(rows, null, 2);
      setJsonOutput(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to parse CSV.");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([jsonOutput], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.json";
    a.click();
  };

  return (
    <div className="space-y-6">
      <PrivacyNote />

      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">CSV Input</label>
        <textarea
          value={csvInput}
          onChange={(e) => setCsvInput(e.target.value)}
          placeholder="name,age,city&#10;Alice,30,New York"
          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          rows={6}
          id="csv-input"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
          <input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} className="accent-primary w-4 h-4" />
          Compact (minified) output
        </label>
        <button onClick={convert} disabled={!csvInput.trim()} className="btn-primary px-8" id="csv-convert-btn">
          Convert to JSON
        </button>
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl px-4 py-3">{error}</p>}

      {jsonOutput && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-foreground">JSON Output</label>
            <div className="flex gap-3">
              <button onClick={copy} className="text-xs font-semibold text-primary hover:underline" id="csv-copy-btn">
                {copied ? "✓ Copied!" : "Copy"}
              </button>
              <button onClick={download} className="text-xs font-semibold text-primary hover:underline" id="csv-download-btn">
                ⬇ Download JSON
              </button>
            </div>
          </div>
          <textarea
            readOnly value={jsonOutput}
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-mono text-foreground resize-none"
            rows={12}
          />
        </div>
      )}
    </div>
  );
}
