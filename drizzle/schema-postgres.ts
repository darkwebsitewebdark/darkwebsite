import { integer, pgEnum, pgTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("role", ["user", "seller", "admin"]);
export const sellerApplicationStatusEnum = pgEnum("seller_application_status", ["pending", "approved", "rejected"]);
export const productStatusEnum = pgEnum("product_status", ["active", "inactive", "outofstock"]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
  "disputed"
]);
export const shippingProviderEnum = pgEnum("shipping_provider", ["flash", "kerry", "thailandpost", "jnt"]);
export const transactionTypeEnum = pgEnum("transaction_type", [
  "topup",
  "withdrawal",
  "purchase",
  "sale",
  "commission",
  "refund"
]);
export const transactionStatusEnum = pgEnum("transaction_status", ["pending", "completed", "failed"]);
export const notificationTypeEnum = pgEnum("notification_type", ["order", "payment", "chat", "system", "dispute"]);
export const disputeStatusEnum = pgEnum("dispute_status", ["open", "investigating", "resolved", "closed"]);
export const withdrawalStatusEnum = pgEnum("withdrawal_status", ["pending", "approved", "rejected", "completed"]);

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  profileImage: text("profileImage"),
  
  // Bank account info
  bankAccountNumber: varchar("bankAccountNumber", { length: 50 }),
  bankAccountName: varchar("bankAccountName", { length: 255 }),
  bankName: varchar("bankName", { length: 100 }),
  
  // ID Card info (encrypted)
  idCardNumber: varchar("idCardNumber", { length: 255 }),
  idCardImageUrl: text("idCardImageUrl"),
  
  // Wallet
  walletBalance: integer("walletBalance").default(0).notNull(), // Store in cents/satang
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Seller applications table
 */
export const sellerApplications = pgTable("sellerApplications", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").notNull(),
  idCardImageUrl: text("idCardImageUrl").notNull(),
  status: sellerApplicationStatusEnum("status").default("pending").notNull(),
  adminNote: text("adminNote"),
  reviewedBy: integer("reviewedBy"), // Admin user ID
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type SellerApplication = typeof sellerApplications.$inferSelect;
export type InsertSellerApplication = typeof sellerApplications.$inferInsert;

/**
 * Categories table (hierarchical)
 */
export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  parentId: integer("parentId"), // Self-referencing for hierarchy
  commissionRate: integer("commissionRate").default(5).notNull(), // Percentage (5 = 5%)
  imageUrl: text("imageUrl"),
  displayOrder: integer("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Products table
 */
export const products = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sellerId: integer("sellerId").notNull(),
  categoryId: integer("categoryId").notNull(),
  name: varchar("name", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(), // Store in cents/satang
  stock: integer("stock").default(0).notNull(),
  images: json("images").$type<string[]>(), // Array of image URLs
  status: productStatusEnum("status").default("active").notNull(),
  views: integer("views").default(0).notNull(),
  sales: integer("sales").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Product reviews table
 */
export const reviews = pgTable("reviews", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  productId: integer("productId").notNull(),
  userId: integer("userId").notNull(),
  orderId: integer("orderId").notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  images: json("images").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Orders table
 */
export const orders = pgTable("orders", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  buyerId: integer("buyerId").notNull(),
  sellerId: integer("sellerId").notNull(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  totalAmount: integer("totalAmount").notNull(), // Store in cents/satang
  commissionAmount: integer("commissionAmount").notNull(),
  sellerAmount: integer("sellerAmount").notNull(),
  status: orderStatusEnum("status").default("pending_payment").notNull(),
  
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
  shippingProvider: shippingProviderEnum("shippingProvider"),
  shippingStatus: text("shippingStatus"), // JSON from tracking API
  
  // Timestamps
  paidAt: timestamp("paidAt"),
  shippedAt: timestamp("shippedAt"),
  deliveredAt: timestamp("deliveredAt"),
  confirmedAt: timestamp("confirmedAt"), // Buyer confirms delivery
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items table
 */
export const orderItems = pgTable("orderItems", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer("orderId").notNull(),
  productId: integer("productId").notNull(),
  productName: varchar("productName", { length: 500 }).notNull(),
  productImage: text("productImage"),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(), // Price at time of purchase
  subtotal: integer("subtotal").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Transactions table (wallet history)
 */
export const transactions = pgTable("transactions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").notNull(),
  type: transactionTypeEnum("type").notNull(),
  amount: integer("amount").notNull(), // Positive or negative
  balanceAfter: integer("balanceAfter").notNull(),
  refNumber: varchar("refNumber", { length: 50 }), // For PromptPay verification
  relatedOrderId: integer("relatedOrderId"),
  status: transactionStatusEnum("status").default("pending").notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Cart items table
 */
export const cartItems = pgTable("cartItems", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").notNull(),
  productId: integer("productId").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/**
 * Messages table (chat)
 */
export const messages = pgTable("messages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  senderId: integer("senderId").notNull(),
  receiverId: integer("receiverId").notNull(),
  orderId: integer("orderId"), // Optional, for order-related chats
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
export const disputes = pgTable("disputes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer("orderId").notNull(),
  userId: integer("userId").notNull(), // Who filed the dispute
  reason: text("reason").notNull(),
  evidence: json("evidence").$type<string[]>(), // Images/documents
  status: disputeStatusEnum("status").default("open").notNull(),
  resolution: text("resolution"),
  resolvedBy: integer("resolvedBy"), // Admin user ID
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Dispute = typeof disputes.$inferSelect;
export type InsertDispute = typeof disputes.$inferInsert;

/**
 * Notifications table
 */
export const notifications = pgTable("notifications", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").notNull(),
  relatedId: integer("relatedId"), // Related order/dispute/etc ID
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Wishlist table
 */
export const wishlist = pgTable("wishlist", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").notNull(),
  productId: integer("productId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Wishlist = typeof wishlist.$inferSelect;
export type InsertWishlist = typeof wishlist.$inferInsert;

/**
 * Withdrawal requests table (for sellers)
 */
export const withdrawalRequests = pgTable("withdrawalRequests", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").notNull(),
  amount: integer("amount").notNull(),
  bankAccountNumber: varchar("bankAccountNumber", { length: 50 }).notNull(),
  bankAccountName: varchar("bankAccountName", { length: 255 }).notNull(),
  bankName: varchar("bankName", { length: 100 }).notNull(),
  status: withdrawalStatusEnum("status").default("pending").notNull(),
  adminNote: text("adminNote"),
  processedBy: integer("processedBy"), // Admin user ID
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type WithdrawalRequest = typeof withdrawalRequests.$inferSelect;
export type InsertWithdrawalRequest = typeof withdrawalRequests.$inferInsert;
