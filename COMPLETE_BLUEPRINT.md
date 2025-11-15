# StreetMarket E-commerce Marketplace - Complete Blueprint (พิมพ์เขียวสมบูรณ์)

**เอกสารนี้คือพิมพ์เขียวสมบูรณ์สำหรับสร้าง StreetMarket E-commerce Marketplace จาก 0 ถึง 100%**

---

## 📋 สารบัญ

1. [ภาพรวมระบบ](#ภาพรวมระบบ)
2. [โครงสร้างไฟล์ทั้งหมด](#โครงสร้างไฟล์ทั้งหมด)
3. [Database Schema ละเอียด](#database-schema-ละเอียด)
4. [Backend API ทั้งหมด](#backend-api-ทั้งหมด)
5. [Frontend Pages ทั้งหมด](#frontend-pages-ทั้งหมด)
6. [UI Components ทั้งหมด](#ui-components-ทั้งหมด)
7. [User Flows ทั้งหมด](#user-flows-ทั้งหมด)
8. [Workflow การสร้าง](#workflow-การสร้าง)
9. [การแก้ปัญหา](#การแก้ปัญหา)

---

## ภาพรวมระบบ

### ระบบหลัก 7 ระบบ

1. **ระบบสมาชิก (User System)**
   - สมัครสมาชิก (OAuth)
   - ยืนยันอีเมล
   - จัดการโปรไฟล์
   - เชื่อมโยงบัญชีธนาคาร
   - อัพโหลดบัตรประชาชน

2. **ระบบ Seller**
   - สมัครเป็น Seller
   - อนุมัติ/ปฏิเสธ Seller (Admin)
   - จัดการร้านค้า
   - จัดการสินค้า
   - ดูสถิติการขาย

3. **ระบบสินค้า (Product System)**
   - หมวดหมู่สินค้า (Categories)
   - จัดการสินค้า (CRUD)
   - ค้นหาสินค้า
   - กรองและเรียงลำดับ
   - รีวิวและคะแนน

4. **ระบบการเงิน (Payment System)**
   - กระเป๋าเงิน (Wallet)
   - PromptPay QR Code
   - ตรวจสอบการชำระเงินอัตโนมัติ
   - ฝากเงิน (Top-up)
   - ถอนเงิน (Withdrawal)
   - ค่าธรรมเนียม (Commission)

5. **ระบบคำสั่งซื้อ (Order System)**
   - ตะกร้าสินค้า (Cart)
   - สร้างคำสั่งซื้อ
   - ชำระเงิน
   - จัดการสถานะคำสั่งซื้อ
   - ยืนยันการรับสินค้า
   - คืนเงิน/ข้อพิพาท

6. **ระบบแชท (Chat System)**
   - แชท Buyer-Seller
   - แชท Support (Admin)
   - Real-time messaging (WebSocket)
   - ส่งรูปภาพในแชท
   - ประวัติแชท

7. **ระบบพัสดุ (Shipping System)**
   - เชื่อมต่อ Flash Express
   - เชื่อมต่อ Kerry Express
   - เชื่อมต่อ J&T Express
   - เชื่อมต่อไปรษณีย์ไทย
   - ติดตามพัสดุอัตโนมัติ

---

## โครงสร้างไฟล์ทั้งหมด

### ไฟล์ที่มีอยู่แล้ว (141 ไฟล์)

```
streetmarket/
├── client/                          # Frontend (React + TypeScript)
│   ├── index.html
│   ├── public/
│   │   └── .gitkeep
│   └── src/
│       ├── main.tsx                 # Entry point
│       ├── App.tsx                  # Routes
│       ├── index.css                # Global styles
│       ├── const.ts                 # Constants
│       │
│       ├── _core/
│       │   └── hooks/
│       │       └── useAuth.ts       # Auth hook
│       │
│       ├── contexts/
│       │   └── ThemeContext.tsx     # Theme provider
│       │
│       ├── hooks/
│       │   ├── useComposition.ts
│       │   ├── useMobile.tsx
│       │   └── usePersistFn.ts
│       │
│       ├── lib/
│       │   ├── trpc.ts              # tRPC client
│       │   └── utils.ts             # Utilities
│       │
│       ├── components/
│       │   ├── ErrorBoundary.tsx
│       │   ├── DashboardLayout.tsx
│       │   ├── DashboardLayoutSkeleton.tsx
│       │   ├── ImageUploader.tsx
│       │   ├── AIChatBox.tsx
│       │   ├── ManusDialog.tsx
│       │   ├── Map.tsx
│       │   └── ui/                  # 63 shadcn/ui components
│       │       ├── accordion.tsx
│       │       ├── alert-dialog.tsx
│       │       ├── alert.tsx
│       │       ├── aspect-ratio.tsx
│       │       ├── avatar.tsx
│       │       ├── badge.tsx
│       │       ├── breadcrumb.tsx
│       │       ├── button-group.tsx
│       │       ├── button.tsx
│       │       ├── calendar.tsx
│       │       ├── card.tsx
│       │       ├── carousel.tsx
│       │       ├── chart.tsx
│       │       ├── checkbox.tsx
│       │       ├── collapsible.tsx
│       │       ├── command.tsx
│       │       ├── context-menu.tsx
│       │       ├── dialog.tsx
│       │       ├── drawer.tsx
│       │       ├── dropdown-menu.tsx
│       │       ├── empty.tsx
│       │       ├── field.tsx
│       │       ├── form.tsx
│       │       ├── hover-card.tsx
│       │       ├── input-group.tsx
│       │       ├── input-otp.tsx
│       │       ├── input.tsx
│       │       ├── item.tsx
│       │       ├── kbd.tsx
│       │       ├── label.tsx
│       │       ├── menubar.tsx
│       │       ├── navigation-menu.tsx
│       │       ├── pagination.tsx
│       │       ├── popover.tsx
│       │       ├── progress.tsx
│       │       ├── radio-group.tsx
│       │       ├── resizable.tsx
│       │       ├── scroll-area.tsx
│       │       ├── select.tsx
│       │       ├── separator.tsx
│       │       ├── sheet.tsx
│       │       ├── sidebar.tsx
│       │       ├── skeleton.tsx
│       │       ├── slider.tsx
│       │       ├── sonner.tsx
│       │       ├── spinner.tsx
│       │       ├── switch.tsx
│       │       ├── table.tsx
│       │       ├── tabs.tsx
│       │       ├── textarea.tsx
│       │       ├── toggle-group.tsx
│       │       ├── toggle.tsx
│       │       └── tooltip.tsx
│       │
│       └── pages/
│           ├── Home.tsx              # Landing page
│           ├── Products.tsx          # Products list
│           ├── ProductDetail.tsx     # Product detail
│           ├── Cart.tsx              # Shopping cart
│           ├── Checkout.tsx          # Checkout
│           ├── Profile.tsx           # User profile
│           ├── SellerDashboard.tsx   # Seller dashboard
│           ├── AdminDashboard.tsx    # Admin dashboard
│           ├── ComponentShowcase.tsx # UI showcase
│           └── NotFound.tsx          # 404 page
│
├── server/                          # Backend (Express + tRPC)
│   ├── _core/                       # Framework (อย่าแก้)
│   │   ├── context.ts
│   │   ├── cookies.ts
│   │   ├── dataApi.ts
│   │   ├── env.ts
│   │   ├── imageGeneration.ts
│   │   ├── index.ts
│   │   ├── llm.ts
│   │   ├── map.ts
│   │   ├── notification.ts
│   │   ├── oauth.ts
│   │   ├── sdk.ts
│   │   ├── systemRouter.ts
│   │   ├── trpc.ts
│   │   ├── vite.ts
│   │   ├── voiceTranscription.ts
│   │   └── types/
│   │       ├── cookie.d.ts
│   │       └── manusTypes.ts
│   │
│   ├── routers.ts                   # tRPC routers (56 endpoints)
│   ├── db.ts                        # Database functions
│   ├── image.ts                     # Image upload
│   ├── promptpay.ts                 # PromptPay QR
│   └── storage.ts                   # S3 storage
│
├── drizzle/                         # Database
│   ├── schema.ts                    # Schema (14 tables)
│   ├── relations.ts                 # Relations
│   ├── meta/                        # Migrations metadata
│   └── *.sql                        # Migration files
│
├── shared/                          # Shared code
│   ├── const.ts
│   ├── types.ts
│   └── _core/
│       └── errors.ts
│
├── patches/                         # Package patches
│   └── wouter@3.7.1.patch
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── drizzle.config.ts
├── components.json
├── .gitignore
├── .prettierignore
├── .prettierrc
├── todo.md
├── HANDOVER.md
├── PROJECT_SUMMARY.md
├── COMPLETE_INVENTORY.md
└── COMPLETE_BLUEPRINT.md (ไฟล์นี้)
```

### ไฟล์ที่ต้องสร้างเพิ่ม (28 ไฟล์)

```
streetmarket/
├── server/
│   ├── email.ts                     # Email system
│   ├── payment-verification.ts     # Payment verification
│   ├── chat-socket.ts               # WebSocket chat
│   ├── seed.ts                      # Database seeding
│   │
│   ├── shipping/
│   │   ├── index.ts                 # Unified shipping service
│   │   ├── flash.ts                 # Flash Express API
│   │   ├── kerry.ts                 # Kerry Express API
│   │   ├── jt.ts                    # J&T Express API
│   │   └── thaipost.ts              # Thailand Post API
│   │
│   └── templates/                   # Email templates
│       ├── welcome.html
│       ├── email-verification.html
│       ├── order-confirmation.html
│       ├── payment-received.html
│       ├── shipping-update.html
│       ├── seller-approved.html
│       └── seller-rejected.html
│
├── client/src/
│   ├── pages/
│   │   ├── Chat.tsx                 # Chat page
│   │   ├── Orders.tsx               # Order history
│   │   └── SellerApplication.tsx    # Seller application form
│   │
│   └── components/
│       ├── MultipleImagesUploader.tsx
│       ├── ChatList.tsx
│       ├── ChatWindow.tsx
│       ├── MessageBubble.tsx
│       ├── ChatInput.tsx
│       ├── OrderCard.tsx
│       ├── OrderStatusBadge.tsx
│       └── ShippingTracker.tsx
│
├── README.md                        # Project documentation
├── TESTING.md                       # Test checklist
└── BUGS.md                          # Bug tracking
```

---

## Database Schema ละเอียด

### 1. users (ผู้ใช้)

```typescript
{
  id: int (PK, auto_increment)
  openId: varchar(64) (unique, not null)    // Manus OAuth ID
  name: text
  email: varchar(320)
  loginMethod: varchar(64)
  role: enum('user', 'seller', 'admin')     // บทบาท
  phone: varchar(20)
  profileImage: text                         // URL รูปโปรไฟล์
  walletBalance: int (default 0)            // ยอดเงินในกระเป๋า (สตางค์)
  bankName: varchar(100)                    // ธนาคาร
  bankAccountNumber: varchar(50)            // เลขบัญชี
  bankAccountName: varchar(200)             // ชื่อบัญชี
  idCardImage: text                         // URL รูปบัตรประชาชน
  idCardNumber: varchar(20)                 // เลขบัตรประชาชน
  emailVerified: boolean (default false)
  createdAt: timestamp
  updatedAt: timestamp
  lastSignedIn: timestamp
}
```

**ความสัมพันธ์:**
- 1 user → many products (seller)
- 1 user → many orders (buyer)
- 1 user → many cartItems
- 1 user → many reviews
- 1 user → many messages
- 1 user → many transactions
- 1 user → many wishlist
- 1 user → 1 sellerApplication

### 2. categories (หมวดหมู่สินค้า)

```typescript
{
  id: int (PK, auto_increment)
  name: varchar(100) (not null)
  slug: varchar(100) (unique, not null)
  description: text
  image: text                               // URL รูปหมวดหมู่
  parentId: int (nullable)                  // FK → categories.id (hierarchical)
  order: int (default 0)                    // ลำดับการแสดงผล
  createdAt: timestamp
  updatedAt: timestamp
}
```

**ความสัมพันธ์:**
- 1 category → many categories (children)
- 1 category → many products

### 3. products (สินค้า)

```typescript
{
  id: int (PK, auto_increment)
  sellerId: int (FK → users.id, not null)
  categoryId: int (FK → categories.id, not null)
  name: varchar(200) (not null)
  slug: varchar(200) (unique, not null)
  description: text
  price: int (not null)                     // ราคา (สตางค์)
  stock: int (default 0)                    // จำนวนสต็อก
  images: json                              // Array of image URLs
  status: enum('active', 'inactive', 'out_of_stock')
  views: int (default 0)                    // จำนวนครั้งที่ดู
  sold: int (default 0)                     // จำนวนที่ขายไปแล้ว
  rating: decimal(3,2) (default 0.00)       // คะแนนเฉลี่ย (0.00-5.00)
  reviewCount: int (default 0)              // จำนวนรีวิว
  createdAt: timestamp
  updatedAt: timestamp
}
```

**ความสัมพันธ์:**
- 1 product → 1 seller (user)
- 1 product → 1 category
- 1 product → many reviews
- 1 product → many orderItems
- 1 product → many cartItems
- 1 product → many wishlist

### 4. reviews (รีวิวสินค้า)

```typescript
{
  id: int (PK, auto_increment)
  productId: int (FK → products.id, not null)
  userId: int (FK → users.id, not null)
  orderId: int (FK → orders.id, not null)   // ต้องซื้อก่อนถึงรีวิวได้
  rating: int (1-5, not null)
  comment: text
  images: json                              // Array of image URLs
  createdAt: timestamp
  updatedAt: timestamp
}
```

**ความสัมพันธ์:**
- 1 review → 1 product
- 1 review → 1 user
- 1 review → 1 order

### 5. orders (คำสั่งซื้อ)

```typescript
{
  id: int (PK, auto_increment)
  userId: int (FK → users.id, not null)
  orderNumber: varchar(50) (unique, not null) // เลขที่คำสั่งซื้อ (ORD-YYYYMMDD-XXXX)
  status: enum('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
  totalAmount: int (not null)               // ยอดรวม (สตางค์)
  shippingFee: int (default 0)              // ค่าจัดส่ง (สตางค์)
  commission: int (default 0)               // ค่าธรรมเนียม (สตางค์)
  shippingAddress: json                     // {name, phone, address, province, district, subdistrict, postalCode}
  shippingMethod: varchar(50)               // 'flash', 'kerry', 'jt', 'thaipost'
  trackingNumber: varchar(100)              // เลขพัสดุ
  notes: text                               // หมายเหตุ
  paidAt: timestamp
  shippedAt: timestamp
  deliveredAt: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

**ความสัมพันธ์:**
- 1 order → 1 user (buyer)
- 1 order → many orderItems
- 1 order → many transactions
- 1 order → many messages
- 1 order → 1 dispute (optional)

### 6. orderItems (รายการสินค้าในคำสั่งซื้อ)

```typescript
{
  id: int (PK, auto_increment)
  orderId: int (FK → orders.id, not null)
  productId: int (FK → products.id, not null)
  sellerId: int (FK → users.id, not null)
  productName: varchar(200) (not null)      // เก็บไว้เผื่อสินค้าถูกลบ
  productImage: text                        // เก็บไว้เผื่อสินค้าถูกลบ
  price: int (not null)                     // ราคาขณะซื้อ (สตางค์)
  quantity: int (not null)
  subtotal: int (not null)                  // price * quantity
  createdAt: timestamp
}
```

**ความสัมพันธ์:**
- 1 orderItem → 1 order
- 1 orderItem → 1 product
- 1 orderItem → 1 seller

### 7. transactions (ประวัติการเงิน)

```typescript
{
  id: int (PK, auto_increment)
  userId: int (FK → users.id, not null)
  type: enum('topup', 'payment', 'refund', 'withdrawal', 'commission')
  amount: int (not null)                    // จำนวนเงิน (สตางค์)
  balanceBefore: int (not null)             // ยอดเงินก่อนทำรายการ
  balanceAfter: int (not null)              // ยอดเงินหลังทำรายการ
  orderId: int (FK → orders.id, nullable)
  reference: varchar(100)                   // REF number สำหรับ PromptPay
  status: enum('pending', 'completed', 'failed')
  description: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

**ความสัมพันธ์:**
- 1 transaction → 1 user
- 1 transaction → 1 order (optional)

### 8. cartItems (ตะกร้าสินค้า)

```typescript
{
  id: int (PK, auto_increment)
  userId: int (FK → users.id, not null)
  productId: int (FK → products.id, not null)
  quantity: int (default 1, not null)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**ความสัมพันธ์:**
- 1 cartItem → 1 user
- 1 cartItem → 1 product

### 9. messages (ข้อความแชท)

```typescript
{
  id: int (PK, auto_increment)
  senderId: int (FK → users.id, not null)
  receiverId: int (FK → users.id, nullable) // null = support chat
  orderId: int (FK → orders.id, nullable)   // แชทเกี่ยวกับคำสั่งซื้อ
  message: text (not null)
  images: json                              // Array of image URLs
  isRead: boolean (default false)
  createdAt: timestamp
}
```

**ความสัมพันธ์:**
- 1 message → 1 sender (user)
- 1 message → 1 receiver (user, optional)
- 1 message → 1 order (optional)

### 10. disputes (ข้อพิพาท)

```typescript
{
  id: int (PK, auto_increment)
  orderId: int (FK → orders.id, not null, unique)
  userId: int (FK → users.id, not null)
  reason: text (not null)
  images: json                              // Array of image URLs
  status: enum('pending', 'investigating', 'resolved', 'rejected')
  adminNote: text                           // หมายเหตุจาก Admin
  resolvedBy: int (FK → users.id, nullable) // Admin ที่แก้ไข
  resolvedAt: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

**ความสัมพันธ์:**
- 1 dispute → 1 order
- 1 dispute → 1 user (buyer)
- 1 dispute → 1 admin (resolver, optional)

### 11. notifications (การแจ้งเตือน)

```typescript
{
  id: int (PK, auto_increment)
  userId: int (FK → users.id, not null)
  type: enum('order', 'payment', 'shipping', 'message', 'review', 'seller', 'admin')
  title: varchar(200) (not null)
  message: text (not null)
  link: varchar(500)                        // URL ที่จะไปเมื่อคลิก
  isRead: boolean (default false)
  createdAt: timestamp
}
```

**ความสัมพันธ์:**
- 1 notification → 1 user

### 12. wishlist (รายการโปรด)

```typescript
{
  id: int (PK, auto_increment)
  userId: int (FK → users.id, not null)
  productId: int (FK → products.id, not null)
  createdAt: timestamp
}
```

**ความสัมพันธ์:**
- 1 wishlist → 1 user
- 1 wishlist → 1 product

### 13. sellerApplications (คำขอเป็น Seller)

```typescript
{
  id: int (PK, auto_increment)
  userId: int (FK → users.id, not null, unique)
  shopName: varchar(200) (not null)
  shopDescription: text
  idCardImage: text (not null)              // URL รูปบัตรประชาชน
  status: enum('pending', 'approved', 'rejected')
  rejectionReason: text                     // เหตุผลที่ปฏิเสธ
  reviewedBy: int (FK → users.id, nullable) // Admin ที่ตรวจสอบ
  reviewedAt: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

**ความสัมพันธ์:**
- 1 sellerApplication → 1 user
- 1 sellerApplication → 1 admin (reviewer, optional)

### 14. withdrawalRequests (คำขอถอนเงิน)

```typescript
{
  id: int (PK, auto_increment)
  userId: int (FK → users.id, not null)
  amount: int (not null)                    // จำนวนเงินที่ขอถอน (สตางค์)
  bankName: varchar(100) (not null)
  bankAccountNumber: varchar(50) (not null)
  bankAccountName: varchar(200) (not null)
  status: enum('pending', 'approved', 'rejected', 'completed')
  rejectionReason: text
  approvedBy: int (FK → users.id, nullable) // Admin ที่อนุมัติ
  approvedAt: timestamp
  completedAt: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

**ความสัมพันธ์:**
- 1 withdrawalRequest → 1 user (seller)
- 1 withdrawalRequest → 1 admin (approver, optional)

---

## Backend API ทั้งหมด

### Auth (2 endpoints)

**1. auth.me**
```typescript
// Get current user
Query: publicProcedure
Input: none
Output: User | null
```

**2. auth.logout**
```typescript
// Logout
Mutation: publicProcedure
Input: none
Output: { success: boolean }
```

### User (8 endpoints)

**3. user.profile**
```typescript
// Get user profile
Query: protectedProcedure
Input: none
Output: User
```

**4. user.updateProfile**
```typescript
// Update profile
Mutation: protectedProcedure
Input: {
  name?: string
  phone?: string
  profileImage?: string
}
Output: User
```

**5. user.linkBankAccount**
```typescript
// Link bank account
Mutation: protectedProcedure
Input: {
  bankName: string
  bankAccountNumber: string
  bankAccountName: string
}
Output: User
```

**6. user.uploadIdCard**
```typescript
// Upload ID card
Mutation: protectedProcedure
Input: {
  idCardImage: string
  idCardNumber: string
}
Output: User
```

**7. user.wallet**
```typescript
// Get wallet balance
Query: protectedProcedure
Input: none
Output: {
  balance: number
  transactions: Transaction[]
}
```

**8. user.transactions**
```typescript
// Get transaction history
Query: protectedProcedure
Input: {
  limit?: number
  offset?: number
}
Output: Transaction[]
```

**9. user.verifyEmail**
```typescript
// Verify email (ต้องสร้างเพิ่ม)
Mutation: protectedProcedure
Input: {
  code: string
}
Output: { success: boolean }
```

**10. user.resendVerificationEmail**
```typescript
// Resend verification email (ต้องสร้างเพิ่ม)
Mutation: protectedProcedure
Input: none
Output: { success: boolean }
```

### Seller (5 endpoints)

**11. seller.apply**
```typescript
// Apply as seller
Mutation: protectedProcedure
Input: {
  shopName: string
  shopDescription: string
  idCardImage: string
}
Output: SellerApplication
```

**12. seller.application**
```typescript
// Get application status
Query: protectedProcedure
Input: none
Output: SellerApplication | null
```

**13. seller.dashboard**
```typescript
// Get seller dashboard stats
Query: sellerProcedure
Input: none
Output: {
  totalSales: number
  totalOrders: number
  totalProducts: number
  recentOrders: Order[]
}
```

**14. seller.stats**
```typescript
// Get detailed seller stats (ต้องสร้างเพิ่ม)
Query: sellerProcedure
Input: {
  startDate?: Date
  endDate?: Date
}
Output: {
  salesByDate: { date: string, amount: number }[]
  topProducts: { product: Product, sales: number }[]
  ordersByStatus: { status: string, count: number }[]
}
```

**15. seller.updateShop**
```typescript
// Update shop info (ต้องสร้างเพิ่ม)
Mutation: sellerProcedure
Input: {
  shopName?: string
  shopDescription?: string
  shopLogo?: string
}
Output: User
```

### Categories (5 endpoints)

**16. categories.list**
```typescript
// List all categories
Query: publicProcedure
Input: none
Output: Category[]
```

**17. categories.tree**
```typescript
// Get category tree
Query: publicProcedure
Input: none
Output: CategoryTree[]
```

**18. categories.create**
```typescript
// Create category (Admin)
Mutation: adminProcedure
Input: {
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: number
  order?: number
}
Output: Category
```

**19. categories.update**
```typescript
// Update category (Admin) (ต้องสร้างเพิ่ม)
Mutation: adminProcedure
Input: {
  id: number
  name?: string
  slug?: string
  description?: string
  image?: string
  parentId?: number
  order?: number
}
Output: Category
```

**20. categories.delete**
```typescript
// Delete category (Admin) (ต้องสร้างเพิ่ม)
Mutation: adminProcedure
Input: {
  id: number
}
Output: { success: boolean }
```

### Products (10 endpoints)

**21. products.list**
```typescript
// List products
Query: publicProcedure
Input: {
  categoryId?: number
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price' | 'rating' | 'sold' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}
Output: {
  products: Product[]
  total: number
}
```

**22. products.get**
```typescript
// Get product detail
Query: publicProcedure
Input: {
  id: number
}
Output: Product & {
  seller: User
  category: Category
  reviews: Review[]
}
```

**23. products.create**
```typescript
// Create product (Seller)
Mutation: sellerProcedure
Input: {
  name: string
  slug: string
  description: string
  price: number
  stock: number
  categoryId: number
  images: string[]
}
Output: Product
```

**24. products.update**
```typescript
// Update product (Seller)
Mutation: sellerProcedure
Input: {
  id: number
  name?: string
  slug?: string
  description?: string
  price?: number
  stock?: number
  categoryId?: number
  images?: string[]
  status?: 'active' | 'inactive'
}
Output: Product
```

**25. products.delete**
```typescript
// Delete product (Seller)
Mutation: sellerProcedure
Input: {
  id: number
}
Output: { success: boolean }
```

**26. products.reviews**
```typescript
// Get product reviews
Query: publicProcedure
Input: {
  productId: number
  limit?: number
  offset?: number
}
Output: Review[]
```

**27. products.incrementViews**
```typescript
// Increment product views (ต้องสร้างเพิ่ม)
Mutation: publicProcedure
Input: {
  id: number
}
Output: { success: boolean }
```

**28. products.search**
```typescript
// Advanced product search (ต้องสร้างเพิ่ม)
Query: publicProcedure
Input: {
  query: string
  filters: {
    categoryIds?: number[]
    minPrice?: number
    maxPrice?: number
    minRating?: number
    inStock?: boolean
  }
}
Output: Product[]
```

**29. products.related**
```typescript
// Get related products (ต้องสร้างเพิ่ม)
Query: publicProcedure
Input: {
  productId: number
  limit?: number
}
Output: Product[]
```

**30. products.trending**
```typescript
// Get trending products (ต้องสร้างเพิ่ม)
Query: publicProcedure
Input: {
  limit?: number
}
Output: Product[]
```

### Cart (5 endpoints)

**31. cart.list**
```typescript
// Get cart items
Query: protectedProcedure
Input: none
Output: CartItem[]
```

**32. cart.add**
```typescript
// Add to cart
Mutation: protectedProcedure
Input: {
  productId: number
  quantity: number
}
Output: CartItem
```

**33. cart.update**
```typescript
// Update quantity
Mutation: protectedProcedure
Input: {
  id: number
  quantity: number
}
Output: CartItem
```

**34. cart.remove**
```typescript
// Remove item
Mutation: protectedProcedure
Input: {
  id: number
}
Output: { success: boolean }
```

**35. cart.clear**
```typescript
// Clear cart
Mutation: protectedProcedure
Input: none
Output: { success: boolean }
```

### Wishlist (3 endpoints)

**36. wishlist.list**
```typescript
// Get wishlist
Query: protectedProcedure
Input: none
Output: Wishlist[]
```

**37. wishlist.add**
```typescript
// Add to wishlist
Mutation: protectedProcedure
Input: {
  productId: number
}
Output: Wishlist
```

**38. wishlist.remove**
```typescript
// Remove from wishlist
Mutation: protectedProcedure
Input: {
  productId: number
}
Output: { success: boolean }
```

### Notifications (3 endpoints)

**39. notifications.list**
```typescript
// List notifications
Query: protectedProcedure
Input: {
  limit?: number
  offset?: number
}
Output: Notification[]
```

**40. notifications.markAllAsRead**
```typescript
// Mark all as read
Mutation: protectedProcedure
Input: none
Output: { success: boolean }
```

**41. notifications.markAsRead**
```typescript
// Mark as read (ต้องสร้างเพิ่ม)
Mutation: protectedProcedure
Input: {
  id: number
}
Output: { success: boolean }
```

### Admin (10 endpoints)

**42. admin.sellerApplications**
```typescript
// List seller applications
Query: adminProcedure
Input: {
  status?: 'pending' | 'approved' | 'rejected'
}
Output: SellerApplication[]
```

**43. admin.approveSellerApplication**
```typescript
// Approve seller
Mutation: adminProcedure
Input: {
  id: number
}
Output: SellerApplication
```

**44. admin.rejectSellerApplication**
```typescript
// Reject seller
Mutation: adminProcedure
Input: {
  id: number
  reason: string
}
Output: SellerApplication
```

**45. admin.resolveDispute**
```typescript
// Resolve dispute
Mutation: adminProcedure
Input: {
  id: number
  resolution: 'refund' | 'reject'
  note: string
}
Output: Dispute
```

**46. admin.updateCommission**
```typescript
// Update commission rate
Mutation: adminProcedure
Input: {
  rate: number
}
Output: { success: boolean }
```

**47. admin.users**
```typescript
// List users (ต้องสร้างเพิ่ม)
Query: adminProcedure
Input: {
  role?: 'user' | 'seller' | 'admin'
  search?: string
  limit?: number
  offset?: number
}
Output: User[]
```

**48. admin.updateUserRole**
```typescript
// Update user role (ต้องสร้างเพิ่ม)
Mutation: adminProcedure
Input: {
  userId: number
  role: 'user' | 'seller' | 'admin'
}
Output: User
```

**49. admin.banUser**
```typescript
// Ban user (ต้องสร้างเพิ่ม)
Mutation: adminProcedure
Input: {
  userId: number
  reason: string
}
Output: { success: boolean }
```

**50. admin.dashboard**
```typescript
// Get admin dashboard stats (ต้องสร้างเพิ่ม)
Query: adminProcedure
Input: none
Output: {
  totalUsers: number
  totalSellers: number
  totalOrders: number
  totalRevenue: number
  pendingApplications: number
  pendingDisputes: number
  pendingWithdrawals: number
}
```

**51. admin.withdrawalRequests**
```typescript
// List withdrawal requests (ต้องสร้างเพิ่ม)
Query: adminProcedure
Input: {
  status?: 'pending' | 'approved' | 'rejected' | 'completed'
}
Output: WithdrawalRequest[]
```

### Payment (5 endpoints)

**52. payment.generateQR**
```typescript
// Generate PromptPay QR
Mutation: protectedProcedure
Input: {
  amount: number
}
Output: {
  qrCode: string
  reference: string
  expiresAt: Date
}
```

**53. payment.topup**
```typescript
// Top-up wallet
Mutation: protectedProcedure
Input: {
  amount: number
  reference: string
}
Output: Transaction
```

**54. payment.requestWithdrawal**
```typescript
// Request withdrawal (Seller)
Mutation: sellerProcedure
Input: {
  amount: number
}
Output: WithdrawalRequest
```

**55. payment.verifyPayment**
```typescript
// Verify payment (ต้องสร้างเพิ่ม)
Mutation: protectedProcedure
Input: {
  reference: string
}
Output: {
  verified: boolean
  amount: number
  paidAt: Date
}
```

**56. payment.webhook**
```typescript
// Payment webhook (ต้องสร้างเพิ่ม)
Mutation: publicProcedure
Input: {
  reference: string
  amount: number
  status: 'success' | 'failed'
  transactionId: string
}
Output: { success: boolean }
```

### Withdrawal (2 endpoints)

**57. withdrawal.sellerRequests**
```typescript
// List withdrawal requests (Admin)
Query: adminProcedure
Input: none
Output: WithdrawalRequest[]
```

**58. withdrawal.withdrawalHistory**
```typescript
// Get withdrawal history (Seller)
Query: sellerProcedure
Input: none
Output: WithdrawalRequest[]
```

### Orders (7 endpoints)

**59. orders.create**
```typescript
// Create order
Mutation: protectedProcedure
Input: {
  shippingAddress: {
    name: string
    phone: string
    address: string
    province: string
    district: string
    subdistrict: string
    postalCode: string
  }
  shippingMethod: 'flash' | 'kerry' | 'jt' | 'thaipost'
  notes?: string
}
Output: Order
```

**60. orders.list**
```typescript
// List orders
Query: protectedProcedure
Input: {
  role?: 'buyer' | 'seller'
  status?: string
  limit?: number
  offset?: number
}
Output: Order[]
```

**61. orders.get**
```typescript
// Get order detail
Query: protectedProcedure
Input: {
  id: number
}
Output: Order & {
  items: OrderItem[]
  buyer: User
}
```

**62. orders.updateStatus**
```typescript
// Update order status
Mutation: protectedProcedure
Input: {
  id: number
  status: string
  trackingNumber?: string
}
Output: Order
```

**63. orders.confirmDelivery**
```typescript
// Confirm delivery
Mutation: protectedProcedure
Input: {
  id: number
}
Output: Order
```

**64. orders.cancel**
```typescript
// Cancel order (ต้องสร้างเพิ่ม)
Mutation: protectedProcedure
Input: {
  id: number
  reason: string
}
Output: Order
```

**65. orders.requestRefund**
```typescript
// Request refund (ต้องสร้างเพิ่ม)
Mutation: protectedProcedure
Input: {
  id: number
  reason: string
  images?: string[]
}
Output: Dispute
```

### Reviews (4 endpoints)

**66. reviews.create**
```typescript
// Create review
Mutation: protectedProcedure
Input: {
  productId: number
  orderId: number
  rating: number
  comment: string
  images?: string[]
}
Output: Review
```

**67. reviews.get**
```typescript
// Get reviews
Query: publicProcedure
Input: {
  productId: number
  limit?: number
  offset?: number
}
Output: Review[]
```

**68. reviews.delete**
```typescript
// Delete review
Mutation: protectedProcedure
Input: {
  id: number
}
Output: { success: boolean }
```

**69. reviews.update**
```typescript
// Update review (ต้องสร้างเพิ่ม)
Mutation: protectedProcedure
Input: {
  id: number
  rating?: number
  comment?: string
  images?: string[]
}
Output: Review
```

### Chat (6 endpoints)

**70. chat.getConversations**
```typescript
// Get conversation list
Query: protectedProcedure
Input: none
Output: Conversation[]
```

**71. chat.getMessages**
```typescript
// Get messages
Query: protectedProcedure
Input: {
  receiverId?: number
  orderId?: number
  limit?: number
  offset?: number
}
Output: Message[]
```

**72. chat.send**
```typescript
// Send message
Mutation: protectedProcedure
Input: {
  receiverId?: number
  orderId?: number
  message: string
  images?: string[]
}
Output: Message
```

**73. chat.getSupportMessages**
```typescript
// Get support messages
Query: protectedProcedure
Input: none
Output: Message[]
```

**74. chat.markAsRead**
```typescript
// Mark messages as read (ต้องสร้างเพิ่ม)
Mutation: protectedProcedure
Input: {
  conversationId: number
}
Output: { success: boolean }
```

**75. chat.deleteMessage**
```typescript
// Delete message (ต้องสร้างเพิ่ม)
Mutation: protectedProcedure
Input: {
  id: number
}
Output: { success: boolean }
```

### Disputes (3 endpoints)

**76. disputes.create**
```typescript
// Create dispute
Mutation: protectedProcedure
Input: {
  orderId: number
  reason: string
  images?: string[]
}
Output: Dispute
```

**77. disputes.list**
```typescript
// List disputes
Query: protectedProcedure
Input: {
  status?: string
}
Output: Dispute[]
```

**78. disputes.get**
```typescript
// Get dispute detail (ต้องสร้างเพิ่ม)
Query: protectedProcedure
Input: {
  id: number
}
Output: Dispute & {
  order: Order
  user: User
}
```

### Image (3 endpoints)

**79. image.upload**
```typescript
// Upload single image
Mutation: protectedProcedure
Input: {
  base64: string
  filename: string
}
Output: {
  url: string
  thumbnail: string
}
```

**80. image.uploadMultiple**
```typescript
// Upload multiple images
Mutation: protectedProcedure
Input: {
  images: { base64: string, filename: string }[]
}
Output: {
  urls: string[]
  thumbnails: string[]
}
```

**81. image.delete**
```typescript
// Delete image
Mutation: protectedProcedure
Input: {
  url: string
}
Output: { success: boolean }
```

### Shipping (5 endpoints - ต้องสร้างเพิ่ม)

**82. shipping.calculateFee**
```typescript
// Calculate shipping fee
Query: publicProcedure
Input: {
  method: 'flash' | 'kerry' | 'jt' | 'thaipost'
  weight: number
  from: string // postal code
  to: string   // postal code
}
Output: {
  fee: number
  estimatedDays: number
}
```

**83. shipping.createShipment**
```typescript
// Create shipment
Mutation: sellerProcedure
Input: {
  orderId: number
  method: 'flash' | 'kerry' | 'jt' | 'thaipost'
}
Output: {
  trackingNumber: string
  label: string // PDF URL
}
```

**84. shipping.trackShipment**
```typescript
// Track shipment
Query: publicProcedure
Input: {
  trackingNumber: string
  method: 'flash' | 'kerry' | 'jt' | 'thaipost'
}
Output: {
  status: string
  location: string
  history: { date: Date, status: string, location: string }[]
}
```

**85. shipping.updateTracking**
```typescript
// Update tracking (Cron Job)
Mutation: protectedProcedure
Input: {
  orderId: number
}
Output: { success: boolean }
```

**86. shipping.webhook**
```typescript
// Shipping webhook
Mutation: publicProcedure
Input: {
  trackingNumber: string
  status: string
  location: string
}
Output: { success: boolean }
```

---

## Frontend Pages ทั้งหมด

### 1. Home.tsx (Landing Page)

**URL:** `/`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ [Logo] ค้นหา  หมวดหมู่  [Cart] [Login/Profile]     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Hero Section                                       │
│  ตลาดออนไลน์ที่ดีที่สุด ซื้อขายง่าย ปลอดภัย มั่นใจ  │
│  [เริ่มช้อปปิ้ง] [เปิดร้านค้า]                        │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Features Section                                   │
│  [ปลอดภัย 100%] [รวดเร็วทันใจ] [ชุมชนคนรุ่นใหม่]     │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  สินค้าแนะนำ                                        │
│  [Product 1] [Product 2] [Product 3] [Product 4]   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  พร้อมเริ่มต้นแล้วหรือยัง?                          │
│  [เริ่มช้อปปิ้งเลย]                                  │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Footer                                              │
│ เกี่ยวกับเรา | วิธีการซื้อ | ช่วยเหลือ | นโยบาย     │
└─────────────────────────────────────────────────────┘
```

**Components:**
- Navigation Bar
- Hero Section
- Features Section
- Product Grid (Trending Products)
- CTA Section
- Footer

**API Calls:**
- `products.trending` (แสดงสินค้ายอดนิยม)

**State:**
- None (Static page)

**Interactions:**
- คลิก "เริ่มช้อปปิ้ง" → Navigate to `/products`
- คลิก "เปิดร้านค้า" → Navigate to `/seller/apply`
- คลิก Product Card → Navigate to `/products/:id`

### 2. Products.tsx (Products List)

**URL:** `/products`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ [Logo] ค้นหา  หมวดหมู่  [Cart] [Profile]           │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Filters  │  [Grid View] [List View]                │
│          │                                          │
│ หมวดหมู่  │  เรียงตาม: [ราคา ↓]                     │
│ □ เสื้อผ้า│                                          │
│ □ อิเล็ก  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│ □ อาหาร   │  │ Prod │ │ Prod │ │ Prod │ │ Prod │  │
│          │  │   1  │ │   2  │ │   3  │ │   4  │  │
│ ราคา      │  └──────┘ └──────┘ └──────┘ └──────┘  │
│ [0-1000] │                                          │
│          │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│ คะแนน     │  │ Prod │ │ Prod │ │ Prod │ │ Prod │  │
│ ★★★★★     │  │   5  │ │   6  │ │   7  │ │   8  │  │
│          │  └──────┘ └──────┘ └──────┘ └──────┘  │
│          │                                          │
│          │  [< Prev] [1] [2] [3] [Next >]          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

**Components:**
- Navigation Bar
- Sidebar Filters
  - Category Filter (Checkbox list)
  - Price Range Slider
  - Rating Filter
- Product Grid/List
  - Product Card
    - Image
    - Name
    - Price
    - Rating
    - Sold count
    - [Add to Cart] button
    - [Wishlist] button
- Sort Dropdown
- Pagination

**API Calls:**
- `products.list` (with filters)
- `categories.list`
- `cart.add`
- `wishlist.add`

**State:**
```typescript
{
  products: Product[]
  total: number
  filters: {
    categoryId?: number
    search?: string
    minPrice?: number
    maxPrice?: number
    minRating?: number
  }
  sortBy: 'price' | 'rating' | 'sold' | 'createdAt'
  sortOrder: 'asc' | 'desc'
  page: number
  limit: number
}
```

**Interactions:**
- เลือก Category → Update filters → Fetch products
- ปรับ Price Range → Update filters → Fetch products
- เลือก Rating → Update filters → Fetch products
- เปลี่ยน Sort → Update sort → Fetch products
- คลิก Product Card → Navigate to `/products/:id`
- คลิก Add to Cart → Call `cart.add` → Show toast
- คลิก Wishlist → Call `wishlist.add` → Show toast
- คลิก Pagination → Update page → Fetch products

### 3. ProductDetail.tsx (Product Detail)

**URL:** `/products/:id`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ [Logo] ค้นหา  หมวดหมู่  [Cart] [Profile]           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  Product Name                    │
│  │              │  ★★★★★ 4.8 (120 รีวิว)            │
│  │   Product    │                                   │
│  │    Image     │  ฿1,299                           │
│  │              │                                   │
│  └──────────────┘  จำนวน: [- 1 +]                  │
│  [Img1][Img2]...   [Add to Cart] [Buy Now]         │
│                    [♡ Wishlist]                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  รายละเอียดสินค้า                                   │
│  Lorem ipsum dolor sit amet...                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ร้านค้า                                            │
│  [Logo] Shop Name                                   │
│  [Chat] [View Shop]                                │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  รีวิว (120)                                        │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ ★★★★★ User Name - 2024-01-01              │  │
│  │ สินค้าดีมาก ส่งเร็ว แนะนำเลยครับ            │  │
│  │ [Image 1] [Image 2]                        │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  [Load More Reviews]                                │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  สินค้าที่เกี่ยวข้อง                                │
│  [Product 1] [Product 2] [Product 3] [Product 4]   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Components:**
- Navigation Bar
- Product Image Gallery
  - Main Image
  - Thumbnail List
  - Zoom on hover
- Product Info
  - Name
  - Rating & Review Count
  - Price
  - Quantity Selector
  - Add to Cart Button
  - Buy Now Button
  - Wishlist Button
- Product Description
- Seller Info Card
  - Shop Logo
  - Shop Name
  - Chat Button
  - View Shop Button
- Reviews Section
  - Review List
    - Review Card
      - Rating
      - User Name
      - Date
      - Comment
      - Images
  - Load More Button
- Related Products Grid

**API Calls:**
- `products.get` (with seller, category, reviews)
- `products.related`
- `products.incrementViews`
- `cart.add`
- `wishlist.add`
- `orders.create` (Buy Now)

**State:**
```typescript
{
  product: Product & {
    seller: User
    category: Category
    reviews: Review[]
  }
  quantity: number
  selectedImage: number
  relatedProducts: Product[]
}
```

**Interactions:**
- คลิก Thumbnail → Update selectedImage
- คลิก + → Increase quantity
- คลิก - → Decrease quantity
- คลิก Add to Cart → Call `cart.add` → Show toast
- คลิก Buy Now → Call `orders.create` → Navigate to `/checkout`
- คลิก Wishlist → Call `wishlist.add` → Show toast
- คลิก Chat → Navigate to `/chat?seller=:sellerId`
- คลิก View Shop → Navigate to `/shop/:sellerId`
- คลิก Load More Reviews → Fetch more reviews
- คลิก Related Product → Navigate to `/products/:id`

### 4. Cart.tsx (Shopping Cart)

**URL:** `/cart`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ [Logo] ค้นหา  หมวดหมู่  [Cart] [Profile]           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ตะกร้าสินค้า (3 รายการ)                            │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ [Img] Product Name 1                       │  │
│  │       ฿299 x [- 1 +] = ฿299                │  │
│  │       [Remove]                              │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ [Img] Product Name 2                       │  │
│  │       ฿599 x [- 2 +] = ฿1,198              │  │
│  │       [Remove]                              │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ [Img] Product Name 3                       │  │
│  │       ฿1,299 x [- 1 +] = ฿1,299            │  │
│  │       [Remove]                              │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ สรุปคำสั่งซื้อ                              │  │
│  │                                             │  │
│  │ ยอดรวม:              ฿2,796                │  │
│  │ ค่าจัดส่ง:           ฿50                   │  │
│  │ ──────────────────────────────────────────  │  │
│  │ รวมทั้งหมด:          ฿2,846                │  │
│  │                                             │  │
│  │ [Proceed to Checkout]                      │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Components:**
- Navigation Bar
- Cart Items List
  - Cart Item Card
    - Product Image
    - Product Name
    - Price
    - Quantity Selector
    - Subtotal
    - Remove Button
- Order Summary Card
  - Subtotal
  - Shipping Fee
  - Total
  - Checkout Button

**API Calls:**
- `cart.list`
- `cart.update`
- `cart.remove`
- `cart.clear`

**State:**
```typescript
{
  cartItems: CartItem[]
  subtotal: number
  shippingFee: number
  total: number
}
```

**Interactions:**
- คลิก + → Call `cart.update` → Update quantity
- คลิก - → Call `cart.update` → Update quantity
- คลิก Remove → Call `cart.remove` → Remove item
- คลิก Proceed to Checkout → Navigate to `/checkout`

### 5. Checkout.tsx (Checkout)

**URL:** `/checkout`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ [Logo] ค้นหา  หมวดหมู่  [Cart] [Profile]           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ชำระเงิน                                           │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ 1. ที่อยู่จัดส่ง                             │  │
│  │                                             │  │
│  │ ชื่อ-นามสกุล: [_________________]          │  │
│  │ เบอร์โทร:     [_________________]          │  │
│  │ ที่อยู่:       [_________________]          │  │
│  │ จังหวัด:      [▼ เลือกจังหวัด]            │  │
│  │ เขต/อำเภอ:    [▼ เลือกเขต/อำเภอ]          │  │
│  │ แขวง/ตำบล:    [▼ เลือกแขวง/ตำบล]          │  │
│  │ รหัสไปรษณีย์:  [_________________]          │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ 2. วิธีการจัดส่ง                            │  │
│  │                                             │  │
│  │ ○ Flash Express (฿50) - 1-2 วัน            │  │
│  │ ○ Kerry Express (฿60) - 1-2 วัน            │  │
│  │ ○ J&T Express (฿45) - 2-3 วัน              │  │
│  │ ○ ไปรษณีย์ไทย (฿40) - 3-5 วัน              │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ 3. วิธีการชำระเงิน                          │  │
│  │                                             │  │
│  │ ● กระเป๋าเงิน (ยอดคงเหลือ: ฿5,000)         │  │
│  │ ○ PromptPay QR Code                        │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ สรุปคำสั่งซื้อ                              │  │
│  │                                             │  │
│  │ สินค้า (3 รายการ):    ฿2,796               │  │
│  │ ค่าจัดส่ง:            ฿50                  │  │
│  │ ──────────────────────────────────────────  │  │
│  │ รวมทั้งหมด:           ฿2,846               │  │
│  │                                             │  │
│  │ [Place Order]                               │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Components:**
- Navigation Bar
- Shipping Address Form
  - Name Input
  - Phone Input
  - Address Textarea
  - Province Select
  - District Select
  - Subdistrict Select
  - Postal Code Input
- Shipping Method Selector
  - Radio buttons for each method
  - Show fee and estimated days
- Payment Method Selector
  - Wallet (show balance)
  - PromptPay QR Code
- Order Summary Card
  - Items count
  - Subtotal
  - Shipping Fee
  - Total
  - Place Order Button

**API Calls:**
- `cart.list`
- `orders.create`
- `payment.generateQR` (if PromptPay selected)
- `shipping.calculateFee`

**State:**
```typescript
{
  shippingAddress: {
    name: string
    phone: string
    address: string
    province: string
    district: string
    subdistrict: string
    postalCode: string
  }
  shippingMethod: 'flash' | 'kerry' | 'jt' | 'thaipost'
  paymentMethod: 'wallet' | 'promptpay'
  shippingFee: number
  total: number
  qrCode?: string
  reference?: string
}
```

**Interactions:**
- เลือก Province → Load Districts
- เลือก District → Load Subdistricts
- เลือก Shipping Method → Call `shipping.calculateFee` → Update shippingFee
- เลือก Payment Method → Show/Hide QR Code
- คลิก Place Order →
  - If Wallet: Call `orders.create` → Navigate to `/orders/:id`
  - If PromptPay: Call `payment.generateQR` → Show QR Code → Wait for payment → Call `orders.create` → Navigate to `/orders/:id`

### 6. Profile.tsx (User Profile)

**URL:** `/profile`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ [Logo] ค้นหา  หมวดหมู่  [Cart] [Profile]           │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │  โปรไฟล์                                 │
│          │                                          │
│ □ โปรไฟล์ │  ┌──────────┐                           │
│ □ คำสั่งซื้อ│  │ [Upload] │                           │
│ □ กระเป๋าเงิน│  │  Image   │                           │
│ □ ที่อยู่   │  └──────────┘                           │
│ □ ตั้งค่า   │                                          │
│ □ ออกจากระบบ│  ชื่อ:         [_________________]      │
│          │  อีเมล:        [_________________]      │
│          │  เบอร์โทร:      [_________________]      │
│          │                                          │
│          │  [Save Changes]                          │
│          │                                          │
│          ├──────────────────────────────────────────┤
│          │                                          │
│          │  บัญชีธนาคาร                             │
│          │                                          │
│          │  ธนาคาร:       [▼ เลือกธนาคาร]          │
│          │  เลขบัญชี:      [_________________]      │
│          │  ชื่อบัญชี:     [_________________]      │
│          │                                          │
│          │  [Link Bank Account]                     │
│          │                                          │
│          ├──────────────────────────────────────────┤
│          │                                          │
│          │  บัตรประชาชน                             │
│          │                                          │
│          │  ┌──────────┐                           │
│          │  │ [Upload] │                           │
│          │  │ ID Card  │                           │
│          │  └──────────┘                           │
│          │                                          │
│          │  เลขบัตร:      [_________________]      │
│          │                                          │
│          │  [Upload ID Card]                        │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

**Components:**
- Navigation Bar
- Sidebar Menu
  - Profile
  - Orders
  - Wallet
  - Addresses
  - Settings
  - Logout
- Profile Section
  - Profile Image Uploader
  - Name Input
  - Email Input (readonly)
  - Phone Input
  - Save Button
- Bank Account Section
  - Bank Select
  - Account Number Input
  - Account Name Input
  - Link Button
- ID Card Section
  - ID Card Image Uploader
  - ID Card Number Input
  - Upload Button

**API Calls:**
- `user.profile`
- `user.updateProfile`
- `user.linkBankAccount`
- `user.uploadIdCard`
- `image.upload`

**State:**
```typescript
{
  user: User
  profileForm: {
    name: string
    phone: string
    profileImage: string
  }
  bankForm: {
    bankName: string
    bankAccountNumber: string
    bankAccountName: string
  }
  idCardForm: {
    idCardImage: string
    idCardNumber: string
  }
}
```

**Interactions:**
- คลิก Upload Image → Open file picker → Upload image → Update profileImage
- แก้ไข Name/Phone → Update form
- คลิก Save Changes → Call `user.updateProfile` → Show toast
- เลือก Bank → Update bankForm
- กรอก Account Number/Name → Update bankForm
- คลิก Link Bank Account → Call `user.linkBankAccount` → Show toast
- คลิก Upload ID Card → Open file picker → Upload image → Update idCardImage
- กรอก ID Card Number → Update idCardForm
- คลิก Upload ID Card → Call `user.uploadIdCard` → Show toast
- คลิก Sidebar Menu → Navigate to respective page

### 7. Orders.tsx (Order History) - ต้องสร้างเพิ่ม

**URL:** `/orders`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ [Logo] ค้นหา  หมวดหมู่  [Cart] [Profile]           │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │  คำสั่งซื้อของฉัน                        │
│          │                                          │
│ □ โปรไฟล์ │  [All] [Pending] [Paid] [Shipped] [Done]│
│ □ คำสั่งซื้อ│                                          │
│ □ กระเป๋าเงิน│  ┌─────────────────────────────────────┐│
│ □ ที่อยู่   │  │ Order #ORD-20240101-0001           ││
│ □ ตั้งค่า   │  │ 2024-01-01 10:00                   ││
│ □ ออกจากระบบ│  │                                     ││
│          │  │ [Img] Product Name 1 x 1       ฿299 ││
│          │  │ [Img] Product Name 2 x 2     ฿1,198 ││
│          │  │                                     ││
│          │  │ สถานะ: [Shipped]                    ││
│          │  │ รวม: ฿1,547                         ││
│          │  │                                     ││
│          │  │ [View Detail] [Track] [Contact]    ││
│          │  └─────────────────────────────────────┘│
│          │                                          │
│          │  ┌─────────────────────────────────────┐│
│          │  │ Order #ORD-20240102-0002           ││
│          │  │ 2024-01-02 15:30                   ││
│          │  │                                     ││
│          │  │ [Img] Product Name 3 x 1     ฿1,299 ││
│          │  │                                     ││
│          │  │ สถานะ: [Delivered]                  ││
│          │  │ รวม: ฿1,349                         ││
│          │  │                                     ││
│          │  │ [View Detail] [Review] [Buy Again] ││
│          │  └─────────────────────────────────────┘│
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

**Components:**
- Navigation Bar
- Sidebar Menu
- Status Filter Tabs
  - All
  - Pending
  - Paid
  - Shipped
  - Delivered
  - Cancelled
- Order List
  - Order Card
    - Order Number
    - Date
    - Product List (with images)
    - Status Badge
    - Total
    - Action Buttons
      - View Detail
      - Track (if shipped)
      - Contact Seller
      - Review (if delivered)
      - Buy Again
      - Cancel (if pending)
      - Confirm Delivery (if shipped)

**API Calls:**
- `orders.list`
- `orders.get`
- `orders.cancel`
- `orders.confirmDelivery`

**State:**
```typescript
{
  orders: Order[]
  statusFilter: 'all' | 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
}
```

**Interactions:**
- คลิก Status Tab → Update statusFilter → Fetch orders
- คลิก View Detail → Navigate to `/orders/:id`
- คลิก Track → Navigate to `/orders/:id` (scroll to tracking)
- คลิก Contact Seller → Navigate to `/chat?order=:orderId`
- คลิก Review → Navigate to `/products/:productId` (scroll to review form)
- คลิก Buy Again → Add products to cart → Navigate to `/cart`
- คลิก Cancel → Call `orders.cancel` → Show confirmation dialog → Update order
- คลิก Confirm Delivery → Call `orders.confirmDelivery` → Show confirmation dialog → Update order

### 8. SellerDashboard.tsx (Seller Dashboard)

**URL:** `/seller/dashboard`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ [Logo] ค้นหา  หมวดหมู่  [Cart] [Profile]           │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │  Seller Dashboard                        │
│          │                                          │
│ □ Dashboard│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│ □ สินค้า   │  │ยอดขาย│ │คำสั่ง│ │สินค้า│ │รีวิว │ │
│ □ คำสั่งซื้อ│  │฿12.5k│ │  45  │ │  23  │ │ 4.8★│ │
│ □ รายได้   │  └──────┘ └──────┘ └──────┘ └──────┘ │
│ □ ถอนเงิน  │                                          │
│ □ ร้านค้า   │  กราฟยอดขาย (7 วันล่าสุด)              │
│ □ ออกจากระบบ│  ┌────────────────────────────────────┐│
│          │  │ [Chart]                            ││
│          │  └────────────────────────────────────┘│
│          │                                          │
│          │  คำสั่งซื้อล่าสุด                        │
│          │  ┌────────────────────────────────────┐│
│          │  │ #001 Product A  ฿299  [Pending]   ││
│          │  │ #002 Product B  ฿599  [Paid]      ││
│          │  │ #003 Product C  ฿1,299 [Shipped]  ││
│          │  └────────────────────────────────────┘│
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

**Components:**
- Navigation Bar
- Sidebar Menu
  - Dashboard
  - Products
  - Orders
  - Revenue
  - Withdrawal
  - Shop Settings
  - Logout
- Stats Cards
  - Total Sales
  - Total Orders
  - Total Products
  - Average Rating
- Sales Chart
- Recent Orders Table

**API Calls:**
- `seller.dashboard`
- `seller.stats`
- `orders.list` (seller role)

**State:**
```typescript
{
  stats: {
    totalSales: number
    totalOrders: number
    totalProducts: number
    averageRating: number
  }
  salesChart: { date: string, amount: number }[]
  recentOrders: Order[]
}
```

**Interactions:**
- คลิก Sidebar Menu → Navigate to respective page
- คลิก Order → Navigate to `/seller/orders/:id`

### 9. AdminDashboard.tsx (Admin Dashboard)

**URL:** `/admin/dashboard`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ [Logo] ค้นหา  หมวดหมู่  [Cart] [Profile]           │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │  Admin Dashboard                         │
│          │                                          │
│ □ Dashboard│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│ □ ผู้ใช้    │  │ผู้ใช้ │ │ Seller│ │คำสั่ง│ │รายได้│ │
│ □ Seller  │  │ 1,234│ │  56  │ │  789 │ │฿125k │ │
│ □ สินค้า   │  └──────┘ └──────┘ └──────┘ └──────┘ │
│ □ คำสั่งซื้อ│                                          │
│ □ ข้อพิพาท │  ┌──────┐ ┌──────┐ ┌──────┐          │
│ □ ถอนเงิน  │  │รอตรวจ│ │ข้อพิพาท│ │รอถอน│          │
│ □ หมวดหมู่  │  │  12  │ │   3  │ │   8  │          │
│ □ ตั้งค่า   │  └──────┘ └──────┘ └──────┘          │
│ □ ออกจากระบบ│                                          │
│          │  กราฟรายได้ (30 วันล่าสุด)               │
│          │  ┌────────────────────────────────────┐│
│          │  │ [Chart]                            ││
│          │  └────────────────────────────────────┘│
│          │                                          │
│          │  กิจกรรมล่าสุด                          │
│          │  ┌────────────────────────────────────┐│
│          │  │ User A สมัครสมาชิก - 5 นาทีที่แล้ว  ││
│          │  │ Seller B ยื่นขอสิทธิ์ - 10 นาทีที่แล้ว││
│          │  │ Order #123 ถูกสร้าง - 15 นาทีที่แล้ว ││
│          │  └────────────────────────────────────┘│
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

**Components:**
- Navigation Bar
- Sidebar Menu
  - Dashboard
  - Users
  - Sellers
  - Products
  - Orders
  - Disputes
  - Withdrawals
  - Categories
  - Settings
  - Logout
- Stats Cards
  - Total Users
  - Total Sellers
  - Total Orders
  - Total Revenue
  - Pending Applications
  - Pending Disputes
  - Pending Withdrawals
- Revenue Chart
- Recent Activities List

**API Calls:**
- `admin.dashboard`
- `admin.users`
- `admin.sellerApplications`
- `disputes.list`
- `withdrawal.sellerRequests`

**State:**
```typescript
{
  stats: {
    totalUsers: number
    totalSellers: number
    totalOrders: number
    totalRevenue: number
    pendingApplications: number
    pendingDisputes: number
    pendingWithdrawals: number
  }
  revenueChart: { date: string, amount: number }[]
  recentActivities: Activity[]
}
```

**Interactions:**
- คลิก Sidebar Menu → Navigate to respective page
- คลิก Stats Card → Navigate to respective page with filter

### 10. Chat.tsx (Chat Page) - ต้องสร้างเพิ่ม

**URL:** `/chat`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ [Logo] ค้นหา  หมวดหมู่  [Cart] [Profile]           │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Conver-  │  Chat with Seller Name                   │
│ sations  │  ┌────────────────────────────────────┐ │
│          │  │                                    │ │
│ ┌──────┐ │  │ [Seller] สวัสดีครับ มีอะไรให้ช่วย│ │
│ │[Img] │ │  │                            10:00  │ │
│ │Seller│ │  │                                    │ │
│ │Name  │ │  │ [You] สินค้านี้มีสีอื่นไหมครับ    │ │
│ │Last  │ │  │                            10:01  │ │
│ │msg...│ │  │                                    │ │
│ └──────┘ │  │ [Seller] มีครับ มี 3 สี           │ │
│          │  │                            10:02  │ │
│ ┌──────┐ │  │                                    │ │
│ │[Img] │ │  │ [You] ขอดูรูปสีอื่นหน่อยครับ      │ │
│ │Seller│ │  │                            10:03  │ │
│ │Name2 │ │  │                                    │ │
│ │Last  │ │  │ [Seller] [Image]                  │ │
│ │msg...│ │  │                            10:04  │ │
│ └──────┘ │  │                                    │ │
│          │  └────────────────────────────────────┘ │
│          │                                          │
│          │  [Type a message...] [📎] [Send]        │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

**Components:**
- Navigation Bar
- Conversation List (Sidebar)
  - Conversation Card
    - Avatar
    - Name
    - Last Message
    - Unread Badge
    - Timestamp
- Chat Window
  - Chat Header
    - Avatar
    - Name
    - Online Status
  - Message List
    - Message Bubble
      - Sender Name
      - Message Text
      - Images
      - Timestamp
  - Chat Input
    - Text Input
    - Attach Button
    - Send Button

**API Calls:**
- `chat.getConversations`
- `chat.getMessages`
- `chat.send`
- `chat.markAsRead`
- `image.upload`

**WebSocket Events:**
- `message:new` - New message received
- `message:read` - Message read
- `user:online` - User online
- `user:offline` - User offline
- `typing:start` - User typing
- `typing:stop` - User stopped typing

**State:**
```typescript
{
  conversations: Conversation[]
  selectedConversation: Conversation | null
  messages: Message[]
  newMessage: string
  isTyping: boolean
  onlineUsers: number[]
}
```

**Interactions:**
- คลิก Conversation → Load messages → Update selectedConversation
- พิมพ์ข้อความ → Update newMessage → Emit `typing:start`
- หยุดพิมพ์ → Emit `typing:stop`
- คลิก Attach → Open file picker → Upload image → Add to message
- คลิก Send → Call `chat.send` → Emit `message:new` → Clear input
- รับ `message:new` → Add message to list → Play sound
- รับ `typing:start` → Show "typing..." indicator
- รับ `typing:stop` → Hide "typing..." indicator
- Scroll to bottom → Call `chat.markAsRead`

### 11. SellerApplication.tsx (Seller Application Form) - ต้องสร้างเพิ่ม

**URL:** `/seller/apply`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ [Logo] ค้นหา  หมวดหมู่  [Cart] [Profile]           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  สมัครเป็น Seller                                   │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ ข้อมูลร้านค้า                                │  │
│  │                                             │  │
│  │ ชื่อร้าน:       [_________________]         │  │
│  │ รายละเอียด:     [_________________]         │  │
│  │                 [_________________]         │  │
│  │                                             │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ ข้อมูลเจ้าของร้าน                           │  │
│  │                                             │  │
│  │ บัตรประชาชน:                                │  │
│  │ ┌──────────┐                                │  │
│  │ │ [Upload] │                                │  │
│  │ │ ID Card  │                                │  │
│  │ └──────────┘                                │  │
│  │                                             │  │
│  │ เลขบัตร:       [_________________]         │  │
│  │                                             │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ ข้อกำหนดและเงื่อนไข                         │  │
│  │                                             │  │
│  │ ☑ ฉันยอมรับข้อกำหนดและเงื่อนไข              │  │
│  │ ☑ ฉันรับทราบนโยบายการขาย                    │  │
│  │                                             │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  [Submit Application]                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Components:**
- Navigation Bar
- Shop Info Form
  - Shop Name Input
  - Shop Description Textarea
- Owner Info Form
  - ID Card Image Uploader
  - ID Card Number Input
- Terms & Conditions
  - Checkbox for Terms
  - Checkbox for Policy
- Submit Button

**API Calls:**
- `seller.apply`
- `image.upload`

**State:**
```typescript
{
  form: {
    shopName: string
    shopDescription: string
    idCardImage: string
    idCardNumber: string
  }
  acceptedTerms: boolean
  acceptedPolicy: boolean
}
```

**Interactions:**
- กรอกข้อมูล → Update form
- คลิก Upload ID Card → Open file picker → Upload image → Update idCardImage
- คลิก Checkbox → Toggle accepted
- คลิก Submit → Validate form → Call `seller.apply` → Navigate to `/seller/application-status`

---

## UI Components ทั้งหมด

### ที่มีอยู่แล้ว (70 components)

1. **shadcn/ui Components (63 components)**
   - accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb, button-group, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, empty, field, form, hover-card, input-group, input-otp, input, item, kbd, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, spinner, switch, table, tabs, textarea, toggle-group, toggle, tooltip

2. **Custom Components (7 components)**
   - ErrorBoundary.tsx
   - DashboardLayout.tsx
   - DashboardLayoutSkeleton.tsx
   - ImageUploader.tsx
   - AIChatBox.tsx
   - ManusDialog.tsx
   - Map.tsx

### ที่ต้องสร้างเพิ่ม (8 components)

1. **MultipleImagesUploader.tsx**
   - อัพโหลดหลายรูป (max 10)
   - Drag & drop
   - Preview grid
   - Remove individual image
   - Progress bar

2. **ChatList.tsx**
   - รายการ conversation
   - Search conversation
   - Filter (All, Unread)
   - Sort by latest message

3. **ChatWindow.tsx**
   - Chat header (avatar, name, status)
   - Message list
   - Auto scroll to bottom
   - Load more messages

4. **MessageBubble.tsx**
   - Sender/Receiver style
   - Text message
   - Image message
   - Timestamp
   - Read status

5. **ChatInput.tsx**
   - Text input with auto-resize
   - Attach button
   - Send button
   - Typing indicator
   - Emoji picker (optional)

6. **OrderCard.tsx**
   - Order number
   - Date
   - Product list
   - Status badge
   - Total
   - Action buttons

7. **OrderStatusBadge.tsx**
   - Color-coded status
   - Icon
   - Text

8. **ShippingTracker.tsx**
   - Timeline
   - Status list
   - Current location
   - Estimated delivery

---

## User Flows ทั้งหมด

### 1. User Registration & Login Flow

```
1. User visits website
   ↓
2. Click "Login" button
   ↓
3. Redirect to Manus OAuth
   ↓
4. User logs in with Manus account
   ↓
5. Redirect back to website with token
   ↓
6. Create user record in database
   ↓
7. Send welcome email
   ↓
8. Redirect to home page
```

**API Calls:**
- OAuth callback (automatic)
- `user.profile` (get user info)

**Email:**
- Welcome email

### 2. Email Verification Flow

```
1. User logs in for the first time
   ↓
2. System sends verification email
   ↓
3. User clicks verification link in email
   ↓
4. Redirect to website with verification code
   ↓
5. Call `user.verifyEmail` with code
   ↓
6. Update user.emailVerified = true
   ↓
7. Show success message
```

**API Calls:**
- `user.verifyEmail`

**Email:**
- Email verification email

### 3. Seller Application Flow

```
1. User clicks "เปิดร้านค้า"
   ↓
2. Navigate to `/seller/apply`
   ↓
3. Fill shop info (name, description)
   ↓
4. Upload ID card image
   ↓
5. Enter ID card number
   ↓
6. Accept terms & conditions
   ↓
7. Click "Submit Application"
   ↓
8. Call `seller.apply`
   ↓
9. Create sellerApplication record
   ↓
10. Send notification to admin
   ↓
11. Navigate to `/seller/application-status`
   ↓
12. Show "รอการอนุมัติ" message
```

**API Calls:**
- `seller.apply`
- `image.upload`

**Notifications:**
- Admin notification (new seller application)

### 4. Seller Approval Flow (Admin)

```
1. Admin logs in
   ↓
2. Navigate to `/admin/sellers`
   ↓
3. See list of pending applications
   ↓
4. Click application to view details
   ↓
5. Review shop info and ID card
   ↓
6. Decision:
   
   APPROVE:
   ├─ Click "Approve" button
   ├─ Call `admin.approveSellerApplication`
   ├─ Update user.role = 'seller'
   ├─ Update sellerApplication.status = 'approved'
   ├─ Send approval email to user
   └─ Show success message
   
   REJECT:
   ├─ Click "Reject" button
   ├─ Enter rejection reason
   ├─ Call `admin.rejectSellerApplication`
   ├─ Update sellerApplication.status = 'rejected'
   ├─ Send rejection email to user
   └─ Show success message
```

**API Calls:**
- `admin.sellerApplications`
- `admin.approveSellerApplication` or `admin.rejectSellerApplication`

**Email:**
- Seller approved email
- Seller rejected email

### 5. Product Creation Flow (Seller)

```
1. Seller logs in
   ↓
2. Navigate to `/seller/products`
   ↓
3. Click "เพิ่มสินค้า" button
   ↓
4. Fill product info:
   - Name
   - Description
   - Price
   - Stock
   - Category
   ↓
5. Upload product images (1-10 images)
   ↓
6. Click "Save" button
   ↓
7. Call `products.create`
   ↓
8. Create product record
   ↓
9. Show success message
   ↓
10. Navigate to `/seller/products`
```

**API Calls:**
- `products.create`
- `image.uploadMultiple`

### 6. Shopping Flow (Buyer)

```
1. User browses products
   ↓
2. Click product to view details
   ↓
3. Call `products.incrementViews`
   ↓
4. Select quantity
   ↓
5. Click "Add to Cart"
   ↓
6. Call `cart.add`
   ↓
7. Show success toast
   ↓
8. User continues shopping or goes to cart
   ↓
9. Navigate to `/cart`
   ↓
10. Review cart items
   ↓
11. Update quantities if needed
   ↓
12. Click "Proceed to Checkout"
   ↓
13. Navigate to `/checkout`
```

**API Calls:**
- `products.get`
- `products.incrementViews`
- `cart.add`
- `cart.list`
- `cart.update` (if quantity changed)

### 7. Checkout Flow (Buyer)

```
1. User at `/checkout`
   ↓
2. Fill shipping address
   ↓
3. Select shipping method
   ↓
4. Call `shipping.calculateFee`
   ↓
5. Update shipping fee
   ↓
6. Select payment method:
   
   WALLET:
   ├─ Check wallet balance
   ├─ If insufficient: Show error
   ├─ If sufficient: Continue
   
   PROMPTPAY:
   ├─ Call `payment.generateQR`
   ├─ Show QR code
   ├─ User scans and pays
   ├─ Wait for payment verification
   └─ Continue when paid
   
7. Click "Place Order"
   ↓
8. Call `orders.create`
   ↓
9. Create order record
   ↓
10. Create orderItems records
   ↓
11. Deduct wallet balance (if wallet)
   ↓
12. Create transaction record
   ↓
13. Clear cart
   ↓
14. Send order confirmation email
   ↓
15. Send notification to seller
   ↓
16. Navigate to `/orders/:id`
```

**API Calls:**
- `shipping.calculateFee`
- `payment.generateQR` (if PromptPay)
- `orders.create`
- `cart.clear`

**Email:**
- Order confirmation email (buyer)
- New order notification email (seller)

### 8. Payment Verification Flow (PromptPay)

```
1. User scans QR code
   ↓
2. User pays via banking app
   ↓
3. Bank sends webhook to payment gateway
   ↓
4. Payment gateway sends webhook to our server
   ↓
5. Call `payment.webhook`
   ↓
6. Verify payment with reference number
   ↓
7. If verified:
   ├─ Update transaction status = 'completed'
   ├─ Update wallet balance
   ├─ Send payment received email
   └─ Send notification to user
   ↓
8. If failed:
   ├─ Update transaction status = 'failed'
   └─ Send payment failed email
```

**API Calls:**
- `payment.webhook`
- `payment.verifyPayment`

**Email:**
- Payment received email
- Payment failed email

### 9. Order Processing Flow (Seller)

```
1. Seller receives order notification
   ↓
2. Seller logs in
   ↓
3. Navigate to `/seller/orders`
   ↓
4. Click order to view details
   ↓
5. Verify payment status
   ↓
6. Prepare product
   ↓
7. Click "Mark as Processing"
   ↓
8. Call `orders.updateStatus` (status = 'processing')
   ↓
9. Send notification to buyer
   ↓
10. Pack product
   ↓
11. Select shipping method
   ↓
12. Call `shipping.createShipment`
   ↓
13. Get tracking number
   ↓
14. Click "Mark as Shipped"
   ↓
15. Call `orders.updateStatus` (status = 'shipped', trackingNumber)
   ↓
16. Send shipping update email to buyer
   ↓
17. Send notification to buyer
```

**API Calls:**
- `orders.updateStatus`
- `shipping.createShipment`

**Email:**
- Shipping update email

**Notifications:**
- Order processing notification
- Order shipped notification

### 10. Shipping Tracking Flow

```
1. Order status = 'shipped'
   ↓
2. Cron job runs every hour
   ↓
3. For each shipped order:
   ├─ Call `shipping.trackShipment`
   ├─ Get current status
   ├─ If status changed:
   │  ├─ Call `orders.updateStatus`
   │  ├─ Send notification to buyer
   │  └─ If delivered:
   │     ├─ Update order status = 'delivered'
   │     ├─ Transfer money to seller (minus commission)
   │     ├─ Create transaction records
   │     └─ Send delivery confirmation email
   └─ Continue
```

**API Calls:**
- `shipping.trackShipment`
- `orders.updateStatus`
- `shipping.updateTracking`

**Email:**
- Delivery confirmation email

**Notifications:**
- Shipping status update notification

### 11. Order Completion Flow (Buyer)

```
1. Buyer receives product
   ↓
2. Navigate to `/orders/:id`
   ↓
3. Click "Confirm Delivery"
   ↓
4. Call `orders.confirmDelivery`
   ↓
5. Update order status = 'delivered'
   ↓
6. Transfer money to seller (minus commission)
   ↓
7. Create transaction records
   ↓
8. Show success message
   ↓
9. Show "Write Review" button
   ↓
10. Click "Write Review"
   ↓
11. Navigate to product page (scroll to review form)
   ↓
12. Fill review (rating, comment, images)
   ↓
13. Click "Submit Review"
   ↓
14. Call `reviews.create`
   ↓
15. Create review record
   ↓
16. Update product rating and reviewCount
   ↓
17. Send notification to seller
   ↓
18. Show success message
```

**API Calls:**
- `orders.confirmDelivery`
- `reviews.create`

**Notifications:**
- New review notification (seller)

### 12. Withdrawal Flow (Seller)

```
1. Seller has wallet balance
   ↓
2. Navigate to `/seller/withdrawal`
   ↓
3. Enter withdrawal amount
   ↓
4. Verify bank account is linked
   ↓
5. Click "Request Withdrawal"
   ↓
6. Call `payment.requestWithdrawal`
   ↓
7. Create withdrawalRequest record
   ↓
8. Send notification to admin
   ↓
9. Show "รอการอนุมัติ" message
   ↓
10. Admin reviews request
   ↓
11. Admin approves:
    ├─ Call `withdrawal.approve`
    ├─ Deduct wallet balance
    ├─ Create transaction record
    ├─ Update withdrawalRequest status = 'approved'
    ├─ Send approval email to seller
    └─ Process bank transfer (manual)
    ↓
12. Admin marks as completed:
    ├─ Update withdrawalRequest status = 'completed'
    └─ Send completion email to seller
```

**API Calls:**
- `payment.requestWithdrawal`
- `withdrawal.approve` (admin)
- `withdrawal.complete` (admin)

**Email:**
- Withdrawal approved email
- Withdrawal completed email

**Notifications:**
- Withdrawal request notification (admin)

### 13. Dispute Flow (Buyer)

```
1. Buyer has issue with order
   ↓
2. Navigate to `/orders/:id`
   ↓
3. Click "Report Problem"
   ↓
4. Fill dispute form:
   - Reason
   - Description
   - Images (optional)
   ↓
5. Click "Submit Dispute"
   ↓
6. Call `disputes.create`
   ↓
7. Create dispute record
   ↓
8. Send notification to admin
   ↓
9. Send notification to seller
   ↓
10. Show "รอการตรวจสอบ" message
   ↓
11. Admin reviews dispute
   ↓
12. Admin decision:
    
    REFUND:
    ├─ Call `admin.resolveDispute` (resolution = 'refund')
    ├─ Refund money to buyer
    ├─ Create transaction records
    ├─ Update dispute status = 'resolved'
    ├─ Send refund email to buyer
    └─ Send notification to seller
    
    REJECT:
    ├─ Call `admin.resolveDispute` (resolution = 'reject')
    ├─ Update dispute status = 'rejected'
    ├─ Send rejection email to buyer
    └─ Send notification to seller
```

**API Calls:**
- `disputes.create`
- `admin.resolveDispute`

**Email:**
- Dispute refund email
- Dispute rejection email

**Notifications:**
- Dispute created notification (admin, seller)
- Dispute resolved notification (buyer, seller)

### 14. Chat Flow (Buyer-Seller)

```
1. Buyer wants to ask about product
   ↓
2. Navigate to `/products/:id`
   ↓
3. Click "Chat" button
   ↓
4. Navigate to `/chat?seller=:sellerId&product=:productId`
   ↓
5. WebSocket connection established
   ↓
6. Load conversation
   ↓
7. Call `chat.getMessages`
   ↓
8. Display messages
   ↓
9. User types message
   ↓
10. Emit `typing:start` event
   ↓
11. Other user sees "typing..." indicator
   ↓
12. User stops typing
   ↓
13. Emit `typing:stop` event
   ↓
14. User clicks "Send"
   ↓
15. Call `chat.send`
   ↓
16. Create message record
   ↓
17. Emit `message:new` event
   ↓
18. Other user receives message
   ↓
19. Display message in chat window
   ↓
20. Play notification sound
   ↓
21. If other user is viewing chat:
    ├─ Call `chat.markAsRead`
    └─ Emit `message:read` event
```

**API Calls:**
- `chat.getConversations`
- `chat.getMessages`
- `chat.send`
- `chat.markAsRead`

**WebSocket Events:**
- `typing:start`
- `typing:stop`
- `message:new`
- `message:read`

### 15. Admin User Management Flow

```
1. Admin logs in
   ↓
2. Navigate to `/admin/users`
   ↓
3. See list of users
   ↓
4. Search/Filter users
   ↓
5. Click user to view details
   ↓
6. Actions:
   
   CHANGE ROLE:
   ├─ Select new role (user/seller/admin)
   ├─ Click "Update Role"
   ├─ Call `admin.updateUserRole`
   ├─ Update user.role
   └─ Show success message
   
   BAN USER:
   ├─ Click "Ban User"
   ├─ Enter ban reason
   ├─ Call `admin.banUser`
   ├─ Update user.status = 'banned'
   ├─ Send ban email to user
   └─ Show success message
```

**API Calls:**
- `admin.users`
- `admin.updateUserRole`
- `admin.banUser`

**Email:**
- User banned email

---

## Workflow การสร้าง

### Phase 1: Critical Infrastructure (2-3 hours)

#### 1.1 Email Notification System

**Step 1: Install Dependencies**
```bash
cd /home/ubuntu/streetmarket
pnpm add nodemailer
pnpm add -D @types/nodemailer
```

**Step 2: Create Email Service**
```typescript
// server/email.ts
import nodemailer from 'nodemailer';
import { ENV } from './_core/env';

// Create transporter (use Gmail, SendGrid, or AWS SES)
const transporter = nodemailer.createTransporter({
  host: ENV.SMTP_HOST,
  port: ENV.SMTP_PORT,
  secure: true,
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
});

// Email templates
export async function sendWelcomeEmail(to: string, name: string) {
  const html = `...`; // Read from server/templates/welcome.html
  await transporter.sendMail({
    from: ENV.SMTP_FROM,
    to,
    subject: 'ยินดีต้อนรับสู่ StreetMarket',
    html,
  });
}

export async function sendEmailVerification(to: string, code: string) {
  const html = `...`; // Read from server/templates/email-verification.html
  await transporter.sendMail({
    from: ENV.SMTP_FROM,
    to,
    subject: 'ยืนยันอีเมลของคุณ',
    html,
  });
}

// ... 5 more email functions
```

**Step 3: Create Email Templates**
```html
<!-- server/templates/welcome.html -->
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Dark theme styles */
  </style>
</head>
<body>
  <h1>ยินดีต้อนรับสู่ StreetMarket!</h1>
  <p>สวัสดี {{name}},</p>
  <p>ขอบคุณที่สมัครสมาชิกกับเรา</p>
  <a href="{{link}}">เริ่มช้อปปิ้งเลย</a>
</body>
</html>
```

**Step 4: Integrate Email Sending**
```typescript
// server/routers.ts
import * as email from './email';

// In user.updateProfile mutation:
if (newUser && !existingUser) {
  await email.sendWelcomeEmail(user.email, user.name);
}

// In seller.apply mutation:
await email.sendSellerApplicationEmail(user.email, user.name);

// ... integrate in all relevant places
```

**Step 5: Add Environment Variables**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="StreetMarket <noreply@streetmarket.com>"
```

**Step 6: Test Email Sending**
```bash
# Create test script
cat > server/test-email.mjs << 'EOF'
import { sendWelcomeEmail } from './email.ts';
await sendWelcomeEmail('test@example.com', 'Test User');
console.log('Email sent!');
EOF

node server/test-email.mjs
```

#### 1.2 Payment Verification System

**Step 1: Choose Payment Gateway**
- Option 1: Omise (Thai payment gateway)
- Option 2: SCB Easy App (Direct bank integration)
- Option 3: 2C2P (Thai payment gateway)

**Step 2: Install SDK**
```bash
pnpm add omise
pnpm add -D @types/omise
```

**Step 3: Create Payment Verification Service**
```typescript
// server/payment-verification.ts
import Omise from 'omise';
import { ENV } from './_core/env';

const omise = Omise({
  publicKey: ENV.OMISE_PUBLIC_KEY,
  secretKey: ENV.OMISE_SECRET_KEY,
});

export async function verifyPromptPayPayment(reference: string) {
  // Query Omise API for payment status
  const charge = await omise.charges.retrieve(reference);
  
  return {
    verified: charge.status === 'successful',
    amount: charge.amount / 100, // Convert from satang to baht
    paidAt: new Date(charge.paid_at),
  };
}

export async function createPromptPayCharge(amount: number, reference: string) {
  const charge = await omise.charges.create({
    amount: amount * 100, // Convert to satang
    currency: 'THB',
    source: {
      type: 'promptpay',
    },
    metadata: {
      reference,
    },
  });
  
  return {
    chargeId: charge.id,
    qrCode: charge.source.scannable_code.image.download_uri,
  };
}
```

**Step 4: Create Webhook Endpoint**
```typescript
// server/routers.ts
payment: router({
  webhook: publicProcedure
    .input(z.object({
      event: z.string(),
      data: z.any(),
    }))
    .mutation(async ({ input }) => {
      if (input.event === 'charge.complete') {
        const reference = input.data.metadata.reference;
        const amount = input.data.amount / 100;
        
        // Find transaction by reference
        const transaction = await db.getTransactionByReference(reference);
        
        if (transaction) {
          // Update transaction status
          await db.updateTransaction(transaction.id, {
            status: 'completed',
          });
          
          // Update wallet balance
          await db.updateWalletBalance(transaction.userId, amount);
          
          // Send email
          await email.sendPaymentReceivedEmail(transaction.user.email, amount);
          
          // Send notification
          await db.createNotification({
            userId: transaction.userId,
            type: 'payment',
            title: 'ชำระเงินสำเร็จ',
            message: `คุณได้รับเงิน ฿${amount} เข้ากระเป๋าเงินแล้ว`,
          });
        }
      }
      
      return { success: true };
    }),
}),
```

**Step 5: Update Payment Flow**
```typescript
// server/routers.ts
payment: router({
  generateQR: protectedProcedure
    .input(z.object({
      amount: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const reference = generateReference(); // ORD-YYYYMMDD-XXXX
      
      // Create charge via Omise
      const { chargeId, qrCode } = await createPromptPayCharge(
        input.amount,
        reference
      );
      
      // Create pending transaction
      await db.createTransaction({
        userId: ctx.user.id,
        type: 'topup',
        amount: input.amount,
        reference,
        status: 'pending',
      });
      
      return {
        qrCode,
        reference,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      };
    }),
}),
```

**Step 6: Add Environment Variables**
```
OMISE_PUBLIC_KEY=pkey_test_xxxxx
OMISE_SECRET_KEY=skey_test_xxxxx
OMISE_WEBHOOK_SECRET=whsec_xxxxx
```

**Step 7: Test Payment Flow**
```bash
# Use Omise test mode
# Test QR code generation
# Test webhook receiving
```

#### 1.3 Security Implementation

**Step 1: Install Dependencies**
```bash
pnpm add express-rate-limit
pnpm add helmet
pnpm add cors
pnpm add express-validator
```

**Step 2: Add Rate Limiting**
```typescript
// server/_core/index.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
});

app.use('/api/oauth/', authLimiter);
```

**Step 3: Add Helmet (Security Headers)**
```typescript
// server/_core/index.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

**Step 4: Add CORS**
```typescript
// server/_core/index.ts
import cors from 'cors';

app.use(cors({
  origin: ENV.FRONTEND_URL,
  credentials: true,
}));
```

**Step 5: Add Input Validation**
```typescript
// server/routers.ts
import { z } from 'zod';

// Example: Validate email
const emailSchema = z.string().email();

// Example: Validate phone
const phoneSchema = z.string().regex(/^[0-9]{10}$/);

// Example: Validate price
const priceSchema = z.number().positive().int();

// Use in procedures
user: router({
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100).optional(),
      phone: phoneSchema.optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // ...
    }),
}),
```

**Step 6: Add SQL Injection Protection**
```typescript
// Already protected by Drizzle ORM
// But add extra validation for raw queries

// BAD:
// const query = `SELECT * FROM users WHERE id = ${userId}`;

// GOOD:
// const user = await db.select().from(users).where(eq(users.id, userId));
```

**Step 7: Add XSS Protection**
```typescript
// Install DOMPurify for client-side
pnpm add dompurify
pnpm add -D @types/dompurify

// client/src/lib/sanitize.ts
import DOMPurify from 'dompurify';

export function sanitizeHTML(html: string) {
  return DOMPurify.sanitize(html);
}

// Use in components
<div dangerouslySetInnerHTML={{ __html: sanitizeHTML(product.description) }} />
```

### Phase 2: User Experience (3-4 hours)

#### 2.1 Real-time Chat System

**Step 1: Install Socket.IO**
```bash
pnpm add socket.io
pnpm add socket.io-client
pnpm add -D @types/socket.io
```

**Step 2: Create WebSocket Server**
```typescript
// server/chat-socket.ts
import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';

export function initChatSocket(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });
  
  // Authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    // Verify token and attach user to socket
    const user = await verifyToken(token);
    if (user) {
      socket.data.user = user;
      next();
    } else {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket) => {
    const user = socket.data.user;
    console.log(`User ${user.id} connected`);
    
    // Join user's room
    socket.join(`user:${user.id}`);
    
    // Handle typing events
    socket.on('typing:start', ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit('typing:start', {
        userId: user.id,
        userName: user.name,
      });
    });
    
    socket.on('typing:stop', ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit('typing:stop', {
        userId: user.id,
      });
    });
    
    // Handle new message
    socket.on('message:send', async ({ receiverId, message, images }) => {
      // Save message to database
      const newMessage = await db.createMessage({
        senderId: user.id,
        receiverId,
        message,
        images,
      });
      
      // Emit to receiver
      io.to(`user:${receiverId}`).emit('message:new', newMessage);
      
      // Emit back to sender (for confirmation)
      socket.emit('message:sent', newMessage);
    });
    
    // Handle message read
    socket.on('message:read', async ({ conversationId }) => {
      await db.markMessagesAsRead(user.id, conversationId);
      
      // Emit to sender
      io.to(`user:${conversationId}`).emit('messages:read', {
        userId: user.id,
      });
    });
    
    socket.on('disconnect', () => {
      console.log(`User ${user.id} disconnected`);
    });
  });
  
  return io;
}
```

**Step 3: Integrate WebSocket with Express**
```typescript
// server/_core/index.ts
import { createServer } from 'http';
import { initChatSocket } from '../chat-socket';

const httpServer = createServer(app);
const io = initChatSocket(httpServer);

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Step 4: Create Chat Components**

**ChatList.tsx**
```typescript
// client/src/components/ChatList.tsx
import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export function ChatList({ onSelectConversation }) {
  const { data: conversations } = trpc.chat.getConversations.useQuery();
  const [search, setSearch] = useState('');
  
  const filtered = conversations?.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Input
          placeholder="ค้นหา..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />


---

# PART 2: UI COMPONENTS BLUEPRINT

## 2.1 Design System

### Color Palette (Dark Theme)
```css
/* Primary Colors */
--primary-red: #FF3B3B        /* ปุ่มหลัก, CTA, ราคา */
--primary-green: #4ADE80      /* สถานะสำเร็จ, ยอดขาย */
--primary-orange: #FB923C     /* Badges, Highlights */

/* Background */
--bg-dark: #0A0A0A           /* พื้นหลังหลัก */
--bg-card: #1A1A1A           /* Card background */
--bg-hover: #2A2A2A          /* Hover state */

/* Text */
--text-primary: #FFFFFF       /* ข้อความหลัก */
--text-secondary: #A0A0A0     /* ข้อความรอง */
--text-muted: #666666         /* ข้อความเบาบาง */

/* Effects */
--neon-glow: 0 0 20px rgba(255,59,59,0.5)
--glass-blur: backdrop-filter: blur(10px)
```

### Typography
```css
/* Headings */
font-family: 'Bebas Neue', sans-serif
H1: 48px, bold, letter-spacing: 2px
H2: 36px, bold, letter-spacing: 1.5px
H3: 24px, bold, letter-spacing: 1px

/* Body */
font-family: 'Inter', sans-serif
Body: 16px, regular, line-height: 1.6
Small: 14px, regular
Tiny: 12px, regular
```

### Spacing System
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

---

## 2.2 Shared Components (client/src/components/)

### 2.2.1 Navigation Components

#### **Navbar.tsx**
```typescript
interface NavbarProps {
  user?: User | null
  cartCount: number
  onSearch: (query: string) => void
}

Features:
- Logo (ซ้าย)
- Search Bar (กลาง)
- Cart Icon + Badge (ขวา)
- User Menu Dropdown (ขวาสุด)
- Mobile Hamburger Menu
- Sticky on scroll

States:
- isScrolled: boolean
- isMobileMenuOpen: boolean
- searchQuery: string
```

#### **Sidebar.tsx** (สำหรับ Dashboard)
```typescript
interface SidebarProps {
  role: 'seller' | 'admin'
  activePage: string
}

Menu Items (Seller):
- Dashboard
- Products
- Orders
- Analytics
- Wallet
- Settings

Menu Items (Admin):
- Dashboard
- Users
- Sellers (Pending Approval)
- Products
- Orders
- Disputes
- Settings
```

#### **Footer.tsx**
```typescript
Sections:
- About Us
- Customer Service
- Seller Center
- Follow Us (Social Links)
- Payment Methods Icons
- Copyright

Links:
- Terms of Service
- Privacy Policy
- Return Policy
- Contact Us
```

---

### 2.2.2 Product Components

#### **ProductCard.tsx**
```typescript
interface ProductCardProps {
  product: Product
  onAddToCart: (id: number) => void
  onAddToWishlist: (id: number) => void
}

Layout:
┌─────────────────┐
│   Product Image │ (hover: show quick view)
├─────────────────┤
│ Product Name    │
│ ⭐⭐⭐⭐⭐ (4.5) │
│ ฿999  ฿1,299    │ (price, original price)
│ [Add to Cart]   │
│ ♥ Wishlist      │
└─────────────────┘

Interactions:
- Click card → Product Detail
- Click Add to Cart → Add to cart + toast
- Click Wishlist → Toggle wishlist + animation
- Hover → Show quick actions
```

#### **ProductGrid.tsx**
```typescript
interface ProductGridProps {
  products: Product[]
  loading: boolean
  onLoadMore: () => void
}

Features:
- Responsive grid (1-4 columns)
- Skeleton loading
- Infinite scroll
- Empty state
```

#### **ProductFilter.tsx**
```typescript
interface ProductFilterProps {
  categories: Category[]
  priceRange: [number, number]
  onFilterChange: (filters: Filters) => void
}

Filters:
- Category (checkbox tree)
- Price Range (slider)
- Rating (stars)
- Condition (new/used)
- Shipping (free shipping)
- Sort by (price, rating, newest)

Mobile: Drawer from bottom
Desktop: Sidebar left
```

---

### 2.2.3 Cart Components

#### **CartItem.tsx**
```typescript
interface CartItemProps {
  item: CartItem
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => void
}

Layout:
┌──────────────────────────────────┐
│ [Image] Product Name             │
│         ฿999 x 2 = ฿1,998        │
│         [- 2 +] [Remove]         │
└──────────────────────────────────┘

Interactions:
- Click +/- → Update quantity
- Click Remove → Confirm dialog → Remove
- Click image/name → Product detail
```

#### **CartSummary.tsx**
```typescript
interface CartSummaryProps {
  subtotal: number
  shipping: number
  total: number
  onCheckout: () => void
}

Layout:
┌─────────────────────┐
│ Subtotal:  ฿1,998   │
│ Shipping:  ฿50      │
│ ─────────────────   │
│ Total:     ฿2,048   │
│                     │
│ [Proceed to Checkout] │
└─────────────────────┘
```

---

### 2.2.4 Order Components

#### **OrderCard.tsx**
```typescript
interface OrderCardProps {
  order: Order
  onViewDetail: (id: number) => void
  onTrackShipping: (trackingNumber: string) => void
}

Layout:
┌──────────────────────────────────────┐
│ Order #12345  |  2024-01-15         │
│ Status: [Shipped] 🚚                │
│ ────────────────────────────────────│
│ [Product Image] Product Name x2      │
│ [Product Image] Product Name x1      │
│ ────────────────────────────────────│
│ Total: ฿2,048                        │
│ [Track Order] [View Detail]          │
└──────────────────────────────────────┘

Status Colors:
- Pending: yellow
- Paid: blue
- Shipped: purple
- Delivered: green
- Cancelled: red
```

#### **OrderTimeline.tsx**
```typescript
interface OrderTimelineProps {
  events: OrderEvent[]
}

Layout (Vertical):
● Order Placed        2024-01-15 10:00
│
● Payment Confirmed   2024-01-15 10:05
│
● Shipped             2024-01-16 14:30
│
○ Delivered           (Pending)
```

---

### 2.2.5 Form Components

#### **ImageUploader.tsx** ✅ (มีแล้ว)
```typescript
interface ImageUploaderProps {
  onUpload: (url: string) => void
  maxSize?: number
  accept?: string[]
}

Features:
- Drag & drop zone
- Click to upload
- Image preview
- Progress bar
- Validation errors
- Remove button
```

#### **MultipleImagesUploader.tsx** ✅ (มีแล้ว)
```typescript
interface MultipleImagesUploaderProps {
  onUpload: (urls: string[]) => void
  maxFiles?: number
  maxSize?: number
}

Features:
- Multiple file selection
- Drag & drop
- Preview grid
- Reorder images (drag)
- Remove individual
- Upload progress per file
```

#### **AddressForm.tsx**
```typescript
interface AddressFormProps {
  initialValue?: Address
  onSubmit: (address: Address) => void
}

Fields:
- Full Name *
- Phone Number *
- Address Line 1 *
- Address Line 2
- Province * (dropdown)
- District * (dropdown, filtered by province)
- Subdistrict * (dropdown, filtered by district)
- Postal Code * (auto-fill)
- Set as Default (checkbox)

Validation:
- Phone: 10 digits
- Postal Code: 5 digits
- All required fields
```

#### **BankAccountForm.tsx**
```typescript
interface BankAccountFormProps {
  onSubmit: (account: BankAccount) => void
}

Fields:
- Bank Name * (dropdown with logo)
- Account Number * (10-12 digits)
- Account Name * (auto-verify with bank API)
- Branch (optional)

Validation:
- Account number format
- Name verification
```

---

### 2.2.6 Chat Components (ต้องสร้าง)

#### **ChatList.tsx**
```typescript
interface ChatListProps {
  conversations: Conversation[]
  onSelectChat: (id: number) => void
}

Layout:
┌─────────────────────────────┐
│ 🔍 Search conversations     │
├─────────────────────────────┤
│ [Avatar] Seller Name        │
│          Last message...    │
│          2 min ago  ●       │ (unread badge)
├─────────────────────────────┤
│ [Avatar] Buyer Name         │
│          Last message...    │
│          1 hour ago         │
└─────────────────────────────┘

Features:
- Real-time updates
- Unread count
- Search filter
- Sort by recent
```

#### **ChatWindow.tsx**
```typescript
interface ChatWindowProps {
  conversationId: number
  messages: Message[]
  onSendMessage: (content: string, type: 'text' | 'image') => void
}

Layout:
┌─────────────────────────────┐
│ ← Seller Name          ...  │ (header)
├─────────────────────────────┤
│                             │
│  [Their message]            │
│              [My message]   │
│  [Their message]            │
│              [My message]   │
│                             │
├─────────────────────────────┤
│ 📎 [Type message...] [Send] │ (input)
└─────────────────────────────┘

Features:
- Auto-scroll to bottom
- Typing indicator
- Image preview
- Message timestamps
- Read receipts
```

#### **MessageBubble.tsx**
```typescript
interface MessageBubbleProps {
  message: Message
  isMine: boolean
}

Layout (Mine):
              ┌─────────────┐
              │ Message text│
              │ 10:30 AM ✓✓│
              └─────────────┘

Layout (Theirs):
┌─────────────┐
│ Message text│
│ 10:30 AM    │
└─────────────┘

Types:
- Text message
- Image message (with lightbox)
- System message (centered, gray)
```

---

### 2.2.7 Modal Components

#### **ConfirmDialog.tsx**
```typescript
interface ConfirmDialogProps {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel: () => void
}

Usage:
- Delete product
- Cancel order
- Remove from cart
- Logout
```

#### **ProductQuickView.tsx**
```typescript
interface ProductQuickViewProps {
  productId: number
  onClose: () => void
  onAddToCart: () => void
}

Layout:
┌──────────────────────────────┐
│ [Images] │ Product Name      │
│ Gallery  │ ⭐⭐⭐⭐⭐ (4.5)  │
│          │ ฿999  ฿1,299      │
│          │ Description...    │
│          │ [Add to Cart]     │
│          │ [View Full Detail]│
└──────────────────────────────┘
```

#### **ReviewModal.tsx**
```typescript
interface ReviewModalProps {
  productId: number
  orderId: number
  onSubmit: (review: Review) => void
}

Fields:
- Rating (1-5 stars) *
- Title
- Comment *
- Images (up to 5)
- Anonymous (checkbox)
```

---

### 2.2.8 Dashboard Components

#### **StatsCard.tsx**
```typescript
interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  color?: string
}

Layout:
┌─────────────────────┐
│ 📦 Total Orders     │
│ 1,234               │
│ ↑ 12% from last month│
└─────────────────────┘

Variants:
- Total Sales (฿)
- Total Orders (#)
- Total Products (#)
- Pending Orders (#)
```

#### **SalesChart.tsx**
```typescript
interface SalesChartProps {
  data: SalesData[]
  period: 'day' | 'week' | 'month' | 'year'
}

Chart Types:
- Line chart (sales over time)
- Bar chart (orders per day)
- Pie chart (category distribution)

Library: Recharts
```

#### **RecentOrders.tsx**
```typescript
interface RecentOrdersProps {
  orders: Order[]
  onViewAll: () => void
}

Table Columns:
- Order ID
- Customer
- Products
- Total
- Status
- Date
- Actions (View, Update Status)
```

---

### 2.2.9 Notification Components

#### **NotificationBell.tsx**
```typescript
interface NotificationBellProps {
  count: number
  notifications: Notification[]
  onMarkAsRead: (id: number) => void
  onMarkAllAsRead: () => void
}

Dropdown:
┌─────────────────────────────┐
│ Notifications (5)  Mark all │
├─────────────────────────────┤
│ ● New order #12345          │
│   2 min ago                 │
├─────────────────────────────┤
│ ● Payment received          │
│   10 min ago                │
├─────────────────────────────┤
│ [View All]                  │
└─────────────────────────────┘
```

#### **Toast.tsx** (ใช้ sonner)
```typescript
Types:
- Success (green)
- Error (red)
- Warning (yellow)
- Info (blue)

Position: top-right
Duration: 3000ms
Dismissible: true
```

---

## 2.3 Page Layouts

### 2.3.1 Public Pages

#### **Home.tsx** ✅ (มีแล้ว)
```
Sections:
1. Hero Section
   - Main heading
   - Subheading
   - CTA buttons (Shop Now, Become Seller)
   - Background gradient

2. Featured Categories
   - Category cards (6-8)
   - Icon + Name
   - Product count

3. Featured Products
   - Product grid (8-12 products)
   - "View All" button

4. How It Works
   - 3-4 steps
   - Icon + Title + Description

5. Stats Section
   - Total Products
   - Active Sellers
   - Happy Customers

6. CTA Section
   - "Start Selling Today"
   - Button → Seller Application

7. Footer
```

#### **Products.tsx** ✅ (มีแล้ว)
```
Layout:
┌────────────────────────────────┐
│ Navbar                         │
├──────┬─────────────────────────┤
│Filter│ [Search Results]        │
│      │ ┌───┐ ┌───┐ ┌───┐ ┌───┐│
│Cat 1 │ │ P │ │ P │ │ P │ │ P ││
│Cat 2 │ └───┘ └───┘ └───┘ └───┘│
│      │ ┌───┐ ┌───┐ ┌───┐ ┌───┐│
│Price │ │ P │ │ P │ │ P │ │ P ││
│[====]│ └───┘ └───┘ └───┘ └───┘│
│      │ [Load More]             │
└──────┴─────────────────────────┘

Features:
- Filter sidebar (collapsible on mobile)
- Sort dropdown
- Grid/List view toggle
- Pagination or infinite scroll
```

#### **ProductDetail.tsx** ✅ (มีแล้ว)
```
Layout:
┌──────────────────────────────────┐
│ Navbar                           │
├──────────────────────────────────┤
│ ┌────────┐  Product Name         │
│ │        │  ⭐⭐⭐⭐⭐ (4.5 / 123)│
│ │ Image  │  ฿999  ฿1,299 (23% off)│
│ │ Gallery│                       │
│ └────────┘  Quantity: [- 1 +]    │
│ [Thumb]     [Add to Cart]        │
│ [Thumb]     [Buy Now]            │
│ [Thumb]     ♥ Add to Wishlist    │
├──────────────────────────────────┤
│ Description                      │
│ Lorem ipsum...                   │
├──────────────────────────────────┤
│ Seller Information               │
│ [Avatar] Seller Name             │
│ ⭐ 4.8 (500 reviews)             │
│ [Chat] [View Shop]               │
├──────────────────────────────────┤
│ Reviews (123)                    │
│ ⭐⭐⭐⭐⭐ User1: Great product!  │
│ ⭐⭐⭐⭐☆ User2: Good quality    │
│ [Load More Reviews]              │
├──────────────────────────────────┤
│ Related Products                 │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐        │
│ │ P │ │ P │ │ P │ │ P │        │
│ └───┘ └───┘ └───┘ └───┘        │
└──────────────────────────────────┘

Interactions:
- Click thumbnail → Change main image
- Click main image → Lightbox gallery
- +/- quantity → Update quantity
- Add to Cart → Add + Toast + Update cart count
- Buy Now → Add to cart + Redirect to checkout
- Chat → Open chat with seller
```

#### **Cart.tsx** ✅ (มีแล้ว)
```
Layout:
┌──────────────────────────────────┐
│ Navbar                           │
├──────────────────────────────────┤
│ Shopping Cart (3 items)          │
├──────────────────────┬───────────┤
│ [✓] Select All       │ Summary   │
│ ──────────────────── │           │
│ [✓] [Img] Product 1  │ Subtotal: │
│     ฿999 x 2         │ ฿1,998    │
│     [- 2 +] [Remove] │           │
│ ──────────────────── │ Shipping: │
│ [✓] [Img] Product 2  │ ฿50       │
│     ฿50 x 1          │           │
│     [- 1 +] [Remove] │ Total:    │
│                      │ ฿2,048    │
│                      │           │
│                      │ [Checkout]│
└──────────────────────┴───────────┘

Features:
- Select individual items
- Select all checkbox
- Update quantity
- Remove items
- Apply coupon code
- Checkout selected items
```

#### **Checkout.tsx** ✅ (มีแล้ว)
```
Layout:
┌──────────────────────────────────┐
│ Navbar                           │
├──────────────────────────────────┤
│ Checkout                         │
├──────────────────────┬───────────┤
│ 1. Shipping Address  │ Summary   │
│ [Select Address]     │           │
│ [+ Add New]          │ Items (3) │
│                      │ Product 1 │
│ 2. Shipping Method   │ Product 2 │
│ ○ Standard (฿50)     │           │
│ ○ Express (฿100)     │ Subtotal: │
│                      │ ฿1,998    │
│ 3. Payment Method    │           │
│ ● Wallet (฿5,000)    │ Shipping: │
│ ○ PromptPay QR       │ ฿50       │
│                      │           │
│ [Place Order]        │ Total:    │
│                      │ ฿2,048    │
└──────────────────────┴───────────┘

Flow:
1. Select/Add shipping address
2. Select shipping method
3. Select payment method
4. Review order
5. Place order
6. If PromptPay → Show QR code
7. Wait for payment confirmation
8. Redirect to order success page
```

---

### 2.3.2 User Pages

#### **Profile.tsx** ✅ (มีแล้ว)
```
Tabs:
1. Account Information
   - Avatar upload
   - Name, Email (read-only)
   - Phone
   - [Save Changes]

2. Addresses
   - List of addresses
   - [+ Add New Address]
   - Edit/Delete buttons

3. Bank Accounts
   - List of bank accounts
   - [+ Add Bank Account]
   - Verify status
   - Delete button

4. Security
   - Change Password
   - Two-Factor Authentication
   - Login History

5. Wallet
   - Balance: ฿5,000
   - [Top Up]
   - Transaction History
```

#### **Orders.tsx** (ต้องสร้าง)
```
Tabs:
- All
- Pending Payment
- To Ship
- Shipped
- Completed
- Cancelled

List:
┌──────────────────────────────────┐
│ Order #12345  |  2024-01-15      │
│ Status: [Shipped] 🚚             │
│ ────────────────────────────────│
│ [Img] Product Name x2            │
│ [Img] Product Name x1            │
│ ────────────────────────────────│
│ Total: ฿2,048                    │
│ [Track] [Review] [Buy Again]     │
└──────────────────────────────────┘

Actions:
- Track Order → Tracking page
- Review → Review modal
- Buy Again → Add to cart
- Cancel Order (if pending)
- Request Refund (if delivered < 7 days)
```

#### **OrderDetail.tsx** (ต้องสร้าง)
```
Sections:
1. Order Header
   - Order #12345
   - Date: 2024-01-15
   - Status: Shipped

2. Timeline
   - Order Placed
   - Payment Confirmed
   - Shipped
   - Delivered

3. Shipping Information
   - Tracking Number
   - Carrier
   - Estimated Delivery

4. Shipping Address
   - Name
   - Phone
   - Address

5. Products
   - List of products
   - Quantity, Price

6. Payment Summary
   - Subtotal
   - Shipping
   - Total

7. Actions
   - [Contact Seller]
   - [Request Refund] (if eligible)
   - [Leave Review] (if delivered)
```

#### **Wishlist.tsx** (ต้องสร้าง)
```
Layout:
┌──────────────────────────────────┐
│ My Wishlist (12 items)           │
├──────────────────────────────────┤
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐        │
│ │ P │ │ P │ │ P │ │ P │        │
│ │ ♥ │ │ ♥ │ │ ♥ │ │ ♥ │        │
│ └───┘ └───┘ └───┘ └───┘        │
└──────────────────────────────────┘

Features:
- Remove from wishlist
- Add to cart
- Share wishlist
- Empty state
```

---

### 2.3.3 Seller Pages

#### **SellerDashboard.tsx** ✅ (มีแล้ว)
```
Tabs:
1. Dashboard (Overview)
   - Stats cards (Sales, Orders, Products)
   - Sales chart
   - Recent orders table

2. Products
   - Product list table
   - [+ Add Product]
   - Edit/Delete actions
   - Stock status

3. Orders
   - Order list table
   - Filter by status
   - Update status
   - Print invoice

4. Analytics
   - Sales chart (daily/weekly/monthly)
   - Top products
   - Customer insights

5. Wallet
   - Balance
   - [Withdraw]
   - Transaction history

6. Settings
   - Shop information
   - Shipping settings
   - Return policy
```

#### **AddProduct.tsx** (ต้องสร้าง)
```
Form:
1. Basic Information
   - Product Name *
   - Category * (dropdown with search)
   - Brand
   - Condition (new/used)

2. Description *
   - Rich text editor
   - Formatting tools

3. Images * (1-10)
   - Multiple upload
   - Drag to reorder
   - Set cover image

4. Pricing
   - Price *
   - Original Price (for discount)
   - Stock Quantity *
   - SKU

5. Shipping
   - Weight *
   - Dimensions (L x W x H)
   - Shipping From (province)

6. Variants (optional)
   - Size, Color, etc.
   - Price/Stock per variant

7. SEO (optional)
   - Meta Title
   - Meta Description
   - Keywords

[Save as Draft] [Publish]

Validation:
- All required fields
- At least 1 image
- Price > 0
- Stock >= 0
```

---

### 2.3.4 Admin Pages

#### **AdminDashboard.tsx** ✅ (มีแล้ว)
```
Tabs:
1. Dashboard
   - Platform stats
   - Revenue chart
   - Recent activities

2. Users
   - User list table
   - Search/Filter
   - Ban/Unban
   - View details

3. Sellers
   - Pending applications
   - Approved sellers
   - Approve/Reject
   - View documents

4. Products
   - All products
   - Pending approval
   - Reported products
   - Approve/Reject/Delete

5. Orders
   - All orders
   - Filter by status
   - View details
   - Refund management

6. Disputes
   - Open disputes
   - Resolved disputes
   - Assign to admin
   - Add notes
   - Resolve

7. Settings
   - Platform settings
   - Commission rate
   - Shipping fees
   - Payment methods
```

#### **SellerApproval.tsx** (ต้องสร้าง)
```
Layout:
┌──────────────────────────────────┐
│ Pending Seller Applications (5)  │
├──────────────────────────────────┤
│ Application #12345               │
│ ──────────────────────────────  │
│ Name: John Doe                   │
│ Email: john@example.com          │
│ Phone: 0812345678                │
│ Shop Name: John's Shop           │
│                                  │
│ ID Card:                         │
│ [View Image]                     │
│                                  │
│ Bank Account:                    │
│ Bank: SCB                        │
│ Account: 123-456-7890            │
│ Name: John Doe                   │
│                                  │
│ Reason for Selling:              │
│ Lorem ipsum...                   │
│                                  │
│ [Approve] [Reject]               │
└──────────────────────────────────┘

Actions:
- View ID card (lightbox)
- Verify bank account
- Approve → Send email + Update status
- Reject → Send email with reason
```

---

## 2.4 Mobile Responsive Breakpoints

```css
/* Mobile First Approach */

/* Mobile (default) */
@media (min-width: 0px) {
  - Single column
  - Hamburger menu
  - Bottom navigation
  - Full-width cards
}

/* Tablet */
@media (min-width: 768px) {
  - 2 columns
  - Sidebar menu
  - Larger cards
}

/* Desktop */
@media (min-width: 1024px) {
  - 3-4 columns
  - Full sidebar
  - Hover effects
}

/* Large Desktop */
@media (min-width: 1280px) {
  - Max-width container
  - More spacing
}
```

---

## 2.5 Animation & Transitions

### Micro-interactions
```css
/* Button Hover */
.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255,59,59,0.3);
  transition: all 0.2s ease;
}

/* Card Hover */
.card:hover {
  transform: scale(1.02);
  transition: transform 0.3s ease;
}

/* Neon Glow */
.neon-text {
  text-shadow: 0 0 10px currentColor;
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { text-shadow: 0 0 10px currentColor; }
  50% { text-shadow: 0 0 20px currentColor; }
}

/* Loading Spinner */
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Page Transitions
```typescript
// Using Framer Motion
import { motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={{ duration: 0.3 }}
>
  {/* Page content */}
</motion.div>
```

---

## 2.6 Accessibility (A11y)

### WCAG 2.1 AA Compliance

```typescript
/* Keyboard Navigation */
- Tab order: logical flow
- Focus indicators: visible
- Skip links: "Skip to main content"
- Escape key: close modals

/* Screen Reader Support */
- Alt text for images
- ARIA labels for icons
- ARIA live regions for dynamic content
- Semantic HTML (header, nav, main, footer)

/* Color Contrast */
- Text: 4.5:1 ratio
- Large text: 3:1 ratio
- Interactive elements: 3:1 ratio

/* Form Accessibility */
- Label for every input
- Error messages: descriptive
- Required fields: indicated
- Focus on first error
```

---

# PART 3: WORKFLOW & DEVELOPMENT PROCESS

## 3.1 Development Workflow (Step-by-Step)

### Phase 1: Setup & Infrastructure ✅ (DONE)
```
✅ 1.1 Project Initialization
   - Create project with webdev_init_project
   - Install dependencies
   - Setup environment variables

✅ 1.2 Database Schema
   - Design 14 tables
   - Create drizzle/schema.ts
   - Run pnpm db:push

✅ 1.3 Basic Backend
   - Setup tRPC routers
   - Create db helpers
   - Test API endpoints

✅ 1.4 Basic Frontend
   - Setup React Router
   - Create page components
   - Setup Tailwind theme

✅ 1.5 Image Upload System
   - Install Sharp
   - Create server/image.ts
   - Create ImageUploader components
   - Integrate with Profile & Seller Dashboard
```

### Phase 2: Email Notification System (NEXT)
```
❌ 2.1 Setup Email Service
   Step 1: Choose provider (Resend recommended)
   Step 2: Get API key
   Step 3: Add to environment variables
   
   Code:
   ```bash
   cd /home/ubuntu/streetmarket
   pnpm add resend
   ```

❌ 2.2 Create Email Templates
   Step 1: Create server/email/templates/
   Step 2: Create 7 HTML templates:
   
   Files to create:
   - server/email/templates/welcome.html
   - server/email/templates/email-verification.html
   - server/email/templates/order-confirmation.html
   - server/email/templates/payment-received.html
   - server/email/templates/order-shipped.html
   - server/email/templates/seller-approved.html
   - server/email/templates/seller-rejected.html

❌ 2.3 Create Email Service
   File: server/email/index.ts
   
   Functions:
   - sendWelcomeEmail(user)
   - sendVerificationEmail(user, token)
   - sendOrderConfirmation(order)
   - sendPaymentReceived(order)
   - sendOrderShipped(order, tracking)
   - sendSellerApproved(seller)
   - sendSellerRejected(seller, reason)

❌ 2.4 Integrate Email Triggers
   Locations:
   - server/routers.ts (auth.register) → sendWelcomeEmail
   - server/routers.ts (orders.create) → sendOrderConfirmation
   - server/routers.ts (payment.confirm) → sendPaymentReceived
   - server/routers.ts (orders.updateStatus) → sendOrderShipped
   - server/routers.ts (seller.approve) → sendSellerApproved
   - server/routers.ts (seller.reject) → sendSellerRejected

❌ 2.5 Test Email System
   Test cases:
   - Register new user → Receive welcome email
   - Create order → Receive confirmation
   - Payment confirmed → Receive payment email
   - Order shipped → Receive tracking email
   - Seller approved → Receive approval email
```

### Phase 3: Payment Verification System
```
❌ 3.1 Research Payment Gateway
   Options:
   - Omise (recommended for Thailand)
   - SCB Easy App API
   - 2C2P
   - PayPal (international)

❌ 3.2 Setup Payment Gateway
   Step 1: Register account
   Step 2: Get API keys (public + secret)
   Step 3: Add to environment variables
   
   Code:
   ```bash
   pnpm add omise
   ```

❌ 3.3 Create Payment Service
   File: server/payment/index.ts
   
   Functions:
   - createPromptPayCharge(amount, ref)
   - verifyPayment(chargeId)
   - getPaymentStatus(chargeId)
   - createRefund(chargeId, amount)

❌ 3.4 Integrate Payment Verification
   Flow:
   1. User creates order
   2. System generates PromptPay QR (with charge ID)
   3. User pays via banking app
   4. Webhook receives payment notification
   5. System verifies payment
   6. Update order status to "Paid"
   7. Send email confirmation

   Files to modify:
   - server/routers.ts (payment router)
   - server/_core/index.ts (add webhook endpoint)

❌ 3.5 Create Webhook Endpoint
   File: server/_core/webhook.ts
   
   Endpoint: POST /api/webhook/payment
   
   Flow:
   1. Receive webhook from payment gateway
   2. Verify signature
   3. Extract payment data
   4. Update transaction status
   5. Update order status
   6. Send email notification

❌ 3.6 Test Payment Flow
   Test cases:
   - Create order → Generate QR
   - Simulate payment → Webhook triggered
   - Verify order status updated
   - Verify email sent
```

### Phase 4: Security Implementation
```
❌ 4.1 Rate Limiting
   Install:
   ```bash
   pnpm add express-rate-limit
   ```
   
   File: server/_core/rateLimiter.ts
   
   Limits:
   - API calls: 100 requests/15 minutes
   - Login attempts: 5 attempts/15 minutes
   - Image upload: 10 uploads/hour
   - Email sending: 10 emails/hour

❌ 4.2 CSRF Protection
   Install:
   ```bash
   pnpm add csurf
   ```
   
   File: server/_core/csrf.ts
   
   Implementation:
   - Generate CSRF token on page load
   - Validate token on POST/PUT/DELETE requests

❌ 4.3 Input Sanitization
   Install:
   ```bash
   pnpm add validator xss
   ```
   
   File: server/utils/sanitize.ts
   
   Functions:
   - sanitizeString(input)
   - sanitizeEmail(email)
   - sanitizePhone(phone)
   - sanitizeHTML(html)

❌ 4.4 SQL Injection Prevention
   - Use Drizzle ORM (already safe)
   - Never use raw SQL with user input
   - Validate all inputs

❌ 4.5 XSS Prevention
   - Sanitize all user inputs
   - Use Content Security Policy (CSP)
   - Escape HTML in templates

❌ 4.6 Implement Security Headers
   Install:
   ```bash
   pnpm add helmet
   ```
   
   File: server/_core/index.ts
   
   Headers:
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - X-XSS-Protection: 1; mode=block
   - Strict-Transport-Security
   - Content-Security-Policy
```

### Phase 5: Real-time Chat System
```
❌ 5.1 Setup Socket.IO
   Install:
   ```bash
   pnpm add socket.io socket.io-client
   ```

❌ 5.2 Create WebSocket Server
   File: server/_core/socket.ts
   
   Events:
   - connection
   - disconnect
   - join_room (conversationId)
   - send_message
   - typing
   - read_message

❌ 5.3 Create Chat Backend
   File: server/chat.ts
   
   Functions:
   - createConversation(userId1, userId2)
   - getConversations(userId)
   - getMessages(conversationId)
   - sendMessage(conversationId, content, type)
   - markAsRead(messageId)

❌ 5.4 Create Chat Components
   Files to create:
   - client/src/components/ChatList.tsx
   - client/src/components/ChatWindow.tsx
   - client/src/components/MessageBubble.tsx
   - client/src/components/ChatInput.tsx

❌ 5.5 Create Chat Pages
   Files to create:
   - client/src/pages/Chat.tsx (main chat page)
   - client/src/pages/SupportChat.tsx (admin support)

❌ 5.6 Integrate Socket.IO Client
   File: client/src/lib/socket.ts
   
   Setup:
   - Connect to WebSocket server
   - Handle events
   - Auto-reconnect

❌ 5.7 Test Chat System
   Test cases:
   - Send text message
   - Send image
   - Real-time delivery
   - Typing indicator
   - Read receipts
   - Offline messages
```

### Phase 6: Shipping Integration
```
❌ 6.1 Research Shipping APIs
   Providers:
   - Flash Express
   - Kerry Express (KEX)
   - Thailand Post (ไปรษณีย์ไทย)
   - J&T Express

❌ 6.2 Setup API Keys
   Step 1: Register with each provider
   Step 2: Get API credentials
   Step 3: Add to environment variables

❌ 6.3 Create Shipping Service
   File: server/shipping/index.ts
   
   Functions:
   - calculateShippingFee(from, to, weight)
   - createShipment(order, carrier)
   - getTrackingInfo(trackingNumber, carrier)
   - cancelShipment(trackingNumber, carrier)

❌ 6.4 Create Carrier Adapters
   Files:
   - server/shipping/flash.ts
   - server/shipping/kerry.ts
   - server/shipping/thailandpost.ts
   - server/shipping/jnt.ts
   
   Each adapter implements:
   - calculateFee()
   - createShipment()
   - getTracking()
   - cancel()

❌ 6.5 Integrate Shipping in Checkout
   File: client/src/pages/Checkout.tsx
   
   Flow:
   1. User enters shipping address
   2. System calculates fees from all carriers
   3. User selects carrier
   4. Order created with carrier info
   5. Seller prints shipping label
   6. System tracks shipment automatically

❌ 6.6 Create Tracking Page
   File: client/src/pages/TrackOrder.tsx
   
   Features:
   - Enter tracking number
   - Show tracking timeline
   - Show current location
   - Estimated delivery date

❌ 6.7 Auto-Update Order Status
   File: server/cron/trackShipments.ts
   
   Cron job (runs every hour):
   1. Get all "Shipped" orders
   2. Query tracking API
   3. Update order status if delivered
   4. Send email notification
```

### Phase 7: Data Seeding
```
❌ 7.1 Create Seed Script
   File: server/seed/index.ts
   
   Data to seed:
   - 1 Admin user
   - 10 Regular users
   - 5 Sellers (approved)
   - 20 Categories
   - 100 Products (with images)
   - 50 Orders (various statuses)
   - 200 Reviews

❌ 7.2 Generate Fake Data
   Install:
   ```bash
   pnpm add @faker-js/faker
   ```
   
   Use Faker to generate:
   - Names
   - Emails
   - Addresses
   - Phone numbers
   - Product names
   - Descriptions
   - Reviews

❌ 7.3 Download Sample Images
   Sources:
   - Unsplash API
   - Pexels API
   - Lorem Picsum
   
   Categories:
   - Electronics
   - Fashion
   - Home & Living
   - Beauty
   - Sports
   - Books
   - Toys
   - Food

❌ 7.4 Run Seed Script
   Command:
   ```bash
   cd /home/ubuntu/streetmarket
   node server/seed/index.mjs
   ```
   
   Verify:
   - Check database tables
   - Login as admin
   - Browse products
   - Test search

❌ 7.5 Create Reset Script
   File: server/seed/reset.ts
   
   Function: Clear all data except schema
   
   Use case: Reset for testing
```

### Phase 8: Testing & QA
```
❌ 8.1 User Flow Testing
   Test as Buyer:
   1. Register account
   2. Browse products
   3. Search products
   4. Add to cart
   5. Checkout
   6. Pay with PromptPay
   7. Track order
   8. Receive order
   9. Leave review
   10. Contact seller

   Test as Seller:
   1. Apply to become seller
   2. Wait for approval
   3. Add products
   4. Receive order
   5. Update order status
   6. Chat with buyer
   7. Withdraw money

   Test as Admin:
   1. Login as admin
   2. Approve seller
   3. Manage products
   4. Manage orders
   5. Resolve disputes
   6. View analytics

❌ 8.2 Bug Tracking
   Create: bugs.md
   
   Format:
   ```markdown
   ## Bug #1: Cart not updating
   - **Severity**: High
   - **Steps to reproduce**: ...
   - **Expected**: ...
   - **Actual**: ...
   - **Status**: Open
   ```

❌ 8.3 Fix Critical Bugs
   Priority:
   1. Payment not working
   2. Order not created
   3. Image upload failing
   4. Login issues
   5. Cart issues

❌ 8.4 Performance Testing
   Tools:
   - Lighthouse (Chrome DevTools)
   - WebPageTest
   
   Metrics:
   - First Contentful Paint < 1.8s
   - Largest Contentful Paint < 2.5s
   - Time to Interactive < 3.8s
   - Cumulative Layout Shift < 0.1

❌ 8.5 Security Testing
   Check:
   - SQL injection
   - XSS attacks
   - CSRF attacks
   - Rate limiting
   - Authentication bypass

❌ 8.6 Mobile Testing
   Test on:
   - iOS Safari
   - Android Chrome
   - Various screen sizes
   
   Check:
   - Responsive layout
   - Touch interactions
   - Mobile menu
   - Image loading
```

### Phase 9: Pre-Deployment Optimization
```
❌ 9.1 Frontend Optimization
   Tasks:
   - Code splitting (lazy loading)
   - Image optimization (WebP)
   - Minify CSS/JS
   - Remove unused code
   - Enable compression

   Commands:
   ```bash
   cd /home/ubuntu/streetmarket
   pnpm build
   ```

❌ 9.2 Backend Optimization
   Tasks:
   - Database indexing
   - Query optimization
   - Caching (Redis)
   - API response compression
   - Connection pooling

❌ 9.3 Database Optimization
   Add indexes:
   ```sql
   CREATE INDEX idx_products_category ON products(categoryId);
   CREATE INDEX idx_products_seller ON products(sellerId);
   CREATE INDEX idx_orders_user ON orders(userId);
   CREATE INDEX idx_orders_status ON orders(status);
   ```

❌ 9.4 Setup CDN (Optional)
   For static assets:
   - Images
   - CSS
   - JS
   
   Providers:
   - Cloudflare
   - AWS CloudFront

❌ 9.5 Setup Monitoring
   Tools:
   - Sentry (error tracking)
   - Google Analytics (user analytics)
   - Uptime monitoring
   
   Install:
   ```bash
   pnpm add @sentry/react @sentry/node
   ```

❌ 9.6 Create Backup Strategy
   Schedule:
   - Database backup: Daily
   - File backup: Weekly
   - Retention: 30 days
   
   Tools:
   - Database: mysqldump
   - Files: S3 sync
```

### Phase 10: Production Deployment
```
❌ 10.1 Pre-Deployment Checklist
   - [ ] All tests passing
   - [ ] No critical bugs
   - [ ] Environment variables set
   - [ ] Database migrated
   - [ ] SSL certificate ready
   - [ ] Domain configured
   - [ ] Backup created

❌ 10.2 Save Final Checkpoint
   Command:
   ```
   webdev_save_checkpoint("Production Ready - v1.0.0")
   ```

❌ 10.3 Deploy to Production
   Step 1: Click "Publish" in Management Dashboard
   Step 2: Wait for deployment
   Step 3: Verify deployment
   
   Check:
   - Website accessible
   - Database connected
   - Images loading
   - Payment working
   - Email sending

❌ 10.4 Post-Deployment Testing
   Test:
   - Homepage loads
   - User can register
   - User can login
   - Products display
   - Search works
   - Cart works
   - Checkout works
   - Payment works
   - Email received

❌ 10.5 Setup Custom Domain (Optional)
   Step 1: Go to Management Dashboard
   Step 2: Settings → Domains
   Step 3: Add custom domain
   Step 4: Update DNS records
   Step 5: Wait for propagation

❌ 10.6 Launch Announcement
   Channels:
   - Social media
   - Email newsletter
   - Press release
   
   Content:
   - What is StreetMarket
   - Key features
   - How to get started
   - Special launch offer
```

---

## 3.2 Common Problems & Solutions

### Problem 1: Image Upload Fails
```
Symptoms:
- Upload button not working
- Error: "Failed to upload image"

Solutions:
1. Check S3 credentials in environment variables
2. Check file size (max 5MB)
3. Check file type (JPEG, PNG, WebP, GIF only)
4. Check server logs for errors
5. Test with smaller image

Debug:
```bash
cd /home/ubuntu/streetmarket
pnpm dev
# Check terminal for errors
```
```

### Problem 2: Payment Not Verified
```
Symptoms:
- User paid but order still "Pending Payment"
- Webhook not triggered

Solutions:
1. Check webhook URL is public
2. Check payment gateway webhook settings
3. Check webhook signature verification
4. Test webhook with ngrok locally
5. Check server logs

Debug:
```bash
# Check webhook endpoint
curl -X POST https://your-domain.com/api/webhook/payment \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```
```

### Problem 3: Chat Not Working
```
Symptoms:
- Messages not sending
- Real-time updates not working

Solutions:
1. Check Socket.IO connection
2. Check WebSocket port is open
3. Check CORS settings
4. Check client-side socket connection
5. Check server logs

Debug:
```javascript
// In browser console
console.log(socket.connected) // Should be true
```
```

### Problem 4: Slow Page Load
```
Symptoms:
- Pages take > 3 seconds to load
- Images loading slowly

Solutions:
1. Enable image optimization
2. Implement lazy loading
3. Use code splitting
4. Enable compression
5. Use CDN for static assets

Optimize:
```bash
# Build for production
pnpm build

# Analyze bundle size
pnpm analyze
```
```

### Problem 5: Database Connection Error
```
Symptoms:
- Error: "Cannot connect to database"
- API returns 500 errors

Solutions:
1. Check DATABASE_URL in environment
2. Check database is running
3. Check firewall rules
4. Check connection pool settings
5. Restart server

Debug:
```bash
# Test database connection
cd /home/ubuntu/streetmarket
node -e "console.log(process.env.DATABASE_URL)"
```
```

---

## 3.3 Maintenance & Updates

### Weekly Tasks
```
- [ ] Check error logs
- [ ] Review user feedback
- [ ] Update product data
- [ ] Check payment transactions
- [ ] Backup database
```

### Monthly Tasks
```
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance review
- [ ] User analytics review
- [ ] Feature planning
```

### Quarterly Tasks
```
- [ ] Major feature release
- [ ] UI/UX improvements
- [ ] Marketing campaign
- [ ] User survey
```

---

# PART 4: DEPLOYMENT GUIDE

## 4.1 Environment Variables

### Required Variables (Already Set)
```env
# Database
DATABASE_URL=mysql://...

# Authentication
JWT_SECRET=...
OAUTH_SERVER_URL=...
VITE_OAUTH_PORTAL_URL=...

# App Info
VITE_APP_ID=...
VITE_APP_TITLE=StreetMarket
VITE_APP_LOGO=/logo.svg

# Owner
OWNER_OPEN_ID=...
OWNER_NAME=...

# Analytics
VITE_ANALYTICS_ENDPOINT=...
VITE_ANALYTICS_WEBSITE_ID=...

# Forge API (Built-in)
BUILT_IN_FORGE_API_URL=...
BUILT_IN_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_URL=...
```

### Variables to Add
```env
# Email (Resend)
RESEND_API_KEY=re_...

# Payment (Omise)
OMISE_PUBLIC_KEY=pkey_...
OMISE_SECRET_KEY=skey_...

# Shipping (Flash Express)
FLASH_API_KEY=...
FLASH_MERCHANT_ID=...

# Shipping (Kerry)
KERRY_API_KEY=...
KERRY_MERCHANT_ID=...

# Shipping (Thailand Post)
THAILANDPOST_API_KEY=...

# Shipping (J&T)
JNT_API_KEY=...
JNT_MERCHANT_ID=...

# Monitoring (Sentry)
SENTRY_DSN=https://...
```

---

## 4.2 Deployment Checklist

### Before Deployment
```
✅ 1. Code Review
   - All features implemented
   - No console.log statements
   - No TODO comments
   - Code formatted

✅ 2. Testing
   - All user flows tested
   - No critical bugs
   - Performance acceptable
   - Mobile responsive

✅ 3. Security
   - Rate limiting enabled
   - CSRF protection enabled
   - Input sanitization enabled
   - Security headers set

✅ 4. Environment
   - All environment variables set
   - Database migrated
   - Seed data loaded (optional)

✅ 5. Backup
   - Database backup created
   - Code committed to git
   - Checkpoint saved
```

### Deployment Steps
```
1. Save final checkpoint
   webdev_save_checkpoint("Production v1.0.0")

2. Go to Management Dashboard
   Click checkpoint card

3. Click "Publish" button
   Wait for deployment (2-5 minutes)

4. Verify deployment
   - Visit website URL
   - Test key features
   - Check error logs

5. Configure custom domain (optional)
   - Go to Settings → Domains
   - Add domain
   - Update DNS records
   - Wait for SSL certificate

6. Announce launch
   - Social media
   - Email
   - Marketing
```

---

## 4.3 Post-Deployment

### Monitoring
```
1. Setup Error Tracking (Sentry)
   - Install Sentry
   - Add DSN to environment
   - Test error reporting

2. Setup Analytics (Google Analytics)
   - Create GA4 property
   - Add tracking code
   - Verify data collection

3. Setup Uptime Monitoring
   - UptimeRobot
   - Pingdom
   - StatusCake
   
   Check every 5 minutes
   Alert if down > 2 minutes
```

### Support
```
1. Create Help Center
   - FAQ page
   - How-to guides
   - Contact form

2. Setup Support Email
   - support@streetmarket.com
   - Auto-reply enabled
   - Response within 24 hours

3. Setup Support Chat
   - Admin dashboard
   - Real-time chat
   - Assign to admin
```

---

# FINAL SUMMARY

## What's Done ✅
1. Database (14 tables)
2. Backend API (56 endpoints)
3. Frontend (10 pages)
4. Image Upload System
5. Dark Theme UI
6. Responsive Design

## What's Missing ❌
1. Email Notification System
2. Payment Verification
3. Security (Rate limiting, CSRF)
4. Real-time Chat
5. Shipping Integration
6. Data Seeding
7. Testing & Bug Fixes
8. Optimization
9. Production Deployment

## Estimated Time to Complete
- Phase 2 (Email): 2-3 hours
- Phase 3 (Payment): 3-4 hours
- Phase 4 (Security): 2-3 hours
- Phase 5 (Chat): 4-5 hours
- Phase 6 (Shipping): 3-4 hours
- Phase 7 (Seeding): 1-2 hours
- Phase 8 (Testing): 3-4 hours
- Phase 9 (Optimization): 2-3 hours
- Phase 10 (Deployment): 1 hour

**Total: 21-29 hours**

## Next Steps for AI
1. Start with Phase 2 (Email)
2. Follow workflow step-by-step
3. Test each phase before moving to next
4. Save checkpoint after each phase
5. Don't skip any steps
6. Fix bugs immediately
7. Deploy when all phases complete

---

**END OF COMPLETE BLUEPRINT**
