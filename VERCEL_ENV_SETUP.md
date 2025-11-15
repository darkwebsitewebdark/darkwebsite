# คำแนะนำการตั้งค่า Vercel Environment Variables

## 🎯 สิ่งที่ต้องทำ

### 1. เข้าสู่ Vercel Dashboard
URL: https://vercel.com/darkwebsitewebdarks-projects/darkwebsite/settings/environment-variables

### 2. เพิ่ม Environment Variables

คลิก **"Add New Variable"** หรือ **"New"** แล้วเพิ่ม 2 ตัวนี้:

#### Variable 1: VITE_SUPABASE_URL
```
Key: VITE_SUPABASE_URL
Value: https://yyuewmqrgtqcwlbndmck.supabase.co
Environment: Production, Preview, Development (เลือกทั้ง 3 อัน)
```

#### Variable 2: VITE_SUPABASE_ANON_KEY
```
Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5dWV3bXFyZ3RxY3dsYm5kbWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNzI5NzcsImV4cCI6MjA3ODc0ODk3N30.ifPiFskQAm1ITxACI2wpZgkpAryWPImhmoRdlAa5uNI
Environment: Production, Preview, Development (เลือกทั้ง 3 อัน)
```

### 3. Save
คลิก **"Save"** → Vercel จะ Redeploy อัตโนมัติ (ประมาณ 1-2 นาที)

### 4. รอ Deployment เสร็จ
ตรวจสอบที่: https://vercel.com/darkwebsitewebdarks-projects/darkwebsite/deployments

เมื่อเห็น **"Ready"** สีเขียว แสดงว่า Deploy สำเร็จแล้ว

---

## 📸 ภาพประกอบ

### ตัวอย่างการเพิ่ม Variable:
```
┌─────────────────────────────────────────┐
│ Key:   VITE_SUPABASE_URL                │
│ Value: https://yyuewmqrgtqcwlbndmck...  │
│                                         │
│ Environment:                            │
│ ☑ Production                            │
│ ☑ Preview                               │
│ ☑ Development                           │
│                                         │
│         [Cancel]  [Save]                │
└─────────────────────────────────────────┘
```

---

## ✅ เสร็จแล้วทำอะไรต่อ?

หลังจาก Deploy เสร็จ:
1. ทดสอบ Register: https://darkwebsite.vercel.app/register
2. ทดสอบ Login: https://darkwebsite.vercel.app/login
3. เพิ่มสินค้าทดสอบใน Seller Dashboard
4. ทดสอบการซื้อขาย + PromptPay QR Code

---

**หากมีปัญหา:**
- ตรวจสอบว่า Environment เลือกครบ 3 อัน (Production, Preview, Development)
- ตรวจสอบว่า Value คัดลอกถูกต้อง (ไม่มีช่องว่างหรือขึ้นบรรทัดใหม่)
- ลอง Redeploy ใหม่โดยคลิก "Redeploy" ที่หน้า Deployments
