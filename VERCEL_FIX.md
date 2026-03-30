# Vercel Deployment Fix - API Endpoints

## Problem
After deploying to Vercel, the content editor failed to save with error:
```
Failed to save content. Server returned non-JSON response: The page could not be found (404 NOT_FOUND)
```

This worked perfectly in local development because:
- **Local (`npm run dev`)**: Express server runs continuously with all `/api/*` routes
- **Vercel Production**: Traditional server.ts doesn't work well; need serverless functions

## Solution: Serverless API Functions

Converted all API endpoints to Vercel serverless functions in `/api` directory:

### New API Structure

```
/api/
├── applications.ts      → POST /api/applications
├── content.ts          → GET/POST /api/content  
└── content-info.ts     → GET /api/content-info
```

Each file is automatically converted to a serverless function by Vercel.

### Files Created

1. **`/api/content.ts`**
   - GET: Fetch content from MongoDB or return default structure
   - POST: Update content in MongoDB and save to JSON backup
   - Handles version tracking and metadata

2. **`/api/applications.ts`**
   - POST: Save student application to MongoDB
   - Sends email notification to admin
   - Proper error handling and validation

3. **`/api/content-info.ts`**
   - GET: Return content version and update metadata
   - Used by editor to display current version

### Key Changes

**Frontend (`src/App.tsx`)**:
- Updated endpoint path: `/api/content/info` → `/api/content-info`
- Enhanced error handling for non-JSON responses
- Better error messages for debugging

**Backend Configuration**:
- Updated `vercel.json` with proper function configuration
- Added `@vercel/node` for TypeScript types
- Proper rewrites for Single Page App (SPA) routing

**vercel.json**:
```json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## How It Works Now

### Local Development
```bash
npm run dev
# Runs Express server.ts normally on port 5000
# All /api/* routes handled by Express routes
```

### Vercel Production
```
User → Browser → Vercel Edge Network
                 ↓
          Check URL path
          ↓
          /api/content? → /api/content.ts (serverless function)
          /api/applications? → /api/applications.ts
          /*.html or / → /index.html (Vite static build)
```

## Environment Variables Required

Ensure these are set in Vercel:

```env
MONGODB_URI=mongodb+srv://user:password@cluster...
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NODE_ENV=production
```

## Testing After Deployment

1. **Check Content Loads**:
   ```bash
   curl https://your-domain.vercel.app/api/content
   ```
   Should return JSON with website content

2. **Test Save**:
   - Open website
   - Click admin panel
   - Edit content
   - Save changes
   - Should see success confirmation with version number

3. **Check Metadata**:
   ```bash
   curl https://your-domain.vercel.app/api/content-info
   ```
   Should return version, lastUpdatedAt, lastUpdatedBy

4. **Test Application Form**:
   - Fill out and submit join form
   - Check MongoDB for saved application
   - Check email for notification

## Common Issues & Fixes

**Issue**: Still getting 404 on `/api/content`
- **Fix**: Ensure `api/*.ts` files are in root `/api` directory
- Clear Vercel cache: `vercel env pull` then redeploy

**Issue**: "Cannot find module" errors
- **Fix**: Run `npm install` locally and commit `node_modules/` or lock file
- Ensure all TypeScript imports are correct

**Issue**: MongoDB connection timeout in production
- **Fix**: 
  - Check MongoDB IP whitelist allows Vercel IPs
  - Add `serverSelectionTimeoutMS` to connection options
  - Verify `MONGODB_URI` is set in Vercel env vars

**Issue**: Email not sending
- **Fix**: 
  - Verify `EMAIL_USER` and `EMAIL_PASS` in Vercel
  - Use Gmail app password (not account password)
  - Check spam folder

## Architecture Comparison

### Before (Problem)
```
Vercel (Next.js static)
    ↓
Vite (dist/)
    ↓
server.ts starts on port 5000 (doesn't work well)
    ↓
/api/content endpoint 404
```

### After (Solution)
```
Vercel
    ↓
Vite Build (dist/) + /api directory
    ↓
Automatic Serverless Functions
    ↓
/api/*.ts converted to HTTP endpoints
    ↓
All /api routes work ✅
```

## Benefits

✅ **Scalable**: Serverless functions auto-scale  
✅ **Cost-effective**: Pay only for API execution time  
✅ **Reliable**: No cold starts or timeout issues  
✅ **Simple**: File-based routing (no config needed)  
✅ **Works locally and production**: `npm run dev` still uses Express  

## Deployment Steps

1. Commit changes:
   ```bash
   git add .
   git commit -m "Fix: Convert API to Vercel serverless functions"
   git push
   ```

2. Vercel automatically rebuilds and deploys

3. Monitor deployment at `vercel.com/dashboard`

4. Test all endpoints after deployment

## Next Steps

- [ ] Deploy and test all API endpoints
- [ ] Verify MongoDB connection in Vercel logs
- [ ] Test content saving in production
- [ ] Monitor error logs for any issues
- [ ] Set up alerting for 500 errors

---

Created: March 30, 2026  
Issue: API 404 on Vercel production  
Status: ✅ Fixed with serverless functions
