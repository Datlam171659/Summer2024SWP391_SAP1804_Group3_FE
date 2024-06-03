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
} from "../../Features/buy-back/buyBackSlice"
import { Link } from "react-router-dom";

const ProductListBuyBack = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isButtonDisabled = !searchQuery;
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product.productData);
  const buyGold24k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold24k);

  const isLoadingProductData = useSelector(
    (state) => state.product.isLoadingProductData
  );
  const isError = useSelector((state) => state.product.isError);
  // const cart = useSelector((state) => state.cart);

  // useEffect(() => {
  //   dispatch(fetchProductData());
  // }, [dispatch]);

  // useEffect(() => {
  //   dispatch(getTotals());
  // }, [cart, dispatch]);

  // const handleAddToCart = (item) => {
  //   dispatch(addToCart(item));
  //   dispatch(getTotals());
  // };

  // const handleDecreaseCart = (item) => {
  //   dispatch(decreaseCart(item));
  //   dispatch(getTotals());
  // };

  // const handleRemoveFromCart = (item) => {
  //   dispatch(removeFromCart(item));
  //   dispatch(getTotals());
  // };

  // const filteredProducts = searchQuery
  //   ? productData.filter(
  //     (item) =>
  //       item &&
  //       (item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         item.itemId.toString().includes(searchQuery))
  //   )
  //   : [];

  // if (isError && !isLoadingProductData) {
  //   return <div>Something went wrong! Try again</div>;
  // }

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
          <button
            // onClick={() => handleDecreaseCart(record)}
            className="h-8 w-8 flex justify-center items-center text-xl bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-200"
          >
            -
          </button>
          <span className="mx-2">{record.cartQuantity}</span>
          <button
            // onClick={() => handleAddToCart(record)}
            className="h-8 w-8 flex justify-center items-center text-xl bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-200"
          >
            +
          </button>
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
        const totalPrice = record.weight * record.cartQuantity * buyGold24k;
        return `${Number(totalPrice.toFixed(0)).toLocaleString()}đ`;
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (_, record) => (
        <button
          // onClick={() => handleRemoveFromCart(record)}
          className="text-red-500 hover:text-red-700 transition duration-200"
        >
          <MinusCircleOutlined />
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="my-5 w-screen lg:w-full p-4">
        <div className="h-[40%] min-h-[485px] w-full lg:w-full text-center p-3 bg-[#FFFFFF] rounded-[7px] shadow-md">
          <Input
            placeholder="Nhập Id sản phẩm"
            style={{ width: "89.7%", marginBottom: "5px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}

          />
          <Button
            disabled={isButtonDisabled}
            type="primary"
            className="ml-2"
            style={{ fontWeight: "600", heigh: "30px" }}
          // onClick={() => {handleAddToCart(filteredProducts[0])}}
          >
            Tìm sản phẩm
          </Button>
          <div className="cart-items flex flex-col items-center space-y-8 w-full ">
            <Table
              // dataSource={cart.cartItems}
              columns={columns}
              rowKey="itemId"
              pagination={false}
              scroll={{
                y: 470,
              }}
              className="w-full rounded-[5px]"
            />
          </div>
        </div>
        <div className="flex w-full justify-between">
          <div className="cart-summary mt-6 bg-white p-6 pt-2 rounded-lg shadow-md w-[49%] mr-3">
            <div className="cart-checkout mt-6">
              <div className="flex-row">
                <div className="flex justify-between mb-3 text-lg">
                  <p>Tổng số lượng sản phẩm: </p>
                  {/* <p>{cart.cartTotalQuantity}</p> */}
                  <p>đ</p>

                </div>
                <div className="flex justify-between mb-3 text-lg">
                  <p>Tạm tính</p>
                  {/* <p>{cart.cartTotalAmount}đ</p> */}
                  <p>đ</p>
                </div>
              </div>
              <div className="mt-14 flex justify-between">
                <span className="text-lg font-semibold text-gray-800">
                  Thành tiền
                </span>
                <span className="amount text-xl font-bold text-gray-800">
                  {/* {cart.cartTotalAmount}đ */}
                  đ
                </span>
              </div>
            </div>
          </div>
          <div className="cart-summary mt-6 bg-white p-6 pt-2 rounded-lg shadow-md  w-[49%]">
            <Space wrap>

            </Space>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            <div>
              <Link to="Payment">
                <Button className="w-full h-14 bg-black text-white uppercase font-bold">
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

export default ProductListBuyBack;
