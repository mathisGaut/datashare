import {
    Link as LinkIcon,
    Trash as TrashIcon,
    Check as CheckIcon,
    Edit as EditIcon,
} from "lucide-react";

export default function FileCard({
    file,
    copiedToken,
    copyLink,
    openEditModal,
    deleteFile,
}) {

    return (
        <div className="bg-white rounded-2xl shadow p-5 flex flex-col justify-between">

            <div className="flex justify-between items-start">

                <div>

                    <h3 className="font-semibold text-lg text-gray-800 break-all">
                        {file.original_name}
                    </h3>

                    <p className="text-gray-500 text-sm mt-2">
                        {(file.size / 1024).toFixed(2)} KB
                    </p>

                    <p className="text-gray-400 text-sm mt-1">
                        Uploaded : {
                            file.created_at
                                ? file.created_at.replace("T", " ").slice(0, 16)
                                : "Never"
                        }
                    </p>

                    <p className="text-gray-400 text-sm mt-1">
                        Expiration : {
                            file.expires_at
                                ? file.expires_at.replace("T", " ").slice(0, 16)
                                : "Never"
                        }
                    </p>

                </div>

                <button
                    onClick={() => copyLink(file.token)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                    title="Copy link"
                >

                    {copiedToken === file.token ? (
                        <CheckIcon
                            size={18}
                            className="text-green-600"
                        />
                    ) : (
                        <LinkIcon
                            size={18}
                            className="text-gray-700"
                        />
                    )}

                </button>

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
                    onClick={() => openEditModal(file)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded-lg transition cursor-pointer"
                >
                    <EditIcon
                        size={18}
                        className="text-white"
                    />
                </button>

                <button
                    onClick={() => deleteFile(file.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg transition cursor-pointer"
                >
                    <TrashIcon
                        size={18}
                        className="text-white"
                    />
                </button>

            </div>

        </div>
    );
}