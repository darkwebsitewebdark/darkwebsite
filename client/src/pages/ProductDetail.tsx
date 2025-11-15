import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { Star, Heart, ShoppingCart, Minus, Plus, Store, Shield, Truck } from "lucide-react";
import { useRoute, Link } from "wouter";
import { toast } from "sonner";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  sellerId: number;
  stock: number;
  status: string;
  images: string[];
  sales: number;
  views: number;
  createdAt: string;
};

type Review = {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
  users?: {
    name: string;
  };
};

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = parseInt(params?.id || "0");
  const { user, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch product
  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        toast.error('ไม่สามารถโหลดสินค้าได้');
        setProduct(null);
      } else {
        setProduct(data);
      }
      setIsLoading(false);
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Fetch reviews
  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users (
            name
          )
        `)
        .eq('productId', productId)
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        setReviews(data || []);
      }
    }

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    // TODO: Implement add to cart with Supabase
    toast.success(`เพิ่ม ${quantity} ชิ้นลงตะกร้าแล้ว`);
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    // TODO: Implement add to wishlist with Supabase
    toast.success("เพิ่มลงรายการโปรดแล้ว");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">ไม่พบสินค้า</h2>
            <Link href="/products">
              <Button>กลับไปหน้ารายการสินค้า</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const avgRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 4.5;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            <Card className="overflow-hidden mb-4">
              <div className="aspect-square bg-muted">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
            </Card>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= avgRating ? 'fill-yellow-500 text-yellow-500' : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {avgRating.toFixed(1)} ({reviews.length} รีวิว)
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ขายแล้ว {product.sales || 0}
              </span>
            </div>

            <div className="mb-6">
              <div className="text-4xl font-bold text-primary mb-2">
                ฿{(product.price / 100).toFixed(2)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>การันตีของแท้ 100%</span>
              </div>
            </div>

            <Card className="p-4 mb-6">
              <h3 className="font-semibold mb-2">รายละเอียดสินค้า</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {product.description}
              </p>
            </Card>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-sm">จัดส่งฟรีสำหรับคำสั่งซื้อมากกว่า ฿500</span>
              </div>
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" />
                <span className="text-sm">คงเหลือ {product.stock} ชิ้น</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  className="w-16 text-center border-0 focus-visible:ring-0"
                  min={1}
                  max={product.stock}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                ทั้งหมด ฿{((product.price * quantity) / 100).toFixed(2)}
              </span>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 btn-glow gradient-red-orange"
                size="lg"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.stock === 0 ? 'สินค้าหมด' : 'เพิ่มลงตะกร้า'}
              </Button>
              <Button
                onClick={handleAddToWishlist}
                variant="outline"
                size="lg"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">รีวิวจากผู้ซื้อ</h2>

          {reviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>ยังไม่มีรีวิว</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold">
                        {review.users?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">{review.users?.name || 'ผู้ใช้'}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString('th-TH')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
