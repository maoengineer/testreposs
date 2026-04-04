import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for does not exist. Browse all iUseTools tools or go back to the homepage.",
};

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg shadow-xl mb-6">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-display text-7xl font-extrabold gradient-text mb-4">404</h1>
        <h2 className="font-display text-2xl font-bold text-foreground mb-3">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Oops! The page you're looking for doesn't exist. It may have been moved, deleted, or you may have typed the URL incorrectly.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="btn-primary">
          Go to Homepage
        </Link>
        <Link href="/tools" className="btn-secondary">
          Browse All Tools <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
