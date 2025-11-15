import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

// Supabase client for server-side operations
export const supabase = createClient(
  ENV.supabaseUrl,
  ENV.supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Helper to get user from Supabase Auth token
export async function getUserFromToken(token: string) {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

// Helper to sync Supabase Auth user with our users table
export async function syncUserToDatabase(authUser: any) {
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authUser.id)
    .single();
  
  if (existingUser) {
    // Update last_signed_in
    await supabase
      .from('users')
      .update({ last_signed_in: new Date().toISOString() })
      .eq('auth_id', authUser.id);
    
    return existingUser;
  }
  
  // Create new user record
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      auth_id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
      role: 'user',
      last_signed_in: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user:', error);
    return null;
  }
  
  return newUser;
}
