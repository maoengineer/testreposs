"use client";
import { useState } from "react";
import PrivacyNote from "@/components/tools/PrivacyNote";

const LOREM_WORDS = [
  "lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do","eiusmod","tempor",
  "incididunt","ut","labore","et","dolore","magna","aliqua","enim","ad","minim","veniam","quis","nostrud",
  "exercitation","ullamco","laboris","nisi","aliquip","ex","ea","commodo","consequat","duis","aute","irure",
  "reprehenderit","voluptate","velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint",
  "occaecat","cupidatat","non","proident","sunt","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum",
  "curabitur","pretium","tincidunt","lacus","nunc","purus","diam","gravida","placerat","elementum","tristique",
  "nullam","varius","turpis","egestas","varius","augue","magna","dui","viverra","porttitor","massa","condimentum",
];

function randomWord() { return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]; }

function generateSentence(len = 10) {
  const words = Array.from({ length: len + Math.floor(Math.random() * 6) - 3 }, randomWord);
  return words[0].charAt(0).toUpperCase() + words[0].slice(1) + " " + words.slice(1).join(" ") + ".";
}

function generateParagraph() {
  const sentCount = 4 + Math.floor(Math.random() * 4);
  return Array.from({ length: sentCount }, generateSentence).join(" ");
}

export default function LoremIpsumClient() {
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let result = "";
    if (type === "paragraphs") {
      const paragraphs = Array.from({ length: count }, (_, i) => {
        if (i === 0 && startWithLorem) return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
        return generateParagraph();
      });
      result = paragraphs.join("\n\n");
    } else if (type === "sentences") {
      const sentences = Array.from({ length: count }, (_, i) => {
        if (i === 0 && startWithLorem) return "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        return generateSentence();
      });
      result = sentences.join(" ");
    } else {
      const words = Array.from({ length: count }, (_, i) => {
        if (i === 0 && startWithLorem) return "lorem";
        return randomWord();
      });
      result = words.join(" ");
    }
    setOutput(result);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PrivacyNote />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Generate</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            id="lorem-type"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Count: <span className="text-primary">{count}</span>
          </label>
          <input
            type="range" min={1} max={type === "words" ? 200 : type === "sentences" ? 20 : 10}
            value={count} onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-primary mt-2"
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
            <input
              type="checkbox" checked={startWithLorem} onChange={(e) => setStartWithLorem(e.target.checked)}
              className="accent-primary w-4 h-4"
            />
            Start with "Lorem ipsum"
          </label>
        </div>
      </div>

      <button onClick={generate} className="btn-primary w-full" id="lorem-generate-btn">
        Generate Lorem Ipsum
      </button>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-foreground">Generated Text</label>
            <button onClick={copy} className="text-xs font-semibold text-primary hover:underline" id="lorem-copy-btn">
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <textarea
            readOnly value={output}
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground resize-none"
            rows={10}
          />
        </div>
      )}
    </div>
  );
}
