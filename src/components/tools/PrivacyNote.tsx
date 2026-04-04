import { ShieldCheck } from "lucide-react";

export default function PrivacyNote() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/30">
      <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
          Your files stay private
        </p>
        <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5 leading-relaxed">
          All processing happens directly in your browser using WebAssembly. Your files are never uploaded to any server and never leave your device.
        </p>
      </div>
    </div>
  );
}
