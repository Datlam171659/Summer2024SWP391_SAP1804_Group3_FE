import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  customerInfor: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

const buyBackCartSlice = createSlice({
  name: 'buyBackCart',
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
    updateCustomerInfo(state, action) {
      state.customerInfor = action.payload;
    },
    resetCart: (state) => {
      state.cartItems = [];
      state.customerInfor = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
    },
  },
});

export const { addItem, removeItem, incrementQuantity, decrementQuantity, updateTotals, updateCustomerInfo, resetCart } = buyBackCartSlice.actions;
export default buyBackCartSlice.reducer;
