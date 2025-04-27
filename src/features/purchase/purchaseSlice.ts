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

// گرفتن لیست سفارش‌ها
export const fetchPurchaseOrders = createAsyncThunk<
  PurchaseOrder[],
  void,
  { rejectValue: string }
>('purchase/fetchPurchaseOrders', async (_, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    return rejectWithValue(error?.message || 'خطا در دریافت سفارش‌ها');
  }

  return data as PurchaseOrder[];
});

// به‌روزرسانی وضعیت سفارش
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
    return rejectWithValue(error?.message || 'خطا در به‌روزرسانی سفارش');
  }

  return data as PurchaseOrder;
});

export const createPurchaseOrder = createAsyncThunk<
  PurchaseOrder,
  { product: string; quantity: number },
  { rejectValue: string }
>(
  'purchase/createPurchaseOrder',
  async ({ product, quantity }, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from('purchase_orders')
      .insert([{ product, quantity, status: 'در انتظار' }])
      .select()
      .single();

    if (error || !data) {
      return rejectWithValue(error?.message || 'خطا در ثبت سفارش جدید');
    }

    return data as PurchaseOrder;
  }
);


// ثبت سفارش جدید


const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'خطا در دریافت سفارش‌ها';
      })
      .addCase(updatePurchaseOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order.id === updatedOrder.id ? { ...order, status: updatedOrder.status } : order
        );
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload); // سفارش جدید رو بیار اول لیست
      });
  },
});

export default purchaseSlice.reducer;
