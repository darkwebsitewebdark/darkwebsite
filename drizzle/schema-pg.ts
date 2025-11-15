import { pgTable, serial, varchar, text, timestamp, integer, boolean, jsonb, bigint, uuid } from "drizzle-orm/pg-core";

/**
 * Core user table with Supabase Auth integration
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  authId: uuid("auth_id").unique(), // Supabase Auth user ID
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  role: varchar("role", { length: 20 }).default("user").notNull().$type<"user" | "seller" | "admin">(),
  profileImage: text("profile_image"),
  
  // Bank account info
  bankAccountNumber: varchar("bank_account_number", { length: 50 }),
  bankAccountName: varchar("bank_account_name", { length: 255 }),
  bankName: varchar("bank_name", { length: 100 }),
  
  // ID Card info
  idCardNumber: varchar("id_card_number", { length: 255 }),
  idCardImageUrl: text("id_card_image_url"),
  
  // Wallet
  walletBalance: bigint("wallet_balance", { mode: "number" }).default(0).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Seller applications table
 */
export const sellerApplications = pgTable("seller_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  idCardImageUrl: text("id_card_image_url").notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull().$type<"pending" | "approved" | "rejected">(),
  adminNote: text("admin_note"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SellerApplication = typeof sellerApplications.$inferSelect;
export type InsertSellerApplication = typeof sellerApplications.$inferInsert;

/**
 * Categories table
 */
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  parentId: integer("parent_id"),
  commissionRate: integer("commission_rate").default(5).notNull(),
  imageUrl: text("image_url"),
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Products table
 */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").notNull().references(() => categories.id, { onDelete: "restrict" }),
  name: varchar("name", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull(),
  description: text("description"),
  price: bigint("price", { mode: "number" }).notNull(),
  stock: integer("stock").default(0).notNull(),
  images: jsonb("images").$type<string[]>(),
  status: varchar("status", { length: 20 }).default("active").notNull().$type<"active" | "inactive" | "outofstock">(),
  views: integer("views").default(0).notNull(),
  sales: integer("sales").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Reviews table
 */
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  orderId: integer("order_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  images: jsonb("images").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Orders table
 */
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  buyerId: integer("buyer_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  sellerId: integer("seller_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  totalAmount: bigint("total_amount", { mode: "number" }).notNull(),
  commissionAmount: bigint("commission_amount", { mode: "number" }).notNull(),
  sellerAmount: bigint("seller_amount", { mode: "number" }).notNull(),
  status: varchar("status", { length: 30 }).default("pending_payment").notNull().$type<
    "pending_payment" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "disputed"
  >(),
  
  shippingAddress: jsonb("shipping_address").$type<{
    name: string;
    phone: string;
    address: string;
    province: string;
    district: string;
    subdistrict: string;
    postalCode: string;
  }>().notNull(),
  
  trackingNumber: varchar("tracking_number", { length: 100 }),
  shippingProvider: varchar("shipping_provider", { length: 20 }).$type<"flash" | "kerry" | "thailandpost" | "jnt">(),
  shippingStatus: text("shipping_status"),
  
  paidAt: timestamp("paid_at"),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  confirmedAt: timestamp("confirmed_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items table
 */
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
  productName: varchar("product_name", { length: 500 }).notNull(),
  productImage: text("product_image"),
  quantity: integer("quantity").notNull(),
  price: bigint("price", { mode: "number" }).notNull(),
  subtotal: bigint("subtotal", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Transactions table
 */
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 20 }).notNull().$type<"topup" | "withdrawal" | "purchase" | "sale" | "commission" | "refund">(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  balanceAfter: bigint("balance_after", { mode: "number" }).notNull(),
  refNumber: varchar("ref_number", { length: 50 }),
  relatedOrderId: integer("related_order_id").references(() => orders.id),
  status: varchar("status", { length: 20 }).default("pending").notNull().$type<"pending" | "completed" | "failed">(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Cart items table
 */
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/**
 * Messages table
 */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  receiverId: integer("receiver_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  orderId: integer("order_id").references(() => orders.id, { onDelete: "set null" }),
  message: text("message").notNull(),
  isSupport: boolean("is_support").default(false).notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Disputes table
 */
export const disputes = pgTable("disputes", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  evidence: jsonb("evidence").$type<string[]>(),
  status: varchar("status", { length: 20 }).default("open").notNull().$type<"open" | "investigating" | "resolved" | "closed">(),
  resolution: text("resolution"),
  resolvedBy: integer("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Dispute = typeof disputes.$inferSelect;
export type InsertDispute = typeof disputes.$inferInsert;

/**
 * Notifications table
 */
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 20 }).notNull().$type<"order" | "payment" | "chat" | "system" | "dispute">(),
  relatedId: integer("related_id"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Wishlist table
 */
export const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Wishlist = typeof wishlist.$inferSelect;
export type InsertWishlist = typeof wishlist.$inferInsert;

/**
 * Withdrawal requests table
 */
export const withdrawalRequests = pgTable("withdrawal_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: bigint("amount", { mode: "number" }).notNull(),
  bankAccountNumber: varchar("bank_account_number", { length: 50 }).notNull(),
  bankAccountName: varchar("bank_account_name", { length: 255 }).notNull(),
  bankName: varchar("bank_name", { length: 100 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull().$type<"pending" | "approved" | "rejected" | "completed">(),
  adminNote: text("admin_note"),
  processedBy: integer("processed_by").references(() => users.id),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type WithdrawalRequest = typeof withdrawalRequests.$inferSelect;
export type InsertWithdrawalRequest = typeof withdrawalRequests.$inferInsert;
