import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, Package, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function SellerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const utils = trpc.useUtils();

  // Form state
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    images: [] as string[],
  });

  const { data: products } = trpc.products.list.useQuery(
    { sellerId: user?.id },
    { enabled: isAuthenticated && user?.role === 'seller' }
  );

  const { data: categories } = trpc.categories.list.useQuery();

  const { data: orders } = trpc.orders.list.useQuery(
    { role: 'seller' },
    { enabled: isAuthenticated && user?.role === 'seller' }
  );

  const createProductMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success("เพิ่มสินค้าสำเร็จ");
      setIsAddProductOpen(false);
      resetForm();
      utils.products.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "เกิดข้อผิดพลาด");
    },
  });

  const updateProductMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success("อัพเดทสินค้าสำเร็จ");
      setEditingProduct(null);
      resetForm();
      utils.products.list.invalidate();
    },
  });

  const deleteProductMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast.success("ลบสินค้าสำเร็จ");
      utils.products.list.invalidate();
    },
  });

  const resetForm = () => {
    setProductForm({
      name: "",
      slug: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
      images: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productForm.name || !productForm.price || !productForm.stock || !productForm.categoryId) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const data = {
      name: productForm.name,
      slug: productForm.slug || productForm.name.toLowerCase().replace(/\s+/g, '-'),
      description: productForm.description,
      price: Math.round(parseFloat(productForm.price) * 100),
      stock: parseInt(productForm.stock),
      categoryId: parseInt(productForm.categoryId),
      images: productForm.images,
    };

    if (editingProduct) {
      await updateProductMutation.mutateAsync({ id: editingProduct.id, ...data });
    } else {
      await createProductMutation.mutateAsync(data);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: (product.price / 100).toString(),
      stock: product.stock.toString(),
      categoryId: product.categoryId.toString(),
      images: product.images || [],
    });
    setIsAddProductOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?")) {
      await deleteProductMutation.mutateAsync({ id });
    }
  };

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

  if (user?.role !== 'seller') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">คุณไม่ใช่ Seller</h2>
          <p className="text-muted-foreground mb-6">
            กรุณาสมัครเป็น Seller ก่อนเพื่อเข้าใช้งานหน้านี้
          </p>
          <Link href="/seller/apply">
            <Button size="lg" className="btn-glow gradient-red-orange">
              สมัครเป็น Seller
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const totalSales = products?.reduce((sum, p) => sum + (p.sales || 0) * p.price, 0) || 0;
  const totalProducts = products?.length || 0;
  const totalOrders = orders?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Seller Dashboard</h1>
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button className="btn-glow gradient-red-orange" onClick={() => { resetForm(); setEditingProduct(null); }}>
                <Plus className="w-5 h-5 mr-2" />
                เพิ่มสินค้า
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={productForm.slug}
                    onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                    placeholder="auto-generated"
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
                  <Label htmlFor="category">หมวดหมู่ *</Label>
                  <select
                    id="category"
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md"
                    required
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1 btn-glow" disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                    {editingProduct ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddProductOpen(false)}>
                    ยกเลิก
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ยอดขายรวม</p>
                <p className="text-2xl font-bold price-tag">฿{(totalSales / 100).toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">สินค้าทั้งหมด</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">คำสั่งซื้อ</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-info/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">อัตราการเติบโต</p>
                <p className="text-2xl font-bold text-secondary">+12%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Products List */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">สินค้าของคุณ</h2>

          {!products || products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>คุณยังไม่มีสินค้า เริ่มเพิ่มสินค้าแรกของคุณเลย!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2 truncate-2">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-bold text-primary">
                          ฿{(product.price / 100).toFixed(2)}
                        </span>
                        <span className="text-muted-foreground">
                          สต็อก: {product.stock}
                        </span>
                        <span className="text-muted-foreground">
                          ขายแล้ว: {product.sales || 0}
                        </span>
                        <span className={`badge-street ${
                          product.status === 'active' ? 'bg-secondary/20 text-secondary border-secondary' :
                          product.status === 'outofstock' ? 'bg-destructive/20 text-destructive border-destructive' :
                          'bg-muted text-muted-foreground border-muted'
                        }`}>
                          {product.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={() => handleEdit(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteProductMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
