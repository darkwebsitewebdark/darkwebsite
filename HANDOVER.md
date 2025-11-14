# 🚀 StreetMarket E-commerce Marketplace - HANDOVER DOCUMENT

**Project Name:** StreetMarket  
**Checkpoint Version:** df536c52  
**Date:** 2025-01-14  
**Status:** In Development - Requires Completion

---

## 📊 CURRENT STATUS

### ✅ COMPLETED FEATURES

#### 1. Database Schema (14 Tables)
- `users` - ข้อมูลผู้ใช้ (รองรับ wallet, bankAccount, idCard)
- `categories` - หมวดหมู่สินค้า (hierarchical)
- `products` - สินค้า
- `reviews` - รีวิวสินค้า
- `orders` - คำสั่งซื้อ
- `orderItems` - รายการสินค้าในคำสั่งซื้อ
- `transactions` - ประวัติการเงิน
- `cartItems` - ตะกร้าสินค้า
- `messages` - แชท
- `disputes` - ข้อพิพาท
- `notifications` - การแจ้งเตือน
- `wishlist` - รายการโปรด
- `sellerApplications` - คำขอเป็น Seller
- `withdrawalRequests` - คำขอถอนเงิน

#### 2. Backend API (Partial)
**ไฟล์:** `server/routers.ts`, `server/db.ts`

**API Endpoints ที่มี:**
- ✅ `auth.me` - ดูข้อมูลผู้ใช้ปัจจุบัน
- ✅ `auth.logout` - ออกจากระบบ
- ✅ `user.updateProfile` - อัพเดทโปรไฟล์
- ✅ `user.linkBankAccount` - เชื่อมบัญชีธนาคาร
- ✅ `user.uploadIdCard` - อัพโหลดบัตรประชาชน
- ✅ `seller.apply` - สมัครเป็น Seller
- ✅ `seller.getApplication` - ดูสถานะการสมัคร
- ✅ `categories.list` - รายการหมวดหมู่
- ✅ `categories.create` - สร้างหมวดหมู่ (Admin)
- ✅ `products.list` - รายการสินค้า (รองรับ search, filter, sort)
- ✅ `products.get` - รายละเอียดสินค้า
- ✅ `products.create` - สร้างสินค้า (Seller)
- ✅ `products.update` - แก้ไขสินค้า (Seller)
- ✅ `products.delete` - ลบสินค้า (Seller)
- ✅ `cart.list` - ดูตะกร้า
- ✅ `cart.add` - เพิ่มสินค้าในตะกร้า
- ✅ `cart.update` - อัพเดทจำนวน
- ✅ `cart.remove` - ลบสินค้าออกจากตะกร้า
- ✅ `cart.clear` - ล้างตะกร้า
- ✅ `wishlist.list` - รายการโปรด
- ✅ `wishlist.add` - เพิ่มรายการโปรด
- ✅ `wishlist.remove` - ลบรายการโปรด
- ✅ `payment.generateQR` - สร้าง PromptPay QR Code
- ✅ `payment.topup` - เติมเงินเข้ากระเป๋า
- ✅ `payment.getTransactions` - ประวัติการเงิน
- ✅ `orders.create` - สร้างคำสั่งซื้อ
- ✅ `orders.list` - รายการคำสั่งซื้อ
- ✅ `orders.get` - รายละเอียดคำสั่งซื้อ
- ✅ `orders.updateStatus` - อัพเดทสถานะ (Seller)
- ✅ `orders.confirmDelivery` - ยืนยันรับสินค้า (Buyer)
- ✅ `chat.getConversations` - รายการแชท
- ✅ `chat.getMessages` - ข้อความในแชท
- ✅ `chat.send` - ส่งข้อความ
- ✅ `disputes.create` - สร้างข้อพิพาท
- ✅ `disputes.list` - รายการข้อพิพาท
- ✅ `admin.approveSellerApplication` - อนุมัติ Seller
- ✅ `admin.rejectSellerApplication` - ปฏิเสธ Seller
- ✅ `admin.getSellerApplications` - รายการคำขอ Seller
- ✅ `admin.resolveDispute` - จัดการข้อพิพาท
- ✅ `notifications.list` - รายการแจ้งเตือน
- ✅ `notifications.markAsRead` - ทำเครื่องหมายอ่านแล้ว
- ✅ `image.upload` - อัพโหลดรูปภาพ (single)
- ✅ `image.uploadMultiple` - อัพโหลดหลายรูป (max 10)
- ✅ `image.delete` - ลบรูปภาพ

#### 3. Image Upload System ✅ COMPLETE
**ไฟล์:** `server/image.ts`, `client/src/components/ImageUploader.tsx`, `client/src/components/MultipleImagesUploader.tsx`

- ✅ Backend: Sharp image processing
- ✅ Validation: file size (5MB), file type (JPEG, PNG, WebP, GIF), dimensions (4096x4096)
- ✅ Auto optimization & compression
- ✅ Thumbnail generation
- ✅ Frontend: Drag & drop upload
- ✅ Image preview
- ✅ Progress bar
- ✅ Multiple images upload (max 10)
- ✅ Integration: Profile Page (profile picture)
- ✅ Integration: Seller Dashboard (product images)

#### 4. Frontend Pages
**ไฟล์:** `client/src/pages/*.tsx`

- ✅ `Home.tsx` - Landing Page (Hero, Features, CTA, Footer)
- ✅ `Products.tsx` - รายการสินค้า (Search, Filter, Sort)
- ✅ `ProductDetail.tsx` - รายละเอียดสินค้า + รีวิว
- ✅ `Cart.tsx` - ตะกร้าสินค้า
- ✅ `Checkout.tsx` - ชำระเงิน (PromptPay QR)
- ✅ `Profile.tsx` - จัดการโปรไฟล์ (Wallet, Bank Account, Upload Profile Picture)
- ✅ `SellerDashboard.tsx` - Dashboard ผู้ขาย (จัดการสินค้า, คำสั่งซื้อ, สถิติ)
- ✅ `AdminDashboard.tsx` - Dashboard Admin (อนุมัติ Seller, จัดการสินค้า, ข้อพิพาท)

#### 5. UI/UX Design
**ไฟล์:** `client/src/index.css`

- ✅ Dark Theme สไตล์วัยรุ่น
- ✅ Color Palette: แดงสด (#FF3B3B), เขียวนีออน (#4ADE80), ส้มทอง (#FB923C)
- ✅ Fonts: Bebas Neue (หัวข้อ), Inter (เนื้อหา)
- ✅ Neon Effects: Text glow, Border glow
- ✅ Glass Morphism effects
- ✅ Custom Scrollbar
- ✅ Animations: Glow, Hover, Pulse
- ✅ Responsive Design (Mobile + Desktop)

#### 6. PromptPay QR Code
**ไฟล์:** `server/promptpay.ts`

- ✅ Generate QR Code with REF number
- ✅ Support amount encoding
- ⚠️ **ยังไม่มี Payment Verification** (ต้องทำต่อ)

---

## ❌ MISSING FEATURES (ต้องทำต่อ)

### 1. Email Notification System ❌
**ต้องสร้างไฟล์:**
- `server/email.ts` - Email helper functions
- `server/templates/welcome.html`
- `server/templates/email-verification.html`
- `server/templates/order-confirmation.html`
- `server/templates/payment-received.html`
- `server/templates/shipping-update.html`
- `server/templates/seller-approved.html`
- `server/templates/seller-rejected.html`

**ต้องทำ:**
- ติดตั้ง Email Provider (Resend/SendGrid/AWS SES)
- ตั้งค่า SMTP credentials
- สร้าง Email Templates ทั้งหมด
- สร้าง functions: `sendWelcomeEmail`, `sendVerificationEmail`, `sendOrderConfirmation`, `sendPaymentConfirmation`, `sendShippingUpdate`, `sendSellerNotification`
- Integrate ทุกจุด: User Registration, Order Created, Payment Verified, Order Status Changed, Seller Application

### 2. Payment Verification System ❌
**ต้องสร้างไฟล์:**
- `server/payment-verification.ts`

**ต้องทำ:**
- **Option 1 (Manual):** Admin Dashboard หน้าตรวจสอบการโอนเงิน + upload slip
- **Option 2 (Auto - แนะนำ):** Integrate Payment Gateway API (Omise/2C2P/SCB Easy)
  - Setup API credentials
  - Webhook endpoint: `/api/payment/webhook`
  - Verify payment signature
  - Auto-update order status
  - Send email notification

### 3. Security Implementation ❌
**ต้องทำ:**
- ติดตั้ง `express-rate-limit`
  - API: 100 requests/15min per IP
  - Login: 5 attempts/15min per IP
  - Payment: 10 requests/hour per user
- Input Validation (Zod schema - มีบางส่วนแล้ว)
- Sanitize HTML input (prevent XSS)
- CSRF Protection (ติดตั้ง `csurf` middleware)
- ตรวจสอบ `.env` ไม่ถูก commit
- Set secure cookie flags

### 4. Real-time Chat System ❌
**ต้องสร้างไฟล์:**
- `server/chat-socket.ts` - WebSocket setup
- `client/src/pages/Chat.tsx` - Chat UI
- `client/src/components/ChatList.tsx`
- `client/src/components/ChatWindow.tsx`
- `client/src/components/MessageBubble.tsx`
- `client/src/components/ChatInput.tsx`

**ต้องทำ:**
- ติดตั้ง Socket.IO
- Backend: Events (`join-room`, `send-message`, `typing`, `read-message`)
- Frontend: Real-time messaging, Typing indicator, Read receipts, Image sharing, Unread count badge
- Integration: Product Detail (ปุ่ม "แชทกับผู้ขาย"), Order Detail, Navigation (Chat icon with badge)

### 5. Shipping API Integration ❌
**ต้องสร้างไฟล์:**
- `server/shipping/flash.ts` - Flash Express API
- `server/shipping/kerry.ts` - Kerry Express API
- `server/shipping/jt.ts` - J&T Express API
- `server/shipping/thaipost.ts` - Thailand Post API
- `server/shipping/index.ts` - Unified Shipping Service

**ต้องทำ:**
- สมัคร API keys ทั้ง 4 บริษัท
- Implement functions: `createShipment`, `trackShipment`, `cancelShipment`, `getShippingRate`
- Unified Service: `selectCourier` (เลือกขนส่งที่ถูกที่สุด)
- Frontend Integration: Checkout (เลือกขนส่ง), Order Detail (tracking), Seller Dashboard (create label)
- Cron Job: ตรวจสอบสถานะพัสดุทุก 1 ชั่วโมง + auto-update + send email

### 6. Data Seeding ❌
**ต้องสร้างไฟล์:**
- `server/seed.ts`

**ต้องทำ:**
- สร้าง Admin Account (1)
- สร้าง Seller Accounts (5)
- สร้าง User Accounts (20)
- สร้าง Categories (10)
- สร้าง Products (100) พร้อมรูปภาพ
- สร้าง Reviews (50)
- สร้าง Orders (30)
- สร้าง Messages (10)
- Run: `pnpm seed`

### 7. Testing ❌
**ต้องสร้างไฟล์:**
- `TESTING.md` - Test checklist

**ต้องทดสอบ:**

**User Flow:**
- [ ] Register → Email Verification → Login
- [ ] Browse Products → Search → Filter → Sort
- [ ] View Product Detail → Add to Cart
- [ ] Cart → Update Quantity → Remove Item
- [ ] Checkout → Fill Address → Select Shipping
- [ ] Payment → Generate QR → Pay → Verify
- [ ] Order Confirmation → Track Order
- [ ] Review Product → Rate Seller

**Seller Flow:**
- [ ] Apply as Seller → Upload ID Card
- [ ] Wait for Admin Approval
- [ ] Create Product → Upload Images
- [ ] Manage Inventory → Update Stock
- [ ] View Orders → Process Order
- [ ] Create Shipment → Print Label
- [ ] Update Order Status
- [ ] Request Withdrawal → Receive Money

**Admin Flow:**
- [ ] Login as Admin
- [ ] Approve/Reject Seller Applications
- [ ] Manage Users → Ban/Unban
- [ ] Manage Products → Delete Inappropriate
- [ ] View All Orders → Refund
- [ ] Resolve Disputes
- [ ] View Analytics Dashboard

**Chat Testing:**
- [ ] Buyer → Chat with Seller
- [ ] Real-time message delivery
- [ ] Send images in chat
- [ ] Typing indicator works
- [ ] Unread count updates

**Payment Testing:**
- [ ] Generate PromptPay QR
- [ ] Verify payment (manual/auto)
- [ ] Order status updates
- [ ] Email notification sent

### 8. Bug Tracking & Fixing ❌
**ต้องสร้างไฟล์:**
- `BUGS.md` - Bug tracking

**ต้องทำ:**
- ทดสอบทุก Flow
- บันทึก bugs ทั้งหมด
- แบ่งตาม severity (Critical, High, Medium, Low)
- แก้ไข Critical bugs ก่อน
- แก้ไข bugs อื่นๆ

### 9. Pre-Deployment Setup ❌
**ต้องทำ:**
- ตั้งค่า Production Environment Variables:
  - `DATABASE_URL` (production database)
  - `JWT_SECRET` (strong random string)
  - SMTP credentials
  - S3 credentials
  - Payment Gateway API keys
  - Shipping API keys (Flash, Kerry, J&T, ThaiPost)
  - `CORS_ORIGIN` (production domain)
- Database Migration (production)
- Backup development database

### 10. Optimization ❌
**ต้องทำ:**

**Frontend:**
- Image lazy loading
- Code splitting
- Minify CSS/JS
- Enable Gzip compression

**Backend:**
- Database indexing
- Query optimization
- Caching (Redis - optional)
- CDN for static assets

**SEO:**
- Meta tags
- Open Graph tags
- Sitemap.xml
- Robots.txt

### 11. Production Deployment ❌
**ต้องทำ:**
- Save Final Checkpoint
- Click "Publish" in Management Dashboard
- Verify Deployment:
  - เปิดเว็บไซต์
  - ทดสอบ login
  - ทดสอบ payment
  - ตรวจสอบ logs
- Monitor Errors
- Monitor Performance
- Collect User Feedback

---

## 📁 PROJECT STRUCTURE

```
streetmarket/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── ui/ (shadcn components)
│       │   ├── ImageUploader.tsx ✅
│       │   └── MultipleImagesUploader.tsx ✅
│       ├── pages/
│       │   ├── Home.tsx ✅
│       │   ├── Products.tsx ✅
│       │   ├── ProductDetail.tsx ✅
│       │   ├── Cart.tsx ✅
│       │   ├── Checkout.tsx ✅
│       │   ├── Profile.tsx ✅
│       │   ├── SellerDashboard.tsx ✅
│       │   ├── AdminDashboard.tsx ✅
│       │   └── Chat.tsx ❌ (ต้องสร้าง)
│       ├── lib/
│       │   └── trpc.ts ✅
│       ├── App.tsx ✅
│       ├── index.css ✅
│       └── const.ts ✅
├── server/
│   ├── _core/ (framework files - อย่าแก้)
│   ├── routers.ts ✅
│   ├── db.ts ✅
│   ├── image.ts ✅
│   ├── promptpay.ts ✅
│   ├── email.ts ❌ (ต้องสร้าง)
│   ├── payment-verification.ts ❌ (ต้องสร้าง)
│   ├── chat-socket.ts ❌ (ต้องสร้าง)
│   ├── seed.ts ❌ (ต้องสร้าง)
│   ├── shipping/
│   │   ├── flash.ts ❌ (ต้องสร้าง)
│   │   ├── kerry.ts ❌ (ต้องสร้าง)
│   │   ├── jt.ts ❌ (ต้องสร้าง)
│   │   ├── thaipost.ts ❌ (ต้องสร้าง)
│   │   └── index.ts ❌ (ต้องสร้าง)
│   └── templates/ ❌ (ต้องสร้าง)
│       ├── welcome.html
│       ├── email-verification.html
│       ├── order-confirmation.html
│       ├── payment-received.html
│       ├── shipping-update.html
│       ├── seller-approved.html
│       └── seller-rejected.html
├── drizzle/
│   └── schema.ts ✅
├── todo.md ✅
├── HANDOVER.md ✅ (ไฟล์นี้)
├── TESTING.md ❌ (ต้องสร้าง)
└── BUGS.md ❌ (ต้องสร้าง)
```

---

## 🔑 IMPORTANT NOTES

### Environment Variables (ที่มีอยู่แล้ว)
```
DATABASE_URL=<TiDB connection string>
JWT_SECRET=<auto-generated>
VITE_APP_ID=<Manus OAuth ID>
OAUTH_SERVER_URL=<Manus OAuth URL>
VITE_OAUTH_PORTAL_URL=<Manus login URL>
OWNER_OPEN_ID=<Owner's OpenID>
OWNER_NAME=<Owner's name>
VITE_APP_TITLE=StreetMarket
VITE_APP_LOGO=/logo.svg
BUILT_IN_FORGE_API_URL=<Manus API URL>
BUILT_IN_FORGE_API_KEY=<Manus API Key>
VITE_FRONTEND_FORGE_API_KEY=<Frontend API Key>
VITE_FRONTEND_FORGE_API_URL=<Frontend API URL>
```

### Environment Variables (ที่ต้องเพิ่ม)
```
# Email Service
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=

# Payment Gateway (เลือก 1 อัน)
OMISE_PUBLIC_KEY=
OMISE_SECRET_KEY=
# หรือ
SCB_EASY_API_KEY=
SCB_EASY_SECRET_KEY=

# Shipping APIs
FLASH_API_KEY=
KERRY_API_KEY=
JT_API_KEY=
THAIPOST_API_KEY=
```

### Database Schema Notes
- ใช้ TiDB (MySQL-compatible)
- ห้ามใช้ `decimal` type (ใช้ `int` แทน - เก็บเป็นสตางค์)
- ห้ามใช้ JSON default values (TiDB ไม่รองรับ)
- Migration: `pnpm db:push`

### API Notes
- ใช้ tRPC (type-safe)
- ทุก mutation ต้อง invalidate cache
- Protected procedures ต้องใช้ `protectedProcedure`
- Admin procedures ต้องเช็ค `ctx.user.role === 'admin'`

### Frontend Notes
- ใช้ React 19 + Tailwind 4
- Dark theme by default
- ใช้ shadcn/ui components
- ทุกหน้าต้อง responsive (Mobile + Desktop)
- Image upload ต้องใช้ `ImageUploader` หรือ `MultipleImagesUploader` components

---

## 🚀 NEXT STEPS FOR AI

### Phase 2: Email Notification System
1. เลือก Email Provider (แนะนำ Resend)
2. สร้าง `server/email.ts`
3. สร้าง Email Templates ทั้งหมด (7 templates)
4. Integrate ทุกจุด
5. ทดสอบส่งอีเมล

### Phase 3: Payment Verification
1. เลือก Payment Gateway (แนะนำ Omise หรือ SCB Easy)
2. สร้าง `server/payment-verification.ts`
3. สร้าง Webhook endpoint
4. Integrate กับ Checkout flow
5. ทดสอบ Payment flow

### Phase 4: Security
1. ติดตั้ง `express-rate-limit`
2. ติดตั้ง `csurf`
3. เพิ่ม Input Validation
4. ตั้งค่า secure cookies
5. ทดสอบ Security

### Phase 5: Real-time Chat
1. ติดตั้ง Socket.IO
2. สร้าง `server/chat-socket.ts`
3. สร้าง Chat UI components
4. Integrate ทุกจุด
5. ทดสอบ Real-time messaging

### Phase 6: Shipping Integration
1. สมัคร API keys ทั้ง 4 บริษัท
2. สร้าง Shipping modules
3. สร้าง Unified Service
4. Integrate กับ Checkout + Order Detail
5. ตั้งค่า Cron Job
6. ทดสอบ Shipping flow

### Phase 7: Data Seeding
1. สร้าง `server/seed.ts`
2. สร้างข้อมูลตัวอย่างทั้งหมด
3. Run seed script
4. ตรวจสอบข้อมูล

### Phase 8: Testing
1. สร้าง `TESTING.md`
2. ทดสอบทุก Flow
3. สร้าง `BUGS.md`
4. แก้ไข bugs

### Phase 9: Optimization
1. Frontend optimization
2. Backend optimization
3. SEO optimization

### Phase 10: Deployment
1. ตั้งค่า Production env vars
2. Database migration
3. Save checkpoint
4. Click "Publish"
5. Verify deployment

---

## 📞 CONTACT & SUPPORT

**Checkpoint URL:** `manus-webdev://df536c52`  
**Dev Server:** https://3000-i5w2pikdv9qgd0kt6rn5x-82626377.manus-asia.computer  
**Management Dashboard:** คลิกปุ่ม "View" ใน checkpoint card

---

## ⚠️ CRITICAL REMINDERS

1. **ห้ามข้าม ห้ามลัด ห้ามย่อ** - ทำทุกอย่างตามที่ระบุ
2. **ทุกไฟล์ต้องสร้างครบ** - ขาด 1 ไฟล์ถือว่าไม่สมบูรณ์
3. **ทุกฟีเจอร์ต้องทดสอบ** - ต้องยืนยันว่าใช้งานได้จริง
4. **ทุกส่วนต้องเชื่อมโยงกัน** - ต้องทำงานร่วมกันได้
5. **ไม่หยุดจนกว่าจะเสร็จ 100%** - ไม่มี 99.99%

---

**END OF HANDOVER DOCUMENT**
