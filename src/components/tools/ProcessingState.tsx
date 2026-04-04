import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface ProcessingStateProps {
  state: "idle" | "processing" | "success" | "error";
  progress?: number;
  message?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

export default function ProcessingState({
  state,
  progress,
  message,
  errorMessage,
  onRetry,
}: ProcessingStateProps) {
  if (state === "idle") return null;

  if (state === "processing") {
    return (
      <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        </div>
        <p className="text-sm font-semibold text-foreground mb-1">
          {message || "Processing your file..."}
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          This may take a moment depending on file size
        </p>
        {typeof progress === "number" && (
          <div className="max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20 p-6 text-center">
        <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
          {message || "Conversion complete!"}
        </p>
        <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
          Your file is ready to download
        </p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20 p-6 text-center">
        <XCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <p className="text-sm font-semibold text-red-800 dark:text-red-200">Conversion failed</p>
        <p className="text-xs text-red-700 dark:text-red-400 mt-1 mb-4">
          {errorMessage || "Something went wrong. Please try again."}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-secondary text-xs px-4 py-2"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return null;
}
