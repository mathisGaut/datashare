import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

export default function LoginPage() {

    const navigate = useNavigate();

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
        <div>

            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <br /><br />

                <button type="submit">
                    Login
                </button>

            </form>

            {error && <p>{error}</p>}

        </div>
    );
}