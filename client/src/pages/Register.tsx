import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { APP_LOGO, APP_TITLE } from "@/const";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function Register() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (!loading && isAuthenticated) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, setLocation]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (password !== confirmPassword) {
      toast.error("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (password.length < 6) {
      toast.error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (!acceptTerms) {
      toast.error("กรุณายอมรับข้อกำหนดและเงื่อนไข");
      return;
    }

    setIsLoading(true);

    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
        setLocation("/login");
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error("เกิดข้อผิดพลาดในการสมัครสมาชิก");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!acceptTerms) {
      toast.error("กรุณายอมรับข้อกำหนดและเงื่อนไข");
      return;
    }

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
      console.error('Google sign up error:', error);
      toast.error("เกิดข้อผิดพลาดในการสมัครด้วย Google");
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
            สมัครสมาชิก
          </h1>
          <p className="text-muted-foreground">
            เริ่มต้นการซื้อขายบนสตรีทมาร์เก็ต
          </p>
        </div>

        {/* Register Card */}
        <Card className="card-neon p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">ชื่อ-นามสกุล</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="ชื่อของคุณ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="input-dark pl-10"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="input-dark pl-10"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="input-dark pl-10"
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="input-dark pl-10"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                ฉันยอมรับ{" "}
                <a href="/terms" className="text-primary hover:underline">
                  เงื่อนไขการใช้งาน
                </a>{" "}
                และ{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  นโยบายความเป็นส่วนตัว
                </a>
              </label>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full btn-neon bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              {isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
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

            {/* Google Sign Up Button */}
            <Button
              type="button"
              onClick={handleGoogleSignUp}
              size="lg"
              variant="outline"
              disabled={isLoading}
              className="w-full"
            >
              <Mail className="w-5 h-5 mr-2" />
              สมัครด้วย Google
            </Button>

            {/* Login Link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">มีบัญชีอยู่แล้ว? </span>
              <a
                href="/login"
                className="text-primary hover:underline font-bold"
              >
                เข้าสู่ระบบ
              </a>
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
