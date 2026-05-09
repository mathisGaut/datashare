import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

export default function DashboardPage() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [files, setFiles] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);

    const [uploadMessage, setUploadMessage] = useState("");

    useEffect(() => {

        fetchUser();

        fetchFiles();

    }, []);

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

            const response = await api.get("/files");

            setFiles(response.data.data);

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
        <div>

            <h1>Dashboard</h1>

            {user && (
                <div>
                    <p>
                        Connected as: {user.email}
                    </p>

                    <button onClick={logout}>
                        Logout
                    </button>
                </div>
            )}

            <hr />

            <h2>Upload file</h2>

            <input
                type="file"
                onChange={(e) => {
                    setSelectedFile(e.target.files[0]);
                }}
            />

            <button onClick={uploadFile}>
                Upload
            </button>

            {uploadMessage && (
                <p>{uploadMessage}</p>
            )}

            <hr />

            <h2>Your files</h2>

            {files.length === 0 ? (
                <p>No files found</p>
            ) : (

                <ul>

                    {files.map(file => (

                        <li key={file.id}>

                            <p>
                                <strong>{file.original_name}</strong>
                            </p>

                            <p>
                                Size: {(file.size / 1024).toFixed(2)} KB
                            </p>

                            <p>
                                Uploaded on :
                                {" "}
                                {new Date(file.created_at).toLocaleString()}
                            </p>

                            <p>
                                Download:
                                {" "}

                                <a
                                    href={`http://localhost/api/files/download/${file.token}`}
                                    target="_blank"
                                >
                                    Link
                                </a>
                            </p>

                            <button
                                onClick={() => deleteFile(file.id)}
                            >
                                Delete
                            </button>

                            <hr />

                        </li>
                    ))}

                </ul>
            )}

        </div>
    );
}