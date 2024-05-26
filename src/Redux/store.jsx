import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../Features/product/productSlice'; 
import cartReducer, { getTotals } from '../Features/product/cartSlice';
const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer
  },
});
store.dispatch(getTotals());
export default store;