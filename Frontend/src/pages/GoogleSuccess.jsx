import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function GoogleSuccess() {
    const [params] = useSearchParams();
    const token = params.get("token");

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            window.location.href = "/account"; // send user to dashboard
        }
    }, [token]);

    return;
}
