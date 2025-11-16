import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { APP_LOGO } from "@/const";

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('[AuthCallback] Processing auth callback...');
        
        // Get the URL hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        console.log('[AuthCallback] Params:', { type, error, hasAccessToken: !!accessToken });

        if (error) {
          console.error('[AuthCallback] Error:', error, errorDescription);
          setStatus('error');
          setMessage(errorDescription || 'เกิดข้อผิดพลาดในการยืนยันอีเมล');
          return;
        }

        if (type === 'signup' && accessToken && refreshToken) {
          // Set the session for email verification
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('[AuthCallback] Session error:', sessionError);
            setStatus('error');
            setMessage('ไม่สามารถสร้าง session ได้');
            return;
          }

          console.log('[AuthCallback] Email verified, session created:', data.session?.user.id);
          setStatus('success');
          setMessage('ยืนยันอีเมลสำเร็จ! กำลังนำคุณเข้าสู่ระบบ...');
          toast.success('ยืนยันอีเมลสำเร็จ!');
          
          setTimeout(() => {
            setLocation('/');
          }, 2000);
          return;
        }

        // Handle OAuth callback
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('[AuthCallback] OAuth session found');
          setStatus('success');
          setMessage('เข้าสู่ระบบสำเร็จ!');
          toast.success('เข้าสู่ระบบสำเร็จ');
          
          setTimeout(() => {
            setLocation('/');
          }, 1500);
        } else {
          console.warn('[AuthCallback] No session found');
          setStatus('error');
          setMessage('ลิงก์ยืนยันไม่ถูกต้องหรือหมดอายุ');
        }
      } catch (error: any) {
        console.error('[AuthCallback] Unexpected error:', error);
        setStatus('error');
        setMessage('เกิดข้อผิดพลาดที่ไม่คาดคิด');
      }
    };

    handleAuthCallback();
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative crt-effect">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
      <div className="absolute inset-0 spray-texture"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src={APP_LOGO} 
            alt="dLNk Dark Shop"
            className="w-48 mx-auto mb-4 animate-float"
          />
        </div>

        <Card className="card-neon p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-4">
                กำลังยืนยันอีเมล...
              </h2>
              <p className="text-muted-foreground">
                กรุณารอสักครู่
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-green-500 mb-4">
                สำเร็จ!
              </h2>
              <p className="text-muted-foreground mb-6">
                {message}
              </p>
              <Button
                onClick={() => setLocation('/')}
                size="lg"
                className="w-full btn-neon bg-primary hover:bg-primary/90"
              >
                ไปหน้าแรก
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-red-500 mb-4">
                เกิดข้อผิดพลาด
              </h2>
              <p className="text-muted-foreground mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setLocation('/resend-verification')}
                  size="lg"
                  className="w-full btn-neon bg-primary hover:bg-primary/90"
                >
                  ส่งอีเมลยืนยันอีกครั้ง
                </Button>
                <Button
                  onClick={() => setLocation('/login')}
                  size="lg"
                  variant="outline"
                  className="w-full"
                >
                  ไปหน้าเข้าสู่ระบบ
                </Button>
              </div>
            </>
          )}
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            ← กลับหน้าแรก
          </Button>
        </div>
      </div>
    </div>
  );
}
