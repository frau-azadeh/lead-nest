// src/features/purchase/purchaseThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';
import { PurchaseOrder } from '../../types/purchaseOrder';

export const fetchPurchaseOrders = createAsyncThunk<PurchaseOrder[], void, { rejectValue: string }>(
  'purchase/fetchPurchaseOrders',
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.from('purchase_orders').select('*');

    if (error || !data) {
      return rejectWithValue(error?.message || 'مشکل در دریافت سفارشات');
    }

    return data;
  }
);

export const createPurchaseOrder = createAsyncThunk<
  PurchaseOrder,
  { product: string; quantity: number },
  { rejectValue: string }
>('purchase/createPurchaseOrder', async ({ product, quantity }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from('purchase_orders')
    .insert([{ product, quantity, status: 'در انتظار' }])
    .select()
    .single();

  if (error || !data) {
    return rejectWithValue(error?.message || 'مشکل در ثبت سفارش');
  }

  return data;
});

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
    return rejectWithValue(error?.message || 'مشکل در بروزرسانی سفارش');
  }

  return data;
});
