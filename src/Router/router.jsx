import { Outlet, createBrowserRouter } from "react-router-dom";
import Authentication from "./Authentication";
import RootLayoput from "./RootLayout";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import SalesPage from "../Pages/SalesPage/SalesPage";
import Login from "../Pages/LoginPage/Login";


const router = createBrowserRouter([
    {
        path: "/",
        element: (
            // <Authentication>
            <RootLayoput>
                <Outlet />
            </RootLayoput>
            // </Authentication>
        ),
        errorElement: (
            <RootLayoput>
                <ErrorPage />
            </RootLayoput>
        ),
        children: [
            {
                path: "sales-page",
                element: <SalesPage />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />
    }
]);

export default router;