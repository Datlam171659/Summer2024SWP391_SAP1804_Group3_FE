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
                // Lưu role vào localStorage dựa trên giá trị của decodedToken.role
                switch (decodedToken.role) {
                    case "0":
                        localStorage.setItem("role", "admin");
                        break;
                    case "1":
                        localStorage.setItem("role", "manager");
                        break;
                    case "2":
                        localStorage.setItem("role", "staff");
                        break;
                    default:
                        console.log("Role not recognized");
                }

                localStorage.setItem("nameid", decodedToken.nameid);
                localStorage.setItem("email", decodedToken.email);
                localStorage.setItem("UserName", decodedToken.UserName);

                if (location.pathname !== "" || location.pathname !== "/") {
                    navigate(location.pathname);
                } else {
                    navigate("/");
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