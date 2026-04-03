import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// MongoDB Model inside the API file for serverless compatibility
const ApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: false },
  phone: { type: String, required: true },
  place: { type: String, required: true },
  schoolName: { type: String, required: true },
  program: { type: String, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { fullName, email, phone, place, schoolName, program } = req.body;
    
    console.log('Received application data:', { fullName, email, phone, place, schoolName, program });

    // All fields are mandatory except email
    if (!fullName || !phone || !place || !schoolName || !program) {
      return res.status(400).json({ error: 'Missing required fields. Please fill in Name, Phone, Place, School Name, and Program.' });
    }

    // 1. Connect to DB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || '');
    }

    // 2. Save to DB
    const newApp = new Application({ fullName, email, phone, place, schoolName, program });
    await newApp.save();

    // 3. Send Email if configured
    let emailSent = false;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: '📩 New Student Enrollment Request',
          text: `Name: ${fullName}\nPlace: ${place}\nSchool Name: ${schoolName}\nPhone: ${phone}\nEmail: ${email || 'Not provided'}\nProgram: ${program}`
        });
        emailSent = true;
      } catch (emailErr) {
        console.error('Email error:', emailErr);
      }
    }

    return res.status(201).json({ 
      message: 'Application submitted successfully',
      emailSent 
    });
  } catch (error: any) {
    console.error('/api/applications error:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}