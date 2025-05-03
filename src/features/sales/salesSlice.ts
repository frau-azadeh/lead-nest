import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';
import { LeadWithProduct } from '../../types/LeadWithProduct';

interface SalesState {
  sales: LeadWithProduct[];
  loading: boolean;
  error: string | null;
}

const initialState: SalesState = {
  sales: [],
  loading: false,
  error: null,
};

export const fetchSales = createAsyncThunk<LeadWithProduct[]>(
  'sales/fetchSales',
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.from('leads').select('*');
    if (error) return rejectWithValue(error.message);
    return data as LeadWithProduct[];
  }
);

export const deleteSale = createAsyncThunk<string, string>(
  'sales/deleteSale',
  async (id, { rejectWithValue }) => {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) return rejectWithValue(error.message);
    return id;
  }
);

export const updateStatus = createAsyncThunk<{ id: string; status: string }, { id: string; status: string }>(
  'sales/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    const { error } = await supabase.from('leads').update({ status }).eq('id', id);
    if (error) return rejectWithValue(error.message);
    return { id, status };
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setProduct: (
      state,
      action: PayloadAction<{
        id: string;
        product_name: string;
        product_quantity: number;
      }>
    ) => {
      const lead = state.sales.find((l) => l.id === action.payload.id);
      if (lead) {
        lead.product_name = action.payload.product_name;
        lead.product_quantity = action.payload.product_quantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.sales = state.sales.filter((l) => l.id !== action.payload);
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const lead = state.sales.find((l) => l.id === action.payload.id);
        if (lead) {
          lead.status = action.payload.status;
        }
      });
  },
});

export const { setProduct } = salesSlice.actions;
export default salesSlice.reducer;