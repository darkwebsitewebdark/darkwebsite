import { createClient } from '@supabase/supabase-js';
import { ENV } from './_core/env';

// Admin client that bypasses RLS (server-side only)
// Uses SERVICE_ROLE_KEY which has full access to the database
export const supabaseAdmin = createClient(
  ENV.supabaseUrl,
  ENV.supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
