import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import {
  Users,
  Package,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  Store,
  Eye,
} from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  created_at: string;
};

type SellerApplication = {
  id: number;
  user_id: number;
  shop_name: string;
  phone: string;
  status: string;
  created_at: string;
  user: {
    name: string;
    email: string;
  };
};

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  is_active: boolean;
  seller: {
    shop_name: string;
  };
};

type Order = {
  id: number;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [sellerApplications, setSellerApplications] = useState<SellerApplication[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    async function fetchData() {
      setIsLoading(true);

      // Fetch users
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      setUsers(usersData || []);

      // Fetch seller applications
      const { data: sellersData } = await supabase
        .from('sellers')
        .select(`
          *,
          user:users!user_id (
            name,
            email
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      setSellerApplications(sellersData || []);

      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select(`
          *,
          seller:sellers!seller_id (
            shop_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      setProducts(productsData || []);

      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      setOrders(ordersData || []);

      setIsLoading(false);
    }

    fetchData();
  }, [user]);

  const handleApproveSeller = async (sellerId: number) => {
    const { error } = await supabase
      .from('sellers')
      .update({ status: 'approved', is_verified: true })
      .eq('id', sellerId);

    if (error) {
      console.error('Error approving seller:', error);
      toast.error('เกิดข้อผิดพลาด');
      return;
    }

    toast.success('อนุมัติผู้ขายสำเร็จ');
    setSellerApplications(sellerApplications.filter(s => s.id !== sellerId));
  };

  const handleRejectSeller = async (sellerId: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะปฏิเสธคำขอนี้?')) return;

    const { error } = await supabase
      .from('sellers')
      .update({ status: 'rejected' })
      .eq('id', sellerId);

    if (error) {
      console.error('Error rejecting seller:', error);
      toast.error('เกิดข้อผิดพลาด');
      return;
    }

    toast.success('ปฏิเสธคำขอสำเร็จ');
    setSellerApplications(sellerApplications.filter(s => s.id !== sellerId));
  };

  const handleToggleProductActive = async (productId: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !currentStatus })
      .eq('id', productId);

    if (error) {
      console.error('Error toggling product:', error);
      toast.error('เกิดข้อผิดพลาด');
      return;
    }

    toast.success(currentStatus ? 'ปิดการขายสินค้าแล้ว' : 'เปิดการขายสินค้าแล้ว');
    setProducts(products.map(p => 
      p.id === productId ? { ...p, is_active: !currentStatus } : p
    ));
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      toast.error('เกิดข้อผิดพลาด');
      return;
    }

    toast.success('ลบสินค้าสำเร็จ');
    setProducts(products.filter(p => p.id !== productId));
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
              onClick={() => setLocation("/login")}
            >
              เข้าสู่ระบบ
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center max-w-md">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-bold mb-4">ไม่มีสิทธิ์เข้าถึง</h2>
            <p className="text-muted-foreground mb-6">
              คุณไม่มีสิทธิ์เข้าถึงหน้า Admin Dashboard
            </p>
            <Button size="lg" onClick={() => setLocation("/")}>
              กลับหน้าหลัก
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

  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
            <TabsTrigger value="users">ผู้ใช้ ({users.length})</TabsTrigger>
            <TabsTrigger value="sellers">คำขอเป็นผู้ขาย ({sellerApplications.length})</TabsTrigger>
            <TabsTrigger value="products">สินค้า ({products.length})</TabsTrigger>
            <TabsTrigger value="orders">คำสั่งซื้อ ({orders.length})</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">ยอดขายรวม</p>
                    <p className="text-2xl font-bold">฿{(totalRevenue / 100).toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">ผู้ใช้ทั้งหมด</p>
                    <p className="text-2xl font-bold">{users.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">สินค้าทั้งหมด</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-purple-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">คำสั่งซื้อทั้งหมด</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                  </div>
                  <ShoppingBag className="w-8 h-8 text-orange-500" />
                </div>
              </Card>
            </div>

            {/* Pending Seller Applications */}
            {sellerApplications.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">คำขอเป็นผู้ขายที่รออนุมัติ</h2>
                <div className="space-y-3">
                  {sellerApplications.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-semibold">{app.shop_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {app.user.name} ({app.user.email})
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveSeller(app.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          อนุมัติ
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectSeller(app.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          ปฏิเสธ
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">ผู้ใช้ทั้งหมด</h2>
              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{u.role}</p>
                      <p className="text-xs text-muted-foreground">
                        {u.is_verified ? '✓ ยืนยันแล้ว' : '✗ ยังไม่ยืนยัน'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Seller Applications Tab */}
          <TabsContent value="sellers" className="space-y-6">
            {sellerApplications.length === 0 ? (
              <Card className="p-12 text-center">
                <Store className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h2 className="text-2xl font-bold mb-2">ไม่มีคำขอรออนุมัติ</h2>
              </Card>
            ) : (
              <div className="space-y-4">
                {sellerApplications.map((app) => (
                  <Card key={app.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{app.shop_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {app.user.name} ({app.user.email})
                        </p>
                        <p className="text-sm text-muted-foreground">โทร: {app.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApproveSeller(app.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          อนุมัติ
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleRejectSeller(app.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          ปฏิเสธ
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ร้าน: {product.seller.shop_name}
                      </p>
                      <p className="text-sm">
                        ราคา: ฿{(product.price / 100).toFixed(2)} • สต็อก: {product.stock}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleProductActive(product.id, product.is_active)}
                      >
                        {product.is_active ? (
                          <>
                            <XCircle className="w-4 h-4 mr-1" />
                            ปิดขาย
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            เปิดขาย
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        ลบ
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-semibold">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleString('th-TH')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        ฿{(order.total_amount / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">{order.status}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
