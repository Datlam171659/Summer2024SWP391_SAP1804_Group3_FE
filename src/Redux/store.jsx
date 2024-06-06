import { configureStore } from '@reduxjs/toolkit';
import productReducer, { fetchProductData } from '../Features/product/productSlice'; 
import cartReducer, { getTotals } from '../Features/product/cartSlice';
import productDetailReducer from '../Features/product/productdetailSlice';
import customerReducer from '../Features/Customer/customerSlice';
import productAddReducer from '../Features/product/productaddSlice'; 
import productDeleteReducer from '../Features/product/productdeleteSlice'; 
import goldPriceReducer from '../Features/goldTransaction/goldTransactionSlice'
import DiscountReducer from '../Features/Discount/DiscountSlice'
import warrantyReducer from '../Features/Warranty/warrantyaddSlice';
import invoiceReducer from '../Features/Invoice/allinvoiceSlice';
import customerDetailReducer from '../Features/Customer/CustomerdetailSlice';
import warrantyAllReducer from '../Features/Warranty/warrantyallSlice';
import buyBackCartSlice from '../Features/buy-back/buyBackCartSlice';
import invoicefullReducer from '../Features/Invoice/fullinvoiceSlice'
const store = configureStore({
  reducer: {
    product: productReducer,
    buyBackCart: buyBackCartSlice,
    cart: cartReducer,
    productDetail: productDetailReducer,
    customer: customerReducer,
    productAdd: productAddReducer, 
    productDelete: productDeleteReducer, 
    goldPrice: goldPriceReducer,
    discount:DiscountReducer,
    warranty: warrantyReducer,
    invoice: invoiceReducer,
    customerDetail: customerDetailReducer,
    warrantyall: warrantyAllReducer,
    invoicefull:invoicefullReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), 
});


store.dispatch(fetchProductData());
store.dispatch(getTotals());

export default store;
