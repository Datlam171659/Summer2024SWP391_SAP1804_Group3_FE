import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Table, ConfigProvider, message, Modal } from "antd";
import { fetchCustomerData } from "../../Features/Customer/customerSlice";
import { resetCart, updateCustomerInfo } from "../../Features/product/cartSlice";
import SalepageApi from "../../Features/Salepage/SalepageApi";
import { createInvoice } from "../../Features/Invoice/InvoiceSlice";
import { addWarranty } from "../../Features/Warranty/warrantyaddSlice";
import { rewardCustomer } from "../../Features/Customer/rewardSlice";
import { fetchPromotions } from "../../Features/Promotion/promotionallSlice";
import { reduceItemQuantity } from "../../Features/product/quantitySlice"; 
import emailjs from 'emailjs-com';



const PaymentPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const customerData = useSelector((state) => state.customer.customerData);
  const isLoading = useSelector((state) => state.customer.isLoading);
  const buyGold24k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold24k);
  const buyGold18k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold18k);
  const buyGold14k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold14k);
  const buyGold10k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold10k);
  const cartTotalAmount = useSelector((state) => state.cart.cartTotalAmount);
  const cartTotalQuantity = useSelector((state) => state.cart.cartTotalQuantity);
  const customerInfor = useSelector((state) => state.cart.customerInfor);
  const promotions = useSelector((state) => state.promotions.promotions);
  const [qrCode, setQrCode] = useState("");
  const [customerType, setCustomerType] = useState('newCustomer');
  const [searchedCustomer, setSearchedCustomer] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerGender, setCustomerGender] = useState("Nam");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [pointsTotal, setPpointsTotal] = useState(0);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const MY_BANK = {
    BANK_ID: "Vietcombank",
    ACCOUNT_NO: "1025210358",
    TEMPLATE: "compact2"
  };

  const calculatePoints = (cartTotalAmount) => {
    let points = 0;
    if (cartTotalAmount > 0) {
      points = Math.floor(cartTotalAmount / 5000000) * 5;
    }
    return points;
  };

  function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${date}/${month}/${year}`;
  }

  useEffect(() => {
    const qrLink = `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-${MY_BANK.TEMPLATE}.png?amount=${cartTotalAmount}`;
    setQrCode(qrLink);
  }, [cartTotalAmount]);

  useEffect(() => {
    dispatch(fetchCustomerData());
    setPpointsTotal(calculatePoints(cartTotalAmount));
  }, [dispatch, cartTotalAmount]);

  useEffect(() => {
    dispatch(fetchPromotions());
  }, [dispatch]);

  useEffect(() => {
    const ContentElement = document.getElementById('content');
    const SidebarElement = document.getElementById('sidebar'); 
  
    if(ContentElement && SidebarElement) {
      if (isModalOpen) {
        ContentElement.classList.add('blur-md');
        SidebarElement.classList.add('invisible');
      } else {
        ContentElement.classList.remove('blur-md');
        SidebarElement.classList.remove('invisible');
      }
  
      return () => { 
        ContentElement.classList.remove('blur-md');
        SidebarElement.classList.remove('invisible');
      };
    }
  }, [isModalOpen]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'customerName':
        setCustomerName(value);
        break;
      case 'address':
        setCustomerAddress(value);
        break;
      case 'gender':
        setCustomerGender(value);
        break;
      case 'phoneNumber':
        setPhoneNumber(value);
        break;
      case 'email':
        setCustomerEmail(value);
        break;
      default:
        break;
    }
  }, []);

  const showModalPay = () => {
    setIsModalOpen(true);
  };

  const handleOkPay = () => {
    setPaymentType("Chuyển khoản");
    setIsModalOpen(false);

  };

  const handleCancelPay = () => {
    setIsModalOpen(false);
  };

  const handleSearchClick = () => {
    if (!phoneNumber) {
      message.warning("Vui lòng nhập số điện thoại");
      return;
    }

    const foundCustomer = customerData.find(customer => customer.phoneNumber === phoneNumber && customer.status === "active");
    if (foundCustomer) {
      setSearchedCustomer(foundCustomer);
      dispatch(updateCustomerInfo(foundCustomer));
    } else {
      message.warning("Không tìm thấy khách hàng với số điện thoại này");
    }
  };

  const handleSubmit = async () => {
    const newCustomerInfo = {
      customerName,
      address: customerAddress,
      gender: customerGender,
      phoneNumber,
      email: customerEmail,
      status: "active",
    };

    try {
      const response = await SalepageApi.createCustomer(newCustomerInfo);
      message.success("Khách hàng đã được tạo thành công");
      dispatch(updateCustomerInfo(response));
    } catch (error) {
      message.error(`Có lỗi xảy ra: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setCustomerName("");
    setCustomerAddress("");
    setCustomerGender("Nam");
    setPhoneNumber("");
    setCustomerEmail("");
    setSearchedCustomer(null);
    dispatch(updateCustomerInfo([]));
  };

  const handleConfirm = async () => {
    if (!searchedCustomer && customerType === 'member') {
      message.warning("Vui lòng tìm kiếm thông tin khách hàng");
      return;
    }

    const customerId = customerType === 'member' ? searchedCustomer.id : customerInfor.id;
    const staffId = localStorage.getItem("nameid");
    const returnPolicyId = "RP01";
    const companyName = "SWJ";
    const status = "Active";
    const invoiceData = {
      staffId,
      returnPolicyId,
      itemId: cartItems[0].itemId,
      customerId,
      companyName,
      buyerAddress: customerInfor.address,
      status,
      paymentType,
      quantity: cartTotalQuantity,
      subTotal: cartTotalAmount,
    };

    try {
      await dispatch(createInvoice(invoiceData)).unwrap();
      await dispatch(addWarranty(customerId)).unwrap();
      await dispatch(rewardCustomer({ customerId, pointsTotal })).unwrap();
      
      
      for (const item of cartItems) {
        await dispatch(reduceItemQuantity({ itemId: item.itemId, quantity: item.itemQuantity })).unwrap();
      }

      const templateParams = {
        to_email: customerInfor.email,
        customerName: customerInfor.customerName, 
        buyerAddress: customerInfor.address,
        email: customerInfor.email,
        phoneNumber: customerInfor.phoneNumber,
        date: getDate(), 
        cartTotalQuantity: cartTotalQuantity,
        cartTotalAmount: cartTotalAmount.toLocaleString(),
      };

      emailjs.send('service_w6685q7', 'template_4ih77go', templateParams, 'aRYuyBmKOYvAYpoIL')
      .then((response) => {
        message.success("Tạo hóa đơn và gửi email thành công!");
      }, (err) => {
        message.error("Gửi email thất bại.");
      });
    } catch (error) {
      message.error(`Tạo hóa đơn thất bại: ${error.message}`);
    }
  };

  const handleSelectChange = (value) => {
    setCustomerType(value);
    handleCancel();
  };

  const handleReset = () => {
    dispatch(resetCart());
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "numericalOrder",
      key: "numericalOrder",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã Hàng",
      dataIndex: "serialNumber",
      key: "serialNumber",
      width: 120,
    },
    {
      title: "Tên Hàng",
      dataIndex: "itemName",
      key: "itemName",
      width: 150,
    },
    {
      title: "Loại Hàng",
      dataIndex: "accessoryType",
      key: "accessoryType",
      width: 100,
    },
    {
      title: "Loại Vàng",
      dataIndex: "goldType",
      key: "goldType",
      width: 100,
      render: (_, record) => {
        const goldTypeMap = {
          "10k": "10K",
          "14k": "14K",
          "18k": "18K",
          "24k": "24K",
        };
        const goldType = Object.keys(goldTypeMap).find(key => record.itemName.toLowerCase().includes(key)) || "";
        return goldTypeMap[goldType] || "";
      },
    },
    {
      title: "Số Lượng",
      dataIndex: "itemQuantity",
      key: "itemQuantity",
      width: 100,
    },
    {
      title: "Trọng Lượng",
      dataIndex: "weight",
      key: "weight",
      width: 100,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (_, record) => {
        const goldTypeMap = {
          "10k": buyGold10k,
          "14k": buyGold14k,
          "18k": buyGold18k,
          "24k": buyGold24k,
        };
        const goldType = Object.keys(goldTypeMap).find(key => record.itemName.toLowerCase().includes(key)) || "";
        const kara = goldTypeMap[goldType] || 0;
        const totalPrice = record.weight * record.itemQuantity * kara;
        return `${Number(totalPrice.toFixed(0)).toLocaleString()}đ`;
      },
    },
  ];

  return (
    <ConfigProvider 
      theme={{
        token: {
          colorPrimary: "var(--primary-color)",
          colorPrimaryHover: "var(--primary-color-hover)"
        },
        components: {
          Select: {
            optionSelectedBg: "#dbdbdb"
          },
        },
      }}
    > 
    <div id="content">
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
        <div className="flex w-full">
          <div className="cart-summary mt-4 bg-white p-6 rounded-lg shadow-md w-1/2 mr-3">
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
                  {Number(cartTotalAmount.toFixed(0)).toLocaleString()}đ
                </span>
              </div>
            </div>
          </div>
          <div className="cart-summary mt-4 bg-white p-6 rounded-lg shadow-md w-1/2">
            <div>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "rgb(101, 163, 13)",
                    colorPrimaryHover: "rgb(101, 163, 13)"
                  },
                }}
              >
                <div className="flex justify-between">
                  <Button
                    className={`w-1/2 h-14 uppercase font-bold ${
                      paymentType === "Chuyển khoản"
                        ? "bg-gray-500 text-white"
                        : "bg-black text-white hover:bg-gray-500"
                    }`}
                    onClick={showModalPay}
                  >
                    Chuyển khoản
                  </Button>
                  <Button
                    className={`w-1/2 h-14 uppercase font-bold ${
                      paymentType === "Tiền mặt"
                        ? "bg-gray-500 text-white"
                        : "bg-black text-white hover:bg-gray-500"
                    }`}
                    onClick={() => setPaymentType("Tiền mặt")}
                  >
                    Tiền mặt
                  </Button>
                </div>
              </ConfigProvider>
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div>
              <Link to="/sales-page/Payment/PrintReceiptPage">
                <Button className="w-full h-14 bg-black text-white uppercase font-bold hover:bg-gray-500" onClick={handleConfirm}>
                  Xác Nhận
                </Button>
              </Link>
              <Link to="/sales-page">
                <Button className="w-full h-14 bg-white text-black uppercase font-bold hover:bg-gray-500 mt-4" onClick={handleCancel}>
                  Hủy
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Modal open={isModalOpen} onOk={handleOkPay} onCancel={handleCancelPay}>
          <img src={qrCode} alt="QR Code"/>
        </Modal>
      </div>
    </div>
    </ConfigProvider>
  );
};

export default PaymentPage;
