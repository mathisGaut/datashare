export default function UploadBox({
    dragActive,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    setSelectedFile,
    uploadFile,
    uploadMessage,
    uploadProgress,
}) {

    return (
        <div
            className={`
                bg-white rounded-2xl shadow p-6 mb-8 border-2 border-dashed transition
                ${dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >

            <h2 className="text-2xl font-semibold mb-4">
                Upload file
            </h2>

            <p className="text-gray-500 mb-4">
                Drag & drop a file here or select one manually
            </p>

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

            {uploadProgress > 0 && (

                <div className="mt-4">

                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">

                        <div
                            className="bg-blue-500 h-4 transition-all"
                            style={{
                                width: `${uploadProgress}%`
                            }}
                        />

                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                        Uploading... {uploadProgress}%
                    </p>

                </div>
            )}

        </div>
    );
}