import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductData } from "../../Features/product/productSlice";
import { Button, Input, message, Table, Select, Space } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import {
  addToCart,
  decreaseCart,
  getTotals,
  removeFromCart,
  applyDiscount,
  resetDiscount,
} from "../../Features/product/cartSlice";
import { Link } from "react-router-dom";
import { fetchDiscountData } from "../../Features/Discount/DiscountSlice";

const ProductListSale = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product.productData);
  const isLoadingProductData = useSelector(
    (state) => state.product.isLoadingProductData
  );
  const discountData = useSelector((state) => state.discount.discountData);
  const isLoadingDiscountData = useSelector(
    (state) => state.discount.isLoadingDiscountData
  );
  const isError = useSelector((state) => state.product.isError);
  const cart = useSelector((state) => state.cart);

  const handleChange = (value) => {
    if (value === undefined) {
      dispatch(resetDiscount());
    } else {
      const selectedDiscount = discountData.find(
        (discount) => discount.discountId === value
      );
      if (selectedDiscount) {
        dispatch(applyDiscount(selectedDiscount.discountPercentage));
      }
    }
  };

  useEffect(() => {
    dispatch(fetchProductData());
    dispatch(fetchDiscountData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    dispatch(getTotals());
  };

  const handleDecreaseCart = (item) => {
    dispatch(decreaseCart(item));
    dispatch(getTotals());
  };

  const handleRemoveFromCart = (item) => {
    dispatch(removeFromCart(item));
    dispatch(getTotals());
  };

  const onSearch = (value) => {
    if (!/^\d+$/.test(value)) {
      message.error("Sai mã sản phẩm.Hãy nhập lại!");
      return;
    }
    setSearchQuery(value);
  };

  const { Search } = Input;

  if (isError && !isLoadingProductData) {
    return <div>Có gì đó sai! Hãy thử lại</div>;
  }

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
          <button
            onClick={() => handleDecreaseCart(record)}
            className="h-8 w-8 flex justify-center items-center text-xl bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-200"
          >
            -
          </button>
          <span className="mx-2">{record.cartQuantity}</span>
          <button
            onClick={() => handleAddToCart(record)}
            className="h-8 w-8 flex justify-center items-center text-xl bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-200"
          >
            +
          </button>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price, record) => `$${price * record.cartQuantity}`,
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleRemoveFromCart(record)}
          className="text-red-500 hover:text-red-700 transition duration-200"
        >
          <MinusCircleOutlined />
        </button>
      ),
    },
  ];

  const filteredProducts = searchQuery
    ? productData.filter(
        (item) => item && item.itemId.toString() === searchQuery
      )
    : [];

  const discountOptions = discountData.map((item) => ({
    value: item.discountId,
    label: `${item.discountPercentage}%`,
  }));

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="my-9 w-full lg:w-full p-4">
        <div className="w-full lg:w-full text-center p-6 bg-gray-50">
          <Search
            placeholder="Nhập Id sản phẩm"
            onSearch={onSearch}
            style={{ width: 400 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="primary"
            className="ml-4"
            onClick={() => {
              if (filteredProducts.length > 0) {
                handleAddToCart(filteredProducts[0]);
              } else {
                message.error("Không tìm thấy sản phẩm");
              }
            }}
          >
            Thêm vào giỏ hàng
          </Button>
          <div className="cart-items flex flex-col items-center space-y-8 w-full">
            <Table
              dataSource={cart.cartItems}
              columns={columns}
              rowKey="itemId"
              pagination={false}
              className="w-full"
            />
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
                  <p>{cart.discount}%</p>
                </div>
                <div className="flex justify-between mb-3 text-lg">
                  <p>Tạm tính</p>
                  <p>${cart.cartTotalAmount}</p>
                </div>
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
          <div className="cart-summary mt-12 bg-white p-6 rounded-lg shadow-md  w-1/2">
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
              <Link to={cart.cartTotalQuantity > 0 ? "Payment" : "#"}>
                <Button
                  className="w-full h-14 bg-black text-white uppercase font-bold"
                  disabled={cart.cartTotalQuantity === 0}
                >
                  Tạo Đơn
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListSale;
