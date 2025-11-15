import { useState } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function Cart() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch cart items using tRPC
  const { data: cartItems = [], isLoading, refetch } = trpc.cart.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Mutations
  const updateMutation = trpc.cart.update.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("อัพเดทจำนวนแล้ว");
    },
    onError: (error) => {
      toast.error(error.message || "ไม่สามารถอัพเดทจำนวนได้");
    },
  });

  const removeMutation = trpc.cart.remove.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("ลบสินค้าออกจากตะกร้าแล้ว");
    },
    onError: (error) => {
      toast.error(error.message || "ไม่สามารถลบสินค้าได้");
    },
  });

  const clearMutation = trpc.cart.clear.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("ล้างตะกร้าแล้ว");
    },
    onError: (error) => {
      toast.error(error.message || "ไม่สามารถล้างตะกร้าได้");
    },
  });

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateMutation.mutate({ id: itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: number) => {
    if (confirm("ต้องการลบสินค้านี้ออกจากตะกร้าใช่หรือไม่?")) {
      removeMutation.mutate({ id: itemId });
    }
  };

  const handleClearCart = () => {
    if (confirm("ต้องการล้างตะกร้าทั้งหมดใช่หรือไม่?")) {
      clearMutation.mutate();
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="card-neon p-8 max-w-md w-full text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">กรุณาเข้าสู่ระบบ</h2>
            <p className="text-muted-foreground mb-6">
              คุณต้องเข้าสู่ระบบก่อนจึงจะดูตะกร้าสินค้าได้
            </p>
            <Button
              onClick={() => setLocation("/login")}
              className="w-full btn-neon bg-primary hover:bg-primary/90"
            >
              เข้าสู่ระบบ
            </Button>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold neon-text-red mb-2">ตะกร้าสินค้า</h1>
            <p className="text-muted-foreground">
              จัดการสินค้าในตะกร้าของคุณ
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">กำลังโหลด...</span>
            </div>
          ) : cartItems.length === 0 ? (
            <Card className="card-neon p-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">ตะกร้าว่างเปล่า</h2>
              <p className="text-muted-foreground mb-6">
                คุณยังไม่มีสินค้าในตะกร้า เริ่มช้อปปิ้งเลย!
              </p>
              <Button
                onClick={() => setLocation("/products")}
                className="btn-neon bg-primary hover:bg-primary/90"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                เริ่มช้อปปิ้ง
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="card-neon p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link href={`/product/${item.product_id}`}>
                        <img
                          src={item.product?.image_url || "/placeholder.png"}
                          alt={item.product?.name || "Product"}
                          className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1">
                        <Link href={`/product/${item.product_id}`}>
                          <h3 className="font-bold text-lg mb-1 hover:text-primary cursor-pointer">
                            {item.product?.name || "Unknown Product"}
                          </h3>
                        </Link>
                        <p className="text-primary font-bold text-xl mb-4">
                          ฿{(item.product?.price || 0).toLocaleString()}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updateMutation.isPending}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center font-bold">
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={updateMutation.isPending}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removeMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            ลบ
                          </Button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">รวม</p>
                        <p className="text-xl font-bold text-primary">
                          ฿{((item.product?.price || 0) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Clear Cart Button */}
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  disabled={clearMutation.isPending}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  ล้างตะกร้าทั้งหมด
                </Button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="card-neon p-6 sticky top-20">
                  <h2 className="text-xl font-bold mb-6">สรุปคำสั่งซื้อ</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ยอดรวม</span>
                      <span className="font-semibold">
                        ฿{subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ค่าจัดส่ง</span>
                      <span className="font-semibold">
                        {shipping > 0 ? `฿${shipping}` : "ฟรี"}
                      </span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">ยอดรวมทั้งหมด</span>
                        <span className="font-bold text-primary text-2xl">
                          ฿{total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setLocation("/checkout")}
                    className="w-full btn-neon bg-primary hover:bg-primary/90 text-lg py-6"
                  >
                    ดำเนินการชำระเงิน
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setLocation("/products")}
                    className="w-full mt-4"
                  >
                    ช้อปปิ้งต่อ
                  </Button>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
