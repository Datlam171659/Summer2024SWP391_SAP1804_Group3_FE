import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, message, Select, Spin, Modal, Form,Table } from "antd";
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
import "./ProductListSale.scss";
import { Html5QrcodeScanner } from "html5-qrcode";
import { fetchCustomerData } from "../../Features/Customer/customerSlice";
import { updateCustomerInfo } from "../../Features/product/cartSlice";
import SalepageApi from "../../Features/Salepage/SalepageApi";
import { requestPromotionCus } from "../../Features/Promotion/promotionSlice";
import { fetchPromotions } from "../../Features/Promotion/promotionallSlice";
import { fetchRewardAll } from "../../Features/Customer/rewardallSlice";
import { fetchItemImages } from "../../Features/product/itemImageSlice";
import { fetchRewardDetail } from '../../Features/Customer/rewardDetailSlice';

const ProductList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const productData = useSelector((state) => state.product.productData);
  const images = useSelector((state) => state.itemImages.images);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isScanModalVisible, setIsScanModalVisible] = useState(false);
  const [productIdInput, setProductIdInput] = useState("");
  const isLoadingPromotion = useSelector(
    (state) => state.promotions.isLoadingPromotion
  );
  const { rewardsallData, loading: rewardsLoading } = useSelector(
    (state) => state.rewardsAll
  );
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
  const customerData = useSelector((state) => state.customer.customerData);
  const isLoading = useSelector((state) => state.customer.isLoading);
  const customerInfor = useSelector((state) => state.cart.customerInfor);
  const [customerType, setCustomerType] = useState("newCustomer");
  const [searchedCustomer, setSearchedCustomer] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerGender, setCustomerGender] = useState("Nam");
  const [customerAddress, setCustomerAddress] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [discountPct, setDiscountPct] = useState("");
  const [description, setDescription] = useState("");
  const [isDiscountModalVisible, setIsDiscountModalVisible] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const promotions = useSelector((state) => state.promotions.promotions);
  const [promotionDataSelect, setPromotionDataSelect] = useState("");
  const [promotionPercentage, setPromotionPercentage] = useState(0);
  const { rewardDetail: rewards, isrewardetailError, loading: isrewardLoading } = useSelector(state => state.rewards);
  const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const messageTimeout = 3000;
  let lastMessageTime = null;
  useEffect(() => {
    dispatch(fetchPromotions());
    dispatch(fetchItemImages());
  }, [dispatch]);
  const calculateRewardLevel = (points) => {
    if (points >= 1000) return "Vũ Trụ";
    if (points >= 100) return "Kim Cương";
    if (points >= 50) return "Vàng";
    if (points >= 10) return "Bạc";
    return "Chưa xếp hạng";
  };
  const customerRewards =
    customerInfor && rewardsallData
      ? rewardsallData.filter(
          (reward) => reward.customerId === customerInfor.id
        )
      : [];
  const hasRewards = customerRewards.length > 0;
  console.log(customerRewards);

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
    const discountedAmount = cartTotalAmount * (1 - promotionPercentage / 100);
    dispatch(
      updateTotals({ cartTotalQuantity, cartTotalAmount: discountedAmount })
    );
  }, [
    cartItems,
    buyGold10k,
    buyGold14k,
    buyGold18k,
    buyGold24k,
    promotionPercentage,
    dispatch,
  ]);
  const handleProductIdChange = (e) => {
    setProductIdInput(e.target.value);
  };
  console.log(productIdInput)

  const showMessageError = (messageText) => {
    const now = Date.now();
    if (!lastMessageTime || now - lastMessageTime > messageTimeout) {
      message.error(messageText);
      lastMessageTime = now;
    }
  };

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find((item) => item.itemId === product.itemId);
    if (existingItem && existingItem.itemQuantity >= product.quantity) {
      showMessageError(`Bạn đã đạt số lượng tối đa cho sản phẩm ${product.itemName}`);
      return;
    }
    dispatch(addItem(product));
    message.success("Sản phẩm đã được thêm vào giỏ hàng");
  };
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "customerName":
        setCustomerName(value);
        break;
      case "address":
        setCustomerAddress(value);
        break;
      case "gender":
        setCustomerGender(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      case "email":
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
    const openDiscountModal = () => {
      setIsDiscountModalVisible(true);
      dispatch(fetchPromotions());
    };
    const closeDiscountModal = () => {
      setIsDiscountModalVisible(false);
    };
    const foundCustomer = customerData.find(
      (customer) =>
        customer.phoneNumber === phoneNumber && customer.status === "active"
    );
    if (foundCustomer) {
      setSearchedCustomer(foundCustomer);
      dispatch(updateCustomerInfo(foundCustomer));
      dispatch(fetchRewardDetail(foundCustomer.id));
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
      message.error(`Có lỗi xảy ra: ${error.response.data.message}`);
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

  const handleSelectChange = (value) => {
    setCustomerType(value);
    handleCancel();
  };
  useEffect(() => {
    dispatch(fetchDiscountData());
    dispatch(fetchProductData());
    dispatch(fetchCustomerData());
  }, [dispatch]);

  useEffect(() => {
      setFilteredProducts(productData);
  }, [productData]);
console.log(filteredProducts)
  useEffect(() => {
    if (!isScanModalVisible) return;

    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    const success = (result) => {
      scanner.clear();
      setIsScanModalVisible(false);

      const scannedQuery = result.replace(/\s/g, "").toLowerCase();
      const matchedProduct = productData.find(
        (product) =>
          product.itemId.replace(/\s/g, "").toLowerCase() === scannedQuery ||
          product.itemName.replace(/\s/g, "").toLowerCase() === scannedQuery
      );

      if (matchedProduct) {
        dispatch(addItem(matchedProduct));
        message.success("Sản phẩm đã được thêm vào giỏ hàng");
      } else {
        message.error("Không tìm thấy sản phẩm với mã QR này");
      }
    };

    const error = (err) => {
      console.warn(err);
    };

    scanner.render(success, error);

    return () => {
      scanner.clear();
    };
  }, [isScanModalVisible, productData, dispatch]);

  const discountOptions = promotions
    .filter(
      (item) =>
        customerInfor &&
        item.cusId === customerInfor.id &&
        item.status === "Duyệt"
    )
    .map((item) => ({
      value: item.id,
      label: `${item.discountPct}%`,
    }));
  const handleCreateOrder = () => {
    if (cartItems.length === 0) {
      message.error("Giỏ hàng trống. Không thể tạo đơn");
    } else if (
      !customerInfor ||
      !customerInfor.customerName ||
      !customerInfor.phoneNumber
    ) {
      message.error("Vui lòng nhập thông tin khách hàng trước khi thanh toán");
    } else {
      navigate("/sales-page/Payment");
    }
  };
  const openDiscountModal = () => {
    setIsDiscountModalVisible(true);
    dispatch(fetchPromotions());
  };

  const closeDiscountModal = () => {
    setIsDiscountModalVisible(false);
  };
  const handleSearch = () => {
    setLoading(true);
    try {
      const trimmedQuery = searchQuery.replace(/\s/g, "").toLowerCase();
      const matchingItems = productData.filter(
        (product) =>
          product.itemId
            .replace(/\s/g, "")
            .toLowerCase()
            .includes(trimmedQuery) ||
          product.itemName
            .replace(/\s/g, "")
            .toLowerCase()
            .includes(trimmedQuery)
      );

      setFilteredProducts(matchingItems);

      if (matchingItems.length === 0) {
        message.error("Không tìm thấy sản phẩm .Hãy thử lại.");
      }
      setSearchQuery("");
    } catch (error) {
      message.error("Không tìm thấy sản phẩm .Hãy thử lại.");
      setSearchQuery("");
    } finally {
      setLoading(false);
    }
  };
  const handleOk = async () => {
    const discountId = `DISC8`;

    const discountData = {
      id: discountId,
      code: "DISCOUNT_CODE",
      discountPct,
      status: "Chờ duyệt",
      description,
      cusID: customerInfor.id,
    };

    try {
      await dispatch(requestPromotionCus(discountData)).unwrap();
      message.success("Yêu cầu giảm giá thành công!");
      fetchPromotions()
      setIsModalVisible(false);
    } catch (error) {
      message.error(`Yêu cầu giảm giá thất bại: ${error.message}`);
    }
  };
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleRemove = (itemId) => {
    dispatch(removeItem(itemId));
    message.success("Sản phẩm đã bị xóa khỏi giỏ hàng");
  };

  useEffect(() => {
    setPromotionDataSelect('');
    setPromotionPercentage(0);
  }, [promotions]);
  
  const handleChange = (value) => {
    if (value === undefined) {
      setPromotionDataSelect('');
      setPromotionPercentage(0);
    } else {
      setPromotionDataSelect(value);
      const selectedDiscount = promotions.find(
        (discount) => discount.id === value
      );
      if (selectedDiscount) {
        setPromotionPercentage(selectedDiscount.discountPct);
      }
    }
  };

  const handleIncrement = (itemId) => {
    const item = cartItems.find((item) => item.itemId === itemId);
    if (!item) {
      return; 
    }
    if (item.itemQuantity >= item.quantity) {
      showMessageError(`Bạn đã đạt số lượng tối đa cho sản phẩm ${item.itemName}`);
      return;
    }
    dispatch(incrementQuantity(itemId));
  };
  
  const handleDecrement = (itemId) => {
    const item = cartItems.find((item) => item.itemId === itemId);
    if (!item) {
      return;
    }
    if (item.itemQuantity <= 1) {
      showMessageError(`Số lượng không thể nhỏ hơn 1 cho sản phẩm ${item.itemName}`);
      return;
    }
    dispatch(decrementQuantity(itemId));
  };

  return (
    <div className="product-list-container">
      <div className="header">
        <h2 className="title">Cửa hàng trang sức</h2>
        <div className="search-container">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm cho vàng,bạc,kim cương...."
            className="search-bar"
          />
          <Button
            onClick={handleSearch}
            loading={loading}
            className=" bg-black text-white"
          >
            Tìm kiếm
          </Button>
          <Button
            type="default"
            className="ml-2 flex items-center"
            style={{ fontWeight: "600", height: "30px" }}
            onClick={() => setIsScanModalVisible(true)}
          >
            <ScanOutlined className="mr-2" />
            Quét QR
          </Button>
        </div>
      </div>
      <div className="content">
        <div className="menu">
          <div className="menu-header"></div>
          <div className="product-grid flex align-middle justify-center text-center"> 
            {filteredProducts.filter(
      (product) =>
        product.quantity >0
    ).map((product) => (
              <div key={product.itemId} className="product-card">
                 <img
                  src={
                    images.find((image) => image.itemId === product.itemId)?.imageUrl ||
                    "default.jpg"
                  }
                  alt={product.itemName}
                />
                <h3 className="product-name">{product.itemName}</h3>
                <p>Số lượng: {product.quantity}</p>
                <p>
              Giá:{" "}
              {currencyFormatter.format(
                product.itemName.toLowerCase().includes("10k")
                  ? product.weight * buyGold10k
                  : product.itemName.toLowerCase().includes("14k")
                  ? product.weight * buyGold14k
                  : product.itemName.toLowerCase().includes("18k")
                  ? product.weight * buyGold18k
                  : product.itemName.toLowerCase().includes("24k")
                  ? product.weight * buyGold24k
                  : 0
              )}
            </p>
                <Button
                  type="primary"
                  onClick={() => handleAddToCart(product)}
                  className="add-to-cart-btn"
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="cart">
          <h2>Đơn hàng</h2>
          <div>
            <Button
              type="primary"
              onClick={showModal}
              className=" bg-black text-white"
            >
              Yêu Cầu Giảm Giá
            </Button>
            <Button onClick={openDiscountModal} disabled={customerType === "newCustomer"}>
  Chọn giảm giá
</Button>
            <Modal
              title="Yêu Cầu Giảm Giá"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleModalCancel}
            >
              <Form layout="vertical">
                <Form.Item label="Phần Trăm Giảm Giá" required>
                  <Input
                    value={discountPct}
                    onChange={(e) => setDiscountPct(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Nội dung" required>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
              </Form>
            </Modal>
          </div>
          <div className="customer-info bg-white p-4 rounded-lg mb-4">
            <div className="flex items-center mb-[15px]">
              <span className="block min-w-[150px] font-medium">
                Loại khách hàng
              </span>
              <Select
                value={customerType}
                onChange={handleSelectChange}
                className="w-[130px]"
              >
                <Select.Option value="newCustomer">Khách mới</Select.Option>
                <Select.Option value="member">Thành viên</Select.Option>
              </Select>
            </div>
            {customerType === "member" && (
              <div className="member-info">
                <div className="flex items-center mb-[15px]">
                  <span className="block min-w-[150px] font-medium">
                    Số điện thoại
                  </span>
                  <Input
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={handleInputChange}
                    className="rounded-[5px]"
                  />
                  <Button onClick={handleSearchClick} className="ml-2">
                    Tìm kiếm
                  </Button>
                </div>
                {isLoading ? (
                  <Spin className="ml-[100px]" />
                ) : (
                  searchedCustomer && (
                    <div className="customer-details ml-[0]">
                      <p className='my-3 text-xl'>
                        <strong>Tên:</strong> {searchedCustomer.customerName}
                      </p>
                      <p className='my-3 text-xl'>
                        <strong>Địa chỉ:</strong> {searchedCustomer.address}
                      </p>
                      <p className='my-3 text-xl'>
                        <strong>Giới tính:</strong> {searchedCustomer.gender}
                      </p>
                      <p className='my-3 text-xl'>
                        <strong>Email:</strong> {searchedCustomer.email}
                      </p>
                        <strong>Điểm :</strong> {rewards ? rewards.pointsTotal : 'N/A'}
                      <p className='my-3 text-xl'>
                        <strong>Hạng của khách hàng là:</strong> {rewards ? calculateRewardLevel(rewards.pointsTotal) : 'N/A'}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
            {customerType === "newCustomer" && (
              <div className="new-customer">
                <div className="flex items-center mb-[15px]">
                  <span className="block min-w-[150px] font-medium">
                    Tên khách hàng
                  </span>
                  <Input
                    name="customerName"
                    value={customerName}
                    onChange={handleInputChange}
                    className="rounded-[5px]"
                  />
                </div>
                <div className="flex items-center mb-[15px]">
                  <span className="block min-w-[150px] font-medium">
                    Địa chỉ
                  </span>
                  <Input
                    name="address"
                    value={customerAddress}
                    onChange={handleInputChange}
                    className="rounded-[5px]"
                  />
                </div>
                <div className="flex items-center mb-[15px]">
                  <span className="block min-w-[150px] font-medium">
                    Giới tính
                  </span>
                  <Select
                    name="gender"
                    value={customerGender}
                    onChange={(value) => setCustomerGender(value)}
                    className="rounded-[5px]"
                  >
                    <Select.Option value="Nam">Nam</Select.Option>
                    <Select.Option value="Nữ">Nữ</Select.Option>
                    <Select.Option value="Khác">Khác</Select.Option>
                  </Select>
                </div>
                <div className="flex items-center mb-[15px]">
                  <span className="block min-w-[150px] font-medium">
                    Số điện thoại
                  </span>
                  <Input
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={handleInputChange}
                    className="rounded-[5px]"
                  />
                </div>
                <div className="flex items-center mb-[15px]">
                  <span className="block min-w-[150px] font-medium">Email</span>
                  <Input
                    name="email"
                    value={customerEmail}
                    onChange={handleInputChange}
                    className="rounded-[5px]"
                  />
                </div>
                <div className="flex justify-center">
                  <Button onClick={handleSubmit} className="mx-2">
                    Tạo mới
                  </Button>
                  <Button onClick={handleCancel} className="mx-2">
                    Hủy
                  </Button>
                </div>
              </div>
            )}
          </div>
          {cartItems.map((item) => (
            <div key={item.itemId} className="cart-item">
              <span>{item.itemName}</span>
              <div className="quantity-controls">
                <Button
                  onClick={() => handleDecrement(item.itemId)}
                  className="quantity-btn"
                >
                  <MinusOutlined />
                </Button>
                <span>{item.itemQuantity}</span>
                <Button
                  onClick={() => handleIncrement(item.itemId)}
                  className="quantity-btn"
                >
                  <PlusOutlined />
                </Button>
              </div>
              <span className="item-price">
              {currencyFormatter.format(
                item.itemName.toLowerCase().includes("10k")
                  ? item.weight * buyGold10k
                  : item.itemName.toLowerCase().includes("14k")
                  ? item.weight * buyGold14k
                  : item.itemName.toLowerCase().includes("18k")
                  ? item.weight * buyGold18k
                  : item.itemName.toLowerCase().includes("24k")
                  ? item.weight * buyGold24k
                  : 0
              )}
              </span>
              <Button
                type="primary"
                danger
                onClick={() => handleRemove(item.itemId)}
                className="remove-item-btn"
              >
                Xóa
              </Button>
            </div>
          ))}
          <div className="add-product">
          <Input
      value={productIdInput}
      onChange={handleProductIdChange}
      placeholder="Nhập mã sản phẩm"
      className="w-[130px] mb-2"
    />
    <Button
      className="bg-black text-white"
      onClick={handleAddToCart}
    >
      Thêm vào giỏ hàng
    </Button>
          </div>
          <div className="cart-summary">
            <div>
              <span>Tổng số lượng: </span>
              <span>{cartTotalQuantity}</span>
            </div>
            <div>
              <span>Tổng giá: </span>
              <span>{currencyFormatter.format(cartTotalAmount)}</span>
            </div>
            <Button
              type="primary"
              onClick={handleCreateOrder}
              className="w-full text-center bg-black text-white"
            >
              Thanh Toán
            </Button>
          </div>
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
        <div id="reader"></div>
      </Modal>
      <Modal
        visible={isDiscountModalVisible}
        onCancel={() => setIsDiscountModalVisible(false)}
        onOk={closeDiscountModal}
      >
        <Form>
          <Form.Item label="Chọn mã giảm giá">
            <Select
              style={{ width: 200 }}
              onChange={handleChange}
              placeholder="Chọn mã giảm giá"
              loading={isLoadingPromotion}
              options={discountOptions}
              allowClear
              onDropdownVisibleChange={(open) => {
                if (open) {
                  dispatch(fetchPromotions());
                }
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductList;
