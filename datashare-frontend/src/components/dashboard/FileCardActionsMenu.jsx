import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Copy, MoreVertical, Trash2 } from "lucide-react";

export default function FileCardActionsMenu({
  onDelete,
  onAccess,
  onCopyLink,
  linkCopied = false,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (!menuRef.current) {
        return;
      }

      const items = [
        ...menuRef.current.querySelectorAll('[role="menuitem"]'),
      ];

      const index = items.indexOf(document.activeElement);

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const next = items[(index + 1) % items.length] ?? items[0];
        next?.focus();
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        const prev =
          items[(index - 1 + items.length) % items.length] ?? items[0];
        prev?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    const firstItem = menuRef.current?.querySelector('[role="menuitem"]');
    firstItem?.focus();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-ds-peach bg-white text-ds-ink"
        aria-label="Actions du fichier"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
      >
        <MoreVertical size={18} aria-hidden="true" />
      </button>

      {open && (
        <ul
          id={menuId}
          role="menu"
          className="absolute right-0 top-12 z-10 min-w-[160px] list-none overflow-hidden rounded-xl border border-ds-peach bg-white py-1 shadow-lg"
        >
          <li role="none">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onCopyLink();
                setOpen(false);
                triggerRef.current?.focus();
              }}
              className="flex w-full min-h-11 items-center gap-2 px-4 py-2.5 text-left text-sm text-ds-ink hover:bg-ds-peach-light cursor-pointer"
            >
              <Copy size={16} className="text-ds-salmon" aria-hidden="true" />
              {linkCopied ? "Lien copié" : "Copier le lien"}
            </button>
          </li>

          <li role="none">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onAccess();
                setOpen(false);
                triggerRef.current?.focus();
              }}
              className="flex w-full min-h-11 items-center gap-2 px-4 py-2.5 text-left text-sm text-ds-ink hover:bg-ds-peach-light cursor-pointer"
            >
              <ArrowRight
                size={16}
                className="text-ds-salmon"
                aria-hidden="true"
              />
              Accéder
            </button>
          </li>

          <li role="none">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onDelete();
                setOpen(false);
                triggerRef.current?.focus();
              }}
              className="flex w-full min-h-11 items-center gap-2 px-4 py-2.5 text-left text-sm text-ds-ink hover:bg-ds-peach-light cursor-pointer"
            >
              <Trash2 size={16} className="text-ds-salmon" aria-hidden="true" />
              Supprimer
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
