# 🚀 Vercel + Supabase Deployment Guide

## Quick Deploy Instructions

### 1. Push to GitHub
```bash
# In medusa-store/ directory
git init
git add .
git commit -m "Initial Medusa backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/medusa-backend.git
git push -u origin main

# In medusa-store-storefront/ directory  
git init
git add .
git commit -m "Initial Next.js storefront"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/medusa-storefront.git
git push -u origin main
```

### 2. Deploy Backend to Vercel
1. Go to [vercel.com](https://vercel.com) → "Add New..." → "Project"
2. Import your `medusa-backend` repository
3. **Framework Preset**: Other
4. **Build Command**: `yarn build`
5. **Output Directory**: `dist`
6. **Install Command**: `yarn install`

#### Environment Variables (Backend):
```
DATABASE_URL=postgresql://postgres:JayDerr_IamRich2028@db.quffivrlmtfxgxcssvoi.supabase.co:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-change-me
COOKIE_SECRET=your-super-secret-cookie-key-change-me
NODE_ENV=production
STORE_CORS=https://your-storefront.vercel.app
ADMIN_CORS=https://your-backend.vercel.app
AUTH_CORS=https://your-backend.vercel.app
```

### 3. Deploy Storefront to Vercel
1. Import your `medusa-storefront` repository
2. **Framework Preset**: Next.js
3. Vercel will auto-detect settings

#### Environment Variables (Storefront):
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.vercel.app
NEXT_PUBLIC_BASE_URL=https://your-storefront.vercel.app
NEXT_PUBLIC_DEFAULT_REGION=us
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_test_your_key
REVALIDATE_SECRET=supersecret-change-for-production
```

### 4. Update CORS Settings
After deployment, update your backend `.env` with the actual URLs and redeploy.

### 5. Run Database Migrations (Production)
```bash
# Set production database URL
export DATABASE_URL="your_supabase_connection_string"

# Run migrations
npx @medusajs/cli@latest db:migrate

# Create admin user
npx @medusajs/cli@latest user -e admin@yourdomain.com -p secure-password

# Seed data (optional)
npx @medusajs/cli@latest exec ./src/scripts/seed.ts
```

## 📋 Post-Deployment Checklist

- [ ] Backend deploys successfully to Vercel
- [ ] Storefront deploys successfully to Vercel  
- [ ] Database migrations run in production
- [ ] Admin user created
- [ ] CORS settings updated with production URLs
- [ ] Admin panel accessible: `https://your-backend.vercel.app/app`
- [ ] Storefront accessible: `https://your-storefront.vercel.app`
- [ ] API health check: `https://your-backend.vercel.app/health`

## 🔧 Troubleshooting

**Serverless Function Timeouts**: Medusa might need optimization for Vercel's 30s limit
**Cold Starts**: First requests might be slow
**Database Connections**: Supabase handles connection pooling

## 🎯 Production Ready!

Your Medusa store will be live at:
- **Admin**: https://your-backend.vercel.app/app
- **Store**: https://your-storefront.vercel.app
- **API**: https://your-backend.vercel.app/store

### Default Admin Login:
- **Email**: admin@medusa-test.com  
- **Password**: supersecret