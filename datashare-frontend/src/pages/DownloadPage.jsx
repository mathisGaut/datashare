import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Download, FileImage, TriangleAlert } from "lucide-react";

import useDocumentTitle from "../hooks/useDocumentTitle";
import api from "../services/api";
import {
  formatFileSize,
  getApiDownloadUrl,
  getFileType,
} from "../utils/fileDisplay";

const FILE_ICONS = {
  image: FileImage,
};

const UNAVAILABLE_MESSAGE =
  "Désolé, le fichier que vous cherchez n'est pas disponible ou le lien a expiré";

export default function DownloadPage() {
  const { token } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const [unavailable, setUnavailable] = useState(!token);
  const [loading, setLoading] = useState(Boolean(token));

  useDocumentTitle(
    loading
      ? "Téléchargement"
      : unavailable
        ? "Fichier indisponible"
        : fileInfo?.original_name ?? "Téléchargement",
  );

  useEffect(() => {
    let cancelled = false;

    async function loadFile() {
      setLoading(true);
      setUnavailable(false);
      setFileInfo(null);

      try {
        const response = await api.get(`/files/share/${token}`);
        if (!cancelled) {
          setFileInfo(response.data.file);
        }
      } catch {
        if (!cancelled) {
          setUnavailable(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (token) {
      loadFile();
    }

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleDownload = () => {
    window.location.href = getApiDownloadUrl(token);
  };

  const Icon =
    FILE_ICONS[getFileType(fileInfo?.mime_type, fileInfo?.original_name)]
    ?? FileImage;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#f3b08d] via-[#ea8c7d] to-[#e56b6f] px-5 py-6">
      <header className="flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-ds-ink">
          DataShare
        </Link>

        <Link
          to="/login"
          className="min-h-11 inline-flex items-center rounded-xl bg-ds-btn-dark px-4 py-2 text-sm font-medium text-white"
        >
          Se connecter
        </Link>
      </header>

      <main
        id="main-content"
        className="flex flex-1 flex-col items-center justify-center px-2 py-10"
        aria-busy={loading}
      >
        <div className="w-full max-w-lg rounded-2xl bg-white px-6 py-8 shadow-lg sm:px-10 sm:py-10">
          {loading ? (
            <p
              className="text-center text-sm text-ds-muted"
              role="status"
              aria-live="polite"
            >
              Chargement…
            </p>
          ) : unavailable ? (
            <div role="alert">
              <h1 className="sr-only">Fichier indisponible</h1>
              <p className="text-center text-sm leading-relaxed text-ds-ink sm:text-base">
                {UNAVAILABLE_MESSAGE}
              </p>
            </div>
          ) : (
            <>
              <h1 className="mb-8 text-center text-xl font-bold text-ds-ink sm:text-2xl">
                Télécharger un fichier
              </h1>

              <div className="mb-8 flex items-start gap-4 rounded-xl">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  aria-hidden="true"
                >
                  <Icon size={38} strokeWidth={1.75} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="break-all text-sm font-bold text-ds-ink sm:text-base">
                    {fileInfo.original_name}
                  </p>
                  <p className="mt-1 text-sm text-ds-muted">
                    {formatFileSize(fileInfo.size)}
                  </p>
                </div>
              </div>

              <div
                className="mb-8 flex items-center justify-left gap-3 rounded-lg border border-ds-peach bg-ds-peach-light p-2 text-orange-800"
                role="note"
              >
                <TriangleAlert
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <p className="text-left text-sm text-orange-800">
                  Le fichier expirera le{" "}
                  <time dateTime={fileInfo.expires_at}>
                    {new Date(fileInfo.expires_at).toLocaleString("fr-FR")}
                  </time>
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-orange-600 bg-orange-100 py-2.5 text-orange-800 transition hover:bg-orange-200"
              >
                <Download size={22} strokeWidth={2} aria-hidden="true" />
                Télécharger le fichier
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
