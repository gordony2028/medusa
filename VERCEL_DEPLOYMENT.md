# Vercel Deployment Guide for Medusa Storefront

## Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository connected to Vercel
- Deployed Medusa backend on Railway (see RAILWAY_DEPLOYMENT.md)

## Deployment Steps

### 1. Storefront Deployment

#### A. Create New Project on Vercel
1. Go to Vercel Dashboard
2. Click "Add New" → "Project"
3. Import your Git repository
4. Select the repository containing your Medusa project

#### B. Configure Project Settings
1. **Framework Preset**: Next.js
2. **Root Directory**: `packages/medusa/medusa-dev-storefront`
3. **Build Command**: `yarn build`
4. **Output Directory**: `.next`
5. **Install Command**: `yarn install`

#### C. Configure Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```env
# Required - Your Railway backend URL
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-medusa-backend.up.railway.app

# Required - Will be auto-filled by Vercel
NEXT_PUBLIC_BASE_URL=https://your-store.vercel.app

# Optional - Customization
NEXT_PUBLIC_DEFAULT_REGION=us
NEXT_PUBLIC_DEFAULT_COUNTRY_CODE=us

# Search & SEO
NEXT_PUBLIC_SEARCH_ENDPOINT=https://your-medusa-backend.up.railway.app
NEXT_PUBLIC_SEARCH_API_KEY=your-search-api-key

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Cache Revalidation
REVALIDATE_WINDOW=10
```

#### D. Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Access your storefront at the provided Vercel URL

### 2. Configure CORS on Backend

Update your Railway backend environment variables to allow your Vercel frontend:

```env
STORE_CORS=https://your-storefront.vercel.app,https://your-custom-domain.com
ADMIN_CORS=https://your-storefront.vercel.app
AUTH_CORS=https://your-storefront.vercel.app
```

### 3. Custom Domain Setup

#### On Vercel:
1. Go to Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

#### Update Backend CORS:
Add your custom domain to CORS settings on Railway:
```env
STORE_CORS=https://your-storefront.vercel.app,https://www.yourdomain.com,https://yourdomain.com
```

## Environment Variables Reference

### Essential Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | Your Medusa backend URL | `https://api.railway.app` |
| `NEXT_PUBLIC_BASE_URL` | Your storefront URL | `https://store.vercel.app` |
| `NEXT_PUBLIC_DEFAULT_REGION` | Default region code | `us` |

### Optional Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe publishable key | - |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal client ID | - |
| `NEXT_PUBLIC_SEARCH_ENDPOINT` | Search service endpoint | Backend URL |
| `REVALIDATE_WINDOW` | ISR revalidation (seconds) | `10` |

## Deployment Configurations

### Production Optimization

1. **Enable ISR (Incremental Static Regeneration)**:
```javascript
// In your pages or app directory files
export const revalidate = 10 // Revalidate every 10 seconds
```

2. **Image Optimization**:
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-s3-bucket.s3.amazonaws.com'],
    formats: ['image/avif', 'image/webp'],
  },
}
```

3. **Edge Runtime** (for better performance):
```javascript
// In API routes or pages
export const runtime = 'edge'
```

### Preview Deployments

Vercel automatically creates preview deployments for:
- Pull requests
- Branch pushes

Each gets a unique URL like: `medusa-pr-123.vercel.app`

## Monitoring & Analytics

### Vercel Analytics
1. Enable in Dashboard → Analytics
2. No code changes required
3. Real User Monitoring included

### Speed Insights
1. Enable in Dashboard → Speed Insights
2. Core Web Vitals tracking
3. Performance recommendations

## Troubleshooting

### Common Issues:

1. **404 Errors on Dynamic Routes**
   - Ensure `fallback: 'blocking'` in `getStaticPaths`
   - Check ISR configuration

2. **CORS Errors**
   - Verify backend CORS settings include Vercel URLs
   - Check both preview and production URLs

3. **Build Failures**
   ```bash
   # Common fixes:
   - Clear cache: Vercel Dashboard → Settings → Clear Cache
   - Check Node version matches local
   - Verify all env variables are set
   ```

4. **Slow Initial Load**
   - Enable Edge Runtime for API routes
   - Optimize bundle size
   - Use dynamic imports for heavy components

5. **Environment Variable Issues**
   - Variables prefixed with `NEXT_PUBLIC_` are exposed to browser
   - Rebuild after changing env variables
   - Use different values for preview/production

## CI/CD Pipeline

### Automatic Deployments
Vercel automatically deploys:
- Production: On push to main/master branch
- Preview: On push to any other branch
- PR Preview: On pull request creation/update

### Build Optimization
```json
// vercel.json
{
  "buildCommand": "yarn build",
  "framework": "nextjs",
  "regions": ["iad1"], // Deploy closer to your backend
  "functions": {
    "app/api/route.ts": {
      "maxDuration": 10
    }
  }
}
```

## Performance Best Practices

1. **Static Generation**: Pre-render product pages
2. **Image Optimization**: Use Next.js Image component
3. **Code Splitting**: Dynamic imports for large components
4. **CDN**: Vercel Edge Network included
5. **Caching**: Configure proper cache headers

## Next Steps

1. Set up domain and SSL
2. Configure analytics and monitoring
3. Implement error tracking (Sentry)
4. Set up A/B testing
5. Configure email notifications
6. Implement search functionality
7. Add payment provider keys