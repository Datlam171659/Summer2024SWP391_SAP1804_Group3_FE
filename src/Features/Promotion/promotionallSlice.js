import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { promotionAll, approvePromotionCus, deletePromotion } from '../../Services/api/promotionApi';
import { deleteToken } from 'firebase/messaging';

export const fetchPromotions = createAsyncThunk(
  'promotions/fetchPromotions',
  async () => {
    const response = await promotionAll();
    return response.data;
  }
);

export const approvePromotion = createAsyncThunk(
  'promotions/approvePromotion',
  async (id, { dispatch }) => {
    await approvePromotionCus(id);
    dispatch(fetchPromotions());
    return id;
  }
);

export const removePromotion = createAsyncThunk(
  'promotions/deletePromotion',
  async (id, { dispatch }) => {
    await deletePromotion(id);
    dispatch(fetchPromotions());
    return id;
  }
);

const promotionSlice = createSlice({
  name: 'promotions',
  initialState: {
    promotions: [],
    isLoadingPromotion: false,
    status: 'idle',
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchPromotions.pending, (state,action) => {
      state.isLoadingPromotion=true;
      state.isError=false;
     })
     .addCase(fetchPromotions.fulfilled, (state, action) => {
       state.promotions = action.payload;
       state.isLoadingPromotion = false;
       state.isError=false;
     })
     .addCase(fetchPromotions.rejected, (state) => {
       state.isError = true;
       state.isLoadingPromotion = false;
     })
      .addCase(approvePromotion.fulfilled, (state, action) => {
        const index = state.promotions.findIndex(promo => promo.id === action.payload);
        if (index !== -1) {
          state.promotions[index].status = 'approved';
        }
      })
        .addCase(removePromotion.fulfilled, (state, action) => {
        state.promotions = state.promotions.filter(promo => promo.id !== action.payload); 
      });
  }
});

export default promotionSlice.reducer;
