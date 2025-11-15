import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { trpc } from "@/lib/trpc";
import {
  CreditCard,
  Wallet,
  MapPin,
  Package,
  CheckCircle,
  Loader2,
  QrCode,
} from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch cart items
  const { data: cartItems = [], isLoading } = trpc.cart.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "promptpay">("promptpay");
  const [promptPayPhone, setPromptPayPhone] = useState("0812345678"); // Default PromptPay ID
  const [shippingForm, setShippingForm] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    district: "",
    subdistrict: "",
    province: "",
    postalCode: "",
  });

  // Payment result state
  const [paymentResult, setPaymentResult] = useState<any>(null);

  // Mutations
  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: (order) => {
      toast.success("สั่งซื้อสำเร็จ!");
      setLocation(`/orders/${order.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "ไม่สามารถสั่งซื้อได้");
    },
  });

  const createOrderWithPromptPayMutation = trpc.orders.createWithPromptPay.useMutation({
    onSuccess: (result) => {
      setPaymentResult(result);
      toast.success("สร้างคำสั่งซื้อสำเร็จ! กรุณาสแกน QR Code เพื่อชำระเงิน");
    },
    onError: (error) => {
      toast.error(error.message || "ไม่สามารถสร้างคำสั่งซื้อได้");
    },
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || cartItems.length === 0) return;

    // Validate shipping form
    if (
      !shippingForm.name ||
      !shippingForm.phone ||
      !shippingForm.address ||
      !shippingForm.province
    ) {
      toast.error("กรุณากรอกข้อมูลที่อยู่จัดส่งให้ครบถ้วน");
      return;
    }

    // Prepare order items
    const items = cartItems.map((item) => ({
      productId: item.product_id,
      quantity: item.quantity,
    }));

    const shippingAddress = {
      name: shippingForm.name,
      phone: shippingForm.phone,
      address: shippingForm.address,
      province: shippingForm.province,
      district: shippingForm.district,
      subdistrict: shippingForm.subdistrict || "-",
      postalCode: shippingForm.postalCode,
    };

    if (paymentMethod === "wallet") {
      createOrderMutation.mutate({
        items,
        shippingAddress,
      });
    } else {
      // PromptPay
      if (!promptPayPhone) {
        toast.error("กรุณาระบุเบอร์ PromptPay");
        return;
      }

      createOrderWithPromptPayMutation.mutate({
        items,
        shippingAddress,
        promptPayPhone,
      });
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="card-neon p-8 max-w-md w-full text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">กรุณาเข้าสู่ระบบ</h2>
            <p className="text-muted-foreground mb-6">
              คุณต้องเข้าสู่ระบบก่อนจึงจะชำระเงินได้
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

  // Show payment result (PromptPay QR Code)
  if (paymentResult) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <Card className="card-neon p-8 text-center">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h2 className="text-2xl font-bold mb-2">สร้างคำสั่งซื้อสำเร็จ!</h2>
                <p className="text-muted-foreground mb-6">
                  กรุณาสแกน QR Code ด้านล่างเพื่อชำระเงิน
                </p>

                {/* QR Code */}
                <div className="bg-white p-6 rounded-lg inline-block mb-6">
                  <img
                    src={paymentResult.payment.qrCodeUrl}
                    alt="PromptPay QR Code"
                    className="w-64 h-64"
                  />
                </div>

                {/* Payment Details */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">จำนวนเงิน:</span>
                    <span className="font-bold text-xl text-primary">
                      ฿{paymentResult.payment.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">เลขที่อ้างอิง:</span>
                    <span className="font-mono">{paymentResult.payment.refNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">หมดอายุ:</span>
                    <span>
                      {new Date(paymentResult.payment.expiresAt).toLocaleTimeString("th-TH")}
                    </span>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-muted/20 p-4 rounded-lg mb-6 text-left">
                  <h3 className="font-bold mb-2">วิธีชำระเงิน:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>เปิดแอปธนาคารหรือแอป Mobile Banking</li>
                    <li>เลือกเมนู "สแกน QR Code" หรือ "PromptPay"</li>
                    <li>สแกน QR Code ด้านบน</li>
                    <li>ตรวจสอบจำนวนเงินให้ถูกต้อง</li>
                    <li>ยืนยันการชำระเงิน</li>
                  </ol>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/orders")}
                    className="flex-1"
                  >
                    ดูคำสั่งซื้อ
                  </Button>
                  <Button
                    onClick={() => setLocation("/")}
                    className="flex-1 btn-neon bg-primary hover:bg-primary/90"
                  >
                    กลับหน้าแรก
                  </Button>
                </div>
              </Card>
            </div>
          </div>
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
            <h1 className="text-3xl font-bold neon-text-red mb-2">ชำระเงิน</h1>
            <p className="text-muted-foreground">กรอกข้อมูลเพื่อดำเนินการสั่งซื้อ</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">กำลังโหลด...</span>
            </div>
          ) : cartItems.length === 0 ? (
            <Card className="card-neon p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">ตะกร้าว่างเปล่า</h2>
              <p className="text-muted-foreground mb-6">
                กรุณาเพิ่มสินค้าลงตะกร้าก่อนชำระเงิน
              </p>
              <Button
                onClick={() => setLocation("/products")}
                className="btn-neon bg-primary hover:bg-primary/90"
              >
                เริ่มช้อปปิ้ง
              </Button>
            </Card>
          ) : (
            <form onSubmit={handleCheckout}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Forms */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Shipping Address */}
                  <Card className="card-neon p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-bold">ที่อยู่จัดส่ง</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">ชื่อ-นามสกุล *</Label>
                        <Input
                          id="name"
                          value={shippingForm.name}
                          onChange={(e) =>
                            setShippingForm({ ...shippingForm, name: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">เบอร์โทรศัพท์ *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={shippingForm.phone}
                          onChange={(e) =>
                            setShippingForm({ ...shippingForm, phone: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="address">ที่อยู่ *</Label>
                        <Textarea
                          id="address"
                          value={shippingForm.address}
                          onChange={(e) =>
                            setShippingForm({ ...shippingForm, address: e.target.value })
                          }
                          rows={3}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="district">เขต/อำเภอ</Label>
                        <Input
                          id="district"
                          value={shippingForm.district}
                          onChange={(e) =>
                            setShippingForm({ ...shippingForm, district: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="province">จังหวัด *</Label>
                        <Input
                          id="province"
                          value={shippingForm.province}
                          onChange={(e) =>
                            setShippingForm({ ...shippingForm, province: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="postalCode">รหัสไปรษณีย์</Label>
                        <Input
                          id="postalCode"
                          value={shippingForm.postalCode}
                          onChange={(e) =>
                            setShippingForm({ ...shippingForm, postalCode: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Payment Method */}
                  <Card className="card-neon p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-bold">วิธีชำระเงิน</h2>
                    </div>

                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value: any) => setPaymentMethod(value)}
                    >
                      <div className="flex items-center space-x-2 p-4 border border-border rounded-lg mb-4">
                        <RadioGroupItem value="promptpay" id="promptpay" />
                        <Label htmlFor="promptpay" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <QrCode className="w-6 h-6 text-primary" />
                            <div>
                              <p className="font-semibold">PromptPay QR Code</p>
                              <p className="text-sm text-muted-foreground">
                                สแกน QR Code เพื่อชำระเงิน
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-4 border border-border rounded-lg opacity-50">
                        <RadioGroupItem value="wallet" id="wallet" disabled />
                        <Label htmlFor="wallet" className="flex-1 cursor-not-allowed">
                          <div className="flex items-center gap-3">
                            <Wallet className="w-6 h-6 text-muted-foreground" />
                            <div>
                              <p className="font-semibold">Wallet (ยังไม่พร้อมใช้งาน)</p>
                              <p className="text-sm text-muted-foreground">
                                ชำระด้วย Wallet ในระบบ
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "promptpay" && (
                      <div className="mt-4">
                        <Label htmlFor="promptPayPhone">
                          เบอร์ PromptPay ของร้านค้า (สำหรับทดสอบ)
                        </Label>
                        <Input
                          id="promptPayPhone"
                          value={promptPayPhone}
                          onChange={(e) => setPromptPayPhone(e.target.value)}
                          placeholder="0812345678"
                        />
                      </div>
                    )}
                  </Card>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="card-neon p-6 sticky top-20">
                    <h2 className="text-xl font-bold mb-6">สรุปคำสั่งซื้อ</h2>

                    {/* Cart Items */}
                    <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <img
                            src={item.product?.image_url || "/placeholder.png"}
                            alt={item.product?.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">
                              {item.product?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} x ฿{item.product?.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="space-y-3 mb-6 pt-6 border-t border-border">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ยอดรวม</span>
                        <span className="font-semibold">฿{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ค่าจัดส่ง</span>
                        <span className="font-semibold">
                          {shipping > 0 ? `฿${shipping}` : "ฟรี"}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg pt-3 border-t border-border">
                        <span className="font-bold">ยอดรวมทั้งหมด</span>
                        <span className="font-bold text-primary text-2xl">
                          ฿{total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full btn-neon bg-primary hover:bg-primary/90 text-lg py-6"
                      disabled={
                        createOrderMutation.isPending ||
                        createOrderWithPromptPayMutation.isPending
                      }
                    >
                      {createOrderMutation.isPending ||
                      createOrderWithPromptPayMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
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
          )}
        </div>
      </div>
    </>
  );
}
