"use client";

import React, { useEffect, useRef, useState } from "react";

export default function KhTrackerWidget() {
  const [isActive, setIsActive] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");
  const [seconds, setSeconds] = useState(10);
  const [isReady, setIsReady] = useState(false);
  const [dashOffset, setDashOffset] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  const isReadyRef = useRef(false);
  const targetUrlRef = useRef("");
  const isActiveRef = useRef(false);

  useEffect(() => {
    isReadyRef.current = isReady;
  }, [isReady]);

  useEffect(() => {
    targetUrlRef.current = targetUrl;
  }, [targetUrl]);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const rawDl = urlParams.get("dl");

    // Normal visitors: exit silently if no '?dl='
    if (!rawDl) return;

    let destinationUrl = "";
    try {
      const binaryStr = atob(decodeURIComponent(rawDl));
      destinationUrl = decodeURIComponent(escape(binaryStr));
    } catch {
      try {
        destinationUrl = decodeURIComponent(atob(rawDl));
      } catch {
        destinationUrl = decodeURIComponent(rawDl);
      }
    }

    if (
      !destinationUrl ||
      (!destinationUrl.startsWith("http://") && !destinationUrl.startsWith("https://"))
    ) {
      console.warn("[khTracker Gateway] Invalid destination URL.");
      return;
    }

    // ── Clean address bar: remove ?ref=...&dl=... keeping only clean pathname ──
    try {
      const cleanUrl = window.location.pathname + (window.location.hash || "");
      window.history.replaceState(null, document.title, cleanUrl);
      setTimeout(() => {
        window.history.replaceState(null, document.title, cleanUrl);
      }, 500);
    } catch {}

    setTargetUrl(destinationUrl);
    setIsActive(true);

    // ── Block clicks on the website background (protects user from clicking away while allowing 100% native smooth scroll) ──
    const blockOutsideClicks = (e: MouseEvent) => {
      if (!isActiveRef.current) return;
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        e.preventDefault();
        e.stopPropagation();
        setIsShaking(false);
        // Trigger reflow to restart CSS animation
        requestAnimationFrame(() => {
          setIsShaking(true);
        });
      }
    };

    document.addEventListener("click", blockOutsideClicks, true);
    document.addEventListener("auxclick", blockOutsideClicks, true);

    const totalSeconds = 10;
    let remaining = totalSeconds;
    const fullDash = 264; // 2 * PI * 42

    const timer = setInterval(() => {
      remaining--;
      setSeconds(remaining);

      const offset = fullDash - ((totalSeconds - remaining) / totalSeconds) * fullDash;
      setDashOffset(offset);

      if (remaining <= 0) {
        clearInterval(timer);
        setIsReady(true);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      document.removeEventListener("click", blockOutsideClicks, true);
      document.removeEventListener("auxclick", blockOutsideClicks, true);
    };
  }, []);

  const handleGetLink = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isReady || !targetUrl) return;

    // 1. Open destination URL in a new tab
    window.open(targetUrl, "_blank");

    // 2. Mark active false so click listeners stop blocking
    setIsActive(false);

    // 3. Smoothly fade out and dismiss pop-up from current page
    setIsFadingOut(true);
    setTimeout(() => {
      setTargetUrl("");
    }, 350);
  };

  if (!targetUrl && !isActive) {
    return null;
  }

  return (
    <>
      {/* 1. POP-UP HTML STRUCTURE */}
      <div
        id="kt-safelink-overlay"
        style={{
          display: isFadingOut ? "flex" : isActive ? "flex" : "none",
          opacity: isFadingOut ? 0 : 1,
          transition: isFadingOut ? "opacity 0.35s ease" : undefined,
        }}
        aria-hidden={!isActive}
      >
        <div
          ref={boxRef}
          className={`kt-safelink-box ${isShaking ? "shake" : ""}`}
          onAnimationEnd={() => setIsShaking(false)}
        >
          {/* Circular Ring Countdown */}
          <div className="kt-ring-wrapper">
            <svg className="kt-ring-svg" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="ktPinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff2e63" />
                  <stop offset="100%" stopColor="#ff577f" />
                </linearGradient>
                <linearGradient id="ktGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <circle className="kt-ring-bg" cx="50" cy="50" r="42" />
              <circle
                id="kt-ring-bar"
                className="kt-ring-bar"
                cx="50"
                cy="50"
                r="42"
                style={{
                  strokeDashoffset: dashOffset,
                  stroke: isReady ? "url(#ktGreenGrad)" : "url(#ktPinkGrad)",
                }}
              />
            </svg>
            <div id="kt-seconds-container" className="kt-seconds-txt">
              {isReady ? (
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                seconds
              )}
            </div>
          </div>

          {/* Action Pill Button with Clean Vector SVG Icons */}
          <button
            id="kt-action-btn"
            className={isReady ? "kt-btn-ready" : "kt-btn-waiting"}
            type="button"
            disabled={!isReady}
            onClick={handleGetLink}
          >
            <span id="kt-btn-icon-box" className="kt-icon-box">
              {isReady ? (
                /* Download SVG Icon */
                <svg
                  className="kt-svg-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              ) : (
                /* Shield Security SVG Icon */
                <svg
                  className="kt-svg-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              )}
            </span>
            <span id="kt-btn-label">{isReady ? "Get Link" : "Verifying Security"}</span>
          </button>
        </div>
      </div>

      {/* 2. POP-UP CSS STYLING */}
      <style>{`
        /* Overlay Background: NO BLUR, transparent tint, pointer-events:none for 100% native smooth scroll */
        #kt-safelink-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.2);
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          z-index: 9999999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: ktPopIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: default;
          pointer-events: none !important; /* Passes all wheel and touch gestures directly to website */
        }

        @keyframes ktPopIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }

        /* Center Floating Locked Card: Sleek Cyber Dark Card */
        .kt-safelink-box {
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 26px 30px;
          border-radius: 28px;
          box-shadow: 
            0 25px 60px -10px rgba(0, 0, 0, 0.65),
            0 0 0 1px rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 250px;
          box-sizing: border-box;
          position: relative;
          user-select: none;
          pointer-events: auto !important; /* Enables full clicks and interaction on the card */
          transition: transform 0.2s ease;
        }

        .kt-safelink-box.shake {
          animation: ktShake 0.4s ease;
        }

        @keyframes ktShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }

        .kt-ring-wrapper {
          position: relative;
          width: 114px;
          height: 114px;
          margin-bottom: 18px;
        }

        .kt-ring-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .kt-ring-bg {
          fill: #1e293b;
          stroke: #1e293b;
          stroke-width: 8;
        }

        .kt-ring-bar {
          fill: none;
          stroke-width: 8;
          stroke-linecap: round;
          stroke-dasharray: 264;
          transition: stroke-dashoffset 1s linear, stroke 0.3s ease;
        }

        .kt-seconds-txt {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 34px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        #kt-action-btn {
          border: none;
          border-radius: 9999px;
          padding: 12px 22px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          width: 100%;
          box-sizing: border-box;
          cursor: default;
          letter-spacing: -0.01em;
        }

        .kt-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 0;
        }

        .kt-svg-icon {
          width: 15px;
          height: 15px;
          display: block;
        }

        /* Waiting State (Pink Coral Pill) */
        .kt-btn-waiting {
          background: linear-gradient(135deg, #ff2e63 0%, #ff577f 100%) !important;
          color: #ffffff !important;
          cursor: wait !important;
          box-shadow: 0 8px 22px rgba(255, 46, 99, 0.38);
        }

        /* Ready State (Emerald Green Pill with Pulse) */
        .kt-btn-ready {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
          color: #ffffff !important;
          cursor: pointer !important;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.45) !important;
          animation: ktPulseGlow 1.6s infinite ease-in-out;
        }

        .kt-btn-ready:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(16, 185, 129, 0.55) !important;
        }

        @keyframes ktPulseGlow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.45);
          }
          50% {
            transform: scale(1.04);
            box-shadow: 0 12px 30px rgba(16, 185, 129, 0.65);
          }
        }
      `}</style>
    </>
  );
}
