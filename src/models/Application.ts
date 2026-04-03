import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: false },
  phone: { type: String, required: true },
  place: { type: String, required: true },
  schoolName: { type: String, required: true },
  program: { type: String, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export const Application = mongoose.model('Application', applicationSchema);
