"use client";
import { useState, useCallback } from "react";
import PrivacyNote from "@/components/tools/PrivacyNote";

export default function UuidGeneratorClient() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [version, setVersion] = useState<"v4" | "v4-upper">("v4");
  const [copied, setCopied] = useState<string | null>(null);

  const generate = useCallback(() => {
    const generated = Array.from({ length: count }, () => {
      const id = crypto.randomUUID();
      return version === "v4-upper" ? id.toUpperCase() : id;
    });
    setUuids(generated);
  }, [count, version]);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopied("all");
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <PrivacyNote />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            How Many: <span className="text-primary">{count}</span>
          </label>
          <input
            type="range" min={1} max={20} value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Format</label>
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value as "v4" | "v4-upper")}
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            id="uuid-format"
          >
            <option value="v4">Lowercase (v4)</option>
            <option value="v4-upper">UPPERCASE (V4)</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={generate} className="btn-primary flex-1" id="uuid-generate-btn">
          Generate {count} UUID{count > 1 ? "s" : ""}
        </button>
        {uuids.length > 1 && (
          <button onClick={copyAll} className="btn-secondary px-5" id="uuid-copy-all">
            {copied === "all" ? "✓ Copied All!" : "Copy All"}
          </button>
        )}
      </div>

      {uuids.length > 0 && (
        <div className="space-y-2">
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3 gap-3">
              <code className="text-sm font-mono text-foreground flex-1 break-all">{uuid}</code>
              <button
                onClick={() => copy(uuid, `uuid-${i}`)}
                className="text-xs font-semibold text-primary hover:underline shrink-0"
              >
                {copied === `uuid-${i}` ? "✓" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
