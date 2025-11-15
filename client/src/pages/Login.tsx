import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_LOGO, APP_TITLE } from "@/const";
import { LogIn, ShieldCheck, Zap, TrendingUp, Mail } from "lucide-react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function Login() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (!loading && isAuthenticated) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, setLocation]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        // Check if user exists in database
        const { data: dbUser, error: dbError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', data.user.id)
          .single();

        if (dbError || !dbUser) {
          // Create user in database if doesn't exist
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              auth_id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || null,
              role: 'user',
              wallet_balance: 0,
            });

          if (insertError) {
            console.error('Error creating user:', insertError);
          }
        }

        toast.success("เข้าสู่ระบบสำเร็จ!");
        setLocation("/");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

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
            alt={APP_TITLE}
            className="w-48 mx-auto mb-4 animate-float"
          />
          <h1 className="text-3xl font-bold neon-text-red mb-2">
            เข้าสู่ระบบ
          </h1>
          <p className="text-muted-foreground">
            เข้าสู่โลกของสตรีทมาร์เก็ต
          </p>
        </div>

        {/* Login Card */}
        <Card className="card-neon p-8">
          <form onSubmit={handleEmailLogin} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="input-dark"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="input-dark"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                ลืมรหัสผ่าน?
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full btn-neon bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  หรือ
                </span>
              </div>
            </div>

            {/* Google Login Button */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              size="lg"
              variant="outline"
              disabled={isLoading}
              className="w-full"
            >
              <Mail className="w-5 h-5 mr-2" />
              เข้าสู่ระบบด้วย Google
            </Button>

            {/* Register Link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">ยังไม่มีบัญชี? </span>
              <a
                href="/register"
                className="text-primary hover:underline font-bold"
              >
                สมัครสมาชิก
              </a>
            </div>

            {/* Benefits */}
            <div className="space-y-4 mt-6 pt-6 border-t border-muted">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">ปลอดภัย 100%</h3>
                  <p className="text-xs text-muted-foreground">
                    ระบบรักษาความปลอดภัยระดับสูง
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">ใช้งานง่าย</h3>
                  <p className="text-xs text-muted-foreground">
                    เข้าสู่ระบบด้วย Email หรือ Google
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">โอกาสมากมาย</h3>
                  <p className="text-xs text-muted-foreground">
                    ซื้อ-ขาย สินค้าได้ทันที
                  </p>
                </div>
              </div>
            </div>
          </form>
        </Card>

        {/* Back to Home */}
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
