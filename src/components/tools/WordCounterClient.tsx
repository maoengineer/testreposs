"use client";
import { useState, useEffect, useRef } from "react";
import PrivacyNote from "@/components/tools/PrivacyNote";

export default function WordCounterClient() {
  const [text, setText] = useState("");

  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g,"").length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  const speakingTime = Math.max(1, Math.ceil(words / 130));

  const stats = [
    { label: "Words", value: words.toLocaleString(), icon: "📝" },
    { label: "Characters", value: chars.toLocaleString(), icon: "🔤" },
    { label: "Without Spaces", value: charsNoSpace.toLocaleString(), icon: "🔡" },
    { label: "Sentences", value: sentences.toLocaleString(), icon: "📄" },
    { label: "Paragraphs", value: paragraphs.toLocaleString(), icon: "📋" },
    { label: "Reading Time", value: `~${readingTime} min`, icon: "📖" },
    { label: "Speaking Time", value: `~${speakingTime} min`, icon: "🎙️" },
  ];

  // Word frequency
  const wordFreq = text.trim() === "" ? [] : Object.entries(
    text.toLowerCase().replace(/[^a-z\s]/g,"").split(/\s+/)
      .filter(w => w.length > 2)
      .reduce<Record<string,number>>((acc, w) => ({ ...acc, [w]: (acc[w]||0)+1 }), {})
  ).sort(([,a],[,b]) => b-a).slice(0, 8);

  return (
    <div className="space-y-6">
      <PrivacyNote />
      <div>
        <label htmlFor="word-count-input" className="text-sm font-semibold text-foreground mb-2 block">
          Your Text
        </label>
        <textarea
          id="word-count-input"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste or type your text here to count words, characters, sentences, and more..."
          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[180px]"
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Word frequency */}
      {wordFreq.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Top Words</h3>
          <div className="space-y-2">
            {wordFreq.map(([word, count]) => (
              <div key={word} className="flex items-center gap-3">
                <span className="text-sm text-foreground w-28 truncate font-medium">{word}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min(100, (count / wordFreq[0][1]) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => setText("")}
          className="btn-secondary flex-1 text-sm" id="clear-word-counter">
          Clear Text
        </button>
        <button onClick={() => navigator.clipboard.writeText(
          stats.map(s => `${s.label}: ${s.value}`).join("\n")
        )} className="btn-secondary flex-1 text-sm" id="copy-word-stats">
          Copy Stats
        </button>
      </div>
    </div>
  );
}
