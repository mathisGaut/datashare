export default function SearchBar({
    search,
    setSearch,
    setCurrentPage,
}) {

    return (
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
    );
}