import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { useSelector, useDispatch } from "react-redux";
import { Button, ConfigProvider } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { resetCart } from "../../Features/product/cartSlice";
import InvoiceComponent from "../../Components/Common/InvoiceComponent";
import WarrantyComponent from "../../Components/Common/WarrantyComponent";

function PrintReceiptPage() {
  const dispatch = useDispatch();
  const handleReset = () => {
    dispatch(resetCart());
  };

  const cartItems = useSelector((state) => state.cart.cartItems);
  const customerInfor = useSelector((state) => state.cart.customerInfor);
  const cartTotalQuantity = useSelector((state) => state.cart.cartTotalQuantity);
  const cartTotalAmount = useSelector((state) => state.cart.cartTotalAmount);
  const invoiceComponentRef = useRef();
  const warrantyComponentRef = useRef();

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
            <ReactToPrint
              trigger={() => <Button className="w-80 h-14 bg-black text-white uppercase font-bold mt-4">In bảo hành</Button>}
              content={() => warrantyComponentRef.current}
            />
            <Link to="/sales-page">
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
        <WarrantyComponent
          ref={warrantyComponentRef}
          customerInfor={customerInfor}
          cartItems={cartItems}
        />
      </div>
      {console.log("Check cart",cartItems)}
    </ConfigProvider>
  );
}

export default PrintReceiptPage;
