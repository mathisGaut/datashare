import { LogOut, Menu } from "lucide-react";

import UserAvatar from "./UserAvatar";

export default function Header({
  onLogout,
  onAddFiles,
  onOpenMenu,
  userName,
}) {
  const displayName = userName ?? "Utilisateur";

  return (
    <>
      <header className="hidden items-center justify-end gap-6 border-b border-ds-peach/60 bg-ds-peach-light px-10 py-5 lg:flex">
        <button
          type="button"
          onClick={onAddFiles}
          className="min-h-11 rounded-xl bg-ds-btn-dark px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black cursor-pointer"
        >
          Ajouter des fichiers
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="flex min-h-11 items-center gap-2 text-sm font-medium text-orange-700 transition hover:text-orange-800 cursor-pointer"
        >
          <LogOut size={18} strokeWidth={2} aria-hidden="true" />
          Déconnexion
        </button>
      </header>

      <header className="flex items-center justify-between border-b border-ds-peach/60 bg-ds-peach-light px-4 py-4 lg:hidden">
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex min-h-11 min-w-11 items-center justify-center text-ds-ink"
          aria-label="Ouvrir le menu"
          aria-haspopup="dialog"
        >
          <Menu size={26} strokeWidth={2} aria-hidden="true" />
        </button>

        <div
          className="flex items-center gap-2"
          aria-label={`Connecté en tant que ${displayName}`}
        >
          <UserAvatar name={userName} />
          <span className="max-w-[140px] truncate text-sm font-semibold text-ds-ink">
            {displayName}
          </span>
        </div>
      </header>
    </>
  );
}
