import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";


type CartItem = {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string;
    images: string[];
    stock: number;
  };
};

export default function Cart() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cart items
  useEffect(() => {
    async function fetchCart() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const { data, error} = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products (
            id,
            name,
            price,
            image_url,
            images,
            stock
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching cart:', error);
        toast.error('ไม่สามารถโหลดตะกร้าได้');
        setCartItems([]);
      } else {
        setCartItems(data || []);
      }
      setIsLoading(false);
    }

    fetchCart();
  }, [user]);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', itemId);

    if (error) {
      console.error('Error updating quantity:', error);
      toast.error('ไม่สามารถอัพเดทจำนวนได้');
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success('อัพเดทจำนวนแล้ว');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Error removing item:', error);
      toast.error('ไม่สามารถลบสินค้าได้');
    } else {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('ลบสินค้าออกจากตะกร้าแล้ว');
    }
  };

  const handleClearCart = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing cart:', error);
      toast.error('ไม่สามารถล้างตะกร้าได้');
    } else {
      setCartItems([]);
      toast.success('ล้างตะกร้าแล้ว');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center max-w-md">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-4">กรุณาเข้าสู่ระบบ</h2>
            <p className="text-muted-foreground mb-6">
              เข้าสู่ระบบเพื่อดูตะกร้าสินค้าของคุณ
            </p>
            <Button
              size="lg"
              className="btn-glow gradient-red-orange"
              onClick={() => window.location.href = "/login"}
            >
              เข้าสู่ระบบ
            </Button>
          </Card>
        </div>
      </div>
    );
  }

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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
          <Card className="p-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-bold mb-2">ตะกร้าสินค้าว่างเปล่า</h2>
            <p className="text-muted-foreground mb-6">
              เพิ่มสินค้าลงตะกร้าเพื่อเริ่มช้อปปิ้ง
            </p>
            <Link href="/products">
              <Button className="btn-glow gradient-red-orange">
                เริ่มช้อปปิ้ง
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal >= 50000 ? 0 : 5000; // Free shipping over ฿500
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">ตะกร้าสินค้า</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">
                {cartItems.length} รายการ
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                className="text-destructive hover:text-destructive"
              >
                ล้างตะกร้า
              </Button>
            </div>

            {cartItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <Link href={`/product/${item.product.id}`}>
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.product.images?.[0] || item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex-1">
                    <Link href={`/product/${item.product.id}`}>
                      <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>

                    <p className="text-lg font-bold text-primary mb-3">
                      ฿{(item.product.price / 100).toFixed(2)}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value) || 1;
                            handleUpdateQuantity(item.id, Math.max(1, Math.min(item.product.stock, newQty)));
                          }}
                          className="w-16 text-center border-0 focus-visible:ring-0"
                          min={1}
                          max={item.product.stock}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {item.quantity > item.product.stock && (
                      <p className="text-xs text-destructive mt-2">
                        คงเหลือเพียง {item.product.stock} ชิ้น
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ฿{((item.product.price * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">สรุปคำสั่งซื้อ</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ยอดรวม</span>
                  <span>฿{(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ค่าจัดส่ง</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-500">ฟรี</span>
                    ) : (
                      `฿${(shipping / 100).toFixed(2)}`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    ซื้อเพิ่ม ฿{((50000 - subtotal) / 100).toFixed(2)} เพื่อจัดส่งฟรี
                  </p>
                )}
                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                  <span>ยอดรวมทั้งหมด</span>
                  <span className="text-primary">฿{(total / 100).toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={() => setLocation('/checkout')}
                className="w-full btn-glow gradient-red-orange"
                size="lg"
              >
                ดำเนินการชำระเงิน
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Link href="/products">
                <Button variant="outline" className="w-full mt-3">
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
