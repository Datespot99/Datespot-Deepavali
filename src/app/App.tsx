import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play, Pause, Users, X, Star, Mic, Upload, CheckCircle, Loader2,
  MessageCircle, ArrowRight, Sparkles, Flame, Copy,
  ExternalLink, Phone, MapPin, Shield, Zap,
  Heart, Camera, UserCheck, Tv2, BellRing,
  Lock, Headphones, ChevronDown,
  CreditCard, Send, Sun, Moon,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import toast, { Toaster } from 'react-hot-toast';
import chatAvatar   from '../imports/photo_1_2026-09-07_13-39-47.jpg';
import galleryImg1  from '../imports/Screenshot_2026_08_10_21_56_20_91_948cd9899890cbd5c2798760b2b95377.jpg';
import galleryImg2  from '../imports/Screenshot_2026_08_10_21_56_34_83_948cd9899890cbd5c2798760b2b95377.jpg';
import galleryImg3  from '../imports/Screenshot_2026_08_10_21_57_02_74_948cd9899890cbd5c2798760b2b95377.jpg';
import galleryImg4  from '../imports/Screenshot_2026_08_10_22_02_08_82_948cd9899890cbd5c2798760b2b95377.jpg';
import galleryImg5  from '../imports/shrutiofficial33742026_07_30_18_12_09480ecd4d_c145_474a_9f72_efe03c792136.jpg';
import galleryImg6  from '../imports/RDT_20260727_235755726733947940243856.jpg';
import adminPhoto   from '../imports/photo_2_2026-09-07_13-39-48.jpg';
import proofPayment from '../imports/Screenshot_20260709_004939_PhonePe.jpg';
import proofReview1 from '../imports/Screenshot_2024-09-29-20-43-34-268_com.facebook.katana.jpg';
import proofReview2 from '../imports/Screenshot_2024_10_16_12_09_16_54_f598e1360c96b5a5aa16536c303cff92.jpg';
import proofReview3 from '../imports/Screenshot_2025_02_04_11_05_01_43_f598e1360c96b5a5aa16536c303cff92.jpg';
import faq4Audio from '../imports/faq4-bangalore-girls.mp3.mp3';
import faq5Audio from '../imports/faq5-how-to-join.mp3.mp3';

const B1        = '#1944F1';
const B2        = '#0F2DBB';
const ACCENT    = '#FFD700';
const HERO_GRAD = B1;

// Separate desktop and mobile prices; UPI requests use the matching amount.
const PRICING = {
  desktop: { amount: '1999', original: '3999' },
  mobile:  { amount: '999', original: '1999' },
} as const;
type PricingDevice = keyof typeof PRICING;
const formatPrice = (value: string) => `₹${Number(value).toLocaleString('en-IN')}`;

// ─── Theme system ─────────────────────────────────────────────────────────────
const DARK_THEME = {
  PAGE_BG:  '#000000',
  DARK:     '#F5F3F3',
  MUTED:    '#7A88AA',
  CARD_BG:  '#0D0D0D',
  BORDER:   'rgba(255,255,255,0.07)',
  QUOTE:    '#C0C8E8',
  DOT_BG: '#000000',
};
const LIGHT_THEME = {
  PAGE_BG:  '#F5F3F3',
  DARK:     '#08122A',
  MUTED:    '#5A6899',
  CARD_BG:  '#FFFFFF',
  BORDER:   'rgba(25,68,241,0.12)',
  QUOTE:    '#1A2A60',
  DOT_BG: '#F5F3F3',
};
type TTheme = typeof DARK_THEME & { isDark: boolean };
const ThemeCtx = React.createContext<{ theme: TTheme; toggle: () => void }>({
  theme: { ...DARK_THEME, isDark: true }, toggle: () => {},
});
const useT = (): TTheme => React.useContext(ThemeCtx).theme;
// Dot-grid page background (white dots on dark, blue dots on light)
const dotGridStyle = (T: TTheme): React.CSSProperties => ({
  backgroundColor: T.DOT_BG,
  backgroundImage: `radial-gradient(${T.isDark ? 'rgba(255,255,255,0.14)' : 'rgba(25,68,241,0.20)'} 1px, transparent 1.2px)`,
  backgroundSize: '24px 24px',
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isNight = () => { const h = new Date().getHours(); return h < 6 || h >= 20; };
  const [isDark, setIsDark] = useState(() => {
    const s = localStorage.getItem('ds_theme');
    return s ? s === 'dark' : isNight();
  });
  const toggle = () => setIsDark(p => {
    localStorage.setItem('ds_theme', !p ? 'dark' : 'light');
    return !p;
  });
  const theme = { ...(isDark ? DARK_THEME : LIGHT_THEME), isDark };
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

function ThemeToggle() {
  const { theme, toggle } = React.useContext(ThemeCtx);
  return (
    <motion.button
      onClick={toggle} whileTap={{ scale: 0.9 }}
      className="fixed top-3 right-3 z-50 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
      style={{ background: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(25,68,241,0.06)', border: `1px solid ${theme.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(25,68,241,0.2)'}` }}>
      {theme.isDark
        ? <Sun className="w-4 h-4" style={{ color: '#FFD700' }} />
        : <Moon className="w-4 h-4" style={{ color: '#1944F1' }} />}
    </motion.button>
  );
}

const PAGE_BG = DARK_THEME.PAGE_BG;
const DARK    = DARK_THEME.DARK;
const MUTED   = DARK_THEME.MUTED;
const CARD_BG = DARK_THEME.CARD_BG;
const DOT_BG  = DARK_THEME.DOT_BG;

const FEAT: { icon: React.ElementType; title: string; desc: string; badge?: string; c1: string; c2: string }[] = [
  { icon: MessageCircle, title: 'Group Chat',         desc: 'Daily active members',        c1: '#3B82F6', c2: '#06B6D4' },
  { icon: Phone,         title: 'Voice Calls',        desc: 'Talk before you meet',        c1: '#FF6B6B', c2: '#FF8E53' },
  { icon: MapPin,        title: 'Direct Meets',       desc: 'Arrange real-life meetups',   c1: '#10B981', c2: '#34D399' },
  { icon: Flame,         title: '18+ Exclusive',      desc: 'Photos, videos & more',       c1: '#EF4444', c2: '#F97316', badge: '18+' },
];

const IMAGES   = [galleryImg1, galleryImg2, galleryImg3, galleryImg4, galleryImg5, galleryImg6];
const VIDEOS   = ['https://player.vimeo.com/video/1182421154', 'https://player.vimeo.com/video/1182421156'];
const QUESTIONS = ['Is this genuine?', 'How much is entry fee?', 'Refunds available?', 'Genuine Bangalore girls?', 'How to join?'];
const AUDIO_FILES = [null, null, null, faq4Audio, faq5Audio];
const REVIEWS = [
  { name: 'Rahul M.',       area: 'Koramangala', text: 'Way better than any dating app I have tried. Met two amazing women so far, both real and verified.' },
  { name: 'Vikram Shetty.', area: 'Indiranagar',  text: 'Finally ondhu genuine group sikthu. Admin is very responsive and the crowd is legit. Genuinely recommend.' },
  { name: 'Karan D.',       area: 'HSR Layout',   text: 'Real girls, real chats. Nothing like the fake bots on Tinder or Bumble. Worth every rupee.' },
  { name: 'Aditya P.',      area: 'Whitefield',   text: "Was skeptical at first but it's 100% worth it. The voice call feature is a great way to vibe before meeting." },
  { name: 'Rohan Gowda.',   area: 'JP Nagar',     text: 'Already arranged a meet within my first week. Active group, daily new faces. Super recommend bro.' },
  { name: 'Suresh Naik.',   area: 'Marathahalli', text: 'Met my current girlfriend here lol. Very organised, zero spam and the admin actually screens people.' },
  { name: 'Arjun K.',       area: 'Jayanagar',    text: 'The group is always active, quality women from Bangalore.' },
  { name: 'Dev Menon.',     area: 'BTM Layout',   text: 'Three meets in two months. The vibe here is very different from regular apps — feels real and personal.' },
  { name: 'Sagar R.',       area: 'Electronic City', text: 'Legit group. Admin does proper verification so you know everyone is genuine. No nonsense.' },
  { name: 'Nikhil T.',      area: 'Yelahanka',    text: 'Joined on a friend\'s suggestion and I\'m glad I did. Active daily, good conversations and easy to arrange meets.' },
];

// ─── Diwali ornaments ─────────────────────────────────────────────
function Diya({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2c2 2.6 2.6 4.4 0 6.6C9.4 6.4 10 4.6 12 2z" fill="#FF9F1C" />
      <path d="M12 4.6c.9 1.2 1.1 2 0 3-1.1-1-.9-1.8 0-3z" fill="#FFD700" />
      <path d="M2.5 13h19c0 4.2-4 7.5-9.5 7.5S2.5 17.2 2.5 13z" fill="#D9480F" />
      <rect x="2.5" y="11.6" width="19" height="2" rx="1" fill="#F59E0B" />
    </svg>
  );
}

function DiwaliOrnaments() {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden="true">
      <Diya />
      <Sparkles className="w-3.5 h-3.5" style={{ color: '#FFD700' }} />
      <Diya size={26} />
      <Sparkles className="w-3.5 h-3.5" style={{ color: '#FFD700' }} />
      <Diya />
    </div>
  );
}

// ─── Glassmorphic blob ────────────────────────────────────────────────────────
function GlassBlob({ size, top, left, right, bottom, rotate = 0, rx = '62% 38% 70% 30% / 45% 55% 45% 55%' }: {
  size: number; top?: string | number; left?: string | number;
  right?: string | number; bottom?: string | number; rotate?: number; rx?: string;
}) {
  return (
    <div style={{
      position: 'absolute', width: size, height: size, top, left, right, bottom,
      background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
      border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: rx,
      transform: `rotate(${rotate}deg)`, pointerEvents: 'none',
    }} />
  );
}

// ─── Group Preview Slider ─────────────────────────────────────────────────────
function GroupPreviewSlider({ images, mobile = false }: { images: string[]; mobile?: boolean }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const T = useT();

  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setCurrent(prev => (prev + 1) % images.length);
    }, 2800);
    return () => clearInterval(id);
  }, [images.length]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const nav = (i: number) => { setDirection(i > current ? 1 : -1); setCurrent(i); };

  if (mobile) {
    return (
      <section className="py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-extrabold text-xl" style={{ color: T.DARK, letterSpacing: '-0.03em' }}>Group Preview</h2>
            <p className="text-xs font-semibold mt-0.5" style={{ color: T.MUTED }}>Swipe for screenshots </p>
          </div>
          <span className="text-[10px] font-bold px-3 py-1.5 rounded-full text-white" style={{ background: HERO_GRAD }}>
            {current + 1} / {images.length}
          </span>
        </div>
        <div className="flex justify-center">
          <div className="relative" style={{ width: '72vw', maxWidth: 240 }}>
            {/* Glow halo */}
            <div className="absolute inset-0 rounded-3xl blur-2xl opacity-30 scale-95" style={{ background: HERO_GRAD }} />
            <div
              className="relative overflow-hidden rounded-3xl shadow-2xl"
              style={{ aspectRatio: '9/16', border: '2.5px solid rgba(25,68,241,0.2)' }}
            >
              <AnimatePresence custom={direction} mode="popLayout">
                <motion.img
                  key={current} src={images[current]} alt={`Preview ${current + 1}`}
                  custom={direction} variants={variants} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              {/* Bottom gradient overlay */}
              {/* Dot indicators */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1 z-10">
                {images.map((_, i) => (
                  <button key={i} onClick={() => nav(i)} className="rounded-full transition-all duration-300"
                    style={{ width: i === current ? 18 : 5, height: 5, background: i === current ? 'white' : 'rgba(255,255,255,0.45)' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold uppercase tracking-widest" style={{ background: `${B1}12`, color: B1 }}>
            <Sparkles className="w-3 h-3" /> Real Content
          </div>
          <h2 className="text-5xl mb-3 font-bold" style={{ color: T.DARK, letterSpacing: '-0.03em' }}>Group Preview</h2>
          <p className="text-lg font-medium" style={{ color: T.MUTED }}>See exactly what you're joining</p>
        </div>
        <div className="flex justify-center">
          <div className="relative" style={{ width: 300 }}>
            <div className="absolute inset-0 rounded-[2.5rem] blur-3xl opacity-25 scale-90" style={{ background: HERO_GRAD }} />
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl" style={{ aspectRatio: '9/16', border: '3px solid rgba(26,114,232,0.18)' }}>
              <AnimatePresence custom={direction} mode="popLayout">
                <motion.img
                  key={current} src={images[current]} alt={`Preview ${current + 1}`}
                  custom={direction} variants={variants} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-1.5 z-10">
                {images.map((_, i) => (
                  <button key={i} onClick={() => nav(i)} className="rounded-full transition-all duration-300"
                    style={{ width: i === current ? 22 : 6, height: 6, background: i === current ? 'white' : 'rgba(255,255,255,0.45)' }} />
                ))}
              </div>
              <div className="absolute top-4 right-4 z-10">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>
                  {current + 1} / {images.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Lead Modal ───────────────────────────────────────────────────────────────
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyZ4CDmSSpm80A-xyX-2f3p97vtAX_t6ny7bbUZiJPF9-apBF5DUmOAc3CjXCJ-6teo5A/exec';

function LeadModal({ onClose, onComplete, gate = false }: { onClose?: () => void; onComplete: () => void; gate?: boolean }) {
  const [name, setName]       = useState('');
  const [phone, setPhone]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Cycle every photo through the desktop background cards.
  useEffect(() => {
    const timer = window.setInterval(() => setGalleryIndex(i => (i + 1) % 10), 3000);
    return () => window.clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) { setError('Enter a valid 10-digit Indian mobile number.'); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({ name: name.trim(), phone: phone.trim() });
      await fetch(`${SHEET_URL}?${params.toString()}`, { mode: 'no-cors' });
      localStorage.setItem('ds_lead_submitted', '1');
      localStorage.setItem('ds_lead_name', name.trim());
      localStorage.setItem('ds_lead_phone', phone.trim());
      onComplete();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const portraits = [
    { side: 'left', near: false },
    { side: 'left', near: true },
    { side: 'right', near: true },
    { side: 'right', near: false },
  ] as const;

  // Ten original photos are arranged as a 5-column × 2-row WebP sprite.
  // Each photo has 240 × 320 pixels, replacing the old tiny four-photo image.
  const photoStyle = (imageIndex: number): React.CSSProperties => ({
    backgroundImage: "url('/signup-gallery.webp')",
    backgroundSize: '500% 200%',
    backgroundPosition: `${(imageIndex % 5) * 25}% ${Math.floor(imageIndex / 5) * 100}%`,
    backgroundRepeat: 'no-repeat',
  });

  const photoIndexes = Array.from({ length: 10 }, (_, index) => index);

  return (
    <div className={`fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto overflow-x-hidden px-4 py-3 sm:px-5 ${gate ? '' : 'bg-black/70'}`}
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        backgroundColor: '#030714',
        backgroundImage: "radial-gradient(ellipse 58% 53% at 50% 50%,rgba(25,68,241,.20),transparent 80%),radial-gradient(circle,rgba(114,130,175,.22) 1px,transparent 1px)",
        backgroundSize: 'auto, 22px 22px',
      }}>
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={gate ? undefined : onClose} />

      {/* Desktop: angled background portraits rotate through all ten images. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden hidden sm:block" aria-hidden="true">
        {portraits.map((photo, i) => (
          <div key={i}
            className="absolute rounded-[24px] overflow-hidden"
            style={{
              width: photo.near ? 'clamp(100px,17vw,210px)' : 'clamp(90px,14vw,175px)',
              height: photo.near ? 'clamp(178px,26vw,315px)' : 'clamp(155px,23vw,275px)',
              top: photo.near ? 'calc(50% - 160px)' : 'calc(50% - 125px)',
              left: photo.side === 'left' ? (photo.near ? 'calc(50% - clamp(190px, 31vw, 410px))' : 'calc(50% - clamp(300px, 42vw, 575px))') : undefined,
              right: photo.side === 'right' ? (photo.near ? 'calc(50% - clamp(190px, 31vw, 410px))' : 'calc(50% - clamp(300px, 42vw, 575px))') : undefined,
              transform: `rotate(${photo.side === 'left' ? (photo.near ? -11 : -17) : (photo.near ? 11 : 17)}deg)`,
              border: '1px solid rgba(77,94,241,.55)',
              boxShadow: '0 8px 35px rgba(13,33,127,.22)',
              backgroundColor: '#071027',
            }}>
            <AnimatePresence mode="wait">
              <motion.div key={(galleryIndex + i * 2) % 10}
                initial={{ opacity: 0 }} animate={{ opacity: .75 }} exit={{ opacity: 0 }}
                transition={{ duration: .6 }}
                className="absolute inset-0"
                style={photoStyle((galleryIndex + i * 2) % 10)} />
            </AnimatePresence>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes datespotPhotoLoop {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        .datespot-photo-loop { animation: datespotPhotoLoop 42s linear infinite; will-change: transform; }
        @media (prefers-reduced-motion: reduce) { .datespot-photo-loop { animation: none; } }
      `}</style>

      <div className="relative z-10 w-full max-w-[440px] max-h-[96dvh] overflow-y-auto sm:max-h-none sm:overflow-visible flex flex-col items-center gap-3 sm:block">
        {/* Mobile: the full ten-photo gallery scrolls seamlessly on an infinite loop. */}
        <div className="sm:hidden w-full h-[136px] shrink-0 overflow-hidden pointer-events-none" aria-hidden="true"
          style={{ WebkitMaskImage: 'linear-gradient(90deg, transparent, black 7%, black 93%, transparent)',
            maskImage: 'linear-gradient(90deg, transparent, black 7%, black 93%, transparent)' }}>
          <div className="datespot-photo-loop inline-flex w-max h-full items-center">
            {[0, 1].map(repeat => (
              <div key={repeat} className="flex shrink-0 h-full items-center gap-2 pr-2">
                {photoIndexes.map(i => (
                  <div key={i} className="shrink-0 rounded-xl"
                    style={{
                      width: 'clamp(74px,20vw,92px)',
                      height: 'clamp(99px,26.67vw,123px)',
                      transform: `rotate(${[-5, -2, 2, 5, -3, 3, -4, 4, -2, 2][i]}deg)`,
                      border: '1px solid rgba(78,106,255,.65)',
                      boxShadow: '0 7px 20px rgba(0,0,0,.28)',
                      ...photoStyle(i),
                    }} />
                ))}
              </div>
            ))}
          </div>
        </div>

      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
        role="dialog" aria-modal="true" aria-label="Enter your details"
        className="relative w-full max-w-[440px] rounded-[22px] sm:rounded-[24px] overflow-hidden shrink-0"
        style={{ background: '#050A1A', border: '1px solid #1944F1', boxShadow: '0 28px 80px rgba(0,0,0,.75),0 0 48px rgba(25,68,241,.11)' }}>
        {!gate && <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10">
          <X className="w-4 h-4" style={{ color: '#9CA9C5' }} />
        </button>}
        <div className="px-5 py-5 sm:px-9 sm:py-9">
          <div className="flex justify-center items-center gap-2 mb-4 sm:mb-7">
            <img src="/datespot-logo.svg" alt="" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover" />
            <span className="font-extrabold text-white text-xl tracking-tight">Datespot</span>
          </div>
          <div className="text-center mb-5 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-1.5">Enter Your Details</h2>
            <p className="text-xs sm:text-sm" style={{ color: '#A6B2CF' }}>Join now and get instant access.</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 sm:gap-4">
            <div>
              <label htmlFor="ds-signup-name" className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: '#BCC7E3' }}>Full Name</label>
              <input id="ds-signup-name" type="text" autoComplete="name" placeholder="Enter your full name"
                value={name} onChange={e => setName(e.target.value)}
                className="w-full rounded-xl px-4 py-3 sm:py-3.5 outline-none text-sm font-semibold transition-all"
                style={{ background: '#030715', border: `1px solid ${name ? '#5474FF' : '#303A54'}`, color: '#F5F3F3', caretColor: '#1944F1' }} />
            </div>
            <div>
              <label htmlFor="ds-signup-phone" className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: '#BCC7E3' }}>Mobile Number</label>
              <div className="flex items-center rounded-xl overflow-hidden"
                style={{ background: '#030715', border: `1px solid ${phone ? '#5474FF' : '#303A54'}` }}>
                <span className="px-3.5 py-3 sm:py-3.5 text-sm font-bold shrink-0" style={{ color: '#B0C1EE', borderRight: '1px solid #303A54' }}>+91</span>
                <input id="ds-signup-phone" type="tel" inputMode="numeric" autoComplete="tel-national"
                  placeholder="Enter 10-digit number" value={phone} maxLength={10}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 min-w-0 px-3.5 py-3 sm:py-3.5 outline-none text-sm font-semibold bg-transparent"
                  style={{ color: '#F5F3F3', caretColor: '#1944F1' }} />
              </div>
            </div>
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold text-red-300 bg-red-950/30 px-3 py-2 rounded-lg"
                style={{ border: '1px solid rgba(239,68,68,.3)' }}>{error}</motion.p>
            )}
            <button type="submit" disabled={loading}
              className="w-full rounded-xl py-3 sm:py-3.5 mt-1 font-extrabold text-sm flex items-center justify-center gap-2 transition-transform active:scale-[.98] disabled:opacity-70"
              style={{ background: '#1944F1', color: '#FFFFFF', boxShadow: '0 6px 22px rgba(25,68,241,.25)' }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>{gate ? 'Continue' : 'Continue to Payment'}</span><ArrowRight className="w-4 h-4" /></>}
            </button>
            <p className="text-center text-[11px] font-medium" style={{ color: '#8999BD' }}>🔒 Your info is private &amp; never shared</p>
          </form>
        </div>
      </motion.div>
      </div>
    </div>
  );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────
function StatsRow({ onJoin }: { onJoin: () => void }) {
  const [idx, setIdx] = useState(0);
  const items = [
    { value: '100+', label: 'Members', icon: Users, c1: B1, c2: B2 },
    { value: 'Daily', label: 'Active', icon: Zap, c1: '#10B981', c2: '#34D399' },
    { value: '100%', label: 'Verified', icon: Shield, c1: '#8B5CF6', c2: '#C084FC' },
    { value: '18+', label: 'Content', icon: Flame, c1: '#EF4444', c2: '#F97316' },
  ];
  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p + 1) % items.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    null
  );
}

// ─── Reviews Slider ───────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#1944F1', '#4F46E5', '#0EA5E9', '#6366F1', '#0F2DBB', '#3B82F6', '#2563EB', '#7C3AED', '#1D4ED8', '#0284C7'];

function ReviewsStrip() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef(0);

  const initials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  useEffect(() => {
    const t = setInterval(() => { setDirection(1); setCurrent(p => (p + 1) % REVIEWS.length); }, 4000);
    return () => clearInterval(t);
  }, []);

  const goTo = (i: number, dir: number) => { setDirection(dir); setCurrent(i); };
  const prev = () => goTo((current - 1 + REVIEWS.length) % REVIEWS.length, -1);
  const next = () => goTo((current + 1) % REVIEWS.length, 1);

  const onTouchStart = (e: React.TouchEvent) => { dragStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const dx = dragStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) dx > 0 ? next() : prev();
  };
  const onMouseDown  = (e: React.MouseEvent) => { setDragging(false); dragStartX.current = e.clientX; };
  const onMouseUp    = (e: React.MouseEvent) => {
    const dx = dragStartX.current - e.clientX;
    if (Math.abs(dx) > 40) { setDragging(true); dx > 0 ? next() : prev(); }
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '60%' : '-60%', opacity: 0, scale: 0.94 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-60%' : '60%', opacity: 0, scale: 0.94 }),
  };

  const T = useT();
  const r = REVIEWS[current];
  const c1 = AVATAR_COLORS[current % AVATAR_COLORS.length];
  const c2 = AVATAR_COLORS[(current + 3) % AVATAR_COLORS.length];

  return (
    null
  );
}

function ReviewsSlideshow() { return null; }

// ─── Animated Stats ───────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1600) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        setVal(Math.round(t * target));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { val, ref };
}

function StatsSection() {
  const T = useT();
  const s1 = useCountUp(548); const s2 = useCountUp(467); const s3 = useCountUp(1000); const s4 = useCountUp(95);
  const stats = [
    { ref: s1.ref, val: s1.val, suffix: '+', label: 'Members', c1: B1, c2: '#FF6B35' },
    { ref: s2.ref, val: s2.val, suffix: '',  label: 'Online Today', c1: '#10B981', c2: '#34D399' },
    { ref: s3.ref, val: s3.val, suffix: '+', label: 'Successful Joins', c1: '#EC4899', c2: '#FF1F4B' },
    { ref: s4.ref, val: s4.val, suffix: '%', label: 'Positive Reviews', c1: '#F59E0B', c2: '#FCD34D' },
  ];
  return (
    <section className="py-5">
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map((s, i) => (
          null
        ))}
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks({ onJoin }: { onJoin: () => void }) {
  const T = useT();
  const steps = [
    { icon: CreditCard, label: 'Pay Entry Fee', desc: `One-time ${formatPrice(PRICING.mobile.amount)} payment via UPI`, c1: B1, c2: '#FF6B35' },
    { icon: Send,       label: 'Join Datespot', desc: 'Receive the Telegram group link instantly', c1: '#10B981', c2: '#34D399' },
    { icon: Heart,      label: 'Start Dating',  desc: 'Chat, call & meet verified women', c1: '#EC4899', c2: '#F97316' },
  ];
  return (
    <section className="py-5">
      <div className="mb-4">
        <h2 className="font-extrabold text-xl" style={{ color: T.DARK, letterSpacing: '-0.03em' }}>How It Works</h2>
        <p className="text-xs font-semibold mt-0.5" style={{ color: T.MUTED }}>3 simple steps</p>
      </div>
      <div className="relative">
        <div className="absolute left-[22px] top-6 bottom-6 w-[2px] opacity-20 rounded-full" style={{ background: HERO_GRAD }} />
        <div className="flex flex-col gap-3">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 rounded-2xl px-4 py-3.5 relative"
                style={{ background: T.CARD_BG, border: `1px solid ${T.BORDER}`, boxShadow: T.isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${st.c1}` }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm" style={{ color: T.DARK }}>{st.label}</div>
                  <div className="text-[11px] font-medium mt-0.5" style={{ color: T.MUTED }}>{st.desc}</div>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: `${st.c1}18`, color: st.c1 }}>
                  Step {i + 1}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Why Trust ────────────────────────────────────────────────────────────────
function WhyTrust() {
  const T = useT();
  const cards = [
    { icon: UserCheck,  title: 'Manual Profile Verification', desc: 'Every member is verified by admin before getting access.', c1: B1, c2: '#FF6B35' },
    { icon: Users,      title: 'Active Bangalore Community',  desc: '548+ real members from Bangalore, active daily.', c1: '#10B981', c2: '#34D399' },
    { icon: Shield,     title: 'No Fake Profiles Policy',     desc: 'Instant removal of any fake or spam profiles.', c1: '#8B5CF6', c2: '#C084FC' },
    { icon: Headphones, title: 'Direct Admin Support',        desc: 'Get help from Subhash directly, fast response guaranteed.', c1: '#EC4899', c2: '#F97316' },
  ];
  return (
    null
  );
}

// ─── Meet the Admin ───────────────────────────────────────────────────────────
function MeetAdmin() {
  const T = useT();
  const badges = ['5+ Years Community Experience', 'Personally Verified Members', 'Fast Support'];
  return (
    null
  );
}

// ─── Trust Proof ──────────────────────────────────────────────────────────────
function TrustProof() {
  const T = useT();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const dragStart = useRef(0);

  const proofCards = [
    { img: proofPayment, label: 'Payment Confirmed', emoji: '✅', color: '#10B981',
      review: REVIEWS[0] },
    { img: proofReview1, label: 'Member Review',     emoji: '⭐', color: '#F59E0B',
      review: REVIEWS[2] },
    { img: proofReview2, label: 'Community Active',  emoji: '💬', color: B1,
      review: REVIEWS[4] },
    { img: proofReview3, label: 'Real Testimonial',  emoji: '🔥', color: '#EC4899',
      review: REVIEWS[6] },
  ];

  useEffect(() => {
    const t = setInterval(() => { setDirection(1); setCurrent(p => (p + 1) % proofCards.length); }, 3800);
    return () => clearInterval(t);
  }, []);

  const goTo = (i: number, d: number) => { setDirection(d); setCurrent(i); };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '55%' : '-55%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-55%' : '55%', opacity: 0 }),
  };

  const c = proofCards[current];
  const r = c.review;

  return (
    <section className="py-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-extrabold text-lg" style={{ color: T.DARK, letterSpacing: '-0.03em' }}>Proof It Works</h2>
          <p className="text-[11px] font-semibold mt-0.5" style={{ color: T.MUTED }}>Real activity, real results</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full text-white" style={{ background: HERO_GRAD }}>
          {current + 1} / {proofCards.length}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl select-none"
        onTouchStart={e => { dragStart.current = e.touches[0].clientX; }}
        onTouchEnd={e => { const dx = dragStart.current - e.changedTouches[0].clientX; if (Math.abs(dx) > 40) dx > 0 ? goTo((current + 1) % proofCards.length, 1) : goTo((current - 1 + proofCards.length) % proofCards.length, -1); }}>

        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div key={current} custom={direction} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="w-full rounded-2xl overflow-hidden"
            style={{ background: T.CARD_BG, border: `1px solid ${c.color}25`, boxShadow: T.isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.07)' }}>

            {/* Real screenshot — cropped to fixed height, blurred for privacy */}
            <div className="relative overflow-hidden" style={{ height: 110 }}>
              <img src={c.img} alt={c.label}
                className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.2)' }} />
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-white"
                style={{ background: c.color, fontSize: 9, fontWeight: 800 }}>
                <span>{c.emoji}</span><span>{c.label}</span>
              </div>
            </div>

            {/* Quote */}
            <div className="px-3.5 py-3">
              <div className="flex gap-0.5 mb-1.5">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-2.5 h-2.5 fill-current" style={{ color: '#F59E0B' }} />)}
              </div>
              <p className="text-[11.5px] leading-relaxed font-medium mb-2" style={{ color: T.QUOTE }}>"{r.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-white font-black text-[8px] shrink-0"
                  style={{ background: HERO_GRAD }}>
                  {r.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                </div>
                <span className="text-[10px] font-bold" style={{ color: T.DARK }}>{r.name}</span>
                <span className="text-[9px] font-semibold flex items-center gap-0.5 ml-auto" style={{ color: T.MUTED }}>
                  <MapPin className="w-2 h-2" />{r.area}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-1.5 mt-2.5">
        {proofCards.map((_, i) => (
          <button key={i} onClick={() => goTo(i, i > current ? 1 : -1)}
            className="rounded-full transition-all duration-300"
            style={{ width: i === current ? 16 : 4, height: 4, background: i === current ? B1 : (T.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)') }} />
        ))}
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const T = useT();
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    { q: 'Is this genuine?', a: 'Yes. Datespot has been running since 2021 with 548+ verified members. Every member is manually approved by Subhash Gowda before getting access.' },
    { q: 'How do I get access?', a: `Pay ${formatPrice(PRICING.mobile.amount)} via UPI, upload the payment screenshot, and you receive the Telegram group link instantly. The whole process takes under 2 minutes.` },
    { q: 'Are profiles verified?', a: 'Every profile is manually verified by the admin. Fake profiles, bots, and spam accounts are removed immediately — zero tolerance policy.' },
    { q: 'Is my privacy protected?', a: 'Absolutely. Your personal details are never shared with other members. The group has strict privacy rules and all screenshots of members are prohibited.' },
    { q: 'How quickly do I receive access?', a: 'Access is sent within minutes of payment confirmation, typically under 5 minutes. Admin support is available daily for any delays.' },
  ];
  return (
    null
  );
}

// ─── Sticky CTA ───────────────────────────────────────────────────────────────
function StickyCTA({ onJoin }: { onJoin: () => void }) {
  const T = useT();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-5 pt-2"
          style={{ background: T.isDark ? '#000000' : '#F5F3F3' }}>
          <motion.button
            onClick={onJoin}
            whileTap={{ scale: 0.97 }}
            className="relative w-full max-w-md mx-auto block rounded-2xl overflow-hidden"
            style={{ background: HERO_GRAD, boxShadow: `0 6px 28px ${B1}60` }}>
            {/* Shimmer sweep */}
            <motion.div className="absolute inset-0 pointer-events-none"
              animate={{ x: ['-100%', '160%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
              style={{ background: 'rgba(255,255,255,0.14)', width: '60%' }} />
            <div className="relative flex items-center justify-center gap-3 py-3.5 px-6">
              <span className="font-black text-white text-sm tracking-tight">Join Datespot</span>
              <span className="text-white/75 text-[11px] line-through font-semibold">{formatPrice(PRICING.mobile.original)}</span>
              <span className="font-black text-white text-sm">{formatPrice(PRICING.mobile.amount)}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function MobileApp() {
  const T = useT();
  const [showPayment, setShowPayment] = useState(false);
  const [showLead,    setShowLead]    = useState(false);
  const [showChat,    setShowChat]    = useState(false);
  const [paymentType, setPaymentType] = useState<'full' | 'demo'>('full');
  const constraintsRef = useRef<HTMLDivElement>(null);

  const handleJoin = (type: 'full' | 'demo') => {
    setPaymentType(type);
    if (localStorage.getItem('ds_lead_submitted') === '1') {
      setShowPayment(true);
    } else {
      setShowLead(true);
    }
  };

  return (
    <div ref={constraintsRef} className="min-h-screen w-full relative overflow-x-hidden"
      style={{ ...dotGridStyle(T), fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <ThemeToggle />

      {/* Urgency Banner */}

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4">

        {/* Stats */}
        <StatsSection />

        {/* Gallery */}
        <GroupPreviewSlider images={IMAGES} mobile />

        {/* Final CTA */}
        <section className="pt-2 pb-8">
          <div className="rounded-3xl overflow-hidden" style={{ background: T.CARD_BG, border: '1px solid rgba(25,68,241,0.22)', boxShadow: `0 0 40px ${B1}15` }}>
            <div className="h-[3px]" style={{ background: HERO_GRAD }} />
            <div className="px-5 py-5 flex flex-col items-center text-center gap-4">


              {/* Price */}
              <div className="flex items-baseline gap-2 justify-center">
                <span className="text-sm line-through font-semibold" style={{ color: T.MUTED }}>{formatPrice(PRICING.mobile.original)}</span>
                <span className="font-black text-4xl leading-none" style={{ color: B1 }}>{formatPrice(PRICING.mobile.amount)}</span>
              </div>

              {/* CTA Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleJoin('full')}
                className="w-full rounded-xl font-black text-white flex items-center justify-center gap-2 relative overflow-hidden"
                style={{ background: HERO_GRAD, boxShadow: `0 6px 24px ${B1}50`, padding: '14px 20px' }}>
                <motion.div className="absolute inset-0"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
                  style={{ background: 'rgba(255,255,255,0.12)' }} />
                <span className="text-sm tracking-tight relative z-10">Join Datespot Now</span>
                <ArrowRight className="w-4 h-4 relative z-10" />
              </motion.button>

            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-5">
          <div className="mb-4">
            <h2 className="font-extrabold text-xl" style={{ color: T.DARK, letterSpacing: '-0.03em' }}>What You Get</h2>
            <p className="text-xs font-semibold mt-0.5" style={{ color: T.MUTED }}>Everything inside the group</p>
          </div>
          <div className="flex flex-col gap-2.5">
            {FEAT.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3.5 rounded-2xl px-4 py-3 relative"
                  style={{ background: T.CARD_BG, border: `1px solid ${f.c1}22`, boxShadow: T.isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.05)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${f.c1}` }}>
                    <Icon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[13px]" style={{ color: T.DARK }}>{f.title}</div>
                    <div className="text-[11px] font-medium mt-0.5" style={{ color: T.MUTED }}>{f.desc}</div>
                  </div>
                  {f.badge && (
                    <span className="text-[8px] font-black px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: `${f.c1}22`, color: f.c1, border: `1px solid ${f.c1}40` }}>
                      {f.badge}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Why Trust */}
        <WhyTrust />

        {/* Meet Admin */}
        <MeetAdmin />

        {/* Reviews slider */}
        <ReviewsStrip />

        {/* FAQ */}
        <FAQ />

        {/* Trust Proof — below payment section */}
        <TrustProof />

      </div>

      {/* Sticky CTA */}
      <StickyCTA onJoin={() => handleJoin('full')} />

      <AnimatePresence>
        {showLead    && <LeadModal onClose={() => setShowLead(false)} onComplete={() => { setShowLead(false); setShowPayment(true); }} />}
        {showPayment && <PaymentModal onClose={() => setShowPayment(false)} paymentType={paymentType} device="mobile" />}
        {showChat    && <ChatOverlay onClose={() => setShowChat(false)} onOpenPayment={() => handleJoin('full')} />}
      </AnimatePresence>

      <Toaster position="top-center" toastOptions={{
        style: { background: T.CARD_BG, color: T.DARK, borderRadius: '14px', fontSize: '13px', fontWeight: '700', border: `1px solid ${B1}4D`, boxShadow: `0 8px 24px ${B1}40` },
      }} />
    </div>
  );
}

export default function App() {
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [entered, setEntered] = useState(() => localStorage.getItem('ds_lead_submitted') === '1');
  if (!entered) {
    return (
      <ThemeProvider>
        <div className="min-h-screen w-full relative" style={{
          backgroundColor: '#000000',
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(25,68,241,0.18), transparent 70%), radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1.2px)',
          backgroundSize: '100% 100%, 24px 24px',
        }}>
          <LeadModal gate onComplete={() => setEntered(true)} />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      {isMobile
        ? <MobileApp />
        : <DesktopWrapper />}
    </ThemeProvider>
  );
}

function DesktopWrapper() {
  const [showPayment, setShowPayment] = useState(false);
  const [showLead,    setShowLead]    = useState(false);
  const [paymentType, setPaymentType] = useState<'full' | 'demo'>('full');
  const handleJoin = (type: 'full' | 'demo') => {
    setPaymentType(type);
    if (localStorage.getItem('ds_lead_submitted') === '1') {
      setShowPayment(true);
    } else {
      setShowLead(true);
    }
  };
  return (
    <>
      <DesktopVersion onOpenPayment={handleJoin} showPayment={showPayment} onClosePayment={() => setShowPayment(false)} paymentType={paymentType} />
      <AnimatePresence>
        {showLead && <LeadModal onClose={() => setShowLead(false)} onComplete={() => { setShowLead(false); setShowPayment(true); }} />}
      </AnimatePresence>
    </>
  );
}


/* Desktop-only hero. The mobile screen is rendered by MobileApp and is not affected. */
function DesktopHero() {
  const T = useT();
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewPaused, setPreviewPaused] = useState(false);

  useEffect(() => {
    // Respect reduced-motion preferences while keeping manual navigation available.
    if (previewPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(
      () => setPreviewIndex(index => (index + 1) % IMAGES.length),
      3200,
    );
    return () => window.clearInterval(timer);
  }, [previewPaused]);

  const changePreview = (offset: number) =>
    setPreviewIndex(index => (index + offset + IMAGES.length) % IMAGES.length);

  return (
    <section className="max-w-7xl mx-auto px-8 lg:px-12 pt-12 lg:pt-16 pb-5">
      <div className="grid grid-cols-2 gap-6 lg:gap-12 xl:gap-16 items-center">
        <div className="min-w-0">
          <div className="inline-flex items-center rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-widest mb-7"
            style={{ color: B1, background: T.isDark ? 'rgba(25,68,241,.13)' : '#FFFFFF', border: '1px solid rgba(25,68,241,.22)' }}>
            Datespot · Bangalore
          </div>
          <h1 className="font-black leading-[1.1] mb-7"
            style={{ color: T.DARK, fontSize: 'clamp(36px,4.1vw,60px)', letterSpacing: '-0.05em' }}>
            Meet people. <span style={{ color: B1 }}>Make connections.</span>
          </h1>
          <p className="text-base lg:text-lg leading-relaxed max-w-lg mb-8" style={{ color: T.MUTED }}>
            Discover a Telegram community with group chats, voice calls and opportunities to meet in person.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
            {[
              { label: 'Group chats', icon: Users },
              { label: 'Voice calls', icon: Mic },
              { label: 'Direct meets', icon: MapPin },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-2.5 text-xs lg:text-sm font-bold"
                  style={{ color: T.DARK }}>
                  <span className="w-9 h-9 rounded-xl inline-flex items-center justify-center"
                    style={{ background: T.isDark ? 'rgba(25,68,241,.22)' : '#E8EEFF' }}>
                    <Icon className="w-4 h-4" style={{ color: B1 }} />
                  </span>
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Borderless preview is part of the hero, not a second card. */}
        <div className="relative min-w-0"
          onMouseEnter={() => setPreviewPaused(true)}
          onMouseLeave={() => setPreviewPaused(false)}
          onFocus={() => setPreviewPaused(true)}
          onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setPreviewPaused(false); }}>
          <div className="relative z-10 flex items-start justify-between gap-3 px-1 lg:px-3">
            <div>
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5" style={{ color: B1 }} />
                <h2 className="font-extrabold text-lg lg:text-xl" style={{ color: T.DARK }}>Group Preview</h2>
              </div>
              <p className="text-xs lg:text-sm font-medium pl-8 mt-1" style={{ color: T.MUTED }}>
                See what's inside the group
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-extrabold text-xs tabular-nums mr-1" style={{ color: B1 }}>
                {previewIndex + 1} / {IMAGES.length}
              </span>
              <button type="button" onClick={() => changePreview(-1)} aria-label="Previous group preview"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                style={{ color: B1, background: T.CARD_BG, border: '1px solid rgba(25,68,241,.26)' }}>
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>
              <button type="button" onClick={() => changePreview(1)} aria-label="Next group preview"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95"
                style={{ background: B1 }}>
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
          </div>

          <div className="relative w-full h-[clamp(245px,28vw,355px)] mt-2" aria-label="Rotating group photo previews">
            <div aria-hidden="true" className="pointer-events-none absolute rounded-full"
              style={{ width: '79%', height: '78%', left: '11%', top: '11%',
                background: T.isDark ? 'rgba(25,68,241,.11)' : 'rgba(25,68,241,.055)' }} />
            {IMAGES.map((src, i) => {
              const half = Math.floor(IMAGES.length / 2);
              const offset = ((i - previewIndex + IMAGES.length + half) % IMAGES.length) - half;
              const distance = Math.abs(offset);
              const visible = distance <= 2;
              return (
                <button type="button" key={src} onClick={() => setPreviewIndex(i)}
                  aria-label={`View group preview ${i + 1}`}
                  aria-current={offset === 0 ? 'true' : undefined}
                  aria-hidden={!visible} tabIndex={visible ? 0 : -1}
                  className="absolute top-1/2 overflow-hidden rounded-[17px] lg:rounded-[22px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{
                    left: `${50 + offset * 16}%`,
                    width: 'clamp(108px,11.8vw,178px)',
                    aspectRatio: '0.66',
                    transform: `translate(-50%,-50%) translateY(${distance * 5}px) rotate(${offset * 5}deg) scale(${1 - distance * .085})`,
                    transition: 'left .55s cubic-bezier(.22,1,.36,1),transform .55s cubic-bezier(.22,1,.36,1),opacity .35s ease',
                    opacity: visible ? (distance === 2 ? .9 : 1) : 0,
                    zIndex: visible ? 10 - distance : 0,
                    pointerEvents: visible ? 'auto' : 'none',
                    background: '#101729',
                    border: offset === 0 ? `2px solid ${B1}` : '2px solid rgba(255,255,255,.8)',
                    boxShadow: offset === 0
                      ? '0 14px 30px rgba(25,68,241,.22)'
                      : '0 8px 22px rgba(14,25,62,.13)',
                  }}>
                  <img src={src} alt={`Group preview ${i + 1}`}
                    className="block w-full h-full object-cover" loading={distance < 2 ? 'eager' : 'lazy'} />
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-2 mt-1">
            {IMAGES.map((_, i) => (
              <button key={i} type="button" onClick={() => setPreviewIndex(i)}
                aria-label={`Show group preview ${i + 1}`}
                aria-current={i === previewIndex ? 'true' : undefined}
                className="rounded-full transition-all duration-300"
                style={{ width: i === previewIndex ? 18 : 7, height: 7,
                  background: i === previewIndex ? B1 : (T.isDark ? '#47547D' : '#C5D2F9') }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Desktop-only FAQ, deliberately separate from the mobile FAQ component. */
function DesktopFAQ() {
  const T = useT();
  const [open, setOpen] = useState<number | null>(0);
  const items = [
    { q: 'Is Datespot genuine?', a: 'Datespot is a Bangalore-based Telegram community. The community has guidelines and an admin-led onboarding process.' },
    { q: 'How do I get access?', a: `Enter your details, make the ${formatPrice(PRICING.desktop.amount)} UPI payment and upload your payment screenshot to continue to the Telegram invitation.` },
    { q: 'What is included in membership?', a: 'Membership includes the group chat, voice calls, opportunities for direct meets and exclusive 18+ content.' },
    { q: 'Can I use any UPI app?', a: 'You can scan the QR code or use the UPI ID shown on the payment screen with a compatible UPI app.' },
    { q: 'Is it a one-time fee?', a: `Yes. The current joining price is ${formatPrice(PRICING.desktop.amount)} (original price ${formatPrice(PRICING.desktop.original)}) for lifetime access.` },
  ];
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold mb-2" style={{ color: T.DARK, letterSpacing: '-0.03em' }}>Frequently Asked Questions</h2>
        <p className="text-base font-medium" style={{ color: T.MUTED }}>Everything you need to know before joining</p>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.q} className="rounded-2xl overflow-hidden"
            style={{ background: T.CARD_BG, border: '1px solid ' + (open === i ? B1 + '66' : T.BORDER) }}>
            <button type="button" className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left"
              aria-expanded={open === i} aria-controls={'desktop-faq-answer-' + i}
              onClick={() => setOpen(prev => prev === i ? null : i)}>
              <span className="font-bold text-base" style={{ color: T.DARK }}>{item.q}</span>
              <ChevronDown className={'w-5 h-5 shrink-0 transition-transform ' + (open === i ? 'rotate-180' : '')}
                style={{ color: B1 }} />
            </button>
            {open === i && (
              <div id={'desktop-faq-answer-' + i} className="px-6 pb-5 -mt-1 text-sm leading-relaxed"
                style={{ color: T.MUTED }}>
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Desktop Version ──────────────────────────────────────────────────────────
function DesktopVersion({ onOpenPayment, showPayment, onClosePayment, paymentType }: {
  onOpenPayment: (type: 'full' | 'demo') => void;
  showPayment: boolean; onClosePayment: () => void; paymentType: 'full' | 'demo';
}) {
  const T = useT();
  const initials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const avatarColors = AVATAR_COLORS;

  return (
    <div className="min-h-screen w-full relative" style={{ ...dotGridStyle(T), fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <ThemeToggle />
      <DesktopHero />

      {/* Desktop-only join CTA, with no sale or discount promotion. */}
      <section className="relative max-w-7xl mx-auto px-8 pt-10 pb-16 text-center isolate">
        <div aria-hidden="true" className="pointer-events-none absolute -z-10 rounded-[50%]"
          style={{ width: '92%', height: 230, left: '4%', top: 115,
            background: T.isDark ? 'rgba(25,68,241,.075)' : 'rgba(25,68,241,.045)' }} />
        <h2 className="font-black text-4xl mb-2" style={{ color: T.DARK, letterSpacing: '-0.04em' }}>Ready to Join?</h2>
        <div className="flex items-baseline gap-3 justify-center mb-5">
          <span className="text-lg line-through font-semibold" style={{ color: T.MUTED }}>{formatPrice(PRICING.desktop.original)}</span>
          <span className="font-black text-5xl leading-none" style={{ color: B1 }}>{formatPrice(PRICING.desktop.amount)}</span>
        </div>
        <button type="button" onClick={() => onOpenPayment('full')}
          className="w-full max-w-[360px] rounded-2xl font-extrabold text-white text-base inline-flex items-center justify-center gap-3 px-10 py-4 transition-transform hover:scale-[1.02] active:scale-[.98]"
          style={{ background: B1, boxShadow: '0 8px 22px rgba(25,68,241,.18)' }}>
          Join Datespot Now <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* What You Get — row list */}
      <section className="max-w-5xl mx-auto px-8 pb-12">
        <div className="text-center mb-10">
          <h2 className="font-extrabold text-4xl mb-2" style={{ color: T.DARK, letterSpacing: '-0.04em' }}>What You Get</h2>
          <p className="text-lg font-medium" style={{ color: T.MUTED }}>Everything inside the group, from day one</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {FEAT.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 rounded-2xl px-5 py-4"
                style={{ background: T.CARD_BG, border: `1px solid ${f.c1}22`, boxShadow: T.isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.05)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${f.c1}` }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm" style={{ color: T.DARK }}>{f.title}</div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: T.MUTED }}>{f.desc}</div>
                </div>
                {f.badge && (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: `${f.c1}22`, color: f.c1, border: `1px solid ${f.c1}40` }}>
                    {f.badge}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Admin + Why Trust side by side */}
      <section className="max-w-5xl mx-auto px-8 pb-12 grid grid-cols-2 gap-8">
        <MeetAdmin />
        <WhyTrust />
      </section>

      {/* Proof It Works */}
      <section className="max-w-3xl mx-auto px-8 pb-12">
        <TrustProof />
      </section>

      {/* Reviews grid */}
      <section className="max-w-5xl mx-auto px-8 pb-12">
        <div className="text-center mb-8">
          <h2 className="font-extrabold text-3xl mb-1" style={{ color: T.DARK, letterSpacing: '-0.03em' }}>What Members Say</h2>
          <p className="text-base font-medium" style={{ color: T.MUTED }}>Real reviews from Bangalore</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {REVIEWS.slice(0, 6).map((review, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{ background: T.CARD_BG, border: `1.5px solid ${B1}18`, boxShadow: T.isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                style={{ background: `${avatarColors[i % avatarColors.length]}` }} />
              <div className="flex gap-0.5 mb-2 ml-1">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-2.5 h-2.5 fill-current" style={{ color: '#F59E0B' }} />)}
              </div>
              <p className="text-sm leading-relaxed mb-3 font-medium ml-1" style={{ color: T.QUOTE }}>"{review.text}"</p>
              <div className="flex items-center gap-2 ml-1">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-black text-[9px] shrink-0"
                  style={{ background: `${avatarColors[i % avatarColors.length]}` }}>
                  {initials(review.name)}
                </div>
                <div>
                  <div className="font-bold text-xs" style={{ color: T.DARK }}>{review.name}</div>
                  <div className="text-[10px] font-semibold flex items-center gap-0.5" style={{ color: T.MUTED }}>
                    <MapPin className="w-2.5 h-2.5" />{review.area}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-8 pb-12">
        <DesktopFAQ />
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-8 text-center" style={{ borderTop: `1px solid rgba(25,68,241,0.2)` }}>
        <p className="text-sm font-semibold" style={{ color: T.MUTED }}>
          © 2026 Datespot Bangalore · One-time payment · Lifetime access · No hidden fees
        </p>
      </footer>

      <AnimatePresence>
        {showPayment && <PaymentModal onClose={onClosePayment} paymentType={paymentType} device="desktop" />}
      </AnimatePresence>
      <Toaster position="top-center" toastOptions={{
        style: { background: T.CARD_BG, color: T.DARK, borderRadius: '14px', fontSize: '14px', fontWeight: '700', border: `1px solid ${B1}30`, boxShadow: `0 8px 24px ${B1}40` },
      }} />
    </div>
  );
}

// ─── Chat Overlay ─────────────────────────────────────────────────────────────
type Message = { id: string; sender: 'bot' | 'user'; type: 'text' | 'audio' | 'button'; content: string; time: string; audioSrc?: string; };

function ChatOverlay({ onClose, onOpenPayment }: { onClose: () => void; onOpenPayment: () => void }) {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1', sender: 'bot', type: 'text',
    content: "Hi! I'm Komal. Tap a question to hear my answer!",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleAsk = (q: string, index: number) => {
    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', type: 'text', content: q, time: t }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const msgs: Message[] = [{ id: (Date.now() + 1).toString(), sender: 'bot', type: 'audio', content: '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), audioSrc: AUDIO_FILES[index] ?? undefined }];
      if (q === 'How to join?') msgs.push({ id: (Date.now() + 2).toString(), sender: 'bot', type: 'button', content: 'Join now',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      setMessages(prev => [...prev, ...msgs]);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-md mx-auto h-[82vh] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{ background: CARD_BG }}>
        <div className="p-3.5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(25,68,241,0.15)', background: PAGE_BG }}>
          <div className="relative">
            <img src={chatAvatar} alt="Komal" className="w-10 h-10 rounded-full object-cover border-2" style={{ borderColor: B1 }} />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm" style={{ color: DARK }}>Komal</div>
            <div className="text-[10px] font-semibold" style={{ color: B1 }}>Admin · Online now</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full" style={{ background: 'rgba(25,68,241,0.07)' }}>
            <X className="w-4 h-4" style={{ color: MUTED }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2.5" style={{ background: PAGE_BG }}>
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.sender === 'bot' && msg.type !== 'button' && (
                <img src={chatAvatar} alt="Komal" className="w-6 h-6 rounded-full object-cover shrink-0 mt-1" />
              )}
              <div className={`max-w-[78%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.type === 'button' ? (
                  <button onClick={() => { toast.success('Opening payment...'); onClose(); setTimeout(() => onOpenPayment(), 300); }}
                    className="px-5 py-2.5 rounded-2xl text-white font-bold text-xs active:scale-95 transition-transform shadow-md"
                    style={{ background: HERO_GRAD }}>
                    Join for {formatPrice(PRICING.mobile.amount)}
                  </button>
                ) : (
                  <div className="px-3.5 py-2.5 text-xs shadow-sm"
                    style={msg.sender === 'user'
                      ? { background: HERO_GRAD, color: 'white', borderRadius: '18px 18px 4px 18px' }
                      : { background: '#050A1A', color: DARK, border: '1px solid rgba(25,68,241,0.2)', borderRadius: '18px 18px 18px 4px' }}>
                    {msg.type === 'text' ? <p>{msg.content}</p> : <VoiceMessageBubble audioSrc={msg.audioSrc} isUser={msg.sender === 'user'} />}
                    <div className="text-[8px] mt-1 opacity-40">{msg.time}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2">
              <img src={chatAvatar} alt="Komal" className="w-6 h-6 rounded-full object-cover shrink-0" />
              <div className="px-3.5 py-2.5 rounded-2xl flex gap-0.5 shadow-sm" style={{ background: '#050A1A', border: '1px solid rgba(25,68,241,0.2)' }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: B1 }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4" style={{ background: CARD_BG, borderTop: '1px solid rgba(25,68,241,0.15)' }}>
          <p className="text-[9px] font-bold mb-2.5 text-center uppercase tracking-widest" style={{ color: MUTED }}>Tap to ask</p>
          <div className="space-y-1.5">
            {QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => handleAsk(q, i)}
                className="w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold transition-all active:scale-[0.98]"
                style={{ background: '#050A1A', border: '1.5px solid rgba(25,68,241,0.2)', color: DARK }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Voice Message Bubble ─────────────────────────────────────────────────────
function VoiceMessageBubble({ audioSrc, isUser }: { audioSrc?: string; isUser?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd  = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('loadedmetadata', onMeta); audio.removeEventListener('ended', onEnd); };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); } else { audio.play(); toast.success('Playing...'); }
    setIsPlaying(!isPlaying);
  };

  const fmt = (t: number) => (!t || isNaN(t)) ? '0:00' : `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const waveColor = isUser ? 'rgba(255,255,255,0.9)' : B1;
  const waveFade  = isUser ? 'rgba(255,255,255,0.3)' : `${B1}30`;

  return (
    <div className="flex items-center gap-2 min-w-[155px]">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      <button onClick={toggle} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition-transform shrink-0"
        style={{ background: isUser ? 'rgba(255,255,255,0.25)' : `${B1}18` }}>
        {isPlaying
          ? <Pause className="w-3.5 h-3.5 fill-current" style={{ color: isUser ? 'white' : B1 }} />
          : <Play  className="w-3.5 h-3.5 fill-current ml-0.5" style={{ color: isUser ? 'white' : B1 }} />}
      </button>
      <div className="flex-1">
        <div className="flex items-center gap-0.5 h-4">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-0.5 rounded-full transition-all"
              style={{ height: `${Math.max(20, i % 3 === 0 ? 55 : i % 2 === 0 ? 80 : 35)}%`, background: (i / 16) * 100 <= progress ? waveColor : waveFade }} />
          ))}
        </div>
        <span className="text-[8px] font-mono mt-0.5 block opacity-50">{fmt(isPlaying ? currentTime : duration)}</span>
      </div>
      <Mic className="w-3 h-3 opacity-35 shrink-0" style={{ color: isUser ? 'white' : B1 }} />
    </div>
  );
}

// ─── Payment Modal ────────────────────────────────────────────────────────────
type UploadState = 'idle' | 'verifying' | 'success';

function PaymentModal({ onClose, paymentType, device }: { onClose: () => void; paymentType: 'full' | 'demo'; device: PricingDevice }) {
  const UPI_ID        = 'BHARATPE2R0S0C1D6V46619@unitype';
  const { amount: AMOUNT, original: ORIGINAL_AMT } = PRICING[device];
  const TELEGRAM_LINK = 'https://t.me/+wRAGkbTVLLA0YzQ1';
  const upiUrl        = `upi://pay?pa=${UPI_ID}&pn=Datespot&am=${AMOUNT}&cu=INR`;

  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [tab, setTab] = useState<'qr' | 'upi'>('qr');
  // A compact one-minute countdown, without implying the payment price expires.
  const [secondsLeft, setSecondsLeft] = useState(60);
  useEffect(() => {
    if (uploadState !== 'idle' || secondsLeft === 0) return;
    const id = window.setTimeout(() => setSecondsLeft(value => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [secondsLeft, uploadState]);
  const countdown = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;

  const compressImage = (file: File): Promise<string> =>
    new Promise(resolve => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 900;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', 0.75).split(',')[1]);
      };
      img.src = url;
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadState('verifying');
    toast.success('Verifying payment...');

    try {
      const base64 = await compressImage(file);
      const name  = localStorage.getItem('ds_lead_name')  ?? '';
      const phone = localStorage.getItem('ds_lead_phone') ?? '';
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'screenshot', name, phone, mimeType: 'image/jpeg', fileName: `payment_${Date.now()}.jpg`, image: base64 }),
      });
    } catch {
      // no-cors — response is opaque, error means network issue
    }

    setTimeout(() => {
      setUploadState('success');
      toast.success('Payment verified! Welcome!');
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: [B1, B2, '#fff', '#FF6B6B'] });
      setTimeout(() => window.open(TELEGRAM_LINK, '_blank'), 1200);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0" onClick={uploadState === 'idle' ? onClose : undefined} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md max-h-[92dvh] overflow-y-auto rounded-3xl shadow-2xl bg-white">
        {uploadState === 'idle' && (
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full z-20 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}

        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-center gap-2.5">
          <img src="/datespot-logo.svg" alt="Datespot logo"
            className="w-10 h-10 rounded-xl shrink-0 object-cover" />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm leading-none text-gray-900">Join Datespot</div>
            <div className="text-[10px] mt-0.5 font-medium text-gray-400">Lifetime access · Telegram</div>
          </div>
          <div className="text-right shrink-0 mr-7">
            {ORIGINAL_AMT && <div className="text-[11px] line-through text-gray-400">{formatPrice(ORIGINAL_AMT)}</div>}
            <div className="font-extrabold text-2xl leading-none" style={{ color: B1 }}>{formatPrice(AMOUNT)}</div>
          </div>
        </div>

        <div className="px-4 pb-4">
          {uploadState === 'idle' && (
            <>
              {/* Neutral payment details; no discount or sale expiry claims. */}
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl mb-3" style={{ background: '#EEF2FF', border: '1px solid #D6DFFF' }}>
                <div className="flex items-center gap-2 min-w-0">
                  <CreditCard className="w-3.5 h-3.5 shrink-0" style={{ color: B1 }} />
                  <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: B1 }}>Secure UPI Payment</p>
                </div>
                <span aria-label={`Countdown ${countdown}`} role="timer"
                  className="text-[12px] font-extrabold tabular-nums rounded-md px-2 py-1 shrink-0"
                  style={{ background: '#FFFFFF', border: '1px solid #D6DFFF', color: '#475569' }}>{countdown}</span>
              </div>
              <div className="flex rounded-xl p-1 mb-3" style={{ background: '#F1F4FA' }}>
                {(['qr', 'upi'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                    style={tab === t ? { background: B1, color: '#FFFFFF' } : { background: 'transparent', color: '#64748B' }}>
                    {t === 'qr' ? 'Scan QR' : 'UPI ID'}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {tab === 'qr' ? (
                  <motion.div key="qr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="rounded-2xl p-3 mb-2 flex items-center justify-center" style={{ background: '#F8FAFC' }}>
                      <QRCodeSVG value={upiUrl} size={148} level="H" />
                    </div>
                    <p className="text-center text-[10px] mb-2 font-medium" style={{ color: "#475569" }}>Scan with any UPI app</p>
                  </motion.div>
                ) : (
                  <motion.div key="upi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-3">
                    <div className="rounded-2xl p-4 mb-2" style={{ background: '#F8FAFC' }}>
                      <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#475569" }}>UPI ID</p>
                      <p className="font-mono text-sm font-bold break-all mb-4 text-gray-800">{UPI_ID}</p>
                      <div className="flex gap-2">
                        <button onClick={() => { navigator.clipboard.writeText(UPI_ID); toast.success('Copied!'); }}
                          className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                          style={{ border: `1.5px solid ${B1}`, color: B1, background: 'white' }}>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </button>
                        <a href={upiUrl}
                          className="flex-1 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                          style={{ background: HERO_GRAD }}
                          onClick={() => toast.success('Opening UPI app...')}>
                          <ExternalLink className="w-3.5 h-3.5" /> Pay
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* UPI apps accepted: reference image */}
              <div className="rounded-lg px-2 py-1 mb-2 max-w-[220px] mx-auto" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <img
                  src="/upi-apps-accepted.webp"
                  alt="UPI, Paytm, Google Pay and PhonePe accepted"
                  className="block w-full h-auto max-h-[90px] object-contain mx-auto rounded-md"
                  loading="lazy"
                />
              </div>

              <div className="pt-3 mt-1" style={{ borderTop: `1px solid ${B1}12` }}>
                <p className="text-center text-[10px] mb-2 font-medium" style={{ color: "#475569" }}>Upload screenshot to verify payment</p>
                <input type="file" id="ss-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                <label htmlFor="ss-upload"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white font-bold text-sm cursor-pointer active:scale-95 transition-transform"
                  style={{ background: B1 }}>
                  <Upload className="w-4 h-4" /> Upload Screenshot
                </label>
              </div>
            </>
          )}

          {uploadState === 'verifying' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${B1}12` }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: B1 }} />
              </div>
              <p className="font-bold text-base mb-1 text-gray-900">Verifying Payment</p>
              <p className="text-xs font-medium text-gray-400">Please wait a moment...</p>
            </motion.div>
          )}

          {uploadState === 'success' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-center py-8">
              <div className="w-18 h-18 mx-auto rounded-2xl flex items-center justify-center mb-5 shadow-xl" style={{ background: HERO_GRAD, width: 72, height: 72 }}>
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <p className="font-bold text-xl mb-1 text-gray-900">Payment Verified!</p>
              <p className="text-sm font-medium" style={{ color: B1 }}>Redirecting to Telegram...</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
