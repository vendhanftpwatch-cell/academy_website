/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sword, Trophy, Users, Calendar, MapPin, ArrowRight, CheckCircle2, 
  Instagram, Facebook, Twitter, Mail, Menu, X, Dribbble, Activity, 
  Wind, Zap, Clock, Star, Award, ChevronRight, Sun, Tent, Flame, Music, Target 
} from 'lucide-react';
import contentData from '../content.json';
  

// --- Constants from Content ---
const PROGRAMS = contentData.programs;
const EVENTS = contentData.events;
const COACHES = contentData.coaches;

// Hall of Fame data (detailed achievements list)
const HALL_OF_FAME_DATA = contentData.achievements_list;
const SUMMER_CAMP_FEATURES = contentData.summer_camp?.features || [];

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

interface AchievementListItem {
  title: string;
  number: string;
  label: string;
  image: string;
  description: string;
  subLinks?: {
    name: string;
    image: string;
    description: string;
  }[];
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
  achievements_list?: AchievementListItem[];
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
  
  // Use DB data if available, otherwise local file
  const data = (context && context.hero) ? context : contentData;

  return {
    ...data,
    // THE HALL OF FAME LIST
    achievements_list: data.achievements_list || [], 
    
    // THE 4 STATS BOXES
    achievements: data.achievements || []
  };
};
const isVideo = (url: string) => url?.toLowerCase().endsWith('.mp4') || url?.toLowerCase().endsWith('.webm');

const Lightbox = ({ imageUrl, onClose }: { imageUrl: string, onClose: () => void }) => {
  const isVid = isVideo(imageUrl);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-zoom-out">
      <motion.button className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 z-[160]" onClick={onClose}><X className="w-8 h-8" /></motion.button>
      <div className="max-w-5xl w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {isVid ? (
          <video src={imageUrl} controls autoPlay className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" />
        ) : (
          <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={imageUrl} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
        )}
      </div>
    </motion.div>
  );
};

const ContentEditor = ({ content, onSave, onCancel }: { content: Content, onSave: (newContent: Content) => void, onCancel: () => void }) => {
  const [json, setJson] = useState(JSON.stringify(content, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [contentInfo, setContentInfo] = useState<{ version: number; lastUpdatedAt: string; lastUpdatedBy: string } | null>(null);

  useEffect(() => {
    // Fetch content metadata from MongoDB
    const fetchContentInfo = async () => {
      try {
        const response = await fetch('/api/content-info');
        if (response.ok) {
          const info = await response.json();
          setContentInfo(info);
        }
      } catch (err) {
        console.error('Error fetching content info:', err);
      }
    };
    fetchContentInfo();
  }, []);

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
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Connected to MongoDB • {contentInfo && <span>Version {contentInfo.version} • Last updated: {new Date(contentInfo.lastUpdatedAt).toLocaleString()}</span>}</p>
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
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Programs', href: '#programs' },
    { name: 'Summer Camp', href: '#summer-camp' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Rental', href: '#rental' },
    { name: 'Events', href: '#events' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'About', href: '#about' },
  ];

  // Logic to handle smooth scroll on mobile and close menu
  const handleMobileLinkClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    // Small delay to allow menu animation to finish
    setTimeout(() => {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        // Offset for the fixed header height
        const offset = 80; 
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 300);
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <img src="images/logo.png" alt="Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
          <div className={`flex flex-col leading-tight font-bold ${isScrolled ? 'text-brand-navy' : 'text-white'}`}>
            <span className="text-lg md:text-xl uppercase tracking-tighter">VENDHAN</span>
            <span className={`text-[10px] md:text-xs font-semibold ${isScrolled ? 'text-slate-500' : 'text-brand-orange'}`}>
              Sports Academy
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={`text-sm font-bold transition-colors hover:text-brand-orange ${isScrolled ? 'text-slate-600' : 'text-white'}`}
            >
              {link.name}
            </a>
          ))}
          <a href="#join" className="bg-brand-orange text-white px-5 py-2 rounded-full text-sm font-bold hover:scale-105 transition-all">
            Join Academy
          </a>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden p-2 z-[110]" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-8 h-8 text-brand-navy" />
          ) : (
            <Menu className={`w-8 h-8 ${isScrolled ? 'text-brand-navy' : 'text-white'}`} />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[105] flex flex-col p-8 md:hidden"
          >
            <div className="flex flex-col gap-6 mt-16">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={(e) => handleMobileLinkClick(e, link.href)}
                  className="text-2xl font-black text-brand-navy uppercase tracking-tighter border-b border-slate-100 pb-2"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#join"
                onClick={(e) => handleMobileLinkClick(e, '#join')}
                className="mt-4 bg-brand-orange text-white px-8 py-4 rounded-2xl text-center text-xl font-bold"
              >
                Join Academy
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { hero } = useContent();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Safely extract values with fallbacks
  const badge = hero?.badge || "Welcome";
  const title = hero?.title || "Vendhan Academy";
  const subtitle = hero?.subtitle || "";
  const slides = hero?.slides || ["images/hero1.png"];

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full">
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
            {title.includes(' ') ? (
              <>
                {title.split(' ').slice(0, -2).join(' ')} <br />
                <span className="text-brand-orange">{title.split(' ').slice(-2).join(' ')}</span>
              </>
            ) : title}
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
            <a href="#programs" className="group bg-brand-orange text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition-all">
              Explore Programs
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <div className="px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg text-white border border-white/30 bg-white/5 flex items-center justify-center">
              Facility Rental coming soon
            </div>
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
    </section>
  );
};

const Programs = () => {
  const { programs } = useContent();
  
  // Debug line: Open your browser console (F12) to see this number
  console.log("Total programs loaded:", programs?.length);

  if (!programs || programs.length === 0) return null;

  // 1. Identify specific programs for the special "Journal" slots
  // We use .find() so that if the ID matches, it goes in the right spot
  const silambam = programs.find(p => p.id === 'silambam') || programs[0];
  const badminton = programs.find(p => p.id === 'badminton') || programs[1];
  const football = programs.find(p => p.id === 'football') || programs[2];
  const yoga = programs.find(p => p.id === 'yoga') || programs[3];
  const skating = programs.find(p => p.id === 'skating') || programs[4];

  // 2. Identify ALL other programs for the bottom grid
  // This identifies which IDs we already used in the top section
  const usedIds = [silambam.id, badminton.id, football.id, yoga.id, skating.id];
  
  // This array will contain every other program (Fitness, Music, Athletics, etc.)
  const remainingPrograms = programs.filter(p => !usedIds.includes(p.id));

  return (
    <section id="programs" className="section-padding bg-white text-brand-navy">
      <div className="max-w-[1300px] mx-auto px-6">
        
        {/* --- JOURNAL HEADER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 border-b border-slate-100 pb-8"
        >
          <span className="text-[#D63384] font-bold tracking-[0.3em] text-[10px] uppercase mb-2 block">Academy Journal</span>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-brand-navy">VENDHAN PROGRAMS</h2>
        </motion.div>

        {/* --- TOP ROW: SILAMBAM + BADMINTON/FOOTBALL --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Silambam (Large Featured) */}
          <motion.div className="lg:col-span-5 relative group border border-slate-100">
            <div className="h-[500px] lg:h-[600px] overflow-hidden">
              <img src={silambam.image} className="w-full h-full object-cover" alt={silambam.title} />
            </div>
            <div className="absolute bottom-10 left-6 right-6 bg-white p-8 shadow-2xl border border-slate-50">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">{silambam.category}</span>
              <h3 className="text-4xl font-black text-brand-navy leading-none mb-4 uppercase tracking-tighter">{silambam.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-3">{silambam.description}</p>
              <a href="#join" className="text-[10px] font-black text-brand-navy uppercase tracking-widest border-b-2 border-brand-navy pb-1 hover:text-[#D63384] hover:border-[#D63384] transition-all">
                Join Now
              </a>
            </div>
          </motion.div>

          {/* Side Stack (Badminton & Football) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Badminton */}
            <div className="flex flex-col md:flex-row bg-white border border-slate-100 overflow-hidden h-full md:h-[285px]">
              <div className="md:w-1/2 overflow-hidden">
                <img src={badminton.image} className="w-full h-full object-cover" alt={badminton.title} />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <h4 className="text-[#D63384] text-3xl font-black leading-none mb-3 uppercase">{badminton.title}</h4>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">{badminton.description}</p>
                <p className="text-slate-400 text-[9px] uppercase tracking-widest font-bold">ACADEMY NEWS / {badminton.category}</p>
              </div>
            </div>

            {/* Football */}
            <div className="flex flex-col md:flex-row-reverse bg-white border border-slate-100 overflow-hidden h-full md:h-[285px]">
              <div className="md:w-1/2 overflow-hidden">
                <img src={football.image} className="w-full h-full object-cover" alt={football.title} />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center text-right md:text-left">
                <h4 className="text-[#D63384] text-3xl font-black leading-none mb-3 uppercase">{football.title}</h4>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">{football.description}</p>
                <p className="text-slate-400 text-[9px] uppercase tracking-widest font-bold">ACADEMY NEWS / {football.category}</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECONDARY ROW: YOGA + SKATING --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {[yoga, skating].map((program) => (
            <div key={program.id} className="bg-white border border-slate-100 overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img src={program.image} className="w-full h-full object-cover" alt={program.title} />
              </div>
              <div className="p-8">
                <h4 className="text-[#D63384] text-3xl font-black leading-none mb-3 uppercase tracking-tighter">{program.title}</h4>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">{program.description}</p>
                <p className="text-slate-400 text-[9px] uppercase tracking-widest font-bold">ACADEMY NEWS / {program.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- REMAINING GRID: EVERY OTHER PROGRAM --- */}
        {remainingPrograms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingPrograms.map((program) => (
              <motion.div 
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border border-slate-100 flex flex-col group"
              >
                <div className="h-56 overflow-hidden relative">
                  <img src={program.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={program.title} />
                  <div className="absolute top-0 left-0 bg-[#D63384] text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest">
                    {program.category}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h4 className="text-brand-navy text-xl font-black leading-tight mb-3 uppercase">{program.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-1">{program.description}</p>
                  <div className="pt-4 border-t border-slate-100">
                    <a href="#join" className="text-[10px] font-bold text-slate-400 hover:text-[#D63384] uppercase tracking-widest transition-colors flex items-center gap-2">
                      <div className="w-6 h-[1px] bg-slate-200"></div>
                      Learn More
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const SummerCamp = ({ onImageClick }: { onImageClick: (url: string) => void }) => {
  const { summer_camp } = useContent();
  
  // Safety check: if data is missing, use an empty list
  const { features = [] } = summer_camp || {};
  
  const campImages = ["/images/SUM1.png", "/images/SUM2.png", "/images/SUM3.png", "/images/SUM4.png"];

  return (
    <section id="summer-camp" className="section-padding bg-brand-orange text-white overflow-hidden relative">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 px-6">
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
              className={`aspect-square rounded-2xl overflow-hidden border-2 border-white/20 cursor-zoom-in ${index % 2 !== 0 ? 'mt-8' : ''}`}>
              {isVideo(src) ? (
              <video src={src} muted loop autoPlay className="w-full h-full object-cover" />
              ) : (
              <img src={src} className="w-full h-full object-cover" alt="Camp" />
              )}
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
                  <button className="mt-15 bg-white text-brand-navy px-9 py-4 text-2xl rounded-full font-bold">
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
  const [hoveredSubLink, setHoveredSubLink] = useState<any | null>(null);
  
  const content = useContent(); 
  const data = content.achievements_list || [];

  const current = data[activeIndex];
  const displayImage = hoveredSubLink ? hoveredSubLink.image : current?.image;
  const displayTitle = hoveredSubLink ? hoveredSubLink.name : current?.title;
  const displayDescription = hoveredSubLink ? hoveredSubLink.description : current?.description;
  const displayLabel = hoveredSubLink ? 'DETAIL' : (current?.label || 'AWARD');

  return (
    <section id="achievements" className="py-20 md:py-32 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <span className="text-brand-orange font-bold tracking-widest text-xs uppercase mb-2 block">Hall of Fame</span>
          <h2 className="text-5xl font-black text-brand-navy uppercase tracking-tighter">Achievements</h2>
        </div>
        
        {data.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">No achievements available yet.</p>
          </div>
        ) : (
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* LEFT SIDE: THE BIG PREVIEW CARD */}
          <div className="lg:w-1/2 w-full">
            <motion.div 
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/5] w-full max-w-[450px] mx-auto rounded-[2rem] overflow-hidden shadow-2xl bg-[#151619] cursor-zoom-in group"
              onClick={() => onImageClick(displayImage)}
            >
              {/* VIDEO OR IMAGE LOGIC (FIXED POSITION) */}
              <AnimatePresence mode="wait">
                {isVideo(displayImage) ? (
                  <motion.video
                    key={displayImage}
                    src={displayImage}
                    autoPlay muted loop playsInline
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <motion.img 
                    key={displayImage}
                    src={displayImage} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                    alt="Achievement Preview"
                  />
                )}
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#151619] via-transparent to-transparent" />

              <div className="relative h-full flex flex-col justify-center items-center text-center p-12 text-white pointer-events-none">
                <span className="absolute text-[12rem] font-black opacity-10 select-none">{current?.number}</span>
                <div className="z-10 relative">
                  <p className="text-brand-orange font-bold tracking-[0.3em] text-xs uppercase mb-4">{displayLabel}</p>
                  <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-tight mb-6">{displayTitle}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-xs mx-auto line-clamp-4">{displayDescription}</p>
                </div>
                <div className="absolute bottom-10 bg-white/10 p-4 rounded-full border border-white/10 group-hover:bg-brand-orange transition-all">
                   <Trophy className="w-6 h-6 text-brand-orange group-hover:text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE: THE LIST OF TITLES */}
          <div className="lg:w-1/2 w-full">
            <div className="space-y-6">
              {data.map((item: any, idx: number) => (
                <div key={idx} className="group">
                  <button
                    onMouseEnter={() => { setActiveIndex(idx); setHoveredSubLink(null); }}
                    className={`flex items-center gap-6 w-full text-left transition-all duration-300 ${activeIndex === idx ? 'opacity-100 translate-x-2' : 'opacity-30 hover:opacity-60'}`}
                  >
                    <span className="text-sm font-mono font-bold text-slate-400">0{idx + 1}</span>
                    <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${activeIndex === idx ? 'text-brand-navy' : 'text-slate-500'}`}>
                      {item.title}
                    </h3>
                  </button>

                  <AnimatePresence>
                    {activeIndex === idx && item.subLinks?.length > 0 && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-14 mt-4 space-y-3 overflow-hidden"
                      >
                        {item.subLinks.map((sub: any, sIdx: number) => (
                          <div 
                            key={sIdx}
                            onMouseEnter={() => setHoveredSubLink(sub)}
                            onMouseLeave={() => setHoveredSubLink(null)}
                            onClick={(e) => { e.stopPropagation(); onImageClick(sub.image); }}
                            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-orange cursor-zoom-in transition-colors group/sub"
                          >
                            <ChevronRight className={`w-3 h-3 transition-transform ${hoveredSubLink?.name === sub.name ? 'translate-x-1 text-brand-orange' : ''}`} />
                            {sub.name}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

        </div>
        )}
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

const About = () => {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
          <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img src="images/phsic.png" alt="Academy" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

const ExpertGuidance = () => {
  const content = useContent();
  const stats = content.achievements; // This looks for the 4 stats boxes
  const coaches = content.coaches || []; // Get coaches data

  return (
    <section id="stats" className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Expert Guidance / Coaches Section */}
        {coaches.length > 0 && (
          <div>
            <div className="mb-12">
              <span className="text-brand-orange font-bold tracking-widest text-xs uppercase mb-2 block">Meet Our Masters</span>
              <h2 className="text-5xl font-black text-brand-navy uppercase tracking-tighter">Expert Guidance</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {coaches.map((coach: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-brand-orange/20">
                    <img src={coach.image} alt={coach.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-black text-brand-navy mb-2 uppercase">{coach.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{coach.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Boxes (The 4 white boxes) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-24">
          {stats?.map((stat: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center hover:shadow-xl transition-all"
            >
              <div className="mb-3 bg-orange-50 p-2 rounded-xl">
                {getIcon(stat.icon)}
              </div>
              <div className="text-3xl md:text-4xl font-black text-brand-navy mb-1">
                {stat.value}
              </div>
              <div className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                {stat.label}
              </div>
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div className="bg-brand-navy rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          <motion.div className="lg:w-2/5 p-6 sm:p-8 md:p-10 lg:p-12 bg-brand-orange text-white flex flex-col justify-center">
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/80 font-bold mb-4">Start Today</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-8">Become a Champion</h3>
            <p className="text-sm sm:text-base text-white/80 mb-8 sm:mb-10 leading-relaxed">Fill out the form to start your journey with Vendhan Sports Academy.</p>
          </motion.div>
          
          <motion.div className="lg:w-3/5 p-6 sm:p-8 md:p-10 lg:p-12 bg-white">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <CheckCircle2 className="w-20 h-20 text-green-500" />
                <h4 className="text-2xl font-bold text-brand-navy">Application Received!</h4>
                <button onClick={() => setStatus('idle')} className="text-brand-orange font-bold">Submit another</button>
              </div>
            ) : (
              <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base" placeholder="Full Name" />
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base" placeholder="Email" />
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base" placeholder="Phone" />
                <select value={formData.program} onChange={(e) => setFormData({ ...formData, program: e.target.value })} className="w-full px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base">
                  {PROGRAMS.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
                  <option value="summercamp 2026 music">Summercamp 2026 Music</option>
                  <option value="summercamp 2026 badminton">Summercamp 2026 Badminton</option>
                  <option value="summercamp 2026 silambam">Summercamp 2026 Silambam</option>
                  <option value="summercamp 2026 chess">Summercamp 2026 Chess</option>
                  <option value="summercamp 2026 football">Summercamp 2026 Football</option>
                  <option value="summercamp 2026 physical fitness and aerobics">Summercamp 2026 Physical Fitness and Aerobics</option>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12 mb-12 md:mb-16">
          
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
                <span>220-P, APP Nagar,<br />Oddanchatram, Tamil Nadu 600001</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-orange shrink-0" />
                <a href="mailto:vendhansportsacademy@gmail.com" className="hover:text-white">vendhansportsacademy@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-brand-orange shrink-0" />
                <span>+91 8608649937 <br />+91 9566672112</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter/Timing */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Working Hours</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="flex justify-between">
                <span>Mon - Sun:</span>
                <span className="text-white">6:00 AM - 7:30 PM</span>
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
          // Only update state if API returns valid data with achievements_list
          if (data && data.achievements_list && data.achievements_list.length > 0) {
            setContent(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
      }
    };
    fetchContent();
  }, []);

  const handleSaveContent = async (newContent: Content) => {
    try {
      console.log('Saving content to MongoDB...');
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-updated-by': 'admin'
        },
        body: JSON.stringify(newContent),
      });
      
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
      }
      
      if (response.ok) {
        setContent(newContent);
        setIsEditing(false);
        console.log('✅ Content saved successfully', {
          version: result.version,
          lastUpdatedAt: result.lastUpdatedAt
        });
        alert(`✅ Content updated successfully! (Version: ${result.version})`);
      } else {
        console.error('Server error response:', result);
        throw new Error(result.error || result.message || 'Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`❌ Failed to save content:\n\n${errorMessage}`);
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
        <About />
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