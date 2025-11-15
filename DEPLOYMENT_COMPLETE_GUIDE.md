# Complete Deployment Guide

## 🚀 Deployment to Vercel + Supabase

This guide covers the complete deployment process for StreetMarket from development to production.

---

## 📋 Pre-Deployment Checklist

### 1. Code Quality
- [x] TypeScript errors: 0
- [x] ESLint warnings: Minimal
- [x] All features tested locally
- [x] Database schema finalized
- [x] Environment variables documented

### 2. Database
- [x] Supabase project created
- [x] Database schema applied
- [x] Seed data loaded
- [x] RLS policies configured
- [x] Indexes created

### 3. Authentication
- [x] Supabase Auth configured
- [x] Email provider set up
- [ ] Google OAuth configured (requires production URL)
- [x] Auth flows tested

### 4. Assets
- [x] Product images uploaded
- [x] Logo and favicon ready
- [x] OG images created

### 5. Legal
- [x] Terms of Service page
- [x] Privacy Policy page
- [x] Refund Policy page

---

## 🔧 Step 1: Supabase Configuration

### 1.1 Database Setup

Your Supabase project is already set up:
- **Project ID:** rpkfptvgdjxnnfeltuer
- **Region:** ap-south-1 (Mumbai)
- **Database:** PostgreSQL 17.6.1
- **API URL:** https://rpkfptvgdjxnnfeltuer.supabase.co

### 1.2 Enable Google OAuth

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Get Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://rpkfptvgdjxnnfeltuer.supabase.co/auth/v1/callback`
4. Add your production URL to authorized origins

### 1.3 Configure Email Templates

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Customize templates for:
   - Confirmation email
   - Password reset
   - Magic link

### 1.4 Set up Storage Buckets

```sql
-- Create product_images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Set up RLS policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);
```

---

## 🌐 Step 2: Vercel Deployment

### 2.1 Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository: `darkwebsitewebdark/darkwebsite`
4. Vercel will auto-detect the framework (Vite + Express)

### 2.2 Configure Build Settings

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev"
}
```

### 2.3 Set Environment Variables

Go to Project Settings → Environment Variables and add:

**Supabase:**
```
SUPABASE_URL=https://rpkfptvgdjxnnfeltuer.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
```

**Database:**
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.rpkfptvgdjxnnfeltuer.supabase.co:5432/postgres
```

**App Config:**
```
VITE_APP_TITLE=StreetMarket
VITE_APP_LOGO=/logo.svg
NODE_ENV=production
```

**Security:**
```
JWT_SECRET=your_jwt_secret_here
```

### 2.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Your site will be live at: `https://your-project.vercel.app`

---

## 🔒 Step 3: Security Configuration

### 3.1 Environment Variables Security

- ✅ Never commit `.env` files to Git
- ✅ Use Vercel Environment Variables
- ✅ Rotate secrets regularly
- ✅ Use different keys for dev/prod

### 3.2 CORS Configuration

```typescript
// server/_core/index.ts
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com'
    : 'http://localhost:3000',
  credentials: true,
}));
```

### 3.3 Rate Limiting

```typescript
// server/_core/index.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3.4 SQL Injection Protection

- ✅ Using Supabase client (parameterized queries)
- ✅ Input validation with Zod
- ✅ No raw SQL queries from user input

---

## 🌍 Step 4: Custom Domain (Optional)

### 4.1 Add Domain to Vercel

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `streetmarket.com`)
3. Update DNS records:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### 4.2 Update Supabase Redirect URLs

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your custom domain to:
   - Site URL
   - Redirect URLs

---

## 📊 Step 5: Monitoring & Analytics

### 5.1 Vercel Analytics

- Automatically enabled
- View at: Vercel Dashboard → Analytics

### 5.2 Error Tracking (Optional)

Install Sentry:
```bash
pnpm add @sentry/react @sentry/tracing
```

```typescript
// client/src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

### 5.3 Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

---

## 🧪 Step 6: Post-Deployment Testing

### 6.1 Functional Testing

Test all critical flows:
- [ ] User registration
- [ ] Login (Email + Google)
- [ ] Browse products
- [ ] Search functionality
- [ ] Add to cart
- [ ] Checkout process
- [ ] Payment (PromptPay QR)
- [ ] Order management
- [ ] Seller dashboard
- [ ] Admin dashboard

### 6.2 Performance Testing

Run Lighthouse audit:
```bash
lighthouse https://your-domain.com --view
```

Target scores:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

### 6.3 Security Testing

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] No exposed secrets
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection

### 6.4 Mobile Testing

Test on real devices:
- iPhone (Safari)
- Android (Chrome)
- iPad
- Various screen sizes

---

## 🔄 Step 7: Continuous Deployment

### 7.1 Auto-Deploy from GitHub

Vercel automatically deploys when you push to `main` branch:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel will automatically deploy
```

### 7.2 Preview Deployments

Every pull request gets a preview URL:
- Test changes before merging
- Share with team for review
- Automatic cleanup after merge

### 7.3 Rollback

If something goes wrong:
1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"

---

## 📈 Step 8: SEO & Marketing

### 8.1 Submit to Search Engines

**Google:**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your site
3. Submit sitemap: `https://your-domain.com/sitemap.xml`

**Bing:**
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Submit sitemap

### 8.2 Social Media

Create accounts on:
- Facebook Page
- Instagram
- Twitter/X
- LINE Official Account

### 8.3 Google My Business

1. Create Google My Business listing
2. Verify ownership
3. Add business information
4. Upload photos

---

## 🛠️ Step 9: Maintenance

### 9.1 Regular Updates

- Update dependencies monthly
- Review security advisories
- Monitor error logs
- Check performance metrics

### 9.2 Database Backups

Supabase automatically backs up your database:
- Point-in-time recovery (7 days)
- Daily backups (30 days)

For additional safety:
```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### 9.3 Monitoring Checklist

Weekly:
- [ ] Check error logs
- [ ] Review analytics
- [ ] Monitor uptime
- [ ] Check disk space

Monthly:
- [ ] Update dependencies
- [ ] Review performance
- [ ] Audit security
- [ ] Backup database

---

## 🚨 Troubleshooting

### Build Fails

```bash
# Check build logs in Vercel Dashboard
# Common issues:
# 1. Missing environment variables
# 2. TypeScript errors
# 3. Dependency conflicts

# Fix locally first:
pnpm build
```

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check Supabase status
# https://status.supabase.com/
```

### 500 Internal Server Error

1. Check Vercel Function Logs
2. Check Supabase logs
3. Verify environment variables
4. Check database connection

### Slow Performance

1. Run Lighthouse audit
2. Check Vercel Analytics
3. Optimize images
4. Enable caching
5. Review database queries

---

## 📞 Support

### Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Discord](https://vercel.com/discord)
- Email: support@vercel.com

### Supabase Support
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com/)
- Email: support@supabase.com

---

## ✅ Deployment Complete!

Your StreetMarket is now live! 🎉

**Next Steps:**
1. Share with users
2. Gather feedback
3. Iterate and improve
4. Monitor performance
5. Scale as needed

---

## 📚 Additional Resources

- [Vercel Best Practices](https://vercel.com/docs/concepts/best-practices)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Web.dev](https://web.dev/)

---

**Congratulations on deploying StreetMarket! 🚀**
