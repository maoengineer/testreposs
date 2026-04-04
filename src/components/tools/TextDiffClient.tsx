"use client";
import { useState } from "react";
import PrivacyNote from "@/components/tools/PrivacyNote";

// Simple line-by-line diff
function computeDiff(a: string, b: string) {
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const result: { type: "same" | "removed" | "added"; text: string }[] = [];

  const aSet = new Set(aLines);
  const bSet = new Set(bLines);

  // Simple approach: show removed lines from A, added lines from B, same lines
  const allLines = [...new Set([...aLines, ...bLines])];
  
  // Use LCS-based simple diff
  aLines.forEach((line) => {
    if (bSet.has(line)) {
      result.push({ type: "same", text: line });
    } else {
      result.push({ type: "removed", text: line });
    }
  });
  bLines.forEach((line) => {
    if (!aSet.has(line)) {
      result.push({ type: "added", text: line });
    }
  });

  return result;
}

export default function TextDiffClient() {
  const [textA, setTextA] = useState("The quick brown fox\njumps over the lazy dog\nHello World");
  const [textB, setTextB] = useState("The quick brown fox\nleaps over the lazy cat\nHello iUseTools");
  const [diff, setDiff] = useState<ReturnType<typeof computeDiff> | null>(null);

  const compare = () => setDiff(computeDiff(textA, textB));

  const added = diff?.filter((d) => d.type === "added").length ?? 0;
  const removed = diff?.filter((d) => d.type === "removed").length ?? 0;
  const same = diff?.filter((d) => d.type === "same").length ?? 0;

  return (
    <div className="space-y-6">
      <PrivacyNote />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Original Text (A)</label>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            rows={8}
            id="diff-text-a"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Modified Text (B)</label>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            rows={8}
            id="diff-text-b"
          />
        </div>
      </div>

      <button onClick={compare} className="btn-primary w-full" id="diff-compare-btn">
        Compare Texts
      </button>

      {diff && (
        <div>
          {/* Stats */}
          <div className="flex gap-4 mb-4">
            <span className="text-xs font-semibold bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-full">+{added} added</span>
            <span className="text-xs font-semibold bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 px-3 py-1 rounded-full">-{removed} removed</span>
            <span className="text-xs font-semibold bg-muted text-muted-foreground px-3 py-1 rounded-full">{same} unchanged</span>
          </div>

          {/* Diff view */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-muted/50 px-4 py-2 border-b border-border text-xs font-semibold text-muted-foreground">
              Diff Result
            </div>
            <div className="p-4 space-y-0.5 font-mono text-sm max-h-96 overflow-y-auto">
              {diff.map((line, i) => (
                <div
                  key={i}
                  className={`px-3 py-1 rounded flex gap-3 ${
                    line.type === "added" ? "bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300" :
                    line.type === "removed" ? "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300" :
                    "text-foreground"
                  }`}
                >
                  <span className="select-none w-4 text-center opacity-60">
                    {line.type === "added" ? "+" : line.type === "removed" ? "−" : " "}
                  </span>
                  <span className="flex-1 break-all">{line.text || <span className="opacity-30">(empty line)</span>}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
