import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Settings, Layers, Award, ShieldCheck, MapPin, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteContent } from '../context/SiteContentContext';
import { getProductIllustration } from './ProductIllustrations';
import SafeImage from './SafeImage';

interface HomeSectionProps {
  onNavigate: (tab: string) => void;
  onProductSelect?: (productId: string, seriesId?: string) => void;
  isDarkMode?: boolean;
}

export default function HomeSection({ onNavigate, onProductSelect, isDarkMode = false }: HomeSectionProps) {
  const { content } = useSiteContent();
  const SHOWCASE_PRODUCTS = content.products;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!SHOWCASE_PRODUCTS.length) return;
    if (!isHovered) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % SHOWCASE_PRODUCTS.length);
      }, 3500);
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isHovered, SHOWCASE_PRODUCTS.length]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!SHOWCASE_PRODUCTS.length) return;
    setCurrentIndex((prev) => (prev + 1) % SHOWCASE_PRODUCTS.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!SHOWCASE_PRODUCTS.length) return;
    setCurrentIndex((prev) => (prev - 1 + SHOWCASE_PRODUCTS.length) % SHOWCASE_PRODUCTS.length);
  };

  const currentProduct = SHOWCASE_PRODUCTS[currentIndex] || SHOWCASE_PRODUCTS[0];

  const handleProductClick = () => {
    if (!currentProduct) return;
    if (onProductSelect) {
      onProductSelect(currentProduct.id);
    } else {
      onNavigate('products');
    }
  };

  if (!SHOWCASE_PRODUCTS.length) {
    return <div className="text-center py-20 text-slate-500">No products configured.</div>;
  }

  return (
    <div 
      id="home-section" 
      className="relative min-h-screen pt-[140px] md:pt-[165px] pb-24 flex flex-col justify-between overflow-hidden isolate transition-colors duration-300"
      style={{
        backgroundImage: isDarkMode
          ? `linear-gradient(90deg, rgba(5, 10, 25, 0.38) 0%, rgba(5, 10, 25, 0.24) 50%, rgba(5, 10, 25, 0.12) 100%), url("/Homepage-dark.webp")`
          : `linear-gradient(90deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.22) 45%, rgba(255, 255, 255, 0.10) 100%), url("${content.home.backgroundImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: isDarkMode ? "#020617" : "#f8fafc"
      }}
    >

      <div className="relative z-10 mx-auto max-w-7xl px-4 w-full flex-grow flex flex-col justify-center space-y-24">
        {/* Main Hero Block (Grid-layout with left aligned text & scroll widget) */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Hero Content with local glassmorphic panel for outstanding text readability */}
          <div className={`lg:col-span-7 space-y-8 text-left p-6 sm:p-8 rounded-3xl backdrop-blur-md border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-slate-950/45 border-white/5 shadow-2xl shadow-black/10' 
              : 'bg-white/45 border-white/40 shadow-xl shadow-slate-200/10'
          }`}>

            <div className="space-y-4">
              <h1 className={`font-tagline text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] transition-colors ${
                isDarkMode ? 'text-white' : 'text-slate-950'
              }`}>
                {content.home.heroTitle.split('\n').map((line, key) => <React.Fragment key={key}>{line}<br/></React.Fragment>)}
              </h1>
              <p className={`font-tagline text-xl sm:text-2xl font-bold tracking-wide uppercase transition-colors ${
                isDarkMode ? 'text-amber-400' : 'text-amber-600'
              }`}>
                {content.home.heroSubtitle}
              </p>
            </div>

            <p className={`font-sans text-base sm:text-lg max-w-2xl leading-relaxed text-justify transition-colors ${
              isDarkMode ? 'text-slate-200' : 'text-slate-900 font-semibold'
            }`}>
              {content.home.heroDescription}
            </p>

            {/* Micro USP Badges - Left Aligned */}
            <div className="grid grid-cols-2 gap-4 max-w-lg" id="hero-usp-grid">
              {[
                { icon: Settings, label: 'Expert Guidance' },
                { icon: Layers, label: 'On-Site Erection' },
                { icon: Award, label: 'Budget Tailored' },
                { icon: ShieldCheck, label: 'Lifetime Support' }
              ].map((usp, i) => (
                <div 
                  key={i} 
                  className={`flex items-center space-x-3 p-2.5 rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-slate-950/50 border-white/10' 
                      : 'bg-white/85 border-slate-200/60 shadow-md hover:bg-white/95'
                  }`}
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border shadow-inner transition-colors ${
                    isDarkMode 
                      ? 'bg-indigo-950/85 text-indigo-300 border-indigo-900/50' 
                      : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                  }`}>
                    <usp.icon className="h-4.5 w-4.5" />
                  </div>
                  <span className={`text-xs sm:text-sm font-bold transition-colors ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-900'
                  }`}>
                    {usp.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Navigation CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2" id="hero-cta-group">
              <button
                onClick={() => onNavigate('products')}
                className="group flex items-center space-x-2 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-indigo-600/35 hover:bg-indigo-500 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>{content.home.buttonBrowseLabel}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={() => onNavigate('inquiry')}
                className={`rounded-2xl border backdrop-blur-md px-6 py-4 text-sm font-bold transition-all active:scale-[0.98] shadow-lg cursor-pointer ${
                  isDarkMode 
                    ? 'border-white/20 bg-white/10 hover:bg-white/25 text-white' 
                    : 'border-slate-300/60 bg-white/60 hover:bg-white/80 text-slate-800'
                }`}
              >
                {content.home.buttonQuoteLabel}
              </button>
            </div>
          </div>

          {/* Right Column - Product Auto-scrolling Gallery Widget */}
          <div className="lg:col-span-5 relative w-full flex flex-col justify-center items-center">
            
            {/* Live Showcase Label Indicator */}
            <div className="absolute -top-3.5 left-4 z-20 flex items-center space-x-1.5 rounded-lg bg-indigo-600 text-white px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase shadow-md font-mono">
              <Sparkles className="h-3 w-3 animate-spin-slow" />
              <span>Auto-Showcase Gallery</span>
            </div>

            {/* Main Interactive Slideshow Box */}
            <div 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleProductClick}
              className={`group relative w-full h-[480px] sm:h-[560px] rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between ${
                isDarkMode 
                  ? 'border-white/10 bg-transparent hover:border-indigo-500/30' 
                  : 'border-slate-200 bg-transparent hover:border-indigo-500/30'
              }`}
            >
              
              {/* Slides with smooth Framer Motion Transitions */}
              <div className="relative flex-grow w-full overflow-hidden bg-transparent">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center p-1 sm:p-2"
                  >
                    <img 
                      src={currentProduct.image} 
                      alt={currentProduct.name}
                      className="max-h-[92%] max-w-[92%] select-none transition-transform duration-500 group-hover:scale-[1.03]"
                      style={{ 
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        e.currentTarget.src = '/LOGO.webp';
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Category tag - top right corner */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`px-3 py-1 text-[10px] font-extrabold tracking-wider uppercase rounded-full border shadow-sm backdrop-blur-sm transition-all ${
                  isDarkMode 
                    ? 'bg-slate-900/95 text-indigo-300 border-indigo-900/30' 
                    : 'bg-white/95 text-indigo-700 border-indigo-100'
                }`}>
                  {currentProduct.category}
                </span>
              </div>

              {/* Navigation Arrows - visible on hover on desktop, always visible on touch */}
              <button 
                onClick={handlePrev}
                className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full border backdrop-blur-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-950/40 hover:bg-indigo-600/90 text-white border-white/10 hover:border-indigo-400' 
                    : 'bg-white/60 hover:bg-indigo-600 text-slate-800 hover:text-white border-slate-200 hover:border-indigo-400'
                }`}
                title="Previous Slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button 
                onClick={handleNext}
                className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full border backdrop-blur-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-950/40 hover:bg-indigo-600/90 text-white border-white/10 hover:border-indigo-400' 
                    : 'bg-white/60 hover:bg-indigo-600 text-slate-800 hover:text-white border-slate-200 hover:border-indigo-400'
                }`}
                title="Next Slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Bottom Info Banner */}
              <div className={`relative z-10 p-5 sm:p-6 space-y-2 text-left backdrop-blur-md border-t transition-all duration-300 shrink-0 ${
                isDarkMode 
                  ? 'bg-slate-950/60 border-white/10' 
                  : 'bg-white/40 border-slate-200/40'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className={`font-display text-lg sm:text-xl font-bold tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {currentProduct.name}
                  </h4>
                  <span className={`text-[10px] font-bold group-hover:translate-x-1.5 transition-transform duration-300 flex items-center space-x-1 shrink-0 ${
                    isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                  }`}>
                    <span>View Technical Details</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
                <p className={`font-sans text-xs sm:text-sm line-clamp-2 leading-relaxed transition-colors ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {currentProduct.description}
                </p>
              </div>

            </div>

            {/* Indicator Dots Progress row - 7 Dots representing products */}
            <div className="flex items-center space-x-2.5 mt-5">
              {SHOWCASE_PRODUCTS.map((p, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={`${p.id}-${idx}`}
                    onClick={() => setCurrentIndex(idx)}
                    className={`transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'w-6 h-2 bg-indigo-500 rounded-full' 
                        : isDarkMode 
                          ? 'w-2 h-2 bg-slate-700 hover:bg-slate-600 rounded-full'
                          : 'w-2 h-2 bg-slate-300 hover:bg-slate-400 rounded-full'
                    }`}
                    title={`Go to slide ${idx + 1}: ${p.name}`}
                  />
                );
              })}
            </div>

          </div>

        </div>


        {/* Company Introduction Section */}
        <div id="company-introduction" className={`pt-16 border-t transition-colors ${
          isDarkMode ? 'border-white/10' : 'border-slate-200'
        }`}>
          <div className={`border rounded-3xl p-8 md:p-12 backdrop-blur-lg shadow-2xl space-y-12 transition-all duration-300 ${
            isDarkMode 
              ? 'bg-slate-950/65 border-white/10 shadow-black/20' 
              : 'bg-white/75 border-slate-200/80 shadow-slate-100'
          }`}>
            <div className="grid lg:grid-cols-12 gap-12 items-start text-left">
              <div className="lg:col-span-7 space-y-6">
                <div className={`inline-flex items-center space-x-1.5 rounded-full px-3 py-1 text-xs font-bold border transition-colors ${
                  isDarkMode 
                    ? 'bg-white/10 text-indigo-200 border-white/10' 
                    : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                }`}>
                  <span>Who We Are</span>
                </div>
                <h2 className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug transition-colors ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Pioneering Engineering for Modern Infrastructure
                </h2>
                
                <div className={`space-y-4 font-sans text-sm sm:text-base leading-relaxed transition-colors text-justify ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-600'
                }`}>
                  <p>
                    At <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Rockmix</strong>, we are proud to be a growing name in the construction equipment industry — delivering Concrete Batching Plants with various models and capacities including Mobile, Compact, Stationary and customize plants suitable to project requirement & application, Wet Mix Macadam Plants for modern road construction, durable base and sub base layer for highways, airports, industrial roads, and other heavy duty pavements. This product range is engineered for reliability, efficiency, and performance.
                  </p>
                  <p>
                    We also deals in Stationary Concrete Pump, Self Loading Concrete Mixer, Transit Mixers and other equipment which goes along with our manufacturing products and as per customer’s requirement.
                  </p>
                  <p>
                    Our vision goes beyond manufacturing and supply - we build partnerships that strengthen the foundation of trust with our customers and empower modern construction.
                  </p>
                  <p>
                    With continuous dispatches across India & overseas, Rockmix is committed to supporting infrastructure growth with quality equipment, delivery, and dedicated after sales support for smooth execution.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                {/* Strategic Hub Highlight */}
                <div className={`rounded-3xl border p-6 space-y-4 shadow-sm backdrop-blur-md transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-900/65 border-white/10 shadow-black/5' 
                    : 'bg-white/90 border-slate-200/80 shadow-slate-100'
                }`}>
                  <div className={`flex items-center space-x-3 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                    <MapPin className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-widest font-mono">Strategic Facility Location</span>
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed text-justify transition-colors ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-600'
                  }`}>
                    Our state-of-the-art manufacturing facility is strategically located in the <strong>Bakrol Industrial Hub of Ahmedabad, Gujarat, India</strong>. This prime location enables us to maintain efficient production processes, streamlined logistics, and rigorous quality control standards, ensuring that every product we deliver meets the highest benchmarks of excellence.
                  </p>
                </div>

                {/* Bold Quote Block */}
                <div className={`rounded-3xl border p-6 md:p-8 flex flex-col justify-center items-center text-center shadow-inner relative overflow-hidden backdrop-blur-md transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-indigo-500/10 border-indigo-400/20' 
                    : 'bg-indigo-50/50 border-indigo-100'
                }`}>
                  <div className={`absolute top-0 right-0 h-32 w-32 rounded-full blur-2xl ${
                    isDarkMode ? 'bg-gradient-to-br from-indigo-500/20 to-indigo-600/10' : 'bg-gradient-to-br from-indigo-300/10 to-indigo-400/5'
                  }`}></div>
                  <span className={`text-4xl font-serif leading-none block mb-2 ${
                    isDarkMode ? 'text-indigo-400/30' : 'text-indigo-600/30'
                  }`}>“</span>
                  <blockquote className={`font-display text-sm sm:text-base font-bold leading-relaxed italic max-w-md transition-colors ${
                    isDarkMode ? 'text-indigo-200' : 'text-indigo-800'
                  }`}>
                    Every great structure begins with powerful equipment and skills, that's where we come in
                  </blockquote>
                  <span className={`text-4xl font-serif leading-none block mt-2 ${
                    isDarkMode ? 'text-indigo-400/30' : 'text-indigo-600/30'
                  }`}>”</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
