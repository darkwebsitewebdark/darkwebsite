import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { signUpWithEmail, signInWithGoogle } from "@/lib/auth";
import { Link, useLocation } from "wouter";
import { APP_TITLE } from "@/const";
import { Mail, Lock, User, Chrome } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

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

    const result = await signUpWithEmail(email, password, name);
    
    if (result.success) {
      // Redirect to login or email verification page
      setLocation("/login");
    }

    setIsLoading(false);
  };

  const handleGoogleSignUp = async () => {
    if (!acceptTerms) {
      toast.error("กรุณายอมรับข้อกำหนดและเงื่อนไข");
      return;
    }

    setIsLoading(true);
    await signInWithGoogle();
    // Redirect will happen automatically
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">สมัครสมาชิก</h1>
          <p className="text-muted-foreground">สร้างบัญชีใหม่กับ {APP_TITLE}</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="name">ชื่อ-นามสกุล</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="ชื่อของคุณ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

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
            <Label htmlFor="password">รหัสผ่าน</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="อย่างน้อย 6 ตัวอักษร"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

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
              <a href="#" className="text-primary hover:underline">
                ข้อกำหนดและเงื่อนไข
              </a>{" "}
              และ{" "}
              <a href="#" className="text-primary hover:underline">
                นโยบายความเป็นส่วนตัว
              </a>
            </label>
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
                กำลังสมัครสมาชิก...
              </>
            ) : (
              "สมัครสมาชิก"
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
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          <Chrome className="w-5 h-5 mr-2" />
          สมัครด้วย Google
        </Button>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">มีบัญชีอยู่แล้ว? </span>
          <Link href="/login">
            <a className="text-primary hover:underline font-semibold">เข้าสู่ระบบ</a>
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
