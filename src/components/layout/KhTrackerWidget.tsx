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
    }, 400);
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
          transform: isFadingOut ? "scale(0.95)" : "scale(1)",
          transition: isFadingOut ? "opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" : undefined,
        }}
        aria-hidden={!isActive}
      >
        <div
          ref={boxRef}
          className={`kt-safelink-box ${isShaking ? "shake" : ""} ${isReady ? "is-ready" : ""}`}
          onAnimationEnd={() => setIsShaking(false)}
        >
          {/* Top Ambient Glow */}
          <div className="kt-ambient-glow" />

          {/* Security Status Badge */}
          <div className="kt-header-badge">
            <span className={`kt-badge-pulse ${isReady ? "ready" : ""}`} />
            <span className="kt-badge-txt">
              {isReady ? "Ready to Download" : "khTracker Protected"}
            </span>
          </div>

          {/* Circular Ring Countdown */}
          <div className="kt-ring-wrapper">
            {/* Outer decorative track */}
            <div className="kt-ring-outer-glow" />

            <svg className="kt-ring-svg" viewBox="0 0 100 100">
              <defs>
                {/* Cyber Rose to Violet Gradient */}
                <linearGradient id="ktRoseVioletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>

                {/* Cyber Emerald to Cyan Gradient */}
                <linearGradient id="ktEmeraldCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="60%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>

              {/* Background Ring */}
              <circle className="kt-ring-bg" cx="50" cy="50" r="42" />

              {/* Animated Progress Ring */}
              <circle
                id="kt-ring-bar"
                className={`kt-ring-bar ${isReady ? "ready" : ""}`}
                cx="50"
                cy="50"
                r="42"
                style={{
                  strokeDashoffset: dashOffset,
                  stroke: isReady ? "url(#ktEmeraldCyanGrad)" : "url(#ktRoseVioletGrad)",
                }}
              />
            </svg>

            {/* Center Content */}
            <div id="kt-seconds-container" className="kt-seconds-txt">
              {isReady ? (
                <div className="kt-check-wrapper">
                  <svg
                    className="kt-check-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              ) : (
                <div className="kt-countdown-val">
                  <span className="kt-num">{seconds}</span>
                  <span className="kt-unit">SEC</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            id="kt-action-btn"
            className={isReady ? "kt-btn-ready" : "kt-btn-waiting"}
            type="button"
            disabled={!isReady}
            onClick={handleGetLink}
          >
            <span id="kt-btn-icon-box" className="kt-icon-box">
              {isReady ? (
                /* Download Cloud Vector Icon */
                <svg
                  className="kt-svg-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              ) : (
                /* High-tech Shield Lock Icon */
                <svg
                  className="kt-svg-icon kt-icon-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                  <path d="M12 11v3" />
                </svg>
              )}
            </span>
            <span id="kt-btn-label" className="kt-btn-txt">
              {isReady ? "Get Link Now" : "Verifying Link..."}
            </span>
            {isReady && (
              <span className="kt-btn-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            )}
          </button>

          {/* Micro Footer Note */}
          <div className="kt-footer-note">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Safe Gateway • High Speed Download</span>
          </div>
        </div>
      </div>

      {/* 2. POP-UP CSS STYLING */}
      <style>{`
        /* Overlay Background: transparent tint, pointer-events:none for 100% native smooth scroll */
        #kt-safelink-overlay {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(8, 12, 22, 0.35);
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
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Center Floating Card: Sleek Cyber Glassmorphism */
        .kt-safelink-box {
          background: rgba(13, 19, 33, 0.94);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 24px 26px 20px 26px;
          border-radius: 30px;
          box-shadow: 
            0 28px 75px -12px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.08),
            0 0 45px -10px rgba(99, 102, 241, 0.25);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 275px;
          box-sizing: border-box;
          position: relative;
          user-select: none;
          pointer-events: auto !important; /* Enables full clicks and interaction on the card */
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
          overflow: hidden;
        }

        .kt-safelink-box.is-ready {
          border-color: rgba(16, 185, 129, 0.35);
          box-shadow: 
            0 30px 80px -12px rgba(0, 0, 0, 0.85),
            0 0 0 1px rgba(16, 185, 129, 0.2),
            0 0 50px -10px rgba(16, 185, 129, 0.3);
        }

        /* Top Ambient Light Highlight */
        .kt-ambient-glow {
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent);
          pointer-events: none;
        }

        /* Cyber Shake Feedback */
        .kt-safelink-box.shake {
          animation: ktShake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          border-color: rgba(244, 63, 94, 0.6) !important;
          box-shadow: 
            0 25px 65px -10px rgba(0, 0, 0, 0.8),
            0 0 0 2px rgba(244, 63, 94, 0.5),
            0 0 35px rgba(244, 63, 94, 0.35) !important;
        }

        @keyframes ktShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-7px) rotate(-1deg); }
          30% { transform: translateX(6px) rotate(1deg); }
          45% { transform: translateX(-5px); }
          60% { transform: translateX(4px); }
          75% { transform: translateX(-2px); }
        }

        /* Security Header Badge */
        .kt-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.09);
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 16px;
        }

        .kt-badge-pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f43f5e;
          box-shadow: 0 0 8px #f43f5e;
          animation: ktRadarPulse 1.8s infinite ease-out;
        }

        .kt-badge-pulse.ready {
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        @keyframes ktRadarPulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }

        .kt-badge-txt {
          font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: rgba(241, 245, 249, 0.85);
        }

        /* Ring Container */
        .kt-ring-wrapper {
          position: relative;
          width: 118px;
          height: 118px;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kt-ring-outer-glow {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          pointer-events: none;
          animation: ktSlowSpin 24s linear infinite;
        }

        @keyframes ktSlowSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .kt-ring-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .kt-ring-bg {
          fill: rgba(15, 23, 42, 0.6);
          stroke: rgba(255, 255, 255, 0.08);
          stroke-width: 7.5;
        }

        .kt-ring-bar {
          fill: none;
          stroke-width: 7.5;
          stroke-linecap: round;
          stroke-dasharray: 264;
          transition: stroke-dashoffset 1s linear, stroke 0.35s ease;
          filter: drop-shadow(0 0 7px rgba(244, 63, 94, 0.55));
        }

        .kt-ring-bar.ready {
          filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.7));
        }

        /* Seconds & Checkmark Container */
        .kt-seconds-txt {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-outfit), var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          user-select: none;
        }

        .kt-countdown-val {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .kt-num {
          font-size: 38px;
          font-weight: 800;
          color: #ffffff;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.03em;
          text-shadow: 0 2px 14px rgba(244, 63, 94, 0.4);
        }

        .kt-unit {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.45);
          margin-top: 2px;
        }

        .kt-check-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: ktPopCheck 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes ktPopCheck {
          0% { transform: scale(0.4) rotate(-20deg); opacity: 0; }
          70% { transform: scale(1.18) rotate(5deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }

        .kt-check-icon {
          width: 44px;
          height: 44px;
          filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.75));
        }

        /* Action Pill Button */
        #kt-action-btn {
          border: none;
          border-radius: 9999px;
          padding: 13px 20px;
          font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 13.5px;
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
          position: relative;
          overflow: hidden;
        }

        .kt-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 0;
          flex-shrink: 0;
        }

        .kt-svg-icon {
          width: 16px;
          height: 16px;
          display: block;
        }

        .kt-btn-txt {
          flex: 1;
          text-align: center;
        }

        .kt-btn-arrow {
          display: flex;
          align-items: center;
          transition: transform 0.25s ease;
        }

        #kt-action-btn:hover .kt-btn-arrow {
          transform: translateX(3px);
        }

        /* Waiting State (Obsidian Glass + Rose Subtle Accent) */
        .kt-btn-waiting {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          color: rgba(226, 232, 240, 0.75) !important;
          cursor: wait !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .kt-btn-waiting::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.08),
            transparent
          );
          animation: ktShimmer 2.2s infinite;
        }

        @keyframes ktShimmer {
          100% { left: 100%; }
        }

        .kt-icon-spin {
          animation: ktPulseIcon 2s ease-in-out infinite;
        }

        @keyframes ktPulseIcon {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.12); opacity: 1; }
        }

        /* Ready State (Electric Emerald & Cyan Glow) */
        .kt-btn-ready {
          background: linear-gradient(135deg, #10b981 0%, #059669 60%, #0d9488 100%) !important;
          border: 1px solid rgba(255, 255, 255, 0.25) !important;
          color: #ffffff !important;
          cursor: pointer !important;
          box-shadow: 
            0 8px 25px rgba(16, 185, 129, 0.5),
            0 0 0 1px rgba(52, 211, 153, 0.2) !important;
          animation: ktPulseGlow 1.8s infinite ease-in-out;
        }

        .kt-btn-ready:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 60%, #0f766e 100%) !important;
          transform: translateY(-2px);
          box-shadow: 
            0 12px 30px rgba(16, 185, 129, 0.65),
            0 0 0 1px rgba(52, 211, 153, 0.35) !important;
        }

        .kt-btn-ready:active {
          transform: translateY(0);
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.45) !important;
        }

        @keyframes ktPulseGlow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.45);
          }
          50% {
            transform: scale(1.025);
            box-shadow: 0 12px 32px rgba(16, 185, 129, 0.7);
          }
        }

        /* Micro Footer Note */
        .kt-footer-note {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 14px;
          font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 10px;
          font-weight: 500;
          color: rgba(148, 163, 184, 0.7);
          letter-spacing: 0.02em;
        }
      `}</style>
    </>
  );
}
