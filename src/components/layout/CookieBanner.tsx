"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm">
      <div className="rounded-2xl border border-border bg-card shadow-2xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Cookie className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Cookie Notice</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use essential cookies to make this site work and optional analytics cookies to understand how visitors use it.{" "}
              <Link href="/cookie-policy" className="text-primary hover:underline">
                Learn more
              </Link>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={accept}
            className="flex-1 btn-primary text-xs py-2 px-3"
            id="cookie-accept"
          >
            Accept All
          </button>
          <button
            onClick={decline}
            className="flex-1 btn-secondary text-xs py-2 px-3"
            id="cookie-decline"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
}
