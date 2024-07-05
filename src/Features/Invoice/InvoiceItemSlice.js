import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createInvoice } from'../../Services/api/InvoiceApi';
export const createInvoiceWithItems = createAsyncThunk(
  'invoice/createInvoiceWithItems',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await createInvoice(
        invoiceData.staffId,
        invoiceData.customerId,
        invoiceData.companyName,
        invoiceData.buyerName,
        invoiceData.buyerAddress,
        invoiceData.status,
        invoiceData.paymentType,
        invoiceData.quantity,
        invoiceData.subtotal,
        invoiceData.createdDate,
        invoiceData.items,
        invoiceData.returnPolicyId 
      )
   
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: {
    invoice: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createInvoiceWithItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createInvoiceWithItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.invoice = action.payload;
      })
      .addCase(createInvoiceWithItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default invoiceSlice.reducer;