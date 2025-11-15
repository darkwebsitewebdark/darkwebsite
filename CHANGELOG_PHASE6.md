# Phase 6: เปลี่ยนจาก Manus OAuth เป็น Supabase Auth

**Date:** 2025-11-16  
**Status:** ✅ Complete

---

## 🎯 สิ่งที่ทำเสร็จ

### 1. ลบ Manus OAuth ทั้งหมด
- ✅ ลบ `server/_core/oauth.ts`
- ✅ ลบ `registerOAuthRoutes` จาก `server/_core/index.ts`
- ✅ ลบ `getLoginUrl()` จาก `client/src/const.ts`
- ✅ แก้ไขทุกไฟล์ที่ใช้ `getLoginUrl()` (7 ไฟล์)

### 2. สร้างระบบ Supabase Auth
- ✅ อัพเดท `useAuth.ts` ให้ใช้ Supabase Auth
- ✅ สร้างหน้า `Login.tsx` (Email/Password + Google OAuth)
- ✅ สร้างหน้า `Register.tsx` (Email/Password + Google OAuth)
- ✅ ใช้ `AuthCallback.tsx` ที่มีอยู่แล้ว
- ✅ อัพเดท `Header.tsx` ให้ใช้ Supabase logout

### 3. ตั้งค่า Environment Variables
- ✅ สร้างไฟล์ `.env`
- ✅ เพิ่ม `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
- ✅ เพิ่ม `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

---

## 📝 ไฟล์ที่แก้ไข

### Client
1. `client/src/_core/hooks/useAuth.ts` - ใช้ Supabase Auth
2. `client/src/pages/Login.tsx` - Email/Password + Google OAuth
3. `client/src/pages/Register.tsx` - Email/Password + Google OAuth
4. `client/src/components/Header.tsx` - ลบ Manus OAuth
5. `client/src/const.ts` - ลบ getLoginUrl
6. `client/src/main.tsx` - เปลี่ยน redirect เป็น /login
7. `client/src/pages/Cart.tsx` - เปลี่ยน redirect เป็น /login
8. `client/src/pages/Checkout.tsx` - เปลี่ยน redirect เป็น /login
9. `client/src/pages/Orders.tsx` - เปลี่ยน redirect เป็น /login
10. `client/src/pages/Profile.tsx` - เปลี่ยน redirect เป็น /login
11. `client/src/components/DashboardLayout.tsx` - เปลี่ยน redirect เป็น /login

### Server
1. `server/_core/index.ts` - ลบ OAuth routes
2. `server/_core/oauth.ts` - ❌ ลบไฟล์

### Config
1. `.env` - เพิ่ม Supabase credentials

---

## 🔧 การทำงานของ Supabase Auth

### Authentication Flow
1. **Email/Password Login:**
   - `supabase.auth.signInWithPassword({ email, password })`
   - สร้าง user ใน `users` table ถ้ายังไม่มี

2. **Email/Password Register:**
   - `supabase.auth.signUp({ email, password })`
   - สร้าง user ใน `users` table
   - ส่ง email verification

3. **Google OAuth:**
   - `supabase.auth.signInWithOAuth({ provider: 'google' })`
   - Redirect ไป `/auth/callback`
   - สร้าง user ใน `users` table ถ้ายังไม่มี

4. **Logout:**
   - `supabase.auth.signOut()`
   - ลบ session

### useAuth Hook
```typescript
const { user, authUser, isAuthenticated, loading, logout } = useAuth();
```

- `user`: User จาก `users` table (DbUser)
- `authUser`: User จาก Supabase Auth
- `isAuthenticated`: Boolean
- `loading`: Boolean
- `logout`: Function

---

## 🚀 Next Steps (Phase 7-17)

### Phase 7: แก้ไข Cart.tsx
- อัพเดท Cart.tsx ให้ใช้ tRPC cart endpoints
- ทดสอบ Add to Cart หลัง login

### Phase 8: ทดสอบ Cart
- ทดสอบ Add/Update/Remove/Clear cart

### Phase 9-11: Seller Dashboard
- หน้าจัดการสินค้า (เพิ่ม/แก้ไข/ลบ)
- หน้าดูยอดขายและสถิติ
- หน้าจัดการคำสั่งซื้อ

### Phase 12: Checkout + PromptPay
- อัพเดท Checkout.tsx
- ผสาน PromptPay QR Code

### Phase 13: Payment + Order Tracking
- สร้างหน้า Payment Confirmation
- สร้างหน้า Order Tracking

### Phase 14-17: Testing + Deploy
- End-to-End Testing
- UI/UX Optimization
- Commit + Push → Vercel Auto-Deploy
- ทดสอบ Production

---

## ⚠️ Known Issues

1. **OAuth Warning:** `[OAuth] ERROR: OAUTH_SERVER_URL is not configured!`
   - ไม่มีผลกระทบ เพราะไม่ใช้ Manus OAuth แล้ว

2. **Google OAuth Redirect:**
   - ต้องตั้งค่า Redirect URL ใน Supabase Dashboard
   - Production: `https://darkwebsite.vercel.app/auth/callback`
   - Development: `http://localhost:5000/auth/callback`

---

## 📊 Progress

| Task | Status |
|------|--------|
| ลบ Manus OAuth | ✅ |
| สร้าง Supabase Auth | ✅ |
| Login page | ✅ |
| Register page | ✅ |
| AuthCallback | ✅ |
| useAuth hook | ✅ |
| Header component | ✅ |
| Environment variables | ✅ |
| Dev server test | ⏳ (จะทดสอบบน Production) |

---

**Last Updated:** 2025-11-16 17:15 GMT+7
