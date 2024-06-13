import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, message, Table, Select, Space, Spin } from "antd";
import { MinusCircleOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import SalepageApi from "../../Features/Salepage/SalepageApi";
import { addItem, decrementQuantity, incrementQuantity, removeItem, updateTotals, applyDiscount, resetDiscount } from "../../Features/product/cartSlice";
import { fetchDiscountData } from "../../Features/Discount/DiscountSlice";

const ProductListBuyBack = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newItem, setNewItem] = useState({ itemName: "", weight: "", accessoryType: "", description: "" });
  const isButtonDisabled = !searchQuery;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartTotalQuantity = useSelector((state) => state.cart.cartTotalQuantity);
  const cartTotalAmount = useSelector((state) => state.cart.cartTotalAmount);
  const buyGold24k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold24k);
  const buyGold18k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold18k);
  const buyGold14k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold14k);
  const buyGold10k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold10k);
  const discountData = useSelector((state) => state.discount.discountData);
  const isLoadingDiscountData = useSelector((state) => state.discount.isLoadingDiscountData);
  const [discountDataSelect, setDiscountDataSelect] = useState(""); // State to store selected discount ID

  useEffect(() => {
    const cartTotalQuantity = cartItems.reduce((acc, item) => acc + item.itemQuantity, 0);

    const cartTotalAmount = cartItems.reduce((acc, item) => {
      let goldType = "";
      if (item.itemName.toLowerCase().includes("10k")) {
        goldType = "10K";
      } else if (item.itemName.toLowerCase().includes("14k")) {
        goldType = "14K";
      } else if (item.itemName.toLowerCase().includes("18k")) {
        goldType = "18K";
      } else if (item.itemName.toLowerCase().includes("24k")) {
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

      const itemTotalPrice = item.weight * item.itemQuantity * kara;
      return acc + itemTotalPrice;
    }, 0);

    dispatch(updateTotals({ cartTotalQuantity, cartTotalAmount }));
  }, [cartItems, buyGold10k, buyGold14k, buyGold18k, buyGold24k, dispatch]);

  useEffect(() => {
    dispatch(fetchDiscountData());
  }, [dispatch]);

  const discountOptions = discountData.map((item) => ({
    value: item.discountId,
    label: `${item.discountPercentage}%`,
  }));
  const handleCreateOrder = () => {
    if (cartItems.length === 0) {
      message.error("Giỏ hàng trống. Không thể tạo đơn.");
    } else {
      navigate("/sales-page/Payment");
    }
  };
  const handleSearch = async () => {
    setLoading(true);
    try {
      const item = await SalepageApi.getItem(searchQuery);
      const itemExists = cartItems.some(cartItem => cartItem.itemId === item.itemId);
      if (itemExists) {
        message.error("Sản phẩm đã tồn tại");
        setSearchQuery("")
      } else {
        dispatch(addItem(item));
        setSearchQuery("")
        message.success("Sản phẩm đã được thêm vào giỏ hàng");
      }
    } catch (error) {
      message.error("Không tìm thấy sản phẩm. Vui lòng thử lại");
      setSearchQuery("")
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (itemId) => {
    dispatch(removeItem(itemId));
    message.success("Sản phẩm đã được xóa khỏi giỏ hàng");
  };

  const handleChange = (value) => {
    if (value === undefined) {
      dispatch(resetDiscount());
      setDiscountDataSelect(""); // Clear selected discount ID
    } else {
      setDiscountDataSelect(value); // Set selected discount ID
      const selectedDiscount = discountData.find((discount) => discount.discountId === value);
      if (selectedDiscount) {
        dispatch(applyDiscount(selectedDiscount.discountPercentage));
      }
    }
  };

  const handleIncrement = (itemId) => {
    dispatch(incrementQuantity(itemId));
  };

  const handleDecrement = (itemId) => {
    dispatch(decrementQuantity(itemId));
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
      dataIndex: "itemQuantity",
      key: "itemQuantity",
      width: 100,
      render: (_, record) => (
        <div className="flex items-center">
          <button
            onClick={() => handleDecrement(record.itemId)}
            className="h-7 w-7 flex justify-center items-center text-[8px] bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-200"
          >
            <MinusOutlined />
          </button>
          <span className="mx-2">{record.itemQuantity}</span>
          <button
            onClick={() => handleIncrement(record.itemId)}
            className="h-7 w-7 flex justify-center items-center text-[8px] bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-200"
          >
            <PlusOutlined />
          </button>
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

        const totalPrice = record.weight * record.itemQuantity * kara;
        return `${Number(totalPrice.toFixed(0)).toLocaleString()}đ`;
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 78,
      render: (_, record) => (
        <MinusCircleOutlined onClick={() => handleRemove(record.itemId)} style={{ color: 'red', cursor: 'pointer' }} />
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full ">
      <div className="my-5 p-4">
        <div className="h-[40%] min-h-[485px] w-full  text-center p-3 bg-[#FFFFFF] rounded-[7px] shadow-md">
          <Input
            placeholder="Nhập Id sản phẩm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-1/2"
          />
          <Button
            disabled={isButtonDisabled}
            type="primary"
            className="ml-2"
            style={{ fontWeight: "600", heigh: "30px" }}
            onClick={handleSearch}
          >
            Tìm sản phẩm
          </Button>
          <Spin spinning={loading}>
            <div className="cart-items flex flex-col items-center space-y-8 w-full ">
              <Table
                dataSource={cartItems}
                columns={columns}
                rowKey="itemId"
                pagination={false}
                scroll={{ y: 378 }}
                className="w-full rounded-[5px] font-medium"
              />
            </div>
          </Spin>
        </div>
        <div className="flex w-full justify-between">
          <div className="cart-summary mt-6 bg-white p-6 pt-2 rounded-lg shadow-md w-[49%] mr-3">
            <div className="cart-checkout mt-6">
              <div className="flex-row">
                <div className="flex justify-between mb-3 text-lg font-medium">
                  <p>Tổng số lượng sản phẩm: </p>
                  <p>{cartTotalQuantity}</p>
                </div>
                <div className="flex justify-between mb-3 text-lg font-medium">
                  <p>Giảm giá:</p>
                  <p>{discountDataSelect ? `${discountData.find(d => d.discountId === discountDataSelect).discountPercentage}%` : "0%"}</p>
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
          <div className="cart-summary mt-6 bg-white p-6 pt-2 rounded-lg shadow-md  w-[49%]">
            <Space wrap>
              <Select
                style={{
                  width: 760,
                  height: 50,
                }}
                allowClear
                onChange={handleChange}
                options={discountOptions}
              />
            </Space>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

            <div>
            <Button onClick={handleCreateOrder} className="w-full h-14 bg-black text-white uppercase font-bold">
                Tạo Đơn
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListBuyBack;
