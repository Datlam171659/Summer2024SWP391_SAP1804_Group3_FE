import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { notification } from "antd";
import { fetchDiscountData } from "../Discount/DiscountSlice";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  discount: 0,
};

export const fetchDiscount = createAsyncThunk(
  'cart/fetchDiscount',
  async () => {
    const response = await fetchDiscountData();
    return response.discountPercentage;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const existingIndex = state.cartItems.findIndex(
        (item) => item.itemId === action.payload.itemId
      );

      if (existingIndex >= 0) {
        state.cartItems[existingIndex] = {
          ...state.cartItems[existingIndex],
          cartQuantity: state.cartItems[existingIndex].cartQuantity + 1,
        };
      } else {
        let tempProductItem = { ...action.payload, cartQuantity: 1 };
        state.cartItems.push(tempProductItem);
        notification.success({
          message: "Sản phẩm đã được thêm vào giỏ hàng",
        });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      cartSlice.caseReducers.getTotals(state);
    },
    decreaseCart(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.itemId === action.payload.itemId
      );

      if (state.cartItems[itemIndex].cartQuantity > 1) {
        state.cartItems[itemIndex].cartQuantity -= 1;
      } else if (state.cartItems[itemIndex].cartQuantity === 1) {
        const nextCartItems = state.cartItems.filter(
          (item) => item.itemId !== action.payload.itemId
        );

        state.cartItems = nextCartItems;
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      cartSlice.caseReducers.getTotals(state);
    },
    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem.itemId !== action.payload.itemId
      );

      notification.success({
        message: "Sản phẩm đã được xóa khỏi giỏ hàng",
      });
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      cartSlice.caseReducers.getTotals(state);
    },
    getTotals(state) {
      let { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, cartQuantity } = cartItem;
          const itemTotal = price * cartQuantity;

          cartTotal.total += itemTotal;
          cartTotal.quantity += cartQuantity;

          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );
      total = parseFloat(total.toFixed(2));
      state.cartTotalQuantity = quantity;
      state.cartTotalAmount = total - (total * state.discount) / 100; 
    },
    clearCart(state) {
      if (state.cartItems.length === 0) {
        notification.info({
          message: "Không có sản phẩm trong giỏ hàng ",
        });
      } else {
        state.cartItems = [];
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        notification.success({
          message: "Hoàn tất thanh toán",
          duration: 2,
        });
        cartSlice.caseReducers.getTotals(state);
      }
    },
    applyDiscount(state, action) {
      state.discount = action.payload;
      cartSlice.caseReducers.getTotals(state);
    },
    resetDiscount: (state) => {
      state.discount = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDiscount.fulfilled, (state, action) => {
      state.discount = action.payload;
      cartSlice.caseReducers.getTotals(state);
    });
  },
});

export const { addToCart, decreaseCart, removeFromCart, getTotals, clearCart, applyDiscount,resetDiscount } = cartSlice.actions;

export default cartSlice.reducer;
