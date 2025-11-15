# 🚀 Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Code must be pushed to GitHub
3. **Supabase Project**: Database and Auth configured

---

## Step 1: Connect GitHub to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository: `darkwebsitewebdark/darkwebsite`
5. Click **"Import"**

---

## Step 2: Configure Project Settings

### Framework Preset
- Select: **"Other"** (Custom Express + React)

### Build & Output Settings
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### Root Directory
- Leave as: `.` (root)

---

## Step 3: Environment Variables

Add these environment variables in Vercel Dashboard:

### Supabase Configuration
```
SUPABASE_URL=https://rpkfptvgdjxnnfeltuer.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (ใส่ service_role key)
```

### Frontend Supabase (VITE_*)
```
VITE_SUPABASE_URL=https://rpkfptvgdjxnnfeltuer.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### App Configuration
```
VITE_APP_TITLE=StreetMarket
VITE_APP_LOGO=/logo.svg
JWT_SECRET=your_random_secret_key_here
NODE_ENV=production
```

### S3 Storage (if using)
```
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-southeast-1
AWS_BUCKET_NAME=your_bucket_name
```

---

## Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Vercel will provide a URL: `https://your-project.vercel.app`

---

## Step 5: Configure Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Wait for DNS propagation (5-30 minutes)

---

## Step 6: Enable Auto Deployment

✅ **Already configured!**

Every push to `main` branch will automatically deploy to Vercel.

### Deployment Workflow:
1. Make changes locally
2. Commit: `git commit -m "Your changes"`
3. Push: `git push origin main`
4. Vercel automatically builds and deploys
5. Check deployment status in Vercel Dashboard

---

## Troubleshooting

### Build Fails

**Check Build Logs:**
1. Go to Vercel Dashboard
2. Click on failed deployment
3. View build logs
4. Fix errors and push again

**Common Issues:**
- Missing environment variables → Add in Vercel Dashboard
- TypeScript errors → Fix locally and push
- Dependency issues → Check `package.json`

### Database Connection Issues

**Check Supabase Connection:**
```bash
# Test connection string format
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**Verify:**
- SUPABASE_SERVICE_KEY is correct
- Database is not paused
- Connection pooler is enabled

### Authentication Issues

**Check Supabase Auth:**
1. Go to Supabase Dashboard → Authentication
2. Verify Email provider is enabled
3. Check Site URL is set to your Vercel domain
4. Add Vercel URL to Redirect URLs

---

## Post-Deployment Checklist

- [ ] Website loads correctly
- [ ] Login/Register works
- [ ] Database queries work
- [ ] Image uploads work (if using S3)
- [ ] Google OAuth works (if enabled)
- [ ] All pages are accessible
- [ ] Mobile responsive
- [ ] SSL certificate active (HTTPS)

---

## Monitoring & Maintenance

### View Logs
- Go to Vercel Dashboard → Your Project → Logs
- Real-time logs for debugging

### Analytics
- Vercel provides built-in analytics
- View traffic, performance, errors

### Rollback
If deployment breaks:
1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

---

## Updating the Site

### Method 1: Git Push (Recommended)
```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main
# Vercel auto-deploys
```

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## Important Notes

1. **Service Role Key**: Never expose `SUPABASE_SERVICE_KEY` in client-side code
2. **Environment Variables**: Always use Vercel Dashboard to manage secrets
3. **Database**: Supabase free tier has limits - monitor usage
4. **Builds**: Vercel free tier: 100 builds/month
5. **Bandwidth**: Monitor bandwidth usage

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **GitHub Issues**: Create issue in repository

---

## Next Steps

After successful deployment:

1. **Test thoroughly** - All features should work
2. **Monitor errors** - Check Vercel logs daily
3. **Set up monitoring** - Use Vercel Analytics
4. **Backup database** - Regular Supabase backups
5. **Update documentation** - Keep README current

---

## Production Checklist

Before going live:

- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Seed data loaded (if needed)
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] Error monitoring setup
- [ ] Backup strategy in place
- [ ] Performance tested
- [ ] Security audit done
- [ ] Terms of Service page
- [ ] Privacy Policy page
- [ ] Contact information

---

**Deployment Date**: 2025-11-15  
**Last Updated**: 2025-11-15  
**Version**: 1.0.0
