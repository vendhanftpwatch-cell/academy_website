import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import contentData from '../content.json';

// Define Content Schema inline for serverless compatibility
const contentSchema = new mongoose.Schema(
  {
    hero: mongoose.Schema.Types.Mixed,
    programs: mongoose.Schema.Types.Mixed,
    events: mongoose.Schema.Types.Mixed,
    achievements: mongoose.Schema.Types.Mixed,
    coaches: mongoose.Schema.Types.Mixed,
    summer_camp: mongoose.Schema.Types.Mixed,
    lastUpdatedAt: { type: Date, default: Date.now },
    lastUpdatedBy: String,
    version: { type: Number, default: 1 }
  },
  { strict: false }
);

const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      let content = await Content.findOne({});
      
      if (content) {
        return res.status(200).json(content.toObject());
      }
      
      // Return local content.json data when database is empty
      return res.status(200).json(contentData);
    }

    if (req.method === 'POST') {
      const newContent = req.body;
      
      if (!newContent || typeof newContent !== 'object') {
        return res.status(400).json({ error: 'Invalid content' });
      }

      let content = await Content.findOne({});
      
      if (content) {
        Object.assign(content, newContent);
        content.lastUpdatedAt = new Date();
        content.lastUpdatedBy = (req.headers['x-updated-by'] as string) || 'admin';
        content.version = (content.version || 0) + 1;
        await content.save();
      } else {
        content = new Content({
          ...newContent,
          lastUpdatedAt: new Date(),
          lastUpdatedBy: (req.headers['x-updated-by'] as string) || 'admin',
          version: 1
        });
        await content.save();
      }

      return res.status(200).json({
        message: 'Content updated',
        version: content.version,
        lastUpdatedAt: content.lastUpdatedAt
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('/api/content error:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
