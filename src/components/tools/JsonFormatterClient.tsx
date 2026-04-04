"use client";
import { useState } from "react";

export default function JsonFormatterClient() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"format"|"minify">("format");

  const process = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setError("");
      if (mode === "format") {
        setOutput(JSON.stringify(parsed, null, indent));
      } else {
        setOutput(JSON.stringify(parsed));
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const loadSample = () => {
    setInput(JSON.stringify({
      name: "John Doe", age: 30,
      email: "john@example.com",
      hobbies: ["reading","coding","hiking"],
      address: { city: "New York", country: "USA", zip: "10001" },
      active: true, score: null
    }));
    setError(""); setOutput("");
  };

  // Count tree for stats
  let stats = { keys: 0, arrays: 0, objects: 0 };
  try {
    const count = (v: unknown) => {
      if (Array.isArray(v)) { stats.arrays++; v.forEach(count); }
      else if (v && typeof v === "object") { stats.objects++; Object.values(v).forEach(count); stats.keys += Object.keys(v as object).length; }
    };
    if (input.trim()) count(JSON.parse(input));
  } catch { /* */ }

  return (
    <div className="space-y-6">
      <div className="flex rounded-lg border border-border overflow-hidden">
        {(["format","minify"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 text-sm font-semibold capitalize transition-colors ${
              mode===m?"bg-primary text-primary-foreground":"bg-card text-muted-foreground hover:bg-muted"
            }`}>
            {m === "format" ? "Format / Prettify" : "Minify"}
          </button>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="json-input" className="text-sm font-semibold text-foreground">JSON Input</label>
          <button onClick={loadSample} className="text-xs text-primary hover:text-primary/80 font-semibold" id="load-sample-json">
            Load Sample
          </button>
        </div>
        <textarea
          id="json-input"
          value={input}
          onChange={e => { setInput(e.target.value); setError(""); setOutput(""); }}
          placeholder='{"key": "value", "array": [1, 2, 3]}'
          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[150px]"
        />
      </div>

      {mode === "format" && (
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
            Indent: <span className="text-primary">{indent} spaces</span>
          </label>
          <input type="range" min={1} max={8} value={indent}
            onChange={e => setIndent(Number(e.target.value))} className="w-full accent-primary" />
        </div>
      )}

      <button onClick={process} disabled={!input.trim()}
        className="btn-primary w-full" id="process-json">
        {mode === "format" ? "Format JSON" : "Minify JSON"}
      </button>

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">❌ Invalid JSON</p>
          <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-mono">{error}</p>
        </div>
      )}

      {output && !error && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Keys", value: stats.keys },
              { label: "Objects", value: stats.objects },
              { label: "Arrays", value: stats.arrays },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center">
                <div className="text-xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-foreground">Output</label>
              <button onClick={copy} className="text-xs font-semibold text-primary hover:text-primary/80" id="copy-json">
                {copied ? "✅ Copied!" : "Copy"}
              </button>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4 max-h-64 overflow-auto">
              <pre className="text-xs font-mono text-foreground whitespace-pre">{output}</pre>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {output.length.toLocaleString()} chars · {(new TextEncoder().encode(output).length / 1024).toFixed(1)} KB
            </p>
          </div>
        </>
      )}
    </div>
  );
}
