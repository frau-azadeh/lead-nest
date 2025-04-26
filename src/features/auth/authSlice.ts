// src/features/auth/authSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: string;
  full_name: string;
  role: string;
  phone_number?: string;
}

interface AuthState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  profile: null,
  loading: false,
  error: null,
};

// گرفتن پروفایل کاربر
export const fetchUserProfile = createAsyncThunk<UserProfile, void, { rejectValue: string }>(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return rejectWithValue('کاربری پیدا نشد');

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        return rejectWithValue(error?.message ?? 'خطا در دریافت پروفایل');
      }

      return data as UserProfile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'خطای ناشناخته');
    }
  }
);

// خروج کاربر
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearProfile(state) {
      state.profile = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // گرفتن پروفایل
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        toast.success(`خوش آمدی ${action.payload.full_name}!`);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'خطای ناشناخته';
        toast.error(state.error);
      })

      // خروج کاربر
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.profile = null;
        toast.success('خروج با موفقیت انجام شد.');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'خطای ناشناخته';
        toast.error(state.error);
      });
  },
});

export const { clearProfile } = authSlice.actions;
export default authSlice.reducer;
