// src/features/purchase/purchaseSlice.ts

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

// ✅ گرفتن سفارشات
export const fetchPurchaseOrders = createAsyncThunk<
  PurchaseOrder[],
  void,
  { rejectValue: string }
>(
  'purchase/fetchPurchaseOrders',
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.from('purchase_orders').select('*');
    if (error || !data) {
      return rejectWithValue(error?.message || 'مشکل در دریافت سفارشات');
    }
    return data as PurchaseOrder[];
  }
);

// ✅ آپدیت وضعیت سفارش
export const updatePurchaseOrderStatus = createAsyncThunk<
  PurchaseOrder,
  { id: string; status: string },
  { rejectValue: string }
>(
  'purchase/updatePurchaseOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from('purchase_orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return rejectWithValue(error?.message || 'خطا در آپدیت سفارش');
    }
    return data as PurchaseOrder;
  }
);

// ✅ ثبت سفارش جدید
export const createPurchaseOrder = createAsyncThunk<
  PurchaseOrder,
  { product: string; quantity: number },
  { rejectValue: string }
>(
  'purchase/createPurchaseOrder',
  async ({ product, quantity }, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from('purchase_orders')
      .insert([
        {
          product,
          quantity,
          status: 'در انتظار', // 👈 اینجا خودمون مقدار `status` رو میذاریم
        }
      ])
      .select()
      .single();

    if (error || !data) {
      return rejectWithValue(error?.message || 'خطا در ثبت سفارش');
    }
    return data as PurchaseOrder;
  }
);

// Slice
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
        state.error = action.payload || 'خطا در دریافت سفارشات';
      })

      .addCase(updatePurchaseOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order.id === updatedOrder.id ? { ...order, status: updatedOrder.status } : order
        );
      })

      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      });
  },
});

export default purchaseSlice.reducer;
