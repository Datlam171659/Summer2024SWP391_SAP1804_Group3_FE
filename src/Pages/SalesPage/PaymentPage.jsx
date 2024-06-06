import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Input, Modal, Table, Select, Space, Spin, notification } from "antd";
import { clearCart, getTotals } from "../../Features/product/cartSlice";
import { fetchCustomerPhone } from "../../Features/Customer/customerbyphoneSlice";
import { createInvoice } from "../../Features/Invoice/InvoiceSlice";
import { addWarranty } from "../../Features/Warranty/warrantyaddSlice";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [customerNotFound, setCustomerNotFound] = useState(false);

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
      render: (_, record) => <span className="mx-2">{record.cartQuantity}</span>,
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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (!customerInfo) {
      alert("Please fetch customer details first");
      return;
    }
    const staffId = localStorage.getItem("nameid");
    const returnPolicyId = "RP01";
    const companyName = "SWJ";
    const status = "Active";
    const invoiceData = {
      staffId,
      returnPolicyId,
      itemId: cart.cartItems[0].itemId,
      customerId: customerInfo.id,
      companyName,
      buyerAddress: customerInfo.address,
      status,
      paymentType,
      quantity: cart.cartTotalQuantity,
      subTotal: cart.cartTotalAmount,
    };

    dispatch(createInvoice(invoiceData)).then((result) => {
      if (result.type === createInvoice.fulfilled.toString()) {
        notification.success({ message: "Tạo hóa đơn thành công!" });
        setIsModalOpen(false);
      } else {
        notification.error({ message: `Tạo hóa đơn thất bại: ${result.payload}` });
      }
    });
  };

  const handleWarranty = () => {
    if (!customerInfo) {
      alert("Please fetch customer details first");
      return;
    }

    dispatch(addWarranty(customerInfo.id)).then((result) => {
      if (result.type === addWarranty.fulfilled.toString()) {
        notification.success({ message: "Tạo bảo hành thành công!" });
      } else {
        notification.error({ message: `Tạo bảo hành thất bại: ${result.payload}` });
      }
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSearchCustomer = () => {
    setLoading(true);
    setCustomerNotFound(false);
    dispatch(fetchCustomerPhone(phoneNumber))
      .then((response) => {
        if (response.payload) {
          setCustomerInfo(response.payload);
        } else {
          setCustomerInfo(null);
          setCustomerNotFound(true);
        }
      })
      .catch((error) => {
        console.error("Lấy thông tin khách hàng thất bại:", error);
        notification.error({ message: "Lấy thông tin khách hàng thất bại" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleConfirm = () => {
    handleOk();
    handleClearCart();
    handleWarranty();
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
        <div className="flex mb-4">
          <Input
            placeholder="Enter Customer Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mr-2"
          />
          <Button onClick={handleSearchCustomer}>Search</Button>
        </div>
        {loading ? (
          <Spin />
        ) : customerNotFound ? (
          <p className="text-red-500">Không tìm thấy khách hàng với số điện thoại này.</p>
        ) : (
          customerInfo && (
            <div className="customer-details">
              <p className="text-lg my-3">
                <strong>Name:</strong> {customerInfo.customerName}
              </p>
              <p className="text-lg my-3">
                <strong>Address:</strong> {customerInfo.address}
              </p>
              <p className="text-lg my-3">
                <strong>Phone:</strong> {customerInfo.phoneNumber}
              </p>
              <p className="text-lg my-3">
                <strong>Gender:</strong> {customerInfo.gender}
              </p>
            </div>
          )
        )}
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
                <p>{cart.discount}%</p>
              </div>
              <div className="flex justify-between mb-3 text-lg">
                <p>Tạm tính</p>
                <p>${cart.cartTotalAmount}</p>
              </div>
            </div>
            <div>
              <Button
                className="w-full h-14 bg-black text-white uppercase font-bold hover:bg-gray-500"
                onClick={showModal}
              >
                Yêu cầu chiết khấu đơn hàng
              </Button>
            </div>
            <div className="mt-14 flex justify-between">
              <span className="text-lg font-semibold text-gray-800">Thành tiền</span>
              <span className="amount text-xl font-bold text-gray-800">${cart.cartTotalAmount}</span>
            </div>
          </div>
        </div>
        <div className="cart-summary mt-12 bg-white p-6 rounded-lg shadow-md w-1/2">
          <div>
            <p className="mb-4 text-xl">Phương Thức Thanh Toán</p>
            <div className="flex">
              <Button
                className={`w-1/2 h-14 uppercase font-bold ${
                  paymentType === "Chuyển khoản"
                    ? "bg-gray-500 text-white"
                    : "bg-lime-800 text-white hover:bg-gray-500"
                }`}
                onClick={() => setPaymentType("Chuyển khoản")}
              >
                Chuyển khoản
              </Button>
              <Button
                className={`w-1/2 h-14 uppercase font-bold ${
                  paymentType === "Tiền mặt"
                    ? "bg-gray-500 text-white"
                    : "bg-lime-500 text-white hover:bg-gray-500"
                }`}
                onClick={() => setPaymentType("Tiền mặt")}
              >
                Tiền mặt
              </Button>
            </div>
          </div>
          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          <div>
            <Link to="/sales-page/Payment/PrintReceiptPage">
              <Button
                className="w-full h-14 bg-black text-white uppercase font-bold hover:bg-gray-500"
                onClick={handleConfirm}
              >
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
        footer={
          <div>
            <Button onClick={handleCancel} className="text-black bg-white uppercase mr-3">
              Hủy
            </Button>
            <Button onClick={handleConfirm} className="bg-blue-700 text-white uppercase">
              Xác nhận
            </Button>
          </div>
        }
      >
        <div className="flex my-4 justify-between mr-8">
          <p>Mức chiết khấu (0.00)</p>
          <Input className="w-72" />
        </div>
        <div className="flex justify-between my-4">
          <p>Quản lý</p>
          <Space wrap className="w-2/3">
            <Select
              defaultValue="Đạt"
              style={{ width: "440%" }}
              options={[
                { value: "Đạt", label: "Đạt" },
                { value: "Chí", label: "Chí" },
              ]}
            />
          </Space>
        </div>
        <div className="my-4">
          <TextArea rows={4} placeholder="Ghi Chú" maxLength={6} />
        </div>
      </Modal>
    </div>
  );
};

export default PaymentPage;
