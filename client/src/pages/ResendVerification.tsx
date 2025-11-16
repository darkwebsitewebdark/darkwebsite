import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function ResendVerification() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setEmailSent(true);
      toast.success("ส่งอีเมลยืนยันเรียบร้อยแล้ว!");
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error("เกิดข้อผิดพลาดในการส่งอีเมลยืนยัน");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative crt-effect">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
        <div className="absolute inset-0 spray-texture"></div>

        <div className="w-full max-w-md relative z-10">
          <Card className="card-neon p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold neon-text-red mb-4">
              ส่งอีเมลยืนยันแล้ว!
            </h2>
            
            <p className="text-muted-foreground mb-6">
              เราได้ส่งอีเมลยืนยันไปที่ <strong className="text-foreground">{email}</strong> แล้ว
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm mb-2">📧 กรุณาทำตามขั้นตอนต่อไปนี้:</p>
              <ol className="text-sm text-muted-foreground space-y-1 ml-4 list-decimal">
                <li>เปิดอีเมลของคุณ</li>
                <li>ค้นหาอีเมลจาก dLNk Dark Shop</li>
                <li>คลิกลิงก์ยืนยันในอีเมล</li>
                <li>กลับมาเข้าสู่ระบบ</li>
              </ol>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => setLocation("/login")}
                size="lg"
                className="w-full btn-neon bg-primary hover:bg-primary/90"
              >
                ไปหน้าเข้าสู่ระบบ
              </Button>
              
              <Button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                size="lg"
                variant="outline"
                className="w-full"
              >
                ส่งอีกครั้ง
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              ไม่ได้รับอีเมล? ตรวจสอบในโฟลเดอร์ Spam หรือ Junk
            </p>
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
            ส่งอีเมลยืนยันอีกครั้ง
          </h1>
          <p className="text-muted-foreground">
            กรอกอีเมลของคุณเพื่อรับลิงก์ยืนยันใหม่
          </p>
        </div>

        {/* Resend Card */}
        <Card className="card-neon p-8">
          <form onSubmit={handleResendVerification} className="space-y-6">
            {/* Info Box */}
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                หากคุณไม่ได้รับอีเมลยืนยัน กรุณากรอกอีเมลที่ใช้สมัครสมาชิก 
                แล้วเราจะส่งลิงก์ยืนยันใหม่ให้คุณ
              </p>
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

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full btn-neon bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            >
              <Mail className="w-5 h-5 mr-2" />
              {isLoading ? "กำลังส่งอีเมล..." : "ส่งอีเมลยืนยัน"}
            </Button>

            {/* Back to Login */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">ยืนยันอีเมลแล้ว? </span>
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
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับหน้าแรก
          </Button>
        </div>
      </div>
    </div>
  );
}
