import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail, signInWithGoogle } from "@/lib/auth";
import { Link, useLocation } from "wouter";
import { APP_TITLE } from "@/const";
import { Mail, Lock, Chrome } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signInWithEmail(email, password);
    
    if (result.success) {
      setLocation("/");
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signInWithGoogle();
    // Redirect will happen automatically
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{APP_TITLE}</h1>
          <p className="text-muted-foreground">เข้าสู่ระบบเพื่อเริ่มช้อปปิ้ง</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">อีเมล</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Link href="/forgot-password">
                <a className="text-sm text-primary hover:underline">ลืมรหัสผ่าน?</a>
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full btn-glow gradient-red-orange"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">หรือ</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          size="lg"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <Chrome className="w-5 h-5 mr-2" />
          เข้าสู่ระบบด้วย Google
        </Button>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">ยังไม่มีบัญชี? </span>
          <Link href="/register">
            <a className="text-primary hover:underline font-semibold">สมัครสมาชิก</a>
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link href="/">
            <a className="text-sm text-muted-foreground hover:text-primary">
              ← กลับหน้าหลัก
            </a>
          </Link>
        </div>
      </Card>
    </div>
  );
}
