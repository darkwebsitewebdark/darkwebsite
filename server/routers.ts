import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import * as db from "./db";
import { supabaseAdmin } from "./supabaseAdmin";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

// Seller-only procedure
const sellerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'seller' && ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Seller access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============= USER PROFILE =============
  user: router({
    profile: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserById(ctx.user.id);
    }),

    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        profileImage: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.updateUserProfile(ctx.user.id, input);
      }),

    linkBankAccount: protectedProcedure
      .input(z.object({
        bankAccountNumber: z.string(),
        bankAccountName: z.string(),
        bankName: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Verify bank account name matches ID card name
        return db.updateUserProfile(ctx.user.id, input);
      }),

    uploadIdCard: protectedProcedure
      .input(z.object({
        idCardNumber: z.string(),
        idCardImageBase64: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Upload image to S3
        const buffer = Buffer.from(input.idCardImageBase64, 'base64');
        const fileKey = `id-cards/${ctx.user.id}-${Date.now()}.jpg`;
        const { url } = await storagePut(fileKey, buffer, 'image/jpeg');

        // Update user profile
        return db.updateUserProfile(ctx.user.id, {
          idCardNumber: input.idCardNumber,
          idCardImageUrl: url,
        });
      }),

    wallet: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      return {
        balance: user?.walletBalance || 0,
      };
    }),

    transactions: protectedProcedure
      .input(z.object({
        limit: z.number().optional().default(50),
      }))
      .query(async ({ ctx, input }) => {
        return db.getTransactions(ctx.user.id, input.limit);
      }),
  }),

  // ============= SELLER APPLICATION =============
  seller: router({
    applyForSeller: protectedProcedure
      .input(z.object({
        idCardImageBase64: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if already applied
        const existing = await db.getSellerApplication(ctx.user.id);
        if (existing && existing.status === 'pending') {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'You already have a pending application' 
          });
        }
        if (existing && existing.status === 'approved') {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'You are already a seller' 
          });
        }

        // Upload ID card image
        const buffer = Buffer.from(input.idCardImageBase64, 'base64');
        const fileKey = `seller-applications/${ctx.user.id}-${Date.now()}.jpg`;
        const { url } = await storagePut(fileKey, buffer, 'image/jpeg');

        // Create application
        const application = await db.createSellerApplication({
          userId: ctx.user.id,
          idCardImageUrl: url,
        });

        // Notify admin
        await db.createNotification({
          userId: 1, // Admin user ID (should be dynamic)
          title: 'New Seller Application',
          message: `User ${ctx.user.name} has applied to become a seller`,
          type: 'system',
          relatedId: application.id,
        });

        return application;
      }),

    application: protectedProcedure.query(async ({ ctx }) => {
      return db.getSellerApplication(ctx.user.id);
    }),

    dashboard: sellerProcedure.query(async ({ ctx }) => {
      // Get seller's products
      const productsList = await db.getProducts({ sellerId: ctx.user.id });
      
      // TODO: Get sales statistics
      
      return {
        products: productsList,
        stats: {
          totalProducts: productsList.length,
          totalSales: 0,
          totalRevenue: 0,
        },
      };
    }),
  }),

  // ============= CATEGORIES =============
  categories: router({
    list: publicProcedure.query(async () => {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      return data || [];
    }),

    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { data, error } = await supabaseAdmin
          .from('categories')
          .select('*')
          .eq('id', input.id)
          .single();
        
        if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Category not found' });
        return data;
      }),

    create: adminProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        parentId: z.number().optional(),
        commissionRate: z.number().optional(),
        imageUrl: z.string().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createCategory(input);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        parentId: z.number().optional(),
        commissionRate: z.number().optional(),
        imageUrl: z.string().optional(),
        displayOrder: z.number().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateCategory(id, data);
      }),
  }),

  // ============= PRODUCTS =============
  products: router({
    list: publicProcedure
      .input(z.object({
        category_id: z.number().optional(),
        seller_id: z.number().optional(),
        search: z.string().optional(),
        status: z.string().optional(),
        sort_by: z.enum(['newest', 'popular', 'price_asc', 'price_desc']).optional().default('newest'),
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
      }))
      .query(async ({ input }) => {
        let query = supabaseAdmin
          .from('products')
          .select('*, categories(name)')
          .eq('status', input.status || 'active');

        if (input.category_id) {
          query = query.eq('category_id', input.category_id);
        }

        if (input.seller_id) {
          query = query.eq('seller_id', input.seller_id);
        }

        if (input.search) {
          query = query.or(`name.ilike.%${input.search}%,description.ilike.%${input.search}%`);
        }

        // Sorting
        if (input.sort_by === 'newest') {
          query = query.order('created_at', { ascending: false });
        } else if (input.sort_by === 'popular') {
          query = query.order('sales', { ascending: false });
        } else if (input.sort_by === 'price_asc') {
          query = query.order('price', { ascending: true });
        } else if (input.sort_by === 'price_desc') {
          query = query.order('price', { ascending: false });
        }

        query = query.range(input.offset, input.offset + input.limit - 1);

        const { data, error } = await query;

        if (error) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
        }

        return data || [];
      }),

    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { data, error } = await supabaseAdmin
          .from('products')
          .select('*, categories(name), users!seller_id(name)')
          .eq('id', input.id)
          .single();

        if (error) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
        }

        return data;
      }),

    create: sellerProcedure
      .input(z.object({
        categoryId: z.number(),
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        price: z.number(),
        stock: z.number(),
        images: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createProduct({
          ...input,
          sellerId: ctx.user.id,
        });
      }),

    update: sellerProcedure
      .input(z.object({
        id: z.number(),
        categoryId: z.number().optional(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        stock: z.number().optional(),
        images: z.array(z.string()).optional(),
        status: z.enum(['active', 'inactive', 'outofstock']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        
        // Verify ownership
        const product = await db.getProductById(id);
        if (!product) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
        }
        if (product.sellerId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Not your product' });
        }

        return db.updateProduct(id, data);
      }),

    delete: sellerProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Verify ownership
        const product = await db.getProductById(input.id);
        if (!product) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
        }
        if (product.sellerId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Not your product' });
        }

        await db.deleteProduct(input.id);
        return { success: true };
      }),

    uploadImage: sellerProcedure
      .input(z.object({
        imageBase64: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const buffer = Buffer.from(input.imageBase64, 'base64');
        const fileKey = `products/${ctx.user.id}-${Date.now()}.jpg`;
        const { url } = await storagePut(fileKey, buffer, 'image/jpeg');
        
        return { url };
      }),
  }),

  // ============= CART =============
  cart: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { data, error } = await supabaseAdmin
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', ctx.user.id);
      
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      return data || [];
    }),

    add: protectedProcedure
      .input(z.object({
        productId: z.number(),
        quantity: z.number().optional().default(1),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if item already exists
        const { data: existing } = await supabaseAdmin
          .from('cart_items')
          .select('*')
          .eq('user_id', ctx.user.id)
          .eq('product_id', input.productId)
          .single();

        if (existing) {
          // Update quantity
          const { error } = await supabaseAdmin
            .from('cart_items')
            .update({ quantity: existing.quantity + input.quantity })
            .eq('id', existing.id);
          
          if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
          return { success: true, message: 'เพิ่มจำนวนแล้ว' };
        } else {
          // Insert new item
          const { error } = await supabaseAdmin
            .from('cart_items')
            .insert({
              user_id: ctx.user.id,
              product_id: input.productId,
              quantity: input.quantity
            });
          
          if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
          return { success: true, message: 'เพิ่มสินค้าลงตะกร้าแล้ว' };
        }
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        quantity: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { error } = await supabaseAdmin
          .from('cart_items')
          .update({ quantity: input.quantity })
          .eq('id', input.id);
        
        if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
        return { success: true };
      }),

    remove: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { error } = await supabaseAdmin
          .from('cart_items')
          .delete()
          .eq('id', input.id);
        
        if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
        return { success: true };
      }),

    clear: protectedProcedure.mutation(async ({ ctx }) => {
      const { error } = await supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('user_id', ctx.user.id);
      
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      return { success: true };
    }),
  }),

  // ============= WISHLIST =============
  wishlist: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getWishlist(ctx.user.id);
    }),

    add: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.addToWishlist(ctx.user.id, input.productId);
      }),

    remove: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeFromWishlist(ctx.user.id, input.productId);
        return { success: true };
      }),
  }),

  // ============= NOTIFICATIONS =============
  notifications: router({
    list: protectedProcedure
      .input(z.object({
        limit: z.number().optional().default(50),
      }))
      .query(async ({ ctx, input }) => {
        return db.getNotifications(ctx.user.id, input.limit);
      }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.id);
        return { success: true };
      }),

    markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
      await db.markAllNotificationsAsRead(ctx.user.id);
      return { success: true };
    }),
  }),

  // ============= ADMIN =============
  admin: router({
    sellerApplications: adminProcedure.query(async () => {
      return db.getPendingSellerApplications();
    }),

    approveSellerApplication: adminProcedure
      .input(z.object({
        id: z.number(),
        adminNote: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const application = await db.updateSellerApplication(input.id, {
          status: 'approved',
          adminNote: input.adminNote,
          reviewedBy: ctx.user.id,
          reviewedAt: new Date(),
        });

        // Update user role to seller
        await db.updateUserProfile(application.userId, { role: 'seller' });

        // Notify user
        await db.createNotification({
          userId: application.userId,
          title: 'Seller Application Approved',
          message: 'Congratulations! Your seller application has been approved.',
          type: 'system',
        });

        return application;
      }),

    rejectSellerApplication: adminProcedure
      .input(z.object({
        id: z.number(),
        adminNote: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const application = await db.updateSellerApplication(input.id, {
          status: 'rejected',
          adminNote: input.adminNote,
          reviewedBy: ctx.user.id,
          reviewedAt: new Date(),
        });

        // Notify user
        await db.createNotification({
          userId: application.userId,
          title: 'Seller Application Rejected',
          message: `Your seller application has been rejected. Reason: ${input.adminNote}`,
          type: 'system',
        });

        return application;
      }),
  }),

  // ============= PAYMENT & WALLET =============
  payment: router({
    createTopUpRequest: protectedProcedure
      .input(z.object({
        amount: z.number().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createPaymentRequest } = await import('./promptpay');
        
        // TODO: Get PromptPay ID from environment or settings
        const promptPayId = '0812345678'; // Replace with actual PromptPay number
        
        const paymentRequest = createPaymentRequest(
          ctx.user.id,
          input.amount,
          promptPayId
        );

        // Create pending transaction
        await db.createTransaction({
          userId: ctx.user.id,
          type: 'topup',
          amount: Math.round(paymentRequest.amount * 100), // Convert to cents
          balanceAfter: 0, // Will be updated after payment
          refNumber: paymentRequest.refNumber,
          status: 'pending',
        });

        return paymentRequest;
      }),

    verifyPayment: protectedProcedure
      .input(z.object({
        refNumber: z.string(),
        amount: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { verifyPaymentAmount } = await import('./promptpay');
        
        // Verify amount matches reference
        if (!verifyPaymentAmount(input.amount, input.refNumber)) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'Payment amount does not match reference' 
          });
        }

        // Get transaction
        const transaction = await db.getTransactionByRef(input.refNumber);
        if (!transaction) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Transaction not found' });
        }

        if (transaction.status === 'completed') {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Payment already verified' });
        }

        // Update user wallet
        const user = await db.updateUserWallet(ctx.user.id, transaction.amount);
        
        // Update transaction
        await db.createTransaction({
          userId: ctx.user.id,
          type: 'topup',
          amount: transaction.amount,
          balanceAfter: user?.walletBalance || 0,
          refNumber: input.refNumber,
          status: 'completed',
        });

        // Notify user
        await db.createNotification({
          userId: ctx.user.id,
          title: 'Payment Confirmed',
          message: `Your wallet has been credited with ฿${(transaction.amount / 100).toFixed(2)}`,
          type: 'payment',
        });

        return { success: true, balance: user?.walletBalance || 0 };
      }),

    requestWithdrawal: sellerProcedure
      .input(z.object({
        amount: z.number().min(100),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        
        if (!user?.walletBalance || user.walletBalance < input.amount * 100) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Insufficient balance' });
        }

        if (!user.bankAccountNumber || !user.bankAccountName || !user.bankName) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bank account not linked' });
        }

        // Create withdrawal request
        const withdrawal = await db.createWithdrawalRequest({
          userId: ctx.user.id,
          amount: input.amount * 100,
          bankAccountNumber: user.bankAccountNumber,
          bankAccountName: user.bankAccountName,
          bankName: user.bankName,
        });

        // Deduct from wallet (hold)
        await db.updateUserWallet(ctx.user.id, -input.amount * 100);

        // Create transaction
        await db.createTransaction({
          userId: ctx.user.id,
          type: 'withdrawal',
          amount: -input.amount * 100,
          balanceAfter: (user.walletBalance || 0) - input.amount * 100,
          status: 'pending',
        });

        return withdrawal;
      }),

    withdrawalHistory: sellerProcedure.query(async ({ ctx }) => {
      return db.getUserWithdrawals(ctx.user.id);
    }),
  }),

  // ============= ORDERS =============
  orders: router({
    create: protectedProcedure
      .input(z.object({
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
        })),
        shippingAddress: z.object({
          name: z.string(),
          phone: z.string(),
          address: z.string(),
          province: z.string(),
          district: z.string(),
          subdistrict: z.string(),
          postalCode: z.string(),
        }),
      }))
      .mutation(async ({ ctx, input }) => {
        // Get products and calculate total
        const productIds = input.items.map(item => item.productId);
        const productsList = await db.getProducts({ limit: 100 });
        const productsMap = new Map(productsList.map(p => [p.id, p]));

        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of input.items) {
          const product = productsMap.get(item.productId);
          if (!product) {
            throw new TRPCError({ code: 'NOT_FOUND', message: `Product ${item.productId} not found` });
          }
          if (product.stock < item.quantity) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: `Insufficient stock for ${product.name}` });
          }

          const subtotal = product.price * item.quantity;
          totalAmount += subtotal;

          orderItemsData.push({
            productId: product.id,
            productName: product.name,
            productImage: product.images?.[0],
            quantity: item.quantity,
            price: product.price,
            subtotal,
          });
        }

        // Check wallet balance
        const user = await db.getUserById(ctx.user.id);
        if (!user?.walletBalance || user.walletBalance < totalAmount) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Insufficient wallet balance' });
        }

        // Get seller and commission rate
        const firstProduct = productsMap.get(input.items[0].productId)!;
        const category = await db.getCategoryById(firstProduct.categoryId);
        const commissionRate = category?.commissionRate || 5;
        const commissionAmount = Math.round(totalAmount * commissionRate / 100);
        const sellerAmount = totalAmount - commissionAmount;

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${ctx.user.id}`;

        // Create order
        const order = await db.createOrder({
          buyerId: ctx.user.id,
          sellerId: firstProduct.sellerId,
          orderNumber,
          totalAmount,
          commissionAmount,
          sellerAmount,
          status: 'pending_payment',
          shippingAddress: input.shippingAddress,
        });

        if (!order) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create order' });
        }

        // Create order items
        for (const itemData of orderItemsData) {
          await db.createOrderItem({
            orderId: order.id,
            ...itemData,
          });
        }

        // Deduct from buyer's wallet
        await db.updateUserWallet(ctx.user.id, -totalAmount);

        // Create transaction
        await db.createTransaction({
          userId: ctx.user.id,
          type: 'purchase',
          amount: -totalAmount,
          balanceAfter: (user.walletBalance || 0) - totalAmount,
          relatedOrderId: order.id,
          status: 'completed',
        });

        // Update order status
        await db.updateOrder(order.id, { 
          status: 'paid',
          paidAt: new Date(),
        });

        // Update product stock
        for (const item of input.items) {
          const product = productsMap.get(item.productId)!;
          await db.updateProduct(product.id, {
            stock: product.stock - item.quantity,
            sales: product.sales + item.quantity,
          });
        }

        // Clear cart
        await db.clearCart(ctx.user.id);

        // Notify seller
        await db.createNotification({
          userId: firstProduct.sellerId,
          title: 'New Order',
          message: `You have a new order: ${orderNumber}`,
          type: 'order',
          relatedId: order.id,
        });

        return order;
      }),

    list: protectedProcedure
      .input(z.object({
        role: z.enum(['buyer', 'seller']).optional().default('buyer'),
      }))
      .query(async ({ ctx, input }) => {
        return db.getUserOrders(ctx.user.id, input.role);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.id);
        if (!order) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
        }

        // Verify access
        if (order.buyerId !== ctx.user.id && order.sellerId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }

        const items = await db.getOrderItems(order.id);

        return { ...order, items };
      }),

    updateTracking: sellerProcedure
      .input(z.object({
        orderId: z.number(),
        trackingNumber: z.string(),
        shippingProvider: z.enum(['flash', 'kerry', 'thailandpost', 'jnt']),
      }))
      .mutation(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.orderId);
        if (!order) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
        }

        if (order.sellerId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Not your order' });
        }

        await db.updateOrder(input.orderId, {
          trackingNumber: input.trackingNumber,
          shippingProvider: input.shippingProvider,
          status: 'shipped',
          shippedAt: new Date(),
        });

        // Notify buyer
        await db.createNotification({
          userId: order.buyerId,
          title: 'Order Shipped',
          message: `Your order ${order.orderNumber} has been shipped. Tracking: ${input.trackingNumber}`,
          type: 'order',
          relatedId: order.id,
        });

        return { success: true };
      }),

    confirmDelivery: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.orderId);
        if (!order) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
        }

        if (order.buyerId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Not your order' });
        }

        if (order.status !== 'shipped') {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Order not shipped yet' });
        }

        // Update order
        await db.updateOrder(input.orderId, {
          status: 'delivered',
          deliveredAt: new Date(),
          confirmedAt: new Date(),
        });

        // Credit seller's wallet
        await db.updateUserWallet(order.sellerId, order.sellerAmount);

        // Create transaction for seller
        const seller = await db.getUserById(order.sellerId);
        await db.createTransaction({
          userId: order.sellerId,
          type: 'sale',
          amount: order.sellerAmount,
          balanceAfter: (seller?.walletBalance || 0) + order.sellerAmount,
          relatedOrderId: order.id,
          status: 'completed',
        });

        // Notify seller
        await db.createNotification({
          userId: order.sellerId,
          title: 'Order Completed',
          message: `Order ${order.orderNumber} has been confirmed. ฿${(order.sellerAmount / 100).toFixed(2)} credited to your wallet.`,
          type: 'order',
          relatedId: order.id,
        });

        return { success: true };
      }),

    createReview: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        productId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
        images: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.orderId);
        if (!order) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
        }

        if (order.buyerId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Not your order' });
        }

        if (order.status !== 'delivered') {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Order not delivered yet' });
        }

        // Check if already reviewed
        const existing = await db.getUserReview(ctx.user.id, input.orderId);
        if (existing) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Already reviewed' });
        }

        return db.createReview({
          productId: input.productId,
          userId: ctx.user.id,
          orderId: input.orderId,
          rating: input.rating,
          comment: input.comment,
          images: input.images,
        });
      }),
  }),

  // ============= REVIEWS =============
  reviews: router({
    list: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return db.getProductReviews(input.productId);
      }),
  }),

  // ============= CHAT =============
  chat: router({
    send: protectedProcedure
      .input(z.object({
        receiverId: z.number(),
        message: z.string(),
        orderId: z.number().optional(),
        isSupport: z.boolean().optional().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createMessage({
          senderId: ctx.user.id,
          receiverId: input.receiverId,
          orderId: input.orderId,
          message: input.message,
          isSupport: input.isSupport,
        });

        // Notify receiver
        await db.createNotification({
          userId: input.receiverId,
          title: 'New Message',
          message: `You have a new message`,
          type: 'chat',
        });

        return { success: true };
      }),

    getConversation: protectedProcedure
      .input(z.object({
        userId: z.number(),
        orderId: z.number().optional(),
      }))
      .query(async ({ ctx, input }) => {
        return db.getConversation(ctx.user.id, input.userId, input.orderId);
      }),

    getSupportMessages: protectedProcedure.query(async ({ ctx }) => {
      return db.getSupportMessages(ctx.user.id);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ senderId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.markMessagesAsRead(ctx.user.id, input.senderId);
        return { success: true };
      }),
  }),

  // ============= DISPUTES =============
  disputes: router({
    create: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        reason: z.string(),
        evidence: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.orderId);
        if (!order) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
        }

        if (order.buyerId !== ctx.user.id && order.sellerId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Not your order' });
        }

        // Check if dispute already exists
        const existing = await db.getOrderDispute(input.orderId);
        if (existing) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Dispute already exists' });
        }

        const dispute = await db.createDispute({
          orderId: input.orderId,
          userId: ctx.user.id,
          reason: input.reason,
          evidence: input.evidence,
        });

        // Update order status
        await db.updateOrder(input.orderId, { status: 'disputed' });

        // Notify admin
        await db.createNotification({
          userId: 1, // Admin
          title: 'New Dispute',
          message: `A new dispute has been filed for order ${order.orderNumber}`,
          type: 'dispute',
          relatedId: dispute.id,
        });

        return dispute;
      }),

    list: adminProcedure
      .input(z.object({
        status: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return db.getAllDisputes(input.status);
      }),

    resolve: adminProcedure
      .input(z.object({
        id: z.number(),
        resolution: z.string(),
        refundBuyer: z.boolean().optional().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        const dispute = await db.updateDispute(input.id, {
          status: 'resolved',
          resolution: input.resolution,
          resolvedBy: ctx.user.id,
          resolvedAt: new Date(),
        });

        const order = await db.getOrderById(dispute.orderId);
        if (!order) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
        }

        if (input.refundBuyer) {
          // Refund buyer
          await db.updateUserWallet(order.buyerId, order.totalAmount);
          
          const buyer = await db.getUserById(order.buyerId);
          await db.createTransaction({
            userId: order.buyerId,
            type: 'refund',
            amount: order.totalAmount,
            balanceAfter: (buyer?.walletBalance || 0) + order.totalAmount,
            relatedOrderId: order.id,
            status: 'completed',
          });

          // Update order
          await db.updateOrder(order.id, { status: 'refunded' });

          // Notify buyer
          await db.createNotification({
            userId: order.buyerId,
            title: 'Dispute Resolved - Refund Issued',
            message: `Your dispute has been resolved. ฿${(order.totalAmount / 100).toFixed(2)} has been refunded.`,
            type: 'dispute',
            relatedId: dispute.id,
          });
        } else {
          // Credit seller
          await db.updateUserWallet(order.sellerId, order.sellerAmount);
          
          const seller = await db.getUserById(order.sellerId);
          await db.createTransaction({
            userId: order.sellerId,
            type: 'sale',
            amount: order.sellerAmount,
            balanceAfter: (seller?.walletBalance || 0) + order.sellerAmount,
            relatedOrderId: order.id,
            status: 'completed',
          });

          // Update order
          await db.updateOrder(order.id, { status: 'delivered' });
        }

        // Notify both parties
        await db.createNotification({
          userId: dispute.userId,
          title: 'Dispute Resolved',
          message: `Your dispute has been resolved: ${input.resolution}`,
          type: 'dispute',
          relatedId: dispute.id,
        });

        return dispute;
      }),
  }),

  // Image Upload Router
  image: router({
    upload: protectedProcedure
      .input(
        z.object({
          image: z.string(), // base64 encoded image
          prefix: z.enum(["profiles", "products", "id-cards", "chat"]),
          resize: z
            .object({
              width: z.number(),
              height: z.number(),
            })
            .optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { uploadImage } = await import("./image");
        return uploadImage(input.image, ctx.user.id, input.prefix, {
          resize: input.resize,
        });
      }),

    uploadMultiple: protectedProcedure
      .input(
        z.object({
          images: z.array(z.string()).max(10), // max 10 images
          prefix: z.enum(["profiles", "products", "id-cards", "chat"]),
          resize: z
            .object({
              width: z.number(),
              height: z.number(),
            })
            .optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { uploadMultipleImages } = await import("./image");
        return uploadMultipleImages(input.images, ctx.user.id, input.prefix, {
          resize: input.resize,
        });
      }),

    delete: protectedProcedure
      .input(
        z.object({
          key: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { deleteImage } = await import("./image");
        await deleteImage(input.key);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
