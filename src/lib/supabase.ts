import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client for when env vars are missing
function createMockClient(): SupabaseClient {
  const mockResponse = { data: null, error: { message: 'Supabase not configured' } };

  return {
    from: () => ({
      select: () => Promise.resolve(mockResponse),
      insert: () => Promise.resolve(mockResponse),
      update: () => ({
        eq: () => Promise.resolve(mockResponse),
      }),
      eq: () => ({
        eq: () => Promise.resolve(mockResponse),
        in: () => Promise.resolve(mockResponse),
        or: () => Promise.resolve(mockResponse),
      }),
      in: () => Promise.resolve(mockResponse),
      or: () => Promise.resolve(mockResponse),
      order: () => Promise.resolve(mockResponse),
    }),
    rpc: () => Promise.resolve(mockResponse),
  } as unknown as SupabaseClient;
}

// Export either real client or mock client (never throw)
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

// Flag to check if Supabase is properly configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export type Category = {
  id: string;
  name: string;
  icon: string;
  created_at: string;
};

export type Food = {
  id: string;
  title: string;
  description: string | null;
  quantity: string;
  location: string;
  pickup_instructions: string | null;
  expires_at: string;
  image_url: string | null;
  category_id: string | null;
  status: 'available' | 'claimed' | 'expired';
  claimed_by: string | null;
  created_at: string;
  categories?: Category;
};

export type Claim = {
  id: string;
  food_id: string;
  claimed_by_name: string;
  claimed_at: string;
  notes: string | null;
};

export type FoodInsert = {
  title: string;
  description?: string;
  quantity: string;
  location: string;
  pickup_instructions?: string;
  expires_at: string;
  image_url?: string;
  category_id?: string;
};
