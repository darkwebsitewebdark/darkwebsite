import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Star, Heart, ShoppingCart, Minus, Plus, Store, Shield, Truck } from "lucide-react";
import { useRoute, Link } from "wouter";
import { toast } from "sonner";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = parseInt(params?.id || "0");
  const { user, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = trpc.products.get.useQuery({ id: productId });
  const { data: reviews } = trpc.reviews.list.useQuery({ productId });
  const addToCartMutation = trpc.cart.add.useMutation();
  const addToWishlistMutation = trpc.wishlist.add.useMutation();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    try {
      await addToCartMutation.mutateAsync({ productId, quantity });
      toast.success("เพิ่มสินค้าลงตะกร้าแล้ว");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    try {
      await addToWishlistMutation.mutateAsync({ productId });
      toast.success("เพิ่มลงรายการโปรดแล้ว");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">กำลังโหลด...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">ไม่พบสินค้า</h2>
          <Link href="/products">
            <Button>กลับไปหน้ารายการสินค้า</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const avgRating = reviews && reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  return (
    <div className="min-h-screen bg-background">
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
                {images.map((img: string, idx: number) => (
                  <Card
                    key={idx}
                    className={`cursor-pointer overflow-hidden ${
                      selectedImage === idx ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <div className="aspect-square bg-muted">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(avgRating)
                        ? "fill-accent text-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="ml-2 text-muted-foreground">
                  {avgRating.toFixed(1)} ({reviews?.length || 0} รีวิว)
                </span>
              </div>
              <span className="text-muted-foreground">ขายแล้ว {product.sales || 0}</span>
            </div>

            <div className="mb-6">
              <div className="text-4xl font-bold text-primary price-tag">
                ฿{(product.price / 100).toFixed(2)}
              </div>
            </div>

            <Card className="p-4 mb-6 glass">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>รับประกันของแท้</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-secondary" />
                  <span>จัดส่งฟรี</span>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-accent" />
                  <span>คืนเงินได้</span>
                </div>
              </div>
            </Card>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">คงเหลือ: {product.stock} ชิ้น</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                    min={1}
                    max={product.stock}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <Button
                size="lg"
                className="flex-1 btn-glow gradient-red-orange"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.stock === 0 ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="neon-border-green"
                onClick={handleAddToWishlist}
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">รายละเอียดสินค้า</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
            </Card>
          </div>
        </div>

        {/* Reviews */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">รีวิวสินค้า</h2>

          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">ผู้ใช้</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "fill-accent text-accent"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {review.images.map((img: string, idx: number) => (
                            <img
                              key={idx}
                              src={img}
                              alt=""
                              className="w-20 h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">ยังไม่มีรีวิว</p>
          )}
        </Card>
      </div>
    </div>
  );
}
