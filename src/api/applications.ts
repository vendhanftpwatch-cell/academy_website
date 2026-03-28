import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

// MongoDB Model inside the API file for serverless compatibility
const ApplicationSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  program: String,
  createdAt: { type: Date, default: Date.now }
});

const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { fullName, email, phone, program } = req.body;

    // 1. Connect to DB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // 2. Save to DB
    const newApp = new Application({ fullName, email, phone, program });
    await newApp.save();

    // 3. Send Email
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
      text: `Name: ${fullName}\nPhone: ${phone}\nEmail: ${email}\nProgram: ${program}`
    });

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}