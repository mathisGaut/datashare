import { useEffect, useRef, useState } from "react";

import FileCard from "../components/dashboard/FileCard";
import FileFilterTabs from "../components/dashboard/FileFilterTabs";
import Layout from "../components/dashboard/Layout";
import useAuth from "../hooks/useAuth";
import useFiles from "../hooks/useFiles";
import {
  filterFilesByTab,
  getDownloadUrl,
  getExpirationStatus,
  getFileType,
} from "../utils/fileDisplay";

export default function DashboardPage() {
  const { user, fetchUser, logout } = useAuth();
  const { files, fetchFiles, uploadFile, deleteFile, uploadMessage } =
    useFiles();

  const [activeFilter, setActiveFilter] = useState("tous");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUser();
    fetchFiles();
  }, []);

  const visibleFiles = filterFilesByTab(files, activeFilter);

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
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelected}
      />

      <div className="mb-6 lg:mb-8">
        <h2 className="text-2xl font-bold text-ds-ink lg:text-3xl">
          Mes fichiers
        </h2>
      </div>

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
        >
          {uploadMessage}
        </p>
      )}

      {visibleFiles.length === 0 ? (
        <p className="rounded-2xl border border-ds-peach bg-white px-6 py-10 text-center text-sm text-ds-muted lg:text-base">
          {files.length === 0
            ? "Aucun fichier pour le moment. Ajoutez-en via le menu ou le bouton ci-dessus."
            : "Aucun fichier dans cette catégorie."}
        </p>
      ) : (
        <div className="flex flex-col gap-3 lg:gap-4">
          {visibleFiles.map((file) => {
            const { isExpired, statusText } = getExpirationStatus(
              file.expires_at,
            );

            return (
              <FileCard
                key={file.id}
                name={file.original_name}
                type={getFileType(file.mime_type, file.original_name)}
                statusText={statusText}
                isExpired={isExpired}
                onDelete={() => deleteFile(file.id)}
                onAccess={() =>
                  window.open(getDownloadUrl(file.token), "_blank")
                }
              />
            );
          })}
        </div>
      )}
    </Layout>
  );
}
