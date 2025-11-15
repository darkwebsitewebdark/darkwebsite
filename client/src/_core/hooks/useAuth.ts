import { useContext } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export function useAuth() {
  return useSupabaseAuth();
}

export { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
