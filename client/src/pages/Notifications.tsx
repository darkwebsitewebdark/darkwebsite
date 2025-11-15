import { useState } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Bell, Check, CheckCheck, Package, CreditCard, MessageCircle, AlertTriangle, Info } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Notifications() {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<string>("all");

  const { data: notifications, refetch } = trpc.notifications.list.useQuery({}, {
    enabled: isAuthenticated,
  });

  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      toast.success("ทำเครื่องหมายทั้งหมดเป็นอ่านแล้ว");
      refetch();
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
      <Header />
        <Card className="p-8 text-center max-w-md">
          <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-muted-foreground mb-6">
            คุณต้องเข้าสู่ระบบเพื่อดูการแจ้งเตือน
          </p>
          <Link href="/auth">
            <Button size="lg">เข้าสู่ระบบ</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "payment":
        return <CreditCard className="w-5 h-5 text-green-500" />;
      case "chat":
        return <MessageCircle className="w-5 h-5 text-purple-500" />;
      case "dispute":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "system":
        return <Info className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredNotifications = notifications?.filter(n => 
    filter === "all" || n.type === filter
  ) || [];

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">การแจ้งเตือน</h1>
              <p className="text-muted-foreground mt-1">
                {unreadCount > 0 ? `คุณมี ${unreadCount} การแจ้งเตือนที่ยังไม่ได้อ่าน` : "ไม่มีการแจ้งเตือนใหม่"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                ทำเครื่องหมายทั้งหมดเป็นอ่านแล้ว
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { value: "all", label: "ทั้งหมด" },
              { value: "order", label: "คำสั่งซื้อ" },
              { value: "payment", label: "การชำระเงิน" },
              { value: "chat", label: "ข้อความ" },
              { value: "dispute", label: "ข้อพิพาท" },
              { value: "system", label: "ระบบ" },
            ].map((item) => (
              <Button
                key={item.value}
                variant={filter === item.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
                    !notification.isRead ? "border-l-4 border-l-primary" : ""
                  }`}
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsReadMutation.mutate({ id: notification.id });
                    }
                  }}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold">{notification.title}</h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.createdAt).toLocaleString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">ไม่มีการแจ้งเตือน</h3>
                <p className="text-muted-foreground">
                  {filter === "all"
                    ? "คุณยังไม่มีการแจ้งเตือน"
                    : `ไม่มีการแจ้งเตือนประเภท ${
                        ["order", "payment", "chat", "dispute", "system"].find(f => f === filter)
                      }`}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
