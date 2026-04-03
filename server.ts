import express from 'express';
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_FILE = path.join(process.cwd(), 'content.json');

// --- MongoDB Schemas (Defined here for stability) ---
const applicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  place: { type: String, required: true },
  schoolName: { type: String, required: true },
  program: { type: String, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

const contentSchema = new mongoose.Schema({
  hero: Object,
  programs: Array,
  events: Array,
  achievements: Array,
  achievements_list: Array,
  coaches: Array,
  summer_camp: Object,
  version: { type: Number, default: 1 },
  lastUpdatedAt: { type: Date, default: Date.now },
  lastUpdatedBy: String
});

const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '15mb' })); // Increased limit for large content saves

  // MongoDB Connection
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vendhaninfotechodc_db_user:vendhan12345@cluster0.npltaji.mongodb.net/?appName=Cluster0';
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }

  // --- API ROUTES ---

  // 1. Get All Content (For the website and editor)
  app.get('/api/content', async (req, res) => {
    try {
      let content = await Content.findOne({});
      if (!content) {
        const fileData = await fs.readFile(CONTENT_FILE, 'utf-8');
        return res.json(JSON.parse(fileData));
      }
      res.json(content);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch content' });
    }
  });

  // 2. Save Content (Fixes the "Non-JSON response" error)
  app.post('/api/content', async (req, res) => {
    try {
      const newContent = req.body;
      let content = await Content.findOne({});

      if (content) {
        Object.assign(content, newContent);
        content.version = (content.version || 0) + 1;
        content.lastUpdatedAt = new Date();
        content.lastUpdatedBy = req.headers['x-updated-by'] || 'admin';
        await content.save();
      } else {
        content = new Content({ ...newContent, version: 1, lastUpdatedAt: new Date() });
        await content.save();
      }

      // Update local file backup
      await fs.writeFile(CONTENT_FILE, JSON.stringify(newContent, null, 2));
      
      res.json({ message: 'Content saved successfully', version: content.version });
    } catch (err: any) {
      console.error('Error saving content:', err);
      res.status(500).json({ error: 'Database Error: ' + err.message });
    }
  });

  // 3. Metadata for Editor
  app.get('/api/content-info', async (req, res) => {
    try {
      const content = await Content.findOne({});
      res.json({
        version: content?.version || 0,
        lastUpdatedAt: content?.lastUpdatedAt || new Date(),
        lastUpdatedBy: content?.lastUpdatedBy || 'system'
      });
    } catch (err) {
      res.status(500).json({ error: 'Error' });
    }
  });

  // 4. Enroll Student & Send Detailed Mail
  app.post('/api/applications', async (req, res) => {
    try {
      const { fullName, email, phone, place, schoolName, program } = req.body;

      if (!fullName || !phone || !place || !schoolName || !program) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Save to DB
      const newApp = new Application({ fullName, email, phone, place, schoolName, program });
      await newApp.save();

      // Send Email
      let emailSent = false;
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
          });

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: '📩 New Student Enrollment Request',
            text: `Dear Team,

You have received a new enrollment request. Below are the applicant details:

━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${fullName}
📍 Place: ${place}
🏫 School Name: ${schoolName}
📞 Contact Number: ${phone}
📧 Email Address: ${email || 'Not provided'}
🎯 Selected Program: ${program}
━━━━━━━━━━━━━━━━━━━━━━━

Kindly follow up with the applicant at the earliest.

Best Regards,
Vendhan Sports Academy`
          });
          emailSent = true;
          console.log('✅ Enrollment email sent for:', fullName);
        } catch (mailErr) {
          console.error('❌ Mailer error:', mailErr);
        }
      }

      res.status(201).json({ message: 'Application successful', emailSent });
    } catch (err: any) {
      console.error('❌ Application error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Health/Dev Logic
  app.get('/api/health', (req, res) => res.json({ status: 'ok', mongo: mongoose.connection.readyState }));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
}

// Start traditional server
startServer();

// --- VERCEL HANDLER (For Cloud Deployment) ---
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });
  
  try {
    const { fullName, email, phone, place, schoolName, program } = req.body;
    if (mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI || '');

    const newApp = new Application({ fullName, email, phone, place, schoolName, program });
    await newApp.save();

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: '📩 New Enrollment Request',
        text: `Name: ${fullName}\nPlace: ${place}\nSchool: ${schoolName}\nPhone: ${phone}\nProgram: ${program}`
      });
    }
    return res.status(201).json({ message: 'Success' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}