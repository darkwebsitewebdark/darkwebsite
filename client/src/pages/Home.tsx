import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { APP_LOGO, APP_TITLE } from "@/const";
import { 
  ShoppingBag, 
  TrendingUp, 
  Shield, 
  Zap, 
  ArrowRight,
  Star,
  Flame,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  sales: number;
  stock: number;
  status: string;
};

type Category = {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
};

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      // Fetch featured products (top 8 by sales)
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('sales', { ascending: false })
        .limit(8);

      if (productsData) {
        setFeaturedProducts(productsData);
      }

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesData) {
        setCategories(categoriesData);
      }

      setIsLoading(false);
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background relative crt-effect">
      <Header />

      {/* Hero Section - Hardcore Dark Style */}
      <section className="relative py-20 md:py-32 overflow-hidden crt-scan">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
        <div className="absolute inset-0 spray-texture"></div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8 animate-float">
              <img 
                src={APP_LOGO} 
                alt={APP_TITLE}
                className="w-64 md:w-96 mx-auto"
              />
            </div>
            
            {/* Tagline with neon effect */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 neon-text-red animate-glow">
              ยินดีต้อนรับสู่ใต้ดิน
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-4 font-semibold">
              แพลตฟอร์ม E-commerce สไตล์สตรีท
            </p>
            <p className="text-lg text-muted-foreground mb-12">
              ซื้อ-ขาย สินค้าแท้ ราคาถูก ปลอดภัย 100%
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="btn-neon bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  เริ่มช้อปปิ้ง
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link href="/seller/register">
                  <Button size="lg" variant="outline" className="btn-neon border-secondary text-secondary hover:bg-secondary/10 font-bold text-lg px-8">
                    เริ่มขายสินค้า
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Street Style */}
      <section className="py-16 bg-card/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="card-neon p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 neon-text-red">ปลอดภัย 100%</h3>
              <p className="text-muted-foreground">
                ระบบรักษาความปลอดภัยระดับสูง พร้อมการันตีสินค้าแท้
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="card-neon p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                <Zap className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2 neon-text-green">จัดส่งเร็ว</h3>
              <p className="text-muted-foreground">
                จัดส่งด่วนทั่วประเทศ ติดตามพัสดุแบบ Real-time
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="card-neon p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2 neon-text-orange">ราคาดี</h3>
              <p className="text-muted-foreground">
                ราคาถูกกว่าห้าง ของแท้ 100% มีรีวิวจากผู้ซื้อจริง
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold neon-text-red">
              หมวดหมู่สินค้า
            </h2>
            <Link href="/products">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                ดูทั้งหมด
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-3"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories.map((category) => (
                <Link key={category.id} href={`/products?category=${category.id}`}>
                  <Card className="card-neon p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                    <div className="w-12 h-12 mx-auto mb-3 text-4xl">
                      {category.icon || '📦'}
                    </div>
                    <h3 className="font-bold text-sm">{category.name}</h3>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-card/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold neon-text-red mb-2">
                สินค้าแนะนำ
              </h2>
              <p className="text-muted-foreground flex items-center gap-2">
                <Flame className="w-5 h-5 text-primary" />
                สินค้าขายดีประจำสัปดาห์
              </p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                ดูทั้งหมด
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">ไม่พบสินค้า</p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="card-neon overflow-hidden group">
                    {/* Product Image */}
                    <div className="aspect-square relative overflow-hidden bg-muted">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ShoppingBag className="w-12 h-12" />
                        </div>
                      )}
                      
                      {/* Hot Badge */}
                      {product.sales > 50 && (
                        <div className="absolute top-2 right-2 badge-street badge-pulse bg-primary text-primary-foreground border-primary">
                          <Flame className="w-3 h-3 mr-1" />
                          ขายดี
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-2 truncate-2 min-h-[2.5rem]">
                        {product.name}
                      </h3>
                      
                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="price-tag text-primary">
                          ฿{(product.price / 100).toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                      </div>

                      {/* Rating & Sales */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span>4.5</span>
                        </div>
                        <span>ขายแล้ว {product.sales || 0}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
        <div className="absolute inset-0 spray-texture"></div>
        
        <div className="container relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 neon-text-red">
            พร้อมเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            เข้าร่วมกับผู้ซื้อและผู้ขายนับพันคนบน {APP_TITLE}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="btn-neon bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8">
                <Sparkles className="w-5 h-5 mr-2" />
                เริ่มช้อปปิ้งเลย
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link href="/seller/register">
                <Button size="lg" variant="outline" className="btn-neon border-secondary text-secondary hover:bg-secondary/10 font-bold text-lg px-8">
                  สมัครเป็นผู้ขาย
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 py-12 border-t border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="font-bold text-lg mb-4 neon-text-red">เกี่ยวกับเรา</h3>
              <p className="text-sm text-muted-foreground">
                {APP_TITLE} แพลตฟอร์ม E-commerce สไตล์สตรีท ที่ดีที่สุดสำหรับผู้ซื้อและผู้ขาย
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">ลิงก์ด่วน</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/products" className="hover:text-primary">สินค้าทั้งหมด</Link></li>
                <li><Link href="/seller/register" className="hover:text-primary">เริ่มขายสินค้า</Link></li>
                <li><Link href="/about" className="hover:text-primary">เกี่ยวกับเรา</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-lg mb-4">ช่วยเหลือ</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-primary">ศูนย์ช่วยเหลือ</Link></li>
                <li><Link href="/contact" className="hover:text-primary">ติดต่อเรา</Link></li>
                <li><Link href="/terms" className="hover:text-primary">เงื่อนไขการใช้งาน</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4">ติดต่อเรา</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: support@streetmarket.com</li>
                <li>Tel: 02-XXX-XXXX</li>
                <li>LINE: @streetmarket</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2024 {APP_TITLE}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
