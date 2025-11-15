import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { LogIn, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

export default function Login() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect if already logged in
    if (!loading && isAuthenticated) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, setLocation]);

  const handleLogin = () => {
    window.location.href = getLoginUrl();
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
          <div className="space-y-6">
            {/* Benefits */}
            <div className="space-y-4">
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
                    เข้าสู่ระบบด้วย Manus Account
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

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              size="lg"
              className="w-full btn-neon bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            >
              <LogIn className="w-5 h-5 mr-2" />
              เข้าสู่ระบบด้วย Manus
            </Button>

            {/* Terms */}
            <p className="text-xs text-center text-muted-foreground">
              การเข้าสู่ระบบแสดงว่าคุณยอมรับ
              <br />
              <a href="/terms" className="text-primary hover:underline">
                เงื่อนไขการใช้งาน
              </a>
              {" และ "}
              <a href="/privacy" className="text-primary hover:underline">
                นโยบายความเป็นส่วนตัว
              </a>
            </p>
          </div>
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
