export default function UploadBox({
    dragActive,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    setSelectedFile,
    selectedFile,
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

            <div className="flex flex-col gap-4">

                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">

                    <label
                        className="
            flex items-center justify-center gap-2
            px-5 py-3
            bg-white border border-gray-300
            rounded-xl cursor-pointer
            hover:border-blue-500 hover:bg-blue-50
            transition shadow-sm
            min-w-[180px]
        "
                    >
                        <i className="fa-solid fa-paperclip text-blue-600"></i>

                        <span className="font-medium text-gray-700">
                            Select file
                        </span>

                        <input
                            type="file"
                            onChange={(e) => {
                                setSelectedFile(e.target.files[0]);
                            }}
                            className="hidden"
                        />
                    </label>

                    <div
                        className="
            flex-1 px-4 py-3
            bg-gray-50 border border-gray-200
            rounded-xl text-sm text-gray-600
            truncate
        "
                    >
                        {selectedFile
                            ? selectedFile.name
                            : "No file selected"}
                    </div>

                    <button
                        onClick={() => uploadFile(selectedFile)}
                        disabled={!selectedFile}
                        className="
            px-6 py-3 rounded-xl
            bg-blue-600 text-white font-medium
            hover:bg-blue-700
            disabled:bg-gray-300
            disabled:cursor-not-allowed
            transition shadow-sm
        "
                    >
                        Upload
                    </button>

                </div>

                {uploadMessage && (
                    <p className="text-sm text-green-600 font-medium">
                        {uploadMessage}
                    </p>
                )}

            </div>

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