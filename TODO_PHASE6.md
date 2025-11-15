# Phase 6: เปลี่ยนจาก Manus OAuth เป็น Supabase Auth และแก้ไข Cart System

## Tasks

### 6.1 อัพเดท Environment Variables
- [ ] อัพเดท SUPABASE_SERVICE_KEY (Project rpkfptvgdjxnnfeltuer)
- [ ] อัพเดท SUPABASE_URL ให้ตรงกับ Service Role Key
- [ ] Restart Dev Server

### 6.2 ลบ Manus OAuth
- [ ] ลบ `/api/oauth/callback` endpoint
- [ ] ลบ Manus OAuth config ใน server/_core
- [ ] ลบ JWT Session Cookie logic
- [ ] ลบ OWNER_OPEN_ID, OAUTH_SERVER_URL ENV

### 6.3 สร้าง Supabase Auth System
- [ ] อัพเดท useAuth hook ให้ใช้ Supabase Auth
- [ ] สร้าง Login page (Email/Password + Google OAuth)
- [ ] สร้าง Register page (Email/Password)
- [ ] สร้าง Forgot Password page
- [ ] อัพเดท ProtectedRoute ให้ใช้ Supabase Auth

### 6.4 แก้ไข Cart System
- [ ] ทดสอบ Cart tRPC procedures (add, list, update, remove, clear)
- [ ] ทดสอบ Add to Cart จาก Products page
- [ ] ทดสอบ View Cart page
- [ ] ทดสอบ Update quantity
- [ ] ทดสอบ Remove item
- [ ] ทดสอบ Clear cart

### 6.5 สร้าง Checkout System
- [ ] สร้าง PromptPay QR Code generator
- [ ] อัพเดท Checkout page ให้ใช้ Supabase Auth
- [ ] ทดสอบ Checkout flow (Cart → Checkout → Payment → Order)
- [ ] บันทึก Order ลง Supabase
- [ ] ส่ง Email confirmation

### 6.6 Testing
- [ ] ทดสอบ Guest mode (ไม่สามารถ Add to Cart)
- [ ] ทดสอบ User mode (Login → Add to Cart → Checkout)
- [ ] ทดสอบ Logout
- [ ] ทดสอบ Register new user
- [ ] ทดสอบ Forgot Password

### 6.7 Deployment
- [ ] Commit & Push to GitHub
- [ ] Vercel Auto Deploy
- [ ] ทดสอบ Production
- [ ] Save Checkpoint
