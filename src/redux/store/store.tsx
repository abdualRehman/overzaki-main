import { configureStore } from '@reduxjs/toolkit';
import customersReducer from './thunks/customers';
import categoryReducer from './thunks/category';
import productReducer from './thunks/products';
import voucherReducer from './thunks/defaultVouchers';
import locationReducer from './thunks/location';
import rolesReducer from './thunks/roles';
import ordersReducer from './thunks/defaultOrders';
import paymentMethodReducer from './thunks/paymentMethods';
import builderReducer from './thunks/builder';


const store = configureStore({
  reducer: {
    customers: customersReducer,
    category: categoryReducer,
    products: productReducer,
    vouchers: voucherReducer,
    locations: locationReducer,
    orders: ordersReducer,
    paymentMethods: paymentMethodReducer,
    roles: rolesReducer,
    builder: builderReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
