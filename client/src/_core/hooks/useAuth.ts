import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type DbUser = {
  id: number;
  auth_id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  profile_image: string | null;
  role: 'user' | 'seller' | 'admin';
  wallet_balance: number;
  created_at: string;
  last_signed_in: string;
};

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/login" } = options ?? {};
  
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
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

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setAuthUser(null);
      setDbUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err as Error);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (authUser) {
      await fetchDbUser(authUser.id);
    }
  }, [authUser]);

  const state = useMemo(() => {
    return {
      user: dbUser,
      authUser,
      loading,
      error,
      isAuthenticated: Boolean(authUser && dbUser),
    };
  }, [dbUser, authUser, loading, error]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (loading) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    loading,
    state.user,
  ]);

  return {
    ...state,
    refresh,
    logout,
  };
}
