# Vercel Environment Variables Setup Guide

**Project:** darkwebsite (darkwebsitewebdark/darkwebsite)  
**Vercel URL:** https://darkwebsite.vercel.app

---

## Required Environment Variables

### 1. Supabase Variables

```bash
# Supabase Project URL
VITE_SUPABASE_URL=https://rpkfptvgdjxnnfeltuer.supabase.co

# Supabase Anon Key (Public - safe for frontend)
VITE_SUPABASE_ANON_KEY=<your_supabase_anon_key>

# Supabase Service Role Key (Secret - server-side only)
SUPABASE_SERVICE_KEY=<your_supabase_service_role_key>

# Supabase URL (server-side)
SUPABASE_URL=https://rpkfptvgdjxnnfeltuer.supabase.co
```

**Where to find:**
1. Go to https://supabase.com/dashboard/project/rpkfptvgdjxnnfeltuer/settings/api
2. Copy "Project URL" → `VITE_SUPABASE_URL` and `SUPABASE_URL`
3. Copy "anon public" key → `VITE_SUPABASE_ANON_KEY`
4. Copy "service_role" key → `SUPABASE_SERVICE_KEY`

---

### 2. Email Notification (Resend API)

```bash
# Resend API Key for email notifications
RESEND_API_KEY=<your_resend_api_key>
```

**Where to find:**
1. Go to https://resend.com/api-keys
2. Create new API key
3. Copy the key

**Note:** If you don't have Resend account, email notifications will be disabled (non-critical feature).

---

### 3. Application Settings

```bash
# App Title (displayed in browser tab and meta tags)
VITE_APP_TITLE=StreetMarket - E-commerce Marketplace

# App Logo URL (optional)
VITE_APP_LOGO=/logo.png
```

---

## How to Set Environment Variables in Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/darkwebsites-projects/darkwebsite/settings/environment-variables

2. Add each variable:
   - Click "Add New"
   - Enter **Key** (e.g., `VITE_SUPABASE_URL`)
   - Enter **Value** (e.g., `https://rpkfptvgdjxnnfeltuer.supabase.co`)
   - Select **Environment:** Production, Preview, Development (check all)
   - Click "Save"

3. Repeat for all variables above

4. Redeploy:
   - Go to https://vercel.com/darkwebsites-projects/darkwebsite
   - Click "Redeploy" button
   - Wait for deployment to complete

---

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link to project
vercel link

# Add environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_KEY production
vercel env add SUPABASE_URL production
vercel env add RESEND_API_KEY production
vercel env add VITE_APP_TITLE production

# Redeploy
vercel --prod
```

---

## Verification

After setting environment variables and redeploying:

1. Visit https://darkwebsite.vercel.app
2. Check browser console for errors
3. Test login functionality
4. Test product browsing
5. Test cart and checkout

**Expected behavior:**
- ✅ Website loads without errors
- ✅ Login/Register works
- ✅ Products display correctly
- ✅ Cart functionality works
- ✅ Checkout and payment work

---

## Troubleshooting

### Issue: Website shows blank page

**Solution:**
1. Check browser console for errors
2. Verify all `VITE_*` variables are set
3. Redeploy after adding variables

### Issue: Login doesn't work

**Solution:**
1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
2. Check Supabase project is active
3. Verify Supabase Auth is enabled

### Issue: Database operations fail

**Solution:**
1. Verify `SUPABASE_SERVICE_KEY` is set correctly
2. Check Supabase database is running
3. Verify RLS policies are enabled

---

## Security Notes

⚠️ **IMPORTANT:**

1. **Never commit `.env` files** to Git
2. **SUPABASE_SERVICE_KEY** is secret - only use server-side
3. **VITE_SUPABASE_ANON_KEY** is public - safe for frontend
4. **RESEND_API_KEY** is secret - only use server-side

---

## Next Steps

After environment variables are set:

1. ✅ Verify deployment at https://darkwebsite.vercel.app
2. ✅ Test all features
3. ✅ Set up custom domain (optional)
4. ✅ Enable Vercel Analytics (optional)
5. ✅ Set up monitoring (optional)

---

**Last Updated:** 2025-11-15
