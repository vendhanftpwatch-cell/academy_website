import express from 'express';
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { Application } from './src/models/Application.js';
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
      const data = await fs.readFile(CONTENT_FILE, 'utf-8');
      res.json(JSON.parse(data));
    } catch (err) {
      console.error('Error reading content file:', err);
      res.status(500).json({ error: 'Failed to read content' });
    }
  });

  app.post('/api/content', async (req, res) => {
    try {
      const newContent = req.body;
      
      // Basic validation: ensure it's a valid object
      if (typeof newContent !== 'object' || newContent === null) {
        return res.status(400).json({ error: 'Invalid content format' });
      }

      // Backup existing content
      try {
        const currentData = await fs.readFile(CONTENT_FILE, 'utf-8');
        await fs.writeFile(`${CONTENT_FILE}.bak`, currentData);
      } catch (e) {
        console.warn('Could not create backup:', e);
      }

      await fs.writeFile(CONTENT_FILE, JSON.stringify(newContent, null, 2));
      res.json({ message: 'Content updated successfully' });
    } catch (err) {
      console.error('Error writing content file:', err);
      res.status(500).json({ error: 'Failed to update content' });
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
