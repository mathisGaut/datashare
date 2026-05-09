export default function Pagination({
    currentPage,
    lastPage,
    setCurrentPage,
}) {

    return (
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
    );
}