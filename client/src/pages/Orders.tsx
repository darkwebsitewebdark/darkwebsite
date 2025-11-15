import { useState } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Package, Truck, CheckCircle, XCircle, Clock, Eye, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending_payment: { label: "รอชำระเงิน", color: "bg-yellow-500", icon: Clock },
  paid: { label: "ชำระเงินแล้ว", color: "bg-blue-500", icon: CheckCircle },
  processing: { label: "กำลังเตรียมสินค้า", color: "bg-purple-500", icon: Package },
  shipped: { label: "จัดส่งแล้ว", color: "bg-cyan-500", icon: Truck },
  delivered: { label: "ส่งสำเร็จ", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "ยกเลิก", color: "bg-red-500", icon: XCircle },
  refunded: { label: "คืนเงินแล้ว", color: "bg-gray-500", icon: XCircle },
};

export default function Orders() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("all");

  // Fetch orders
  const { data: orders = [], isLoading } = trpc.orders.list.useQuery(
    { role: "buyer" },
    { enabled: isAuthenticated }
  );

  // Filter orders by status
  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order: any) => order.status === activeTab);

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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold neon-text-red mb-2">คำสั่งซื้อของฉัน</h1>
            <p className="text-muted-foreground">ติดตามสถานะคำสั่งซื้อของคุณ</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">กำลังโหลด...</span>
            </div>
          ) : (
            <>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                  <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                  <TabsTrigger value="pending_payment">รอชำระ</TabsTrigger>
                  <TabsTrigger value="paid">ชำระแล้ว</TabsTrigger>
                  <TabsTrigger value="processing">เตรียมสินค้า</TabsTrigger>
                  <TabsTrigger value="shipped">จัดส่งแล้ว</TabsTrigger>
                  <TabsTrigger value="delivered">สำเร็จ</TabsTrigger>
                  <TabsTrigger value="cancelled">ยกเลิก</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  {filteredOrders.length === 0 ? (
                    <Card className="card-neon p-12 text-center">
                      <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-bold mb-2">ยังไม่มีคำสั่งซื้อ</h3>
                      <p className="text-muted-foreground mb-6">
                        {activeTab === "all"
                          ? "คุณยังไม่มีคำสั่งซื้อ เริ่มช้อปปิ้งเลย!"
                          : `ไม่มีคำสั่งซื้อที่${statusConfig[activeTab]?.label}`}
                      </p>
                      <Button
                        onClick={() => setLocation("/products")}
                        className="btn-neon bg-primary hover:bg-primary/90"
                      >
                        เริ่มช้อปปิ้ง
                      </Button>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((order: any) => {
                        const config = statusConfig[order.status] || statusConfig.pending_payment;
                        const StatusIcon = config.icon;

                        return (
                          <Card key={order.id} className="card-neon overflow-hidden">
                            <div className="p-6">
                              {/* Order Header */}
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                                    <Badge className={`${config.color} text-white`}>
                                      <StatusIcon className="w-3 h-3 mr-1" />
                                      {config.label}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(order.createdAt).toLocaleDateString("th-TH", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <p className="text-2xl font-bold text-primary">
                                    ฿{order.totalAmount.toLocaleString()}
                                  </p>
                                  <Link href={`/orders/${order.id}`}>
                                    <Button size="sm" variant="outline">
                                      <Eye className="w-4 h-4 mr-2" />
                                      ดูรายละเอียด
                                    </Button>
                                  </Link>
                                </div>
                              </div>

                              {/* Order Items Preview */}
                              <div className="border-t border-border pt-4">
                                <div className="flex gap-3 overflow-x-auto">
                                  {order.items?.slice(0, 3).map((item: any) => (
                                    <div
                                      key={item.id}
                                      className="flex-shrink-0 w-20 h-20 rounded overflow-hidden"
                                    >
                                      <img
                                        src={item.productImage || "/placeholder.png"}
                                        alt={item.productName}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                  {order.items && order.items.length > 3 && (
                                    <div className="flex-shrink-0 w-20 h-20 rounded bg-muted flex items-center justify-center">
                                      <span className="text-sm text-muted-foreground">
                                        +{order.items.length - 3}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </>
  );
}
