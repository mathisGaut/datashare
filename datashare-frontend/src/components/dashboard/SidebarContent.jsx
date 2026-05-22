export default function SidebarContent({
  onNavigate,
  showBrand = true,
}) {
  return (
    <>
      {showBrand && (
        <h1 className="text-2xl font-bold tracking-tight text-white">
          DataShare
        </h1>
      )}

      <nav className={showBrand ? "mt-10" : "mt-2"}>
        <button
          type="button"
          onClick={onNavigate}
          className="inline-block rounded-full bg-ds-peach/90 px-5 py-2.5 text-sm font-semibold text-ds-ink"
        >
          Mes fichiers
        </button>
      </nav>
    </>
  );
}
