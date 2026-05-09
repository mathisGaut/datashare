import { useEffect } from "react";

import FileCard from "../components/FileCard";
import EditFileModal from "../components/EditFileModal";
import UploadBox from "../components/UploadBox";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import useAuth from "../hooks/useAuth";
import useFiles from "../hooks/useFiles";

export default function DashboardPage() {

    const { user, fetchUser, logout } = useAuth();
    const {
        files,
        search,
        setSearch,
        currentPage,
        setCurrentPage,
        lastPage,

        selectedFile,
        setSelectedFile,

        uploadMessage,
        uploadProgress,
        dragActive,
        copiedToken,

        editingFile,

        editName,
        setEditName,

        editExpiration,
        setEditExpiration,

        setEditingFile,

        fetchFiles,
        uploadFile,
        deleteFile,
        openEditModal,
        saveFileEdit,
        copyLink,
        handleDrop,
        handleDragOver,
        handleDragLeave,

    } = useFiles();

    // Fetch user on mount
    useEffect(() => {

        fetchUser();

    }, []);

    // Fetch files on search or page change
    useEffect(() => {

        fetchFiles();

    }, [search, currentPage]);

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <header className="bg-white shadow-sm">

                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            DataShare
                        </h1>

                        {user && (
                            <p className="text-gray-500 text-sm">
                                Connected as {user.name}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                    >
                        Logout
                    </button>

                </div>

            </header>

            <main className="max-w-6xl mx-auto p-6">

                {/* Upload Card */}
                <UploadBox
                    dragActive={dragActive}
                    handleDrop={handleDrop}
                    handleDragOver={handleDragOver}
                    handleDragLeave={handleDragLeave}
                    setSelectedFile={setSelectedFile}
                    uploadFile={uploadFile}
                    uploadMessage={uploadMessage}
                    uploadProgress={uploadProgress}
                />

                {/* Files */}
                <div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                        <h2 className="text-2xl font-semibold">
                            Your files
                        </h2>

                        <SearchBar
                            search={search}
                            setSearch={setSearch}
                            setCurrentPage={setCurrentPage}
                        />

                    </div>

                    {files.length === 0 ? (

                        <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">

                            No files uploaded yet

                        </div>

                    ) : (

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {files.map(file => (

                                <FileCard
                                    key={file.id}
                                    file={file}
                                    copiedToken={copiedToken}
                                    copyLink={copyLink}
                                    openEditModal={openEditModal}
                                    deleteFile={deleteFile}
                                />

                            ))}

                        </div>

                    )}

                </div>
                <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    setCurrentPage={setCurrentPage}
                />

                <EditFileModal
                    editingFile={editingFile}
                    editName={editName}
                    setEditName={setEditName}
                    editExpiration={editExpiration}
                    setEditExpiration={setEditExpiration}
                    setEditingFile={setEditingFile}
                    saveFileEdit={saveFileEdit}
                />
            </main>

        </div>
    );
}