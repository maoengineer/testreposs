"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

interface Settings {
  siteName: string;
  tagline: string;
  twitter: string;
  github: string;
  contactEmail: string;
  maintenanceMode: boolean;
  googleAnalytics: string;
  footerText: string;
  adminEmail?: string;
  adminPass?: string;
}

const defaults: Settings = {
  siteName: "iUseTools",
  tagline: "Free Online File Conversion Tools",
  twitter: "",
  github: "",
  contactEmail: "hello@iusetools.site",
  maintenanceMode: false,
  googleAnalytics: "",
  footerText: "© 2025 iUseTools. All rights reserved.",
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ciq_settings");
    if (stored) setSettings({ ...defaults, ...JSON.parse(stored) });
  }, []);

  const update = (key: keyof Settings, val: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  const save = () => {
    localStorage.setItem("ciq_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Field = ({ label, id, value, onChange, placeholder, type = "text" }: {
    label: string; id: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
  }) => (
    <div>
      <label htmlFor={id} className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 block">{label}</label>
      <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors" />
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-2xl">
        <div>
          <h2 className="text-2xl font-bold text-white">Site Settings</h2>
          <p className="text-slate-400 text-sm mt-1">Configure your iUseTools site preferences</p>
        </div>

        {/* General */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
          <h3 className="font-semibold text-white border-b border-slate-800 pb-3">General</h3>
          <Field label="Site Name" id="site-name" value={settings.siteName} onChange={v => update("siteName", v)} placeholder="iUseTools" />
          <Field label="Tagline" id="tagline" value={settings.tagline} onChange={v => update("tagline", v)} placeholder="Free Online File Conversion Tools" />
          <Field label="Contact Email" id="contact-email" value={settings.contactEmail} onChange={v => update("contactEmail", v)} type="email" placeholder="hello@example.com" />
          <Field label="Footer Text" id="footer-text" value={settings.footerText} onChange={v => update("footerText", v)} placeholder="© 2025 iUseTools" />
        </div>

        {/* Social */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
          <h3 className="font-semibold text-white border-b border-slate-800 pb-3">Social & Analytics</h3>
          <Field label="Twitter / X URL" id="twitter" value={settings.twitter} onChange={v => update("twitter", v)} placeholder="https://x.com/yourhandle" />
          <Field label="GitHub URL" id="github" value={settings.github} onChange={v => update("github", v)} placeholder="https://github.com/yourrepo" />
          <Field label="Google Analytics ID" id="ga-id" value={settings.googleAnalytics} onChange={v => update("googleAnalytics", v)} placeholder="G-XXXXXXXXXX" />
        </div>

        {/* Maintenance Mode */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
          <h3 className="font-semibold text-white border-b border-slate-800 pb-3 mb-4">Maintenance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Maintenance Mode</p>
              <p className="text-xs text-slate-400 mt-0.5">Show a maintenance page to all visitors</p>
            </div>
            <button onClick={() => update("maintenanceMode", !settings.maintenanceMode)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                settings.maintenanceMode ? "bg-red-600" : "bg-slate-700"
              }`}>
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                settings.maintenanceMode ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>
          {settings.maintenanceMode && (
            <div className="mt-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 text-xs">
              ⚠️ Maintenance mode is ON. Visitors will see a maintenance page.
            </div>
          )}
        </div>

        {/* Security / Admin Login */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
          <h3 className="font-semibold text-white border-b border-slate-800 pb-3">Admin Login Credentials</h3>
          <p className="text-slate-400 text-xs">Set custom login credentials. If left blank, defaults will be used.</p>
          <Field label="Custom Admin Email" id="admin-email" value={settings.adminEmail || ""} onChange={v => update("adminEmail", v)} type="email" placeholder="Leave blank to use default" />
          <Field label="Custom Admin Password / Passcode" id="admin-pass" value={settings.adminPass || ""} onChange={v => update("adminPass", v)} placeholder="Leave blank to use default" type="password" />
        </div>

        <button onClick={save}
          className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-violet-500/20"
          id="save-settings">
          {saved ? "✅ Settings Saved!" : "Save Settings"}
        </button>
      </div>
    </AdminLayout>
  );
}
