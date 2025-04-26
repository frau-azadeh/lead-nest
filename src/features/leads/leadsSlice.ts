// src/features/leads/leadsSlice.ts

import { supabase } from '../../lib/supabaseClient';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Lead } from '../../types/lead';
import { getLeads, addLead } from '../../services/leadService';

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

// ==========================
// Async Thunks
// ==========================

// Fetch Leads
export const fetchLeads = createAsyncThunk<Lead[], void, { rejectValue: string }>(
  'leads/fetchLeads',
  async (_, { rejectWithValue }) => {
    try {
      const leads = await getLeads();
      return leads;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('مشکلی پیش آمد');
    }
  }
);

// Create Lead
export const createLead = createAsyncThunk<Lead[], Omit<Lead, 'id' | 'created_at'>, { rejectValue: string }>(
  'leads/createLead',
  async (newLead, { rejectWithValue }) => {
    try {
      const lead = await addLead(newLead);
      return lead;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('مشکلی پیش آمد');
    }
  }
);

// Delete Lead
export const deleteLead = createAsyncThunk<string, string, { rejectValue: string }>(
  'leads/deleteLead',
  async (leadId, { rejectWithValue }) => {
    const { error } = await supabase.from('leads').delete().eq('id', leadId);
    if (error) {
      return rejectWithValue(error.message);
    }
    return leadId;
  }
);

// Update Lead
export const updateLead = createAsyncThunk<Lead, Lead, { rejectValue: string }>(
  'leads/updateLead',
  async (lead, { rejectWithValue }) => {
    const { error } = await supabase
      .from('leads')
      .update({
        full_name: lead.full_name,
        email: lead.email,
        phone_number: lead.phone_number,
        company: lead.company,
        status: lead.status,
      })
      .eq('id', lead.id);

    if (error) {
      return rejectWithValue(error.message);
    }

    return lead;
  }
);

// ==========================
// Slice
// ==========================

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setEditingLead(state, action: PayloadAction<Lead>) {
      state.editingLead = action.payload;
    },
    clearEditingLead(state) {
      state.editingLead = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Leads
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
        state.error = action.payload ?? 'خطای نامشخص';
      })

      // Create Lead
      .addCase(createLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.loading = false;
        state.leads.unshift(action.payload[0]);
      })
      .addCase(createLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'خطای نامشخص';
      })

      // Delete Lead
      .addCase(deleteLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = state.leads.filter((lead) => lead.id !== action.payload);
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'خطای نامشخص';
      })

      // Update Lead
      .addCase(updateLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.leads.findIndex((lead) => lead.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'خطای نامشخص';
      });
  },
});

export const { setEditingLead, clearEditingLead } = leadsSlice.actions;
export default leadsSlice.reducer;
