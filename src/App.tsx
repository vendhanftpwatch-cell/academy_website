/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sword, 
  Trophy, 
  Users, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail,
  Menu, 
  X,
  Dribbble,
  Activity,
  Wind,
  Zap,
  Clock,
  Star,
  Award,
  ChevronRight,
  Sun,
  Tent,
  Flame,
  Music,
  Target
} from 'lucide-react';
import contentData from '../content.json';

// --- Constants from Content ---
const PROGRAMS = contentData.programs;
const EVENTS = contentData.events;
const COACHES = contentData.coaches;
const ACHIEVEMENTS = contentData.achievements;
const SUMMER_CAMP_FEATURES = contentData.summer_camp.features;

// --- Types ---
interface Program {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  benefits: string[];
  speciality: string;
  category: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface Achievement {
  label: string;
  value: string;
  icon: string;
}

interface Coach {
  name: string;
  role: string;
  image: string;
}

interface Content {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    slides: string[];
  };
  programs: Program[];
  events: Event[];
  achievements: Achievement[];
  coaches: Coach[];
  summer_camp: {
    features: {
      title: string;
      description: string;
      icon: string;
    }[];
  };
}

const ICON_MAP: Record<string, any> = {
  Trophy,
  Users,
  Clock,
  Award,
  Tent,
  Music,
  Zap,
  Activity,
  Wind,
  Target,
  Star,
  Flame,
  Sun
};

const getIcon = (name: string) => {
  const Icon = ICON_MAP[name] || Star;
  return <Icon className="w-8 h-8 text-brand-orange" />;
};

const getSmallIcon = (name: string) => {
  const Icon = ICON_MAP[name] || Star;
  return <Icon className="w-6 h-6" />;
};

// --- Context ---
const ContentContext = React.createContext<Content | null>(null);

const useContent = () => {
  const context = React.useContext(ContentContext);
  if (!context) return contentData; 
  return context;
};

// --- Components ---

const Lightbox = ({ imageUrl, onClose }: { imageUrl: string, onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
    >
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
      </motion.button>
      
      <motion.img
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        src={imageUrl}
        alt="Full view"
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()} 
      />
    </motion.div>
  );
};

const ContentEditor = ({ content, onSave, onCancel }: { content: Content, onSave: (newContent: Content) => void, onCancel: () => void }) => {
  const [json, setJson] = useState(JSON.stringify(content, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(json);
      onSave(parsed);
    } catch (e) {
      setError('Invalid JSON format. Please check your syntax.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-black text-brand-navy uppercase tracking-tighter">Content <span className="text-brand-orange">Editor</span></h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Edit your website content in real-time</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              className="px-6 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-8 py-2.5 rounded-full text-sm font-bold bg-brand-navy text-white hover:bg-slate-800 transition-all shadow-lg shadow-brand-navy/20"
            >
              Save Changes
            </button>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <textarea 
            value={json}
            onChange={(e) => {
              setJson(e.target.value);
              setError(null);
            }}
            className="w-full h-full p-8 font-mono text-sm bg-slate-900 text-slate-300 outline-none resize-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
            spellCheck={false}
            placeholder="Paste your JSON content here..."
          />
          {error && (
            <div className="absolute bottom-6 left-6 right-6 bg-red-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-xl animate-bounce">
              {error}
            </div>
          )}
        </div>
        
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tip: Ensure you maintain the JSON structure to avoid layout issues.</p>
          <div className="flex items-center gap-2 text-[10px] text-brand-orange font-bold uppercase tracking-widest">
            <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></div>
            Live Preview Mode
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Navbar Update: No Edit Button for public users
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      // Close mobile menu when scrolling
      if (isMobileMenuOpen && window.scrollY > 50) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

const navLinks = [
  { name: 'Programs', href: '#programs' },
  { name: 'Summer Camp', href: '#summer-camp' },
  { name: 'Achievements', href: '#achievements' }, // Added this
  { name: 'Rental', href: '#rental' },
  { name: 'Events', href: '#events' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'About', href: '#about' },
];

  return (
<nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
  <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
    <div className="flex items-center gap-3">
      {/* Logo Image */}
      <img src="images/logo.png" alt="Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
      
      {/* Two-Line Text Container */}
      <div className={`flex flex-col leading-[1.0] font-display font-bold tracking-tight ${isScrolled ? 'text-brand-navy' : 'text-white'}`}>
        {/* VENDHAN - All Caps */}
        <span className="text-xl md:text-2xl uppercase">VENDHAN</span>
        
        {/* Sports Academy - Mixed Case */}
        <span className={`text-[11px] md:text-[13px] tracking-wide font-semibold ${isScrolled ? 'text-slate-600' : 'text-brand-orange'}`}>
          Sports Academy
        </span>
      </div>
    </div>
    {/* Rest of the navbar items... */}
 

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, idx) => (
            <motion.a 
              key={link.name} 
              href={link.href} 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
              className={`text-sm font-medium transition-colors hover:text-brand-orange ${isScrolled ? 'text-slate-600' : 'text-white/90'}`}
            >
              {link.name}
            </motion.a>
          ))}

          <motion.a 
            href="#join" 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-brand-orange text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
          >
            Join Academy
          </motion.a>
        </div>

        <button 
          className="md:hidden p-2 rounded-lg transition-colors hover:bg-white/10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={`w-6 h-6 ${isScrolled ? 'text-brand-navy' : 'text-white'}`} />
          ) : (
            <Menu className={`w-6 h-6 ${isScrolled ? 'text-brand-navy' : 'text-white'}`} />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 md:hidden z-30"
            />
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-sm border-b border-slate-100 overflow-hidden z-40 shadow-lg"
            >
            <div className="px-6 py-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-slate-800 py-2 px-3 rounded-lg hover:bg-slate-100 transition-colors active:bg-brand-orange/20"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-200">
                <a 
                  href="#join" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block bg-brand-orange text-white px-6 py-3 rounded-xl text-center font-bold hover:bg-orange-600 transition-all active:scale-95"
                >
                  Join Academy
                </a>
              </div>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { hero } = useContent();
  const { badge, title, subtitle, slides } = hero;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-brand-navy">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={slides[currentSlide]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.8, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            alt="Sports Training"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/60 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="max-w-2xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-block px-4 py-1.5 bg-brand-orange/20 text-brand-orange rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-brand-orange/30"
          >
            {badge}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-8 leading-[0.9] uppercase drop-shadow-2xl"
          >
            {title.split(' ').slice(0, -2).join(' ')} <br />
            <span className="text-brand-orange">{title.split(' ').slice(-2).join(' ')}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-lg"
          >
            {subtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a href="#programs" className="group bg-brand-orange text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition-all">
              Explore Programs
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#rental" className="px-8 py-4 rounded-full font-bold text-lg text-white border border-white/30 hover:bg-white/10 transition-all flex items-center justify-center">
              Facility Rental coming soon
            </a>
			
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-10 left-6 md:left-12 z-20 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-12 bg-brand-orange' : 'w-4 bg-white/30'}`}
          />
        ))}
      </div>

      <div className="absolute bottom-10 right-10 hidden lg:block">
        <div className="flex gap-4 items-center text-white/40">
          <div className="w-20 h-px bg-white/20"></div>
          <span className="text-xs uppercase tracking-widest font-bold">Scroll to discover</span>
        </div>
      </div>
    </section>
  );
};

const Programs = () => {
  const { programs } = useContent();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  const toggleCardExpansion = (programId: string) => {
    setExpandedCard(expandedCard === programId ? null : programId);
  };
  
  return (
    <section id="programs" className="section-padding bg-white text-brand-navy">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6"
        >
          <div className="max-w-2xl">
            <span className="text-[#D63384] font-bold tracking-[0.3em] text-xs uppercase mb-3 block">Academy Journal</span>
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.8] text-brand-navy mb-4">VENDHAN PROGRAMS</h2>
            <p className="text-slate-500 text-lg leading-relaxed">Explore our diverse training programs through our latest academy news and highlights. From traditional arts to modern sports excellence.</p>
          </div>
          <div className="hidden lg:block text-right">
            <div className="text-3xl font-serif italic text-slate-200 mb-1">Vol. 2026</div>
            <div className="h-px w-24 bg-slate-100 ml-auto"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          
          {/* Main Featured Program (Large Card) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`md:col-span-2 lg:col-span-4 lg:row-span-2 relative group overflow-hidden rounded-sm min-h-[450px] md:min-h-[500px] lg:min-h-full border border-slate-100 shadow-sm flex flex-col cursor-pointer transition-all duration-300 ${expandedCard === programs[0].id ? 'lg:col-span-8 lg:row-span-4 z-10' : ''}`}
            onClick={() => toggleCardExpansion(programs[0].id)}
          >
            <div className="flex-1 relative overflow-hidden">
              <img src={programs[0].image} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" referrerPolicy="no-referrer" alt={programs[0].title} />
              {expandedCard === programs[0].id && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
              )}
            </div>
            <div className={`absolute bottom-6 left-6 right-6 bg-white p-6 md:p-8 shadow-2xl border border-slate-50 transition-all duration-300 ${expandedCard === programs[0].id ? 'relative static m-0 shadow-none border-none bg-white p-8' : ''}`}>
              <span className="text-[#D63384] text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">{programs[0].category}</span>
              <h3 className={`text-3xl md:text-4xl font-black text-brand-navy leading-[0.85] mb-3 uppercase tracking-tighter transition-colors duration-300 ${expandedCard === programs[0].id ? 'text-black' : ''}`}>{programs[0].title}</h3>
              <p className={`text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3 transition-colors duration-300 ${expandedCard === programs[0].id ? 'text-slate-900 line-clamp-none' : ''}`}>{programs[0].description}</p>
              
              {expandedCard === programs[0].id && (
                <div className="mb-6">
                  <h4 className="text-black text-lg font-bold mb-3">What You'll Learn:</h4>
                  <ul className="space-y-2">
                    {programs[0].benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-[#D63384] mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <h4 className="text-black text-lg font-bold mb-3">Speciality:</h4>
                    <p className="text-slate-700">{programs[0].speciality}</p>
                  </div>
                </div>
              )}
              
              <div className="w-full h-1.5 bg-[#D63384]/20 mb-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-[#D63384]"></div>
              </div>
              {/* LINKED TO CONTACT */}
              <a href="#join" className={`text-[10px] font-bold uppercase tracking-widest transition-colors inline-block ${expandedCard === programs[0].id ? 'text-brand-navy hover:text-[#D63384]' : 'text-brand-navy hover:text-[#D63384]'}`}>
                {expandedCard === programs[0].id ? 'Join Now' : 'JOIN NOW'}
              </a>
            </div>
            
            {expandedCard === programs[0].id && (
              <div className="absolute top-4 right-4 z-20">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedCard(null);
                  }}
                  className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Program Card 2 */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 lg:col-span-8 flex flex-col sm:flex-row bg-white border border-slate-100 overflow-hidden rounded-sm h-full lg:h-[280px] shadow-sm"
          >
            <div className="sm:w-1/2 h-56 sm:h-full overflow-hidden">
              <img src={programs[1].image} className="w-full h-full object-cover transition-all duration-500" referrerPolicy="no-referrer" alt={programs[1].title} />
            </div>
            <div className="sm:w-1/2 p-6 md:p-8 flex flex-col justify-center">
              <h4 className="text-[#D63384] text-2xl md:text-3xl font-black leading-[0.9] mb-3 uppercase tracking-tighter">{programs[1].title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-3 line-clamp-2">{programs[1].description}</p>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Academy News / {programs[1].category}</p>
            </div>
          </motion.div>

          {/* Program Card 3 */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 lg:col-span-8 flex flex-col-reverse sm:flex-row bg-white border border-slate-100 overflow-hidden rounded-sm h-full lg:h-[280px] shadow-sm"
          >
            <div className="sm:w-1/2 p-6 md:p-8 flex flex-col justify-center">
              <h4 className="text-[#D63384] text-2xl md:text-3xl font-black leading-[0.9] mb-3 uppercase tracking-tighter">{programs[2].title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-3 line-clamp-2">{programs[2].description}</p>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Academy News / {programs[2].category}</p>
            </div>
            <div className="sm:w-1/2 h-56 sm:h-full overflow-hidden">
              <img src={programs[2].image} className="w-full h-full object-cover transition-all duration-500" referrerPolicy="no-referrer" alt={programs[2].title} />
            </div>
          </motion.div>

          {/* Program Card 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-1 lg:col-span-6 flex flex-col-reverse sm:flex-row lg:flex-col-reverse bg-white border border-slate-100 overflow-hidden rounded-sm h-full lg:h-[350px] shadow-sm"
          >
            <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
              <h4 className="text-[#D63384] text-2xl md:text-3xl font-black leading-[0.9] mb-4 uppercase tracking-tighter">{programs[3].title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">{programs[3].description}</p>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest">Academy News / {programs[3].category}</p>
            </div>
            <div className="h-64 sm:h-48 lg:h-48 overflow-hidden">
              <img src={programs[3].image} className="w-full h-full object-cover transition-all duration-500" referrerPolicy="no-referrer" alt={programs[3].title} />
            </div>
          </motion.div>

          {/* Program Card 5 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-1 lg:col-span-6 flex flex-col sm:flex-row lg:flex-col bg-slate-50 border border-slate-100 overflow-hidden rounded-sm h-full lg:h-[350px] shadow-sm"
          >
            <div className="h-64 sm:h-48 lg:h-48 overflow-hidden">
              <img src={programs[4].image} className="w-full h-full object-cover transition-all duration-500" referrerPolicy="no-referrer" alt={programs[4].title} />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
              <h4 className="text-brand-navy text-2xl md:text-3xl font-black leading-[0.9] mb-4 uppercase tracking-tighter">{programs[4].title}</h4>
              <p className="text-[#D63384] text-sm leading-relaxed mb-4 line-clamp-3">{programs[4].description}</p>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest">Academy News / {programs[4].category}</p>
            </div>
          </motion.div>

          {/* Remaining Programs Grid */}
          {programs.slice(5).map((program, idx) => (
            <motion.div 
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="md:col-span-1 lg:col-span-4 bg-white overflow-hidden rounded-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={program.image} alt={program.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#D63384] text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest">
                      {program.category}
                    </span>
                  </div>
              </div>
              <div className="p-8 flex-1 flex flex-col group-hover:bg-[#D63384] transition-colors duration-500">
                <h4 className="text-brand-navy group-hover:text-white text-2xl font-black leading-tight mb-4 uppercase tracking-tighter">{program.title}</h4>
                <p className="text-slate-500 group-hover:text-black/80 text-sm leading-relaxed mb-6 line-clamp-2">{program.description}</p>
                <div className="mt-auto flex items-center gap-4">
                  <div className="w-8 h-px bg-slate-200 group-hover:bg-white/30"></div>
                  {/* LINKED TO CONTACT */}
                  <a href="#join" className="text-[10px] font-bold text-slate-400 group-hover:text-white uppercase tracking-widest transition-colors">
                    Learn More
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Motivational Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-10 md:p-16 bg-slate-50 border border-slate-100 rounded-sm text-center text-brand-navy relative overflow-hidden"
        >
          <div className="relative z-10">
            <h4 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-tighter max-w-4xl mx-auto leading-tight">“No matter your passion — fitness, sport, or art — we help you grow, perform, and succeed.”</h4>
            <p className="text-[#D63384] uppercase tracking-[0.4em] text-[10px] font-bold">Vendhan Sports Academy / Est. 2024</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SummerCamp = ({ onImageClick }: { onImageClick: (url: string) => void }) => {
  const { summer_camp } = useContent();
  const { features } = summer_camp;
  const campImages = ["images/SUM1.png", "images/SUM2.png", "images/SUM3.png", "images/Summercamp1.png"];

  return (
    <section id="summer-camp" className="section-padding bg-brand-orange text-white overflow-hidden relative">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {campImages.map((src, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => onImageClick(src)}
                  className={`aspect-square rounded-2xl overflow-hidden shadow-xl border-2 border-white/20 cursor-zoom-in ${index % 2 !== 0 ? 'mt-8' : ''}`}
                >
                  <img src={src} alt={`Summer Camp ${index + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </motion.div>
              ))}
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-2xl text-brand-navy hidden md:block z-20">
              <div className="flex items-center gap-3">
                <Sun className="w-6 h-6 text-brand-orange animate-spin-slow" />
                <div>
                  <h4 className="text-md font-bold">April - May</h4>
                  <p className="text-slate-500 text-[10px] font-medium uppercase">Summer 2026</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/80 font-bold mb-3">Seasonal Special</h2>
            <h3 className="text-4xl sm:text-5xl md:text-6xl mb-6 font-bold leading-tight">Summer Camp <br /><span className="text-brand-navy">Adventure</span></h3>
            <p className="text-white/90 text-lg mb-10 leading-relaxed max-w-xl">
              Give your child a summer to remember! Our annual summer camp combines elite sports training with adventure, creativity, and lifelong friendships.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    {getSmallIcon(feature.icon)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{feature.title}</h4>
                    <p className="text-white/70 text-sm leading-snug">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
            {/* REPLACE LINE 523 to 525 WITH THIS */}
                 <a href="#join" 
                     className="bg-brand-navy text-white px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-black/20 text-center inline-block">
                      Register Now
                 </a>
              <div className="flex items-center gap-3 px-6 py-4 bg-white/10 rounded-full border border-white/20">
                <Flame className="w-5 h-5 text-brand-navy" />
                <span className="font-bold">Limited Slots Available!</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FacilityRental = () => {
  return (
    <section id="rental" className="section-padding bg-brand-navy text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-orange/5 -skew-x-12 translate-x-1/4"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <h2 className="text-xs uppercase tracking-[0.2em] text-brand-orange font-bold mb-3">Infrastructure</h2>
            <h3 className="text-4xl md:text-5xl mb-6 leading-tight">Facility Rental</h3>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-xl">
              We offer world-class sports infrastructure for rent, suitable for practice sessions, tournaments, and private events. Our facilities are maintained to international standards.
            </p>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center text-brand-orange shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">Court / Ground Rental</h4>
                  <p className="text-slate-400 text-sm">Available at a fixed price per hour. Perfect for teams and clubs.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center text-brand-orange shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">Per Person Access</h4>
                  <p className="text-slate-400 text-sm">Pricing available based on number of participants. Ideal for individuals.</p>
                </div>
              </div>
            </div>
                  <button className="mt-15 bg-white text-brand-navy px-9 py-4 text-2xl rounded-full font-bold ...">
                   Coming Soon
                  </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative"
          >
            <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img 
                src="images/court_room.png" 
                alt="Facility" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 glass-card p-6 rounded-2xl text-brand-navy hidden md:block">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                    </div>
                  ))}
                </div>
                <span className="text-xs font-bold"></span>
              </div>
              <p className="text-[10px] text-slate-500">Join the community of elite athletes</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Events = () => {
  return (
    <section id="events" className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center mb-16"
        >
          <h2 className="text-xs uppercase tracking-[0.2em] text-brand-orange font-bold mb-4">Stay Tuned</h2>
          <h3 className="text-4xl md:text-5xl text-brand-navy">Upcoming Events</h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {EVENTS.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
            >
              <div className="flex items-center gap-2 text-brand-orange font-bold text-xs mb-4 uppercase tracking-widest">
                <Calendar className="w-4 h-4" />
                {event.date}
              </div>
              <h4 className="text-xl font-bold mb-4 text-brand-navy group-hover:text-brand-orange transition-colors leading-tight">{event.title}</h4>
              <p className="text-slate-600 text-sm mb-8 flex-1 leading-relaxed">
                {event.description}
              </p>
              
              <a 
                href="#join" 
                className="w-full py-3 rounded-xl border border-slate-200 font-bold text-xs uppercase tracking-widest text-slate-700 hover:bg-brand-navy hover:text-white transition-all text-center block"
              >
                Event Details
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-16 bg-brand-navy rounded-2xl p-8 md:p-10 text-white flex flex-col md:flex-row items-center gap-8"
        >
          <div className="shrink-0 flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center animate-pulse">
              <Zap className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg uppercase tracking-wider">Latest Updates</span>
          </div>
          <div className="h-px w-full md:w-px md:h-10 bg-white/20"></div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-brand-orange" />
              <p className="text-slate-300 text-sm">New training center opening in Chennai.</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-brand-orange" />
              <p className="text-slate-300 text-sm">International Silambam seminar featuring grandmasters.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const AchievementShowcase = ({ onImageClick }: { onImageClick: (url: string) => void }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const achievements = [
    {
      title: "State Level Silambam Championship",
      category: "Traditional Arts",
      date: "Feb 2024",
      image: "images/world-record-boy.png", // Updated to use your local images
      description: "Our students secured 12 Gold medals and the overall team trophy at the Tamil Nadu State Championship.",
      number: "01",
      label: "ONE"
    },
    {
      title: "Inter-Academy Football Cup",
      category: "Sports",
      date: "Nov 2025",
      image: "images/skating-line.png", // Updated to use your local images
      description: "VSA Under-16 team emerged as unbeaten champions in the regional football tournament held in Chennai.",
      number: "02",
      label: "TWO"
    },
    {
      title: "District Yoga Excellence Award",
      category: "Wellness",
      date: "Aug 2025",
      image: "images/skatechamps.png", // Updated to use your local images
      description: "Recognized as the 'Best Training Center' for promoting traditional yoga practices among youngsters.",
      number: "03",
      label: "THREE"
    }
  ];

  return (
    <section id="achievements" className="py-20 md:py-32 bg-slate-50 overflow-hidden min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Side: Showcase Card */}
          <div className="lg:w-1/2 w-full relative">
            <div className="relative aspect-[4/5] w-full max-w-[450px] mx-auto rounded-3xl overflow-hidden shadow-2xl bg-[#151619] group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img 
                    src={achievements[activeIndex].image} 
                    alt={achievements[activeIndex].title}
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151619] via-[#151619]/20 to-transparent"></div>
                  
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12 text-center">
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 0.1, scale: 1 }}
                      className="absolute text-[15rem] font-black tracking-tighter select-none pointer-events-none"
                    >
                      {achievements[activeIndex].number}
                    </motion.span>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative z-10"
                    >
                      <span className="text-[#F27D26] font-bold tracking-[0.3em] text-xs uppercase mb-4 block">
                        {achievements[activeIndex].label}
                      </span>
                      <h4 className="text-4xl font-black uppercase tracking-tighter leading-none mb-6">
                        {achievements[activeIndex].title}
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed max-w-xs mx-auto">
                        {achievements[activeIndex].description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <button 
                onClick={() => onImageClick(achievements[activeIndex].image)}
                className="absolute bottom-8 right-8 z-20 bg-white/10 backdrop-blur-md p-4 rounded-full text-white hover:bg-[#F27D26] transition-all"
              >
                <Trophy className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Right Side: Menu List */}
          <div className="lg:w-1/2 w-full">
            <div className="mb-12">
              <span className="text-[#F27D26] font-bold tracking-[0.2em] text-xs uppercase mb-3 block">Hall of Fame</span>
              <h2 className="text-5xl font-black text-[#151619] uppercase tracking-tighter">Achievements</h2>
            </div>
            
            <div className="relative space-y-8">
              {/* Connecting Line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 hidden md:block">
                <motion.div 
                  animate={{ top: `${activeIndex * 88 + 12}px` }}
                  className="absolute left-[-2px] w-1.5 h-6 bg-[#F27D26] rounded-full transition-all duration-500"
                />
              </div>

              {achievements.map((item, idx) => (
                <motion.div
                  key={idx}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative pl-8 cursor-pointer group transition-all duration-300 ${activeIndex === idx ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                >
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-bold text-slate-400 font-mono tracking-widest">
                      {item.number}
                    </span>
                    <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter transition-all ${activeIndex === idx ? 'text-[#151619] translate-x-2' : 'text-slate-400'}`}>
                      {item.title}
                    </h3>
                  </div>
                  
                  {activeIndex === idx && (
                    <motion.div 
                      layoutId="activeLine"
                      className="absolute left-[-40px] right-full h-px bg-[#F27D26] hidden md:block"
                      initial={{ width: 0 }}
                      animate={{ width: '40px' }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 pt-12 border-t border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F27D26]/10 flex items-center justify-center text-[#F27D26]">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Next Goal</p>
                  <p className="text-[#151619] font-bold">National Level Championship 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


const Gallery = ({ onImageClick }: { onImageClick: (url: string) => void }) => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Silambam', 'Badminton', 'Football', 'Yoga', 'Athletics', 'Skating', 'Aerobics', 'Boxing', 'Karate', 'Summer Camp'];
  
  const images = [
    { cat: 'Silambam', url: 'images/silambam-practice-1.png' },
	{ cat: 'Badminton', url: 'images/badminton-group.png' },
    { cat: 'Football', url: 'images/football.png' },
    { cat: 'Yoga', url: 'images/yoga-sitting.png' },
    { cat: 'Athletics', url: 'images/athlet.png' },
    { cat: 'Skating', url: 'images/skating.png' },
	{ cat: 'Skating', url: 'images/skating-line.png' },
	{ cat: 'Skating', url: 'images/skating-certif.png' },
	{ cat: 'Skating', url: 'images/skating-cones.png' },
    { cat: 'Silambam', url: 'images/silambam-practice-2.png' },
	{ cat: 'Aerobics', url: 'images/AEROBICS.png' },
	{ cat: 'Boxing', url: 'images/boxing-kid.png' },
	{ cat: 'Karate', url: 'images/karate-punches.png' },
	{ cat: 'Yoga', url: 'images/yoga-standing.png' },
	{ cat: 'Summer Camp', url: 'images/summer-crafts.png' },
	{ cat: 'Summer Camp', url: 'images/summer-fun-games.png' },
  ];

  const filteredImages = filter === 'All' ? images : images.filter(img => img.cat === filter);

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center mb-12"
        >
          <h2 className="text-xs uppercase tracking-[0.2em] text-brand-orange font-bold mb-4">Visual Journey</h2>
          <h3 className="text-3xl md:text-5xl text-brand-navy mb-8">Gallery</h3>
          
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === cat ? 'bg-brand-orange text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredImages.map((img) => (
              <motion.div
                key={img.url}
                layout
                onClick={() => onImageClick(img.url)}
                className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all relative group cursor-zoom-in"
              >
                <img src={img.url} alt={img.cat} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <span className="text-white font-bold text-sm uppercase tracking-widest">{img.cat}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

const ExpertGuidance = () => {
  return (
    <section id="about" className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-20"
        >
          <div>
            <span className="text-brand-orange font-bold tracking-[0.2em] text-xs uppercase mb-3 block">Welcome to our academy</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-brand-navy mb-6 leading-tight uppercase">Where Passion Meets Performance</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-xl">
              With over 2 years of experience, we have successfully trained and guided students to achieve excellence in both sports and arts. Our academy is proud to have 50+ active students and has achieved remarkable success with 100+ medals and certificates in various competitions.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-brand-navy font-bold flex items-center gap-2">
                  <Target className="w-5 h-5 text-brand-orange" />
                  Our Mission
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed">To build confidence, discipline, and excellence in every student by providing high-quality training in sports and arts.</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-brand-navy font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-brand-orange" />
                  Why Choose Us
                </h4>
                <ul className="text-slate-500 text-sm space-y-1 leading-relaxed">
                  <li>• Experienced and dedicated trainers</li>
                  <li>• Focus on fitness & skill development</li>
                  <li>• Proven track record with 100+ achievements</li>
                  <li>• Friendly and motivating environment</li>
                  <li>• Suitable for all age groups</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img 
                src="images/phsic.png" 
                alt="Academy Training" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-brand-orange p-8 rounded-2xl shadow-2xl text-white">
              <div className="text-4xl font-black mb-1">2+</div>
              <div className="text-[10px] uppercase tracking-widest font-bold">Years of Excellence</div>
            </div>
          </div>
        </motion.div>

        {/* Mentors Header */}
        <motion.div className="text-center mb-16">
          <h2 className="text-xs uppercase tracking-[0.2em] text-brand-orange font-bold mb-4">The Mentors</h2>
          <h3 className="text-4xl md:text-5xl text-brand-navy">Expert Guidance</h3>
        </motion.div>

        {/* Updated Coach Grid: Now 2 columns and centered */}
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {COACHES.slice(0, 2).map((coach, idx) => (
            <motion.div 
              key={coach.name} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="text-center group"
            >
              <div className="relative mb-6 inline-block">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto relative z-10">
                  <img src={coach.image} alt={coach.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="absolute top-0 right-0 w-12 h-12 bg-brand-orange rounded-full -z-0 translate-x-2 -translate-y-2 flex items-center justify-center text-white shadow-lg">
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-brand-navy mb-1 group-hover:text-brand-orange transition-colors">{coach.name}</h4>
              <p className="text-brand-orange font-bold text-[10px] uppercase tracking-[0.2em] mb-4">{coach.role}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {ACHIEVEMENTS.map((stat, idx) => (
            <motion.div key={idx} className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-center mb-4">{getIcon(stat.icon)}</div>
              <div className="text-4xl font-bold text-brand-navy mb-1">{stat.value}</div>
              <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const JoinForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    program: 'Silambam'
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ fullName: '', email: '', phone: '', program: 'Silambam' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };

  return (
    <section id="join" className="section-padding bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div className="bg-brand-navy rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          <motion.div className="lg:w-2/5 p-12 bg-brand-orange text-white flex flex-col justify-center">
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/80 font-bold mb-4">Start Today</h2>
            <h3 className="text-4xl md:text-5xl mb-8">Become a Champion</h3>
            <p className="text-white/80 mb-10 leading-relaxed">Fill out the form to start your journey with Vendhan Sports Academy.</p>
          </motion.div>
          
          <motion.div className="lg:w-3/5 p-12 bg-white">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <CheckCircle2 className="w-20 h-20 text-green-500" />
                <h4 className="text-2xl font-bold text-brand-navy">Application Received!</h4>
                <button onClick={() => setStatus('idle')} className="text-brand-orange font-bold">Submit another</button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200" placeholder="Full Name" />
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200" placeholder="Email" />
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200" placeholder="Phone" />
                <select value={formData.program} onChange={(e) => setFormData({ ...formData, program: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200">
                  {PROGRAMS.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
                </select>
                <button disabled={status === 'loading'} className="w-full bg-brand-navy text-white py-4 rounded-xl font-bold">{status === 'loading' ? 'Submitting...' : 'Submit Application'}</button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = ({ onEdit }: { onEdit: () => void }) => {
  const handleAdminAccess = () => {
    const password = prompt("Please enter Admin Password:");
    if (password === "admin123") {
      onEdit();
    } else {
      alert("Access Denied");
    }
  };

  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Socials */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="images/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
              <span className="text-xl font-black tracking-tighter text-white uppercase leading-none">
                VENDHAN <br />
                <span className="text-brand-orange text-sm">Sports Academy</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering the next generation of athletes through discipline, 
              tradition, and modern sports excellence. Join us to find your inner champion.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/vendhan_sports_academy/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange transition-all group">
                <Instagram className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </a>
              <a href="https://www.facebook.com/vendhan.sportz" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange transition-all group">
                <Facebook className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Navigation</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><a href="#programs" className="hover:text-brand-orange transition-colors">Training Programs</a></li>
              <li><a href="#summer-camp" className="hover:text-brand-orange transition-colors">Summer Camp 2026</a></li>
              <li><a href="#rental" className="hover:text-brand-orange transition-colors">Facility Rental</a></li>
              <li><a href="#gallery" className="hover:text-brand-orange transition-colors">Photo Gallery</a></li>
              <li><a href="#join" className="hover:text-brand-orange transition-colors">Join Academy</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Contact Us</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0" />
                <span>123 Sports Complex St,<br />Chennai, Tamil Nadu 600001</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-orange shrink-0" />
                <a href="mailto:vendhansportsacademy@gmail.com" className="hover:text-white">vendhansportsacademy@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-brand-orange shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter/Timing */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Working Hours</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="flex justify-between">
                <span>Mon - Fri:</span>
                <span className="text-white">6:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span className="text-white">6:00 AM - 12:00 PM</span>
              </li>
              <li className="flex justify-between border-t border-white/10 pt-2 mt-2">
                <span>Sunday:</span>
                <span className="text-brand-orange font-bold uppercase">Closed</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-xs font-medium">
          <p>© 2026 Vendhan Sports Academy. Designed for Champions.</p>
          <div className="flex gap-8 items-center">
            <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Terms of Service</a>
            <button 
              onClick={handleAdminAccess}
              className="text-slate-800 hover:text-slate-400 transition-colors flex items-center gap-1 group"
            >
              <Zap className="w-3 h-3 group-hover:text-brand-orange transition-colors" />
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [content, setContent] = useState<Content>(contentData);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
      }
    };
    fetchContent();
  }, []);

  const handleSaveContent = async (newContent: Content) => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
      });
      if (response.ok) {
        setContent(newContent);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

return (
    <ContentContext.Provider value={content}>
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <Programs />
        <SummerCamp onImageClick={setSelectedImage} />
        
        {/* ADD THIS LINE HERE (Approx Line 866) */}
        <AchievementShowcase onImageClick={setSelectedImage} />
		

        <FacilityRental />
        <Events />
        <Gallery onImageClick={setSelectedImage} />
        <ExpertGuidance />
        <JoinForm />
        <Footer onEdit={() => setIsEditing(true)} />

        <AnimatePresence>
          {selectedImage && (
            <Lightbox 
              imageUrl={selectedImage} 
              onClose={() => setSelectedImage(null)} 
            />
          )}
        </AnimatePresence>

        {isEditing && (
          <ContentEditor 
            content={content} 
            onSave={handleSaveContent} 
            onCancel={() => setIsEditing(false)} 
          />
        )}
      </div>
    </ContentContext.Provider>
  );
}