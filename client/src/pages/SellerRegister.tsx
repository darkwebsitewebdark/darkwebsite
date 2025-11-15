import { useState } from "react";
import Header from "@/components/Header";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { Store, Upload, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function SellerRegister() {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [formData, setFormData] = useState({
    shop_name: "",
    shop_description: "",
    phone: "",
    bank_name: "",
    bank_account_number: "",
    bank_account_name: "",
    id_card_number: "",
    address: "",
  });

  const [idCardFile, setIdCardFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      setLocation("/login");
      return;
    }

    if (!acceptTerms) {
      toast.error("กรุณายอมรับข้อกำหนดและเงื่อนไข");
      return;
    }

    if (!idCardFile) {
      toast.error("กรุณาอัพโหลดรูปบัตรประชาชน");
      return;
    }

    setIsLoading(true);

    try {
      // Upload ID card image
      const fileExt = idCardFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `id-cards/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, idCardFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Create seller application
      const { error: insertError } = await supabase
        .from('sellers')
        .insert({
          user_id: user.id,
          shop_name: formData.shop_name,
          shop_description: formData.shop_description,
          phone: formData.phone,
          bank_name: formData.bank_name,
          bank_account_number: formData.bank_account_number,
          bank_account_name: formData.bank_account_name,
          id_card_number: formData.id_card_number,
          id_card_image: publicUrl,
          address: formData.address,
          status: 'pending',
          is_verified: false,
        });

      if (insertError) {
        throw insertError;
      }

      toast.success("ส่งคำขอสมัครเป็นผู้ขายสำเร็จ! รอการอนุมัติจากแอดมิน");
      setLocation("/");
    } catch (error: any) {
      console.error("Error submitting seller application:", error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการส่งคำขอ");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">กรุณาเข้าสู่ระบบ</h2>
            <p className="text-muted-foreground mb-6">
              คุณต้องเข้าสู่ระบบก่อนสมัครเป็นผู้ขาย
            </p>
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2">สมัครเป็นผู้ขาย</h1>
            <p className="text-muted-foreground">
              เริ่มต้นขายสินค้าบน StreetMarket วันนี้
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shop Information */}
              <div>
                <h2 className="text-xl font-bold mb-4">ข้อมูลร้านค้า</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shop_name">ชื่อร้านค้า *</Label>
                    <Input
                      id="shop_name"
                      value={formData.shop_name}
                      onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="shop_description">คำอธิบายร้านค้า</Label>
                    <Textarea
                      id="shop_description"
                      value={formData.shop_description}
                      onChange={(e) => setFormData({ ...formData, shop_description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">เบอร์โทรศัพท์ *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">ที่อยู่ *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Bank Information */}
              <div>
                <h2 className="text-xl font-bold mb-4">ข้อมูลบัญชีธนาคาร</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bank_name">ธนาคาร *</Label>
                    <Input
                      id="bank_name"
                      value={formData.bank_name}
                      onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                      placeholder="เช่น ธนาคารกสิกรไทย"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="bank_account_number">เลขที่บัญชี *</Label>
                    <Input
                      id="bank_account_number"
                      value={formData.bank_account_number}
                      onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="bank_account_name">ชื่อบัญชี *</Label>
                    <Input
                      id="bank_account_name"
                      value={formData.bank_account_name}
                      onChange={(e) => setFormData({ ...formData, bank_account_name: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* ID Card */}
              <div>
                <h2 className="text-xl font-bold mb-4">ยืนยันตัวตน</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="id_card_number">เลขบัตรประชาชน *</Label>
                    <Input
                      id="id_card_number"
                      value={formData.id_card_number}
                      onChange={(e) => setFormData({ ...formData, id_card_number: e.target.value })}
                      maxLength={13}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="id_card_image">รูปบัตรประชาชน *</Label>
                    <div className="mt-2">
                      <label
                        htmlFor="id_card_image"
                        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                      >
                        {idCardFile ? (
                          <div className="text-center">
                            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <p className="text-sm font-semibold">{idCardFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(idCardFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              คลิกเพื่ออัพโหลดรูปบัตรประชาชน
                            </p>
                          </div>
                        )}
                      </label>
                      <input
                        id="id_card_image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error("ไฟล์ต้องมีขนาดไม่เกิน 5MB");
                              return;
                            }
                            setIdCardFile(file);
                          }
                        }}
                        className="hidden"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  ฉันยอมรับ{" "}
                  <a href="#" className="text-primary hover:underline">
                    ข้อกำหนดและเงื่อนไขสำหรับผู้ขาย
                  </a>{" "}
                  และยืนยันว่าข้อมูลที่ให้มาถูกต้องทั้งหมด
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full btn-glow gradient-red-orange"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    กำลังส่งคำขอ...
                  </>
                ) : (
                  <>
                    <Store className="w-5 h-5 mr-2" />
                    ส่งคำขอสมัครเป็นผู้ขาย
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
