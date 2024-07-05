import { configureStore } from '@reduxjs/toolkit';
import productReducer, { fetchProductData } from '../Features/product/productSlice';
import cartReducer, { getTotals } from '../Features/product/cartSlice';
import productDetailReducer from '../Features/product/productdetailSlice';
import saleCustomerSLice from '../Features/Customer/customerSlice';
import productAddReducer from '../Features/product/productaddSlice'; 
import productDeleteReducer from '../Features/product/productdeleteSlice'; 
import customerReducer from '../Features/Customer/customerSlice';
import goldPriceReducer from '../Features/goldTransaction/goldTransactionSlice'
import DiscountReducer from '../Features/Discount/DiscountSlice'
import warrantyReducer from '../Features/Warranty/warrantyaddSlice';
import invoiceReducer from '../Features/Invoice/allinvoiceSlice';
import customerDetailReducer from '../Features/Customer/CustomerdetailSlice';
import warrantyAllReducer from '../Features/Warranty/warrantyallSlice';
import buyBackCartSlice from '../Features/buy-back/buyBackCartSlice';
import cartSlice from '../Features/product/cartSlice'
import invoicefullReducer from '../Features/Invoice/fullinvoiceSlice'
import buyBackCustomerSlice from '../Features/buy-back/buyBackCustomerSlice';
import userListReducer from '../Features/User/userListSlice';
import userAddReducer from '../Features/User/userAddSlice';
import rewardSlice from '../Features/Customer/rewardSlice';
import userEditReducer from '../Features/User/userEditSlice';
import rewardallSlice from '../Features/Customer/rewardallSlice';
import promotionReducer from '../Features/Promotion/promotionallSlice';
import itemImageReducer from '../Features/product/itemImageSlice';
const store = configureStore({
  reducer: {
    product: productReducer,
    buyBackCart: buyBackCartSlice,
    SaleCart: cartSlice,
    buyBackCustomer: buyBackCustomerSlice,
    cart: cartReducer,
    productDetail: productDetailReducer,
    customer: saleCustomerSLice,
    productAdd: productAddReducer, 
    productDelete: productDeleteReducer, 
    goldPrice: goldPriceReducer,
    discount: DiscountReducer,
    itemImages: itemImageReducer,
    warranty: warrantyReducer,
    invoice: invoiceReducer,
    customerDetail: customerDetailReducer,
    warrantyall: warrantyAllReducer,
    invoicefull: invoicefullReducer,
    user: userListReducer,
    userAdd: userAddReducer,
    reward:rewardSlice,
    rewardsAll:rewardallSlice,
    userEdit: userEditReducer,
    promotions: promotionReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});


store.dispatch(fetchProductData());

export default store;
