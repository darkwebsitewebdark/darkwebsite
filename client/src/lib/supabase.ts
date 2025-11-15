import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper types
export type User = {
  id: number;
  auth_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: 'user' | 'seller' | 'admin';
  profile_image: string | null;
  wallet_balance: number;
  created_at: string;
  updated_at: string;
  last_signed_in: string;
};

// Helper to get current user from database
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  if (!authUser) {
    return null;
  }
  
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authUser.id)
    .single();
  
  if (error || !user) {
    return null;
  }
  
  return user as User;
}

// Helper to sign out
export async function signOut() {
  await supabase.auth.signOut();
}
