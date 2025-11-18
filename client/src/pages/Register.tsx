import { useState } from "react";
import { useLocation, Link } from "wouter";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

export default function Register() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      toast.error("กรุณากรอกชื่อ-นามสกุล");
      return;
    }

    if (!email.trim()) {
      toast.error("กรุณากรอกอีเมล");
      return;
    }

    if (!password) {
      toast.error("กรุณากรอกรหัสผ่าน");
      return;
    }

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
      console.log('=== REGISTRATION START ===');
      console.log('[Register] Email:', email);
      console.log('[Register] Name:', name);
      console.log('[Register] Supabase URL:', import.meta.env.VITE_SUPABASE_URL || 'https://rpkfptvgdjxnnfeltuer.supabase.co');
      
      // Test Supabase connection first
      console.log('[Register] Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase.auth.getSession();
      console.log('[Register] Connection test result:', { testData, testError });
      
      // Sign up with Supabase Auth
      console.log('[Register] Calling supabase.auth.signUp...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      console.log('[Register] SignUp response:', JSON.stringify({ data, error }, null, 2));

      if (error) {
        console.error('[Register] SignUp error:', error);
        console.error('[Register] Error details:', {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        console.error('[Register] No user created - data:', data);
        toast.error("ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่อีกครั้ง");
        setIsLoading(false);
        return;
      }

      console.log('[Register] User created successfully!');
      console.log('[Register] User ID:', data.user.id);
      console.log('[Register] User email:', data.user.email);
      console.log('[Register] Session:', data.session ? 'Yes' : 'No');
      console.log('[Register] Email confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No');
      
      setRegisteredEmail(email);
      setRegistrationSuccess(true);

      // Check if email confirmation is required
      if (data.session) {
        // Email confirmation is disabled - auto login successful
        console.log('[Register] Auto login successful - redirecting to home');
        toast.success("สมัครสมาชิกสำเร็จ! กำลังเข้าสู่ระบบ...");
        setTimeout(() => {
          setLocation("/");
        }, 1500);
      } else {
        // Email confirmation is enabled
        console.log('[Register] Email confirmation required');
        toast.success("สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี");
      }

      console.log('=== REGISTRATION END ===');

    } catch (err: any) {
      console.error('[Register] Unexpected error:', err);
      console.error('[Register] Error stack:', err.stack);
      toast.error(`เกิดข้อผิดพลาดที่ไม่คาดคิด: ${err.message}`);
      setIsLoading(false);
    } finally {
      if (!registrationSuccess) {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
      }
    } catch (err: any) {
      toast.error(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-900 rounded-lg p-8 border border-gray-800">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">สมัครสมาชิกสำเร็จ!</h2>
            <p className="text-gray-400">
              เราได้ส่งอีเมลยืนยันไปที่ <span className="text-white font-medium">{registeredEmail}</span> แล้ว
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <h3 className="text-white font-medium mb-3">ขั้นตอนถัดไป:</h3>
            <ol className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2">1.</span>
                <span>ตรวจสอบกล่องจดหมายของคุณ</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2">2.</span>
                <span>คลิกลิงก์ยืนยันในอีเมล</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2">3.</span>
                <span>กลับมาเข้าสู่ระบบ</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2">4.</span>
                <span>เริ่มใช้งาน dLNk Dark Shop</span>
              </li>
            </ol>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
            <p className="text-yellow-500 text-sm">
              <strong>หมายเหตุ:</strong> อีเมลอาจใช้เวลา 5-10 นาทีในการส่ง 
              และอาจอยู่ในโฟลเดอร์ Spam หรือ Junk
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setLocation("/login")}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              ไปหน้าเข้าสู่ระบบ
            </button>
            <button
              onClick={() => setLocation("/resend-verification")}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              ส่งอีเมลยืนยันอีกครั้ง
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="dLNk Dark Shop" 
            className="h-16 mx-auto mb-4"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1 className="text-3xl font-bold text-white mb-2">สมัครสมาชิก</h1>
          <p className="text-gray-400">เริ่มต้นการซื้อขายบนสตรีทมาร์เก็ต</p>
        </div>

        {/* Register Form */}
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                ชื่อ-นามสกุล
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
                  placeholder="ชื่อของคุณ"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                อีเมล
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                ยืนยันรหัสผ่าน
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
                  placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-red-600 bg-gray-800 border-gray-700 rounded focus:ring-red-500"
                disabled={isLoading}
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                ฉันยอมรับ{" "}
                <Link to="/terms" className="text-red-500 hover:text-red-400">
                  เงื่อนไขการใช้งาน
                </Link>{" "}
                และ{" "}
                <Link to="/privacy" className="text-red-500 hover:text-red-400">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังสมัครสมาชิก...
                </>
              ) : (
                "สมัครสมาชิก"
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">หรือ</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 py-3 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              สมัครด้วย Google
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              มีบัญชีอยู่แล้ว?{" "}
              <Link to="/login" className="text-red-500 hover:text-red-400 font-medium">
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setLocation("/")}
            className="text-gray-400 hover:text-white transition-colors inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            กลับหน้าแรก
          </button>
        </div>
      </div>
    </div>
  );
}
