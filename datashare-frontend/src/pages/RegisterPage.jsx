import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useDocumentTitle from "../hooks/useDocumentTitle";
import api from "../services/api";

const inputClassName =
  "w-full min-h-12 px-4 py-2.5 rounded-lg border border-gray-400 text-ds-ink placeholder:text-gray-600 focus:ring-2 focus:ring-orange-800 focus:border-orange-800 outline-none transition";

const labelClassName = "block text-sm font-medium text-gray-900 mb-1";

export default function RegisterPage() {
  useDocumentTitle("Créer un compte");

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setFieldErrors({});

    if (form.password !== form.password_confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      navigate("/login", { state: { registered: true } });
    } catch (err) {
      const data = err.response?.data;

      if (data?.errors) {
        setFieldErrors(data.errors);
        setError("");
      } else {
        setError(
          data?.message
          || "Inscription impossible. Vérifiez vos informations.",
        );
      }

      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const firstError = (key) =>
    Array.isArray(fieldErrors[key]) ? fieldErrors[key][0] : fieldErrors[key];

  const fieldIds = {
    name: "register-name",
    email: "register-email",
    password: "register-password",
    password_confirmation: "register-password-confirmation",
  };

  const errorId = (key) => `${fieldIds[key]}-error`;

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
              <h1 className="text-2xl font-bold text-ds-ink">
                Créer un compte
              </h1>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              noValidate
              aria-describedby={error ? "register-error" : undefined}
            >
              {(["name", "email", "password", "password_confirmation"]).map(
                (field) => {
                  const labels = {
                    name: "Nom",
                    email: "Email",
                    password: "Mot de passe",
                    password_confirmation: "Confirmer le mot de passe",
                  };
                  const placeholders = {
                    name: "Saisissez votre nom...",
                    email: "Saisissez votre email...",
                    password: "Saisissez votre mot de passe...",
                    password_confirmation: "Saisissez-le à nouveau",
                  };
                  const types = {
                    name: "text",
                    email: "email",
                    password: "password",
                    password_confirmation: "password",
                  };
                  const autoComplete = {
                    name: "name",
                    email: "email",
                    password: "new-password",
                    password_confirmation: "new-password",
                  };
                  const err = firstError(field);

                  return (
                    <div key={field}>
                      <label
                        htmlFor={fieldIds[field]}
                        className={labelClassName}
                      >
                        {labels[field]}
                      </label>

                      <input
                        id={fieldIds[field]}
                        type={types[field]}
                        name={field}
                        autoComplete={autoComplete[field]}
                        placeholder={placeholders[field]}
                        value={form[field]}
                        onChange={handleChange}
                        className={inputClassName}
                        required
                        minLength={field === "password" ? 6 : undefined}
                        aria-invalid={Boolean(err)}
                        aria-describedby={err ? errorId(field) : undefined}
                        disabled={submitting}
                      />

                      {err && (
                        <p
                          id={errorId(field)}
                          className="mt-1 text-sm font-medium text-red-800"
                          role="alert"
                        >
                          {err}
                        </p>
                      )}
                    </div>
                  );
                },
              )}

              {error && (
                <p
                  id="register-error"
                  className="text-sm font-medium text-red-800"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-3 pt-1">
                <Link
                  to="/login"
                  className="flex min-h-12 w-full items-center justify-center rounded-lg border-2 border-orange-900 px-4 text-base font-medium text-orange-900 transition hover:bg-orange-50"
                >
                  J&apos;ai déjà un compte
                </Link>

                <button
                  type="submit"
                  disabled={submitting}
                  aria-busy={submitting}
                  className="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-orange-900 px-4 text-base font-medium text-white transition hover:bg-orange-950 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Création…" : "Créer mon compte"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
