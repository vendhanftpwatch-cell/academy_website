import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  hero: {
    badge: String,
    title: String,
    subtitle: String,
    slides: [String]
  },
  programs: [{
    id: String,
    title: String,
    tagline: String,
    description: String,
    image: String,
    benefits: [String],
    speciality: String,
    category: String
  }],
  events: [{
    id: String,
    title: String,
    description: String,
    date: String
  }],
  achievements: [{
    label: String,
    value: String,
    icon: String
  }],
  coaches: [{
    name: String,
    role: String,
    image: String
  }],
  summer_camp: {
    features: [{
      title: String,
      description: String,
      icon: String
    }]
  },
  lastUpdatedAt: { type: Date, default: Date.now },
  lastUpdatedBy: String,
  version: { type: Number, default: 1 }
});

export const Content = mongoose.model('Content', contentSchema);
