import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, message, Select } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
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

const ProductList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const productData = useSelector((state) => state.product.productData);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartTotalQuantity = useSelector((state) => state.cart.cartTotalQuantity);
  const cartTotalAmount = useSelector((state) => state.cart.cartTotalAmount);
  const buyGold24k = useSelector((state) => state.goldPrice.sellPrice[0]?.sellGold24k);
  const buyGold18k = useSelector((state) => state.goldPrice.sellPrice[0]?.sellGold18k);
  const buyGold14k = useSelector((state) => state.goldPrice.sellPrice[0]?.sellGold14k);
  const buyGold10k = useSelector((state) => state.goldPrice.sellPrice[0]?.sellGold10k);
  const discountData = useSelector((state) => state.discount.discountData);
  const isLoadingDiscountData = useSelector((state) => state.discount.isLoadingDiscountData);
  const [discountDataSelect, setDiscountDataSelect] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

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

    const discountedAmount = cartTotalAmount * (1 - discountPercentage / 100);
    dispatch(updateTotals({ cartTotalQuantity, cartTotalAmount: discountedAmount }));
  }, [cartItems, buyGold10k, buyGold14k, buyGold18k, buyGold24k, discountPercentage, dispatch]);

  useEffect(() => {
    dispatch(fetchDiscountData());
    dispatch(fetchProductData());
  }, [dispatch]);

  useEffect(() => {
    setFilteredProducts(productData);
  }, [productData]);

  const discountOptions = discountData.map((item) => ({
    value: item.discountCode,
    label: `${item.discountPercentage}%`,
  }));

  const handleCreateOrder = () => {
    if (cartItems.length === 0) {
      message.error("Cart is empty. Cannot create order.");
    } else {
      navigate("/sales-page/Payment");
    }
  };

  const handleSearch = () => {
    setLoading(true);
    try {
      const trimmedQuery = searchQuery.replace(/\s/g, "").toLowerCase();
      const matchingItems = productData.filter(
        (product) =>
          product.itemId.replace(/\s/g, "").toLowerCase().includes(trimmedQuery) ||
          product.itemName.replace(/\s/g, "").toLowerCase().includes(trimmedQuery)
      );

      setFilteredProducts(matchingItems);

      if (matchingItems.length === 0) {
        message.error("Product not found. Please try again.");
      }
      setSearchQuery("");
    } catch (error) {
      message.error("Product not found. Please try again.");
      setSearchQuery("");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (itemId) => {
    dispatch(removeItem(itemId));
    message.success("Product removed from cart.");
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

  return (
    <div className="product-list-container">
      <div className="header">
        <h2 className="title">Jaegar Resto</h2>
        <div className="search-container">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for food, coffee, etc..."
            className="search-bar"
          />
          <Button onClick={handleSearch} loading={loading} className="search-btn">
            Search
          </Button>
        </div>
      </div>
      <div className="content">
        <div className="menu">
          <div className="menu-header">
            <span>Choose Dishes</span>
            <Select
              style={{ width: 200 }}
              onChange={handleChange}
              placeholder="Select discount"
              options={discountOptions}
              allowClear
            />
          </div>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div key={product.itemId} className="product-card">
                <img src={product.image} alt={product.itemName} className="product-image" />
                <h3 className="product-name">{product.itemName}</h3>
                <p className="product-price">{currencyFormatter.format(product.price)}</p>
                <Button
                  type="primary"
                  onClick={() => dispatch(addItem(product))}
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="cart">
          <h2>Orders</h2>
          {cartItems.map((item) => (
            <div key={item.itemId} className="cart-item">
              <span>{item.itemName}</span>
              <div className="quantity-controls">
                <Button onClick={() => handleDecrement(item.itemId)} className="quantity-btn">
                  <MinusOutlined />
                </Button>
                <span>{item.itemQuantity}</span>
                <Button onClick={() => handleIncrement(item.itemId)} className="quantity-btn">
                  <PlusOutlined />
                </Button>
              </div>
              <span className="item-price">{currencyFormatter.format(item.price)}</span>
              <Button type="primary" danger onClick={() => handleRemove(item.itemId)} className="remove-item-btn">
                Remove
              </Button>
            </div>
          ))}
          <div className="add-product">
            <Input placeholder="Enter Product ID" className="add-product-input" />
            <Button className="add-product-btn">Add to Cart</Button>
          </div>
          <div className="cart-summary">
            <div>
              <span>Total Quantity: </span>
              <span>{cartTotalQuantity}</span>
            </div>
            <div>
              <span>Total Amount: </span>
              <span>{currencyFormatter.format(cartTotalAmount)}</span>
            </div>
            <Button type="primary" onClick={handleCreateOrder} className="checkout-btn">
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
