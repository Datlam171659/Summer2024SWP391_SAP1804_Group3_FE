import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getCustomerAll} from '../../Services/api/CustomerSApi'
export const fetchCustomerData = createAsyncThunk(
  "fetchCustomerData",
  async () => {
  const response = await getCustomerAll();
  return response.data
  }
);
const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    customerData: [],
    isLoadingCustomerData: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerData.pending, (state,action) => {
       state.isLoadingCustomerData=true;
       state.isError=false;
      })
      .addCase(fetchCustomerData.fulfilled, (state, action) => {
        state.customerData = action.payload;
        state.isLoadingCustomerData = false;
        state.isError=false;
      })
      .addCase(fetchCustomerData.rejected, (state) => {
        state.isError = true;
        state.isLoadingCustomerData = false;
      });
  },
});

export default customerSlice.reducer;
