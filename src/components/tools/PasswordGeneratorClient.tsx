"use client";
import { useState } from "react";

type Charset = { label: string; chars: string; key: string };
const CHARSETS: Charset[] = [
  { key: "upper", label: "Uppercase (A-Z)", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
  { key: "lower", label: "Lowercase (a-z)", chars: "abcdefghijklmnopqrstuvwxyz" },
  { key: "numbers", label: "Numbers (0-9)", chars: "0123456789" },
  { key: "symbols", label: "Symbols (!@#…)", chars: "!@#$%^&*()_+-=[]{}|;:,.<>?" },
  { key: "similar", label: "Exclude similar chars (lI1O0)", chars: "" },
];

function generatePassword(len: number, sets: Set<string>, excludeSimilar: boolean): string {
  let pool = "";
  if (sets.has("upper")) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (sets.has("lower")) pool += "abcdefghijklmnopqrstuvwxyz";
  if (sets.has("numbers")) pool += "0123456789";
  if (sets.has("symbols")) pool += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  if (excludeSimilar) pool = pool.replace(/[lI1O0]/g, "");
  if (!pool) return "";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(n => pool[n % pool.length]).join("");
}

function strength(pw: string): { label: string; color: string; width: string } {
  if (!pw) return { label: "", color: "", width: "0%" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "25%" };
  if (score <= 4) return { label: "Fair", color: "bg-yellow-400", width: "50%" };
  if (score <= 5) return { label: "Good", color: "bg-blue-400", width: "75%" };
  return { label: "Strong", color: "bg-emerald-500", width: "100%" };
}

export default function PasswordGeneratorClient() {
  const [length, setLength] = useState(16);
  const [sets, setSets] = useState<Set<string>>(new Set(["upper","lower","numbers"]));
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copied, setCopied] = useState<number|null>(null);

  const toggle = (k: string) => setSets(prev => {
    const n = new Set(prev);
    n.has(k) ? n.delete(k) : n.add(k);
    return n;
  });

  const generate = () => {
    setPasswords(Array.from({ length: count }, () => generatePassword(length, sets, excludeSimilar)));
  };

  const copy = (i: number) => {
    navigator.clipboard.writeText(passwords[i]);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  };

  const pw1 = passwords[0] || "";
  const { label, color, width } = strength(pw1);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">
          Password Length: <span className="text-primary font-bold">{length}</span>
        </label>
        <input type="range" min={4} max={64} value={length}
          onChange={e => setLength(Number(e.target.value))} className="w-full accent-primary" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>4</span><span>16</span><span>32</span><span>64</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground block">Character Sets</label>
        {CHARSETS.filter(c => c.key !== "similar").map(c => (
          <label key={c.key} className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={sets.has(c.key)} onChange={() => toggle(c.key)}
              className="accent-primary" />
            <span className="text-sm text-foreground">{c.label}</span>
          </label>
        ))}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={excludeSimilar} onChange={e => setExcludeSimilar(e.target.checked)}
            className="accent-primary" />
          <span className="text-sm text-foreground">Exclude similar characters (l, I, 1, O, 0)</span>
        </label>
      </div>

      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
          Generate: <span className="text-primary">{count}</span> password{count>1?"s":""}
        </label>
        <input type="range" min={1} max={10} value={count}
          onChange={e => setCount(Number(e.target.value))} className="w-full accent-primary" />
      </div>

      <button onClick={generate} disabled={sets.size===0} className="btn-primary w-full" id="generate-password">
        🔐 Generate Password{count>1?"s":""}
      </button>

      {passwords.length > 0 && (
        <div className="space-y-3">
          {/* Strength indicator (based on first) */}
          {pw1 && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Strength</span>
                <span className={`font-semibold ${label==="Strong"?"text-emerald-500":label==="Good"?"text-blue-400":label==="Fair"?"text-yellow-500":"text-red-500"}`}>{label}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width }} />
              </div>
            </div>
          )}

          {passwords.map((pw, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
              <code className="flex-1 text-sm font-mono text-foreground break-all">{pw}</code>
              <button onClick={() => copy(i)}
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                id={`copy-password-${i}`}>
                {copied===i ? "✅" : "Copy"}
              </button>
            </div>
          ))}

          <button onClick={generate} className="btn-secondary w-full text-sm" id="regenerate-password">
            🔄 Regenerate
          </button>
        </div>
      )}
    </div>
  );
}
