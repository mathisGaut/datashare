import {
  ArrowRight,
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
}) {
  const Icon = FILE_ICONS[type] ?? FileImage;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-ds-peach bg-white px-4 py-3.5 lg:flex-row lg:items-center lg:justify-between lg:px-5 lg:py-4">
      <div className="flex min-w-0 items-center gap-3 lg:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ds-peach text-ds-salmon lg:h-11 lg:w-11">
          <Icon size={22} strokeWidth={1.75} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-ds-ink lg:text-base">
            {name}
          </h3>
          <p
            className={`mt-0.5 text-xs lg:text-sm ${
              isExpired ? "font-medium text-red-500" : "text-ds-muted"
            }`}
          >
            {statusText}
          </p>
        </div>

        {!isExpired && (
          <>
            <Lock
              size={16}
              className="shrink-0 text-ds-muted lg:hidden"
              aria-hidden
            />
            <div className="lg:hidden">
              <FileCardActionsMenu onDelete={onDelete} onAccess={onAccess} />
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
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-full border border-ds-salmon px-4 py-2 text-sm font-medium text-ds-salmon transition hover:bg-ds-peach"
          >
            <Trash2 size={16} strokeWidth={2} />
            Supprimer
          </button>

          <button
            type="button"
            onClick={onAccess}
            className="flex items-center gap-1.5 rounded-full border border-ds-salmon px-4 py-2 text-sm font-medium text-ds-salmon transition hover:bg-ds-peach"
          >
            Accéder
            <ArrowRight size={16} strokeWidth={2} />
          </button>
        </div>
      )}
    </article>
  );
}
