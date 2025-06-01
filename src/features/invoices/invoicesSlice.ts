// src/features/invoices/invoicesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';
import { InsertInvoice } from '../../types/invoice';

export interface Invoice {
  id: string;
  lead_id: string;
  type: string; // مثلاً "invoice" یا "pre-invoice" یا "delivery"
  amount: number;
  created_at: string;
}

interface InvoicesState {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
}

const initialState: InvoicesState = {
  invoices: [],
  loading: false,
  error: null,
};

export const createInvoice = createAsyncThunk<Invoice, InsertInvoice, { rejectValue: string }>(
  'invoices/createInvoice',
  async (invoiceData, { rejectWithValue }) => {
    const { data, error } = await supabase.from('invoices').insert([invoiceData]).select().single();
    if (error) return rejectWithValue(error.message);
    return data as Invoice;
  }
);

// src/features/invoices/invoicesSlice.ts
export const updateInvoice = createAsyncThunk<
  Invoice,
  Partial<Invoice> & { id: string },
  { rejectValue: string }
>('invoices/updateInvoice', async (invoiceData, { rejectWithValue }) => {
  const { id, ...fieldsToUpdate } = invoiceData;
  const { data, error } = await supabase
    .from('invoices')
    .update(fieldsToUpdate)
    .eq('id', id)
    .select()
    .single();
  if (error) return rejectWithValue(error.message);
  return data as Invoice;
});

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.push(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'خطا در ایجاد فاکتور';
      });
  },
});

export default invoicesSlice.reducer;
