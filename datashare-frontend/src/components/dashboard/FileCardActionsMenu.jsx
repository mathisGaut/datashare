import { useEffect, useRef, useState } from "react";
import { ArrowRight, Copy, MoreVertical, Trash2 } from "lucide-react";

export default function FileCardActionsMenu({
  onDelete,
  onAccess,
  onCopyLink,
  linkCopied = false,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-ds-peach bg-white text-ds-ink"
        aria-label="Actions du fichier"
        aria-expanded={open}
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-10 min-w-[160px] overflow-hidden rounded-xl border border-ds-peach bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              onCopyLink();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-ds-ink hover:bg-ds-peach-light cursor-pointer"
          >
            <Copy size={16} className="text-ds-salmon" />
            {linkCopied ? "Lien copié" : "Copier le lien"}
          </button>

          <button
            type="button"
            onClick={() => {
              onAccess();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-ds-ink hover:bg-ds-peach-light cursor-pointer"
          >
            <ArrowRight size={16} className="text-ds-salmon" />
            Accéder
          </button>

          <button
            type="button"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-ds-ink hover:bg-ds-peach-light cursor-pointer"
          >
            <Trash2 size={16} className="text-ds-salmon" />
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}
