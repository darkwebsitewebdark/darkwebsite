import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

export default function Chat() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-bold mb-4">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-muted-foreground mb-6">
            คุณต้องเข้าสู่ระบบเพื่อใช้งานแชท
          </p>
          <Link href="/auth">
            <Button size="lg">เข้าสู่ระบบ</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <Card className="p-12 text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-6">💬</div>
          <h1 className="text-3xl font-bold mb-4">ระบบแชท</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            ระบบแชทกำลังพัฒนา<br />
            คุณสามารถติดต่อผู้ขายผ่านหน้าสินค้าได้
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button size="lg">ดูสินค้า</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">กลับหน้าแรก</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
