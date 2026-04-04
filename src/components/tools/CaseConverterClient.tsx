"use client";
import { useState } from "react";

type Case = "upper"|"lower"|"title"|"sentence"|"camel"|"pascal"|"snake"|"kebab"|"constant"|"dot"|"toggle";

function toTitle(s: string) {
  return s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}
function toSentence(s: string) {
  return s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
}
function toWords(s: string) {
  return s.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_\.]+/g, " ").replace(/\s+/g, " ").trim();
}
function convert(s: string, c: Case): string {
  const words = toWords(s).toLowerCase().split(" ");
  switch(c) {
    case "upper": return s.toUpperCase();
    case "lower": return s.toLowerCase();
    case "title": return toTitle(s);
    case "sentence": return toSentence(s);
    case "camel": return words.map((w,i) => i===0 ? w : w.charAt(0).toUpperCase()+w.slice(1)).join("");
    case "pascal": return words.map(w => w.charAt(0).toUpperCase()+w.slice(1)).join("");
    case "snake": return words.join("_");
    case "kebab": return words.join("-");
    case "constant": return words.join("_").toUpperCase();
    case "dot": return words.join(".");
    case "toggle": return s.split("").map(c => c===c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
    default: return s;
  }
}

const cases: { id: Case; label: string; example: string }[] = [
  { id: "upper", label: "UPPERCASE", example: "HELLO WORLD" },
  { id: "lower", label: "lowercase", example: "hello world" },
  { id: "title", label: "Title Case", example: "Hello World" },
  { id: "sentence", label: "Sentence case", example: "Hello world." },
  { id: "camel", label: "camelCase", example: "helloWorld" },
  { id: "pascal", label: "PascalCase", example: "HelloWorld" },
  { id: "snake", label: "snake_case", example: "hello_world" },
  { id: "kebab", label: "kebab-case", example: "hello-world" },
  { id: "constant", label: "CONSTANT_CASE", example: "HELLO_WORLD" },
  { id: "dot", label: "dot.case", example: "hello.world" },
  { id: "toggle", label: "tOgGlE cAsE", example: "hElLo WoRlD" },
];

export default function CaseConverterClient() {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<Case>("title");
  const [copied, setCopied] = useState(false);

  const output = input ? convert(input, selected) : "";

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="case-input" className="text-sm font-semibold text-foreground mb-2 block">Input Text</label>
        <textarea
          id="case-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type or paste text here..."
          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[100px]"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">Choose Format</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {cases.map(c => (
            <button key={c.id} onClick={() => setSelected(c.id)}
              className={`rounded-xl border-2 p-3 text-left transition-all ${
                selected === c.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              }`}>
              <div className={`text-sm font-bold ${selected===c.id?"text-primary":"text-foreground"}`}>{c.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{c.example}</div>
            </button>
          ))}
        </div>
      </div>

      {output && (
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Result</label>
          <div className="relative rounded-xl border border-border bg-muted/30 p-4 min-h-[60px]">
            <p className="text-sm text-foreground pr-16 break-all">{output}</p>
            <button onClick={copy}
              className="absolute top-3 right-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
              id="copy-case-result">
              {copied ? "✅ Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => setInput(output)} className="btn-secondary flex-1 text-sm" id="use-as-input">
          Use as Input
        </button>
        <button onClick={() => { setInput(""); }} className="btn-secondary flex-1 text-sm" id="clear-case">
          Clear
        </button>
      </div>
    </div>
  );
}
