import { useState } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  User,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending_payment: { label: "รอชำระเงิน", color: "bg-yellow-500", icon: Clock },
  paid: { label: "ชำระเงินแล้ว", color: "bg-blue-500", icon: CheckCircle },
  processing: { label: "กำลังเตรียมสินค้า", color: "bg-purple-500", icon: Package },
  shipped: { label: "จัดส่งแล้ว", color: "bg-cyan-500", icon: Truck },
  delivered: { label: "ส่งสำเร็จ", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "ยกเลิก", color: "bg-red-500", icon: XCircle },
  refunded: { label: "คืนเงินแล้ว", color: "bg-gray-500", icon: XCircle },
};

export default function OrderDetail() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/orders/:id");
  const orderId = params?.id ? parseInt(params.id) : 0;

  // Fetch order detail
  const { data: order, isLoading } = trpc.orders.get.useQuery(
    { id: orderId },
    { enabled: isAuthenticated && orderId > 0 }
  );

  // Confirm delivery mutation
  const confirmDeliveryMutation = trpc.orders.confirmDelivery.useMutation({
    onSuccess: () => {
      toast.success("ยืนยันการรับสินค้าสำเร็จ");
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message || "ไม่สามารถยืนยันการรับสินค้าได้");
    },
  });

  const handleConfirmDelivery = () => {
    if (confirm("ยืนยันว่าได้รับสินค้าแล้วใช่หรือไม่?")) {
      confirmDeliveryMutation.mutate({ orderId });
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="card-neon p-8 max-w-md w-full text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">กรุณาเข้าสู่ระบบ</h2>
            <p className="text-muted-foreground mb-6">
              คุณต้องเข้าสู่ระบบก่อนจึงจะดูคำสั่งซื้อได้
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

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-muted-foreground">กำลังโหลด...</span>
          </div>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="card-neon p-8 max-w-md w-full text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">ไม่พบคำสั่งซื้อ</h2>
            <p className="text-muted-foreground mb-6">
              คำสั่งซื้อที่คุณค้นหาไม่พบในระบบ
            </p>
            <Button
              onClick={() => setLocation("/orders")}
              className="w-full btn-neon bg-primary hover:bg-primary/90"
            >
              กลับไปหน้าคำสั่งซื้อ
            </Button>
          </Card>
        </div>
      </>
    );
  }

  const config = statusConfig[order.status] || statusConfig.pending_payment;
  const StatusIcon = config.icon;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => setLocation("/orders")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปหน้าคำสั่งซื้อ
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Header */}
              <Card className="card-neon p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{order.orderNumber}</h1>
                    <p className="text-sm text-muted-foreground">
                      สั่งซื้อเมื่อ:{" "}
                      {new Date(order.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge className={`${config.color} text-white text-lg px-4 py-2`}>
                    <StatusIcon className="w-5 h-5 mr-2" />
                    {config.label}
                  </Badge>
                </div>

                {/* Order Timeline */}
                <div className="mt-6">
                  <h3 className="font-bold mb-4">สถานะคำสั่งซื้อ</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            order.createdAt ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div className="w-0.5 h-12 bg-border"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">สั่งซื้อสำเร็จ</p>
                        <p className="text-sm text-muted-foreground">
                          {order.createdAt &&
                            new Date(order.createdAt).toLocaleString("th-TH")}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            order.paidAt ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="w-0.5 h-12 bg-border"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">ชำระเงินแล้ว</p>
                        <p className="text-sm text-muted-foreground">
                          {order.paidAt
                            ? new Date(order.paidAt).toLocaleString("th-TH")
                            : "รอชำระเงิน"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            order.shippedAt ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <Truck className="w-5 h-5 text-white" />
                        </div>
                        <div className="w-0.5 h-12 bg-border"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">จัดส่งแล้ว</p>
                        <p className="text-sm text-muted-foreground">
                          {order.shippedAt
                            ? new Date(order.shippedAt).toLocaleString("th-TH")
                            : "รอจัดส่ง"}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-sm text-primary">
                            เลขพัสดุ: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            order.deliveredAt ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">ส่งสำเร็จ</p>
                        <p className="text-sm text-muted-foreground">
                          {order.deliveredAt
                            ? new Date(order.deliveredAt).toLocaleString("th-TH")
                            : "รอรับสินค้า"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Delivery Button */}
                {order.status === "shipped" && (
                  <div className="mt-6">
                    <Button
                      onClick={handleConfirmDelivery}
                      disabled={confirmDeliveryMutation.isPending}
                      className="w-full btn-neon bg-green-600 hover:bg-green-700"
                    >
                      {confirmDeliveryMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          กำลังดำเนินการ...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          ยืนยันการรับสินค้า
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </Card>

              {/* Order Items */}
              <Card className="card-neon p-6">
                <h2 className="text-xl font-bold mb-4">รายการสินค้า</h2>
                <div className="space-y-4">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.productImage || "/placeholder.png"}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.productName}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          จำนวน: {item.quantity}
                        </p>
                        <p className="font-bold text-primary">
                          ฿{item.price.toLocaleString()} x {item.quantity} = ฿
                          {item.subtotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Summary & Shipping */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="card-neon p-6">
                <h2 className="text-xl font-bold mb-4">สรุปคำสั่งซื้อ</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ยอดรวม</span>
                    <span className="font-semibold">
                      ฿{order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">ยอดรวมทั้งหมด</span>
                    <span className="font-bold text-primary text-2xl">
                      ฿{order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              <Card className="card-neon p-6">
                <h2 className="text-xl font-bold mb-4">ที่อยู่จัดส่ง</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">{order.shippingAddress?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p>{order.shippingAddress?.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p>{order.shippingAddress?.address}</p>
                      <p>
                        {order.shippingAddress?.district}{" "}
                        {order.shippingAddress?.province}{" "}
                        {order.shippingAddress?.postalCode}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
