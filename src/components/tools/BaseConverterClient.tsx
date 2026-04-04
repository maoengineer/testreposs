"use client";
import { useState } from "react";
import PrivacyNote from "@/components/tools/PrivacyNote";

const BASES = [
  { label: "Binary (Base 2)", base: 2, prefix: "0b" },
  { label: "Octal (Base 8)", base: 8, prefix: "0o" },
  { label: "Decimal (Base 10)", base: 10, prefix: "" },
  { label: "Hexadecimal (Base 16)", base: 16, prefix: "0x" },
];

export default function BaseConverterClient() {
  const [input, setInput] = useState("255");
  const [fromBase, setFromBase] = useState(10);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const decimalValue = (() => {
    try {
      const n = parseInt(input.replace(/^0[bBoOxX]/, ""), fromBase);
      if (isNaN(n)) return null;
      return n;
    } catch {
      return null;
    }
  })();

  const validate = (val: string, base: number) => {
    const chars: Record<number, RegExp> = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9a-fA-F]+$/,
    };
    return chars[base]?.test(val.replace(/^0[bBoOxX]/, "")) ?? true;
  };

  const handleInput = (val: string) => {
    setInput(val);
    setError(val && !validate(val, fromBase) ? `Invalid digits for base ${fromBase}` : "");
  };

  const copy = (base: number, val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(base);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <PrivacyNote />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Input Base</label>
          <select
            value={fromBase}
            onChange={(e) => { setFromBase(Number(e.target.value)); setError(""); }}
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            id="base-from-select"
          >
            {BASES.map((b) => <option key={b.base} value={b.base}>{b.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Number to Convert</label>
          <input
            type="text" value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder={fromBase === 2 ? "e.g. 11111111" : fromBase === 16 ? "e.g. FF" : "e.g. 255"}
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            id="base-input"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl px-4 py-3">{error}</p>}

      {decimalValue !== null && !error && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Conversions</p>
          {BASES.map(({ label, base, prefix }) => {
            const val = decimalValue.toString(base).toUpperCase();
            const display = prefix ? prefix.toUpperCase() + val : val;
            return (
              <div key={base} className={`flex items-center justify-between rounded-xl border px-4 py-3 ${base === fromBase ? "border-primary bg-primary/5" : "border-border bg-muted/30"}`}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary mb-0.5">{label}</p>
                  <code className="text-sm font-mono text-foreground">{display}</code>
                </div>
                <button onClick={() => copy(base, display)} className="text-xs font-semibold text-primary hover:underline">
                  {copied === base ? "✓" : "Copy"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
