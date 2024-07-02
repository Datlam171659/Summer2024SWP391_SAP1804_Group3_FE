// BuyBackSuccessPaymentPage.jsx
import React, { useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import { useSelector, useDispatch } from "react-redux";
import { Button, ConfigProvider } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { resetCart } from "../../Features/buy-back/buyBackCartSlice";
import InvoiceComponent from "../../Components/Common/InvoiceComponent";

function BuyBackSuccessPaymentPage() {
  const dispatch = useDispatch();
  const handleReset = () => {
    dispatch(resetCart());
  };
 
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.buyBackCart.cartItems);
  const customerInfor = useSelector((state) => state.buyBackCart.customerInfor);
  const cartTotalQuantity = useSelector((state) => state.buyBackCart.cartTotalQuantity);
  const cartTotalAmount = useSelector((state) => state.buyBackCart.cartTotalAmount);
  const invoiceComponentRef = useRef();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/buy-back-page/");
    }
  }, [cartItems, navigate]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "var(--primary-color)",
          colorPrimaryHover: "var(--primary-color-hover)"
        },
      }}
    >
      <div className="flex-col w-full text-center justify-center">
        <div className="mt-60">
          <CheckCircleOutlined className="text-9xl my-8 text-green-400" />
          <p>Thanh toán thành công</p>
          <div className="flex-col mt-9">
            <ReactToPrint
              trigger={() => <Button className="w-80 h-14 bg-black text-white uppercase font-bold">In hóa đơn</Button>}
              content={() => invoiceComponentRef.current}
            />
            <Link to="/buy-back-page">
              <Button onClick={handleReset} className="w-80 h-14 bg-white text-black uppercase font-bold ml-4">
                Tạo đơn mới
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden">
        <InvoiceComponent
          ref={invoiceComponentRef}
          cartItems={cartItems}
          customerInfor={customerInfor}
          cartTotalQuantity={cartTotalQuantity}
          cartTotalAmount={cartTotalAmount}
        />
      </div>
    </ConfigProvider>

  );
}

export default BuyBackSuccessPaymentPage;