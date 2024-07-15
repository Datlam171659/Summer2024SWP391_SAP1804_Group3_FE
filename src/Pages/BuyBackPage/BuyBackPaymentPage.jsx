import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Table, Select, Space, ConfigProvider, Spin, Form, message } from "antd";
import { fetchCustomerData } from "../../Features/buy-back/buyBackCustomerSlice";
import { resetCart, updateCustomerInfo } from "../../Features/buy-back/buyBackCartSlice";
import buyBackApi from "../../Services/api/buyBackApi";

const BuyBackPaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.buyBackCart.cartItems);
  const customerData = useSelector(state => state.buyBackCustomer.customerData);
  const isLoading = useSelector(state => state.buyBackCustomer.isLoading);
  const buyGold24k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold24k);
  const buyGold18k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold18k);
  const buyGold14k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold14k);
  const buyGold10k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold10k);
  const cartTotalAmount = useSelector((state) => state.buyBackCart.cartTotalAmount);
  const cartTotalQuantity = useSelector((state) => state.buyBackCart.cartTotalQuantity);
  const customerInfor = useSelector((state) => state.buyBackCart.customerInfor);
  const [customerType, setCustomerType] = useState('newCustomer');
  const [searchedCustomer, setSearchedCustomer] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState(null);
  const [customerEmail, setCustomerEmail] = useState(null);
  const [customerGender, setCustomerGender] = useState("Nam");
  const [customerAddress, setCustomerAddress] = useState(null);
  const isButtonDisabled = !customerName || !customerEmail || !customerAddress || !phoneNumber;
  const customerIdFromSlice = useSelector((state) => state.buyBackCart.customerId);

  useEffect(() => {
    dispatch(fetchCustomerData());
  }, [dispatch]);

  useEffect(() => {
    const foundCustomer = customerData.find(customer => customer.id === customerIdFromSlice);
    if (foundCustomer) {
      dispatch(updateCustomerInfo(foundCustomer));
    }
  }, [customerData, customerIdFromSlice, dispatch]);

  const handleInputChange = (e) => {
    const name = e.target ? e.target.name : 'gender';
    const value = e.target ? e.target.value : e;
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
  };

  const handleSearchClick = () => {
    if (!phoneNumber) {
      message.warning("Vui lòng nhập số điện thoại");
      return;
    }
    if (Array.isArray(customerData)) {
      const foundCustomer = customerData.find(customer => customer.phoneNumber === phoneNumber && customer.status === "active");
      if (foundCustomer) {
        setSearchedCustomer(foundCustomer);
        dispatch(updateCustomerInfo({
          id: foundCustomer.id,
          customerName: foundCustomer.customerName,
          address: foundCustomer.address,
          gender: foundCustomer.gender,
          phoneNumber: foundCustomer.phoneNumber,
          email: foundCustomer.email,
          status: "active",
        }));
      } else {
        message.warning("Không tìm thấy khách hàng với số điện thoại này");
      }
    } else {
      console.error("Lỗi khi lấy dữ liệu");
    }
  };

  const handleSubmit = async () => {
    if (isButtonDisabled) {
      message.error("Vui lòng nhập đầy đủ thông tin khách hàng trước khi xác nhận.");
      return;
    }

    const newCustomerInfo = {
      customerName: customerName,
      address: customerAddress,
      gender: customerGender,
      phoneNumber: phoneNumber,
      email: customerEmail,
      status: "active",
    };
    try {
      const response = await buyBackApi.createCustomer(newCustomerInfo);
      message.success("Khách hàng đã được tạo thành công");
      dispatch(updateCustomerInfo(response));
    } catch (error) {
      message.error(`Có lỗi xảy ra: ${error.message}`);
    }
  };

  const handleConfirm = () => {
    if (customerInfor.length === 0) {
      message.error("Vui lòng nhập đầy đủ thông tin khách hàng trước khi xác nhận.");
    } else {
      navigate("/buy-back-page/Payment/PrintReceiptPage");
    }
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
      dataIndex: "itemId",
      key: "itemId",
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
        let goldType = "";
        if (record.itemName.toLowerCase().includes("10k")) {
          goldType = "10K";
        } else if (record.itemName.toLowerCase().includes("14k")) {
          goldType = "14K";
        } else if (record.itemName.toLowerCase().includes("18k")) {
          goldType = "18K";
        } else if (record.itemName.toLowerCase().includes("24k")) {
          goldType = "24K";
        }
        return goldType;
      },
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (_, record) => (
        <div className="flex items-center">
          <span className="mx-2">{record.quantity}</span>
        </div>
      ),
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
        let goldType = "";
        if (record.itemName.toLowerCase().includes("10k")) {
          goldType = "10K";
        } else if (record.itemName.toLowerCase().includes("14k")) {
          goldType = "14K";
        } else if (record.itemName.toLowerCase().includes("18k")) {
          goldType = "18K";
        } else if (record.itemName.toLowerCase().includes("24k")) {
          goldType = "24K";
        }

        let kara;
        switch (goldType) {
          case "10K":
            kara = buyGold10k;
            break;
          case "14K":
            kara = buyGold14k;
            break;
          case "18K":
            kara = buyGold18k;
            break;
          case "24K":
            kara = buyGold24k;
            break;
          default:
            kara = 0;
        }

        const totalPrice = record.weight * record.quantity * kara;
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
          <div className=" items-center mb-[15px] pb-[15px] pt-[10px] border-b-[1px]">
            <div className="w-[25%]"><h3 className="text-lg mr-4 mb-4 font-bold w-full">Thông tin khách hàng</h3></div>

            <div className="customer-details">
              <div className=" w-1/5 flex justify-between">
                <strong className="mr-4">SĐT:</strong><span>{customerInfor.phoneNumber}</span>
              </div>
              <div className=" w-1/5 flex justify-between">
                <strong className="mr-4">Địa Chỉ:</strong><span> {customerInfor.address}</span>
              </div>
              <div className=" w-1/5 flex justify-between">
                <strong className="mr-4">Giới Tính:</strong><span>{customerInfor.gender}</span>
              </div>
              <div className=" w-1/5 flex justify-between">
                <strong className="mr-4">Email:</strong> <span>{customerInfor.email}</span>
              </div>

            </div>

            <Button type="default">Sửa</Button>
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
                  Tổng tiền trả khách
                </span>
                <span className="amount text-xl font-bold text-gray-800">
                  {Number(cartTotalAmount.toFixed(0)).toLocaleString()}
                  đ
                </span>
              </div>
            </div>
          </div>
          <div className="cart-summary mt-4 bg-white p-6 rounded-lg shadow-md w-1/2">
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
                {/* <div className="flex justify-between">
                  <Button className="w-[49%] h-14 bg-lime-500 text-white uppercase font-bold hover:bg-gray-500">
                    Chuyển khoản
                  </Button>
                  <Button className="w-[49%] h-14 bg-lime-500 text-white uppercase font-bold hover:bg-gray-500">
                    Tiền mặt
                  </Button>
                </div> */}
              </ConfigProvider>

            </div>
            <div>
              <Button className="w-full h-14 bg-black text-white uppercase font-bold hover:bg-gray-500 " onClick={handleConfirm}>
                Xác Nhận
              </Button>
              <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

              <Link to="/buy-back-page">
                <Button className="w-full h-14 bg-white text-black uppercase font-bold hover:bg-gray-500 mt-4">
                  Hủy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {console.log("customerInfor: ", customerInfor)}
    </ConfigProvider>

  );
};

export default BuyBackPaymentPage;
