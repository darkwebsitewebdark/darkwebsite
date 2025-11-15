import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { 
  ShoppingBag, 
  TrendingUp, 
  Shield, 
  Zap, 
  ArrowRight,
  Star
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
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ยินดีต้อนรับสู่ StreetMarket
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              แพลตฟอร์ม E-commerce ที่ดีที่สุดสำหรับผู้ซื้อและผู้ขาย
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="btn-glow gradient-red-orange">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  เริ่มช้อปปิ้ง
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link href="/seller/register">
                  <Button size="lg" variant="outline">
                    เริ่มขายสินค้า
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-y border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">ปลอดภัย 100%</h3>
              <p className="text-muted-foreground">
                ระบบชำระเงินที่ปลอดภัย พร้อมการันตีคืนเงิน
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">จัดส่งรวดเร็ว</h3>
              <p className="text-muted-foreground">
                จัดส่งฟรีสำหรับคำสั่งซื้อมากกว่า ฿500
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">สินค้าคุณภาพ</h3>
              <p className="text-muted-foreground">
                สินค้าคัดสรรจากผู้ขายที่ผ่านการตรวจสอบ
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">หมวดหมู่สินค้า</h2>
              <Link href="/categories">
                <Button variant="ghost">
                  ดูทั้งหมด
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories.slice(0, 10).map((category) => (
                <Link key={category.id} href={`/products?category=${category.id}`}>
                  <Card className="p-4 text-center hover:border-primary transition-colors cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-3 overflow-hidden flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">สินค้าแนะนำ</h2>
            <Link href="/products">
              <Button variant="ghost">
                ดูทั้งหมด
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="aspect-square bg-muted"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="overflow-hidden hover:border-primary transition-all hover:shadow-lg cursor-pointer">
                    <div className="aspect-square bg-muted overflow-hidden">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-2xl font-bold text-primary">
                          ฿{(product.price / 100).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm text-muted-foreground">4.5</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ขายแล้ว {product.sales || 0}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <h2 className="text-4xl font-bold mb-4">พร้อมเริ่มต้นแล้วหรือยัง?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              เข้าร่วมกับผู้ซื้อและผู้ขายหลายพันคนบน StreetMarket
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="btn-glow gradient-red-orange">
                  เริ่มช้อปปิ้ง
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link href="/seller/register">
                  <Button size="lg" variant="outline">
                    สมัครเป็นผู้ขาย
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">เกี่ยวกับเรา</h3>
              <p className="text-sm text-muted-foreground">
                StreetMarket คือแพลตฟอร์ม E-commerce ที่เชื่อมต่อผู้ซื้อและผู้ขายเข้าด้วยกัน
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">ลิงก์ด่วน</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products"><a className="text-muted-foreground hover:text-primary">สินค้าทั้งหมด</a></Link></li>
                <li><Link href="/categories"><a className="text-muted-foreground hover:text-primary">หมวดหมู่</a></Link></li>
                <li><Link href="/seller/register"><a className="text-muted-foreground hover:text-primary">เริ่มขายสินค้า</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">ช่วยเหลือ</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary">วิธีการสั่งซื้อ</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">การจัดส่ง</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">การคืนสินค้า</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">ติดต่อเรา</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: support@streetmarket.com</li>
                <li>Tel: 02-xxx-xxxx</li>
                <li>Line: @streetmarket</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 StreetMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
