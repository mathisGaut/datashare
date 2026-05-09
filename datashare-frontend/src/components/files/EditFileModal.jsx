export default function EditFileModal({
    editingFile,
    editName,
    setEditName,
    editExpiration,
    setEditExpiration,
    setEditingFile,
    saveFileEdit,
}) {

    if (!editingFile) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

                <h2 className="text-2xl font-bold mb-6">
                    Edit file
                </h2>

                <div className="space-y-4">

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Filename
                        </label>

                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Expiration date
                        </label>

                        <input
                            type="datetime-local"
                            value={editExpiration}
                            onChange={(e) => setEditExpiration(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2"
                        />

                    </div>

                </div>

                <div className="flex justify-end gap-3 mt-8">

                    <button
                        onClick={() => setEditingFile(null)}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={saveFileEdit}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                    >
                        Save
                    </button>

                </div>

            </div>

        </div>
    );
}