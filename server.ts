import express from 'express';
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { Application } from './src/models/Application.js';
import { Content } from './src/models/Content.js';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_FILE = path.join(process.cwd(), 'content.json');

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // MongoDB Connection
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vendhaninfotechodc_db_user:vendhan12345@cluster0.npltaji.mongodb.net/?appName=Cluster0';
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }

  // Content Management API
  app.get('/api/content', async (req, res) => {
    try {
      // Try to fetch from MongoDB first
      let content = await Content.findOne({});
      
      if (content) {
        return res.json(content.toObject());
      }
      
      // Fallback: Load from JSON file and save to MongoDB
      try {
        const data = await fs.readFile(CONTENT_FILE, 'utf-8');
        const parsedData = JSON.parse(data);
        
        // Create new document in MongoDB
        content = new Content({
          ...parsedData,
          version: 1,
          lastUpdatedAt: new Date(),
          lastUpdatedBy: 'system-initial-sync'
        });
        await content.save();
        console.log('Content synced from JSON file to MongoDB');
        
        return res.json(content.toObject());
      } catch (err) {
        console.error('Error reading content file or syncing to MongoDB:', err);
        return res.status(500).json({ error: 'Failed to read content' });
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      res.status(500).json({ error: 'Failed to fetch content', details: err.message });
    }
  });

  app.post('/api/content', async (req, res) => {
    try {
      const newContent = req.body;
      
      // Basic validation: ensure it's a valid object
      if (typeof newContent !== 'object' || newContent === null) {
        console.error('Invalid content format:', typeof newContent);
        return res.status(400).json({ error: 'Invalid content format' });
      }

      // Update or create in MongoDB with proper error handling
      try {
        let content = await Content.findOne({});
        
        if (content) {
          // Update existing document
          content.hero = newContent.hero || content.hero;
          content.programs = newContent.programs || content.programs;
          content.events = newContent.events || content.events;
          content.achievements = newContent.achievements || content.achievements;
          content.coaches = newContent.coaches || content.coaches;
          content.summer_camp = newContent.summer_camp || content.summer_camp;
          content.lastUpdatedAt = new Date();
          content.lastUpdatedBy = req.headers['x-updated-by'] || 'admin';
          content.version = (content.version || 0) + 1;
          await content.save();
          console.log('Content updated in MongoDB, version:', content.version);
        } else {
          // Create new document
          content = new Content({
            ...newContent,
            lastUpdatedAt: new Date(),
            lastUpdatedBy: req.headers['x-updated-by'] || 'admin',
            version: 1
          });
          await content.save();
          console.log('New content created in MongoDB, version:', content.version);
        }

        // Backup JSON file
        try {
          const currentData = await fs.readFile(CONTENT_FILE, 'utf-8');
          await fs.writeFile(`${CONTENT_FILE}.bak`, currentData);
          console.log('JSON backup created');
        } catch (e) {
          console.warn('Could not create backup:', e.message);
        }

        // Update JSON file
        await fs.writeFile(CONTENT_FILE, JSON.stringify(newContent, null, 2));
        console.log('JSON file updated');
        
        return res.status(200).json({ 
          message: 'Content updated successfully',
          version: content.version,
          lastUpdatedAt: content.lastUpdatedAt,
          lastUpdatedBy: content.lastUpdatedBy
        });
      } catch (mongoErr) {
        console.error('MongoDB update error:', mongoErr.message, mongoErr.stack);
        return res.status(500).json({ error: 'Database error: ' + mongoErr.message });
      }
    } catch (err) {
      console.error('Error updating content:', err.message, err.stack);
      return res.status(500).json({ error: 'Failed to update content: ' + err.message });
    }
  });

  // Get content metadata (version, last update info)
  const contentInfoHandler = async (req: any, res: any) => {
    try {
      const content = await Content.findOne({}, { hero: 0, programs: 0, events: 0, achievements: 0, coaches: 0, summer_camp: 0 });
      if (!content) {
        return res.json({ message: 'No content found', version: 0 });
      }
      res.json({
        version: content.version,
        lastUpdatedAt: content.lastUpdatedAt,
        lastUpdatedBy: content.lastUpdatedBy
      });
    } catch (err) {
      console.error('Error fetching content info:', err);
      res.status(500).json({ error: 'Failed to fetch content info' });
    }
  };

  app.get('/api/content/info', contentInfoHandler);
  app.get('/api/content-info', contentInfoHandler);  // Alias for serverless compatibility

  // Sync content from JSON file to MongoDB
  app.post('/api/content/sync', async (req, res) => {
    try {
      const data = await fs.readFile(CONTENT_FILE, 'utf-8');
      const parsedData = JSON.parse(data);
      
      let content = await Content.findOne({});
      if (content) {
        Object.assign(content, parsedData);
        content.lastUpdatedAt = new Date();
        content.lastUpdatedBy = 'sync-from-file';
        content.version = (content.version || 1) + 1;
        await content.save();
      } else {
        content = new Content({
          ...parsedData,
          lastUpdatedAt: new Date(),
          lastUpdatedBy: 'sync-from-file',
          version: 1
        });
        await content.save();
      }
      
      res.json({ 
        message: 'Content synced successfully from JSON to MongoDB',
        version: content.version
      });
    } catch (err) {
      console.error('Error syncing content:', err);
      res.status(500).json({ error: 'Failed to sync content' });
    }
  });

  // API Routes
  app.post('/api/applications', async (req, res) => {
    try {
      const { fullName, email, phone, program } = req.body;
      
      const newApplication = new Application({
        fullName,
        email,
        phone,
        program
      });

      await newApplication.save();

      // Send Email Notification (Optional but good practice)
      let emailSent = false;
      let emailError = null;
      
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self for notification
            subject: '📩 New Student Enrollment Request',
            text: `Dear Team,

You have received a new enrollment request. Below are the applicant details:

━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${fullName}
📞 Contact Number: ${phone}
📧 Email Address: ${email}

🎯 Selected Program: ${program}
━━━━━━━━━━━━━━━━━━━━━━━

Kindly follow up with the applicant at the earliest.

Best Regards,
Vendhan Sports Academy`
          };

          // IMPORTANT: Await the email sending to ensure it completes before response
          await transporter.sendMail(mailOptions);
          emailSent = true;
          console.log('Email sent successfully for application:', fullName);
        } catch (emailErr) {
          emailError = emailErr.message;
          console.error('Email error:', emailErr);
        }
      }

      res.status(201).json({ 
        message: 'Application submitted successfully', 
        data: newApplication,
        emailStatus: emailSent ? 'sent' : (emailError ? `failed: ${emailError}` : 'not configured')
      });
    } catch (err) {
      console.error('Application submission error:', err);
      res.status(500).json({ error: 'Failed to submit application' });
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
