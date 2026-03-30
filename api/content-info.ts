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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const content = await Content.findOne({});
    
    if (!content) {
      return res.status(200).json({ 
        message: 'No content found',
        version: 0
      });
    }

    return res.status(200).json({
      version: content.version || 0,
      lastUpdatedAt: content.lastUpdatedAt,
      lastUpdatedBy: content.lastUpdatedBy
    });
  } catch (error: any) {
    console.error('/api/content-info error:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
