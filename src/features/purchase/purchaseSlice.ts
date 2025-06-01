import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';
import { PurchaseOrder } from '../../types/purchaseOrder';

interface PurchaseState {
  orders: PurchaseOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: PurchaseState = {
  orders: [],
  loading: false,
  error: null,
};
// دریافت سفارشات خرید
export const fetchPurchaseOrders = createAsyncThunk<PurchaseOrder[], void, { rejectValue: string }>(
  'purchase/fetchPurchaseOrders',
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) {
      return rejectWithValue(error?.message || 'خطا در دریافت سفارشات');
    }
    return data;
  }
);

// بروزرسانی وضعیت سفارش
export const updatePurchaseOrderStatus = createAsyncThunk<
  PurchaseOrder,
  { id: string; status: string },
  { rejectValue: string }
>('purchase/updatePurchaseOrderStatus', async ({ id, status }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from('purchase_orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error || !data) {
    return rejectWithValue(error?.message || 'خطا در تغییر وضعیت سفارش');
  }
  return data;
});

export const createPurchaseOrder = createAsyncThunk<
  PurchaseOrder,
  { product: string; quantity: number; status: string },
  { rejectValue: string }
>('purchase/createPurchaseOrder', async (orderData, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from('purchase_orders')
    .insert([orderData])
    .select()
    .single();
  if (error || !data) {
    return rejectWithValue(error?.message || 'خطا در ثبت سفارش');
  }
  return data;
});

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'خطا';
      })
      .addCase(updatePurchaseOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      });
  },
});

export default purchaseSlice.reducer;
