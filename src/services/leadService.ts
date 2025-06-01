// src/services/leadService.ts

import { supabase } from '../lib/supabaseClient';
import { Lead } from '../types/lead';

export const getLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Lead[];
};

export const addLead = async (lead: Omit<Lead, 'id' | 'created_at'>): Promise<Lead[]> => {
  const { data, error } = await supabase.from('leads').insert([lead]).select();

  if (error) {
    throw new Error(error.message);
  }

  return data as Lead[];
};
