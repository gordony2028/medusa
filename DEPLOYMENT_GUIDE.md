# Complete Deployment Guide for Medusa

## Quick Start

This guide will help you deploy your Medusa e-commerce platform with:
- **Backend API**: Railway (PostgreSQL + Medusa server)
- **Storefront**: Vercel (Next.js frontend)
- **Admin Dashboard**: Can be hosted on either platform

## Pre-Deployment Checklist

### 1. Generate Secure Secrets
```bash
cd medusa-store
yarn generate:secrets
```
Save the generated secrets securely - you'll need them for Railway.

### 2. Run Deployment Check
```bash
cd medusa-store
yarn deploy:check
```
This will validate your configuration and identify any issues.

## Step 1: Deploy Backend to Railway

### A. Create Railway Project
1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose `medusa-store` as the root directory

### B. Add PostgreSQL
1. In Railway project, click "+ New" → "Database" → "PostgreSQL"
2. Wait for provisioning (DATABASE_URL will be auto-configured)

### C. Configure Environment Variables
In Railway dashboard → Variables, add:

```env
# These are automatically set by Railway:
DATABASE_URL=${{Postgres.DATABASE_URL}}
PORT=9000

# Add these manually (use values from yarn generate:secrets):
JWT_SECRET=<your-generated-jwt-secret>
COOKIE_SECRET=<your-generated-cookie-secret>
NODE_ENV=production

# CORS (update with your actual Vercel URLs after deployment):
ADMIN_CORS=http://localhost:7001
STORE_CORS=http://localhost:8000
AUTH_CORS=http://localhost:7001,http://localhost:8000
```

### D. Deploy
1. Push code to GitHub
2. Railway auto-deploys
3. Get your backend URL from Railway (e.g., `https://your-app.up.railway.app`)

### E. Initialize Database
In Railway shell (click on service → Settings → Shell):
```bash
# Run migrations
yarn medusa db:migrate

# Create admin user
yarn medusa user -e admin@example.com -p yourpassword

# Optional: Seed sample data
yarn seed
```

## Step 2: Deploy Storefront to Vercel

### A. Create Vercel Project
1. Go to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your Git repository

### B. Configure Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `packages/medusa/medusa-dev-storefront`
- **Build Command**: `yarn build`
- **Output Directory**: `.next`

### C. Set Environment Variables
In Vercel dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-app.up.railway.app
NEXT_PUBLIC_BASE_URL=https://your-store.vercel.app
NEXT_PUBLIC_DEFAULT_REGION=us
```

### D. Deploy
Click "Deploy" and wait for build completion.

## Step 3: Connect Frontend and Backend

### Update Railway CORS Settings
Go back to Railway and update these variables with your Vercel URLs:

```env
STORE_CORS=https://your-store.vercel.app
ADMIN_CORS=https://your-store.vercel.app
AUTH_CORS=https://your-store.vercel.app
```

Redeploy Railway service for changes to take effect.

## Step 4: Verify Deployment

### Test Endpoints
1. **Health Check**: `https://your-backend.up.railway.app/health`
2. **Store API**: `https://your-backend.up.railway.app/store/products`
3. **Admin API**: `https://your-backend.up.railway.app/admin/products`

### Test Storefront
1. Visit your Vercel URL
2. Products should load from backend
3. Test cart and checkout flow

## Optional Enhancements

### Add Redis Cache (Railway)
1. In Railway, click "+ New" → "Database" → "Redis"
2. Add to environment: `REDIS_URL=${{Redis.REDIS_URL}}`

### Configure Payment Provider
For Stripe:
```env
# Railway (Backend)
STRIPE_API_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Vercel (Frontend)
NEXT_PUBLIC_STRIPE_KEY=pk_live_...
```

### Set Up File Storage (S3)
```env
# Railway
S3_REGION=us-east-1
S3_BUCKET=your-bucket
S3_ACCESS_KEY_ID=AKIA...
S3_SECRET_ACCESS_KEY=...
```

### Add Custom Domain

#### Railway:
1. Go to Settings → Domains
2. Add custom domain
3. Update DNS records

#### Vercel:
1. Go to Settings → Domains
2. Add custom domain
3. Follow DNS instructions

Remember to update CORS settings with new domains!

## Troubleshooting

### Backend Issues

**Database Connection Failed**
- Check DATABASE_URL in Railway variables
- Ensure PostgreSQL service is running
- Try redeploying

**CORS Errors**
- Verify STORE_CORS includes your Vercel URL
- Include both www and non-www versions
- Don't include trailing slashes

**Build Failures**
- Check Node version (requires 20+)
- Review build logs in Railway
- Run `yarn build` locally to test

### Frontend Issues

**Products Not Loading**
- Check NEXT_PUBLIC_MEDUSA_BACKEND_URL
- Verify backend is running
- Check browser console for errors

**Build Failures**
- Clear Vercel cache (Settings → Clear Cache)
- Check all environment variables are set
- Verify Node version compatibility

## Monitoring & Maintenance

### Railway
- View logs: Railway dashboard → Logs
- Monitor usage: Railway dashboard → Metrics
- Database backups: Automatic daily

### Vercel
- Analytics: Dashboard → Analytics
- Speed Insights: Dashboard → Speed Insights
- Function logs: Dashboard → Functions

## Next Steps

1. **Set up monitoring**: Add Sentry for error tracking
2. **Configure email**: Set up SendGrid or SMTP
3. **Add search**: Implement Algolia or MeiliSearch
4. **Enable caching**: Configure Redis for better performance
5. **Set up CI/CD**: GitHub Actions for automated testing
6. **Configure backups**: Set up regular database backups
7. **Add CDN**: Configure CloudFlare for assets

## Support Resources

- [Medusa Documentation](https://docs.medusajs.com)
- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [Discord Community](https://discord.gg/medusajs)

## Commands Reference

### Local Development
```bash
# Backend
cd medusa-store
yarn dev

# Frontend
cd packages/medusa/medusa-dev-storefront
yarn dev
```

### Deployment Helpers
```bash
# Check configuration
yarn deploy:check

# Generate secrets
yarn generate:secrets

# Build locally
yarn build
```

### Database Management
```bash
# Run migrations
yarn medusa db:migrate

# Create migrations
yarn medusa db:generate

# Seed data
yarn seed
```

## Security Reminders

⚠️ **Important**:
- Never commit `.env` files
- Use different secrets for each environment
- Rotate secrets regularly (every 3-6 months)
- Enable 2FA on Railway and Vercel accounts
- Monitor for suspicious activity
- Keep dependencies updated