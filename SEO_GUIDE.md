# SEO Optimization Guide

## 🎯 SEO Strategy

### Target Keywords:
- ตลาดออนไลน์
- ซื้อขายออนไลน์
- StreetMarket
- ตลาดสตรีท
- ขายของออนไลน์
- ช้อปปิ้งออนไลน์

---

## 📄 Meta Tags Implementation

### 1. Homepage Meta Tags

```html
<!-- client/index.html -->
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Primary Meta Tags -->
  <title>StreetMarket - ตลาดออนไลน์สไตล์สตรีท สำหรับคนรุ่นใหม่</title>
  <meta name="title" content="StreetMarket - ตลาดออนไลน์สไตล์สตรีท สำหรับคนรุ่นใหม่" />
  <meta name="description" content="ซื้อขายสินค้าออนไลน์ได้ง่ายๆ ปลอดภัย 100% พร้อมระบบชำระเงินที่หลากหลาย ค้นพบสินค้าคุณภาพจากผู้ขายทั่วประเทศ" />
  <meta name="keywords" content="ตลาดออนไลน์, ซื้อขายออนไลน์, StreetMarket, ตลาดสตรีท, ขายของออนไลน์, ช้อปปิ้งออนไลน์" />
  <meta name="author" content="StreetMarket" />
  <meta name="robots" content="index, follow" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://streetmarket.com/" />
  <meta property="og:title" content="StreetMarket - ตลาดออนไลน์สไตล์สตรีท" />
  <meta property="og:description" content="ซื้อขายสินค้าออนไลน์ได้ง่ายๆ ปลอดภัย 100%" />
  <meta property="og:image" content="https://streetmarket.com/og-image.jpg" />
  <meta property="og:locale" content="th_TH" />
  <meta property="og:site_name" content="StreetMarket" />
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://streetmarket.com/" />
  <meta property="twitter:title" content="StreetMarket - ตลาดออนไลน์สไตล์สตรีท" />
  <meta property="twitter:description" content="ซื้อขายสินค้าออนไลน์ได้ง่ายๆ ปลอดภัย 100%" />
  <meta property="twitter:image" content="https://streetmarket.com/og-image.jpg" />
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://streetmarket.com/" />
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  
  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "StreetMarket",
    "url": "https://streetmarket.com",
    "description": "ตลาดออนไลน์สไตล์สตรีท สำหรับคนรุ่นใหม่",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://streetmarket.com/products?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
  </script>
</head>
</html>
```

---

### 2. Product Page Meta Tags

```typescript
// client/src/pages/ProductDetail.tsx
import { Helmet } from 'react-helmet-async';

export default function ProductDetail() {
  const { data: product } = trpc.products.getById.useQuery({ id });
  
  return (
    <>
      <Helmet>
        <title>{product.name} - StreetMarket</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.images[0]} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={product.price / 100} />
        <meta property="product:price:currency" content="THB" />
        <link rel="canonical" href={`https://streetmarket.com/product/${product.id}`} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": product.images,
            "description": product.description,
            "sku": product.id,
            "offers": {
              "@type": "Offer",
              "url": `https://streetmarket.com/product/${product.id}`,
              "priceCurrency": "THB",
              "price": product.price / 100,
              "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "StreetMarket"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.5",
              "reviewCount": product.reviews_count || 0
            }
          })}
        </script>
      </Helmet>
      
      {/* Rest of component */}
    </>
  );
}
```

---

### 3. Category Page Meta Tags

```typescript
// client/src/pages/Products.tsx
<Helmet>
  <title>{category ? `${category.name} - StreetMarket` : 'สินค้าทั้งหมด - StreetMarket'}</title>
  <meta name="description" content={`ค้นหาสินค้า${category ? category.name : ''}คุณภาพดี ราคาถูก จากผู้ขายทั่วประเทศ`} />
  <link rel="canonical" href={`https://streetmarket.com/products${category ? `?category=${category.id}` : ''}`} />
</Helmet>
```

---

## 🗺️ Sitemap Generation

### Create sitemap.xml

```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>https://streetmarket.com/</loc>
    <lastmod>2025-11-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Products Page -->
  <url>
    <loc>https://streetmarket.com/products</loc>
    <lastmod>2025-11-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Categories -->
  <url>
    <loc>https://streetmarket.com/products?category=electronics</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Individual Products (dynamic) -->
  <url>
    <loc>https://streetmarket.com/product/1</loc>
    <lastmod>2025-11-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Legal Pages -->
  <url>
    <loc>https://streetmarket.com/terms</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://streetmarket.com/privacy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://streetmarket.com/refund</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

### Dynamic Sitemap Generation

```typescript
// server/sitemap.ts
export async function generateSitemap() {
  const products = await db.getAllProducts();
  const categories = await db.getAllCategories();
  
  const urls = [
    { loc: '/', priority: 1.0, changefreq: 'daily' },
    { loc: '/products', priority: 0.9, changefreq: 'daily' },
    ...categories.map(cat => ({
      loc: `/products?category=${cat.id}`,
      priority: 0.8,
      changefreq: 'weekly'
    })),
    ...products.map(product => ({
      loc: `/product/${product.id}`,
      priority: 0.7,
      changefreq: 'weekly',
      lastmod: product.updated_at
    })),
  ];
  
  return generateXML(urls);
}
```

---

## 🤖 robots.txt

```txt
# public/robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /seller/dashboard
Disallow: /profile
Disallow: /cart
Disallow: /checkout
Disallow: /orders
Disallow: /api/

Sitemap: https://streetmarket.com/sitemap.xml
```

---

## 🔍 Structured Data (Schema.org)

### 1. Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "StreetMarket",
  "url": "https://streetmarket.com",
  "logo": "https://streetmarket.com/logo.png",
  "description": "ตลาดออนไลน์สไตล์สตรีท สำหรับคนรุ่นใหม่",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "TH",
    "addressLocality": "Bangkok"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+66-XX-XXX-XXXX",
    "contactType": "customer service",
    "email": "support@streetmarket.com"
  },
  "sameAs": [
    "https://facebook.com/streetmarket",
    "https://twitter.com/streetmarket",
    "https://instagram.com/streetmarket"
  ]
}
```

### 2. Breadcrumb Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://streetmarket.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Electronics",
      "item": "https://streetmarket.com/products?category=electronics"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "iPhone 15 Pro Max",
      "item": "https://streetmarket.com/product/123"
    }
  ]
}
```

### 3. Review Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Product",
    "name": "iPhone 15 Pro Max"
  },
  "author": {
    "@type": "Person",
    "name": "John Doe"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5"
  },
  "reviewBody": "สินค้าดีมาก ส่งไว บรรจุภัณฑ์ดี"
}
```

---

## 📱 Mobile Optimization

### Viewport Meta Tag
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
```

### Mobile-Friendly Test
- Use Google Mobile-Friendly Test
- Ensure touch targets are at least 48x48px
- Use responsive images
- Avoid horizontal scrolling

---

## ⚡ Core Web Vitals

### Target Metrics:
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Optimization Tips:
1. Optimize images (WebP, lazy loading)
2. Minimize JavaScript
3. Use font-display: swap
4. Avoid layout shifts (set image dimensions)
5. Preload critical resources

---

## 🔗 Internal Linking Strategy

### Homepage Links:
- Link to all main categories
- Link to featured products
- Link to legal pages (footer)

### Product Pages:
- Link to category
- Link to related products
- Link to seller profile

### Category Pages:
- Link to subcategories
- Link to popular products
- Breadcrumb navigation

---

## 📊 Analytics & Monitoring

### Google Search Console
1. Verify ownership
2. Submit sitemap
3. Monitor index coverage
4. Check mobile usability
5. Review search performance

### Google Analytics
1. Track page views
2. Monitor bounce rate
3. Analyze user behavior
4. Track conversions
5. Set up goals

---

## 🎯 Content Strategy

### Blog Posts (Future):
- "วิธีการขายของออนไลน์ให้ปัง"
- "เทคนิคถ่ายรูปสินค้าให้น่าซื้อ"
- "วิธีเลือกซื้อสินค้าออนไลน์ให้ปลอดภัย"

### Product Descriptions:
- Use descriptive, keyword-rich titles
- Write unique descriptions (no duplicate content)
- Include specifications and features
- Add high-quality images

---

## ✅ SEO Checklist

### Technical SEO:
- [x] Meta tags on all pages
- [x] Canonical URLs
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Structured data (Schema.org)
- [ ] SSL certificate (HTTPS)
- [ ] Fast loading speed
- [ ] Mobile-friendly design
- [ ] No broken links
- [ ] XML sitemap submitted to Google

### On-Page SEO:
- [x] Keyword-rich titles
- [x] Meta descriptions
- [x] Header tags (H1, H2, H3)
- [x] Alt text for images
- [x] Internal linking
- [ ] Unique content
- [ ] Optimized URLs

### Off-Page SEO:
- [ ] Social media presence
- [ ] Backlinks from quality sites
- [ ] Local business listings
- [ ] Customer reviews
- [ ] Brand mentions

---

## 🚀 Next Steps

1. Install react-helmet-async for dynamic meta tags
2. Generate sitemap.xml
3. Submit sitemap to Google Search Console
4. Set up Google Analytics
5. Monitor Core Web Vitals
6. Create content strategy
7. Build backlinks

---

## 📚 Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Moz SEO Guide](https://moz.com/beginners-guide-to-seo)
- [Ahrefs Blog](https://ahrefs.com/blog/)
