import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, message, Table, Select, Space, Spin, Form, Modal } from "antd";
import { MinusCircleOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import buyBackApi from "../../Services/api/buyBackApi";
import { addItem, decrementQuantity, incrementQuantity, removeItem, updateTotals } from "../../Features/buy-back/buyBackCartSlice";

const ProductListBuyBack = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newItem, setNewItem] = useState({ itemName: "", weight: "", accessoryType: "", description: "" });
  const isButtonDisabled = !searchQuery;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.buyBackCart.cartItems);
  const cartTotalQuantity = useSelector((state) => state.buyBackCart.cartTotalQuantity);
  const cartTotalAmount = useSelector((state) => state.buyBackCart.cartTotalAmount);
  const buyGold24k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold24k);
  const buyGold18k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold18k);
  const buyGold14k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold14k);
  const buyGold10k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold10k);


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

  const handleSearch = async () => {
    setLoading(true);
    try {
      const item = await buyBackApi.getItem(searchQuery);
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

  const handleIncrement = (itemId) => {
    dispatch(incrementQuantity(itemId));
  };

  const handleDecrement = (itemId) => {
    dispatch(decrementQuantity(itemId));
  };

  const showAddItemModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (newItem.itemName && newItem.weight && newItem.accessoryType) {
      const currentDateTime = new Date();
      const formattedDateTime = currentDateTime
        .toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, 14);

      const newItemWithId = {
        itemId: `BBI${formattedDateTime}`,
        itemImagesId: "string",
        brandId: "PNJ",
        accessoryType: newItem.accessoryType,
        serialNumber: `BBI${formattedDateTime}`,
        sku: "string",
        itemName: newItem.itemName,
        description: newItem.description,
        price: 0,
        size: "string",
        weight: newItem.weight,
        createdDate: currentDateTime.toISOString(),
        updatedDate: currentDateTime.toISOString(),
        status: "buy back",
        gemStoneId: null,
        gemStone: null,
        brands: [],
        itemImages: [],
        collections: [],
        itemQuantity: 1
      };

      dispatch(addItem(newItemWithId));
      setIsModalVisible(false);
      setNewItem({ itemName: "", weight: "", accessoryType: "", description: "" });
      message.success("Sản phẩm mới đã được thêm vào giỏ hàng");
    } else {
      message.error("Vui lòng nhập đầy đủ thông tin sản phẩm");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewItem({ itemName: "", weight: "", accessoryType: "", description: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSelectChange = (value) => {
    setNewItem({ ...newItem, accessoryType: value });
  };

  const handleCreateOrder = () => {
    if (cartItems.length === 0) {
      message.error("Giỏ hàng trống. Không thể tạo đơn.");
    } else {
      navigate("/buy-back-page/Payment");
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
          <div className="cart-summary mt-6 bg-white p-6 pt-2 rounded-lg shadow-md  w-[49%]">
            <Button
              onClick={showAddItemModal}
              className="w-full h-14 bg-slate-600 text-white uppercase font-bold">
              Thêm sản phẩm khác
            </Button>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            <div>
              <Button onClick={handleCreateOrder} className="w-full h-14 bg-black text-white uppercase font-bold">
                Tạo Đơn
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Modal title="Thêm sản phẩm mới" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="Thêm" cancelText="Hủy">
        <Form layout="vertical">
          <Form.Item label="Tên hàng" required>
            <Input
              name="itemName"
              value={newItem.itemName}
              onChange={handleInputChange}
              placeholder="Nhập tên hàng"
            />
          </Form.Item>
          <Form.Item label="Trọng lượng" required>
            <Input
              name="weight"
              type="number"
              step="0.01"
              value={newItem.weight}
              onChange={handleInputChange}
              placeholder="Nhập trọng lượng"
            />
          </Form.Item>
          <Form.Item label="Loại trang sức" required>
            <Select
              value={newItem.accessoryType}
              onChange={handleSelectChange}
              placeholder="Chọn loại trang sức"
            >
              <Select.Option value="Nhẫn">Nhẫn</Select.Option>
              <Select.Option value="Dây chuyền">Dây chuyền</Select.Option>
              <Select.Option value="Vòng tay">Vòng tay</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Mô tả">
            <Input.TextArea
              name="description"
              value={newItem.description}
              onChange={handleInputChange}
              placeholder="Nhập mô tả"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductListBuyBack;





