"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Copy, Check, RefreshCw, ClipboardPaste, ChevronDown,
  Download, Scan, Languages, ImageIcon, AlertCircle,
  Settings2, FileText, Zap,
} from "lucide-react";
import DropZone from "@/components/tools/DropZone";
import { downloadText, validateImageFile } from "@/lib/utils";

/* ══════════════════════════════════════════════════════════════════
   LANGUAGE DATA  — grouped by script family
   Each lang carries its optimal PSM and whether it is RTL
══════════════════════════════════════════════════════════════════ */

interface LangOption {
  value: string;   // tesseract lang code
  label: string;
  flag: string;
  defaultPsm: number;  // best PSM for this language / script
  rtl?: boolean;
}

interface LangGroup {
  group: string;
  langs: LangOption[];
}

/**
 * PSM reference (Tesseract Page Segmentation Modes):
 *  3 = Auto (default, multi-column aware)
 *  4 = Single column, variable font sizes
 *  6 = Single uniform block  ← best for most clean images
 *  7 = Single text line      ← useful for a single-line image
 * 11 = Sparse text, no specific order ← good for receipts / mixed content
 * 12 = Sparse text with OSD
 *
 * Complex scripts (Khmer, Burmese, Thai) benefit from PSM 6 to avoid
 * the engine mistaking stacked diacritics for multiple columns.
 */

const LANG_GROUPS: LangGroup[] = [
  {
    group: "Southeast Asian",
    langs: [
      { value: "khm",  label: "Khmer",      flag: "🇰🇭", defaultPsm: 6 },
      { value: "vie",  label: "Vietnamese",  flag: "🇻🇳", defaultPsm: 6 },
      { value: "tha",  label: "Thai",        flag: "🇹🇭", defaultPsm: 6 },
      { value: "mya",  label: "Burmese",     flag: "🇲🇲", defaultPsm: 6 },
      { value: "ind",  label: "Indonesian",  flag: "🇮🇩", defaultPsm: 3 },
      { value: "msa",  label: "Malay",       flag: "🇲🇾", defaultPsm: 3 },
    ],
  },
  {
    group: "CJK (Chinese / Japanese / Korean)",
    langs: [
      { value: "chi_sim", label: "Chinese Simplified",  flag: "🇨🇳", defaultPsm: 6 },
      { value: "chi_tra", label: "Chinese Traditional",  flag: "🇹🇼", defaultPsm: 6 },
      { value: "jpn",     label: "Japanese",             flag: "🇯🇵", defaultPsm: 6 },
      { value: "kor",     label: "Korean",               flag: "🇰🇷", defaultPsm: 6 },
    ],
  },
  {
    group: "Latin / European",
    langs: [
      { value: "eng", label: "English",    flag: "🇺🇸", defaultPsm: 3 },
      { value: "fra", label: "French",     flag: "🇫🇷", defaultPsm: 3 },
      { value: "deu", label: "German",     flag: "🇩🇪", defaultPsm: 3 },
      { value: "spa", label: "Spanish",    flag: "🇪🇸", defaultPsm: 3 },
      { value: "ita", label: "Italian",    flag: "🇮🇹", defaultPsm: 3 },
      { value: "por", label: "Portuguese", flag: "🇧🇷", defaultPsm: 3 },
      { value: "nld", label: "Dutch",      flag: "🇳🇱", defaultPsm: 3 },
      { value: "pol", label: "Polish",     flag: "🇵🇱", defaultPsm: 3 },
      { value: "ces", label: "Czech",      flag: "🇨🇿", defaultPsm: 3 },
      { value: "slk", label: "Slovak",     flag: "🇸🇰", defaultPsm: 3 },
      { value: "ron", label: "Romanian",   flag: "🇷🇴", defaultPsm: 3 },
      { value: "hun", label: "Hungarian",  flag: "🇭🇺", defaultPsm: 3 },
      { value: "swe", label: "Swedish",    flag: "🇸🇪", defaultPsm: 3 },
      { value: "nor", label: "Norwegian",  flag: "🇳🇴", defaultPsm: 3 },
      { value: "dan", label: "Danish",     flag: "🇩🇰", defaultPsm: 3 },
      { value: "fin", label: "Finnish",    flag: "🇫🇮", defaultPsm: 3 },
      { value: "hrv", label: "Croatian",   flag: "🇭🇷", defaultPsm: 3 },
      { value: "srp", label: "Serbian",    flag: "🇷🇸", defaultPsm: 3 },
      { value: "ell", label: "Greek",      flag: "🇬🇷", defaultPsm: 3 },
      { value: "tur", label: "Turkish",    flag: "🇹🇷", defaultPsm: 3 },
    ],
  },
  {
    group: "Cyrillic",
    langs: [
      { value: "rus", label: "Russian",    flag: "🇷🇺", defaultPsm: 3 },
      { value: "ukr", label: "Ukrainian",  flag: "🇺🇦", defaultPsm: 3 },
      { value: "bul", label: "Bulgarian",  flag: "🇧🇬", defaultPsm: 3 },
    ],
  },
  {
    group: "Arabic / RTL",
    langs: [
      { value: "ara", label: "Arabic",        flag: "🇸🇦", defaultPsm: 6, rtl: true },
      { value: "fas", label: "Persian (Farsi)", flag: "🇮🇷", defaultPsm: 6, rtl: true },
      { value: "heb", label: "Hebrew",         flag: "🇮🇱", defaultPsm: 6, rtl: true },
      { value: "urd", label: "Urdu",           flag: "🇵🇰", defaultPsm: 6, rtl: true },
    ],
  },
  {
    group: "South Asian",
    langs: [
      { value: "hin", label: "Hindi",     flag: "🇮🇳", defaultPsm: 6 },
      { value: "ben", label: "Bengali",   flag: "🇧🇩", defaultPsm: 6 },
      { value: "tam", label: "Tamil",     flag: "🇱🇰", defaultPsm: 6 },
      { value: "tel", label: "Telugu",    flag: "🇮🇳", defaultPsm: 6 },
      { value: "kan", label: "Kannada",   flag: "🇮🇳", defaultPsm: 6 },
      { value: "mal", label: "Malayalam", flag: "🇮🇳", defaultPsm: 6 },
      { value: "sin", label: "Sinhala",   flag: "🇱🇰", defaultPsm: 6 },
    ],
  },
];

const ALL_LANGS: LangOption[] = LANG_GROUPS.flatMap((g) => g.langs);

/* ══════════════════════════════════════════════════════════════════
   PSM OPTIONS — shown to users as "Document Type"
══════════════════════════════════════════════════════════════════ */

interface PsmOption {
  value: number;
  label: string;
  description: string;
}

const PSM_OPTIONS: PsmOption[] = [
  { value: 3,  label: "Auto (best for most images)",     description: "Multi-column, mixed layout detection" },
  { value: 6,  label: "Single block of text",             description: "Best for Khmer, Chinese, Arabic, Hindi…" },
  { value: 4,  label: "Single column, variable sizes",    description: "Documents with a single text column" },
  { value: 11, label: "Sparse / scattered text",          description: "Receipts, signs, stickers" },
  { value: 7,  label: "Single line",                      description: "One-liner images or captions" },
];

/* ══════════════════════════════════════════════════════════════════
   IMAGE PREPROCESSING — Canvas-based pipeline
   Boosts OCR accuracy for low-contrast / small-text images
══════════════════════════════════════════════════════════════════ */

/**
 * Preprocesses the image using an off-screen Canvas:
 * 1. Scale up if small (min target: 1500 px on the longer side)
 * 2. Convert to grayscale + boost contrast
 * Returns a Blob that Tesseract will process instead of the original.
 */
async function preprocessImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MIN_LONG_SIDE = 1800;
      let { width, height } = img;

      // Scale up small images for better character recognition
      const longSide = Math.max(width, height);
      if (longSide < MIN_LONG_SIDE) {
        const scale = MIN_LONG_SIDE / longSide;
        width  = Math.round(width  * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width  = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas 2D not supported")); return; }

      // Apply grayscale + contrast enhancement in one draw call
      ctx.filter = "grayscale(100%) contrast(140%) brightness(1.05)";
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob failed"));
        },
        "image/png"
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
    img.src = url;
  });
}

/* ══════════════════════════════════════════════════════════════════
   PARSE OCR TEXT → STRUCTURED "BLOCKS"
   Preserves paragraph breaks and empty-line separators
══════════════════════════════════════════════════════════════════ */

interface TextBlock {
  lines: string[];        // one or more consecutive lines in a paragraph
  isParagraphEnd: boolean; // was there a blank line after this block?
}

function parseBlocks(rawText: string): TextBlock[] {
  const rawLines = rawText.split("\n").map((l) => l.trimEnd());
  const blocks: TextBlock[] = [];
  let currentLines: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (line.trim().length === 0) {
      if (currentLines.length > 0) {
        blocks.push({ lines: currentLines, isParagraphEnd: true });
        currentLines = [];
      }
    } else {
      currentLines.push(line);
    }
  }
  if (currentLines.length > 0) {
    blocks.push({ lines: currentLines, isParagraphEnd: false });
  }
  return blocks;
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */

export default function ImageToTextClient() {
  // ── State ──────────────────────────────────────────────────────
  const [file,          setFile]          = useState<File | null>(null);
  const [previewUrl,    setPreviewUrl]    = useState<string | null>(null);
  const [status,        setStatus]        = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress,      setProgress]      = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [blocks,        setBlocks]        = useState<TextBlock[]>([]);
  const [errorMsg,      setErrorMsg]      = useState("");
  const [language,      setLanguage]      = useState("eng");
  const [psm,           setPsm]           = useState(3);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showPsmPicker,  setShowPsmPicker]  = useState(false);
  const [copiedAll,     setCopiedAll]     = useState(false);
  const [copiedLine,    setCopiedLine]    = useState<string | null>(null); // "blockIdx-lineIdx"
  const [pasteHint,     setPasteHint]     = useState(true);
  const [confidence,    setConfidence]    = useState<number | null>(null);
  const [preprocessed,  setPreprocessed]  = useState(true);  // toggle preprocessing

  const langPickerRef = useRef<HTMLDivElement>(null);
  const psmPickerRef  = useRef<HTMLDivElement>(null);

  // ── Derived ────────────────────────────────────────────────────
  const selectedLang = ALL_LANGS.find((l) => l.value === language) ?? ALL_LANGS[0];
  const selectedPsm  = PSM_OPTIONS.find((p) => p.value === psm) ?? PSM_OPTIONS[0];
  const isRtl        = selectedLang.rtl ?? false;

  // flat list of all lines for copy-all / download
  const allLines = blocks.flatMap((b) => b.lines);

  // ── Close pickers on outside click ────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langPickerRef.current && !langPickerRef.current.contains(e.target as Node))
        setShowLangPicker(false);
      if (psmPickerRef.current && !psmPickerRef.current.contains(e.target as Node))
        setShowPsmPicker(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Paste hint dismiss ─────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setPasteHint(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // ── When language changes, update PSM to the language's ideal ──
  const handleLangChange = (lang: LangOption) => {
    setLanguage(lang.value);
    setPsm(lang.defaultPsm);
    setShowLangPicker(false);
  };

  // ── Clipboard paste ───────────────────────────────────────────
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (status === "processing") return;
      const items = Array.from(e.clipboardData?.items || []);
      const img = items.find((i) => i.type.startsWith("image/"));
      if (!img) return;
      e.preventDefault();
      const blob = img.getAsFile();
      if (!blob) return;
      const f = new File([blob], "pasted-image.png", { type: blob.type });
      const err = validateImageFile(f);
      if (err) { setErrorMsg(err); setStatus("error"); return; }
      applyFile(f);
    },
    [status]
  );

  useEffect(() => {
    window.addEventListener("paste", handlePaste as EventListener);
    return () => window.removeEventListener("paste", handlePaste as EventListener);
  }, [handlePaste]);

  // ── Apply new file ────────────────────────────────────────────
  const applyFile = (f: File) => {
    setFile(f);
    setStatus("idle");
    setBlocks([]);
    setErrorMsg("");
    setConfidence(null);
    setPasteHint(false);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const handleFileSelect = (f: File) => {
    const err = validateImageFile(f);
    if (err) { setErrorMsg(err); setStatus("error"); return; }
    applyFile(f);
  };

  /* ── OCR with preprocessing + configurable PSM ─────────────── */
  const handleExtract = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(5);
    setProgressLabel("Preparing image…");
    setBlocks([]);
    setConfidence(null);

    try {
      // Step 1: preprocess
      let imageSource: Blob | File = file;
      if (preprocessed) {
        setProgressLabel("Enhancing image quality…");
        setProgress(12);
        try {
          imageSource = await preprocessImage(file);
        } catch {
          // fall back to original if canvas fails
          imageSource = file;
        }
      }

      setProgress(20);
      setProgressLabel("Loading OCR engine…");

      // Step 2: import tesseract + createWorker
      const { createWorker } = await import("tesseract.js");

      setProgress(30);
      setProgressLabel(`Loading ${selectedLang.label} language data…`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const worker = await createWorker(language as any, 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "loading tesseract core")        { setProgress(35); setProgressLabel("Loading OCR engine…"); }
          if (m.status === "initializing tesseract")        { setProgress(45); setProgressLabel("Initializing engine…"); }
          if (m.status === "loading language traineddata")  { setProgress(55); setProgressLabel(`Loading ${selectedLang.label} model…`); }
          if (m.status === "initializing api")              { setProgress(65); setProgressLabel("Preparing…"); }
          if (m.status === "recognizing text") {
            setProgress(68 + Math.round(m.progress * 28));
            setProgressLabel(`Recognizing… ${Math.round(m.progress * 100)}%`);
          }
        },
      });

      // Step 3: apply PSM
      await worker.setParameters({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tessedit_pageseg_mode: psm as any,
      });

      setProgress(70);
      setProgressLabel("Recognizing text…");

      const result = await worker.recognize(imageSource);
      await worker.terminate();

      const rawText = result.data.text ?? "";
      const parsed  = parseBlocks(rawText);

      if (parsed.length === 0 || parsed.every((b) => b.lines.length === 0)) {
        setErrorMsg("No readable text found. Try selecting a different language, PSM mode, or use a clearer image.");
        setStatus("error");
        return;
      }

      setConfidence(result.data.confidence ?? null);
      setBlocks(parsed);
      setProgress(100);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setErrorMsg("OCR processing failed. Please try again with a different image or language.");
      setStatus("error");
    }
  };

  /* ── Reset ───────────────────────────────────────────────────── */
  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setStatus("idle");
    setBlocks([]);
    setErrorMsg("");
    setConfidence(null);
    setPasteHint(true);
  };

  /* ── Copy helpers ────────────────────────────────────────────── */
  const copyAll = async () => {
    await navigator.clipboard.writeText(allLines.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const copyLine = async (blockIdx: number, lineIdx: number) => {
    await navigator.clipboard.writeText(blocks[blockIdx].lines[lineIdx]);
    const key = `${blockIdx}-${lineIdx}`;
    setCopiedLine(key);
    setTimeout(() => setCopiedLine(null), 1500);
  };

  /* ── Confidence badge colour ─────────────────────────────────── */
  const confColor =
    confidence === null ? "" :
    confidence >= 80 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" :
    confidence >= 55 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300" :
                       "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300";

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <div className="space-y-5">

      {/* ── Privacy note ────────────────────────────────────────── */}
      <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20 px-4 py-3">
        <Scan className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
          <strong>100% private.</strong> Your image is processed entirely in your browser using WebAssembly. Nothing is uploaded anywhere.
        </p>
      </div>

      {/* ── Paste hint ──────────────────────────────────────────── */}
      {pasteHint && !file && (
        <div className="flex items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
          <ClipboardPaste className="h-4 w-4 shrink-0" />
          <span>
            <strong>Tip:</strong> Press{" "}
            <kbd className="rounded bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 text-xs font-mono border border-blue-300 dark:border-blue-700">
              Ctrl+V
            </kbd>{" "}
            anywhere on this page to paste a screenshot directly.
          </span>
        </div>
      )}

      {/* ── Settings grid (Language + PSM + preprocessing) ──────── */}
      <div className="grid gap-4 sm:grid-cols-2">

        {/* Language selector */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
            <Languages className="h-3.5 w-3.5" />
            Language in the image <span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="relative" ref={langPickerRef}>
            <button
              type="button"
              onClick={() => setShowLangPicker((v) => !v)}
              disabled={status === "processing"}
              className="w-full flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors disabled:opacity-50"
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="text-lg leading-none shrink-0">{selectedLang.flag}</span>
                <span className="truncate">{selectedLang.label}</span>
                {/* PSM hint badge */}
                {selectedLang.defaultPsm !== 3 && (
                  <span className="rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2 py-0.5 text-[10px] font-semibold shrink-0">
                    PSM {selectedLang.defaultPsm}
                  </span>
                )}
              </span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ml-2 ${showLangPicker ? "rotate-180" : ""}`} />
            </button>

            {showLangPicker && (
              <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
                {LANG_GROUPS.map((group) => (
                  <div key={group.group}>
                    <div className="sticky top-0 bg-muted/80 backdrop-blur-sm px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                      {group.group}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 p-2">
                      {group.langs.map((lang) => (
                        <button
                          key={lang.value}
                          type="button"
                          onClick={() => handleLangChange(lang)}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left transition-colors hover:bg-muted ${
                            language === lang.value
                              ? "bg-primary/10 text-primary font-semibold border border-primary/30"
                              : "text-foreground"
                          }`}
                        >
                          <span className="text-base shrink-0">{lang.flag}</span>
                          <span className="truncate">{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PSM / Document-type selector */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
            <Settings2 className="h-3.5 w-3.5" />
            Document type (PSM)
          </label>
          <div className="relative" ref={psmPickerRef}>
            <button
              type="button"
              onClick={() => setShowPsmPicker((v) => !v)}
              disabled={status === "processing"}
              className="w-full flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors disabled:opacity-50"
            >
              <span className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate">{selectedPsm.label}</span>
              </span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ml-2 ${showPsmPicker ? "rotate-180" : ""}`} />
            </button>

            {showPsmPicker && (
              <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
                {PSM_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setPsm(opt.value); setShowPsmPicker(false); }}
                    className={`w-full flex flex-col items-start px-4 py-3 text-sm text-left transition-colors hover:bg-muted border-b border-border last:border-0 ${
                      psm === opt.value ? "bg-primary/10 text-primary" : "text-foreground"
                    }`}
                  >
                    <span className="font-semibold">{opt.label}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{opt.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Image enhancement toggle ─────────────────────────────── */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Zap className="h-4 w-4 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-foreground">Image Enhancement</p>
            <p className="text-xs text-muted-foreground">Grayscale + contrast boost before OCR — improves accuracy on photos &amp; scans</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPreprocessed((v) => !v)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
            preprocessed ? "bg-primary" : "bg-muted"
          }`}
          role="switch"
          aria-checked={preprocessed}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${
              preprocessed ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* ── Drop zone ───────────────────────────────────────────── */}
      {!file && (
        <DropZone
          onFileSelect={handleFileSelect}
          accept={{
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png":  [".png"],
            "image/webp": [".webp"],
            "image/bmp":  [".bmp"],
          }}
          maxSize={20 * 1024 * 1024}
          label="Drop your image here or press Ctrl+V"
          sublabel="JPG, PNG, WebP, BMP · Max 20 MB"
        />
      )}

      {/* ── Image preview + extract button ──────────────────────── */}
      {file && status === "idle" && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {previewUrl && (
            <div className="relative w-full max-h-72 bg-muted/40 overflow-hidden flex items-center justify-center border-b border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview" className="max-h-72 w-auto object-contain" />
            </div>
          )}
          <div className="flex items-center justify-between px-4 py-3 gap-3 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <span className="text-xs text-muted-foreground shrink-0">
                ({(file.size / 1024).toFixed(0)} KB)
              </span>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={reset}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Change
              </button>
              <button
                onClick={handleExtract}
                className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2"
                id="convert-image-to-text"
              >
                <Scan className="h-4 w-4" />
                Extract Text
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Processing state ─────────────────────────────────────── */}
      {status === "processing" && (
        <div className="rounded-2xl border border-border bg-muted/30 p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
              <Scan className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{progressLabel}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedLang.flag} {selectedLang.label} · PSM {psm} · {preprocessed ? "Enhanced" : "Raw"} mode
              </p>
            </div>
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Error state ──────────────────────────────────────────── */}
      {status === "error" && (
        <div className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800 dark:text-red-200">Extraction failed</p>
              <p className="text-xs text-red-700 dark:text-red-400 mt-1 mb-3">{errorMsg}</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={reset} className="btn-secondary text-xs px-4 py-2">Try Again</button>
                {file && (
                  <button
                    onClick={() => { setStatus("idle"); setErrorMsg(""); }}
                    className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-4 py-2 transition-colors"
                  >
                    Change Settings &amp; Retry
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          RESULTS — side-by-side layout on wide screens
      ══════════════════════════════════════════════════════════ */}
      {status === "done" && blocks.length > 0 && (
        <div className="space-y-4">

          {/* ── Result header bar ─────────────────────────────────── */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <Check className="h-3.5 w-3.5" />
                {allLines.length} line{allLines.length !== 1 ? "s" : ""} extracted
              </div>
              {confidence !== null && (
                <div className={`rounded-full px-3 py-1.5 text-xs font-semibold ${confColor}`}>
                  {Math.round(confidence)}% confidence
                </div>
              )}
              <div className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                {selectedLang.flag} {selectedLang.label} · PSM {psm}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={copyAll}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                {copiedAll ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedAll ? "Copied!" : "Copy All"}
              </button>
              <button
                onClick={() => downloadText(allLines.join("\n"), "extracted-text.txt")}
                className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Download .txt
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                New Image
              </button>
            </div>
          </div>

          {/* ── Side-by-side: preview + line rows ────────────────── */}
          <div className="grid gap-4 lg:grid-cols-[300px_1fr]">

            {/* Thumbnail */}
            {previewUrl && (
              <div className="rounded-2xl border border-border bg-muted/30 overflow-hidden flex items-center justify-center min-h-40 self-start sticky top-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Source" className="max-h-96 w-full object-contain" />
              </div>
            )}

            {/* Line-by-line text output */}
            <div className="rounded-2xl border border-border overflow-hidden">

              {/* Table header */}
              <div className="grid grid-cols-[40px_1fr_36px] bg-muted/60 border-b border-border px-1 py-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">#</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3">Extracted Text</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Copy</span>
              </div>

              {/* Rows — paragraph-aware */}
              <div className="divide-y divide-border max-h-[560px] overflow-y-auto" dir={isRtl ? "rtl" : "ltr"}>
                {blocks.flatMap((block, bIdx) =>
                  block.lines.map((line, lIdx) => {
                    const globalLineNum = blocks
                      .slice(0, bIdx)
                      .reduce((acc, b) => acc + b.lines.length, 0) + lIdx + 1;
                    const key = `${bIdx}-${lIdx}`;
                    const isLastInBlock = lIdx === block.lines.length - 1 && block.isParagraphEnd;

                    return (
                      <div
                        key={key}
                        className={`grid grid-cols-[40px_1fr_36px] items-start hover:bg-muted/30 transition-colors group ${
                          isLastInBlock ? "border-b-2 border-primary/10" : ""
                        }`}
                      >
                        {/* Line number */}
                        <div className="flex items-center justify-center py-3 px-1">
                          <span className="text-[11px] font-mono text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                            {globalLineNum}
                          </span>
                        </div>

                        {/* Text content */}
                        <div className="py-3 px-3">
                          <p
                            className="text-sm text-foreground leading-relaxed break-words"
                            style={{ textAlign: isRtl ? "right" : "left", fontFamily: isRtl ? "serif" : "inherit" }}
                          >
                            {line}
                          </p>
                        </div>

                        {/* Copy line button */}
                        <div className="flex items-center justify-center py-3 px-1">
                          <button
                            onClick={() => copyLine(bIdx, lIdx)}
                            className="rounded-lg p-1.5 text-muted-foreground/40 hover:text-primary hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100"
                            title="Copy this line"
                          >
                            {copiedLine === key
                              ? <Check className="h-3.5 w-3.5 text-emerald-500" />
                              : <Copy className="h-3.5 w-3.5" />
                            }
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-t border-border flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">
                  {selectedLang.flag} {selectedLang.label}
                  &nbsp;·&nbsp;{allLines.length} lines
                  &nbsp;·&nbsp;{allLines.join(" ").split(/\s+/).filter(Boolean).length.toLocaleString()} words
                  &nbsp;·&nbsp;{allLines.join("\n").length.toLocaleString()} chars
                  &nbsp;·&nbsp;{blocks.length} paragraph{blocks.length !== 1 ? "s" : ""}
                </span>
                {confidence !== null && confidence < 60 && (
                  <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                    ⚠ Low confidence — try PSM 6 or a clearer/higher-resolution image
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
