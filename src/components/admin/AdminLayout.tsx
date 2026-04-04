"use client";
import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/tools", label: "Tools", icon: "🔧" },
  { href: "/admin/messages", label: "Messages", icon: "💬" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("ciq_admin");
    if (!auth) { router.replace("/admin/login"); }
    else setChecked(true);
  }, [router]);

  const logout = () => {
    sessionStorage.removeItem("ciq_admin");
    router.replace("/admin/login");
  };

  if (!checked) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-white">Loading…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ${sideOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">C</div>
            <span className="font-bold text-white">iUseTools <span className="text-slate-400 font-normal text-xs">Admin</span></span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(n => {
            const active = pathname === n.href;
            return (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-violet-600/20 text-violet-300 border border-violet-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}>
                <span>{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">A</div>
            <div>
              <p className="text-xs font-semibold text-white">Admin</p>
              <p className="text-xs text-slate-500">najamao232@gmail.com</p>
            </div>
          </div>
          <button onClick={logout}
            className="w-full text-xs text-slate-400 hover:text-red-400 transition-colors py-2 rounded-lg hover:bg-red-400/10 font-medium">
            🚪 Logout
          </button>
          <Link href="/" className="block w-full text-xs text-slate-400 hover:text-slate-200 transition-colors py-2 rounded-lg hover:bg-slate-800 font-medium text-center mt-1">
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sideOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSideOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSideOpen(!sideOpen)} className="lg:hidden text-slate-400 hover:text-white">☰</button>
          <h1 className="font-semibold text-white capitalize">
            {NAV.find(n => n.href === pathname)?.label || "Admin"}
          </h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
