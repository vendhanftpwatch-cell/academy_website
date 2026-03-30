import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  hero: mongoose.Schema.Types.Mixed,
  programs: mongoose.Schema.Types.Mixed,
  events: mongoose.Schema.Types.Mixed,
  achievements: mongoose.Schema.Types.Mixed,
  coaches: mongoose.Schema.Types.Mixed,
  summer_camp: mongoose.Schema.Types.Mixed,
  lastUpdatedAt: { type: Date, default: Date.now },
  lastUpdatedBy: String,
  version: { type: Number, default: 1 }
}, { strict: false });

export const Content = mongoose.model('Content', contentSchema);
