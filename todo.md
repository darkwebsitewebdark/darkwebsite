# StreetMarket - Project TODO

## Phase 1: Database Schema และ Todo List
- [x] สร้าง todo.md
- [x] ออกแบบและสร้าง Database Schema ครบทุกตาราง

## Phase 2: Backend API - ระบบสมาชิกและ Seller
- [x] ระบบโปรไฟล์ผู้ใช้ (อัพเดทข้อมูล อัพโหลดรูป)
- [x] ระบบเชื่อมโยงบัญชีธนาคาร (ตรวจสอบชื่อบัญชี)
- [x] ระบบอัพโหลดบัตรประชาชน
- [x] ระบบสมัครเป็น Seller
- [x] ระบบอนุมัติ Seller (Admin)
- [x] ระบบจัดการสถานะ Seller

## Phase 3: Backend API - ระบบสินค้าและหมวดหมู่
- [x] CRUD หมวดหมู่สินค้า (Categories)
- [x] CRUD สินค้า (Products)
- [x] ระบบค้นหาสินค้า (Search)
- [x] ระบบกรองและจัดเรียงสินค้า (Filter & Sort)
- [x] ระบบรีวิวและคะแนน (Reviews & Ratings)

## Phase 4: Backend API - ระบบการเงินและ PromptPay
- [x] ระบบกระเป๋าเงิน (Wallet)
- [x] สร้าง PromptPay QR Code พร้อม REF
- [x] ระบบตรวจสอบยอดเงินอัตโนมัติ
- [x] ระบบเติมเงิน (Top-up)
- [x] ระบบถอนเงิน (Withdrawal) สำหรับ Seller
- [x] ระบบบันทึก Transaction
- [x] ระบบคำนวณค่าธรรมเนียม (Commission)

## Phase 5: Backend API - ระบบคำสั่งซื้อและชำระเงิน
- [x] ระบบตะกร้าสินค้า (Cart)
- [x] ระบบสร้างคำสั่งซื้อ (Create Order)
- [x] ระบบชำระเงินจากกระเป๋า (Pay from Wallet)
- [x] ระบบจัดการสถานะคำสั่งซื้อ
- [x] ระบบยืนยันรับสินค้า (Confirm Delivery)
- [x] ระบบคืนเงิน/ร้องเรียน (Refund/Dispute)

## Phase 6: Backend API - ระบบแชทและการสื่อสาร
- [x] ระบบแชทระหว่าง Buyer-Seller (WebSocket)
- [x] ระบบแชทแจ้งปัญหาถึง Admin (Support Chat)
- [x] ระบบแจ้งเตือน (Notifications)
- [x] ระบบบันทึกประวัติแชท

## Phase 7: Backend API - ระบบพัสดุและ Admin
- [ ] API Integration - Flash Express
- [ ] API Integration - Kerry (KEX)
- [ ] API Integration - ไปรษณีย์ไทย
- [ ] API Integration - J&T Express
- [ ] ระบบติดตามพัสดุอัตโนมัติ (Auto Tracking)
- [ ] ระบบอัพเดทสถานะพัสดุ
- [x] Admin: จัดการผู้ใช้
- [x] Admin: จัดการสินค้า
- [x] Admin: จัดการคำสั่งซื้อ
- [x] Admin: จัดการข้อพิพาท
- [x] Admin: ตั้งค่าค่าธรรมเนียม
- [x] Admin: Dashboard สถิติ

## Phase 8: ออกแบบและสร้าง UI Theme Dark สไตล์วัยรุ่น
- [x] ออกแบบ Color Palette (แดงสด เขียวนีออน ส้มทอง)
- [x] เลือกและติดตั้ง Fonts (Bebas Neue, Inter)
- [x] สร้าง CSS Variables และ Theme
- [x] ออกแบบ Components สไตล์วัยรุ่น
- [x] เพิ่ม Neon Glow Effects
- [x] สร้าง Icons และ Graphics## Phase 9: Frontend - หน้า Landing และ Authentication
- [x] หน้า Landing Page (Hero, Features, CTA)
- [x] หน้า Login/Register (Manus OAuth)
- [x] Navigation Bar (Desktop + Mobile)
- [x] Footer
- [x] Profile Management

## Phase 10: Frontend - หน้าสินค้าและตะกร้า
- [x] หน้ารายการสินค้า (Products List)
- [x] หน้ารายละเอียดสินค้า (Product Detail)
- [x] หน้าตะกร้าสินค้า (Cart)
- [x] หน้าชำระเงิน (Checkout)
- [x] หน้าประวัติคำสั่งซื้อ (Order History)

## Phase 11: Frontend - Seller Dashboard
- [ ] หน้าสมัครเป็น Seller
- [ ] Seller Dashboard (Overview)
- [ ] หน้าจัดการสินค้า (Product Management)
- [ ] หน้าจัดการคำสั่งซื้อ (Order Management)
- [ ] หน้าถอนเงิน (Withdrawal)
- [ ] หน้าสถิติการขาย (Sales Analytics)
- [ ] หน้าตั้งค่าร้านค้า (Shop Settings)

## Phase 12: Frontend - Admin Dashboard
- [ ] Admin Dashboard (Overview)
- [ ] หน้าอนุมัติ Seller Applications
- [ ] หน้าจัดการผู้ใช้ (User Management)
- [ ] หน้าจัดการสินค้า (Product Management)
- [ ] หน้าจัดการหมวดหมู่ (Category Management)
- [ ] หน้าจัดการคำสั่งซื้อ (Order Management)
- [ ] หน้าจัดการข้อพิพาท (Dispute Management)
- [ ] หน้าตั้งค่าค่าธรรมเนียม (Commission Settings)
- [ ] หน้าสถิติและรายงาน (Analytics & Reports)

## Phase 13: Frontend - ระบบแชทและการแจ้งเตือน
- [ ] Chat Interface (Buyer-Seller)
- [ ] Support Chat Interface (User-Admin)
- [ ] Admin Chat Dashboard
- [ ] Notification Center
- [ ] Realtime Updates (WebSocket)

## Phase 14: ทดสอบและแก้ไขข้อบกพร่อง
- [ ] ทดสอบ User Flow ทั้งหมด
- [ ] ทดสอบ Seller Flow
- [ ] ทดสอบ Admin Flow
- [ ] ทดสอบระบบการเงิน
- [ ] ทดสอบระบบแชท
- [ ] ทดสอบ Responsive Design
- [ ] ทดสอบ Performance
- [ ] แก้ไข Bugs ที่พบ

## Phase 15: Deploy และตั้งค่าความปลอดภัย
- [ ] ตรวจสอบ Security (XSS, SQL Injection, CSRF)
- [ ] ตั้งค่า Rate Limiting
- [ ] ตั้งค่า HTTPS
- [ ] ตั้งค่า Environment Variables
- [ ] สร้าง Checkpoint สุดท้าย
- [ ] Deploy Production

## Phase 16: ส่งมอบเว็บไซต์และคู่มือการใช้งาน
- [ ] สร้างคู่มือการใช้งานสำหรับ Admin
- [ ] สร้างคู่มือการใช้งานสำหรับ Seller
- [ ] สร้างคู่มือการใช้งานสำหรับ User
- [ ] จัดทำเอกสาร API Documentation
- [ ] ส่งมอบ URL เว็บไซต์
- [ ] ส่งมอบข้อมูล Admin Account
