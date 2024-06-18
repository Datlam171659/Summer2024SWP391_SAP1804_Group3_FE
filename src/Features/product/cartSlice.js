import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDiscountData } from "../Discount/DiscountSlice";

const initialState = {
  cartItems: [],
  customerInfo: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  discount: 0,
};

// Async thunk to fetch discount data
export const fetchDiscount = createAsyncThunk(
  'cart/fetchDiscount',
  async () => {
    const response = await fetchDiscountData();
    return response.discountPercentage;
  }
);

// Utility function to calculate total amount with discount
function calculateTotalAmount(cartItems, discount) {
  return cartItems.reduce((acc, item) => {
    const itemTotalPrice = item.price * item.itemQuantity * (1 - discount / 100);
    return acc + itemTotalPrice;
  }, 0);
}

const cartSlice = createSlice({
  name: 'SaleCart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = { ...action.payload, itemQuantity: 1 };
      const itemExists = state.cartItems.some(item => item.itemId === newItem.itemId);
      if (!itemExists) {
        state.cartItems.push(newItem);
      }
    },
    removeItem: (state, action) => {
      const itemIdToRemove = action.payload;
      state.cartItems = state.cartItems.filter(item => item.itemId !== itemIdToRemove);
    },
    incrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.cartItems.find(item => item.itemId === itemId);
      if (item) {
        item.itemQuantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.cartItems.find(item => item.itemId === itemId);
      if (item) {
        item.itemQuantity -= 1;
        if (item.itemQuantity < 1) {
          state.cartItems = state.cartItems.filter(item => item.itemId !== itemId);
        }
      }
    },
    updateTotals: (state, action) => {
      state.cartTotalQuantity = action.payload.cartTotalQuantity;
      state.cartTotalAmount = action.payload.cartTotalAmount;
    },
    applyDiscount(state, action) {
      state.discount = action.payload;
      state.cartTotalAmount = calculateTotalAmount(state.cartItems, state.discount);
    },
    resetDiscount(state) {
      state.discount = 0;
      state.cartTotalAmount = calculateTotalAmount(state.cartItems, state.discount);
    },
    updateCustomerInfo(state, action) {
      state.customerInfor = action.payload;
    },
    resetCart(state) {
      state.cartItems = [];
      state.customerInfo = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
      state.discount = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDiscount.fulfilled, (state, action) => {
      state.discount = action.payload;
      state.cartTotalAmount = calculateTotalAmount(state.cartItems, state.discount);
    });
  },
});

export const { addItem, removeItem, incrementQuantity, decrementQuantity, updateTotals, updateCustomerInfo, resetCart, applyDiscount, resetDiscount } = cartSlice.actions;
export default cartSlice.reducer;
