import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import api from "../services/api";

export default function LoginPage() {

    const navigate = useNavigate();
    const location = useLocation();

    const registered = location.state?.registered;

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {

            const response = await api.post("/login", form);

            localStorage.setItem("token", response.data.token);

            navigate("/");

        } catch (err) {

            setError("Invalid credentials");

            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f3b08d] via-[#ea8c7d] to-[#e56b6f] flex flex-col items-center justify-center px-4 py-12">

            <h1 className="text-3xl font-bold text-gray-800 fixed top-6 left-16">
                DataShare
            </h1>
            <div className="w-full max-w-md">

                <div className="bg-white rounded-2xl shadow p-8">
                    <div className="text-center mb-8">
                        <p className="mt-2 font-bold text-2xl">
                            Connexion
                        </p>

                    </div>
                    {registered && (
                        <div
                            className="mb-6 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3"
                            role="status"
                        >
                            Account created successfully. You can sign in now.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>

                            <label
                                htmlFor="login-email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
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
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                            />

                        </div>

                        <div>

                            <label
                                htmlFor="login-password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>

                            <input
                                id="login-password"
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                placeholder="Saisissez votre mot de passe..."
                                value={form.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                            />

                        </div>

                        {error && (
                            <p className="text-sm text-red-600" role="alert">
                                {error}
                            </p>
                        )}
                        <div className="flex flex-col justify-between gap-1">
                            <button
                                type="button"
                                className="w-full hover:bg-orange-100/50 text-orange-700 py-2.5 px-4 rounded-lg transition"
                            >
                                <Link
                                    to="/register"
                                    className="text-orange-600 hover:text-orange-700 font-medium"
                                >
                                    Créer un compte
                                </Link>
                            </button>
                            <button
                                type="submit"
                                className="w-full bg-orange-100 border border-orange-700 hover:bg-orange-200 text-orange-700 py-2.5 px-4 rounded-lg transition"
                            >
                                Connexion
                            </button>
                        </div>
                    </form>

                </div>

            </div>

        </div>
    );
}
