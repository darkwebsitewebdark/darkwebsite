import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { Package, Truck, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

type Order = {
  id: number;
  order_number: string;
  buyer_id: number;
  seller_id: number;
  total_amount: number;
  status: string;
  shipping_address: any;
  created_at: string;
  updated_at: string;
  order_items: {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      name: string;
      image_url: string;
      images: string[];
    };
  }[];
};

const statusConfig = {
  pending_payment: { label: 'รอชำระเงิน', color: 'bg-yellow-500', icon: Clock },
  paid: { label: 'ชำระเงินแล้ว', color: 'bg-blue-500', icon: CheckCircle },
  processing: { label: 'กำลังเตรียมสินค้า', color: 'bg-purple-500', icon: Package },
  shipped: { label: 'จัดส่งแล้ว', color: 'bg-cyan-500', icon: Truck },
  delivered: { label: 'ส่งสำเร็จ', color: 'bg-green-500', icon: CheckCircle },
  cancelled: { label: 'ยกเลิก', color: 'bg-red-500', icon: XCircle },
  refunded: { label: 'คืนเงินแล้ว', color: 'bg-gray-500', icon: XCircle },
};

export default function Orders() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (
              id,
              name,
              image_url,
              images
            )
          )
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast.error('ไม่สามารถโหลดคำสั่งซื้อได้');
        setOrders([]);
      } else {
        setOrders(data || []);
      }
      setIsLoading(false);
    }

    fetchOrders();
  }, [user]);

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

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">คำสั่งซื้อของฉัน</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
            <TabsTrigger value="pending_payment">รอชำระ</TabsTrigger>
            <TabsTrigger value="paid">ชำระแล้ว</TabsTrigger>
            <TabsTrigger value="processing">เตรียมสินค้า</TabsTrigger>
            <TabsTrigger value="shipped">จัดส่งแล้ว</TabsTrigger>
            <TabsTrigger value="delivered">สำเร็จ</TabsTrigger>
            <TabsTrigger value="cancelled">ยกเลิก</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">กำลังโหลด...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-bold mb-2">
              {activeTab === 'all' ? 'ยังไม่มีคำสั่งซื้อ' : 'ไม่พบคำสั่งซื้อ'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {activeTab === 'all' 
                ? 'เริ่มช้อปปิ้งเพื่อสร้างคำสั่งซื้อแรกของคุณ' 
                : 'ไม่พบคำสั่งซื้อในสถานะนี้'}
            </p>
            <Link href="/products">
              <Button className="btn-glow gradient-red-orange">
                เริ่มช้อปปิ้ง
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending_payment;
              const StatusIcon = status.icon;

              return (
                <Card key={order.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">หมายเลขคำสั่งซื้อ</p>
                        <p className="font-mono font-semibold">{order.order_number}</p>
                      </div>
                      <Badge className={`${status.color} text-white`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">วันที่สั่งซื้อ</p>
                      <p className="font-semibold">
                        {new Date(order.created_at).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <Link href={`/product/${item.product_id}`}>
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={item.product.images?.[0] || item.product.image_url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>
                        <div className="flex-1">
                          <Link href={`/product/${item.product_id}`}>
                            <h3 className="font-semibold hover:text-primary transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">จำนวน: {item.quantity}</p>
                          <p className="text-sm font-bold text-primary">
                            ฿{(item.price / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">ยอดรวมทั้งหมด</p>
                      <p className="text-2xl font-bold text-primary">
                        ฿{(order.total_amount / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setLocation(`/order/${order.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        ดูรายละเอียด
                      </Button>
                      {order.status === 'delivered' && (
                        <Button className="btn-glow gradient-red-orange">
                          รีวิวสินค้า
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
