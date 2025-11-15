import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  images: string[];
  is_active: boolean;
  sales_count: number;
  category_id: number;
};

type Order = {
  id: number;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  buyer: {
    name: string;
    email: string;
  };
};

type Category = {
  id: number;
  name: string;
};

export default function SellerDashboard() {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sellerData, setSellerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Product form
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image_url: "",
  });

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setIsLoading(true);

      // Fetch seller data
      const { data: seller } = await supabase
        .from('sellers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!seller) {
        toast.error("คุณยังไม่ได้สมัครเป็นผู้ขาย");
        setLocation("/seller/register");
        return;
      }

      if (seller.status !== 'approved') {
        toast.error("บัญชีผู้ขายของคุณยังไม่ได้รับการอนุมัติ");
        setLocation("/");
        return;
      }

      setSellerData(seller);

      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', seller.id)
        .order('created_at', { ascending: false });

      setProducts(productsData || []);

      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          buyer:users!buyer_id (
            name,
            email
          )
        `)
        .eq('seller_id', seller.id)
        .order('created_at', { ascending: false });

      setOrders(ordersData || []);

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      setCategories(categoriesData || []);

      setIsLoading(false);
    }

    fetchData();
  }, [user, setLocation]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sellerData) return;

    const { error } = await supabase
      .from('products')
      .insert({
        seller_id: sellerData.id,
        name: productForm.name,
        description: productForm.description,
        price: Math.round(parseFloat(productForm.price) * 100),
        stock: parseInt(productForm.stock),
        category_id: parseInt(productForm.category_id),
        image_url: productForm.image_url || 'https://via.placeholder.com/400',
        images: productForm.image_url ? [productForm.image_url] : [],
        is_active: true,
      });

    if (error) {
      console.error('Error adding product:', error);
      toast.error('เกิดข้อผิดพลาดในการเพิ่มสินค้า');
      return;
    }

    toast.success('เพิ่มสินค้าสำเร็จ');
    setIsAddingProduct(false);
    setProductForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: "",
      image_url: "",
    });

    // Refresh products
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', sellerData.id)
      .order('created_at', { ascending: false });

    setProducts(productsData || []);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      toast.error('เกิดข้อผิดพลาดในการลบสินค้า');
      return;
    }

    toast.success('ลบสินค้าสำเร็จ');
    setProducts(products.filter(p => p.id !== productId));
  };

  const handleToggleActive = async (productId: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !currentStatus })
      .eq('id', productId);

    if (error) {
      console.error('Error toggling product status:', error);
      toast.error('เกิดข้อผิดพลาด');
      return;
    }

    toast.success(currentStatus ? 'ปิดการขายสินค้าแล้ว' : 'เปิดการขายสินค้าแล้ว');
    setProducts(products.map(p => 
      p.id === productId ? { ...p, is_active: !currentStatus } : p
    ));
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

  const pendingOrders = orders.filter(o => o.status === 'paid' || o.status === 'processing').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">แดชบอร์ดผู้ขาย</h1>
            <p className="text-muted-foreground">ร้าน: {sellerData?.shop_name}</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
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
                    <p className="text-sm text-muted-foreground">สินค้าทั้งหมด</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">คำสั่งซื้อรอดำเนินการ</p>
                    <p className="text-2xl font-bold">{pendingOrders}</p>
                  </div>
                  <ShoppingBag className="w-8 h-8 text-orange-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">คำสั่งซื้อทั้งหมด</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">คำสั่งซื้อล่าสุด</h2>
              {orders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">ยังไม่มีคำสั่งซื้อ</p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-semibold">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.buyer.name} • {new Date(order.created_at).toLocaleDateString('th-TH')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">฿{(order.total_amount / 100).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-end">
              <Button
                onClick={() => setIsAddingProduct(true)}
                className="btn-glow gradient-red-orange"
              >
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มสินค้าใหม่
              </Button>
            </div>

            {isAddingProduct && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">เพิ่มสินค้าใหม่</h2>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <Label htmlFor="name">ชื่อสินค้า *</Label>
                    <Input
                      id="name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">คำอธิบาย</Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">ราคา (บาท) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="stock">จำนวนสต็อก *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category_id">หมวดหมู่ *</Label>
                    <select
                      id="category_id"
                      value={productForm.category_id}
                      onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      required
                    >
                      <option value="">เลือกหมวดหมู่</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="image_url">URL รูปภาพ</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={productForm.image_url}
                      onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="btn-glow gradient-red-orange">
                      เพิ่มสินค้า
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddingProduct(false)}
                    >
                      ยกเลิก
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {products.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h2 className="text-2xl font-bold mb-2">ยังไม่มีสินค้า</h2>
                <p className="text-muted-foreground mb-6">
                  เริ่มเพิ่มสินค้าแรกของคุณเลย!
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square bg-muted overflow-hidden">
                      <img
                        src={product.images?.[0] || product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-2xl font-bold text-primary mb-2">
                        ฿{(product.price / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        สต็อก: {product.stock} • ขายแล้ว: {product.sales_count || 0}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(product.id, product.is_active)}
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
                          variant="outline"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            {orders.length === 0 ? (
              <Card className="p-12 text-center">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h2 className="text-2xl font-bold mb-2">ยังไม่มีคำสั่งซื้อ</h2>
                <p className="text-muted-foreground">
                  เมื่อมีคนซื้อสินค้าของคุณ จะแสดงที่นี่
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono font-semibold">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.buyer.name} ({order.buyer.email})
                        </p>
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
