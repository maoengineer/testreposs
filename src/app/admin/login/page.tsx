"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "najamao232@gmail.com";
const ADMIN_PASS = "@PEAK_Brosmao2026";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Simulate a small delay for UX
    await new Promise(r => setTimeout(r, 600));
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASS) {
      sessionStorage.setItem("ciq_admin", "1");
      router.replace("/admin/dashboard");
    } else {
      setError("Invalid email or password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-2xl shadow-violet-500/30 mb-4">
            <span className="text-white text-2xl font-black">C</span>
          </div>
          <h1 className="text-2xl font-bold text-white">iUseTools Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to manage your site</p>
        </div>

        {/* Card */}
        <form onSubmit={handleLogin}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-5">
          
          <div>
            <label htmlFor="admin-email" className="text-xs font-semibold text-slate-400 mb-2 block uppercase tracking-wide">
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="text-xs font-semibold text-slate-400 mb-2 block uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs">
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 p-3 text-sm text-center">
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            id="admin-login-btn"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-violet-500/20">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Signing in…
              </span>
            ) : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-6">
          &copy; 2025 iUseTools Admin Panel
        </p>
      </div>
    </div>
  );
}
