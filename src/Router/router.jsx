import { Outlet, createBrowserRouter, Navigate } from "react-router-dom";
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
import CustomerSearchDetail from "../Pages/CustomerSearchPage/CustomerSearchDetail";
import Promotion from "../Pages/Promotion/Promotion";
import RoleBasedRoute from "../Components/Common/RoleBasedRoute";
import NoAccess from "../Pages/Authen/NoAccess";
import StaffStationPage from "../Pages/StaffStationPage/StaffStationPage";
import ChatRoom from "../Pages/RoomChatPage/ChatRoom";
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
        element: (
          <RoleBasedRoute roles={["manager", "admin"]}>
            <Promotion />
          </RoleBasedRoute>
        ),
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
      {
        path: "station",
        element: <StaffStationPage />,
      },
      {
        path: "no-access",
        element: <NoAccess />,
      },
      {
        path: "user",
        element: (
          <RoleBasedRoute roles={["admin"]}>
            <UserManagePage />
          </RoleBasedRoute>
        ),
      },
      {
        path: "user/user-add",
        element: (
          <RoleBasedRoute roles={["admin"]}>
            <AddUserPage />
          </RoleBasedRoute>
        ),
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
    path: "dashboard",
    element: (
      <Authentication>
        <RootLayoput>
          <DashBoardPage />
        </RootLayoput>
      </Authentication>
    ),
  },
  {
    path: "chat-room",
    element: (
      <Authentication>
        <RootLayoput>
          <ChatRoom />
        </RootLayoput>
      </Authentication>
    ),
  },
]);

export default router;
