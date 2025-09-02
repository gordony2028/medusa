# Environment Variables Configuration

## Overview
This document outlines all environment variables needed for deploying Medusa to Railway (backend) and Vercel (frontend).

## Backend Environment Variables (Railway)

### Required Variables

```env
# Database Configuration
DATABASE_URL=${{Postgres.DATABASE_URL}}  # Automatically provided by Railway

# Security Keys (MUST CHANGE!)
JWT_SECRET=your-super-secret-jwt-token-minimum-32-characters
COOKIE_SECRET=your-super-secret-cookie-minimum-32-characters

# Server Configuration
NODE_ENV=production
PORT=9000

# CORS Configuration (Update with your actual domains)
ADMIN_CORS=https://your-admin.vercel.app,http://localhost:7001
STORE_CORS=https://your-storefront.vercel.app,http://localhost:8000
AUTH_CORS=https://your-storefront.vercel.app,https://your-admin.vercel.app
```

### Optional but Recommended

```env
# Redis Cache (Add Redis service in Railway)
REDIS_URL=${{Redis.REDIS_URL}}

# Worker Mode (for background jobs)
MEDUSA_WORKER_MODE=worker

# File Storage - Local (default)
# No configuration needed for local storage

# File Storage - S3 (production recommended)
S3_REGION=us-east-1
S3_BUCKET=your-medusa-bucket
S3_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
S3_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
S3_URL=https://your-bucket.s3.amazonaws.com
```

### Payment Providers

```env
# Stripe
STRIPE_API_KEY=sk_live_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_CLIENT_ID=AZDx...
PAYPAL_CLIENT_SECRET=EK...
PAYPAL_WEBHOOK_ID=WH-...
```

### Email Configuration

```env
# SendGrid
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM=noreply@yourdomain.com

# SMTP Alternative
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Analytics & Monitoring

```env
# Sentry Error Tracking
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Segment Analytics
SEGMENT_WRITE_KEY=xxx

# DataDog
DD_API_KEY=xxx
DD_APP_KEY=xxx
```

## Frontend Environment Variables (Vercel)

### Required Variables

```env
# Backend Connection (Your Railway URL)
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.up.railway.app

# Frontend URL (Auto-filled by Vercel)
NEXT_PUBLIC_BASE_URL=https://your-storefront.vercel.app

# Default Region
NEXT_PUBLIC_DEFAULT_REGION=us
```

### Optional Variables

```env
# Localization
NEXT_PUBLIC_DEFAULT_COUNTRY_CODE=us
NEXT_PUBLIC_DEFAULT_LOCALE=en-US

# Search
NEXT_PUBLIC_SEARCH_ENDPOINT=${NEXT_PUBLIC_MEDUSA_BACKEND_URL}
NEXT_PUBLIC_SEARCH_API_KEY=your-search-key

# Payment Keys (Public keys only!)
NEXT_PUBLIC_STRIPE_KEY=pk_live_51...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AZDx...

# Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_SEGMENT_KEY=xxx

# Cache Settings
REVALIDATE_WINDOW=10
```

## Security Best Practices

### Do's ✅
1. **Use strong secrets**: Minimum 32 characters for JWT_SECRET and COOKIE_SECRET
2. **Rotate keys regularly**: Change secrets every 3-6 months
3. **Use environment-specific values**: Different values for dev/staging/production
4. **Store secrets securely**: Use Railway/Vercel's encrypted env variable storage
5. **Limit CORS origins**: Only add necessary domains

### Don'ts ❌
1. **Never commit secrets**: Add .env files to .gitignore
2. **Don't use default values**: Always change example secrets
3. **Don't expose private keys**: Only NEXT_PUBLIC_* variables are exposed to browser
4. **Don't share production secrets**: Each environment should have unique values
5. **Don't log sensitive data**: Ensure secrets aren't logged

## Generating Secure Secrets

### Using OpenSSL (Recommended)
```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate COOKIE_SECRET
openssl rand -hex 32
```

### Using Node.js
```javascript
// Generate random secret
require('crypto').randomBytes(32).toString('base64')
```

### Using Online Generators
- https://randomkeygen.com/
- https://passwordsgenerator.net/

## Environment Variable Templates

### Development (.env.local)
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/medusa-store
JWT_SECRET=supersecretdevjwttoken
COOKIE_SECRET=supersecretdevcookiesecret
ADMIN_CORS=http://localhost:7001
STORE_CORS=http://localhost:8000
AUTH_CORS=http://localhost:7001,http://localhost:8000
```

### Staging (.env.staging)
```env
DATABASE_URL=postgres://user:pass@staging-db.railway.app:5432/medusa
JWT_SECRET=<generate-unique-staging-secret>
COOKIE_SECRET=<generate-unique-staging-secret>
ADMIN_CORS=https://staging-admin.vercel.app
STORE_CORS=https://staging-store.vercel.app
AUTH_CORS=https://staging-admin.vercel.app,https://staging-store.vercel.app
```

### Production (.env.production)
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<generate-unique-production-secret>
COOKIE_SECRET=<generate-unique-production-secret>
ADMIN_CORS=https://admin.yourdomain.com
STORE_CORS=https://shop.yourdomain.com
AUTH_CORS=https://admin.yourdomain.com,https://shop.yourdomain.com
REDIS_URL=${{Redis.REDIS_URL}}
# Add production payment, email, and storage configs
```

## Validation Checklist

Before deploying, ensure:

- [ ] All required variables are set
- [ ] Secrets are unique and strong (32+ characters)
- [ ] CORS origins match your deployment URLs
- [ ] Database URL is correctly configured
- [ ] Payment provider keys are set (if using payments)
- [ ] Email configuration is complete (if sending emails)
- [ ] File storage is configured (S3 for production)
- [ ] Frontend URLs point to correct backend
- [ ] Analytics keys are added (if using analytics)

## Troubleshooting

### Common Issues

1. **"Invalid JWT Secret"**
   - Ensure JWT_SECRET is at least 32 characters
   - Check for special characters that might need escaping

2. **CORS Errors**
   - Verify CORS URLs match exactly (including https://)
   - Include both www and non-www versions if needed
   - Don't include trailing slashes

3. **Database Connection Failed**
   - Verify DATABASE_URL format: `postgres://user:pass@host:port/dbname`
   - Check if database service is running
   - Ensure SSL mode if required: `?sslmode=require`

4. **File Upload Not Working**
   - Configure S3 for production (local storage resets on deploy)
   - Check S3 bucket permissions and CORS settings
   - Verify AWS credentials are correct

5. **Email Not Sending**
   - Verify email provider credentials
   - Check sender domain verification
   - Test with email provider's sandbox first