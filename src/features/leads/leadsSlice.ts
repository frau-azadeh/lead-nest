// src/features/leads/leadsSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Lead } from '../../types/lead';
import { getLeads, addLead } from '../../services/leadService';

interface LeadsState {
  leads: Lead[];
  loading: boolean;
  error: string | null;
}

const initialState: LeadsState = {
  leads: [],
  loading: false,
  error: null,
};

// Async Thunks
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
      return rejectWithValue('Something went wrong');
    }
  }
);

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
      return rejectWithValue('Something went wrong');
    }
  }
);

// Slice
const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {},
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
        state.error = action.payload ?? 'Unknown error';
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
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

export default leadsSlice.reducer;
