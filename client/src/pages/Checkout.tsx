import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { CreditCard, Wallet, QrCode } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "promptpay">("wallet");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [refNumber, setRefNumber] = useState("");

  const { data: cartItems } = trpc.cart.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Wallet balance will be checked on server side

  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      toast.success("สร้างคำสั่งซื้อสำเร็จ");
      setLocation(`/orders/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "เกิดข้อผิดพลาด");
    },
  });

  const generateQRMutation = trpc.payment.createTopUpRequest.useMutation({
    onSuccess: (data) => {
      setQrCodeUrl(data.qrCodeUrl);
      setRefNumber(data.refNumber);
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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
    );
  }

  if (!cartItems || cartItems.length === 0) {
    setLocation("/cart");
    return null;
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!address || !phone) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (paymentMethod === "wallet") {

      try {
        await createOrderMutation.mutateAsync({
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product?.price || 0,
          })),
          shippingAddress: {
            name: user?.name || '',
            phone,
            address,
            province: '',
            district: '',
            subdistrict: '',
            postalCode: '',
          },
        });
      } catch (error) {
        // Error handled by mutation
      }
    } else {
      // Generate PromptPay QR
      try {
        await generateQRMutation.mutateAsync({ amount: total });
        toast.info("กรุณาสแกน QR Code เพื่อชำระเงิน");
      } catch (error) {
        toast.error("เกิดข้อผิดพลาด");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">ชำระเงิน</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">ที่อยู่จัดส่ง</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">ที่อยู่</Label>
                  <Textarea
                    id="address"
                    placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0812345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">หมายเหตุ (ถ้ามี)</Label>
                  <Textarea
                    id="notes"
                    placeholder="ข้อความถึงผู้ขาย"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">วิธีชำระเงิน</h2>
              <div className="space-y-4">
                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    paymentMethod === "wallet"
                      ? "neon-border-red"
                      : "border-border hover:border-primary"
                  }`}
                  onClick={() => setPaymentMethod("wallet")}
                >
                  <div className="flex items-center gap-4">
                    <Wallet className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <h3 className="font-semibold">กระเป๋าเงิน</h3>
                      <p className="text-sm text-muted-foreground">
                        ชำระเงินจากกระเป๋าของคุณ
                      </p>
                    </div>
                    {paymentMethod === "wallet" && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </Card>

                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    paymentMethod === "promptpay"
                      ? "neon-border-green"
                      : "border-border hover:border-secondary"
                  }`}
                  onClick={() => setPaymentMethod("promptpay")}
                >
                  <div className="flex items-center gap-4">
                    <QrCode className="w-8 h-8 text-secondary" />
                    <div className="flex-1">
                      <h3 className="font-semibold">PromptPay QR Code</h3>
                      <p className="text-sm text-muted-foreground">
                        สแกนจ่ายผ่าน Mobile Banking
                      </p>
                    </div>
                    {paymentMethod === "promptpay" && (
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-black" />
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {qrCodeUrl && paymentMethod === "promptpay" && (
                <Card className="p-6 mt-4 text-center">
                  <h3 className="font-semibold mb-4">สแกน QR Code เพื่อชำระเงิน</h3>
                  <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    REF: <span className="font-mono font-bold">{refNumber}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    กรุณาโอนเงินภายใน 15 นาที
                  </p>
                </Card>
              )}
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-6">สรุปคำสั่งซื้อ</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                      {item.product?.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-sm">
                        {item.product?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x ฿{((item.product?.price || 0) / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ยอดรวม</span>
                  <span className="font-semibold">฿{(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ค่าจัดส่ง</span>
                  <span className="font-semibold text-secondary">ฟรี</span>
                </div>
                <div className="border-t border-border pt-3">
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
                onClick={handleCheckout}
                disabled={createOrderMutation.isPending || generateQRMutation.isPending}
              >
                {createOrderMutation.isPending || generateQRMutation.isPending
                  ? "กำลังดำเนินการ..."
                  : paymentMethod === "wallet"
                  ? "ยืนยันการชำระเงิน"
                  : "สร้าง QR Code"}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
