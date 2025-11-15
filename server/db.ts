import { supabase } from './_core/supabase';

// Simple database helper using Supabase client
// All queries use Supabase SDK directly for better type safety and RLS support

export { supabase };

// ============= USER FUNCTIONS =============

export async function getUserById(id: number) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[DB] Error getting user:', error);
    return null;
  }
  
  return data;
}

export async function getUserByAuthId(authId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authId)
    .single();
  
  if (error) {
    console.error('[DB] Error getting user by auth_id:', error);
    return null;
  }
  
  return data;
}

export async function updateUserProfile(userId: number, updates: any) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('[DB] Error updating user:', error);
    throw error;
  }
  
  return data;
}

export async function updateUserWallet(userId: number, amount: number) {
  // Get current balance
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');
  
  const newBalance = (user.wallet_balance || 0) + amount;
  
  return updateUserProfile(userId, { wallet_balance: newBalance });
}

// ============= SELLER APPLICATION FUNCTIONS =============

export async function createSellerApplication(data: any) {
  const { data: application, error } = await supabase
    .from('seller_applications')
    .insert(data)
    .select()
    .single();
  
  if (error) {
    console.error('[DB] Error creating seller application:', error);
    throw error;
  }
  
  return application;
}

export async function getSellerApplication(userId: number) {
  const { data, error } = await supabase
    .from('seller_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
    console.error('[DB] Error getting seller application:', error);
  }
  
  return data;
}

export async function getPendingSellerApplications() {
  const { data, error } = await supabase
    .from('seller_applications')
    .select('*, users(*)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('[DB] Error getting pending applications:', error);
    return [];
  }
  
  return data;
}

export async function updateSellerApplication(id: number, updates: any) {
  const { data, error } = await supabase
    .from('seller_applications')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[DB] Error updating seller application:', error);
    throw error;
  }
  
  return data;
}

// ============= CATEGORY FUNCTIONS =============

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('[DB] Error getting categories:', error);
    return [];
  }
  
  return data;
}

export async function getCategoryById(id: number) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[DB] Error getting category:', error);
    return null;
  }
  
  return data;
}

export async function createCategory(category: any) {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();
  
  if (error) {
    console.error('[DB] Error creating category:', error);
    throw error;
  }
  
  return data;
}

export async function updateCategory(id: number, updates: any) {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[DB] Error updating category:', error);
    throw error;
  }
  
  return data;
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
  let query = supabase
    .from('products')
    .select('*, categories(*), users!products_seller_id_fkey(id, name, profile_image)');
  
  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }
  if (filters?.sellerId) {
    query = query.eq('seller_id', filters.sellerId);
  }
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  query = query.order('created_at', { ascending: false });
  
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('[DB] Error getting products:', error);
    return [];
  }
  
  return data;
}

export async function getProductById(id: number) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), users!products_seller_id_fkey(id, name, profile_image)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[DB] Error getting product:', error);
    return null;
  }
  
  return data;
}

export async function createProduct(product: any) {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
  
  if (error) {
    console.error('[DB] Error creating product:', error);
    throw error;
  }
  
  return data;
}

export async function updateProduct(id: number, updates: any) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[DB] Error updating product:', error);
    throw error;
  }
  
  return data;
}

export async function deleteProduct(id: number) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[DB] Error deleting product:', error);
    throw error;
  }
}

// ============= CART FUNCTIONS =============

export async function getCartItems(userId: number) {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(*, users!products_seller_id_fkey(id, name))')
    .eq('user_id', userId);
  
  if (error) {
    console.error('[DB] Error getting cart items:', error);
    return [];
  }
  
  return data;
}

export async function addToCart(userId: number, productId: number, quantity = 1) {
  // Check if item already exists
  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();
  
  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    // Insert new
    const { data, error } = await supabase
      .from('cart_items')
      .insert({ user_id: userId, product_id: productId, quantity })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

export async function updateCartItem(id: number, quantity: number) {
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function removeFromCart(id: number) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function clearCart(userId: number) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);
  
  if (error) throw error;
}

// ============= ORDER FUNCTIONS =============

export async function createOrder(order: any) {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();
  
  if (error) {
    console.error('[DB] Error creating order:', error);
    throw error;
  }
  
  return data;
}

export async function createOrderItems(items: any[]) {
  const { data, error } = await supabase
    .from('order_items')
    .insert(items)
    .select();
  
  if (error) {
    console.error('[DB] Error creating order items:', error);
    throw error;
  }
  
  return data;
}

export async function getOrders(filters?: {
  buyerId?: number;
  sellerId?: number;
  status?: string;
  limit?: number;
}) {
  let query = supabase
    .from('orders')
    .select('*, order_items(*, products(*))');
  
  if (filters?.buyerId) {
    query = query.eq('buyer_id', filters.buyerId);
  }
  if (filters?.sellerId) {
    query = query.eq('seller_id', filters.sellerId);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  query = query.order('created_at', { ascending: false });
  
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('[DB] Error getting orders:', error);
    return [];
  }
  
  return data;
}

export async function getOrderById(id: number) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*)), users!orders_buyer_id_fkey(*), seller:users!orders_seller_id_fkey(*)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[DB] Error getting order:', error);
    return null;
  }
  
  return data;
}

export async function updateOrder(id: number, updates: any) {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[DB] Error updating order:', error);
    throw error;
  }
  
  return data;
}

// ============= TRANSACTION FUNCTIONS =============

export async function createTransaction(transaction: any) {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single();
  
  if (error) {
    console.error('[DB] Error creating transaction:', error);
    throw error;
  }
  
  return data;
}

export async function getTransactions(userId: number, limit = 50) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('[DB] Error getting transactions:', error);
    return [];
  }
  
  return data;
}

// ============= NOTIFICATION FUNCTIONS =============

export async function createNotification(notification: any) {
  const { error } = await supabase
    .from('notifications')
    .insert(notification);
  
  if (error) {
    console.error('[DB] Error creating notification:', error);
    throw error;
  }
}

export async function getNotifications(userId: number, limit = 50) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('[DB] Error getting notifications:', error);
    return [];
  }
  
  return data;
}

export async function markNotificationAsRead(id: number) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);
  
  if (error) {
    console.error('[DB] Error marking notification as read:', error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(userId: number) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId);
  
  if (error) {
    console.error('[DB] Error marking all notifications as read:', error);
    throw error;
  }
}

// ============= REVIEW FUNCTIONS =============

export async function createReview(review: any) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();
  
  if (error) {
    console.error('[DB] Error creating review:', error);
    throw error;
  }
  
  return data;
}

export async function getProductReviews(productId: number) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, users(id, name, profile_image)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('[DB] Error getting reviews:', error);
    return [];
  }
  
  return data;
}

// ============= WISHLIST FUNCTIONS =============

export async function getWishlist(userId: number) {
  const { data, error } = await supabase
    .from('wishlist')
    .select('*, products(*, users!products_seller_id_fkey(id, name))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('[DB] Error getting wishlist:', error);
    return [];
  }
  
  return data;
}

export async function addToWishlist(userId: number, productId: number) {
  const { data, error } = await supabase
    .from('wishlist')
    .insert({ user_id: userId, product_id: productId })
    .select()
    .single();
  
  if (error) {
    console.error('[DB] Error adding to wishlist:', error);
    throw error;
  }
  
  return data;
}

export async function removeFromWishlist(userId: number, productId: number) {
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
  
  if (error) {
    console.error('[DB] Error removing from wishlist:', error);
    throw error;
  }
}

// ============= MESSAGE FUNCTIONS =============

export async function createMessage(message: any) {
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single();
  
  if (error) {
    console.error('[DB] Error creating message:', error);
    throw error;
  }
  
  return data;
}

export async function getConversation(userId1: number, userId2: number) {
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:users!messages_sender_id_fkey(id, name, profile_image), receiver:users!messages_receiver_id_fkey(id, name, profile_image)')
    .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('[DB] Error getting conversation:', error);
    return [];
  }
  
  return data;
}

// ============= WITHDRAWAL FUNCTIONS =============

export async function createWithdrawalRequest(request: any) {
  const { data, error } = await supabase
    .from('withdrawal_requests')
    .insert(request)
    .select()
    .single();
  
  if (error) {
    console.error('[DB] Error creating withdrawal request:', error);
    throw error;
  }
  
  return data;
}

export async function getWithdrawalRequests(filters?: {
  userId?: number;
  status?: string;
}) {
  let query = supabase
    .from('withdrawal_requests')
    .select('*, users(id, name, email)');
  
  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('[DB] Error getting withdrawal requests:', error);
    return [];
  }
  
  return data;
}

export async function updateWithdrawalRequest(id: number, updates: any) {
  const { data, error } = await supabase
    .from('withdrawal_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[DB] Error updating withdrawal request:', error);
    throw error;
  }
  
  return data;
}

// ============= DISPUTE FUNCTIONS =============

export async function createDispute(dispute: any) {
  const { data, error } = await supabase
    .from('disputes')
    .insert(dispute)
    .select()
    .single();
  
  if (error) {
    console.error('[DB] Error creating dispute:', error);
    throw error;
  }
  
  return data;
}

export async function getDisputes(filters?: {
  userId?: number;
  status?: string;
}) {
  let query = supabase
    .from('disputes')
    .select('*, orders(order_number), users(id, name, email)');
  
  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  query = query.order('created_at', { ascending: false});
  
  const { data, error } = await query;
  
  if (error) {
    console.error('[DB] Error getting disputes:', error);
    return [];
  }
  
  return data;
}

export async function updateDispute(id: number, updates: any) {
  const { data, error } = await supabase
    .from('disputes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[DB] Error updating dispute:', error);
    throw error;
  }
  
  return data;
}

// ============= ADDITIONAL HELPER FUNCTIONS =============

export async function getSupportMessages(limit = 50) {
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:users!messages_sender_id_fkey(id, name, profile_image), receiver:users!messages_receiver_id_fkey(id, name, profile_image)')
    .eq('is_support', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('[DB] Error getting support messages:', error);
    return [];
  }
  
  return data;
}

export async function markMessagesAsRead(userId: number, otherUserId: number) {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('receiver_id', userId)
    .eq('sender_id', otherUserId);
  
  if (error) {
    console.error('[DB] Error marking messages as read:', error);
    throw error;
  }
}

export async function getOrderDispute(orderId: number) {
  const { data, error } = await supabase
    .from('disputes')
    .select('*, orders(order_number), users(id, name, email)')
    .eq('order_id', orderId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('[DB] Error getting order dispute:', error);
  }
  
  return data;
}

export async function getAllDisputes() {
  return getDisputes();
}

export async function getAllUsers(filters?: { role?: string; limit?: number }) {
  let query = supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (filters?.role) {
    query = query.eq('role', filters.role);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('[DB] Error getting users:', error);
    return [];
  }
  
  return data;
}

export async function updateUserRole(userId: number, role: string) {
  return updateUserProfile(userId, { role });
}

export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('[DB] Error getting all categories:', error);
    return [];
  }
  
  return data;
}

export async function deleteCategory(id: number) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[DB] Error deleting category:', error);
    throw error;
  }
}

export async function getAllOrders(filters?: { status?: string; limit?: number }) {
  let query = supabase
    .from('orders')
    .select('*, order_items(*, products(*)), buyer:users!orders_buyer_id_fkey(id, name), seller:users!orders_seller_id_fkey(id, name)')
    .order('created_at', { ascending: false });
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('[DB] Error getting all orders:', error);
    return [];
  }
  
  return data;
}

export async function getPlatformStats() {
  // Get counts from different tables
  const [usersCount, productsCount, ordersCount, transactionsSum] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('transactions').select('amount').eq('type', 'commission')
  ]);
  
  const totalRevenue = transactionsSum.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
  
  return {
    totalUsers: usersCount.count || 0,
    totalProducts: productsCount.count || 0,
    totalOrders: ordersCount.count || 0,
    totalRevenue: totalRevenue
  };
}

export async function getSellerStats(sellerId: number) {
  // Get seller's product IDs first
  const { data: products } = await supabase
    .from('products')
    .select('id')
    .eq('seller_id', sellerId);
  
  const productIds = products?.map(p => p.id) || [];
  
  const [productsCount, ordersData, reviewsData] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('seller_id', sellerId),
    supabase.from('orders').select('total_amount, seller_amount').eq('seller_id', sellerId).eq('status', 'delivered'),
    productIds.length > 0 
      ? supabase.from('reviews').select('rating').in('product_id', productIds)
      : Promise.resolve({ data: [] })
  ]);
  
  const totalSales = ordersData.data?.reduce((sum, o) => sum + (o.seller_amount || 0), 0) || 0;
  const totalOrders = ordersData.data?.length || 0;
  const avgRating = reviewsData.data?.length 
    ? reviewsData.data.reduce((sum, r) => sum + r.rating, 0) / reviewsData.data.length 
    : 0;
  
  return {
    totalProducts: productsCount.count || 0,
    totalOrders,
    totalSales,
    avgRating: Math.round(avgRating * 10) / 10
  };
}

export async function getOrderItems(orderId: number) {
  const { data, error } = await supabase
    .from('order_items')
    .select('*, products(*)')
    .eq('order_id', orderId);
  
  if (error) {
    console.error('[DB] Error getting order items:', error);
    return [];
  }
  
  return data;
}

export async function getUserReview(userId: number, productId: number) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('[DB] Error getting user review:', error);
  }
  
  return data;
}

export async function getUserConversations(userId: number) {
  // Get all unique conversations for a user
  const { data, error } = await supabase
    .from('messages')
    .select('sender_id, receiver_id, created_at')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('[DB] Error getting conversations:', error);
    return [];
  }
  
  // Get unique user IDs
  const userIds = new Set<number>();
  data.forEach(msg => {
    if (msg.sender_id !== userId) userIds.add(msg.sender_id);
    if (msg.receiver_id !== userId) userIds.add(msg.receiver_id);
  });
  
  // Get user details
  const { data: users } = await supabase
    .from('users')
    .select('id, name, profile_image')
    .in('id', Array.from(userIds));
  
  return users || [];
}

export async function getUserWithdrawals(userId: number) {
  return getWithdrawalRequests({ userId });
}

export async function getTransactionByRef(refNumber: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('ref_number', refNumber)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('[DB] Error getting transaction by ref:', error);
  }
  
  return data;
}
