import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { APP_TITLE, APP_LOGO, getLoginUrl } from "@/const";
import { Search, ShoppingCart, User, Heart, Package, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function Header() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <img 
              src="/logo-dlnk-horizontal.png" 
              alt="dLNk Dark Shop" 
              className="h-10 w-auto" 
            />
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost" size="sm">
              สินค้าทั้งหมด
            </Button>
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {/* TODO: Add cart count badge */}
                </Button>
              </Link>

              <Link href="/wishlist">
                <Button variant="ghost" size="icon">
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-semibold">{user?.name || "ผู้ใช้"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation("/profile")}>
                    <User className="w-4 h-4 mr-2" />
                    โปรไฟล์
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/orders")}>
                    <Package className="w-4 h-4 mr-2" />
                    คำสั่งซื้อ
                  </DropdownMenuItem>
                  {user?.role === "seller" && (
                    <DropdownMenuItem onClick={() => setLocation("/seller/dashboard")}>
                      <Settings className="w-4 h-4 mr-2" />
                      แดชบอร์ดผู้ขาย
                    </DropdownMenuItem>
                  )}
                  {user?.role === "admin" && (
                    <DropdownMenuItem onClick={() => setLocation("/admin")}>
                      <Settings className="w-4 h-4 mr-2" />
                      แดชบอร์ดแอดมิน
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    ออกจากระบบ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = getLoginUrl()}
              >
                เข้าสู่ระบบ
              </Button>
              <Button 
                className="btn-neon bg-primary hover:bg-primary/90 text-primary-foreground" 
                size="sm"
                onClick={() => window.location.href = getLoginUrl()}
              >
                สมัครสมาชิก
              </Button>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden border-t border-border">
        <form onSubmit={handleSearch} className="container py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
