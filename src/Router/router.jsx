import { Outlet, createBrowserRouter } from "react-router-dom";
import Authentication from "./Authentication";
import RootLayoput from "./RootLayout";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import SalesPage from "../Pages/SalesPage/SalesPage";
import Login from "../Pages/LoginPage/Login";
import CustomerSearchPage from "../Pages/CustomerSearchPage/CustomerSearchPage";
import PaymentPage from "../Pages/SalesPage/PaymentPage";
import PrintReceiptPage from "../Pages/SalesPage/PrintReceiptPage";
import AddCustomerPage from "../Pages/AddCustomer/AddCustomerPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Authentication>
                <RootLayoput>
                    <Outlet />
                </RootLayoput>
            </Authentication>
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

            {
                path: "sales-page/Payment",
                element: <PaymentPage />,
            },
            {
                path: "sales-page/Payment/PrintReceiptPage",
                element: <PrintReceiptPage />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "customer-search",
        element: 
            <RootLayoput>
                <CustomerSearchPage/>
            </RootLayoput>
    },
    {
        path: "customer-search/customer-add",
        element: 
            <RootLayoput>
                <AddCustomerPage/>
            </RootLayoput>
    },

]);

export default router;