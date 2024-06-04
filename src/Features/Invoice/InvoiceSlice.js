import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addinvoice } from '../../Services/api/InvoiceApi';
import { notification } from 'antd';

const initialState = {
  invoices: [],
  isLoading: false,
  error: null,
};

export const createInvoice = createAsyncThunk(
  'invoice/createInvoice',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await addinvoice(
        invoiceData.staffId,
        invoiceData.returnPolicyId,
        invoiceData.itemId,
        invoiceData.customerId,
        invoiceData.companyName,
        invoiceData.buyerAddress,
        invoiceData.status,
        invoiceData.paymentType,
        invoiceData.quantity,
        invoiceData.subTotal
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createInvoice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoices.push(action.payload);
        notification.success({
          message: 'Invoice created successfully!',
        });
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        notification.error({
          message: 'Failed to create invoice',
          description: action.payload.message,
        });
      });
  },
});

export default invoiceSlice.reducer;
