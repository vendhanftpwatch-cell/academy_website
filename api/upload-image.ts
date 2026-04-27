import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import multer from 'multer';
import { Buffer } from 'buffer';

// Configure multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Middleware to handle file upload
export const config = {
  api: {
    bodyParser: false, // Important: Disable body parsing for file uploads
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Use multer middleware to handle the file upload
  try {
    await new Promise((resolve, reject) => {
      upload.single('image')(req as any, res as any, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  } catch (err: any) {
    return res.status(400).json({ error: `File upload failed: ${err.message}` });
  }

  try {
    // Check if file was uploaded
    if (!(req as any).file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    
    // If Vercel Blob is configured, use it
    if (blobToken) {
      try {
        const fileName = `${Date.now()}-${(req as any).file.originalname}`.replace(/\s+/g, '-');
        const blob = await put(fileName, (req as any).file.buffer, {
          access: 'public',
          token: blobToken,
        });
        return res.status(200).json({ url: blob.url });
      } catch (blobErr: any) {
        console.error('Blob upload error:', blobErr);
        // Fall through to fallback storage
      }
    }

    // Fallback: Return a base64 encoded image or error message
    // Since we can't save files locally in Vercel serverless functions,
    // we'll return a base64 encoded string that can be used as a data URL
    const base64Image = (req as any).file.buffer.toString('base64');
    const mimeType = (req as any).file.mimetype || 'application/octet-stream';
    const dataUrl = `data:${mimeType};base64,${base64Image}`;
    
    return res.status(200).json({ 
      url: dataUrl,
      note: 'Using base64 encoded image as fallback. For production, set BLOB_READ_WRITE_TOKEN environment variable.'
    });
  } catch (err: any) {
    console.error('/api/upload-image error:', err);
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
}