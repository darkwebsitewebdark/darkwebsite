import { supabase } from './supabase';
import { toast } from 'sonner';

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
};

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string, name: string) {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error('ไม่สามารถสร้างบัญชีได้');
    }

    // Create user record in database
    const { error: dbError } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user.id,
        email: authData.user.email,
        name,
        role: 'user',
        wallet_balance: 0,
      });

    if (dbError) {
      console.error('Error creating user record:', dbError);
      // Don't throw - auth user is created, we can fix the DB record later
    }

    toast.success('สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี');
    return { success: true, user: authData.user };
  } catch (error: any) {
    console.error('Sign up error:', error);
    toast.error(error.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    return { success: false, error };
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Update last_signed_in
    if (data.user) {
      await supabase
        .from('users')
        .update({ last_signed_in: new Date().toISOString() })
        .eq('auth_id', data.user.id);
    }

    toast.success('เข้าสู่ระบบสำเร็จ');
    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Sign in error:', error);
    toast.error(error.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    return { success: false, error };
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Google sign in error:', error);
    toast.error(error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google');
    return { success: false, error };
  }
}

/**
 * Sign out
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    toast.success('ออกจากระบบสำเร็จ');
    return { success: true };
  } catch (error: any) {
    console.error('Sign out error:', error);
    toast.error(error.message || 'เกิดข้อผิดพลาดในการออกจากระบบ');
    return { success: false, error };
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw error;
    }

    toast.success('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว');
    return { success: true };
  } catch (error: any) {
    console.error('Reset password error:', error);
    toast.error(error.message || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน');
    return { success: false, error };
  }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    toast.success('เปลี่ยนรหัสผ่านสำเร็จ');
    return { success: true };
  } catch (error: any) {
    console.error('Update password error:', error);
    toast.error(error.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    return { success: false, error };
  }
}

/**
 * Get current session
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Get session error:', error);
    return null;
  }
  return session;
}

/**
 * Get current user from database
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', session.user.id)
    .single();

  if (error) {
    console.error('Get current user error:', error);
    return null;
  }

  return user;
}

/**
 * Update user profile
 */
export async function updateProfile(updates: {
  name?: string;
  phone?: string;
  profile_image?: string;
}) {
  try {
    const session = await getSession();
    if (!session?.user) {
      throw new Error('ไม่พบข้อมูลผู้ใช้');
    }

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('auth_id', session.user.id);

    if (error) {
      throw error;
    }

    toast.success('อัพเดทโปรไฟล์สำเร็จ');
    return { success: true };
  } catch (error: any) {
    console.error('Update profile error:', error);
    toast.error(error.message || 'เกิดข้อผิดพลาดในการอัพเดทโปรไฟล์');
    return { success: false, error };
  }
}
