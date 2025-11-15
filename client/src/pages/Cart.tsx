import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function Cart() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const { data: cartItems, isLoading } = trpc.cart.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const updateQuantityMutation = trpc.cart.update.useMutation({
    onSuccess: () => {
      utils.cart.list.invalidate();
    },
  });

  const removeItemMutation = trpc.cart.remove.useMutation({
    onSuccess: () => {
      utils.cart.list.invalidate();
      toast.success("ลบสินค้าออกจากตะกร้าแล้ว");
    },
  });

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateQuantityMutation.mutateAsync({ id: itemId, quantity });
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeItemMutation.mutateAsync({ id: itemId });
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
      <Header />
        <Card className="p-8 text-center max-w-md">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-muted-foreground mb-6">
            คุณต้องเข้าสู่ระบบก่อนเพื่อดูตะกร้าสินค้า
          </p>
          <Button
            size="lg"
            className="btn-glow gradient-red-orange"
            onClick={() => window.location.href = getLoginUrl()}
          >
            เข้าสู่ระบบ
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">กำลังโหลด...</div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">ตะกร้าสินค้าว่างเปล่า</h2>
          <p className="text-muted-foreground mb-6">
            คุณยังไม่มีสินค้าในตะกร้า เริ่มช้อปปิ้งกันเลย!
          </p>
          <Link href="/products">
            <Button size="lg" className="btn-glow gradient-red-orange">
              เริ่มช้อปปิ้ง
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">ตะกร้าสินค้า</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link href={`/product/${item.productId}`}>
                    <div className="w-24 h-24 bg-muted rounded overflow-hidden flex-shrink-0 cursor-pointer">
                      {item.product?.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1">
                    <Link href={`/product/${item.productId}`}>
                      <h3 className="font-semibold mb-2 hover:text-primary transition-colors cursor-pointer">
                        {item.product?.name || 'สินค้า'}
                      </h3>
                    </Link>
                    <div className="text-primary font-bold mb-4 price-tag">
                      ฿{((item.product?.price || 0) / 100).toFixed(2)}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const qty = parseInt(e.target.value) || 1;
                            handleUpdateQuantity(item.id, qty);
                          }}
                          className="w-16 text-center"
                          min={1}
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-6">สรุปคำสั่งซื้อ</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ยอดรวม</span>
                  <span className="font-semibold">฿{(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ค่าจัดส่ง</span>
                  <span className="font-semibold text-secondary">ฟรี</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">ยอดรวมทั้งหมด</span>
                    <span className="font-bold text-primary price-tag">
                      ฿{(total / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full btn-glow gradient-red-orange"
                onClick={() => setLocation("/checkout")}
              >
                ดำเนินการชำระเงิน
              </Button>

              <Link href="/products">
                <Button size="lg" variant="outline" className="w-full mt-4">
                  ช้อปปิ้งต่อ
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
