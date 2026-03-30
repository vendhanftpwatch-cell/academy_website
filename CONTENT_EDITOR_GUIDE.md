# Content Editor & MongoDB Integration Guide

## Overview

Your website is now fully connected to MongoDB! When you save content through the content editor, it will immediately appear on the live website. The content is persisted in MongoDB and will remain until you manually change it through the content editor or codespace.

## How It Works

### Architecture
```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Live Website   │◄────►│   API Endpoints  │◄────►│    MongoDB      │
│  (React SPA)    │      │  /api/content    │      │   (Cloud DB)    │
└─────────────────┘      └──────────────────┘      └─────────────────┘
         ▲                                                 ▲
         │                                                 │
         └─────────────────────────────────────────────────┘
                    Content Editor saves here
```

### Data Flow
1. **On Page Load**: Website fetches content from MongoDB via `/api/content` GET endpoint
2. **On Save**: Content editor saves to MongoDB via `/api/content` POST endpoint
3. **Live Update**: Website immediately reflects the new content
4. **Backup**: Content is also saved to `content.json` file as a backup

## API Endpoints

### GET /api/content
- **Purpose**: Fetch current content from MongoDB
- **Response**: Full content object with all sections (hero, programs, events, etc.)
- **Example**: `curl http://localhost:5000/api/content`

### POST /api/content
- **Purpose**: Save content to MongoDB
- **Headers**: 
  - `Content-Type: application/json`
  - `x-updated-by: <username>` (optional, defaults to 'admin')
- **Body**: Full content object
- **Response**: Success message with version number and timestamp
- **Example**:
```bash
curl -X POST http://localhost:5000/api/content \
  -H "Content-Type: application/json" \
  -H "x-updated-by: admin" \
  -d '{"hero":{"title":"New Title","subtitle":"New Subtitle"}}'
```

### GET /api/content-info
- **Purpose**: Get content metadata (version, last update time, last editor)
- **Response**: `{ version: number, lastUpdatedAt: string, lastUpdatedBy: string }`

## Using the Content Editor

### Accessing the Editor
1. Open the website in your browser
2. Scroll to the footer section
3. Click the **"Admin Portal"** button (small lightning bolt icon)
4. The content editor will open in a modal

### Editing Content
1. The editor shows the current content as JSON
2. Edit the JSON directly in the textarea
3. Make sure to maintain valid JSON syntax
4. Click **"Save Changes"** to save to MongoDB
5. Click **"Cancel"** to discard changes

### Content Structure
```json
{
  "hero": {
    "badge": "Welcome to Our Academy",
    "title": "VENDHAN SPORTS ACADEMY",
    "subtitle": "Your journey to excellence starts here",
    "slides": ["images/HEROSEC.png", "images/hero2.png"]
  },
  "programs": [
    {
      "id": "yoga",
      "title": "Yoga Classes",
      "tagline": "Find your balance",
      "description": "Expert yoga training for all levels",
      "image": "images/yoga1.png",
      "benefits": ["Flexibility", "Strength", "Mindfulness"],
      "speciality": "Certified instructors",
      "category": "Wellness"
    }
  ],
  "events": [
    {
      "id": "event1",
      "title": "Annual Sports Day",
      "description": "Join us for our annual sports celebration",
      "date": "2026-04-15"
    }
  ],
  "achievements": [
    {
      "label": "Students Trained",
      "value": "500+",
      "icon": "Users"
    }
  ],
  "coaches": [
    {
      "name": "Coach Ganesh",
      "role": "Head Coach",
      "image": "images/coach_ganesh.png"
    }
  ],
  "summer_camp": {
    "features": [
      {
        "title": "Expert Training",
        "description": "Learn from professional coaches",
        "icon": "Trophy"
      }
    ]
  }
}
```

## Making Changes

### Via Content Editor (Recommended)
1. Click "Admin Portal" in the footer
2. Edit the JSON in the editor
3. Click "Save Changes"
4. Changes appear immediately on the website

### Via Codespace (Advanced)
1. Open `content.json` in the codespace
2. Edit the JSON directly
3. Run the sync command to push to MongoDB:
```bash
curl -X POST http://localhost:5000/api/content/sync
```
4. Or restart the server to pick up changes

### Via API (Programmatic)
```bash
# Save new content
curl -X POST http://localhost:5000/api/content \
  -H "Content-Type: application/json" \
  -d @content.json

# Fetch current content
curl http://localhost:5000/api/content

# Get content metadata
curl http://localhost:5000/api/content-info
```

## Version Control

Each save increments a version number:
- Version 1: Initial content
- Version 2: First edit
- Version 3: Second edit
- etc.

You can see the current version in the content editor header.

## Troubleshooting

### Changes Not Appearing
1. **Check MongoDB Connection**: Look for "Connected to MongoDB" in server logs
2. **Check API Response**: Verify POST request returns success
3. **Hard Refresh**: Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac) to clear cache
4. **Check Console**: Open browser DevTools and check for errors

### Invalid JSON Error
- The editor validates JSON before saving
- Fix syntax errors in the textarea
- Common issues: missing commas, unclosed brackets, trailing commas

### MongoDB Connection Issues
- Verify `.env` file has correct `MONGODB_URI`
- Check MongoDB Atlas cluster is running
- Verify network access is allowed in MongoDB Atlas

## Best Practices

1. **Always use the Content Editor** for making changes
2. **Test changes** on a staging environment first
3. **Keep backups** of your content (automatic via `content.json.bak`)
4. **Use meaningful version notes** in `x-updated-by` header
5. **Validate JSON** before saving to avoid errors

## File Structure

```
/workspaces/academy_website/
├── content.json              # Current content (auto-updated)
├── content.json.bak          # Backup of previous content
├── server.ts                 # Express server with MongoDB
├── api/
│   ├── content.ts           # Vercel serverless function
│   └── content-info.ts      # Content metadata endpoint
├── src/
│   ├── App.tsx              # Main React app with ContentEditor
│   ├── models/
│   │   └── Content.ts       # MongoDB schema
│   └── lib/
│       └── mongodb.js       # MongoDB connection helper
└── .env                     # Environment variables
```

## Environment Variables

Required in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
PORT=5000
```

## Support

For issues or questions:
1. Check server logs for error messages
2. Verify MongoDB connection in `/api/health` endpoint
3. Review this guide for troubleshooting steps
4. Check `MONGODB_SETUP_GUIDE.md` for MongoDB configuration
