import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Input, Modal, Table, Select, Space, ConfigProvider } from "antd";
import {
  clearCart,
  getTotals
} from "../../Features/product/cartSlice";
const BuyBackPaymentPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.buyBackCart.cartItems);
  const buyGold24k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold24k);
  const cartTotalAmount = useSelector((state) => state.buyBackCart.cartTotalAmount);
  const cartTotalQuantity = useSelector((state) => state.buyBackCart.cartTotalQuantity);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const { TextArea } = Input;
  const columns = [
    {
      title: "STT",
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã Hàng",
      dataIndex: "itemId",
      key: "itemId",
    },
    {
      title: "Tên Hàng",
      dataIndex: "itemName",
      key: "itemName",
    },
    {
      title: "Loại Vàng",
      dataIndex: "24k",
      key: "goldType",
    },
    {
      title: "Số Lượng",
      dataIndex: "cartQuantity",
      key: "cartQuantity",
      render: (_, record) => (
        <div className="flex items-center">
          <span className="mx-2">{record.itemQuantity}</span>
        </div>
      ),
    },
    {
      title: "Trọng Lượng",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (_, record) => {
        const totalPrice = record.weight * record.itemQuantity * buyGold24k;
        return `${Number(totalPrice.toFixed(0)).toLocaleString()}đ`;
      },
    },
  ];
  const handleClearCart = () => {
    dispatch(clearCart());
    dispatch(getTotals());
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "var(--primary-color)",
          colorPrimaryHover: "var(--primary-color-hover)"
        },
      }}
    >
      <div className="payment-page w-full p-4">
        <div className="order-summary bg-gray-50 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-bold mb-4">Đơn hàng</h2>
          <div className="cart-items w-full">
            <Table
              dataSource={cartItems}
              columns={columns}
              rowKey="itemId"
              pagination={false}
              scroll={{ y: 378 }}
              className="w-full rounded-[5px] font-medium"
            />
          </div>
        </div>
        <div className="customer-info bg-white p-4 rounded-lg mb-4">
          <h3 className="text-lg mb-4 font-bold">Thông tin khách hàng</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center mb-3 font-medium">
                <p className="w-1/3">Số điện thoại:</p>
                <Input placeholder="Nhập số điện thoại" className="w-2/3" />
              </div>
              <div className="flex items-center mb-3 font-medium">
                <p className="w-1/3">Tên Khách Hàng:</p>
                <Input placeholder="Nhập tên khách hàng" className="w-2/3" />
              </div>
              <div className="flex items-center mb-3 font-medium">
                <p className="w-1/3">Địa Chỉ:</p>
                <Input placeholder="Nhập địa chỉ" className="w-2/3" />
              </div>
              <div className="flex items-center mb-3 font-medium">
                <p className="w-1/3">E-mail:</p>
                <Input placeholder="Nhập E-mail" className="w-2/3" />
              </div>
            </div>
            <div className="flex items-center ml-16 mb-40 font-medium">
              <p className="w-1/6">Giới Tính:</p>
              <Space wrap className="w-4/5">
                <Select
                  defaultValue="Nam"
                  style={{ width: "100%" }}
                  onChange={handleChange}
                  options={[
                    { value: "Nam", label: "Nam" },
                    { value: "Nữ", label: "Nữ" },
                  ]}
                />
              </Space>
            </div>
          </div>
        </div>
        <div className="flex w-full">
          <div className="cart-summary mt-12 bg-white p-6 rounded-lg shadow-md w-1/2 mr-3">
            <div className="cart-checkout mt-6">
              <div className="flex-row">
                <div className="flex justify-between mb-3 text-lg">
                  <p>Tổng số lượng sản phẩm: </p>
                  <p>{cartTotalQuantity}</p>
                </div>
                <div className="flex justify-between mb-3 text-lg">
                  <p>Tạm tính</p>
                  <p>{Number(cartTotalAmount.toFixed(0)).toLocaleString()}đ</p>
                </div>
              </div>
              <div className="mt-14 flex justify-between">
                <span className="text-lg font-semibold text-gray-800">
                  Thành tiền
                </span>
                <span className="amount text-xl font-bold text-gray-800">
                  {Number(cartTotalAmount.toFixed(0)).toLocaleString()}
                  đ
                </span>
              </div>
            </div>
          </div>
          <div className="cart-summary mt-12 bg-white p-6 rounded-lg shadow-md w-1/2">
            <div>
              {/* rgb(101, 163, 13) */}
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "rgb(101, 163, 13)",
                    colorPrimaryHover: "rgb(101, 163, 13)"
                  },
                }}
              >
                <div className="flex justify-between">
                  <Button className="w-[49%] h-14 bg-lime-500 text-white uppercase font-bold hover:bg-gray-500">
                    Chuyển khoản
                  </Button>
                  <Button className="w-[49%] h-14 bg-lime-500 text-white uppercase font-bold hover:bg-gray-500">
                    Tiền mặt
                  </Button>
                </div>
              </ConfigProvider>

            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div>
              <Link to="/buy-back-page/Payment/PrintReceiptPage">
                <Button className="w-full h-14 bg-black text-white uppercase font-bold hover:bg-gray-500 " onClick={() => handleClearCart()}>
                  Xác Nhận
                </Button>
              </Link>
              <Link to="/buy-back-page">
                <Button className="w-full h-14 bg-white text-black uppercase font-bold hover:bg-gray-500 mt-4">
                  Hủy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>

  );
};

export default BuyBackPaymentPage;
