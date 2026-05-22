import {
  ArrowRight,
  Copy,
  FileAudio,
  FileImage,
  FileVideo,
  Lock,
  Trash2,
} from "lucide-react";

import FileCardActionsMenu from "./FileCardActionsMenu";

const FILE_ICONS = {
  image: FileImage,
  audio: FileAudio,
  video: FileVideo,
};

export default function FileCard({
  name,
  type = "image",
  statusText,
  isExpired = false,
  onDelete,
  onAccess,
  onCopyLink,
  linkCopied = false,
}) {
  const Icon = FILE_ICONS[type] ?? FileImage;

  return (
    <article
      className="flex flex-col gap-4 rounded-2xl border border-ds-peach bg-white px-4 py-3.5 lg:flex-row lg:items-center lg:justify-between lg:px-5 lg:py-4"
      aria-label={`Fichier : ${name}`}
    >
      <div className="flex min-w-0 items-center gap-3 lg:gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ds-peach text-ds-salmon lg:h-11 lg:w-11"
          aria-hidden="true"
        >
          <Icon size={22} strokeWidth={1.75} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-ds-ink lg:text-base">
            {name}
          </h3>
          <p
            className={`mt-0.5 text-xs lg:text-sm ${isExpired ? "font-medium text-red-500" : "text-ds-muted"
              }`}
          >
            {statusText}
          </p>
        </div>

        {!isExpired && (
          <>
            <span className="shrink-0 text-ds-muted lg:hidden" aria-label="Fichier protégé">
              <Lock size={16} aria-hidden="true" />
            </span>
            <div className="lg:hidden">
              <FileCardActionsMenu
                onDelete={onDelete}
                onAccess={onAccess}
                onCopyLink={onCopyLink}
                linkCopied={linkCopied}
              />
            </div>
          </>
        )}
      </div>

      {isExpired ? (
        <p className="hidden shrink-0 text-right text-xs leading-relaxed text-ds-muted lg:block lg:max-w-[280px]">
          Ce fichier à expiré, il n&apos;est plus stocké chez nous
        </p>
      ) : (
        <div className="hidden shrink-0 items-center justify-end gap-3 lg:flex">
          <button
            type="button"
            onClick={onCopyLink}
            aria-live="polite"
            className="flex min-h-11 items-center gap-1.5 rounded-full border border-orange-700 text-orange-700 px-4 py-2 text-sm font-medium transition hover:bg-orange-100"
          >
            <Copy size={16} strokeWidth={2} aria-hidden="true" />
            {linkCopied ? "Lien copié" : "Copier le lien"}
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex min-h-11 items-center gap-1.5 rounded-full border border-orange-700 text-orange-700 px-4 py-2 text-sm font-medium transition hover:bg-orange-100"
          >
            <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
            Supprimer
          </button>

          <button
            type="button"
            onClick={onAccess}
            className="flex min-h-11 items-center gap-1.5 rounded-full border border-orange-700 text-orange-700 px-4 py-2 text-sm font-medium transition hover:bg-orange-100"
          >
            Accéder
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      )}
    </article>
  );
}
