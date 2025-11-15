import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { signOut as authSignOut } from '@/lib/auth';
import type { User } from '@supabase/supabase-js';

type DbUser = {
  id: number;
  auth_id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  profile_image: string | null;
  role: 'user' | 'seller' | 'admin';
  wallet_balance: number;
  is_verified: boolean;
  created_at: string;
  last_signed_in: string;
};

export function useSupabaseAuth() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setError(error);
        setLoading(false);
        return;
      }

      setAuthUser(session?.user ?? null);

      if (session?.user) {
        // Fetch user from database
        fetchDbUser(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setAuthUser(session?.user ?? null);

      if (session?.user) {
        await fetchDbUser(session.user.id);
      } else {
        setDbUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchDbUser(authId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        setError(error);
      } else {
        setDbUser(data);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    await authSignOut();
    setAuthUser(null);
    setDbUser(null);
  };

  return {
    user: dbUser,
    authUser,
    isAuthenticated: !!authUser,
    loading,
    error,
    logout,
  };
}
