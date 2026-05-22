import { useState } from "react";

import api from "../services/api";

export default function useFiles() {

    const [files, setFiles] = useState([]);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [lastPage, setLastPage] = useState(1);

    const [selectedFile, setSelectedFile] = useState(null);

    const [uploadMessage, setUploadMessage] = useState("");

    const [uploadProgress, setUploadProgress] = useState(0);

    const [dragActive, setDragActive] = useState(false);

    const [copiedToken, setCopiedToken] = useState(null);

    const [editingFile, setEditingFile] = useState(null);

    const [editName, setEditName] = useState("");

    const [editExpiration, setEditExpiration] = useState("");

    const fetchFiles = async () => {

        try {

            const response = await api.get("/files", {
                params: {
                    search,
                    page: currentPage,
                    per_page: 100,
                },
            });

            setFiles(response.data.data);

            setLastPage(response.data.last_page);

        } catch (error) {

            console.error(error);
        }
    };

    const uploadFile = async (fileToUpload = null) => {

        const file = fileToUpload || selectedFile;

        if (!file) {
            return;
        }

        const formData = new FormData();

        formData.append("file", file);

        try {

            setUploadProgress(0);

            const response = await api.post(
                "/files",
                formData,
                {
                    onUploadProgress: (progressEvent) => {

                        const percent = Math.round(
                            (progressEvent.loaded * 100)
                            / progressEvent.total
                        );

                        setUploadProgress(percent);
                    },
                }
            );

            setUploadMessage("Fichier ajouté avec succès");

            setTimeout(() => {
                setUploadMessage("");
            }, 3000);

            setSelectedFile(null);

            fetchFiles();

            setTimeout(() => {
                setUploadProgress(0);
            }, 1500);

        } catch (error) {

            console.error(error);

            setUploadMessage("Échec de l'ajout du fichier");
        }
    };

    const deleteFile = async (id) => {

        const confirmed = window.confirm(
            "Supprimer ce fichier ?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(`/files/${id}`);

            fetchFiles();

        } catch (error) {

            console.error(error);
        }
    };

    const openEditModal = (file) => {

        const extension = file.original_name.includes(".")
            ? "." + file.original_name.split(".").pop()
            : "";

        const baseName = file.original_name.replace(extension, "");

        setEditingFile(file);

        setEditName(baseName);

        setEditExpiration(
            file.expires_at
                ? new Date(file.expires_at)
                    .toISOString()
                    .slice(0, 16)
                : ""
        );
    };

    const saveFileEdit = async () => {

        if (!editingFile) {
            return;
        }

        const extension = editingFile.original_name.includes(".")
            ? "." + editingFile.original_name.split(".").pop()
            : "";

        try {

            await api.put(`/files/${editingFile.id}`, {
                original_name: `${editName}${extension}`,
                expires_at: editExpiration || null,
            });

            setEditingFile(null);

            fetchFiles();

        } catch (error) {

            console.error(error);
        }
    };

    const copyLink = async (token) => {

        const url = `http://localhost/api/files/download/${token}`;

        try {

            await navigator.clipboard.writeText(url);

            setCopiedToken(token);

            setTimeout(() => {
                setCopiedToken(null);
            }, 2000);

        } catch (error) {

            console.error(error);
        }
    };

    const handleDrop = async (e) => {

        e.preventDefault();

        setDragActive(false);

        const file = e.dataTransfer.files[0];

        if (file) {
            uploadFile(file);
        }
    };

    const handleDragOver = (e) => {

        e.preventDefault();

        setDragActive(true);
    };

    const handleDragLeave = () => {

        setDragActive(false);
    };

    return {
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
    };
}