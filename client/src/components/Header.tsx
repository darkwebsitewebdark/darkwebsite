import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import {
  ShoppingCart,
  Bell,
  User,
  Search,
  Menu,
  Package,
  Heart,
  MessageCircle,
  LogOut,
  LayoutDashboard,
  Store,
} from "lucide-react";
import { APP_TITLE } from "@/const";

export default function Header() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: cartItems } = trpc.cart.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: notifications } = trpc.notifications.list.useQuery({ limit: 10 }, {
    enabled: isAuthenticated,
  });

  const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SM</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">
              {APP_TITLE}
            </span>
          </div>
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="search"
              placeholder="ค้นหาสินค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold">{user?.name || "ผู้ใช้"}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation("/profile")}>
                    <User className="w-4 h-4 mr-2" />
                    โปรไฟล์
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/orders")}>
                    <Package className="w-4 h-4 mr-2" />
                    คำสั่งซื้อของฉัน
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/wishlist")}>
                    <Heart className="w-4 h-4 mr-2" />
                    รายการโปรด
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/chat")}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    แชท
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user?.role === "seller" && (
                    <DropdownMenuItem onClick={() => setLocation("/seller/dashboard")}>
                      <Store className="w-4 h-4 mr-2" />
                      แดชบอร์ดผู้ขาย
                    </DropdownMenuItem>
                  )}
                  {user?.role === "admin" && (
                    <DropdownMenuItem onClick={() => setLocation("/admin/dashboard")}>
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      แดชบอร์ดแอดมิน
                    </DropdownMenuItem>
                  )}
                  {(user?.role === "seller" || user?.role === "admin") && (
                    <DropdownMenuSeparator />
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    ออกจากระบบ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/auth">
              <Button>เข้าสู่ระบบ</Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Search Bar - Mobile */}
      <div className="md:hidden border-t">
        <div className="container py-2">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder="ค้นหาสินค้า..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="border-t">
        <div className="container">
          <nav className="flex items-center gap-6 h-12 text-sm overflow-x-auto">
            <Link href="/products">
              <span className={`cursor-pointer hover:text-primary transition-colors ${
                location === "/products" ? "text-primary font-semibold" : ""
              }`}>
                สินค้าทั้งหมด
              </span>
            </Link>
            <Link href="/products?category=electronics">
              <span className="cursor-pointer hover:text-primary transition-colors whitespace-nowrap">
                อิเล็กทรอนิกส์
              </span>
            </Link>
            <Link href="/products?category=fashion">
              <span className="cursor-pointer hover:text-primary transition-colors whitespace-nowrap">
                แฟชั่น
              </span>
            </Link>
            <Link href="/products?category=beauty">
              <span className="cursor-pointer hover:text-primary transition-colors whitespace-nowrap">
                ความงาม
              </span>
            </Link>
            <Link href="/products?category=sports">
              <span className="cursor-pointer hover:text-primary transition-colors whitespace-nowrap">
                กีฬา
              </span>
            </Link>
            <Link href="/products?category=home">
              <span className="cursor-pointer hover:text-primary transition-colors whitespace-nowrap">
                บ้านและสวน
              </span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-2">
            <Link href="/products">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                สินค้าทั้งหมด
              </Button>
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/orders">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                    <Package className="w-4 h-4 mr-2" />
                    คำสั่งซื้อ
                  </Button>
                </Link>
                <Link href="/notifications">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                    <Bell className="w-4 h-4 mr-2" />
                    การแจ้งเตือน
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    แชท
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
