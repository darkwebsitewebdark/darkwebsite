import { useState } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  images: string[];
};

export default function SellerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch data
  const { data: dashboardData, isLoading, refetch } = trpc.seller.dashboard.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "seller",
  });

  const { data: categories = [] } = trpc.categories.list.useQuery();

  // Product form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    images: [],
  });

  // Mutations
  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsDialogOpen(false);
      resetForm();
      toast.success("เพิ่มสินค้าสำเร็จ");
    },
    onError: (error) => {
      toast.error(error.message || "ไม่สามารถเพิ่มสินค้าได้");
    },
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      refetch();
      setIsDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      toast.success("อัพเดทสินค้าสำเร็จ");
    },
    onError: (error) => {
      toast.error(error.message || "ไม่สามารถอัพเดทสินค้าได้");
    },
  });

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("ลบสินค้าสำเร็จ");
    },
    onError: (error) => {
      toast.error(error.message || "ไม่สามารถลบสินค้าได้");
    },
  });

  const uploadImageMutation = trpc.products.uploadImage.useMutation({
    onSuccess: (data) => {
      setProductForm((prev) => ({
        ...prev,
        images: [...prev.images, data.url],
      }));
      toast.success("อัพโหลดรูปภาพสำเร็จ");
    },
    onError: (error) => {
      toast.error(error.message || "ไม่สามารถอัพโหลดรูปภาพได้");
    },
  });

  const resetForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
      images: [],
    });
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      categoryId: product.categoryId?.toString() || "",
      images: product.images || [],
    });
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm("ต้องการลบสินค้านี้ใช่หรือไม่?")) {
      deleteMutation.mutate({ id: productId });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const price = parseFloat(productForm.price);
    const stock = parseInt(productForm.stock);
    const categoryId = parseInt(productForm.categoryId);

    if (isNaN(price) || price <= 0) {
      toast.error("กรุณาระบุราคาที่ถูกต้อง");
      return;
    }

    if (isNaN(stock) || stock < 0) {
      toast.error("กรุณาระบุจำนวนสินค้าที่ถูกต้อง");
      return;
    }

    if (isNaN(categoryId)) {
      toast.error("กรุณาเลือกหมวดหมู่");
      return;
    }

    if (editingProduct) {
      // Update existing product
      updateMutation.mutate({
        id: editingProduct.id,
        name: productForm.name,
        slug: productForm.name.toLowerCase().replace(/\s+/g, "-"),
        description: productForm.description,
        price,
        stock,
        categoryId,
        images: productForm.images,
      });
    } else {
      // Create new product
      createMutation.mutate({
        name: productForm.name,
        slug: productForm.name.toLowerCase().replace(/\s+/g, "-"),
        description: productForm.description,
        price,
        stock,
        categoryId,
        images: productForm.images,
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(",")[1];
      uploadImageMutation.mutate({ imageBase64: base64Data });
    };
    reader.readAsDataURL(file);
  };

  // Check authentication and role
  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="card-neon p-8 max-w-md w-full text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">กรุณาเข้าสู่ระบบ</h2>
            <p className="text-muted-foreground mb-6">
              คุณต้องเข้าสู่ระบบเป็นผู้ขายก่อนจึงจะเข้าถึงหน้านี้ได้
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

  if (user?.role !== "seller") {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="card-neon p-8 max-w-md w-full text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">สมัครเป็นผู้ขาย</h2>
            <p className="text-muted-foreground mb-6">
              คุณต้องสมัครเป็นผู้ขายก่อนจึงจะเข้าถึงหน้านี้ได้
            </p>
            <Button
              onClick={() => setLocation("/seller/register")}
              className="w-full btn-neon bg-primary hover:bg-primary/90"
            >
              สมัครเป็นผู้ขาย
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold neon-text-red mb-2">
              Seller Dashboard
            </h1>
            <p className="text-muted-foreground">
              จัดการสินค้าและคำสั่งซื้อของคุณ
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">กำลังโหลด...</span>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="card-neon p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        สินค้าทั้งหมด
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {dashboardData?.stats.totalProducts || 0}
                      </p>
                    </div>
                    <Package className="w-12 h-12 text-primary opacity-50" />
                  </div>
                </Card>

                <Card className="card-neon p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        ยอดขายทั้งหมด
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {dashboardData?.stats.totalSales || 0}
                      </p>
                    </div>
                    <ShoppingBag className="w-12 h-12 text-primary opacity-50" />
                  </div>
                </Card>

                <Card className="card-neon p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        รายได้ทั้งหมด
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        ฿{(dashboardData?.stats.totalRevenue || 0).toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="w-12 h-12 text-primary opacity-50" />
                  </div>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="products" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="products">สินค้า</TabsTrigger>
                  <TabsTrigger value="orders">คำสั่งซื้อ</TabsTrigger>
                </TabsList>

                {/* Products Tab */}
                <TabsContent value="products" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">สินค้าของคุณ</h2>
                    <Button
                      onClick={handleAddProduct}
                      className="btn-neon bg-primary hover:bg-primary/90"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      เพิ่มสินค้า
                    </Button>
                  </div>

                  {dashboardData?.products && dashboardData.products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dashboardData.products.map((product: any) => (
                        <Card key={product.id} className="card-neon overflow-hidden">
                          <img
                            src={product.images?.[0] || "/placeholder.png"}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-bold text-lg mb-2 truncate">
                              {product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-xl font-bold text-primary">
                                ฿{product.price.toLocaleString()}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                คงเหลือ: {product.stock}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditProduct(product)}
                                className="flex-1"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                แก้ไข
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="card-neon p-12 text-center">
                      <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-bold mb-2">ยังไม่มีสินค้า</h3>
                      <p className="text-muted-foreground mb-6">
                        เริ่มเพิ่มสินค้าแรกของคุณเลย!
                      </p>
                      <Button
                        onClick={handleAddProduct}
                        className="btn-neon bg-primary hover:bg-primary/90"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        เพิ่มสินค้า
                      </Button>
                    </Card>
                  )}
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders">
                  <Card className="card-neon p-12 text-center">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-bold mb-2">ยังไม่มีคำสั่งซื้อ</h3>
                    <p className="text-muted-foreground">
                      คำสั่งซื้อจะแสดงที่นี่เมื่อมีลูกค้าซื้อสินค้าของคุณ
                    </p>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
            </DialogTitle>
            <DialogDescription>
              กรอกข้อมูลสินค้าของคุณ
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">ชื่อสินค้า *</Label>
              <Input
                id="name"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="description">รายละเอียด</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({ ...productForm, description: e.target.value })
                }
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
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock">จำนวนสินค้า *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm({ ...productForm, stock: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">หมวดหมู่ *</Label>
              <Select
                value={productForm.categoryId}
                onValueChange={(value) =>
                  setProductForm({ ...productForm, categoryId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>รูปภาพสินค้า</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {productForm.images.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6"
                      onClick={() =>
                        setProductForm({
                          ...productForm,
                          images: productForm.images.filter((_, i) => i !== index),
                        })
                      }
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadImageMutation.isPending}
              />
              {uploadImageMutation.isPending && (
                <p className="text-sm text-muted-foreground mt-1">
                  กำลังอัพโหลด...
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                className="btn-neon bg-primary hover:bg-primary/90"
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  uploadImageMutation.isPending
                }
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : editingProduct ? (
                  "บันทึกการแก้ไข"
                ) : (
                  "เพิ่มสินค้า"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
