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
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-12">

            <div className="w-full max-w-md">

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-gray-800">
                        DataShare
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Sign in to your account
                    </p>

                </div>

                <div className="bg-white rounded-2xl shadow p-8">

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
                                placeholder="you@example.com"
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
                                placeholder="••••••••"
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

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition"
                        >
                            Sign in
                        </button>

                    </form>

                </div>

                <p className="text-center text-gray-600 text-sm mt-6">

                    Don&apos;t have an account?{" "}

                    <Link
                        to="/register"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Create one
                    </Link>

                </p>

            </div>

        </div>
    );
}
