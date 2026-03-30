# MongoDB Integration Documentation

## Overview
The content editor is now connected to **MongoDB**. This allows you to:
- Store website content in a cloud database instead of just local JSON files
- Track content versions and update history
- Maintain automatic backups
- Scale the application without file system dependencies

## Architecture

### Backend Changes
- **MongoDB Connection**: Connected to `cluster0.npltaji.mongodb.net` 
- **Content Model**: Created `src/models/Content.ts` with Mongoose schema
- **API Endpoints**: Enhanced `/api/content` to use MongoDB with file fallback

### Frontend Changes
- **Content Editor**: Now displays MongoDB version info and last update timestamp
- **Save Handler**: Sends metadata headers and shows version confirmation
- **Real-time Updates**: Content immediately synced between MongoDB and JSON file

## API Endpoints

### GET `/api/content`
Fetches content from MongoDB. Falls back to JSON file if not found in DB.
```bash
curl http://localhost:3000/api/content
```

### POST `/api/content`
Updates content in MongoDB and maintains JSON file backup.
```bash
curl -X POST http://localhost:3000/api/content \
  -H "Content-Type: application/json" \
  -H "x-updated-by: admin" \
  -d @content.json
```

### GET `/api/content/info`
Fetches content metadata (version, last update time, updated by).
```bash
curl http://localhost:3000/api/content/info
```

### POST `/api/content/sync`
Manually syncs content from JSON file to MongoDB.
```bash
curl -X POST http://localhost:3000/api/content/sync
```

## Environment Variables

Required `.env` file variables:
```env
MONGODB_URI=mongodb+srv://vendhaninfotechodc_db_user:vendhan12345@cluster0.npltaji.mongodb.net/?appName=Cluster0
NODE_ENV=production
PORT=3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Database Schema

```typescript
Content Collection:
{
  hero: { badge, title, subtitle, slides[] }
  programs: [{ id, title, tagline, description, image, benefits[], speciality, category }]
  events: [{ id, title, description, date }]
  achievements: [{ label, value, icon }]
  coaches: [{ name, role, image }]
  summer_camp: { features[] }
  lastUpdatedAt: Date
  lastUpdatedBy: String
  version: Number
}
```

## How It Works

1. **Saving Content**:
   - Editor sends JSON to `/api/content`
   - Backend validates and saves to MongoDB
   - Version incremented automatically
   - JSON file updated as backup
   - User gets success confirmation with version number

2. **Loading Content**:
   - App requests content from `/api/content`
   - If found in MongoDB, returns it
   - If not found, loads from JSON file and syncs to MongoDB
   - Next requests will hit MongoDB directly

3. **Fallback Safety**:
   - JSON file always kept in sync
   - If MongoDB is unavailable, JSON fallback works
   - Can manually trigger sync with `/api/content/sync`

## Features

✓ **Version Control**: Each update increments version number
✓ **Update Tracking**: Logs who updated and when
✓ **Dual Storage**: MongoDB + JSON file backup
✓ **Automatic Sync**: First load syncs JSON to MongoDB
✓ **Error Handling**: Graceful fallback to JSON if DB fails
✓ **Real-time Metadata**: Editor shows current version and timestamp

## Development

### Running Locally
```bash
npm run dev
# Server runs on http://localhost:3000
# Edit content via admin panel
```

### Testing Content Endpoints
```bash
# Get content
curl http://localhost:3000/api/content | jq .

# Get meta info
curl http://localhost:3000/api/content/info | jq .

# Sync from file
curl -X POST http://localhost:3000/api/content/sync | jq .
```

## Production Deployment

### Vercel Deployment
1. Add `MONGODB_URI` to Vercel environment variables
2. Deploy normally: `git push`
3. Server endpoints automatically available at your Vercel domain

### Docker/Self-Hosted
1. Set `MONGODB_URI` environment variable
2. Build: `npm run build`
3. Run: `npm run dev`
4. MongoDB must be accessible from your network

## Troubleshooting

**Issue**: Content not saving
- Check MongoDB connection: `curl http://localhost:3000/api/health`
- Verify `MONGODB_URI` in `.env`
- Check browser console for errors

**Issue**: Slow content loading
- Check MongoDB connection status
- Verify network latency to MongoDB
- Use `/api/content/info` to check sync status

**Issue**: Version mismatch
- Clear browser cache
- Manually sync: `POST /api/content/sync`
- Check MongoDB for duplicate entries

## Security Notes

- ✓ Content editor requires admin password
- ✓ MongoDB credentials in environment only
- ✓ Add authentication middleware for production
- Recommended: Use JWT or API key authentication for `/api/content` endpoints

## Future Enhancements

- [ ] Content versioning history with rollback
- [ ] Multi-user editing with conflict resolution
- [ ] Real-time collaborative editing
- [ ] Content scheduling/publication workflow
- [ ] Audit logs for all changes
