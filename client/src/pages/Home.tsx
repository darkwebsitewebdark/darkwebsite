import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { APP_LOGO, APP_TITLE } from "@/const";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // If authenticated, redirect to products page
    if (isAuthenticated) {
      setLocation("/products");
    }
  }, [isAuthenticated, setLocation]);

  // If authenticated, show nothing (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative crt-effect flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
      <div className="absolute inset-0 spray-texture"></div>
      
      <div className="container relative z-10">
        <div className="max-w-md mx-auto text-center">
          {/* Logo - Beautiful and Distinctive */}
          <div className="mb-12 animate-float">
            <picture>
              <source 
                srcSet="/logo-dlnk-horizontal-200w.webp 200w,
                        /logo-dlnk-horizontal-400w.webp 400w,
                        /logo-dlnk-horizontal-800w.webp 800w"
                sizes="(max-width: 640px) 200px,
                       (max-width: 1024px) 400px,
                       800px"
                type="image/webp"
              />
              <img 
                src={APP_LOGO} 
                alt={APP_TITLE}
                className="w-full max-w-sm mx-auto drop-shadow-2xl"
                loading="eager"
                fetchPriority="high"
              />
            </picture>
          </div>
          
          {/* Login/Register Card */}
          <div className="card-neon bg-card/80 backdrop-blur-sm p-8 rounded-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 neon-text-red">
              เข้าสู่ระบบ
            </h2>
            
            <div className="space-y-4">
              <a 
                href="/login"
                className="block w-full btn-neon bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg transition-all duration-300 text-center"
              >
                เข้าสู่ระบบ
              </a>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted-foreground/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">หรือ</span>
                </div>
              </div>
              
              <a 
                href="/register"
                className="block w-full btn-neon border-2 border-secondary text-secondary hover:bg-secondary/10 font-bold py-3 px-6 rounded-lg transition-all duration-300 text-center"
              >
                สมัครสมาชิก
              </a>
            </div>
            
            <p className="text-xs text-muted-foreground mt-6">
              กรุณาเข้าสู่ระบบหรือสมัครสมาชิกเพื่อเข้าใช้งาน
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
