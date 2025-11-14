import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { 
  ShoppingBag, 
  Search, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users,
  ArrowRight,
  Star,
  Heart,
  ShoppingCart
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch featured products
  const { data: products } = trpc.products.list.useQuery({ limit: 8 });
  
  // Fetch categories
  const { data: categories } = trpc.categories.list.useQuery();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src={APP_LOGO} alt={APP_TITLE} className="w-10 h-10 rounded-lg" />
                <h1 className="text-2xl neon-text-red">{APP_TITLE}</h1>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/products">
                <a className="text-foreground hover:text-primary transition-colors">สินค้า</a>
              </Link>
              <Link href="/categories">
                <a className="text-foreground hover:text-primary transition-colors">หมวดหมู่</a>
              </Link>
              {isAuthenticated && user?.role === 'seller' && (
                <Link href="/seller">
                  <a className="text-foreground hover:text-primary transition-colors">ร้านค้าของฉัน</a>
                </Link>
              )}
              {isAuthenticated && user?.role === 'admin' && (
                <Link href="/admin">
                  <a className="text-foreground hover:text-primary transition-colors">Admin</a>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link href="/cart">
                    <Button variant="ghost" size="icon">
                      <ShoppingCart className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="default" className="btn-glow">
                      {user?.name || 'โปรไฟล์'}
                    </Button>
                  </Link>
                </>
              ) : (
                <Button 
                  onClick={() => window.location.href = getLoginUrl()}
                  className="btn-glow gradient-red-orange"
                >
                  เข้าสู่ระบบ
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">StreetMarket</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              ตลาดออนไลน์สไตล์สตรีท ซื้อขายง่าย ปลอดภัย มั่นใจ
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="ค้นหาสินค้า..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg neon-border-red"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery) {
                      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="btn-glow gradient-red-orange">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  เริ่มช้อปปิ้ง
                </Button>
              </Link>
              {isAuthenticated && user?.role !== 'seller' && (
                <Link href="/seller/apply">
                  <Button size="lg" variant="outline" className="neon-border-green">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    เปิดร้านค้า
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 card-hover glass">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">ปลอดภัย 100%</h3>
              <p className="text-muted-foreground">
                ระบบชำระเงินผ่านกระเป๋าเงิน รับประกันความปลอดภัย
              </p>
            </Card>

            <Card className="p-6 card-hover glass">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">รวดเร็วทันใจ</h3>
              <p className="text-muted-foreground">
                ส่งสินค้าไว ติดตามพัสดุแบบเรียลไทม์
              </p>
            </Card>

            <Card className="p-6 card-hover glass">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">ชุมชนคนรุ่นใหม่</h3>
              <p className="text-muted-foreground">
                เชื่อมต่อผู้ซื้อและผู้ขายในแพลตฟอร์มเดียว
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">หมวดหมู่สินค้า</h2>
              <Link href="/categories">
                <Button variant="ghost">
                  ดูทั้งหมด <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.slice(0, 6).map((category) => (
                <Link key={category.id} href={`/products?category=${category.id}`}>
                  <Card className="p-4 text-center card-hover cursor-pointer">
                    {category.imageUrl && (
                      <img 
                        src={category.imageUrl} 
                        alt={category.name}
                        className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover"
                      />
                    )}
                    <h3 className="font-semibold">{category.name}</h3>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {products && products.length > 0 && (
        <section className="py-16 bg-card/50">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">สินค้าแนะนำ</h2>
              <Link href="/products">
                <Button variant="ghost">
                  ดูทั้งหมด <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="product-card cursor-pointer">
                    {product.images && product.images.length > 0 && (
                      <div className="aspect-square overflow-hidden bg-muted">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold truncate-2 mb-2">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="price-tag text-primary">
                          ฿{(product.price / 100).toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span>4.5</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <span>ขายแล้ว {product.sales || 0}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="p-12 text-center glass neon-border-red">
            <h2 className="text-4xl font-bold mb-4">พร้อมเริ่มต้นแล้วหรือยัง?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              เข้าร่วมกับเรา เริ่มซื้อขายสินค้าออนไลน์ได้ทันที
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Button 
                    size="lg" 
                    className="btn-glow gradient-red-orange"
                    onClick={() => window.location.href = getLoginUrl()}
                  >
                    สมัครสมาชิก
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="neon-border-green"
                    onClick={() => window.location.href = getLoginUrl()}
                  >
                    เข้าสู่ระบบ
                  </Button>
                </>
              ) : (
                <Link href="/products">
                  <Button size="lg" className="btn-glow gradient-red-orange">
                    เริ่มช้อปปิ้งเลย
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={APP_LOGO} alt={APP_TITLE} className="w-8 h-8 rounded" />
                <h3 className="text-lg font-bold">{APP_TITLE}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                ตลาดออนไลน์สไตล์สตรีท สำหรับคนรุ่นใหม่
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">เกี่ยวกับเรา</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">เกี่ยวกับ StreetMarket</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">ติดต่อเรา</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">ร่วมงานกับเรา</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">ช่วยเหลือ</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">วิธีการซื้อ</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">วิธีการขาย</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">คำถามที่พบบ่อย</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">นโยบาย</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">นโยบายความเป็นส่วนตัว</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">ข้อกำหนดการใช้งาน</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">นโยบายการคืนเงิน</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 {APP_TITLE}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
