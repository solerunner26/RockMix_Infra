import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../data';
import { Product } from '../types';
import { 
  Settings, Sparkles, ClipboardList, Info, MessageSquareCode, Check,
  ChevronLeft, ChevronRight, ArrowRight, FileDown, X 
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import SafeImage from './SafeImage';

const productCarouselItems = [
  {
    image: "/wc1.webp",
    title: "Product Image 1"
  },
  {
    image: "/wc2.webp",
    title: "Product Image 2"
  },
  {
    image: "/wc3.webp",
    title: "Product Image 3"
  },
  {
    image: "/wc4.webp",
    title: "Product Image 4"
  },
  {
    image: "/wc5.webp",
    title: "Product Image 5"
  },
  {
    image: "/wc6.webp",
    title: "Product Image 6"
  },
  {
    image: "/wc7.webp",
    title: "Product Image 7"
  },
  {
    image: "/wc8.webp",
    title: "Product Image 8"
  }
];

const ProductImageSlideshow = ({ 
  defaultImage, 
  additionalImages = [], 
  altText 
}: { 
  defaultImage?: string; 
  additionalImages?: string[]; 
  altText: string; 
}) => {
  const images = useMemo(() => {
    return defaultImage 
      ? [defaultImage, ...additionalImages]
      : additionalImages;
  }, [defaultImage, additionalImages]);

  const [index, setIndex] = useState(0);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds interval
    return () => clearInterval(interval);
  }, [images.length, index]);

  // Background Preloader for adjacent slideshow images to ensure instantaneous manual and auto transitions
  useEffect(() => {
    if (images.length <= 1) return;
    const nextIdx = (index + 1) % images.length;
    const prevIdx = (index - 1 + images.length) % images.length;
    [images[nextIdx], images[prevIdx]].forEach((src) => {
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [index, images]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          alt={altText}
          loading="lazy"
          decoding="async"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="max-h-full max-w-full select-none object-contain transition-transform duration-500 hover:scale-[1.04]"
          style={{ background: 'transparent' }}
          onError={(e) => {
            e.currentTarget.src = '/LOGO.webp';
          }}
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          {/* Clickable zone on the left half to show NEXT image */}
          <div 
            onClick={handleNext}
            className="absolute left-0 top-0 bottom-0 w-1/2 z-10 cursor-pointer group/left flex items-center justify-start pl-4"
            title="Click left side to show next image"
          >
            <div className="p-2 rounded-full bg-slate-900/10 dark:bg-white/10 opacity-0 group-hover/left:opacity-100 backdrop-blur-sm border border-slate-900/5 dark:border-white/5 transition-opacity text-slate-800 dark:text-white">
              <ChevronLeft className="h-5 w-5" />
            </div>
          </div>

          {/* Clickable zone on the right half to show PREVIOUS image */}
          <div 
            onClick={handlePrev}
            className="absolute right-0 top-0 bottom-0 w-1/2 z-10 cursor-pointer group/right flex items-center justify-end pr-4"
            title="Click right side to show previous image"
          >
            <div className="p-2 rounded-full bg-slate-900/10 dark:bg-white/10 opacity-0 group-hover/right:opacity-100 backdrop-blur-sm border border-slate-900/5 dark:border-white/5 transition-opacity text-slate-800 dark:text-white">
              <ChevronRight className="h-5 w-5" />
            </div>
          </div>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5 bg-slate-900/40 backdrop-blur-md py-1.5 px-3 rounded-full border border-white/10 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === i ? 'w-4 bg-indigo-500' : 'w-1.5 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Show image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ProductsSectionProps {
  onInquireProduct: (productName: string) => void;
  selectedProductIdFromNav: string | null;
  clearSelectedProductFromNav: () => void;
  selectedSeriesIdFromNav?: string | null;
}

export default function ProductsSection({ 
  onInquireProduct, 
  selectedProductIdFromNav,
  clearSelectedProductFromNav,
  selectedSeriesIdFromNav
}: ProductsSectionProps) {
  const { content } = useSiteContent();
  const productsList = useMemo(() => content.products || PRODUCTS, [content.products]);
  
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Brochure Download Feature State
  const [selectedBrochureProduct, setSelectedBrochureProduct] = useState<Product | null>(null);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [brochureForm, setBrochureForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    orgName: '',
    city: '',
    country: 'India',
  });
  const [brochureErrors, setBrochureErrors] = useState<Record<string, string>>({});
  const [isSubmittingBrochure, setIsSubmittingBrochure] = useState(false);
  const [brochureSuccess, setBrochureSuccess] = useState(false);

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsBrochureModalOpen(false);
      }
    };
    if (isBrochureModalOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isBrochureModalOpen]);

  const validateBrochureForm = () => {
    const errors: Record<string, string> = {};
    if (!brochureForm.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    } else if (brochureForm.fullName.trim().length < 2) {
      errors.fullName = 'Full Name must be at least 2 characters';
    }

    if (!brochureForm.mobile.trim()) {
      errors.mobile = 'Mobile Number is required';
    } else {
      const cleanMobile = brochureForm.mobile.replace(/\D/g, '');
      if (brochureForm.country.toLowerCase() === 'india') {
        if (cleanMobile.length !== 10) {
          errors.mobile = 'Indian mobile number must be exactly 10 digits';
        }
      } else {
        if (cleanMobile.length < 7 || cleanMobile.length > 15) {
          errors.mobile = 'Please enter a valid mobile number (7 to 15 digits)';
        }
      }
    }

    if (!brochureForm.email.trim()) {
      errors.email = 'Email ID is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(brochureForm.email.trim())) {
        errors.email = 'Please enter a valid email address';
      }
    }

    if (!brochureForm.orgName.trim()) {
      errors.orgName = 'Organization Name is required';
    } else if (brochureForm.orgName.trim().length < 2) {
      errors.orgName = 'Organization Name must be at least 2 characters';
    }

    if (!brochureForm.city.trim()) {
      errors.city = 'City is required';
    }

    if (!brochureForm.country.trim()) {
      errors.country = 'Country is required';
    }

    setBrochureErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBrochureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBrochureForm() || !selectedBrochureProduct) return;

    setIsSubmittingBrochure(true);
    setBrochureErrors({});

    const brochurePath = selectedBrochureProduct.brochure;

    if (!brochurePath || !brochurePath.endsWith(".pdf")) {
      setBrochureErrors({ form: "Brochure file is not available for this product." });
      setIsSubmittingBrochure(false);
      return;
    }

    try {
      const leadData = {
        productName: selectedBrochureProduct.name,
        brochurePath: brochurePath,
        fullName: brochureForm.fullName,
        mobile: brochureForm.mobile,
        email: brochureForm.email,
        organizationName: brochureForm.orgName,
        city: brochureForm.city,
        country: brochureForm.country,
        submittedAt: new Date().toISOString(),
      };

      // Store in localStorage
      try {
        const existingLeadsStr = localStorage.getItem('rockmixBrochureLeads');
        const existingLeads = existingLeadsStr ? JSON.parse(existingLeadsStr) : [];
        existingLeads.push(leadData);
        localStorage.setItem('rockmixBrochureLeads', JSON.stringify(existingLeads));
      } catch (err) {
        // Safe logging
      }

      // Trigger actual download of brochure with a human-readable clean name
      const fileName = selectedBrochureProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") + ".pdf";

      const link = document.createElement('a');
      link.href = brochurePath;
      link.download = fileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsSubmittingBrochure(false);
      setBrochureSuccess(true);

      // Keep success message visible for 3 seconds then close
      setTimeout(() => {
        setIsBrochureModalOpen(false);
        setBrochureSuccess(false);
        setSelectedBrochureProduct(null);
        setBrochureForm({
          fullName: '',
          mobile: '',
          email: '',
          orgName: '',
          city: '',
          country: 'India',
        });
      }, 3000);
    } catch (err: any) {
      console.error("Brochure download failed:", err);
      setBrochureErrors({ form: err.message || "Brochure download failed." });
      setIsSubmittingBrochure(false);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % productCarouselItems.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + productCarouselItems.length) % productCarouselItems.length);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % productCarouselItems.length);
  };

  // Sync selection from navigation and scroll to the selected product card
  useEffect(() => {
    if (selectedProductIdFromNav) {
      // Find product category to ensure it's visible in the active filter
      const prod = productsList.find(p => p.id === selectedProductIdFromNav);
      if (prod) {
        setTimeout(() => {
          const el = document.getElementById(`product-card-${selectedProductIdFromNav}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      }
      clearSelectedProductFromNav();
    }
  }, [selectedProductIdFromNav, clearSelectedProductFromNav, productsList]);

  return (
    <section id="products-section" className="pt-[140px] md:pt-[160px] pb-24 px-4 max-w-7xl mx-auto space-y-20 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-[20%] left-[5%] w-96 h-96 rounded-full bg-indigo-50/30 blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[30%] right-[5%] w-96 h-96 rounded-full bg-blue-50/20 blur-3xl -z-10 pointer-events-none"></div>

      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          ROCKMIX Range of Products
        </h2>

        {/* Premium Animated 180-Degree Rotating Carousel */}
        <div className="relative w-full overflow-hidden py-12 flex flex-col items-center mt-8">
          
          {/* Large semi-transparent background text */}
          <div className="absolute inset-0 flex items-center justify-center select-none overflow-hidden pointer-events-none -z-10">
            <span className="text-[7vw] md:text-[8vw] font-black tracking-widest text-slate-200/25 dark:text-slate-700/10 font-display uppercase whitespace-nowrap opacity-75">
              ROCKMIX Range of Products
            </span>
          </div>

          {/* Carousel Orbit */}
          <div 
            className="relative w-full max-w-5xl h-[280px] sm:h-[380px] md:h-[450px] flex items-center justify-center mt-6"
            style={{ perspective: "1000px" }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Items */}
            {productCarouselItems.map((item, i) => {
              const n = productCarouselItems.length;
              let offset = i - activeIdx;
              if (offset > n / 2) {
                offset -= n;
              } else if (offset < -n / 2) {
                offset += n;
              }

              let scale = 1;
              let opacity = 1;
              let zIndex = 30;
              let rotateY = 0;
              let translateY = 0;
              let translateX = 0;

              if (offset === 0) {
                scale = 1;
                opacity = 1;
                zIndex = 30;
                translateY = 0;
                translateX = 0;
                rotateY = 0;
              } else if (offset === 1) {
                scale = 0.78;
                opacity = 0.65;
                zIndex = 20;
                translateY = isMobile ? 10 : 20;
                translateX = isMobile ? 110 : 260;
                rotateY = -30;
              } else if (offset === -1) {
                scale = 0.78;
                opacity = 0.65;
                zIndex = 20;
                translateY = isMobile ? 10 : 20;
                translateX = isMobile ? -110 : -260;
                rotateY = 30;
              } else if (offset === 2) {
                scale = 0.55;
                opacity = 0.25;
                zIndex = 10;
                translateY = isMobile ? 25 : 45;
                translateX = isMobile ? 190 : 460;
                rotateY = -55;
              } else if (offset === -2) {
                scale = 0.55;
                opacity = 0.25;
                zIndex = 10;
                translateY = isMobile ? 25 : 45;
                translateX = isMobile ? -190 : -460;
                rotateY = 55;
              } else {
                scale = 0.35;
                opacity = 0;
                zIndex = 0;
                translateY = 60;
                translateX = offset > 0 ? (isMobile ? 250 : 580) : (isMobile ? -250 : -580);
                rotateY = offset > 0 ? -75 : 75;
              }

              return (
                <motion.div
                  key={i}
                  animate={{
                    x: translateX,
                    y: translateY,
                    scale: scale,
                    opacity: opacity,
                    rotateY: rotateY,
                    zIndex: zIndex,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 18,
                  }}
                  className="absolute cursor-pointer select-none"
                  onClick={() => {
                    setActiveIdx(i);
                  }}
                >
                  <div className="w-[170px] h-[130px] sm:w-[320px] sm:h-[240px] md:w-[380px] md:h-[280px] relative flex items-center justify-center bg-white/40 dark:bg-slate-950/20 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-4 sm:p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/30">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="max-h-full max-w-full object-contain drop-shadow-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.div>
              );
            })}

            {/* Controls left / right */}
            <div className="absolute inset-x-0 sm:inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-40 px-2 sm:px-0">
              <button
                onClick={handlePrev}
                aria-label="Previous product"
                className="pointer-events-auto h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-slate-200/80 dark:border-slate-800/85 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="h-5 sm:h-6 sm:w-6 w-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next product"
                className="pointer-events-auto h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-slate-200/80 dark:border-slate-800/85 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="h-5 sm:h-6 sm:w-6 w-5" />
              </button>
            </div>
          </div>

          {/* Indicator Dots */}
          <div className="flex items-center space-x-2 mt-6 z-40">
            {productCarouselItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIdx === i 
                    ? 'w-8 bg-indigo-600' 
                    : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                aria-label={`Go to product ${i + 1}`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Redesigned Product List - Uniform, Elegant, High-resolution transparent visuals */}
      <div className="space-y-24">
        <AnimatePresence mode="popLayout">
          {productsList.map((product) => {
            return (
              <motion.div
                key={product.id}
                id={`product-card-${product.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative rounded-3xl border border-slate-200/50 dark:border-slate-800/40 p-6 md:p-10 space-y-10 shadow-xl backdrop-blur-sm hover:shadow-2xl hover:border-indigo-500/20 transition-all duration-300"
                style={{ background: 'transparent' }}
              >
                {/* Main Product row: Image and Information */}
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Huge, clear, transparent product image container */}
                  <div className="lg:col-span-5 flex items-center justify-center p-4 sm:p-6 bg-transparent h-[350px] sm:h-[450px] rounded-3xl relative overflow-hidden group">
                    <ProductImageSlideshow 
                      defaultImage={product.image} 
                      additionalImages={product.additionalImages}
                      altText={product.name} 
                    />
                  </div>

                  {/* Product details */}
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className={`px-3 py-1 text-[10px] font-extrabold tracking-widest uppercase border rounded-md ${product.badgeColor}`}>
                        {product.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                        REF MODEL: RM-{product.id.slice(0, 4).toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                      {product.name}
                    </h3>

                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {product.description}
                    </p>



                    {/* Highlights callout */}
                    <div className="rounded-2xl bg-indigo-50/30 dark:bg-slate-950/40 border border-indigo-100/50 dark:border-slate-800/60 p-4 space-y-1.5">
                      <div className="flex items-center space-x-2 text-indigo-800 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider font-mono">
                        <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Engineering Highlight</span>
                      </div>
                      {product.highlights.map((high, idx) => (
                        <p key={idx} className="text-xs text-indigo-950/80 dark:text-slate-300 leading-relaxed italic">
                          "{high}"
                        </p>
                      ))}
                    </div>

                    {/* Inquiry & Download Brochure Buttons */}
                    <div className="pt-4 flex flex-wrap gap-4 items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-4">
                      {product.id !== 'stationary-concrete-pump' && (
                        <span className="text-xs text-slate-400 font-mono font-medium">
                          • Complete Customizations Available
                        </span>
                      )}
                      <div className="flex flex-wrap gap-3">
                        {product.brochure && (
                          <button
                            onClick={() => {
                              setSelectedBrochureProduct(product);
                              setIsBrochureModalOpen(true);
                            }}
                            className="flex items-center space-x-2 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-xs sm:text-sm px-5 py-3.5 transition-all active:scale-[0.98] shadow-sm cursor-pointer"
                          >
                            <FileDown className="h-4 w-4" />
                            <span>Download Brochure</span>
                          </button>
                        )}
                        <button
                          onClick={() => onInquireProduct(product.name)}
                          className="flex items-center space-x-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 transition-all active:scale-[0.98] shadow-md shadow-indigo-100 dark:shadow-none cursor-pointer"
                        >
                          <MessageSquareCode className="h-4 w-4" />
                          <span>Get a Quote</span>
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Series Configurations section inside the same card if they exist */}
                {product.series && (
                  <div className="pt-8 border-t border-slate-200/50 dark:border-slate-800/50 space-y-6">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-slate-400 animate-spin-slow" />
                      <h4 className="font-display text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        Available Series Configurations
                      </h4>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {product.series.map((ser) => {
                        const isHighlighted = ser.id === selectedSeriesIdFromNav;
                        return (
                          <div
                            key={ser.id}
                            id={`series-card-${ser.id}`}
                            className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                              isHighlighted
                                ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-800 shadow-md ring-1 ring-indigo-500/20'
                                : 'bg-transparent border-slate-200/50 dark:border-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className="space-y-4">
                              <div className="flex gap-4 items-start">
                                {ser.image && (
                                  <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200/50 dark:border-slate-800/50 bg-transparent flex items-center justify-center relative p-1">
                                    <SafeImage 
                                      src={ser.image} 
                                      alt={ser.name} 
                                      className="max-h-full max-w-full object-contain"
                                      fallbackType="product"
                                      fallbackName={ser.name}
                                      fallbackCategory={product.category}
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                )}
                                <div className="space-y-1">
                                  <h5 className="font-display text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                                    {ser.name}
                                  </h5>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                    {ser.shortDesc}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-3 border-t border-dashed border-slate-200/50 dark:border-slate-800/50 text-[10px]">
                                {ser.specs.map((spec, sidx) => (
                                  <div key={sidx} className="flex flex-col">
                                    <span className="text-slate-400 dark:text-slate-500 font-semibold">{spec.label}</span>
                                    <span className="text-indigo-600 dark:text-indigo-400 font-bold truncate">{spec.value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                              <button
                                onClick={() => onInquireProduct(`${product.name} - ${ser.name}`)}
                                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] transition-all shadow-xs cursor-pointer"
                              >
                                Get a Quote
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Lead Capture Modal for Brochure Downloads */}
      <AnimatePresence>
        {isBrochureModalOpen && selectedBrochureProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSubmittingBrochure && !brochureSuccess) {
                  setIsBrochureModalOpen(false);
                }
              }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Download Product Brochure
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Please share your contact details to download the brochure.
                  </p>
                </div>
                {!isSubmittingBrochure && !brochureSuccess && (
                  <button
                    onClick={() => setIsBrochureModalOpen(false)}
                    aria-label="Close modal"
                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="p-6">
                {brochureSuccess ? (
                  <div className="py-8 flex flex-col items-center text-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-500">
                      <Check className="h-8 w-8" strokeWidth={3} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-display text-base font-extrabold text-slate-900 dark:text-white">
                        Form Submitted Successfully!
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Thank you. Your brochure download will begin shortly.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBrochureSubmit} className="space-y-4 text-left">
                    {brochureErrors.form && (
                      <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl text-red-700 dark:text-red-400 text-xs font-bold leading-relaxed">
                        {brochureErrors.form}
                      </div>
                    )}
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={brochureForm.fullName}
                        onChange={(e) => setBrochureForm({ ...brochureForm, fullName: e.target.value })}
                        disabled={isSubmittingBrochure}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
                      />
                      {brochureErrors.fullName && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{brochureErrors.fullName}</p>
                      )}
                    </div>

                    {/* Email and Mobile Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Email ID */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Email ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={brochureForm.email}
                          onChange={(e) => setBrochureForm({ ...brochureForm, email: e.target.value })}
                          disabled={isSubmittingBrochure}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
                        />
                        {brochureErrors.email && (
                          <p className="text-red-500 text-xs mt-1 font-medium">{brochureErrors.email}</p>
                        )}
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={brochureForm.mobile}
                          onChange={(e) => setBrochureForm({ ...brochureForm, mobile: e.target.value })}
                          disabled={isSubmittingBrochure}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
                        />
                        {brochureErrors.mobile && (
                          <p className="text-red-500 text-xs mt-1 font-medium">{brochureErrors.mobile}</p>
                        )}
                      </div>
                    </div>

                    {/* Organization Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Organization Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Rockmix Infra Solutions"
                        value={brochureForm.orgName}
                        onChange={(e) => setBrochureForm({ ...brochureForm, orgName: e.target.value })}
                        disabled={isSubmittingBrochure}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
                      />
                      {brochureErrors.orgName && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{brochureErrors.orgName}</p>
                      )}
                    </div>

                    {/* City and Country Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* City */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Mumbai"
                          value={brochureForm.city}
                          onChange={(e) => setBrochureForm({ ...brochureForm, city: e.target.value })}
                          disabled={isSubmittingBrochure}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
                        />
                        {brochureErrors.city && (
                          <p className="text-red-500 text-xs mt-1 font-medium">{brochureErrors.city}</p>
                        )}
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="India"
                          value={brochureForm.country}
                          onChange={(e) => setBrochureForm({ ...brochureForm, country: e.target.value })}
                          disabled={isSubmittingBrochure}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
                        />
                        {brochureErrors.country && (
                          <p className="text-red-500 text-xs mt-1 font-medium">{brochureErrors.country}</p>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsBrochureModalOpen(false)}
                        disabled={isSubmittingBrochure}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingBrochure}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all active:scale-[0.98] shadow-md shadow-indigo-100 dark:shadow-none flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingBrochure ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <FileDown className="h-4 w-4" />
                            <span>Submit & Download Brochure</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
