import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, message, Table, Select, Space, Spin, Modal } from "antd";
import { MinusOutlined, PlusOutlined, ScanOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  addItem,
  decrementQuantity,
  incrementQuantity,
  removeItem,
  updateTotals,
} from "../../Features/product/cartSlice";
import { fetchDiscountData } from "../../Features/Discount/DiscountSlice";
import { fetchProductData } from "../../Features/product/productSlice";
import { Html5QrcodeScanner } from "html5-qrcode";

const ProductList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const productData = useSelector((state) => state.product.productData);
  const [loading, setLoading] = useState(false);
  const [isScanModalVisible, setIsScanModalVisible] = useState(false);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartTotalQuantity = useSelector(
    (state) => state.cart.cartTotalQuantity
  );
  const cartTotalAmount = useSelector((state) => state.cart.cartTotalAmount);
  const buyGold24k = useSelector(
    (state) => state.goldPrice.sellPrice[0]?.sellGold24k
  );
  const buyGold18k = useSelector(
    (state) => state.goldPrice.sellPrice[0]?.sellGold18k
  );
  const buyGold14k = useSelector(
    (state) => state.goldPrice.sellPrice[0]?.sellGold14k
  );
  const buyGold10k = useSelector(
    (state) => state.goldPrice.sellPrice[0]?.sellGold10k
  );
  const discountData = useSelector((state) => state.discount.discountData);
  const isLoadingDiscountData = useSelector(
    (state) => state.discount.isLoadingDiscountData
  );
  const [discountDataSelect, setDiscountDataSelect] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);

  useEffect(() => {
    const cartTotalQuantity = cartItems.reduce(
      (acc, item) => acc + item.itemQuantity,
      0
    );

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

    const discountedAmount = cartTotalAmount * (1 - discountPercentage / 100);
    dispatch(updateTotals({ cartTotalQuantity, cartTotalAmount: discountedAmount }));
  }, [cartItems, buyGold10k, buyGold14k, buyGold18k, buyGold24k, discountPercentage, dispatch]);

  useEffect(() => {
    dispatch(fetchDiscountData());
    dispatch(fetchProductData());
  }, [dispatch]);

  useEffect(() => {
    if (!isScanModalVisible) return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    const success = (result) => {
      scanner.clear();
      setSearchQuery(result);
      setIsScanModalVisible(false);
    };

    const error = (err) => {
      console.warn(err);
    };

    scanner.render(success, error);

    return () => {
      scanner.clear();
    };
  }, [isScanModalVisible]);

  const discountOptions = discountData.map((item) => ({
    value: item.discountCode,
    label: `${item.discountPercentage}%`,
  }));

  const handleCreateOrder = () => {
    if (cartItems.length === 0) {
      message.error("Giỏ hàng trống. Không thể tạo đơn.");
    } else {
      navigate("/sales-page/Payment");
    }
  };
  console.log(discountData);
  console.log(discountOptions);
  const handleSearch = () => {
    setLoading(true);
    try {
      const trimmedQuery = searchQuery.replace(/\s/g, "").toLowerCase();
      const matchingItems = productData.filter((product) =>
        product.itemId.replace(/\s/g, "").toLowerCase().includes(trimmedQuery) ||
        product.itemName.replace(/\s/g, "").toLowerCase().includes(trimmedQuery)
      );

      if (matchingItems.length === 0) {
        message.error("Không tìm thấy sản phẩm. Vui lòng thử lại");
      } else {
        matchingItems.forEach((item) => {
          const itemExists = cartItems.some(
            (cartItem) => cartItem.itemId === item.itemId
          );
          if (itemExists) {
            message.error(`Sản phẩm ${item.itemName} đã tồn tại`);
          } else {
            dispatch(addItem(item));
            message.success(`Sản phẩm ${item.itemName} đã được thêm vào giỏ hàng`);
          }
        });
      }
      setSearchQuery("");
    } catch (error) {
      message.error("Không tìm thấy sản phẩm. Vui lòng thử lại");
      setSearchQuery("");
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
      setDiscountDataSelect("");
      setDiscountPercentage(0);
    } else {
      setDiscountDataSelect(value);
      const selectedDiscount = discountData.find(
        (discount) => discount.discountCode === value
      );
      console.log(selectedDiscount);
      if (selectedDiscount) {
        setDiscountPercentage(selectedDiscount.discountPercentage);
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

        return (record.weight * kara).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      },
    },
    {
      title: "Thao Tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          danger
          onClick={() => handleRemove(record.itemId)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Bán hàng</h2>
      <div className="mb-4 flex">
        <div className="flex w-full justify-between">
          <div className="w-[85%] flex">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập mã hàng hoặc tên hàng"
              className="mr-2"
            />
            <Button type="primary" onClick={handleSearch} loading={loading}>
              {loading ? "Đang tìm kiếm..." : "Thêm vào giỏ hàng"}
            </Button>

          </div>

          <Button
            type="default"
            className="ml-2 flex items-center"
            style={{ fontWeight: "600", heigh: "30px" }}
            onClick={() => setIsScanModalVisible(true)}
          >
            <ScanOutlined className="mr-2" />
            Quét QR
          </Button>
        </div>

      </div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={cartItems}
          rowKey="itemId"
          pagination={false}
        />
      </Spin>
      <div className="flex">
        <div className="flex-col  mt-6 bg-white p-6 pt-2 rounded-lg shadow-md w-[49%] mr-3s">
          <div className="flex justify-between mb-3 text-lg font-medium">
            <p className="font-bold mr-2">Tổng số lượng:</p>
            <p>{cartTotalQuantity}</p>
          </div>
          <div className="flex-col">
            <div className="flex justify-between mb-3 text-lg font-medium ">
              <p className="font-bold mr-2">Tổng tiền:</p>
              <p>
                {cartTotalAmount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
            <div className="flex justify-between mb-3 text-lg font-medium">
              <p>Giảm giá:</p>
              <p>
                {discountDataSelect
                  ? `${discountData.find(
                    (d) => d.discountCode === discountDataSelect
                  ).discountPercentage
                  }%`
                  : "0%"}
                {console.log(discountData)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Space wrap>
              <span className="font-bold">Chọn khuyến mãi:</span>
              <Select
                style={{
                  width: 200,
                  height: 50,
                }}
                allowClear
                onChange={handleChange}
                options={discountOptions}
              />
            </Space>
          </div>
        </div>

        <div className="cart-summary mt-6 bg-white p-6 pt-2 rounded-lg shadow-md  w-[49%] ml-7 flex justify-center ">
          <Button type="primary" onClick={handleCreateOrder} className="w-full h-14 bg-black text-white uppercase font-bold mt-12">
            Tạo đơn hàng
          </Button>
        </div>
      </div>
      <Modal
        title="Quét QR"
        visible={isScanModalVisible}
        onCancel={() => setIsScanModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsScanModalVisible(false)}>
            Hủy
          </Button>,
        ]}
      >
        <div id='reader'></div>
      </Modal>

    </div>
  );
};

export default ProductList;
