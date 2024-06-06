import { configureStore } from '@reduxjs/toolkit';
import productReducer, { fetchProductData } from '../Features/product/productSlice'; 
import cartReducer, { getTotals } from '../Features/product/cartSlice';
import productDetailReducer from '../Features/product/productdetailSlice';
import customerReducer from '../Features/Customer/customerSlice';
import productAddReducer from '../Features/product/productaddSlice'; 
import productDeleteReducer from '../Features/product/productdeleteSlice'; 
import productdetailReducer from '../Features/product/productdetailSlice'
import goldPriceReducer from '../Features/goldTransaction/goldTransactionSlice'
import buyBackCartSlice from '../Features/buy-back/buyBackCartSlice';
import buyBackCustomerSlice from '../Features/buy-back/buyBackCustomerSlice';

const store = configureStore({
  reducer: {
    product: productReducer,
    buyBackCart: buyBackCartSlice,
    buyBackCustomer: buyBackCustomerSlice,
    cart: cartReducer,
    productDetail: productDetailReducer,
    customer: customerReducer,
    productAdd: productAddReducer, 
    productDelete: productDeleteReducer, 
    goldPrice: goldPriceReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), 
});


store.dispatch(fetchProductData());
store.dispatch(getTotals());

export default store;
