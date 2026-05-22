import { Component } from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#f3b08d] via-[#ea8c7d] to-[#e56b6f] px-5 py-12 text-center">
          <h1 className="text-2xl font-bold text-ds-ink">
            Une erreur est survenue
          </h1>
          <p className="mt-4 max-w-md text-sm text-ds-ink">
            Rechargez la page ou revenez à l&apos;accueil. Si le problème
            persiste, contactez le support.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-ds-btn-dark px-6 py-3 text-sm font-medium text-white"
            >
              Recharger
            </button>
            <Link
              to="/"
              className="rounded-xl border-2 border-ds-btn-dark px-6 py-3 text-sm font-medium text-ds-ink"
            >
              Accueil
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
