
import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ children, role }) => {
    const userRole = localStorage.getItem("role");

    if (userRole !== role) {
        return <Navigate to="/no-access" />;
    }

    return children;
};

export default RoleBasedRoute;
