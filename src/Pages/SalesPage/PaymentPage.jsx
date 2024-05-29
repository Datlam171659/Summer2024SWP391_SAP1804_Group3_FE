import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Input, Modal, Table, Select, Space } from "antd";
import {
    clearCart,
    getTotals
  } from "../../Features/product/cartSlice";
const PaymentPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
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
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Số Lượng",
      dataIndex: "cartQuantity",
      key: "cartQuantity",
      render: (_, record) => (
        <div className="flex items-center">
          <span className="mx-2">{record.cartQuantity}</span>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price, record) => `$${price * record.cartQuantity}`,
    },
  ];
  const handleClearCart = () => {
    dispatch(clearCart());
    dispatch(getTotals());
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="payment-page w-full p-4">
      <div className="order-summary bg-gray-50 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-bold mb-4">Đơn hàng</h2>
        <div className="cart-items w-full">
          <Table
            dataSource={cart.cartItems}
            columns={columns}
            rowKey="itemId"
            pagination={false}
            className="w-full"
          />
        </div>
      </div>
      <div className="customer-info bg-white p-4 rounded-lg mb-4">
        <h3 className="text-lg mb-4 font-bold">Thông tin khách hàng</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center mb-3">
              <p className="w-1/3">Tên Khách Hàng:</p>
              <Input placeholder="Nhập tên khách hàng" className="w-2/3" />
            </div>
            <div className="flex items-center mb-3">
              <p className="w-1/3">Địa Chỉ:</p>
              <Input placeholder="Nhập địa chỉ" className="w-2/3" />
            </div>
            <div className="flex items-center mb-3">
              <p className="w-1/3">Số điện thoại:</p>
              <Input placeholder="Nhập số điện thoại" className="w-2/3" />
            </div>
            <div className="flex items-center mb-3">
              <p className="w-1/3">E-mail:</p>
              <Input placeholder="Nhập E-mail" className="w-2/3" />
            </div>
          </div>
          <div className="flex items-center ml-48 mb-40">
            <p className="w-1/3">Giới Tính:</p>
            <Space wrap className="w-2/3">
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
                <p>{cart.cartTotalQuantity}</p>
              </div>
              <div className="flex justify-between mb-3 text-lg">
                <p>Giảm giá:</p>
                <p>0</p>
              </div>
              <div className="flex justify-between mb-3 text-lg">
                <p>Tạm tính</p>
                <p>${cart.cartTotalAmount}</p>
              </div>
            </div>
            <div>
              <Button
                className="w-full h-14 bg-black text-white uppercase font-bold hover:bg-gray-500 "
                onClick={showModal}
              >
                Yêu cầu chiết khấu đơn hàng
              </Button>
            </div>
            <div className="mt-14 flex justify-between">
              <span className="text-lg font-semibold text-gray-800">
                Thành tiền
              </span>
              <span className="amount text-xl font-bold text-gray-800">
                ${cart.cartTotalAmount}
              </span>
            </div>
          </div>
        </div>
        <div className="cart-summary mt-12 bg-white p-6 rounded-lg shadow-md w-1/2">
          <div>
            <p className="mb-4 text-xl">Phương Thức Thanh Toán</p>
            <div className="flex">
              <Button className="w-1/2 h-14 bg-lime-800 text-white uppercase font-bold hover:bg-gray-500">
                Chuyển khoản
              </Button>
              <Button className="w-1/2 h-14 bg-lime-500 text-white uppercase font-bold hover:bg-gray-500">
                Tiền mặt
              </Button>
            </div>
          </div>
          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          <div>
            <Link to="/sales-page/Payment/PrintReceiptPage">
              <Button className="w-full h-14 bg-black text-white uppercase font-bold hover:bg-gray-500 "   onClick={() => handleClearCart()}>
                Xác Nhận
              </Button>
            </Link>
            <Link to="/sales-page">
              <Button className="w-full h-14 bg-white text-black uppercase font-bold hover:bg-gray-500 mt-4">
                Hủy
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Modal
        title="Yêu cầu chiết khấu"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="w-36"
        footer={
            <div className="">
              <Button onClick={handleCancel} className="text-black bg-white uppercase mr-3">
                hủy
              </Button>
              <Button   onClick={handleOk} className="bg-blue-700 text-white uppercase">
              Xác nhận
              </Button>
            </div>
          }
      >
        <div className="flex my-4 justify-between mr-8">
          <p>Mức chiết khấu(0.00)</p>
          <Input className="w-72"></Input>
        </div>
        <div className="flex justify-between my-4">
          <p>Quản lý</p>
          <Space wrap className="w-2/3">
            <Select
              defaultValue="Đạt"
              style={{ width: "440%" }}
              onChange={handleChange}
              options={[
                { value: "ĐẠt", label: "Đạt" },
                { value: "Chí", label: "Chí" },
              ]}
            />
          </Space>
        </div>
        <div className=" my-4">
        <TextArea rows={4} placeholder="Ghi Chú" maxLength={6} />
        </div>
      </Modal>
    </div>
  );
};

export default PaymentPage;
