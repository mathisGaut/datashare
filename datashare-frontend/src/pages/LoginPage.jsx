import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import useDocumentTitle from "../hooks/useDocumentTitle";
import api from "../services/api";

const inputClassName =
  "w-full min-h-12 px-4 py-2.5 rounded-lg border border-gray-400 text-ds-ink placeholder:text-gray-600 focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none transition";

const labelClassName = "block text-sm font-medium text-gray-900 mb-1";

export default function LoginPage() {
  useDocumentTitle("Connexion");

  const navigate = useNavigate();
  const location = useLocation();

  const registered = location.state?.registered;
  const redirectMessage = location.state?.message;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const response = await api.post("/login", form);

      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message || "Identifiants incorrects";

      setError(message);

      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#f3b08d] via-[#ea8c7d] to-[#e56b6f]">
      <header className="fixed top-6 left-4 right-4 sm:left-16 sm:right-auto">
        <Link
          to="/"
          className="text-3xl font-bold text-white drop-shadow-sm"
        >
          DataShare
        </Link>
      </header>

      <main
        id="main-content"
        className="flex flex-1 flex-col items-center justify-center px-4 py-12"
      >
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-white p-8 shadow">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-ds-ink">Connexion</h1>
            </div>

            {redirectMessage && (
              <div
                className="mb-6 rounded-lg border border-ds-peach bg-ds-peach-light px-4 py-3 text-sm text-ds-ink"
                role="status"
                aria-live="polite"
              >
                {redirectMessage}
              </div>
            )}

            {registered && (
              <div
                className="mb-6 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900"
                role="status"
              >
                Compte créé avec succès. Vous pouvez vous connecter.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              noValidate
              aria-describedby={error ? "login-error" : undefined}
            >
              <div>
                <label htmlFor="login-email" className={labelClassName}>
                  Email
                </label>

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Saisissez votre email..."
                  value={form.email}
                  onChange={handleChange}
                  className={inputClassName}
                  required
                  aria-invalid={Boolean(error)}
                  disabled={submitting}
                />
              </div>

              <div>
                <label htmlFor="login-password" className={labelClassName}>
                  Mot de passe
                </label>

                <input
                  id="login-password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Saisissez votre mot de passe..."
                  value={form.password}
                  onChange={handleChange}
                  className={inputClassName}
                  required
                  aria-invalid={Boolean(error)}
                  disabled={submitting}
                />
              </div>

              {error && (
                <p
                  id="login-error"
                  className="text-sm font-medium text-red-800"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-3 pt-1">
                <Link
                  to="/register"
                  className="flex min-h-12 w-full items-center justify-center rounded-lg border-2 border-orange-900 px-4 text-base font-medium text-orange-900 transition hover:bg-orange-50"
                >
                  Créer un compte
                </Link>

                <button
                  type="submit"
                  disabled={submitting}
                  aria-busy={submitting}
                  className="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-orange-900 px-4 text-base font-medium text-white transition hover:bg-orange-950 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Connexion…" : "Connexion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
