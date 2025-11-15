import { describe, it, expect, beforeAll } from 'vitest';
import { getDb } from '../db';

/**
 * API Tests for StreetMarket
 * 
 * To run tests:
 * pnpm test
 * 
 * To run specific test:
 * pnpm test api.test.ts
 */

describe('Database Connection', () => {
  it('should connect to database', async () => {
    const db = await getDb();
    expect(db).toBeDefined();
  });
});

describe('User Functions', () => {
  let testUserId: number;

  it('should create a new user', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const result = await db
      .insert({
        auth_id: 'test-auth-id-' + Date.now(),
        email: 'test@example.com',
        name: 'Test User',
        role: 'user' as const,
      })
      .into('users')
      .returning('id');

    testUserId = result[0].id;
    expect(testUserId).toBeGreaterThan(0);
  });

  it('should get user by auth_id', async () => {
    const { getUserByAuthId } = await import('../db');
    const user = await getUserByAuthId('test-auth-id-' + testUserId);
    expect(user).toBeDefined();
    expect(user?.email).toBe('test@example.com');
  });

  it('should update user', async () => {
    const { updateUser } = await import('../db');
    await updateUser(testUserId, { name: 'Updated Name' });
    
    const { getUserByAuthId } = await import('../db');
    const user = await getUserByAuthId('test-auth-id-' + testUserId);
    expect(user?.name).toBe('Updated Name');
  });
});

describe('Product Functions', () => {
  it('should get all products', async () => {
    const { getAllProducts } = await import('../db');
    const products = await getAllProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it('should get product by id', async () => {
    const { getProductById } = await import('../db');
    const product = await getProductById(1);
    expect(product).toBeDefined();
    expect(product?.id).toBe(1);
  });

  it('should search products', async () => {
    const { searchProducts } = await import('../db');
    const results = await searchProducts('iPhone');
    expect(Array.isArray(results)).toBe(true);
  });
});

describe('Category Functions', () => {
  it('should get all categories', async () => {
    const { getAllCategories } = await import('../db');
    const categories = await getAllCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it('should get products by category', async () => {
    const { getProductsByCategory } = await import('../db');
    const products = await getProductsByCategory(1);
    expect(Array.isArray(products)).toBe(true);
  });
});

describe('Cart Functions', () => {
  let testCartItemId: number;

  it('should add item to cart', async () => {
    const { addToCart } = await import('../db');
    const cartItem = await addToCart({
      user_id: 1,
      product_id: 1,
      quantity: 2,
    });
    
    testCartItemId = cartItem.id;
    expect(cartItem).toBeDefined();
    expect(cartItem.quantity).toBe(2);
  });

  it('should get cart items', async () => {
    const { getCartItems } = await import('../db');
    const items = await getCartItems(1);
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  it('should update cart item quantity', async () => {
    const { updateCartItem } = await import('../db');
    await updateCartItem(testCartItemId, { quantity: 3 });
    
    const { getCartItems } = await import('../db');
    const items = await getCartItems(1);
    const updatedItem = items.find(item => item.id === testCartItemId);
    expect(updatedItem?.quantity).toBe(3);
  });

  it('should remove cart item', async () => {
    const { removeCartItem } = await import('../db');
    await removeCartItem(testCartItemId);
    
    const { getCartItems } = await import('../db');
    const items = await getCartItems(1);
    const removedItem = items.find(item => item.id === testCartItemId);
    expect(removedItem).toBeUndefined();
  });
});

describe('Order Functions', () => {
  it('should create order', async () => {
    const { createOrder } = await import('../db');
    const order = await createOrder({
      buyer_id: 1,
      seller_id: 1,
      total_amount: 1000,
      shipping_address: '123 Test St',
      shipping_method: 'standard',
      payment_method: 'wallet',
    });
    
    expect(order).toBeDefined();
    expect(order.total_amount).toBe(1000);
  });

  it('should get user orders', async () => {
    const { getUserOrders } = await import('../db');
    const orders = await getUserOrders(1);
    expect(Array.isArray(orders)).toBe(true);
  });

  it('should update order status', async () => {
    const { updateOrderStatus } = await import('../db');
    await updateOrderStatus(1, 'processing');
    
    const { getOrderById } = await import('../db');
    const order = await getOrderById(1);
    expect(order?.status).toBe('processing');
  });
});

describe('Review Functions', () => {
  it('should create review', async () => {
    const { createReview } = await import('../db');
    const review = await createReview({
      product_id: 1,
      user_id: 1,
      order_id: 1,
      rating: 5,
      comment: 'Great product!',
    });
    
    expect(review).toBeDefined();
    expect(review.rating).toBe(5);
  });

  it('should get product reviews', async () => {
    const { getProductReviews } = await import('../db');
    const reviews = await getProductReviews(1);
    expect(Array.isArray(reviews)).toBe(true);
  });
});

describe('Notification Functions', () => {
  it('should create notification', async () => {
    const { createNotification } = await import('../db');
    const notification = await createNotification({
      user_id: 1,
      title: 'Test Notification',
      message: 'This is a test',
      type: 'info',
    });
    
    expect(notification).toBeDefined();
    expect(notification.title).toBe('Test Notification');
  });

  it('should get user notifications', async () => {
    const { getUserNotifications } = await import('../db');
    const notifications = await getUserNotifications(1);
    expect(Array.isArray(notifications)).toBe(true);
  });

  it('should mark notification as read', async () => {
    const { markNotificationAsRead } = await import('../db');
    await markNotificationAsRead(1);
    
    const { getUserNotifications } = await import('../db');
    const notifications = await getUserNotifications(1);
    const readNotification = notifications.find(n => n.id === 1);
    expect(readNotification?.read).toBe(true);
  });
});

describe('Wishlist Functions', () => {
  it('should add to wishlist', async () => {
    const { addToWishlist } = await import('../db');
    const wishlistItem = await addToWishlist({
      user_id: 1,
      product_id: 2,
    });
    
    expect(wishlistItem).toBeDefined();
  });

  it('should get wishlist', async () => {
    const { getWishlist } = await import('../db');
    const wishlist = await getWishlist(1);
    expect(Array.isArray(wishlist)).toBe(true);
  });

  it('should remove from wishlist', async () => {
    const { removeFromWishlist } = await import('../db');
    await removeFromWishlist(1, 2);
    
    const { getWishlist } = await import('../db');
    const wishlist = await getWishlist(1);
    const removedItem = wishlist.find(item => item.product_id === 2);
    expect(removedItem).toBeUndefined();
  });
});
