import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc";
import { Search, Star, Heart, ShoppingCart, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  sales: number;
  stock: number;
  status: string;
  category_id: number;
  seller_id: number;
  created_at: string;
  updated_at: string;
};

type Category = {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
};

export default function Products() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState("newest");

  // Get category from URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location]);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (data) {
        setCategories(data);
      }
    }

    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);

      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active');

      // Apply filters
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (selectedCategory && selectedCategory !== 'all') {
        query = query.eq('category_id', parseInt(selectedCategory));
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'popular':
          query = query.order('sales', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      query = query.limit(50);

      const { data, error } = await query;

      console.log('[Products] Fetch result:', { data, error, count: data?.length });

      if (error) {
        console.error('[Products] Fetch error:', error);
        toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
      }

      if (data) {
        setProducts(data);
      }

      setIsLoading(false);
    }

    fetchProducts();
  }, [searchQuery, selectedCategory, sortBy]);

  const addToCartMutation = trpc.cart.add.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message || 'เกิดข้อผิดพลาด');
    },
  });

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated || !user) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    addToCartMutation.mutate({ productId, quantity: 1 });
  };

  const handleAddToWishlist = async (productId: number) => {
    if (!isAuthenticated || !user) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    try {
      // Check if already in wishlist
      const { data: existing } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (existing) {
        toast.info("สินค้านี้อยู่ในรายการโปรดแล้ว");
        return;
      }

      await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: productId
        });

      toast.success("เพิ่มลงรายการโปรดแล้ว");
    } catch (error) {
      console.error('Add to wishlist error:', error);
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold neon-text-red mb-2">สินค้าทั้งหมด</h1>
          <p className="text-muted-foreground">สินค้าคุณภาพ ราคาถูก จากผู้ขายทั่วประเทศ</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="ค้นหาสินค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="ทุกหมวดหมู่" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="เรียงตาม" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">ใหม่ล่าสุด</SelectItem>
              <SelectItem value="popular">ขายดี</SelectItem>
              <SelectItem value="price_low">ราคาต่ำ - สูง</SelectItem>
              <SelectItem value="price_high">ราคาสูง - ต่ำ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(20)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">ไม่พบสินค้า</h3>
            <p className="text-muted-foreground mb-4">ลองค้นหาด้วยคำอื่นหรือเปลี่ยนหมวดหมู่</p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}>
              รีเซ็ตการค้นหา
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="card-neon overflow-hidden group">
                <Link href={`/product/${product.id}`}>
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

                    {/* Stock Badge */}
                    {product.stock === 0 && (
                      <div className="absolute top-2 right-2 badge-street bg-destructive text-destructive-foreground">
                        หมด
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-bold text-sm mb-2 line-clamp-2 min-h-[2.5rem] hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xl font-bold text-primary">
                      ฿{(product.price / 100).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm">4.5</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground mb-3">
                    ขายแล้ว {product.sales || 0} | คงเหลือ {product.stock}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      ใส่ตะกร้า
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToWishlist(product.id)}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
