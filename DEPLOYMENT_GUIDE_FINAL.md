# Complete Deployment Guide

## 🚀 Quick Start

Your StreetMarket is ready to deploy to Vercel + Supabase!

### Prerequisites
- ✅ Supabase project created (rpkfptvgdjxnnfeltuer)
- ✅ GitHub repository connected
- ✅ Vercel account ready

---

## 📋 Deployment Steps

### 1. Vercel Deployment

```bash
# Already connected to GitHub
# Auto-deploy is enabled
# Just push to main branch:

git add .
git commit -m "Ready for production"
git push origin main
```

### 2. Environment Variables

Add these to Vercel Dashboard:

```
SUPABASE_URL=https://rpkfptvgdjxnnfeltuer.supabase.co
SUPABASE_ANON_KEY=<your_key>
SUPABASE_SERVICE_KEY=<your_key>
DATABASE_URL=<your_connection_string>
NODE_ENV=production
```

### 3. Enable Google OAuth

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google
3. Add production URL to redirect URLs

---

## ✅ Post-Deployment

### Test Everything:
- [ ] User registration
- [ ] Login
- [ ] Browse products
- [ ] Add to cart
- [ ] Checkout
- [ ] Payment

### Monitor:
- Vercel Analytics
- Error logs
- Performance metrics

---

## 🎉 Done!

Your site is live at: https://your-project.vercel.app

