export default function SidebarContent({ showBrand = true }) {
  return (
    <>
      {showBrand && (
        <p className="text-2xl font-bold tracking-tight text-white">
          <span className="sr-only">DataShare — </span>
          DataShare
        </p>
      )}

      <nav
        className={showBrand ? "mt-10" : "mt-2"}
        aria-label="Navigation principale"
      >
        <span
          aria-current="page"
          className="inline-block rounded-full bg-ds-peach/90 px-5 py-2.5 text-sm font-semibold text-ds-ink"
        >
          Mes fichiers
        </span>
      </nav>
    </>
  );
}
