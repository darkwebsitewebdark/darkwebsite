import { eq, and, desc, asc, like, or, sql, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  sellerApplications, InsertSellerApplication,
  categories, InsertCategory,
  products, InsertProduct,
  reviews, InsertReview,
  orders, InsertOrder,
  orderItems, InsertOrderItem,
  transactions, InsertTransaction,
  cartItems, InsertCartItem,
  messages, InsertMessage,
  disputes, InsertDispute,
  notifications, InsertNotification,
  wishlist, InsertWishlist,
  withdrawalRequests, InsertWithdrawalRequest
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============= USER FUNCTIONS =============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(users).set(data).where(eq(users.id, userId));
  return getUserById(userId);
}

export async function updateUserWallet(userId: number, amount: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(users)
    .set({ walletBalance: sql`${users.walletBalance} + ${amount}` })
    .where(eq(users.id, userId));
  
  return getUserById(userId);
}

// ============= SELLER APPLICATION FUNCTIONS =============

export async function createSellerApplication(data: InsertSellerApplication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(sellerApplications).values(data);
  
  const result = await db.select()
    .from(sellerApplications)
    .where(eq(sellerApplications.userId, data.userId))
    .orderBy(desc(sellerApplications.createdAt))
    .limit(1);
  
  return result[0];
}

export async function getSellerApplication(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select()
    .from(sellerApplications)
    .where(eq(sellerApplications.userId, userId))
    .orderBy(desc(sellerApplications.createdAt))
    .limit(1);
  
  return result[0];
}

export async function getPendingSellerApplications() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(sellerApplications)
    .where(eq(sellerApplications.status, "pending"))
    .orderBy(desc(sellerApplications.createdAt));
}

export async function updateSellerApplication(id: number, data: Partial<InsertSellerApplication>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(sellerApplications).set(data).where(eq(sellerApplications.id, id));
  
  const result = await db.select()
    .from(sellerApplications)
    .where(eq(sellerApplications.id, id))
    .limit(1);
  
  return result[0];
}

// ============= CATEGORY FUNCTIONS =============

export async function getCategories() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.displayOrder));
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  
  return result[0];
}

export async function createCategory(data: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(categories).values(data);
  
  const result = await db.select()
    .from(categories)
    .where(eq(categories.slug, data.slug))
    .limit(1);
  
  return result[0];
}

export async function updateCategory(id: number, data: Partial<InsertCategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(categories).set(data).where(eq(categories.id, id));
  return getCategoryById(id);
}

// ============= PRODUCT FUNCTIONS =============

export async function getProducts(filters?: {
  categoryId?: number;
  sellerId?: number;
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(products);
  
  const conditions = [];
  if (filters?.categoryId) {
    conditions.push(eq(products.categoryId, filters.categoryId));
  }
  if (filters?.sellerId) {
    conditions.push(eq(products.sellerId, filters.sellerId));
  }
  if (filters?.search) {
    conditions.push(
      or(
        like(products.name, `%${filters.search}%`),
        like(products.description, `%${filters.search}%`)
      )
    );
  }
  if (filters?.status) {
    conditions.push(eq(products.status, filters.status as any));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  query = query.orderBy(desc(products.createdAt)) as any;
  
  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }
  if (filters?.offset) {
    query = query.offset(filters.offset) as any;
  }
  
  return query;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  
  return result[0];
}

export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(products).values(data);
  const insertId = Number(result[0].insertId);
  
  return getProductById(insertId);
}

export async function updateProduct(id: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(products).set(data).where(eq(products.id, id));
  return getProductById(id);
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(products).where(eq(products.id, id));
}

// ============= CART FUNCTIONS =============

export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    id: cartItems.id,
    userId: cartItems.userId,
    productId: cartItems.productId,
    quantity: cartItems.quantity,
    product: products
  })
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));
}

export async function addToCart(data: InsertCartItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if item already exists
  const existing = await db.select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.userId, data.userId),
        eq(cartItems.productId, data.productId)
      )
    )
    .limit(1);
  
  if (existing.length > 0) {
    // Update quantity
    await db.update(cartItems)
      .set({ quantity: sql`${cartItems.quantity} + ${data.quantity || 1}` })
      .where(eq(cartItems.id, existing[0].id));
    
    return existing[0];
  } else {
    // Insert new
    await db.insert(cartItems).values(data);
    
    const result = await db.select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, data.userId),
          eq(cartItems.productId, data.productId)
        )
      )
      .limit(1);
    
    return result[0];
  }
}

export async function updateCartItem(id: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id));
}

export async function removeFromCart(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(cartItems).where(eq(cartItems.id, id));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

// ============= TRANSACTION FUNCTIONS =============

export async function createTransaction(data: InsertTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(transactions).values(data);
  const insertId = Number(result[0].insertId);
  
  const transaction = await db.select()
    .from(transactions)
    .where(eq(transactions.id, insertId))
    .limit(1);
  
  return transaction[0];
}

export async function getTransactions(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.createdAt))
    .limit(limit);
}

export async function getTransactionByRef(refNumber: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select()
    .from(transactions)
    .where(eq(transactions.refNumber, refNumber))
    .limit(1);
  
  return result[0];
}

// ============= NOTIFICATION FUNCTIONS =============

export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(notifications).values(data);
}

export async function getNotifications(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, id));
}

export async function markAllNotificationsAsRead(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.userId, userId));
}

// ============= WISHLIST FUNCTIONS =============

export async function getWishlist(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    id: wishlist.id,
    userId: wishlist.userId,
    productId: wishlist.productId,
    createdAt: wishlist.createdAt,
    product: products
  })
    .from(wishlist)
    .leftJoin(products, eq(wishlist.productId, products.id))
    .where(eq(wishlist.userId, userId))
    .orderBy(desc(wishlist.createdAt));
}

export async function addToWishlist(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if already exists
  const existing = await db.select()
    .from(wishlist)
    .where(
      and(
        eq(wishlist.userId, userId),
        eq(wishlist.productId, productId)
      )
    )
    .limit(1);
  
  if (existing.length > 0) {
    return existing[0];
  }
  
  await db.insert(wishlist).values({ userId, productId });
  
  const result = await db.select()
    .from(wishlist)
    .where(
      and(
        eq(wishlist.userId, userId),
        eq(wishlist.productId, productId)
      )
    )
    .limit(1);
  
  return result[0];
}

export async function removeFromWishlist(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(wishlist)
    .where(
      and(
        eq(wishlist.userId, userId),
        eq(wishlist.productId, productId)
      )
    );
}

// ============= ORDER FUNCTIONS =============

export async function createOrder(data: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(orders).values(data);
  const insertId = Number(result[0].insertId);
  
  return getOrderById(insertId);
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);
  
  return result[0];
}

export async function getOrderByNumber(orderNumber: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  
  return result[0];
}

export async function getUserOrders(userId: number, role: 'buyer' | 'seller' = 'buyer') {
  const db = await getDb();
  if (!db) return [];
  
  const condition = role === 'buyer' 
    ? eq(orders.buyerId, userId)
    : eq(orders.sellerId, userId);
  
  return db.select()
    .from(orders)
    .where(condition)
    .orderBy(desc(orders.createdAt));
}

export async function updateOrder(id: number, data: Partial<InsertOrder>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(orders).set(data).where(eq(orders.id, id));
  return getOrderById(id);
}

export async function createOrderItem(data: InsertOrderItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(orderItems).values(data);
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));
}

// ============= REVIEW FUNCTIONS =============

export async function createReview(data: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(reviews).values(data);
  const insertId = Number(result[0].insertId);
  
  const review = await db.select()
    .from(reviews)
    .where(eq(reviews.id, insertId))
    .limit(1);
  
  return review[0];
}

export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt));
}

export async function getUserReview(userId: number, orderId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select()
    .from(reviews)
    .where(
      and(
        eq(reviews.userId, userId),
        eq(reviews.orderId, orderId)
      )
    )
    .limit(1);
  
  return result[0];
}

// ============= WITHDRAWAL FUNCTIONS =============

export async function createWithdrawalRequest(data: InsertWithdrawalRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(withdrawalRequests).values(data);
  const insertId = Number(result[0].insertId);
  
  const withdrawal = await db.select()
    .from(withdrawalRequests)
    .where(eq(withdrawalRequests.id, insertId))
    .limit(1);
  
  return withdrawal[0];
}

export async function getUserWithdrawals(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(withdrawalRequests)
    .where(eq(withdrawalRequests.userId, userId))
    .orderBy(desc(withdrawalRequests.createdAt));
}

export async function getPendingWithdrawals() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(withdrawalRequests)
    .where(eq(withdrawalRequests.status, 'pending'))
    .orderBy(desc(withdrawalRequests.createdAt));
}

export async function updateWithdrawalRequest(id: number, data: Partial<InsertWithdrawalRequest>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(withdrawalRequests).set(data).where(eq(withdrawalRequests.id, id));
  
  const result = await db.select()
    .from(withdrawalRequests)
    .where(eq(withdrawalRequests.id, id))
    .limit(1);
  
  return result[0];
}

// ============= MESSAGE FUNCTIONS =============

export async function createMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(messages).values(data);
}

export async function getConversation(userId1: number, userId2: number, orderId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [
    or(
      and(
        eq(messages.senderId, userId1),
        eq(messages.receiverId, userId2)
      ),
      and(
        eq(messages.senderId, userId2),
        eq(messages.receiverId, userId1)
      )
    )
  ];
  
  if (orderId) {
    conditions.push(eq(messages.orderId, orderId));
  }
  
  return db.select()
    .from(messages)
    .where(and(...conditions))
    .orderBy(asc(messages.createdAt));
}

export async function getSupportMessages(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(messages)
    .where(
      and(
        eq(messages.isSupport, true),
        or(
          eq(messages.senderId, userId),
          eq(messages.receiverId, userId)
        )
      )
    )
    .orderBy(asc(messages.createdAt));
}

export async function getAllSupportMessages() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(messages)
    .where(eq(messages.isSupport, true))
    .orderBy(desc(messages.createdAt));
}

export async function markMessagesAsRead(userId: number, senderId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(messages)
    .set({ isRead: true })
    .where(
      and(
        eq(messages.receiverId, userId),
        eq(messages.senderId, senderId)
      )
    );
}

// ============= DISPUTE FUNCTIONS =============

export async function createDispute(data: InsertDispute) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(disputes).values(data);
  const insertId = Number(result[0].insertId);
  
  const dispute = await db.select()
    .from(disputes)
    .where(eq(disputes.id, insertId))
    .limit(1);
  
  return dispute[0];
}

export async function getOrderDispute(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select()
    .from(disputes)
    .where(eq(disputes.orderId, orderId))
    .orderBy(desc(disputes.createdAt))
    .limit(1);
  
  return result[0];
}

export async function getAllDisputes(status?: string) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(disputes);
  
  if (status) {
    query = query.where(eq(disputes.status, status as any)) as any;
  }
  
  return query.orderBy(desc(disputes.createdAt));
}

export async function updateDispute(id: number, data: Partial<InsertDispute>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(disputes).set(data).where(eq(disputes.id, id));
  
  const result = await db.select()
    .from(disputes)
    .where(eq(disputes.id, id))
    .limit(1);
  
  return result[0];
}
