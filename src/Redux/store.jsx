import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../Features/product/productSlice'; 
import cartReducer, { getTotals } from '../Features/product/cartSlice';
import productdetailReducer from '../Features/product/productdetailSlice'
const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    productDetail:productdetailReducer,
  },
  middlewares: (configmdw) => configmdw()
});
store.dispatch(getTotals());
export default store;