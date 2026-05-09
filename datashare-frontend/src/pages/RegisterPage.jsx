import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

export default function RegisterPage() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

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
            setError("Passwords do not match.");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

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
                    || "Registration failed. Please check your information."
                );
            }

            console.error(err);
        }
    };

    const firstError = (key) =>
        Array.isArray(fieldErrors[key]) ? fieldErrors[key][0] : fieldErrors[key];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-12">

            <div className="w-full max-w-md">

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-gray-800">
                        DataShare
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Create your account
                    </p>

                </div>

                <div className="bg-white rounded-2xl shadow p-8">

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>

                            <label
                                htmlFor="register-name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Name
                            </label>

                            <input
                                id="register-name"
                                type="text"
                                name="name"
                                autoComplete="name"
                                placeholder="Jane Doe"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                            />

                            {firstError("name") && (
                                <p className="text-sm text-red-600 mt-1">
                                    {firstError("name")}
                                </p>
                            )}

                        </div>

                        <div>

                            <label
                                htmlFor="register-email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email
                            </label>

                            <input
                                id="register-email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                            />

                            {firstError("email") && (
                                <p className="text-sm text-red-600 mt-1">
                                    {firstError("email")}
                                </p>
                            )}

                        </div>

                        <div>

                            <label
                                htmlFor="register-password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>

                            <input
                                id="register-password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                placeholder="At least 6 characters"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                                minLength={6}
                            />

                            {firstError("password") && (
                                <p className="text-sm text-red-600 mt-1">
                                    {firstError("password")}
                                </p>
                            )}

                        </div>

                        <div>

                            <label
                                htmlFor="register-password-confirmation"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Confirm password
                            </label>

                            <input
                                id="register-password-confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                placeholder="Repeat password"
                                value={form.password_confirmation}
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
                            Create account
                        </button>

                    </form>

                </div>

                <p className="text-center text-gray-600 text-sm mt-6">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Sign in
                    </Link>

                </p>

            </div>

        </div>
    );
}
