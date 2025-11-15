import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Wallet, CreditCard, History, User, Settings, Package, FileText } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader } from "@/components/ImageUploader";

import { useLocation, Link } from "wouter";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    profileImage: user?.profileImage || "",
  });

  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const { data: orders } = trpc.orders.list.useQuery(
    { role: 'buyer' },
    { enabled: isAuthenticated }
  );

  // Transactions will be implemented later
  const transactions: any[] = [];

  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("อัพเดทโปรไฟล์สำเร็จ");
      utils.auth.me.invalidate();
    },
  });

  const linkBankMutation = trpc.user.linkBankAccount.useMutation({
    onSuccess: () => {
      toast.success("เชื่อมโยงบัญชีธนาคารสำเร็จ");
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
            onClick={() => window.location.href = "/login"}
          >
            เข้าสู่ระบบ
          </Button>
        </Card>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync({
        name: profileForm.name,
        profileImage: profileForm.profileImage,
      });
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const handleLinkBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankForm.bankName || !bankForm.accountNumber || !bankForm.accountName) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      await linkBankMutation.mutateAsync({
        bankName: bankForm.bankName,
        bankAccountNumber: bankForm.accountNumber,
        bankAccountName: bankForm.accountName,
      });
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">โปรไฟล์</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">ข้อมูลส่วนตัว</TabsTrigger>
            <TabsTrigger value="wallet">กระเป๋าเงิน</TabsTrigger>
            <TabsTrigger value="orders">คำสั่งซื้อ</TabsTrigger>
            <TabsTrigger value="transactions">ประวัติการเงิน</TabsTrigger>
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">{user?.name || "ไม่ระบุชื่อ"}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
                  <div className="space-y-2">
                    <div className={`badge-street ${
                      user?.role === 'admin' ? 'bg-destructive/20 text-destructive border-destructive' :
                      user?.role === 'seller' ? 'bg-secondary/20 text-secondary border-secondary' :
                      'bg-muted text-muted-foreground border-muted'
                    }`}>
                      {user?.role}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ยอดเงิน: <span className="font-bold text-primary">
                        ฿{((user?.walletBalance || 0) / 100).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 lg:col-span-2">
                <h3 className="text-xl font-bold mb-6">แก้ไขข้อมูลส่วนตัว</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <Label>รูปโปรไฟล์</Label>
                    <ImageUploader
                      prefix="profiles"
                      currentImage={profileForm.profileImage}
                      onUpload={(url) => setProfileForm({ ...profileForm, profileImage: url })}
                      resize={{ width: 400, height: 400 }}
                    />
                  </div>
                  <div>
                    <Label>ชื่อ</Label>
                    <Input
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    className="btn-glow gradient-red-orange"
                    disabled={updateProfileMutation.isPending}
                  >
                    บันทึกการแก้ไข
                  </Button>
                </form>
              </Card>
            </div>
          </TabsContent>

          {/* Wallet */}
          <TabsContent value="wallet">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ยอดเงินคงเหลือ</p>
                    <p className="text-3xl font-bold price-tag">
                      ฿{((user?.walletBalance || 0) / 100).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full btn-glow gradient-red-orange"
                    onClick={() => setLocation("/wallet/topup")}
                  >
                    เติมเงิน
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setLocation("/wallet/withdraw")}
                  >
                    ถอนเงิน
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">เชื่อมโยงบัญชีธนาคาร</h3>
                <form onSubmit={handleLinkBank} className="space-y-4">
                  <div>
                    <Label htmlFor="bankName">ธนาคาร</Label>
                    <select
                      id="bankName"
                      value={bankForm.bankName}
                      onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md"
                    >
                      <option value="">เลือกธนาคาร</option>
                      <option value="กสิกรไทย">กสิกรไทย</option>
                      <option value="ไทยพาณิชย์">ไทยพาณิชย์</option>
                      <option value="กรุงเทพ">กรุงเทพ</option>
                      <option value="กรุงไทย">กรุงไทย</option>
                      <option value="ทหารไทย">ทหารไทย</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">เลขที่บัญชี</Label>
                    <Input
                      id="accountNumber"
                      value={bankForm.accountNumber}
                      onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountName">ชื่อบัญชี</Label>
                    <Input
                      id="accountName"
                      value={bankForm.accountName}
                      onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full btn-glow"
                    disabled={linkBankMutation.isPending}
                  >
                    เชื่อมโยงบัญชี
                  </Button>
                </form>
              </Card>
            </div>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6">คำสั่งซื้อของฉัน</h3>

              {!orders || orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>คุณยังไม่มีคำสั่งซื้อ</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">คำสั่งซื้อ #{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("th-TH")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary price-tag">
                            ฿{(order.totalAmount / 100).toFixed(2)}
                          </p>
                          <span className={`badge-street text-xs ${
                            order.status === 'delivered' ? 'bg-secondary/20 text-secondary border-secondary' :
                            order.status === 'cancelled' ? 'bg-destructive/20 text-destructive border-destructive' :
                            'bg-accent/20 text-accent border-accent'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <Link href={`/orders/${order.id}`}>
                        <Button size="sm" variant="outline" className="w-full mt-2">
                          ดูรายละเอียด
                        </Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6">ประวัติการเงิน</h3>

              {!transactions || transactions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>ยังไม่มีประวัติการเงิน</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((tx: any) => (
                    <Card key={tx.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{tx.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tx.createdAt).toLocaleDateString("th-TH")} {new Date(tx.createdAt).toLocaleTimeString("th-TH")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            tx.type === 'topup' || tx.type === 'refund' ? 'text-secondary' : 'text-destructive'
                          }`}>
                            {tx.type === 'topup' || tx.type === 'refund' ? '+' : '-'}
                            ฿{(tx.amount / 100).toFixed(2)}
                          </p>
                          <span className={`badge-street text-xs ${
                            tx.status === 'completed' ? 'bg-secondary/20 text-secondary border-secondary' :
                            tx.status === 'failed' ? 'bg-destructive/20 text-destructive border-destructive' :
                            'bg-accent/20 text-accent border-accent'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
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
