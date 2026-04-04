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

// --- MongoDB Schemas ---
const Application = mongoose.models.Application || mongoose.model('Application', new mongoose.Schema({
  fullName: String, email: String, phone: String, place: String, schoolName: String, program: String, createdAt: { type: Date, default: Date.now }
}));

const Content = mongoose.models.Content || mongoose.model('Content', new mongoose.Schema({
  hero: Object, programs: Array, events: Array, achievements: Array, achievements_list: Array, coaches: Array, summer_camp: Object,
  version: Number, lastUpdatedAt: Date, lastUpdatedBy: String
}));

// Professional Teal Email Generator
const generateEmailHtml = (fullName: string, schoolName: string, place: string, phone: string, email: string, program: string) => {
  const selectionRows = program.split(' | ').map((item: string) => {
    const parts = item.split(': ');
    return `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 14px; font-weight: bold; color: #2c6e81; font-size: 13px; width: 35%; text-align: left; text-transform: uppercase;">${parts[0]}</td>
        <td style="padding: 14px; color: #333; font-size: 13px; text-align: left;">${parts[1] || ''}</td>
      </tr>`;
  }).join('');

  return `<div style="font-family: Arial; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 12px; overflow: hidden;">
    <div style="background-color: #2c6e81; padding: 40px; color: white; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">Vendhan Sports Academy</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.8;">Summer Camp 2026 Registration</p>
    </div>
    <div style="padding: 30px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr><td style="color: #777; padding: 8px 0;">Student</td><td style="font-weight: bold;">${fullName}</td></tr>
        <tr><td style="color: #777; padding: 8px 0;">School</td><td style="font-weight: bold;">${schoolName}</td></tr>
        <tr><td style="color: #777; padding: 8px 0;">Place</td><td style="font-weight: bold;">${place}</td></tr>
        <tr><td style="color: #777; padding: 8px 0;">Contact</td><td style="font-weight: bold;">${phone}</td></tr>
      </table>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr style="background-color: #f4f8f9;"><th colspan="2" style="padding: 10px; color: #2c6e81; text-align: left; font-size: 12px;">SELECTED ACTIVITIES</th></tr>
        ${selectionRows}
      </table>
    </div>
  </div>`;
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  app.use(cors());
  app.use(express.json({ limit: '15mb' }));

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vendhaninfotechodc_db_user:vendhan12345@cluster0.npltaji.mongodb.net/?appName=Cluster0';
  try { await mongoose.connect(MONGODB_URI); console.log('✅ MongoDB Connected'); } catch (err) { console.error('❌ MongoDB Error'); }

  // API Routes
  app.get('/api/content', async (req, res) => {
    try {
      let content = await Content.findOne({});
      if (content) return res.json(content);
      const data = await fs.readFile(CONTENT_FILE, 'utf-8');
      res.json(JSON.parse(data));
    } catch (err) { res.status(500).send("Error"); }
  });

  app.post('/api/applications', async (req, res) => {
    try {
      const { fullName, email, phone, place, schoolName, program } = req.body;
      const newApp = new Application({ fullName, email, phone, place, schoolName, program });
      await newApp.save();
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
        const html = generateEmailHtml(fullName, schoolName, place, phone, email || 'Not provided', program);
        await transporter.sendMail({ from: process.env.EMAIL_USER, to: process.env.EMAIL_USER, subject: `📩 Registration: ${fullName}`, html });
      }
      res.status(201).json({ message: 'Success' });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // Vite / Static Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server ready on http://localhost:${PORT}`));
}

startServer();