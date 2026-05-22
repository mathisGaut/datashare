import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import SidebarContent from "./SidebarContent";

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function MobileDrawer({
  isOpen,
  onClose,
  onAddFiles,
  onLogout,
}) {
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    previousFocusRef.current = document.activeElement;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) {
        return;
      }

      const focusable = [
        ...drawerRef.current.querySelectorAll(FOCUSABLE),
      ].filter((el) => !el.disabled);

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

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

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        className="relative flex h-full w-[85%] max-w-sm flex-col bg-gradient-to-b from-ds-sidebar-top to-ds-sidebar-bottom px-6 py-8 shadow-xl"
      >
        <div className="mb-8 flex items-center gap-4">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="text-white"
            aria-label="Fermer le menu"
          >
            <X size={28} strokeWidth={2} aria-hidden="true" />
          </button>
          <span className="text-2xl font-bold text-white">DataShare</span>
        </div>

        <SidebarContent showBrand={false} />

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => {
              onAddFiles();
              onClose();
            }}
            className="w-full min-h-12 rounded-xl bg-ds-btn-dark py-3 text-sm font-medium text-white"
          >
            Ajouter des fichiers
          </button>

          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full min-h-12 rounded-xl border border-white/40 py-3 text-sm font-medium text-white"
          >
            Déconnexion
          </button>
        </div>
      </aside>
    </div>
  );
}
