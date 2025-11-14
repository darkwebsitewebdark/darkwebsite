import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import {
  Users,
  Package,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const utils = trpc.useUtils();

  // Users list - will be implemented later
  const users: any[] = [];

  const { data: sellerApplications } = trpc.admin.sellerApplications.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: products } = trpc.products.list.useQuery({}, {
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: orders } = trpc.orders.list.useQuery({}, {
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: disputes } = trpc.disputes.list.useQuery(
    {},
    { enabled: isAuthenticated && user?.role === 'admin' }
  );

  const approveSellerMutation = trpc.admin.approveSellerApplication.useMutation({
    onSuccess: () => {
      toast.success("อนุมัติ Seller สำเร็จ");
      utils.admin.sellerApplications.invalidate();
    },
  });

  const rejectSellerMutation = trpc.admin.rejectSellerApplication.useMutation({
    onSuccess: () => {
      toast.success("ปฏิเสธคำขอสำเร็จ");
      utils.admin.sellerApplications.invalidate();
    },
  });

  const resolveDisputeMutation = trpc.disputes.resolve.useMutation({
    onSuccess: () => {
      toast.success("แก้ไขข้อพิพาทสำเร็จ");
      utils.disputes.list.invalidate();
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

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold mb-4">ไม่มีสิทธิ์เข้าถึง</h2>
          <p className="text-muted-foreground mb-6">
            คุณไม่มีสิทธิ์เข้าถึงหน้า Admin Dashboard
          </p>
          <Link href="/">
            <Button size="lg">กลับหน้าหลัก</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const totalRevenue = orders?.reduce((sum, o) => sum + o.totalAmount, 0) || 0;
  const totalUsers = 0; // users?.length || 0;
  const totalProducts = products?.length || 0;
  const totalOrders = orders?.length || 0;
  const pendingApplications = sellerApplications?.filter((a: any) => a.status === 'pending').length || 0;
  const openDisputes = disputes?.filter(d => d.status === 'open').length || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">รายได้รวม</p>
                <p className="text-2xl font-bold price-tag">฿{(totalRevenue / 100).toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ผู้ใช้ทั้งหมด</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">สินค้าทั้งหมด</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-info/20 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">คำสั่งซื้อ</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Alerts */}
        {(pendingApplications > 0 || openDisputes > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {pendingApplications > 0 && (
              <Card className="p-4 border-accent">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-semibold">คำขอ Seller รออนุมัติ</p>
                    <p className="text-sm text-muted-foreground">
                      มี {pendingApplications} คำขอรออนุมัติ
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {openDisputes > 0 && (
              <Card className="p-4 border-destructive">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="font-semibold">ข้อพิพาทที่ต้องแก้ไข</p>
                    <p className="text-sm text-muted-foreground">
                      มี {openDisputes} ข้อพิพาทรอการแก้ไข
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="applications">คำขอ Seller</TabsTrigger>
            <TabsTrigger value="users">ผู้ใช้</TabsTrigger>
            <TabsTrigger value="products">สินค้า</TabsTrigger>
            <TabsTrigger value="disputes">ข้อพิพาท</TabsTrigger>
          </TabsList>

          {/* Seller Applications */}
          <TabsContent value="applications">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">คำขอเป็น Seller</h2>

              {!sellerApplications || sellerApplications.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">ไม่มีคำขอ</p>
              ) : (
                <div className="space-y-4">
                  {sellerApplications
                    .filter((app: any) => app.status === 'pending')
                    .map((app: any) => (
                      <Card key={app.id} className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">
                              ผู้สมัคร ID: {app.userId}
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">ชื่อร้าน:</span>{" "}
                                <span className="font-medium">{app.storeName}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">คำอธิบาย:</span>{" "}
                                <span>{app.storeDescription}</span>
                              </div>
                              {app.idCardUrl && (
                                <div>
                                  <span className="text-muted-foreground">บัตรประชาชน:</span>{" "}
                                  <a
                                    href={app.idCardUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    ดูรูปภาพ
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-secondary hover:bg-secondary/90"
                              onClick={() => approveSellerMutation.mutate({ id: app.id })}
                              disabled={approveSellerMutation.isPending}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              อนุมัติ
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                rejectSellerMutation.mutate({
                                  id: app.id,
                                  adminNote: "ไม่ผ่านเกณฑ์",
                                })
                              }
                              disabled={rejectSellerMutation.isPending}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              ปฏิเสธ
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">ผู้ใช้ทั้งหมด</h2>
                <Input
                  placeholder="ค้นหาผู้ใช้..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              {!users || users.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">ไม่มีผู้ใช้</p>
              ) : (
                <div className="space-y-2">
                  {users
                    .filter(
                      (u: any) =>
                        !searchTerm ||
                        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((u: any) => (
                      <Card key={u.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{u.name || "ไม่ระบุชื่อ"}</p>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`badge-street ${
                                u.role === "admin"
                                  ? "bg-destructive/20 text-destructive border-destructive"
                                  : u.role === "seller"
                                  ? "bg-secondary/20 text-secondary border-secondary"
                                  : "bg-muted text-muted-foreground border-muted"
                              }`}
                            >
                              {u.role}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ยอดเงิน: ฿{((u.walletBalance || 0) / 100).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Products */}
          <TabsContent value="products">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">สินค้าทั้งหมด</h2>

              {!products || products.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">ไม่มีสินค้า</p>
              ) : (
                <div className="space-y-2">
                  {products.map((product) => (
                    <Card key={product.id} className="p-4">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>฿{(product.price / 100).toFixed(2)}</span>
                            <span>สต็อก: {product.stock}</span>
                            <span>ขายแล้ว: {product.sales || 0}</span>
                            <span
                              className={`badge-street ${
                                product.status === "active"
                                  ? "bg-secondary/20 text-secondary border-secondary"
                                  : "bg-muted text-muted-foreground border-muted"
                              }`}
                            >
                              {product.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Disputes */}
          <TabsContent value="disputes">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">ข้อพิพาท</h2>

              {!disputes || disputes.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">ไม่มีข้อพิพาท</p>
              ) : (
                <div className="space-y-4">
                  {disputes
                    .filter((d) => d.status === "open")
                    .map((dispute) => (
                      <Card key={dispute.id} className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">
                              ข้อพิพาท #{dispute.id} - Order #{dispute.orderId}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {dispute.reason}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              สร้างเมื่อ:{" "}
                              {new Date(dispute.createdAt).toLocaleDateString("th-TH")}
                            </div>
                          </div>

                          <Button
                            size="sm"
                            className="bg-secondary hover:bg-secondary/90"
                            onClick={() =>
                              resolveDisputeMutation.mutate({
                                id: dispute.id,
                                resolution: "แก้ไขแล้ว",
                                refundBuyer: false,
                              })
                            }
                            disabled={resolveDisputeMutation.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            แก้ไขแล้ว
                          </Button>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
