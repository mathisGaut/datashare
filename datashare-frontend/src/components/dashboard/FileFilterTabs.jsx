const FILTERS = [
  { id: "tous", label: "Tous" },
  { id: "actifs", label: "Actifs" },
  { id: "expire", label: "Expiré" },
];

export default function FileFilterTabs({ activeFilter, onFilterChange }) {
  return (
    <div className="flex w-full gap-1 rounded-full bg-ds-peach p-1 lg:w-auto lg:gap-3 lg:bg-transparent lg:p-0">
      {FILTERS.map(({ id, label }) => {
        const isActive = activeFilter === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onFilterChange(id)}
            className={`flex-1 rounded-full px-3 py-2 text-center text-sm font-semibold transition lg:flex-none lg:px-6 ${isActive
                ? "bg-ds-salmon text-white shadow-sm"
                : "bg-transparent text-ds-salmon lg:bg-ds-peach lg:hover:bg-ds-peach/80 cursor-pointer"
              }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
