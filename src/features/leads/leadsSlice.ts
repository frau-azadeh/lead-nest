// src/features/leads/leadsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';
import { Lead } from '../../types/lead';

interface LeadsState {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  editingLead: Lead | null;
}

const initialState: LeadsState = {
  leads: [],
  loading: false,
  error: null,
  editingLead: null,
};

export const fetchLeads = createAsyncThunk<Lead[], void, { rejectValue: string }>(
  'leads/fetchLeads',
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.from('leads').select('*');
    if (error) return rejectWithValue(error.message);
    return data ?? [];
  }
);

export const createLead = createAsyncThunk<Lead, Omit<Lead, 'id' | 'created_at'>, { rejectValue: string }>(
  'leads/createLead',
  async (newLead, { rejectWithValue }) => {
    const { data, error } = await supabase.from('leads').insert([newLead]).select().single();
    if (error) return rejectWithValue(error.message);
    return data as Lead;
  }
);

export const updateLead = createAsyncThunk<Lead, Omit<Lead, 'created_at'>, { rejectValue: string }>(
  'leads/updateLead',
  async (lead, { rejectWithValue }) => {
    console.log('UPDATE PAYLOAD:', lead);

    const { data, error } = await supabase
      .from('leads')
      .update({
        full_name: lead.full_name,
        email: lead.email,
        phone_number: lead.phone_number,
        company: lead.company,
        status: lead.status,
        
      })
      .eq('id', lead.id)
      .select('*')
      .maybeSingle();

    console.log('SUPABASE DATA:', data);
    console.log('SUPABASE ERROR:', error);

    if (error || !data) return rejectWithValue(error?.message ?? 'داده‌ای برنگشت');
    return data as Lead;
  }
);



export const deleteLead = createAsyncThunk<string, string, { rejectValue: string }>(
  'leads/deleteLead',
  async (id, { rejectWithValue }) => {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) return rejectWithValue(error.message);
    return id;
  }
);

export const updateLeadStatus = createAsyncThunk<{ id: string; status: string }, { id: string; status: string }, { rejectValue: string }>(
  'leads/updateLeadStatus',
  async ({ id, status }, { rejectWithValue }) => {
    const { error } = await supabase.from('leads').update({ status }).eq('id', id);
    if (error) return rejectWithValue(error.message);
    return { id, status };
  }
);


const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setEditingLead: (state, action: PayloadAction<Lead>) => {
      state.editingLead = action.payload;
    },
    clearEditingLead: (state) => {
      state.editingLead = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'خطا در دریافت داده‌ها';
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.leads.unshift(action.payload);
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        const index = state.leads.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) state.leads[index] = action.payload;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.leads = state.leads.filter((l) => l.id !== action.payload);
      })
      .addCase(updateLeadStatus.fulfilled, (state, action) => {
        const lead = state.leads.find((l) => l.id === action.payload.id);
        if (lead) {
          lead.status = action.payload.status;
        }
      });
      
  },
});

export const { setEditingLead, clearEditingLead } = leadsSlice.actions;
export default leadsSlice.reducer;
