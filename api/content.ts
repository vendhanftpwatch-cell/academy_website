import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import { Content } from '../src/models/Content';

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  
  await mongoose.connect(uri);
  isConnected = true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      let content = await Content.findOne({});
      
      if (content) {
        return res.status(200).json(content.toObject());
      }
      
      // Return default structure
      const defaultContent = {
        hero: { badge: '', title: '', subtitle: '', slides: [] },
        programs: [],
        events: [],
        achievements: [],
        coaches: [],
        summer_camp: { features: [] },
        version: 0
      };
      
      return res.status(200).json(defaultContent);
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
