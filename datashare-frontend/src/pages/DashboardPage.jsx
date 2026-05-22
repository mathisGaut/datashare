import { useEffect, useRef, useState } from "react";

import FileCard from "../components/dashboard/FileCard";
import FileFilterTabs from "../components/dashboard/FileFilterTabs";
import Layout from "../components/dashboard/Layout";
import useAuth from "../hooks/useAuth";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useFiles from "../hooks/useFiles";
import {
  filterFilesByTab,
  getExpirationStatus,
  getFileType,
  getSharePageUrl,
} from "../utils/fileDisplay";

export default function DashboardPage() {
  useDocumentTitle("Mes fichiers");

  const { user, userError, fetchUser, logout } = useAuth();
  const {
    files,
    filesError,
    fetchFiles,
    uploadFile,
    deleteFile,
    uploadMessage,
    copyLink,
    copiedToken,
  } = useFiles();

  const [activeFilter, setActiveFilter] = useState("tous");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUser();
    fetchFiles();
    // Chargement initial uniquement au montage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleFiles = filterFilesByTab(files, activeFilter);
  const activeTabId = `filter-tab-${activeFilter}`;

  const handleAddFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      uploadFile(file);
    }

    event.target.value = "";
  };

  return (
    <Layout
      onLogout={logout}
      onAddFiles={handleAddFiles}
      userName={user?.name}
    >
      <label htmlFor="file-upload" className="sr-only">
        Ajouter des fichiers
      </label>

      <input
        id="file-upload"
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelected}
        accept="*/*"
      />

      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl font-bold text-ds-ink lg:text-3xl">
          Mes fichiers
        </h1>
      </div>

      {userError && (
        <p
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {userError}
        </p>
      )}

      <div className="mb-6 lg:mb-8">
        <FileFilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {uploadMessage && (
        <p
          className="mb-6 rounded-xl border border-ds-peach bg-ds-peach-light px-4 py-3 text-sm text-ds-ink"
          role="status"
          aria-live="polite"
        >
          {uploadMessage}
        </p>
      )}

      {filesError && (
        <p
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {filesError}
        </p>
      )}

      <section
        id="files-panel"
        role="tabpanel"
        aria-labelledby={activeTabId}
        aria-live="polite"
      >
        {visibleFiles.length === 0 ? (
          <p className="rounded-2xl border border-ds-peach bg-white px-6 py-10 text-center text-sm text-ds-muted lg:text-base">
            {files.length === 0
              ? "Aucun fichier pour le moment. Ajoutez-en via le menu ou le bouton ci-dessus."
              : "Aucun fichier dans cette catégorie."}
          </p>
        ) : (
          <ul className="flex list-none flex-col gap-3 lg:gap-4">
            {visibleFiles.map((file) => {
              const { isExpired, statusText } = getExpirationStatus(
                file.expires_at,
              );

              return (
                <li key={file.id}>
                  <FileCard
                    name={file.original_name}
                    type={getFileType(file.mime_type, file.original_name)}
                    statusText={statusText}
                    isExpired={isExpired}
                    onDelete={() => deleteFile(file.id)}
                    onCopyLink={() => copyLink(file.token)}
                    linkCopied={copiedToken === file.token}
                    onAccess={() =>
                      window.open(getSharePageUrl(file.token), "_blank", "noopener,noreferrer")
                    }
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </Layout>
  );
}
