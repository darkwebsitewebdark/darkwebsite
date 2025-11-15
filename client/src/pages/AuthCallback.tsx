import { useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Handle OAuth callback
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Check if user exists in database
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', session.user.id)
          .single();

        // If user doesn't exist, create user record
        if (!existingUser) {
          const { error } = await supabase
            .from('users')
            .insert({
              auth_id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata.full_name || session.user.user_metadata.name,
              profile_image: session.user.user_metadata.avatar_url,
              role: 'user',
              wallet_balance: 0,
            });

          if (error) {
            console.error('Error creating user record:', error);
          }
        } else {
          // Update last_signed_in
          await supabase
            .from('users')
            .update({ last_signed_in: new Date().toISOString() })
            .eq('auth_id', session.user.id);
        }

        toast.success('เข้าสู่ระบบสำเร็จ');
        setLocation('/');
      } else if (event === 'SIGNED_OUT') {
        setLocation('/login');
      }
    });
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">กำลังเข้าสู่ระบบ...</p>
      </div>
    </div>
  );
}
