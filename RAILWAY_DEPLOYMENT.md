# Railway Deployment Guide for Medusa

## Prerequisites
- Railway account (https://railway.app)
- GitHub repository connected to Railway
- PostgreSQL database on Railway

## Deployment Steps

### 1. Backend (Medusa Store) Deployment

#### A. Create New Project on Railway
1. Go to Railway Dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select the `medusa-store` directory as the root directory

#### B. Add PostgreSQL Database
1. In your Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Wait for the database to provision

#### C. Configure Environment Variables
Add these environment variables in Railway dashboard:

```env
# Database (automatically set by Railway when you add PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Medusa Configuration
NODE_ENV=production
PORT=9000
JWT_SECRET=your-super-secret-jwt-token-here
COOKIE_SECRET=your-super-secret-cookie-secret-here
ADMIN_CORS=https://your-admin-domain.vercel.app,https://your-store.vercel.app
STORE_CORS=https://your-store.vercel.app
AUTH_CORS=https://your-admin-domain.vercel.app,https://your-store.vercel.app

# Redis (optional but recommended)
REDIS_URL=${{Redis.REDIS_URL}}

# File Storage (start with local, migrate to S3 later)
# For S3 (when ready):
# S3_REGION=us-east-1
# S3_BUCKET=your-bucket-name
# S3_ACCESS_KEY_ID=your-access-key
# S3_SECRET_ACCESS_KEY=your-secret-key
# S3_URL=https://your-bucket.s3.amazonaws.com

# Payment Provider (Stripe example)
# STRIPE_API_KEY=sk_live_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# Email (SendGrid example)
# SENDGRID_API_KEY=SG...
# SENDGRID_FROM=noreply@yourdomain.com
```

#### D. Configure Build & Start Commands
Railway should auto-detect these from package.json, but verify:
- Build Command: `yarn build`
- Start Command: `yarn start`
- Root Directory: `/medusa-store`

#### E. Deploy
1. Push your code to GitHub
2. Railway will automatically deploy
3. Monitor logs in Railway dashboard
4. Access your backend at: `https://your-project.up.railway.app`

### 2. Run Database Migrations
After first deployment, run migrations:

```bash
# In Railway, go to your service
# Open the shell/console
yarn medusa db:migrate
yarn seed # Optional: seed with sample data
```

### 3. Create Admin User
```bash
# In Railway shell
yarn medusa user -e admin@example.com -p your_password
```

## Monitoring & Maintenance

### Health Check
Your health endpoint is available at:
```
https://your-project.up.railway.app/health
```

### Logs
View logs in Railway dashboard or use Railway CLI:
```bash
railway logs
```

### Database Backups
Railway automatically backs up PostgreSQL databases. You can also:
1. Go to your database service
2. Click "Settings" → "Backups"
3. Create manual backups or restore from existing ones

### Scaling
1. Go to your service settings
2. Adjust "Replicas" for horizontal scaling
3. Adjust memory/CPU limits as needed

## Environment-Specific Settings

### Production Optimizations
```env
# Performance
NODE_ENV=production
MEDUSA_WORKER_MODE=worker  # Enable for background jobs
DISABLE_MEDUSA_ADMIN=false  # Set true if hosting admin separately

# Security
ADMIN_CORS=https://admin.yourdomain.com
STORE_CORS=https://store.yourdomain.com
```

### Troubleshooting

#### Common Issues:

1. **Database Connection Failed**
   - Ensure DATABASE_URL is properly set
   - Check if PostgreSQL service is running

2. **CORS Errors**
   - Update ADMIN_CORS and STORE_CORS with your actual domains
   - Include both local and production URLs during development

3. **File Upload Issues**
   - For production, configure S3 or similar object storage
   - Railway's ephemeral filesystem resets on redeploy

4. **Memory Issues**
   - Upgrade to a paid plan for more resources
   - Enable swap memory in service settings

## Next Steps
1. Set up Vercel deployment for storefront
2. Configure custom domain in Railway
3. Set up monitoring (e.g., Sentry, LogRocket)
4. Implement CI/CD pipeline
5. Configure backup strategy