/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Users, Calendar, MapPin, ArrowRight, CheckCircle2, 
  Instagram, Facebook, Mail, Menu, X, Activity, Zap, Star, 
  ChevronRight, Sun, Flame, Target
} from 'lucide-react';
import contentData from '../content.json';

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
  achievements: any[];
  achievements_list: any[];
  coaches: Coach[];
  summer_camp: {
    features: {
      title: string;
      description: string;
      icon: string;
    }[];
    batches?: {
      id: string;
      name: string;
      dates: string;
    }[];
    activityBatches?: Record<string, string[]>;
    activityBatchDates?: Record<string, Record<string, string>>;
  };
}

// --- Helpers ---
const isVideo = (url: string) => url?.toLowerCase().endsWith('.mp4') || url?.toLowerCase().endsWith('.webm');

const ICON_MAP: Record<string, any> = { Trophy, Users, Zap, Activity, Target, Star, Flame, Sun };
const getIcon = (name: string) => {
  const Icon = ICON_MAP[name] || Star;
  return <Icon className="w-8 h-8 text-brand-orange" />;
};
const getSmallIcon = (name: string) => {
  const Icon = ICON_MAP[name] || Star;
  return <Icon className="w-6 h-6" />;
};

const EVENTS = [
  { id: '1', title: 'Annual Silambam World Record Attempt', description: 'A large-scale event aiming to achieve a record in stick rotation.', date: 'Oct 15, 2025' },
  { id: '2', title: 'Inter-Academy Football Tournament', description: 'A competitive platform for youth football teams.', date: 'Nov 20, 2025' },
  { id: '3', title: 'State Level Yoga Championship', description: 'An event showcasing flexibility, balance, and focus.', date: 'Dec 05, 2025' }
];

const PROGRAMS = [
  { id: 'yoga', title: 'Yoga' },
  { id: 'silambam', title: 'Silambam' },
  { id: 'fitness', title: 'Physical Fitness' },
  { id: 'aerobics', title: 'Aerobics' },
  { id: 'music', title: 'Music' },
  { id: 'badminton', title: 'Badminton' },
  { id: 'athletics', title: 'Athletics' },
  { id: 'skating', title: 'Roller Skating' },
  { id: 'martial-arts', title: 'Martial Arts' },
  { id: 'football', title: 'Football' }
];

// --- Context ---
const ContentContext = React.createContext<Content | null>(null);

const useContent = () => {
  const context = React.useContext(ContentContext);
  return context || (contentData as unknown as Content);
};

// --- Components ---

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

const Navbar = ({ onOpenModal }: { onOpenModal: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Programs', href: '#programs' },
    { name: 'Summer Camp', href: '#summer-camp' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'About', href: '#about' },
  ];

  const handleNavClick = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-3 sm:py-4'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="images/logo.png" alt="Logo" className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain" />
            <div className={`flex flex-col leading-tight font-bold ${isScrolled ? 'text-brand-navy' : 'text-white'}`}>
              <span className="text-sm sm:text-lg uppercase tracking-tighter">VENDHAN</span>
              <span className={`text-[6px] sm:text-[10px] font-semibold ${isScrolled ? 'text-slate-500' : 'text-brand-orange'}`}>Sports Academy</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className={`text-xs xl:text-sm font-bold hover:text-brand-orange transition-colors ${isScrolled ? 'text-slate-600' : 'text-white'}`}>{link.name}</a>
            ))}
            <a href="#join" className="bg-brand-orange text-white px-4 xl:px-5 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-bold hover:scale-105 transition-all">Join Academy</a>
          </div>

          <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className={`w-6 h-6 ${isScrolled || isMobileMenuOpen ? 'text-brand-navy' : 'text-white'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[150] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold text-brand-navy">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                <X className="w-6 h-6 text-brand-navy" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={handleNavClick}
                  className="block px-6 py-3 text-base font-bold text-brand-navy hover:bg-slate-50 hover:text-brand-orange border-b border-slate-100"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
            <div className="p-4 border-t">
              <a href="#join" onClick={handleNavClick} className="block w-full bg-brand-orange text-white text-center py-3 rounded-full font-bold">Join Academy</a>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

const Hero = () => {
  const { hero } = useContent();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = hero?.slides || ["images/hero1.png"];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-navy">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img key={currentSlide} src={slides[currentSlide]} initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="w-full h-full object-cover" />
        </AnimatePresence>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <span className="px-3 py-1.5 bg-brand-orange/20 text-brand-orange rounded-full text-xs font-bold uppercase mb-4 sm:mb-6 inline-block">{hero?.badge}</span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white font-black uppercase leading-[0.9] sm:leading-none mb-4 sm:mb-8">{hero?.title}</h1>
          <p className="text-base sm:text-xl text-slate-300 mb-6 sm:mb-10 max-w-lg">{hero?.subtitle}</p>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <a href="#programs" className="bg-brand-orange text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full font-bold flex items-center gap-2 text-sm sm:text-base">Explore Programs <ArrowRight size={18} className="sm:w-5 sm:h-5"/></a>
          </div>
        </motion.div>
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

const SummerCamp = ({ onImageClick, onEnrollClick }: { onImageClick: (url: string) => void, onEnrollClick: () => void }) => {
  const { summer_camp } = useContent();
  
  // Safety check: if data is missing, use an empty list
  const { features = [] } = summer_camp || {};
  
  const campImages = ["/images/FIN1.png", "/images/FIN2.png", "/images/FIN5.png", "/images/FIN4.png"];

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
                 <button 
                   onClick={onEnrollClick} 
                 className="bg-brand-navy text-white px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-black/20 text-center inline-block">
                   Register Now
                  </button>
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

// --- MODAL COMPONENT ---
const SummerCampModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { summer_camp } = useContent();
    const batches = summer_camp?.batches || [
      { id: 'b1', name: 'Batch I', dates: 'Apr 11 - Apr 30' },
      { id: 'b2', name: 'Batch II', dates: 'May 1-20' }
    ];
    
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ fullName: '', schoolName: '', place: '', phone: '', email: '' });
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [selections, setSelections] = useState<Record<string, { b1: boolean; b2: boolean }>>({});
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  
    const activities = [
      "Archery", "Badminton", "Chess Coaching", "Football",
      "KidsFun Camp", "Music", "Physical Fitness & Aerobics",
      "Roller Skating", "Silambam", "Yoga"
    ];

    React.useEffect(() => {
      if (isOpen) {
        const initial: Record<string, { b1: boolean; b2: boolean }> = {};
        activities.forEach(a => initial[a] = { b1: false, b2: false });
        setSelections(initial);
        setFormData({ fullName: '', schoolName: '', place: '', phone: '', email: '' });
        setErrors({});
        setStep(1);
        setStatus('idle');
      }
    }, [isOpen]);

    const toggleSelection = (activity: string, batch: 'b1' | 'b2') => {
      setSelections(prev => ({
        ...prev,
        [activity]: {
          ...prev[activity],
          [batch]: !prev[activity][batch]
        }
      }));
    };

    const isSelected = (activity: string) => selections[activity]?.b1 || selections[activity]?.b2;
  
    const handleSubmit = async () => {
      setStatus('loading');
      const chosen = activities.filter(a => selections[a]?.b1 || selections[a]?.b2);
      const batch1 = batches.find(b => b.id === 'b1');
      const batch2 = batches.find(b => b.id === 'b2');
      const program = chosen.map(a => {
        const bs = [];
        if (selections[a].b1) bs.push((batch1?.name || 'Batch I') + ' (' + (batch1?.dates || '') + ')');
        if (selections[a].b2) bs.push((batch2?.name || 'Batch II') + ' (' + (batch2?.dates || '') + ')');
        return a + ': ' + bs.join(' & ');
      }).join(' | ');
      
      try {
        const res = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, program })
        });
        if (res.ok) setStatus('success');
      } catch (e) { setStatus('idle'); alert("Error submitting"); }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: false });
    };
  
    const validateStep1 = () => {
      const newErrors: Record<string, boolean> = {};
      if (!formData.fullName.trim()) newErrors.fullName = true;
      if (!formData.schoolName.trim()) newErrors.schoolName = true;
      if (!formData.place.trim()) newErrors.place = true;
      if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = true;
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
      const hasAny = activities.some(a => selections[a]?.b1 || selections[a]?.b2);
      if (!hasAny) alert("Please select at least one activity and batch before continuing.");
      return hasAny;
    };

    const goToStep = (s: number) => {
      if (s === 2 && step === 1 && !validateStep1()) return;
      if (s === 3 && step === 2 && !validateStep2()) return;
      setStep(s);
    };

    const resetForm = () => {
      setFormData({ fullName: '', schoolName: '', place: '', phone: '', email: '' });
      setErrors({});
      const initial: Record<string, { b1: boolean; b2: boolean }> = {};
      activities.forEach(a => initial[a] = { b1: false, b2: false });
      setSelections(initial);
      setStep(1);
      setStatus('idle');
    };
  
    if (!isOpen) return null;

    const chosenActivities = activities.filter(a => selections[a]?.b1 || selections[a]?.b2);
  
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative">
          <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          {/* HEADER */}
          <div className="bg-[#0F6E56] p-4 sm:p-6 pt-10 sm:pt-12">
            <div className="flex items-center gap-3 mb-3">
              <img src="images/logo.png" alt="Logo" className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-white/15 border border-white/30 object-contain p-1" />
              <div>
                <div className="text-white font-bold text-base sm:text-lg">Vendhan Sports Academy</div>
                <div className="text-white/70 text-xs">Excellence in Sports Education</div>
              </div>
            </div>
            <div className="text-white text-lg sm:text-xl font-bold">Vendhan Summer Camp 2026</div>
            <div className="text-white/70 text-sm">Student Registration Form</div>
          </div>

          {/* STEPS */}
          <div className="flex bg-[#f7fbfc] border-b border-[#dde8ec]">
            {[
              { n: 1, label: 'Student Details' },
              { n: 2, label: 'Select Activities' },
              { n: 3, label: 'Review & Submit' }
            ].map(s => (
              <div key={s.n} className={'flex-1 py-3 text-center text-xs cursor-default ' + (step === s.n ? 'text-[#0F6E56] font-bold border-b-2 border-[#0F6E56]' : step > s.n ? 'text-[#0F6E56]' : 'text-[#888]')}>
                <span className={'inline-flex items-center justify-center w-5 h-5 rounded-full border text-[11px] mr-1 ' + (step >= s.n ? 'bg-[#0F6E56] text-white border-[#0F6E56]' : 'border-current')}>{s.n}</span>
                {s.label}
              </div>
            ))}
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-6">
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 bg-[#EAF6FA] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h3 className="text-lg font-bold text-[#0F6E56] mb-2">Registration Submitted!</h3>
                <p className="text-sm text-[#666] mb-6">Thank you, <strong>{formData.fullName}</strong>.<br/>Your registration has been received. Our team will contact you shortly.</p>
                <button onClick={() => { resetForm(); onClose(); }} className="px-6 py-2 bg-[#0F6E56] text-white rounded-lg font-bold">Close</button>
              </div>
            ) : (
              <>
                {step === 1 && (
                  <div>
                    <div className="text-[#0F6E56] text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 border-[#E8F4F8]">Personal Information</div>
                    <div className={`mb-4 ${errors.fullName ? 'bg-red-50' : ''}`}>
                      <label className="block text-sm font-bold text-[#555] mb-1">Student Name *</label>
                      <input name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full h-10 px-3 border rounded-lg text-sm ${errors.fullName ? 'border-red-500' : 'border-[#ccd8dc]'}`} placeholder="Full name" />
                      {errors.fullName && <div className="text-xs text-red-500 mt-1">This field is required.</div>}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-bold text-[#555] mb-1">School Name *</label>
                        <input name="schoolName" value={formData.schoolName} onChange={handleChange} className={`w-full h-10 px-3 border rounded-lg text-sm ${errors.schoolName ? 'border-red-500' : 'border-[#ccd8dc]'}`} placeholder="School name" />
                        {errors.schoolName && <div className="text-xs text-red-500 mt-1">This field is required.</div>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#555] mb-1">Place / City *</label>
                        <input name="place" value={formData.place} onChange={handleChange} className={`w-full h-10 px-3 border rounded-lg text-sm ${errors.place ? 'border-red-500' : 'border-[#ccd8dc]'}`} placeholder="City or town" />
                        {errors.place && <div className="text-xs text-red-500 mt-1">This field is required.</div>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-bold text-[#555] mb-1">Phone Number *</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} maxLength={10} className={`w-full h-10 px-3 border rounded-lg text-sm ${errors.phone ? 'border-red-500' : 'border-[#ccd8dc]'}`} placeholder="10-digit number" />
                        {errors.phone && <div className="text-xs text-red-500 mt-1">Enter a valid 10-digit number.</div>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#555] mb-1">Email Address</label>
                        <input name="email" value={formData.email} onChange={handleChange} className="w-full h-10 px-3 border border-[#ccd8dc] rounded-lg text-sm" placeholder="email@example.com (optional)" />
                      </div>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="flex flex-col h-full">
                    <div className="text-[#0F6E56] text-sm font-medium mb-3">Select activities and batches</div>
                    <div className="flex-1 overflow-y-auto max-h-[400px] pr-1">
                      <div className="grid grid-cols-2 gap-3">
                        {activities.map((act, idx) => {
                          const icons = ["🎯", "🏸", "♟️", "⚽", "🎮", "🎵", "💪", "⛸️", "🥢", "🧘"];
                          const singleBatchActivities = ['Music', 'KidsFun Camp'];
                          const isSingleBatch = singleBatchActivities.includes(act);
                          const activityBatches = summer_camp?.activityBatches?.[act];
                          const showB1 = isSingleBatch || !activityBatches || activityBatches.includes('b1');
                          const showB2 = !isSingleBatch && (!activityBatches || activityBatches.includes('b2'));
                          const customDates = summer_camp?.activityBatchDates?.[act];
                          const b1Batch = batches.find(b => b.id === 'b1');
                          const b2Batch = batches.find(b => b.id === 'b2');
                          const b1Dates = isSingleBatch ? (act === 'Music' ? 'Apr 17 - May 6' : 'Apr 11 - Apr 30') : (customDates?.b1 || b1Batch?.dates || 'Apr 17 - May 6');
                          const b1 = { name: b1Batch?.name || 'Batch I', dates: b1Dates };
                          const b2 = { name: b2Batch?.name || 'Batch II', dates: customDates?.b2 || b2Batch?.dates || 'May 1-20' };
                          const isActSelected = isSelected(act);
                          return (
                          <div key={act} className={`border rounded-xl p-3 bg-white transition-all duration-200 ${isActSelected ? 'border-[#0F6E56] bg-[#E1F5EE] shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${isActSelected ? 'bg-[#0F6E56]/20' : 'bg-slate-100'}`}>{icons[idx]}</div>
                              <div className="font-medium text-[13px] text-slate-800">{act}</div>
                            </div>
                            <div className="space-y-2">
                              {showB1 && (
                              <label className={`flex items-center gap-2 cursor-pointer group`}>
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${selections[act]?.b1 ? 'bg-[#0F6E56] border-[#0F6E56]' : 'border-slate-300 group-hover:border-[#0F6E56]'}`}>
                                  {selections[act]?.b1 && <span className="text-white text-[10px]">✓</span>}
                                </div>
                                <input type="checkbox" className="hidden" checked={selections[act]?.b1 || false} onChange={() => toggleSelection(act, 'b1')} />
                                <span className="text-[11px] text-slate-600">
                                  <span className="font-bold">Batch I:</span> {b1.dates}
                                </span>
                              </label>
                              )}
                              {showB2 && (
                              <label className={`flex items-center gap-2 cursor-pointer group`}>
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${selections[act]?.b2 ? 'bg-[#0F6E56] border-[#0F6E56]' : 'border-slate-300 group-hover:border-[#0F6E56]'}`}>
                                  {selections[act]?.b2 && <span className="text-white text-[10px]">✓</span>}
                                </div>
                                <input type="checkbox" className="hidden" checked={selections[act]?.b2 || false} onChange={() => toggleSelection(act, 'b2')} />
                                <span className="text-[11px] text-slate-600">
                                  <span className="font-bold">Batch II:</span> {b2.dates}
                                </span>
                              </label>
                              )}
                            </div>
                          </div>
                        )})}
                      </div>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div>
                    <div className="text-[#0F6E56] text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 border-[#E8F4F8]">Student Details</div>
                    <table className="w-full mb-6 text-sm">
                      <tbody>
                        {[
                          ['Student Name', formData.fullName],
                          ['School Name', formData.schoolName],
                          ['Place / City', formData.place],
                          ['Phone Number', formData.phone],
                          ['Email Address', formData.email]
                        ].map(([label, value]) => (
                          <tr key={label}>
                            <td className="py-2 px-3 bg-[#F7FBFD] text-[#5A7A8A] font-bold w-2/5">{label}</td>
                            <td className="py-2 px-3 bg-white text-[#1a1a1a]">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="text-[#0F6E56] text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 border-[#E8F4F8]">Selected Activities & Batches</div>
                    {chosenActivities.length > 0 ? (
                      <div className="space-y-3">
                        {chosenActivities.map(a => {
                          const singleBatchActivities = ['Music', 'KidsFun Camp'];
                          const isSingleBatch = singleBatchActivities.includes(a);
                          const customDates = summer_camp?.activityBatchDates?.[a];
                          const b1Batch = batches.find(b => b.id === 'b1');
                          const b2Batch = batches.find(b => b.id === 'b2');
                          const b1Dates = isSingleBatch ? (a === 'Music' ? 'Apr 17 - May 6' : 'Apr 11 - Apr 30') : (customDates?.b1 || b1Batch?.dates || 'Apr 17 - May 6');
                          const b1 = { name: b1Batch?.name || 'Batch I', dates: b1Dates };
                          const b2 = { name: b2Batch?.name || 'Batch II', dates: customDates?.b2 || b2Batch?.dates || 'May 1-20' };
                          return (
                          <div key={a} className="py-2 border-b border-[#eee] last:border-0">
                            <div className="font-bold text-sm text-[#1a1a1a] mb-1">{a}</div>
                            <div className="flex flex-wrap gap-2">
                              {selections[a].b1 && <span className="text-xs px-2 py-1 rounded-full bg-[#E8F4F8] text-[#0F6E56] border border-[#A8D4E0]">{b1.name} — {b1.dates}</span>}
                              {selections[a].b2 && <span className="text-xs px-2 py-1 rounded-full bg-[#E8F4F8] text-[#0F6E56] border border-[#A8D4E0]">{b2.name} — {b2.dates}</span>}
                            </div>
                          </div>
                        )})}
                      </div>
                    ) : (
                      <p className="text-sm text-[#888] py-3">No activities selected.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* FOOTER */}
          {status !== 'success' && (
            <div className="p-4 border-t bg-[#f0f4f6] flex justify-between">
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="px-5 py-2 rounded-lg border border-[#ccd8dc] bg-white text-[#333] font-bold text-sm hover:bg-[#f0f4f6]">← Back</button>
              )}
              <div className="flex-1"></div>
              <button onClick={() => step < 3 ? goToStep(step + 1) : handleSubmit()} disabled={status === 'loading'} className="px-6 py-2 bg-[#0F6E56] text-white rounded-lg font-bold text-sm hover:bg-[#1A4F67] disabled:opacity-50">
                {status === 'loading' ? 'Submitting...' : step < 3 ? 'Next →' : 'Submit Registration'}
              </button>
            </div>
          )}

          {/* PAGE FOOTER */}
          <div className="bg-[#f0f4f6] px-6 py-3 border-t border-[#dde8ec] flex justify-between items-center flex-wrap gap-2">
            <div className="text-xs font-bold text-[#0F6E56]">Vendhan Sports Academy</div>
            <div className="text-xs text-[#8A9AB5]">Summer Camp 2026 — Registration Portal</div>
          </div>
        </motion.div>
      </motion.div>
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
            <h3 className="text-4xl md:text-5xl mb-6 leading-tight">Rental Facility</h3>
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
                    <img src={coach.image} alt={coach.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                   <h3 className="text-2xl font-black text-brand-navy mb-2">{coach.name}</h3>
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
    place: '',
    schoolName: '',
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
        setFormData({ fullName: '', email: '', phone: '', place: '', schoolName: '', program: 'Silambam' });
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
            <div className="flex items-center gap-3 mb-4">
              <img src="images/logo.png" alt="Logo" className="w-12 h-12 object-contain bg-white/10 rounded-lg p-1" />
              <div>
                <div className="font-bold text-sm">Vendhan Sports Academy</div>
                <div className="text-xs text-white/70">Excellence in Sports Education</div>
              </div>
            </div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/80 font-bold mb-4">Start Today</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-8">Become a Champion</h3>
            <p className="text-sm sm:text-base text-white/80 mb-8 sm:mb-10 leading-relaxed">Fill out the form to start your journey with Vendhan Sports Academy.</p>
          </motion.div>
          
          <motion.div className="lg:w-3/5 p-6 sm:p-8 md:p-10 lg:p-12 bg-white">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-6">
                  <div className="bg-[#0F6E56] p-4 flex items-center gap-3">
                    <img src="images/logo.png" alt="Logo" className="w-10 h-10 object-contain bg-white/10 rounded-lg p-1" />
                    <div>
                      <div className="text-white font-bold text-sm">Vendhan Sports Academy</div>
                      <div className="text-white/70 text-xs">Excellence in Sports Education</div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-center w-14 h-14 bg-[#E1F5EE] rounded-full mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-[#0F6E56]" />
                    </div>
                    <h4 className="text-lg font-bold text-brand-navy mb-1">Application Received!</h4>
                    <p className="text-xs text-slate-500 mb-4">Thank you for joining us</p>
                    <div className="text-left space-y-2 text-xs bg-slate-50 p-3 rounded-lg">
                      <div className="flex justify-between"><span className="text-slate-500">Name:</span><span className="font-medium text-slate-800">{formData.fullName}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Program:</span><span className="font-medium text-slate-800">{formData.program}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Phone:</span><span className="font-medium text-slate-800">{formData.phone}</span></div>
                    </div>
                  </div>
                </div>
                <button onClick={() => setStatus('idle')} className="text-brand-orange font-bold text-sm">Submit another</button>
              </div>
            ) : (
              <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit} noValidate>
                <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base" placeholder="Full Name" />
                <input type="text" required value={formData.place} onChange={(e) => setFormData({ ...formData, place: e.target.value })} className="w-full px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base" placeholder="Place" />
                <input type="text" required value={formData.schoolName} onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })} className="w-full px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base" placeholder="School Name" />
                <input type="text" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base" placeholder="Email (optional)" />
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base" placeholder="Phone" />
                <select value={formData.program} onChange={(e) => setFormData({ ...formData, program: e.target.value })} className="w-full px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base">
                {PROGRAMS.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
                <option value="Chess Coaching">Chess Coaching</option>
                <option value="summercamp 2026 music">Summercamp 2026 Music</option>
                <option value="summercamp 2026 badminton">Summercamp 2026 KidsFun Activities</option>
                <option value="summercamp 2026 archery">Summercamp 2026 Archery Batch-I (Apr 11-30)</option>
                <option value="summercamp 2026 archery">Summercamp 2026 Archery Batch-II (May 1-20)</option>

                <option value="summercamp 2026 athletics">Summercamp 2026 Athletics Batch-I (Apr 11-30)</option>
                <option value="summercamp 2026 athletics">Summercamp 2026 Athletics Batch-II (May 1-20)</option>

                <option value="summercamp 2026 badminton">Summercamp 2026 Badminton Batch-I (Apr 11-30)</option>
                <option value="summercamp 2026 badminton">Summercamp 2026 Badminton Batch-II (May 1-20)</option>

                <option value="summercamp 2026 chess">Summercamp 2026 Chess Batch-I (Apr 11-30)</option>
                <option value="summercamp 2026 chess">Summercamp 2026 Chess Batch-II (May 1-20)</option>

                <option value="summercamp 2026 football">Summercamp 2026 Football Batch-I (Apr 11-30)</option>
                <option value="summercamp 2026 football">Summercamp 2026 Football Batch-II (May 1-20)</option>

                <option value="summercamp 2026 physical fitness and aerobics">Summercamp 2026 Physical Fitness & Aerobics Batch-I (Apr 11-30)</option>
                <option value="summercamp 2026 physical fitness and aerobics">Summercamp 2026 Physical Fitness & Aerobics Batch-II (May 1-20)</option>

                <option value="summercamp 2026 roller skating">Summercamp 2026 Roller Skating Batch-I (Apr 11-30)</option>
                <option value="summercamp 2026 roller skating">Summercamp 2026 Roller Skating Batch-II (May 1-20)</option>

                <option value="summercamp 2026 silambam">Summercamp 2026 Silambam Batch-I (Apr 11-30)</option>
                <option value="summercamp 2026 silambam">Summercamp 2026 Silambam Batch-II (May 1-20)</option>

                <option value="summercamp 2026 yoga">Summercamp 2026 Yoga Batch-I (Apr 11-30)</option>
                <option value="summercamp 2026 yoga">Summercamp 2026 Yoga Batch-II (May 1-20)</option>
         
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

// --- UPDATE YOUR MAIN APP COMPONENT ---
export default function App() {
  const [content, setContent] = useState<Content>(contentData);
  const [isSummerModalOpen, setIsSummerModalOpen] = useState(false); // <--- NEW STATE
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [adminMode, setAdminMode] = useState<'structured' | 'raw'>('structured');
  const [adminContent, setAdminContent] = useState<Content>(contentData);
  const [adminRawJson, setAdminRawJson] = useState<string>(JSON.stringify(contentData, null, 2));
  const [adminError, setAdminError] = useState<string>('');
  const [isSavingAdmin, setIsSavingAdmin] = useState(false);
  const [imageUploadStatus, setImageUploadStatus] = useState<string>('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const data = await response.json();
          if (data && data.hero) {
            setContent(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    if (isEditing) {
      setAdminContent(content);
      setAdminRawJson(JSON.stringify(content, null, 2));
      setAdminError('');
      setAdminMode('structured');
      setImageUploadStatus('');
    }
  }, [isEditing, content]);

  useEffect(() => {
    if (adminMode === 'raw') {
      setAdminRawJson(JSON.stringify(adminContent, null, 2));
    }
  }, [adminMode, adminContent]);

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
    } finally {
      setIsSavingAdmin(false);
    }
  };

  const uploadImageFile = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    setImageUploadStatus('Uploading...');

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Image upload failed');
    }

    setImageUploadStatus(`Uploaded ${file.name}`);
    return result.url as string;
  };

  const handleAdminSave = async () => {
    try {
      setAdminError('');
      setIsSavingAdmin(true);
      const contentToSave = adminMode === 'raw'
        ? JSON.parse(adminRawJson) as Content
        : adminContent;
      await handleSaveContent(contentToSave);
    } catch (error: any) {
      const message = error instanceof Error ? error.message : 'Invalid content data';
      setAdminError(message);
      console.error('Admin save error:', error);
    } finally {
      setIsSavingAdmin(false);
    }
  };

  const handleCloseAdmin = () => {
    setIsEditing(false);
    setAdminError('');
  };

  const updateHeroField = (field: 'badge' | 'title' | 'subtitle', value: string) => {
    setAdminContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  };

  const updateSlide = (index: number, value: string) => {
    setAdminContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        slides: prev.hero.slides.map((slide, idx) => (idx === index ? value : slide)),
      },
    }));
  };

  const updateEvent = (index: number, field: keyof Event, value: string) => {
    setAdminContent((prev) => ({
      ...prev,
      events: prev.events.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateCoach = (index: number, field: keyof Coach, value: string) => {
    setAdminContent((prev) => ({
      ...prev,
      coaches: prev.coaches.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateProgram = (index: number, field: 'title' | 'category' | 'description' | 'tagline' | 'speciality' | 'image', value: string) => {
    setAdminContent((prev) => ({
      ...prev,
      programs: prev.programs.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateAchievement = (index: number, field: 'label' | 'value' | 'icon', value: string) => {
    setAdminContent((prev) => ({
      ...prev,
      achievements: prev.achievements.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateSummerFeature = (index: number, field: 'title' | 'description' | 'icon', value: string) => {
    setAdminContent((prev) => ({
      ...prev,
      summer_camp: {
        ...prev.summer_camp,
        features: prev.summer_camp.features.map((item, idx) =>
          idx === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const AdminEditor = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[160] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Admin Portal</h2>
            <p className="text-sm text-slate-500">Edit website content, upload images, and save changes to the database.</p>
          </div>
          <button onClick={handleCloseAdmin} className="text-slate-500 hover:text-slate-900">
            Close
          </button>
        </div>
        <div className="flex gap-2 border-b border-slate-200 px-6 py-4 bg-slate-50">
          <button
            onClick={() => setAdminMode('structured')}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${adminMode === 'structured' ? 'bg-brand-navy text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
          >
            Structured Editor
          </button>
          <button
            onClick={() => setAdminMode('raw')}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${adminMode === 'raw' ? 'bg-brand-navy text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
          >
            Raw JSON
          </button>
        </div>
        {adminMode === 'raw' ? (
          <div className="p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Raw Content JSON</label>
            <textarea
              value={adminRawJson}
              onChange={(e) => setAdminRawJson(e.target.value)}
              className="w-full min-h-[520px] p-4 rounded-2xl border border-slate-300 font-mono text-xs text-slate-900 bg-slate-50 resize-none"
            />
            {adminError && <p className="mt-3 text-sm text-red-600">{adminError}</p>}
          </div>
        ) : (
          <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-300px)]">
            {/* HERO SECTION */}
            <div className="border-b border-slate-200 pb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Hero Section</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">Badge</label>
                  <input
                    value={adminContent.hero.badge}
                    onChange={(e) => updateHeroField('badge', e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">Title</label>
                  <input
                    value={adminContent.hero.title}
                    onChange={(e) => updateHeroField('title', e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <label className="block text-sm font-semibold text-slate-700">Subtitle</label>
                <textarea
                  value={adminContent.hero.subtitle}
                  onChange={(e) => updateHeroField('subtitle', e.target.value)}
                  className="w-full min-h-[90px] rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                />
              </div>
            </div>

            {/* GALLERY SECTION */}
            <div className="border-b border-slate-200 pb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Hero Slides / Gallery</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {adminContent.hero.slides.map((slide, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Slide {index + 1}</label>
                    <input
                      value={slide}
                      onChange={(e) => updateSlide(index, e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm mb-3"
                      placeholder="Image or video URL"
                    />
                    <label htmlFor={`hero-slide-upload-${index}`} className="text-xs font-semibold text-brand-navy cursor-pointer hover:text-brand-orange block">
                      Upload Image/Video
                    </label>
                    <input
                      id={`hero-slide-upload-${index}`}
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const url = await uploadImageFile(file);
                          updateSlide(index, url);
                        } catch (err: any) {
                          setAdminError(err instanceof Error ? err.message : 'Upload failed');
                        }
                      }}
                    />
                    {imageUploadStatus && <span className="text-xs text-slate-500 block mt-2">{imageUploadStatus}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* EVENTS SECTION */}
            <div className="border-b border-slate-200 pb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Events</h3>
              <div className="grid gap-4">
                {adminContent.events.map((event, index) => (
                  <div key={event.id || index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Title</label>
                        <input
                          value={event.title}
                          onChange={(e) => updateEvent(index, 'title', e.target.value)}
                          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Date</label>
                        <input
                          value={event.date}
                          onChange={(e) => updateEvent(index, 'date', e.target.value)}
                          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Description</label>
                        <textarea
                          value={event.description}
                          onChange={(e) => updateEvent(index, 'description', e.target.value)}
                          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm min-h-[70px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PROGRAMS SECTION */}
            <div className="border-b border-slate-200 pb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Programs</h3>
              <div className="grid gap-4">
                {adminContent.programs.map((program, index) => (
                  <div key={program.id || index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Title</label>
                        <input
                          value={program.title}
                          onChange={(e) => updateProgram(index, 'title', e.target.value)}
                          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Category</label>
                        <input
                          value={program.category}
                          onChange={(e) => updateProgram(index, 'category', e.target.value)}
                          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Description</label>
                        <textarea
                          value={program.description}
                          onChange={(e) => updateProgram(index, 'description', e.target.value)}
                          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm min-h-[70px]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Image URL</label>
                        <input
                          value={program.image}
                          onChange={(e) => updateProgram(index, 'image', e.target.value)}
                          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm mb-2"
                        />
                        <label htmlFor={`program-image-upload-${index}`} className="text-xs font-semibold text-brand-navy cursor-pointer hover:text-brand-orange block">
                          Upload program image
                        </label>
                        <input
                          id={`program-image-upload-${index}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const url = await uploadImageFile(file);
                              updateProgram(index, 'image', url);
                            } catch (err: any) {
                              setAdminError(err instanceof Error ? err.message : 'Upload failed');
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COACHES SECTION */}
            <div className="border-b border-slate-200 pb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Coaches</h3>
              <div className="grid gap-4">
                {adminContent.coaches.map((coach, index) => (
                  <div key={coach.name || index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Name</label>
                        <input
                          value={coach.name}
                          onChange={(e) => updateCoach(index, 'name', e.target.value)}
                          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Role</label>
                        <input
                          value={coach.role}
                          onChange={(e) => updateCoach(index, 'role', e.target.value)}
                          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Image URL</label>
                      <input
                        value={coach.image}
                        onChange={(e) => updateCoach(index, 'image', e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm mb-2"
                      />
                      <label htmlFor={`coach-image-upload-${index}`} className="text-xs font-semibold text-brand-navy cursor-pointer hover:text-brand-orange block">
                        Upload coach image
                      </label>
                      <input
                        id={`coach-image-upload-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const url = await uploadImageFile(file);
                            updateCoach(index, 'image', url);
                          } catch (err: any) {
                            setAdminError(err instanceof Error ? err.message : 'Upload failed');
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACHIEVEMENTS SECTION */}
            <div className="border-b border-slate-200 pb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Achievements</h3>
              <div className="grid gap-4">
                {adminContent.achievements.map((achievement, index) => (
                  <div key={`${achievement.label}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Label</label>
                        <input
                          value={achievement.label}
                          onChange={(e) => updateAchievement(index, 'label', e.target.value)}
                          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Value</label>
                        <input
                          value={achievement.value}
                          onChange={(e) => updateAchievement(index, 'value', e.target.value)}
                          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Icon</label>
                        <input
                          value={achievement.icon}
                          onChange={(e) => updateAchievement(index, 'icon', e.target.value)}
                          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUMMER CAMP SECTION */}
            <div className="pb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Summer Camp Features</h3>
              <div className="grid gap-4">
                {adminContent.summer_camp.features.map((feature, index) => (
                  <div key={`${feature.title}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Title</label>
                        <input
                          value={feature.title}
                          onChange={(e) => updateSummerFeature(index, 'title', e.target.value)}
                          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Icon</label>
                        <input
                          value={feature.icon}
                          onChange={(e) => updateSummerFeature(index, 'icon', e.target.value)}
                          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Description</label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => updateSummerFeature(index, 'description', e.target.value)}
                          className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm min-h-[70px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {adminError && <p className="text-sm text-red-600 mt-6 p-4 bg-red-50 rounded-2xl">{adminError}</p>}
          </div>
        )}
        <div className="flex flex-col gap-3 px-6 pb-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCloseAdmin}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdminSave}
            disabled={isSavingAdmin}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-brand-navy text-white hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingAdmin ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

return (
    <ContentContext.Provider value={content}>
      <div className="min-h-screen">
        <Navbar onOpenModal={() => setIsSummerModalOpen(true)} />
        <Hero />
        <Programs />
        
        {/* Update SummerCamp Props */}
        <SummerCamp 
           onImageClick={setSelectedImage} 
           onEnrollClick={() => setIsSummerModalOpen(true)} 
        />

        <AnimatePresence>
          {isSummerModalOpen && (
            <SummerCampModal 
              isOpen={isSummerModalOpen} 
              onClose={() => setIsSummerModalOpen(false)} 
            />
          )}
        </AnimatePresence>

        <AchievementShowcase onImageClick={setSelectedImage} />
        <FacilityRental />
        <Events />
        <Gallery onImageClick={setSelectedImage} />
        <ExpertGuidance />
        <About />
        <JoinForm />
        <Footer onEdit={() => setIsEditing(true)} />
        
        {selectedImage && (
          <Lightbox imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
        )}

        <AnimatePresence>
          {isEditing && <AdminEditor />}
        </AnimatePresence>
      </div>
    </ContentContext.Provider>
  );
}