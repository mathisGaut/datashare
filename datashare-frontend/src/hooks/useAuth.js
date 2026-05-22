import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

export default function useAuth() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [userError, setUserError] = useState("");

    const fetchUser = async () => {

        setUserError("");

        try {

            const response = await api.get("/user");

            setUser(response.data);

        } catch (error) {

            console.error(error);

            setUserError(
                "Impossible de charger votre profil.",
            );
        }
    };

    const logout = async () => {

        try {

            await api.post("/logout");

        } catch (error) {

            console.error(error);
        }

        localStorage.removeItem("token");

        navigate("/login");
    };

    return {
        user,
        userError,
        fetchUser,
        logout,
    };
}