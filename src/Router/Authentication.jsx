import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

function Authentication({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const authenticate = () => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime > decodedToken.exp) {
                localStorage.clear();
                navigate("/login");
            } else {
                if (location.pathname !== "" || location.pathname !== "/home") {
                    navigate(location.pathname);
                } else {
                    navigate("/home");
                }
            }
        } else {
            navigate("/login");
        }
    }

    useEffect(() => {
        authenticate();
    }, []);

    return (
        children
    );
}

export default Authentication;