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
import Product from "../Pages/ProductPage/Product";
import ExchangeRatePage from "../Pages/ExchangeRatePage/ExchangeRatePage";
import DashBoardPage from "../Pages/DashBoardPage/DashBoardPage";
import ProducDetail from "../Pages/ProductPage/ProductDetail";
import BuyBackSuccessPaymentPage from "../Pages/BuyBackPage/BuyBackSuccessPaymentPage";
import BuyBackPage from "../Pages/BuyBackPage/BuyBackPage";
import BuyBackPaymentPage from "../Pages/BuyBackPage/BuyBackPaymentPage";
import UserManagePage from "../Pages/UserManagePage/UserManagePage";
import AddUserPage from "../Pages/AddUserPage/AddUserPage";
import CustomerSearchDetail from "../Pages/CustomerSearchPage/CustomerSearchDetail"
import Promotion from "../Pages/Promotion/Promotion";
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
        path: "promotion",
        element: <Promotion />,
      },

      {
        path: "sales-page/Payment",
        element: <PaymentPage />,
      },
      {
        path: "sales-page/Payment/PrintReceiptPage",
        element: <PrintReceiptPage />,
      },
      {
        path: "buy-back-page",
        element: <BuyBackPage />,
    },
    {
        path: "buy-back-page/Payment",
        element: <BuyBackPaymentPage />,
    },
    {
        path: "buy-back-page/Payment/PrintReceiptPage",
        element: <BuyBackSuccessPaymentPage />,
    },
      {
        path: "exchange-rate",
        element: <ExchangeRatePage />,
      },
    ],
  },
  {
    path: "customer-search",
    element: (
      <RootLayoput>
        <CustomerSearchPage />
      </RootLayoput>
    ),
  },
  {
    path: "customer-search/customer-add",
    element: (
      <RootLayoput>
        <AddCustomerPage />
      </RootLayoput>
    ),
  },
  {
    path: "product",
    element: (
      <RootLayoput>
        <Product />
      </RootLayoput>
    ),
  },
  {
    path: "product/productdetail/:itemId",
    element: (
      <RootLayoput>
        <ProducDetail />
      </RootLayoput>
    ),
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "customer/customerdetail/:id",
    element: (
      <RootLayoput>
        <CustomerSearchDetail />
      </RootLayoput>
    ),
  },
  {
    path: "customer-search",
    element: (
      <RootLayoput>
        <CustomerSearchPage />
      </RootLayoput>
    ),
  },
  {
    path: "customer-search/customer-add",
    element: (
      <RootLayoput>
        <AddCustomerPage />
      </RootLayoput>
    ),
  },
  {
    path: "dashboard",
    element: (
      <RootLayoput>
        <DashBoardPage />
      </RootLayoput>
    ),
  },
  {
    path: "user",
    element: (
      <RootLayoput>
        <UserManagePage />
      </RootLayoput>
    ),
  },
  {
    path: "user/user-add",
    element: (
      <RootLayoput>
        <AddUserPage />
      </RootLayoput>
    ),
  },
]);

export default router;