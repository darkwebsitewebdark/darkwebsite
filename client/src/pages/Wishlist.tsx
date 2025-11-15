import Header from "@/components/Header";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Wishlist() {
  const { isAuthenticated } = useAuth();

  const { data: wishlistItems, refetch } = trpc.wishlist.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const removeFromWishlistMutation = trpc.wishlist.remove.useMutation({
    onSuccess: () => {
      toast.success("ลบออกจากรายการโปรดแล้ว");
      refetch();
    },
  });

  const addToCartMutation = trpc.cart.add.useMutation({
    onSuccess: () => {
      toast.success("เพิ่มลงตะกร้าแล้ว");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
      <Header />
        <div className="flex items-center justify-center py-20">
          <Card className="p-8 text-center max-w-md">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-4">กรุณาเข้าสู่ระบบ</h2>
            <p className="text-muted-foreground mb-6">
              คุณต้องเข้าสู่ระบบเพื่อดูรายการโปรด
            </p>
            <Link href="/auth">
              <Button size="lg">เข้าสู่ระบบ</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">รายการโปรด</h1>
              <p className="text-muted-foreground mt-1">
                {wishlistItems?.length || 0} รายการ
              </p>
            </div>
          </div>

          {wishlistItems && wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden group">
                  <Link href={`/product/${item.productId}`}>
                    <div className="relative aspect-square overflow-hidden bg-muted cursor-pointer">
                      <img
                        src={item.product?.images?.[0] || "/placeholder.png"}
                        alt={item.product?.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {item.product?.stock === 0 && (
                        <Badge className="absolute top-2 left-2 bg-red-500">
                          สินค้าหมด
                        </Badge>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/product/${item.productId}`}>
                      <h3 className="font-semibold line-clamp-2 hover:text-primary cursor-pointer mb-2">
                        {item.product?.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {item.product?.rating?.toFixed(1) || "0.0"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({item.product?.reviewCount || 0})
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        ฿{((item.product?.price || 0) / 100).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => {
                          if (item.product?.stock && item.product.stock > 0) {
                            addToCartMutation.mutate({
                              productId: item.productId,
                              quantity: 1,
                            });
                          } else {
                            toast.error("สินค้าหมด");
                          }
                        }}
                        disabled={
                          item.product?.stock === 0 || addToCartMutation.isPending
                        }
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {item.product?.stock === 0 ? "สินค้าหมด" : "ใส่ตะกร้า"}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          removeFromWishlistMutation.mutate({ productId: item.productId })
                        }
                        disabled={removeFromWishlistMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">ไม่มีรายการโปรด</h3>
              <p className="text-muted-foreground mb-6">
                คุณยังไม่มีสินค้าในรายการโปรด
              </p>
              <Link href="/products">
                <Button>เริ่มช้อปปิ้ง</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
