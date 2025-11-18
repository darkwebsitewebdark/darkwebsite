# Quick Start - darkwebsite.vercel.app

## 🎯 สถานะปัจจุบัน

✅ **Frontend**: พร้อมใช้งาน 100%  
⚠️ **Backend**: ต้องตั้งค่า Environment Variables

---

## ⚡ ทำอย่างไรต่อ?

### ขั้นตอนที่ 1: Setup Database (5 นาที)

1. ไปที่ https://planetscale.com/
2. สร้าง database ใหม่
3. คัดลอก connection string

### ขั้นตอนที่ 2: Setup Supabase (5 นาที)

1. ไปที่ https://supabase.com/
2. สร้างโปรเจกต์ใหม่
3. คัดลอก URL และ service_role key

### ขั้นตอนที่ 3: Generate JWT Secret (1 นาที)

```bash
openssl rand -base64 32
```

### ขั้นตอนที่ 4: ตั้งค่าใน Vercel (5 นาที)

1. ไปที่ https://vercel.com/darkwebsites-projects/darkwebsite
2. Settings → Environment Variables
3. เพิ่ม:
   - `DATABASE_URL` = (จาก PlanetScale)
   - `SUPABASE_URL` = (จาก Supabase)
   - `SUPABASE_SERVICE_KEY` = (จาก Supabase)
   - `JWT_SECRET` = (จาก step 3)
   - `VITE_APP_ID` = `darkwebsite`

### ขั้นตอนที่ 5: Redeploy (1 นาที)

1. Deployments → คลิก "Redeploy"
2. รอ 2-3 นาที
3. เสร็จ! 🎉

---

## 📖 อ่านเพิ่มเติม

- **คู่มือละเอียด**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **รายงานการทดสอบ**: [COMPREHENSIVE_TEST_REPORT.md](./COMPREHENSIVE_TEST_REPORT.md)

---

**เวลาทั้งหมด**: ~20 นาที  
**ความยาก**: ⭐⭐ (ปานกลาง)
