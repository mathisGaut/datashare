const FILTERS = [
  { id: "tous", label: "Tous" },
  { id: "actifs", label: "Actifs" },
  { id: "expire", label: "Expiré" },
];

export default function FileFilterTabs({
  activeFilter,
  onFilterChange,
  panelId = "files-panel",
}) {
  return (
    <div
      role="tablist"
      aria-label="Filtrer les fichiers"
      className="flex w-full gap-1 rounded-full bg-ds-peach p-1 lg:w-auto lg:gap-3 lg:bg-transparent lg:p-0"
    >
      {FILTERS.map(({ id, label }) => {
        const isActive = activeFilter === id;
        const tabId = `filter-tab-${id}`;

        return (
          <button
            key={id}
            id={tabId}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onFilterChange(id)}
            className={`flex-1 rounded-full px-3 py-2.5 text-center text-sm font-semibold transition lg:flex-none lg:px-6 ${isActive
              ? "bg-orange-800 text-white shadow-sm"
              : "bg-transparent text-orange-800 lg:bg-ds-peach lg:hover:bg-ds-peach/80 cursor-pointer"
              }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
