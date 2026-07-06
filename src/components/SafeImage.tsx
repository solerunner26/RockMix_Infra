import React, { useState, useEffect } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  fallbackType?: 'sunset' | 'handshake' | 'product';
  fallbackName?: string;
  fallbackCategory?: string;
  productId?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
}

// 1. Handshake alliance SVG for "Join Hands" Section
export function HandshakeIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 250"
      className={`w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-indigo-400 p-6 ${className}`}
      id="svg-handshake-illustration"
    >
      <defs>
        <pattern id="grid-handshake" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.05" />
        </pattern>
        <linearGradient id="hand-grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="hand-grad-right" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-handshake)" rx="16" />
      
      {/* Background soft glowing circles */}
      <circle cx="200" cy="125" r="70" fill="#4f46e5" fillOpacity="0.15" filter="blur(20px)" />
      <circle cx="200" cy="125" r="40" fill="#10b981" fillOpacity="0.1" filter="blur(15px)" />
      
      {/* Dynamic connection lines / data waves */}
      <path d="M 50 125 C 120 80, 280 170, 350 125" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="5 5" />
      <path d="M 50 140 C 130 190, 270 60, 350 110" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />

      {/* Styled stylized geometric joined hands/shaking hands */}
      <g transform="translate(45, 12) scale(0.75)">
        {/* Left Arm / Sleeve */}
        <path d="M 0 130 L 80 100 L 100 130 L 40 170 Z" fill="url(#hand-grad-left)" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.6" />
        {/* Left hand & thumb */}
        <path d="M 80 100 C 100 90, 120 100, 135 115 L 170 145 C 180 155, 180 165, 170 175 C 160 185, 150 185, 140 175 L 110 145 Z" fill="#818cf8" fillOpacity="0.3" stroke="#818cf8" strokeWidth="2" />
        {/* Left fingers */}
        <path d="M 125 115 C 135 105, 145 115, 140 125 L 120 145" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 135 125 C 145 115, 155 125, 150 135 L 130 155" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 145 135 C 155 125, 165 135, 160 145 L 140 165" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
        
        {/* Right Arm / Sleeve */}
        <path d="M 400 130 L 320 160 L 300 130 L 360 90 Z" fill="url(#hand-grad-right)" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.6" />
        {/* Right hand & thumb */}
        <path d="M 320 160 C 300 170, 280 160, 265 145 L 230 115 C 220 105, 220 95, 230 85 C 240 75, 250 75, 260 85 L 290 115 Z" fill="#34d399" fillOpacity="0.3" stroke="#34d399" strokeWidth="2" />
        {/* Right fingers clasping */}
        <path d="M 275 145 C 265 155, 255 145, 260 135 L 280 115" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
        <path d="M 265 135 C 255 145, 245 135, 250 125 L 270 105" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
        <path d="M 255 125 C 245 135, 235 125, 240 115 L 260 95" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
        
        {/* Connection Pulse Center */}
        <circle cx="200" cy="130" r="5" fill="#fbbf24" />
      </g>
      
      {/* Decorative text badge inside the SVG */}
      <g transform="translate(200, 220)">
        <text textAnchor="middle" className="font-sans text-[10px] font-bold tracking-widest fill-indigo-300 uppercase">
          Partnership & Integrity • Mutual Growth
        </text>
      </g>
    </svg>
  );
}

// 2. Sunset Industrial Silhouette SVG for Homepage Background
export function IndustrialSunsetIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 600"
      className={`w-full h-full bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-indigo-500/20 ${className}`}
      id="svg-sunset-industrial-illustration"
    >
      <defs>
        <linearGradient id="sunset-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="40%" stopColor="#1e1b4b" />
          <stop offset="70%" stopColor="#311042" />
          <stop offset="90%" stopColor="#4c0519" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <pattern id="bg-blueprint-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#6366f1" strokeWidth="0.5" strokeOpacity="0.08" />
          <path d="M 30 0 L 30 60 M 0 30 L 60 30" fill="none" stroke="#6366f1" strokeWidth="0.25" strokeOpacity="0.04" />
        </pattern>
      </defs>
      
      {/* Sunset sky gradient */}
      <rect width="100%" height="100%" fill="url(#sunset-grad)" />
      
      {/* High tech grid mesh */}
      <rect width="100%" height="100%" fill="url(#bg-blueprint-grid)" />

      {/* Ambient solar glow */}
      <circle cx="850" cy="420" r="180" fill="#f59e0b" fillOpacity="0.15" filter="blur(50px)" />
      <circle cx="850" cy="420" r="80" fill="#ef4444" fillOpacity="0.1" filter="blur(30px)" />

      {/* Abstract vector mountain / factory outlines in background */}
      <path d="M 0 500 L 150 420 L 300 480 L 500 390 L 700 470 L 950 350 L 1200 490 L 1200 600 L 0 600 Z" fill="#0b0f19" fillOpacity="0.9" />
      <path d="M 0 520 L 250 460 L 450 510 L 650 440 L 850 500 L 1100 410 L 1200 520 L 1200 600 L 0 600 Z" fill="#04060d" />

      {/* Silhouette industrial crane, batching tower, and silos structures */}
      <g fill="#111827" fillOpacity="0.45" transform="translate(100, 100) scale(0.9)">
        {/* High tension tower */}
        <path d="M 100 450 L 130 250 L 140 250 L 170 450 Z" stroke="#1f2937" strokeWidth="2" />
        <line x1="115" y1="350" x2="155" y2="350" stroke="#1f2937" strokeWidth="1.5" />
        <line x1="125" y1="290" x2="145" y2="290" stroke="#1f2937" strokeWidth="1.5" />
        <line x1="100" y1="450" x2="170" y2="250" stroke="#1f2937" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="170" y1="450" x2="100" y2="250" stroke="#1f2937" strokeWidth="1" strokeOpacity="0.3" />
      </g>

      <g fill="#0c0f17" transform="translate(680, 180)">
        {/* Massive batching tower silhouette */}
        <rect x="80" y="100" width="110" height="220" rx="4" />
        <path d="M 80 100 L 135 40 L 190 100 Z" />
        
        {/* Structural truss elements */}
        <line x1="80" y1="150" x2="190" y2="150" stroke="#1e293b" strokeWidth="2" />
        <line x1="80" y1="210" x2="190" y2="210" stroke="#1e293b" strokeWidth="2" />
        <line x1="80" y1="270" x2="190" y2="270" stroke="#1e293b" strokeWidth="2" strokeOpacity="0.5" />
        <line x1="80" y1="100" x2="190" y2="320" stroke="#1e293b" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="190" y1="100" x2="80" y2="320" stroke="#1e293b" strokeWidth="1" strokeOpacity="0.4" />

        {/* 3 Silos alongside tower */}
        <g transform="translate(220, 80)">
          <rect x="0" y="40" width="45" height="180" rx="2" />
          <path d="M 0 40 Q 22.5 15 45 40 Z" />
          <path d="M 0 220 L 22.5 250 L 45 220 Z" />
          <line x1="5" y1="220" x2="5" y2="340" stroke="#0c0f17" strokeWidth="4" />
          <line x1="40" y1="220" x2="40" y2="340" stroke="#0c0f17" strokeWidth="4" />
        </g>
        <g transform="translate(280, 60)">
          <rect x="0" y="40" width="45" height="200" rx="2" />
          <path d="M 0 40 Q 22.5 15 45 40 Z" />
          <path d="M 0 240 L 22.5 270 L 45 240 Z" />
          <line x1="5" y1="240" x2="5" y2="360" stroke="#0c0f17" strokeWidth="4" />
          <line x1="40" y1="240" x2="40" y2="360" stroke="#0c0f17" strokeWidth="4" />
        </g>
        
        {/* Inclined conveyor silhouette connecting tower */}
        <line x1="-380" y1="300" x2="80" y2="120" stroke="#0c0f17" strokeWidth="14" strokeLinecap="round" />
        {/* Conveyor supporting frames */}
        <line x1="-250" y1="240" x2="-250" y2="320" stroke="#0c0f17" strokeWidth="3" />
        <line x1="-120" y1="180" x2="-120" y2="320" stroke="#0c0f17" strokeWidth="3" />
      </g>

      {/* Ground Grid Overlay on the very bottom */}
      <rect x="0" y="500" width="1200" height="100" fill="#020408" fillOpacity="0.95" />
      <line x1="0" y1="500" x2="1200" y2="500" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.2" />

      {/* Floating vector technical telemetry graphics to give a gorgeous cyber-engineering aesthetic */}
      <g stroke="#6366f1" strokeWidth="1" strokeOpacity="0.25" fill="none">
        <circle cx="150" cy="180" r="30" strokeDasharray="3 3" />
        <circle cx="150" cy="180" r="5" />
        <line x1="150" y1="140" x2="150" y2="220" />
        <line x1="110" y1="180" x2="190" y2="180" />
        
        <circle cx="1050" cy="120" r="45" strokeWidth="0.5" />
        <path d="M 1010 120 L 1090 120 M 1050 80 L 1050 160" strokeWidth="0.5" />
        <path d="M 1025 100 L 1075 140" strokeWidth="0.75" strokeDasharray="2 4" />
      </g>
    </svg>
  );
}

// 3. Technical CAD blueprint preview for product image fallbacks
export function ProductImageFallback({ name, category, className = '' }: { name: string; category?: string; className?: string }) {
  return (
    <div
      className={`w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-indigo-400 p-6 flex flex-col justify-between relative overflow-hidden ${className}`}
      id={`fallback-blueprint-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Blueprint grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      {/* Abstract blueprint circles */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full border border-indigo-500/10 flex items-center justify-center">
        <div className="h-32 w-32 rounded-full border border-indigo-500/5 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full border border-indigo-500/5"></div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-[10px] font-mono font-bold tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded text-indigo-300">
          {category || 'MACHINERY SPECIFICATION'}
        </span>
      </div>

      {/* Decorative center icon representation */}
      <div className="my-auto flex flex-col items-center justify-center space-y-3 opacity-45">
        <svg
          viewBox="0 0 24 24"
          width="44"
          height="44"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-indigo-400"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        <span className="text-[10px] font-mono tracking-widest uppercase">CAD Blueprint Representation</span>
      </div>

      <div className="space-y-1">
        <h4 className="font-display font-black text-xs sm:text-sm text-white tracking-wider truncate">
          {name}
        </h4>
        <span className="text-[9px] font-mono opacity-60">Verified Engineering CAD Drawing</span>
      </div>
    </div>
  );
}

export default function SafeImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  fallbackType = 'product',
  fallbackName = 'Rockmix Infra Machinery',
  fallbackCategory = 'Heavy Equipment',
  loading = 'lazy',
  decoding = 'async',
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If src changes, reset error state and establish a failsafe loading timeout
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);

    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Set a 2.5 second timeout to automatically trigger fallback if network/CORS is hanging or blocked
    const timer = setTimeout(() => {
      setIsLoading((currentlyLoading) => {
        if (currentlyLoading) {
          setHasError(true);
        }
        return false;
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [src]);

  if (hasError || !src) {
    if (fallbackType === 'sunset') {
      return <IndustrialSunsetIllustration className={className} />;
    }
    if (fallbackType === 'handshake') {
      return <HandshakeIllustration className={className} />;
    }
    return <ProductImageFallback name={fallbackName} category={fallbackCategory} className={className} />;
  }

  return (
    <div className={`relative ${className} overflow-hidden`} style={{ display: 'inline-block', width: '100%', height: '100%' }}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/50 animate-pulse flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        className={`w-full h-full object-cover transition-all duration-500 ${imgClassName} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
}
