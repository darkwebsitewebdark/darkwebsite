import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "seller", "admin"]).default("user").notNull(),
  profileImage: text("profileImage"),
  
  // Bank account info
  bankAccountNumber: varchar("bankAccountNumber", { length: 50 }),
  bankAccountName: varchar("bankAccountName", { length: 255 }),
  bankName: varchar("bankName", { length: 100 }),
  
  // ID Card info (encrypted)
  idCardNumber: varchar("idCardNumber", { length: 255 }),
  idCardImageUrl: text("idCardImageUrl"),
  
  // Wallet
  walletBalance: int("walletBalance").default(0).notNull(), // Store in cents/satang
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Seller applications table
 */
export const sellerApplications = mysqlTable("sellerApplications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  idCardImageUrl: text("idCardImageUrl").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  adminNote: text("adminNote"),
  reviewedBy: int("reviewedBy"), // Admin user ID
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SellerApplication = typeof sellerApplications.$inferSelect;
export type InsertSellerApplication = typeof sellerApplications.$inferInsert;

/**
 * Categories table (hierarchical)
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  parentId: int("parentId"), // Self-referencing for hierarchy
  commissionRate: int("commissionRate").default(5).notNull(), // Percentage (5 = 5%)
  imageUrl: text("imageUrl"),
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Products table
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  categoryId: int("categoryId").notNull(),
  name: varchar("name", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull(),
  description: text("description"),
  price: int("price").notNull(), // Store in cents/satang
  stock: int("stock").default(0).notNull(),
  images: json("images").$type<string[]>(), // Array of image URLs
  status: mysqlEnum("status", ["active", "inactive", "outofstock"]).default("active").notNull(),
  views: int("views").default(0).notNull(),
  sales: int("sales").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Product reviews table
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  userId: int("userId").notNull(),
  orderId: int("orderId").notNull(),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  images: json("images").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Orders table
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  buyerId: int("buyerId").notNull(),
  sellerId: int("sellerId").notNull(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  totalAmount: int("totalAmount").notNull(), // Store in cents/satang
  commissionAmount: int("commissionAmount").notNull(),
  sellerAmount: int("sellerAmount").notNull(),
  status: mysqlEnum("status", [
    "pending_payment",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
    "disputed"
  ]).default("pending_payment").notNull(),
  
  // Shipping info
  shippingAddress: json("shippingAddress").$type<{
    name: string;
    phone: string;
    address: string;
    province: string;
    district: string;
    subdistrict: string;
    postalCode: string;
  }>().notNull(),
  
  trackingNumber: varchar("trackingNumber", { length: 100 }),
  shippingProvider: mysqlEnum("shippingProvider", ["flash", "kerry", "thailandpost", "jnt"]),
  shippingStatus: text("shippingStatus"), // JSON from tracking API
  
  // Timestamps
  paidAt: timestamp("paidAt"),
  shippedAt: timestamp("shippedAt"),
  deliveredAt: timestamp("deliveredAt"),
  confirmedAt: timestamp("confirmedAt"), // Buyer confirms delivery
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items table
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  productName: varchar("productName", { length: 500 }).notNull(),
  productImage: text("productImage"),
  quantity: int("quantity").notNull(),
  price: int("price").notNull(), // Price at time of purchase
  subtotal: int("subtotal").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Transactions table (wallet history)
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", [
    "topup",
    "withdrawal",
    "purchase",
    "sale",
    "commission",
    "refund"
  ]).notNull(),
  amount: int("amount").notNull(), // Positive or negative
  balanceAfter: int("balanceAfter").notNull(),
  refNumber: varchar("refNumber", { length: 50 }), // For PromptPay verification
  relatedOrderId: int("relatedOrderId"),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending").notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Cart items table
 */
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/**
 * Messages table (chat)
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  receiverId: int("receiverId").notNull(),
  orderId: int("orderId"), // Optional, for order-related chats
  message: text("message").notNull(),
  isSupport: boolean("isSupport").default(false).notNull(), // True if it's a support chat
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Disputes table
 */
export const disputes = mysqlTable("disputes", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  userId: int("userId").notNull(), // Who filed the dispute
  reason: text("reason").notNull(),
  evidence: json("evidence").$type<string[]>(), // Images/documents
  status: mysqlEnum("status", ["open", "investigating", "resolved", "closed"]).default("open").notNull(),
  resolution: text("resolution"),
  resolvedBy: int("resolvedBy"), // Admin user ID
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Dispute = typeof disputes.$inferSelect;
export type InsertDispute = typeof disputes.$inferInsert;

/**
 * Notifications table
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["order", "payment", "chat", "system", "dispute"]).notNull(),
  relatedId: int("relatedId"), // Related order/dispute/etc ID
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Wishlist table
 */
export const wishlist = mysqlTable("wishlist", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Wishlist = typeof wishlist.$inferSelect;
export type InsertWishlist = typeof wishlist.$inferInsert;

/**
 * Withdrawal requests table (for sellers)
 */
export const withdrawalRequests = mysqlTable("withdrawalRequests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(),
  bankAccountNumber: varchar("bankAccountNumber", { length: 50 }).notNull(),
  bankAccountName: varchar("bankAccountName", { length: 255 }).notNull(),
  bankName: varchar("bankName", { length: 100 }).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "completed"]).default("pending").notNull(),
  adminNote: text("adminNote"),
  processedBy: int("processedBy"), // Admin user ID
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WithdrawalRequest = typeof withdrawalRequests.$inferSelect;
export type InsertWithdrawalRequest = typeof withdrawalRequests.$inferInsert;
