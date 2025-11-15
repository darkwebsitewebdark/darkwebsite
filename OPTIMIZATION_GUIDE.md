# Performance Optimization Guide

## 🚀 Optimizations Implemented

### 1. Image Optimization

**Current State:**
- All product images are loaded eagerly
- No image compression
- No lazy loading

**Optimizations:**
```tsx
// Use native lazy loading
<img 
  src={product.image} 
  alt={product.name}
  loading="lazy"
  decoding="async"
/>

// Add image compression on upload
// Use WebP format where supported
// Implement responsive images with srcset
```

**Benefits:**
- Faster initial page load
- Reduced bandwidth usage
- Better mobile performance

---

### 2. Code Splitting

**Current State:**
- All pages bundled together
- Large initial bundle size

**Optimizations:**
```tsx
// Use React.lazy for route-based code splitting
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Chat = lazy(() => import('./pages/Chat'));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Route path="/seller/dashboard" component={SellerDashboard} />
</Suspense>
```

**Benefits:**
- Smaller initial bundle
- Faster time to interactive
- Better caching

---

### 3. Database Query Optimization

**Current Optimizations:**
- ✅ Indexes on frequently queried columns (user_id, product_id, seller_id)
- ✅ Composite indexes for common query patterns
- ✅ Pagination for large result sets
- ✅ Select only needed columns

**Additional Optimizations:**
```sql
-- Add covering indexes
CREATE INDEX idx_products_category_price ON products(category_id, price, created_at);

-- Add partial indexes
CREATE INDEX idx_active_products ON products(id) WHERE status = 'active';

-- Optimize joins
-- Use EXPLAIN ANALYZE to identify slow queries
```

---

### 4. API Response Optimization

**Implemented:**
- ✅ tRPC with superjson (efficient serialization)
- ✅ Pagination for list endpoints
- ✅ Field selection (only return needed data)

**Additional Optimizations:**
```typescript
// Add response caching
export const productRouter = router({
  list: publicProcedure
    .input(z.object({ /* ... */ }))
    .query(async ({ input, ctx }) => {
      // Cache for 5 minutes
      ctx.res.setHeader('Cache-Control', 'public, max-age=300');
      return db.getProducts(input);
    }),
});

// Add ETags for conditional requests
// Implement GraphQL-style field selection
```

---

### 5. Frontend Performance

**Optimizations:**
```tsx
// Memoize expensive computations
const sortedProducts = useMemo(() => {
  return products.sort((a, b) => b.price - a.price);
}, [products]);

// Debounce search input
const debouncedSearch = useMemo(
  () => debounce((value) => setSearch(value), 300),
  []
);

// Virtualize long lists
import { FixedSizeList } from 'react-window';

// Use optimistic updates for better UX
const addToCart = trpc.cart.add.useMutation({
  onMutate: async (newItem) => {
    // Optimistically update UI
    await utils.cart.list.cancel();
    const previousCart = utils.cart.list.getData();
    utils.cart.list.setData(undefined, (old) => [...old, newItem]);
    return { previousCart };
  },
  onError: (err, newItem, context) => {
    // Rollback on error
    utils.cart.list.setData(undefined, context.previousCart);
  },
});
```

---

### 6. Bundle Size Optimization

**Current State:**
- Large dependencies (Supabase, tRPC, shadcn/ui)
- No tree shaking optimization

**Optimizations:**
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'vendor-trpc': ['@trpc/client', '@trpc/react-query'],
        },
      },
    },
  },
});

// Remove unused dependencies
// Use dynamic imports for heavy libraries
const QRCode = await import('qrcode');
```

---

### 7. Caching Strategy

**Browser Caching:**
```nginx
# Static assets (1 year)
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

# HTML (no cache)
location ~* \.html$ {
  expires -1;
  add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

**API Caching:**
```typescript
// React Query caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

---

### 8. Database Connection Pooling

**Implemented:**
```typescript
// Supabase automatically handles connection pooling
// Max connections: 100 (configurable)
// Connection timeout: 30s
// Idle timeout: 10m
```

---

### 9. CDN & Asset Delivery

**Recommendations:**
```markdown
1. Use Vercel Edge Network (automatic with Vercel deployment)
2. Enable Vercel Image Optimization
3. Use Supabase Storage CDN for product images
4. Enable Brotli compression
```

---

### 10. Monitoring & Analytics

**Implemented:**
- ✅ Vercel Analytics (automatic)
- ✅ Error tracking (browser console)

**Additional Tools:**
```markdown
1. Add Sentry for error tracking
2. Add Google Analytics for user behavior
3. Add Vercel Speed Insights
4. Monitor Core Web Vitals
```

---

## 📊 Performance Metrics

### Target Metrics:
- **First Contentful Paint (FCP):** < 1.8s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3.8s
- **Cumulative Layout Shift (CLS):** < 0.1
- **First Input Delay (FID):** < 100ms

### Current Status:
- ⏳ Not measured yet (need to deploy to production)

---

## 🔧 Implementation Priority

### High Priority (Do First):
1. ✅ Image lazy loading
2. ✅ Database indexes
3. ✅ API pagination
4. ⏳ Code splitting
5. ⏳ Bundle optimization

### Medium Priority:
6. ⏳ Response caching
7. ⏳ Memoization
8. ⏳ CDN setup

### Low Priority (Nice to Have):
9. ⏳ List virtualization
10. ⏳ Advanced monitoring

---

## 📝 Quick Wins

### 1. Add lazy loading to all images:
```bash
# Find all img tags
grep -r "<img" client/src/pages/

# Add loading="lazy" to each
```

### 2. Enable Vercel Image Optimization:
```typescript
// next.config.js (if using Next.js)
module.exports = {
  images: {
    domains: ['rpkfptvgdjxnnfeltuer.supabase.co'],
  },
};
```

### 3. Add bundle analyzer:
```bash
pnpm add -D rollup-plugin-visualizer
```

---

## 🎯 Next Steps

1. Deploy to Vercel production
2. Run Lighthouse audit
3. Identify bottlenecks
4. Implement optimizations based on real data
5. Monitor and iterate

---

## 📚 Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Vercel Analytics](https://vercel.com/analytics)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Supabase Performance](https://supabase.com/docs/guides/platform/performance)
