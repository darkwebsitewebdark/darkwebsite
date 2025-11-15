import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/lib/supabase";
import { CreditCard, Wallet, MapPin, Package, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

type CartItem = {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string;
    images: string[];
    stock: number;
    seller_id: number;
  };
};

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'promptpay'>('wallet');

  const [shippingForm, setShippingForm] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    district: '',
    province: '',
    postalCode: '',
    notes: ''
  });

  // Fetch cart items
  useEffect(() => {
    async function fetchCart() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products (
            id,
            name,
            price,
            image_url,
            images,
            stock,
            seller_id
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

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || cartItems.length === 0) return;

    // Validate shipping form
    if (!shippingForm.name || !shippingForm.phone || !shippingForm.address || !shippingForm.province) {
      toast.error('กรุณากรอกข้อมูลที่อยู่จัดส่งให้ครบถ้วน');
      return;
    }

    setIsProcessing(true);

    try {
      // Group items by seller
      const itemsBySeller = cartItems.reduce((acc, item) => {
        const sellerId = item.product.seller_id;
        if (!acc[sellerId]) {
          acc[sellerId] = [];
        }
        acc[sellerId].push(item);
        return acc;
      }, {} as Record<number, CartItem[]>);

      // Create orders for each seller
      for (const [sellerId, items] of Object.entries(itemsBySeller)) {
        const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const commissionRate = 0.05; // 5% commission
        const commissionAmount = Math.floor(totalAmount * commissionRate);
        const sellerAmount = totalAmount - commissionAmount;

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            buyer_id: user.id,
            seller_id: parseInt(sellerId),
            order_number: orderNumber,
            total_amount: totalAmount,
            commission_amount: commissionAmount,
            seller_amount: sellerAmount,
            status: paymentMethod === 'wallet' ? 'paid' : 'pending_payment',
            shipping_address: {
              name: shippingForm.name,
              phone: shippingForm.phone,
              address: shippingForm.address,
              district: shippingForm.district,
              province: shippingForm.province,
              postalCode: shippingForm.postalCode,
              notes: shippingForm.notes
            }
          })
          .select()
          .single();

        if (orderError) {
          console.error('Error creating order:', orderError);
          toast.error('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ');
          setIsProcessing(false);
          return;
        }

        // Create order items
        for (const item of items) {
          const { error: itemError } = await supabase
            .from('order_items')
            .insert({
              order_id: order.id,
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.product.price
            });

          if (itemError) {
            console.error('Error creating order item:', itemError);
          }
        }

        // If paying with wallet, deduct balance
        if (paymentMethod === 'wallet') {
          const { error: walletError } = await supabase
            .from('users')
            .update({
              walletBalance: (user.walletBalance || 0) - totalAmount
            })
            .eq('id', user.id);

          if (walletError) {
            console.error('Error updating wallet:', walletError);
            toast.error('เกิดข้อผิดพลาดในการหักเงินจากกระเป๋า');
            setIsProcessing(false);
            return;
          }

          // Create transaction record
          await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              type: 'order_payment',
              amount: -totalAmount,
              balance_after: (user.walletBalance || 0) - totalAmount,
              related_order_id: order.id,
              status: 'completed'
            });
        }
      }

      // Clear cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      toast.success('สั่งซื้อสำเร็จ!');
      setLocation('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('เกิดข้อผิดพลาด');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">กรุณาเข้าสู่ระบบ</h2>
            <Button
              size="lg"
              className="btn-glow gradient-red-orange"
              onClick={() => window.location.href = getLoginUrl()}
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
          <Card className="p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">ตะกร้าสินค้าว่างเปล่า</h2>
            <p className="text-muted-foreground mb-6">
              กรุณาเพิ่มสินค้าลงตะกร้าก่อนชำระเงิน
            </p>
            <Button onClick={() => setLocation('/products')} className="btn-glow gradient-red-orange">
              เริ่มช้อปปิ้ง
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal >= 50000 ? 0 : 5000;
  const total = subtotal + shipping;

  const hasInsufficientBalance = paymentMethod === 'wallet' && (user?.walletBalance || 0) < total;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">ชำระเงิน</h1>

        <form onSubmit={handleCheckout}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">ที่อยู่จัดส่ง</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">ชื่อผู้รับ *</Label>
                    <Input
                      id="name"
                      value={shippingForm.name}
                      onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">เบอร์โทรศัพท์ *</Label>
                    <Input
                      id="phone"
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">ที่อยู่ *</Label>
                    <Textarea
                      id="address"
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                      required
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">เขต/อำเภอ</Label>
                    <Input
                      id="district"
                      value={shippingForm.district}
                      onChange={(e) => setShippingForm({ ...shippingForm, district: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="province">จังหวัด *</Label>
                    <Input
                      id="province"
                      value={shippingForm.province}
                      onChange={(e) => setShippingForm({ ...shippingForm, province: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">รหัสไปรษณีย์</Label>
                    <Input
                      id="postalCode"
                      value={shippingForm.postalCode}
                      onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="notes">หมายเหตุ (ถ้ามี)</Label>
                    <Textarea
                      id="notes"
                      value={shippingForm.notes}
                      onChange={(e) => setShippingForm({ ...shippingForm, notes: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">วิธีการชำระเงิน</h2>
                </div>

                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'wallet' | 'promptpay')}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 border border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Wallet className="w-5 h-5" />
                            <span className="font-semibold">กระเป๋าเงิน</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ยอดคงเหลือ: ฿{((user?.walletBalance || 0) / 100).toFixed(2)}
                          </span>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 border border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                      <RadioGroupItem value="promptpay" id="promptpay" />
                      <Label htmlFor="promptpay" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          <span className="font-semibold">PromptPay QR Code</span>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {hasInsufficientBalance && (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded-lg">
                    <p className="text-sm text-destructive">
                      ยอดเงินในกระเป๋าไม่เพียงพอ กรุณาเติมเงินหรือเลือกวิธีชำระเงินอื่น
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">สรุปคำสั่งซื้อ</h2>

                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-border last:border-0">
                      <img
                        src={item.product.images?.[0] || item.product.image_url}
                        alt={item.product.name}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold line-clamp-2">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                        <p className="text-sm font-bold text-primary">
                          ฿{((item.product.price * item.quantity) / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

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
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                    <span>ยอดรวมทั้งหมด</span>
                    <span className="text-primary">฿{(total / 100).toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-glow gradient-red-orange"
                  size="lg"
                  disabled={isProcessing || hasInsufficientBalance}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      กำลังดำเนินการ...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      ยืนยันการสั่งซื้อ
                    </>
                  )}
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
