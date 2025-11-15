import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Package, Clock, Truck, CheckCircle, XCircle, Eye } from "lucide-react";
import { Link, useRoute } from "wouter";
import { toast } from "sonner";

export default function Orders() {
  const [, params] = useRoute("/orders/:id?");
  const orderId = params?.id ? parseInt(params.id) : undefined;
  
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<string>("all");

  const { data: orders } = trpc.orders.list.useQuery({}, {
    enabled: isAuthenticated,
  });

  const { data: orderDetail } = trpc.orders.get.useQuery(
    { id: orderId! },
    { enabled: !!orderId }
  );

  const confirmDeliveryMutation = trpc.orders.confirmDelivery.useMutation({
    onSuccess: () => {
      toast.success("ยืนยันการรับสินค้าแล้ว");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-muted-foreground mb-6">
            คุณต้องเข้าสู่ระบบเพื่อดูคำสั่งซื้อ
          </p>
          <Link href="/auth">
            <Button size="lg">เข้าสู่ระบบ</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // If viewing specific order
  if (orderId && orderDetail) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="max-w-4xl mx-auto">
            <Link href="/orders">
              <Button variant="ghost" className="mb-4">
                ← กลับไปรายการคำสั่งซื้อ
              </Button>
            </Link>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">
                    คำสั่งซื้อ #{orderDetail.orderNumber}
                  </h1>
                  <p className="text-muted-foreground">
                    {new Date(orderDetail.createdAt).toLocaleString("th-TH")}
                  </p>
                </div>
                <Badge className={getStatusColor(orderDetail.status)}>
                  {getStatusText(orderDetail.status)}
                </Badge>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                <h2 className="font-semibold">สินค้าในคำสั่งซื้อ</h2>
                {orderDetail.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <img
                      src={item.product?.images?.[0] || "/placeholder.png"}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        จำนวน: {item.quantity}
                      </p>
                      <p className="font-semibold">
                        ฿{((item.price / 100) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <h2 className="font-semibold mb-2">ที่อยู่จัดส่ง</h2>
                <div className="text-sm text-muted-foreground">
                  <p>{orderDetail.shippingAddress?.name}</p>
                  <p>{orderDetail.shippingAddress?.phone}</p>
                  <p>{orderDetail.shippingAddress?.address}</p>
                </div>
              </div>

              {/* Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>ยอดรวมสินค้า</span>
                  <span>฿{(orderDetail.totalAmount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>ค่าจัดส่ง</span>
                  <span>฿{(orderDetail.shippingFee / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>ยอดรวมทั้งหมด</span>
                  <span>
                    ฿{((orderDetail.totalAmount + orderDetail.shippingFee) / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {orderDetail.status === "shipped" && (
                <div className="mt-6">
                  <Button
                    onClick={() => confirmDeliveryMutation.mutate({ orderId: orderDetail.id })}
                    disabled={confirmDeliveryMutation.isPending}
                    className="w-full"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    ยืนยันการรับสินค้า
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Orders list
  const filteredOrders = orders?.filter(order => 
    filter === "all" || order.status === filter
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">คำสั่งซื้อของฉัน</h1>

          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { value: "all", label: "ทั้งหมด" },
              { value: "pending", label: "รอชำระเงิน" },
              { value: "paid", label: "ชำระแล้ว" },
              { value: "processing", label: "กำลังเตรียมสินค้า" },
              { value: "shipped", label: "จัดส่งแล้ว" },
              { value: "delivered", label: "ส่งสำเร็จ" },
              { value: "cancelled", label: "ยกเลิก" },
            ].map((item) => (
              <Button
                key={item.value}
                variant={filter === item.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">
                        คำสั่งซื้อ #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString("th-TH")}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {order.items?.length || 0} รายการ
                      </p>
                      <p className="font-semibold text-lg">
                        ฿{((order.totalAmount + order.shippingFee) / 100).toFixed(2)}
                      </p>
                    </div>
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        ดูรายละเอียด
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">ไม่มีคำสั่งซื้อ</h3>
                <p className="text-muted-foreground mb-6">
                  {filter === "all"
                    ? "คุณยังไม่มีคำสั่งซื้อ"
                    : `ไม่มีคำสั่งซื้อสถานะ ${getStatusText(filter)}`}
                </p>
                <Link href="/products">
                  <Button>เริ่มช้อปปิ้ง</Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "paid":
      return "bg-blue-500";
    case "processing":
      return "bg-purple-500";
    case "shipped":
      return "bg-orange-500";
    case "delivered":
      return "bg-green-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case "pending":
      return "รอชำระเงิน";
    case "paid":
      return "ชำระแล้ว";
    case "processing":
      return "กำลังเตรียมสินค้า";
    case "shipped":
      return "จัดส่งแล้ว";
    case "delivered":
      return "ส่งสำเร็จ";
    case "cancelled":
      return "ยกเลิก";
    default:
      return status;
  }
}
