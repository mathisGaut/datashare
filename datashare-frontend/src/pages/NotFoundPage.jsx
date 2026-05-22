import { Link } from "react-router-dom";

import useDocumentTitle from "../hooks/useDocumentTitle";

export default function NotFoundPage() {
  useDocumentTitle("Page introuvable");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#f3b08d] via-[#ea8c7d] to-[#e56b6f] px-5 py-6">
      <header className="flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-ds-ink">
          DataShare
        </Link>

        <Link
          to="/login"
          className="rounded-xl bg-ds-btn-dark px-4 py-2 text-sm font-medium text-white"
        >
          Se connecter
        </Link>
      </header>

      <main
        id="main-content"
        className="flex flex-1 flex-col items-center justify-center px-4 text-center"
      >
        <p className="text-6xl font-bold text-ds-ink" aria-hidden="true">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-ds-ink">
          Page introuvable
        </h1>
        <p className="mt-3 max-w-sm text-sm text-ds-ink">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <nav className="mt-8 flex flex-col gap-3 sm:flex-row" aria-label="Actions">
          <Link
            to="/"
            className="rounded-xl bg-ds-btn-dark px-6 py-3 text-sm font-medium text-white"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            to="/dashboard"
            className="rounded-xl border-2 border-ds-btn-dark px-6 py-3 text-sm font-medium text-ds-ink"
          >
            Mon espace
          </Link>
        </nav>
      </main>
    </div>
  );
}
