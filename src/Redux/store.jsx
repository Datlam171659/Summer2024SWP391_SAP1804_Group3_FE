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
import buyBackCustomerSlice from '../Features/buy-back/buyBackCustomerSlice';
import userListReducer from '../Features/User/userListSlice';
import userAddReducer from '../Features/User/userAddSlice';

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
    goldPrice: goldPriceReducer,
    discount: DiscountReducer,
    warranty: warrantyReducer,
    invoice: invoiceReducer,
    customerDetail: customerDetailReducer,
    warrantyall: warrantyAllReducer,
    invoicefull: invoicefullReducer,
    user: userListReducer,
    userAdd: userAddReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});


store.dispatch(fetchProductData());
store.dispatch(getTotals());

export default store;
