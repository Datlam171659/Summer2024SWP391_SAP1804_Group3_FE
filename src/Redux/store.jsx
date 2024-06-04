import { configureStore } from '@reduxjs/toolkit';
import productReducer, { fetchProductData } from '../Features/product/productSlice'; 
import cartReducer, { getTotals } from '../Features/product/cartSlice';
import productDetailReducer from '../Features/product/productdetailSlice';
import customerReducer from '../Features/Customer/customerSlice';
import productAddReducer from '../Features/product/productaddSlice'; 
import productDeleteReducer from '../Features/product/productdeleteSlice'; 
import goldPriceReducer from '../Features/goldTransaction/goldTransactionSlice'
import DiscountReducer from '../Features/Discount/DiscountSlice'
const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    productDetail: productDetailReducer,
    customer: customerReducer,
    productAdd: productAddReducer, 
    productDelete: productDeleteReducer, 
    goldPrice: goldPriceReducer,
    discount:DiscountReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), 
});


store.dispatch(fetchProductData());
store.dispatch(getTotals());

export default store;
