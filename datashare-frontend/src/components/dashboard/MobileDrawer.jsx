import { X } from "lucide-react";

import SidebarContent from "./SidebarContent";

export default function MobileDrawer({
  isOpen,
  onClose,
  onAddFiles,
  onLogout,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Fermer le menu"
        onClick={onClose}
      />

      <aside className="relative flex h-full w-[85%] max-w-sm flex-col bg-gradient-to-b from-ds-sidebar-top to-ds-sidebar-bottom px-6 py-8 shadow-xl">
        <div className="mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="text-white"
            aria-label="Fermer"
          >
            <X size={28} strokeWidth={2} />
          </button>
          <span className="text-2xl font-bold text-white">DataShare</span>
        </div>

        <SidebarContent showBrand={false} onNavigate={onClose} />

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => {
              onAddFiles();
              onClose();
            }}
            className="w-full rounded-xl bg-ds-btn-dark py-3 text-sm font-medium text-white"
          >
            Ajouter des fichiers
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-xl border border-white/40 py-3 text-sm font-medium text-white"
          >
            Déconnexion
          </button>
        </div>
      </aside>
    </div>
  );
}
