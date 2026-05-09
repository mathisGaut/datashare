import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link as LinkIcon, Trash as TrashIcon, Check as CheckIcon } from "lucide-react";

import api from "../services/api";

export default function DashboardPage() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [files, setFiles] = useState([]);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [lastPage, setLastPage] = useState(1);

    const [selectedFile, setSelectedFile] = useState(null);

    const [uploadMessage, setUploadMessage] = useState("");

    const [copiedToken, setCopiedToken] = useState(null);

    useEffect(() => {

        fetchUser();

    }, []);

    useEffect(() => {

        fetchFiles();

    }, [search, currentPage]);

    const fetchUser = async () => {

        try {

            const response = await api.get("/user");

            setUser(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    const fetchFiles = async () => {

        try {

            const response = await api.get("/files", {
                params: {
                    search: search,
                    page: currentPage,
                },
            });

            setFiles(response.data.data);

            setLastPage(response.data.last_page);

        } catch (error) {

            console.error(error);
        }
    };

    const uploadFile = async () => {

        if (!selectedFile) {
            return;
        }

        const formData = new FormData();

        formData.append("file", selectedFile);

        try {

            const response = await api.post(
                "/files",
                formData
            );

            setUploadMessage(response.data.message);

            setSelectedFile(null);

            fetchFiles();

        } catch (error) {

            console.error(error);

            setUploadMessage("Upload failed");
        }
    };

    const deleteFile = async (id) => {

        const confirmed = window.confirm(
            "Delete this file ?"
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

    const updateFile = async (file) => {

        const extension = file.original_name.includes(".")
            ? "." + file.original_name.split(".").pop()
            : "";

        const baseName = file.original_name.replace(extension, "");

        const newBaseName = prompt(
            "New filename",
            baseName
        );

        if (!newBaseName) {
            return;
        }

        const finalName = `${newBaseName}${extension}`;

        try {

            await api.put(`/files/${file.id}`, {
                original_name: finalName,
            });

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

    const logout = async () => {

        try {
            await api.post("/logout");
        } catch (error) {
            console.error(error);
        }

        localStorage.removeItem("token");

        navigate("/login");
    };

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
                <div className="bg-white rounded-2xl shadow p-6 mb-8">

                    <h2 className="text-2xl font-semibold mb-4">
                        Upload file
                    </h2>

                    <div className="flex flex-col md:flex-row gap-4 items-center">

                        <input
                            type="file"
                            onChange={(e) => {
                                setSelectedFile(e.target.files[0]);
                            }}
                            className="block w-full border rounded-lg p-2"
                        />

                        <button
                            onClick={uploadFile}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                        >
                            Upload
                        </button>

                    </div>

                    {uploadMessage && (
                        <p className="mt-4 text-green-600">
                            {uploadMessage}
                        </p>
                    )}

                </div>

                {/* Files */}
                <div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                        <h2 className="text-2xl font-semibold">
                            Your files
                        </h2>

                        <input
                            type="text"
                            placeholder="Search files..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border rounded-lg px-4 py-2 bg-white"
                        />

                    </div>

                    {files.length === 0 ? (

                        <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">

                            No files uploaded yet

                        </div>

                    ) : (

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {files.map(file => (

                                <div
                                    key={file.id}
                                    className="bg-white rounded-2xl shadow p-5 flex flex-col justify-between"
                                >

                                    <div className="flex justify-between items-start">
                                        <div>

                                            <h3 className="font-semibold text-lg text-gray-800 break-all">
                                                {file.original_name}
                                            </h3>

                                            <p className="text-gray-500 text-sm mt-2">
                                                {(file.size / 1024).toFixed(2)} KB
                                            </p>

                                            <p className="text-gray-400 text-sm mt-1">
                                                {new Date(file.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => copyLink(file.token)}
                                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                                            title="Copier le lien"
                                        >
                                            {copiedToken === file.token ? (
                                                <CheckIcon size={18} className="text-green-600" />
                                            ) : (
                                                <LinkIcon size={18} className="text-gray-700" />
                                            )}                                        </button>
                                    </div>

                                    <div className="flex flex-row gap-2 mt-6">
                                        <a
                                            href={`http://localhost/api/files/download/${file.token}`}
                                            target="_blank"
                                            className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                                        >
                                            Download
                                        </a>

                                        <button
                                            onClick={() => updateFile(file)}
                                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition"
                                        >
                                            Rename
                                        </button>

                                        <button
                                            onClick={() => deleteFile(file.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg transition cursor-pointer"
                                        >
                                            <TrashIcon size={18} className="text-white" />
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>
                <div className="flex justify-center items-center gap-4 mt-10">

                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="font-medium">
                        Page {currentPage} / {lastPage}
                    </span>

                    <button
                        disabled={currentPage === lastPage}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>

                </div>

            </main>

        </div>
    );
}