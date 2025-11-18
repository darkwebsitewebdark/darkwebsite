# Setup Guide - darkwebsite.vercel.app

## ปัญหาที่พบ

เว็บไซต์ปัจจุบัน deploy เฉพาะ **frontend** เท่านั้น ทำให้ฟีเจอร์ที่ต้องการ backend ไม่ทำงาน:
- ❌ Authentication (Register, Login)
- ❌ User Profile
- ❌ Product Management
- ❌ Cart & Orders
- ❌ Payment

## สาเหตุ

Backend API ต้องการ **Environment Variables** ต่อไปนี้:

### Required Environment Variables

1. **DATABASE_URL** - MySQL database connection string
2. **SUPABASE_URL** - Supabase project URL
3. **SUPABASE_SERVICE_KEY** - Supabase service role key
4. **JWT_SECRET** - Secret key สำหรับ JWT token encryption
5. **VITE_APP_ID** - Application identifier

### Optional Environment Variables

- `SUPABASE_ANON_KEY` - Supabase anonymous key (สำหรับ client-side)
- `OAUTH_SERVER_URL` - OAuth server URL (ถ้าใช้)
- `OWNER_OPEN_ID` - Owner OpenID (ถ้าใช้)

---

## วิธีแก้ไข

### Option 1: Setup Vercel Environment Variables (แนะนำ)

#### Step 1: เตรียม Database

สร้าง MySQL database บน:
- [PlanetScale](https://planetscale.com/) (แนะนำ - Free tier)
- [Railway](https://railway.app/)
- [Neon](https://neon.tech/) (PostgreSQL alternative)

**ตัวอย่าง DATABASE_URL:**
```
mysql://username:password@host:3306/database_name
```

#### Step 2: Setup Supabase

1. สร้างโปรเจกต์ใหม่ที่ [Supabase](https://supabase.com/)
2. ไปที่ **Settings** → **API**
3. คัดลอก:
   - Project URL → `SUPABASE_URL`
   - service_role key → `SUPABASE_SERVICE_KEY`
   - anon public key → `SUPABASE_ANON_KEY`

#### Step 3: Generate JWT Secret

สร้าง random string สำหรับ JWT_SECRET:

```bash
# วิธีที่ 1: ใช้ OpenSSL
openssl rand -base64 32

# วิธีที่ 2: ใช้ Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### Step 4: ตั้งค่า Environment Variables ใน Vercel

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือกโปรเจกต์ **darkwebsite**
3. ไปที่ **Settings** → **Environment Variables**
4. เพิ่ม variables ต่อไปนี้:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `DATABASE_URL` | `mysql://...` | Production, Preview, Development |
| `SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview, Development |
| `SUPABASE_SERVICE_KEY` | `eyJhbG...` | Production, Preview, Development |
| `JWT_SECRET` | `your-random-secret` | Production, Preview, Development |
| `VITE_APP_ID` | `darkwebsite` | Production, Preview, Development |

#### Step 5: Redeploy

หลังจากตั้งค่า environment variables แล้ว:

1. ไปที่ **Deployments**
2. คลิก **Redeploy** ที่ deployment ล่าสุด
3. หรือ push commit ใหม่ไปยัง GitHub

```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main
```

---

### Option 2: Deploy Backend แยก (Alternative)

ถ้าไม่ต้องการใช้ Vercel Serverless Functions สามารถ deploy backend แยกได้:

#### Deploy Backend บน Railway

1. สร้างโปรเจกต์ใหม่บน [Railway](https://railway.app/)
2. เชื่อมต่อ GitHub repository
3. ตั้งค่า environment variables
4. Deploy command: `pnpm build && pnpm start`
5. Start command: `node dist/index.js`

#### อัพเดท Frontend

แก้ไข `client/src/lib/trpc.ts`:

```typescript
const url = import.meta.env.PROD
  ? 'https://your-backend.railway.app/trpc' // Backend URL
  : 'http://localhost:3000/trpc';
```

---

## การทดสอบหลัง Setup

### 1. ทดสอบ API Endpoint

```bash
curl https://darkwebsite.vercel.app/api/health
```

ควรได้ response:
```json
{"status": "ok", "timestamp": "2025-11-19T..."}
```

### 2. ทดสอบ Authentication

1. เปิด https://darkwebsite.vercel.app/register
2. กรอกข้อมูลและสมัครสมาชิก
3. ตรวจสอบ browser console ไม่มี error
4. ควร redirect ไปหน้า home หรือ dashboard

### 3. ทดสอบ Database Connection

เปิด browser console และรัน:

```javascript
// ทดสอบ tRPC connection
fetch('/api/trpc/auth.me')
  .then(r => r.json())
  .then(console.log)
```

---

## Database Schema Migration

หลังจาก setup database แล้ว ต้องรัน migration:

### Local Development

```bash
# 1. สร้าง .env file
cp .env.example .env

# 2. แก้ไข .env ใส่ค่าจริง
nano .env

# 3. Generate และ run migrations
pnpm db:push
```

### Production (Vercel)

Migration จะรันอัตโนมัติเมื่อ deploy ถ้ามี build script:

แก้ไข `package.json`:

```json
{
  "scripts": {
    "build": "pnpm db:push && vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
  }
}
```

---

## Troubleshooting

### Error: "Failed to load resource: 400"

**สาเหตุ:** Backend API ไม่ได้ตั้งค่า environment variables

**แก้ไข:** ตั้งค่า environment variables ตาม Step 4 ข้างต้น

### Error: "Database connection failed"

**สาเหตุ:** DATABASE_URL ไม่ถูกต้องหรือ database ไม่ทำงาน

**แก้ไข:**
1. ตรวจสอบ DATABASE_URL format
2. ทดสอบ connection ด้วย MySQL client
3. ตรวจสอบ firewall/whitelist IP

### Error: "Supabase auth failed"

**สาเหตุ:** SUPABASE_URL หรือ SUPABASE_SERVICE_KEY ผิด

**แก้ไข:**
1. ตรวจสอบ Supabase project settings
2. ใช้ service_role key ไม่ใช่ anon key
3. ตรวจสอบ project URL ถูกต้อง

---

## ไฟล์ที่สร้างใหม่

1. **`/api/index.ts`** - Vercel Serverless Function สำหรับ tRPC API
2. **`.env.example`** - Template สำหรับ environment variables
3. **`SETUP_GUIDE.md`** - เอกสารนี้

---

## Next Steps

หลังจาก setup เสร็จแล้ว:

1. ✅ ทดสอบ authentication flow
2. ✅ เพิ่มสินค้าตัวอย่าง
3. ✅ ทดสอบ cart และ checkout
4. ✅ ทดสอบ payment integration
5. ✅ Setup email notifications (Nodemailer)
6. ✅ Setup file upload (S3/Cloudinary)

---

## Support

หากมีปัญหาหรือคำถาม:
- ตรวจสอบ Vercel deployment logs
- ตรวจสอบ browser console errors
- ตรวจสอบ database logs

**Created by:** Manus AI Agent  
**Date:** 19 พฤศจิกายน 2025
