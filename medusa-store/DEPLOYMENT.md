# Medusa Store Deployment Guide

## 🚀 Deploying to Vercel + Supabase

### Prerequisites
- Supabase project with connection string
- GitHub repository 
- Vercel account

### Step 1: Prepare Supabase Database

1. Get your Supabase connection string from your project settings
2. It should look like: `postgresql://postgres:[password]@[host]:5432/postgres`

### Step 2: Deploy Backend to Vercel

1. **Push to GitHub**: Commit and push this backend project to GitHub
2. **Import in Vercel**: Go to Vercel dashboard → "Add New..." → "Project" → Import your repository
3. **Configure Environment Variables** in Vercel:
   ```
   DATABASE_URL=your_supabase_connection_string
   JWT_SECRET=your-super-secret-jwt-key
   COOKIE_SECRET=your-super-secret-cookie-key
   NODE_ENV=production
   STORE_CORS=https://your-storefront-domain.vercel.app
   ADMIN_CORS=https://your-backend-domain.vercel.app
   AUTH_CORS=https://your-backend-domain.vercel.app
   ```

### Step 3: Deploy Storefront to Vercel

1. **Deploy Storefront**: Import the `medusa-store-storefront` directory as a separate Vercel project
2. **Configure Environment Variables** in Vercel:
   ```
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend-domain.vercel.app
   NEXT_PUBLIC_BASE_URL=https://your-storefront-domain.vercel.app
   ```

### Step 4: Run Database Migrations

After deployment, you'll need to run migrations:

```bash
# Install Medusa CLI globally (if not already installed)
npm install -g @medusajs/cli

# Set your database URL
export DATABASE_URL="your_supabase_connection_string"

# Run migrations
medusa db:migrate

# Seed database (optional)
medusa seed -f ./src/scripts/seed.ts
```

### Step 5: Create Admin User

```bash
medusa user -e admin@medusa-test.com -p supersecret
```

## 📝 Environment Variables Summary

**Backend (.env)**:
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens
- `COOKIE_SECRET` - Secret for cookies
- `STORE_CORS` - Allowed origins for store API
- `ADMIN_CORS` - Allowed origins for admin API  
- `AUTH_CORS` - Allowed origins for auth API

**Storefront (.env.local)**:
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` - Your backend URL
- `NEXT_PUBLIC_BASE_URL` - Your storefront URL

## 🔧 Post-Deployment

1. Update CORS origins with actual deployed URLs
2. Test API endpoints: `https://your-backend.vercel.app/health`
3. Access admin: `https://your-backend.vercel.app/admin`
4. Access storefront: `https://your-storefront.vercel.app`

## 🚨 Important Notes

- First deploy might be slow due to cold starts
- Serverless functions have 30s timeout limit
- Consider using Railway or other platforms for heavy operations