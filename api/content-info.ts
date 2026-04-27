import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const content = await Content.findOne();
    
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
