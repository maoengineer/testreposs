"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ClientStateCheck() {
  const [maintenance, setMaintenance] = useState(false);
  const [hiddenTools, setHiddenTools] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // Determine if we are in maintenance mode
    const settingsStr = localStorage.getItem("ciq_settings");
    if (settingsStr) {
      try {
        const settings = JSON.parse(settingsStr);
        setMaintenance(settings.maintenanceMode === true);
      } catch (e) {}
    }

    // Determine hidden tools
    const hiddenStr = localStorage.getItem("ciq_hidden_tools");
    if (hiddenStr) {
      try {
        setHiddenTools(JSON.parse(hiddenStr));
      } catch (e) {}
    }
  }, []);

  const isAdminRoute = pathname?.startsWith("/admin");

  // If maintenance mode is active, block everything except the admin panel
  if (maintenance && !isAdminRoute) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl mb-6">
            <span className="text-4xl">🛠️</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Under Maintenance</h1>
          <p className="text-lg text-slate-400 max-w-md mx-auto">
            iUseTools is currently undergoing scheduled maintenance. We'll be back shortly.
          </p>
        </div>
      </div>
    );
  }

  // If tools are hidden, inject CSS to hide them visually everywhere (homepage, header, etc.)
  if (hiddenTools.length > 0 && !isAdminRoute) {
    return (
      <style suppressHydrationWarning dangerouslySetInnerHTML={{
        __html: hiddenTools.map(slug => `[href="/${slug}"], #tool-card-${slug} { display: none !important; }`).join('\\n')
      }} />
    );
  }

  return null;
}
