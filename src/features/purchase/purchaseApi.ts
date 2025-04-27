import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';
import { PurchaseOrder } from '../../types/purchaseOrder';

export const fetchPurchaseOrders = createAsyncThunk<PurchaseOrder[], void, { rejectValue: string }>(
  'purchase/fetchOrders',
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('*');

    if (error || !data) {
      return rejectWithValue(error?.message ?? 'خطا در دریافت سفارشات');
    }

    return data as PurchaseOrder[];
  }
);
