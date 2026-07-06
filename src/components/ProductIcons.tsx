import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

// 1. Concrete Batching Plant Icon
export function ConcreteBatchingPlantIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Silo Support Legs */}
      <path d="M15 50 L15 85 M27 50 L27 85 M21 55 L27 75 M21 75 L15 55" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />
      {/* Silo Body */}
      <rect x="12" y="15" width="18" height="30" rx="2" className="fill-slate-100 dark:fill-slate-800" />
      <path d="M12 15 L21 5 L30 15 Z" className="fill-slate-200 dark:fill-slate-700" />
      <path d="M12 45 L21 52 L30 45" />
      
      {/* Inclined Conveyor Belt */}
      <line x1="21" y1="52" x2="65" y2="72" strokeWidth="3" className="stroke-slate-500 dark:stroke-slate-400" />
      <path d="M21 52 L65 72" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="21" cy="52" r="2" className="fill-slate-900 dark:fill-white" />
      <circle cx="65" cy="72" r="2" className="fill-slate-900 dark:fill-white" />

      {/* Aggregate Hopper Bins */}
      <path d="M70 45 L90 45 L85 65 L75 65 Z" className="fill-slate-100 dark:fill-slate-800" />
      <line x1="80" y1="45" x2="80" y2="65" className="stroke-slate-400 dark:stroke-slate-500" />
      <line x1="75" y1="65" x2="75" y2="85" />
      <line x1="85" y1="65" x2="85" y2="85" />

      {/* Central Mixer Building */}
      <rect x="52" y="65" width="16" height="15" rx="1" className="fill-slate-200 dark:fill-slate-700" />
      <path d="M56 80 L52 88 M64 80 L68 88" />
    </svg>
  );
}

// 2. Wet Mix Macadam Plant Icon
export function WetMixMacadamPlantIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Trailer Chassis */}
      <line x1="15" y1="72" x2="85" y2="72" strokeWidth="3.5" />
      <line x1="15" y1="72" x2="10" y2="65" />
      <line x1="85" y1="72" x2="90" y2="65" />
      
      {/* Wheels */}
      <circle cx="32" cy="79" r="7" className="fill-slate-200 dark:fill-slate-700" />
      <circle cx="32" cy="79" r="2" fill="currentColor" />
      <circle cx="48" cy="79" r="7" className="fill-slate-200 dark:fill-slate-700" />
      <circle cx="48" cy="79" r="2" fill="currentColor" />

      {/* Support Leg */}
      <line x1="78" y1="72" x2="78" y2="83" strokeWidth="3" />
      <line x1="74" y1="83" x2="82" y2="83" strokeWidth="2" />

      {/* Feed Hoppers / Bins */}
      <path d="M18 35 L42 35 L38 58 L22 58 Z" className="fill-slate-100 dark:fill-slate-800" />
      <line x1="30" y1="35" x2="30" y2="58" className="stroke-slate-300 dark:stroke-slate-600" />
      <path d="M22 58 L38 58 L30 68 Z" className="fill-slate-200 dark:fill-slate-700" />

      {/* Water / Additive Tank */}
      <rect x="70" y="42" width="16" height="22" rx="8" transform="rotate(-90 70 42)" className="fill-slate-100 dark:fill-slate-800" />
      <line x1="48" y1="58" x2="70" y2="58" className="stroke-slate-400 dark:stroke-slate-500" strokeDasharray="2 2" />

      {/* Pugmill Mixer Unit */}
      <rect x="46" y="45" width="18" height="18" rx="2" className="fill-slate-200 dark:fill-slate-700" />
      <circle cx="55" cy="54" r="4" className="stroke-indigo-500" />
    </svg>
  );
}

// 3. Asphalt Drum Mix Plant Icon
export function AsphaltDrumMixPlantIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Main Slanted Rotating Drum */}
      <g transform="rotate(-12 50 50)">
        <rect x="25" y="40" width="46" height="18" rx="2" className="fill-slate-100 dark:fill-slate-800" />
        <line x1="35" y1="40" x2="35" y2="58" />
        <line x1="48" y1="40" x2="48" y2="58" />
        <line x1="61" y1="40" x2="61" y2="58" />
        {/* Support Rollers */}
        <circle cx="32" cy="62" r="3" fill="currentColor" />
        <circle cx="64" cy="62" r="3" fill="currentColor" />
      </g>

      {/* Feed Conveyor on left */}
      <line x1="5" y1="75" x2="28" y2="50" strokeWidth="3.5" />
      <line x1="5" y1="75" x2="5" y2="85" />
      <line x1="15" y1="65" x2="15" y2="85" className="stroke-slate-400 dark:stroke-slate-500" />

      {/* Burner Assembly on right */}
      <path d="M72 45 L85 45 L88 57 L72 57 Z" className="fill-indigo-500/10" />
      <path d="M85 48 L92 51 L85 54" className="stroke-indigo-500" />

      {/* Exhaust Chimney Stack */}
      <rect x="76" y="15" width="8" height="30" className="fill-slate-200 dark:fill-slate-700" />
      <line x1="74" y1="15" x2="86" y2="15" />
      {/* Exhaust Smoke effect */}
      <path d="M80 10 Q83 5 80 1 Q77 5 80 10" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
    </svg>
  );
}

// 4. Concrete Precast Mould Icon
export function ConcretePrecastMouldIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Isometric Grid Mould Frame */}
      {/* Front Outer Wall */}
      <path d="M15 45 L50 25 L85 45 L50 65 Z" className="fill-slate-100 dark:fill-slate-800" strokeWidth="3" />
      
      {/* Core Divider Walls */}
      <path d="M32.5 35 L32.5 55 M50 25 L50 65 M67.5 35 L67.5 55" className="stroke-slate-400 dark:stroke-slate-500" />
      <path d="M24 40 L59 20 M41.5 50 L76.5 30" className="stroke-slate-400 dark:stroke-slate-500" />

      {/* Bottom Mould Plinth base */}
      <path d="M15 45 L15 52 L50 72 L85 52 L85 45" />
      <path d="M50 65 L50 72" />

      {/* Reinforcement Rebar Reaching Out */}
      <line x1="28" y1="30" x2="28" y2="20" className="stroke-indigo-500" />
      <line x1="45" y1="20" x2="45" y2="10" className="stroke-indigo-500" />
      <line x1="62" y1="24" x2="62" y2="14" className="stroke-indigo-500" />

      {/* Cast Concrete Girder block standing next to it */}
      <path d="M52 75 L75 63 L92 73 L69 85 Z" className="fill-slate-300 dark:fill-slate-700" />
      <path d="M52 75 L52 82 L69 92 L69 85 Z" className="fill-slate-400 dark:fill-slate-600" />
      <path d="M69 92 L92 80 L92 73 L69 85 Z" className="fill-slate-500 dark:fill-slate-500" />
    </svg>
  );
}

// 5. Cement Storage Silos Icon
export function CementStorageSilosIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Silo 1 (Left) */}
      <g transform="translate(10, 0)">
        <path d="M8 60 L8 83 M18 60 L18 83 M10 65 L16 78 M10 78 L16 65" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.5" />
        <rect x="5" y="20" width="16" height="32" rx="1" className="fill-slate-100 dark:fill-slate-800" />
        <path d="M5 20 L13 8 L21 20 Z" className="fill-slate-200 dark:fill-slate-700" />
        <path d="M5 52 L13 58 L21 52" />
      </g>

      {/* Silo 2 (Center - Tallest & Foreground) */}
      <g transform="translate(37, -4)">
        <path d="M10 64 L10 89 M22 64 L22 89 M12 70 L20 84 M12 84 L20 70" className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" />
        <rect x="6" y="16" width="20" height="38" rx="2" className="fill-slate-200 dark:fill-slate-750" strokeWidth="3" />
        <path d="M6 16 L16 3 L26 16 Z" className="fill-slate-300 dark:fill-slate-650" />
        <path d="M6 54 L16 61 L26 54" />
        {/* Brand Stripe */}
        <line x1="6" y1="32" x2="26" y2="32" className="stroke-indigo-500" strokeWidth="2.5" />
      </g>

      {/* Silo 3 (Right) */}
      <g transform="translate(68, 2)">
        <path d="M8 58 L8 81 M18 58 L18 81 M10 63 L16 76 M10 76 L16 63" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.5" />
        <rect x="5" y="22" width="16" height="28" rx="1" className="fill-slate-100 dark:fill-slate-800" />
        <path d="M5 22 L13 10 L21 22 Z" className="fill-slate-200 dark:fill-slate-700" />
        <path d="M5 50 L13 56 L21 50" />
      </g>

      {/* Interconnecting overhead pipes */}
      <path d="M23 14 L47 11 M63 11 L78 16" className="stroke-indigo-400/80" strokeWidth="2" />
    </svg>
  );
}

// 6. Twin Shaft Mixers Icon
export function TwinShaftMixersIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Outer Tub casing top view */}
      <rect x="12" y="15" width="76" height="70" rx="10" className="fill-slate-100 dark:fill-slate-800" strokeWidth="3.5" />
      <rect x="16" y="19" width="68" height="62" rx="6" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="1.5" />

      {/* Left Rotating Shaft */}
      <line x1="33" y1="10" x2="33" y2="90" strokeWidth="4" className="stroke-slate-600 dark:stroke-slate-400" />
      {/* Right Rotating Shaft */}
      <line x1="67" y1="10" x2="67" y2="90" strokeWidth="4" className="stroke-slate-600 dark:stroke-slate-400" />

      {/* Mixing Paddles Left Shaft */}
      <path d="M22 28 L33 32 M33 32 L44 36" strokeWidth="3" className="stroke-indigo-500" />
      <path d="M22 48 L33 46 M33 46 L44 44" strokeWidth="3" className="stroke-indigo-500" />
      <path d="M22 68 L33 72 M33 72 L44 76" strokeWidth="3" className="stroke-indigo-500" />

      {/* Mixing Paddles Right Shaft (Intermeshing) */}
      <path d="M56 24 L67 28 M67 28 L78 32" strokeWidth="3" className="stroke-slate-500 dark:stroke-slate-400" />
      <path d="M56 44 L67 48 M67 48 L78 52" strokeWidth="3" className="stroke-slate-500 dark:stroke-slate-400" />
      <path d="M56 64 L67 66 M67 66 L78 68" strokeWidth="3" className="stroke-slate-500 dark:stroke-slate-400" />

      {/* Synchronous Gears on top */}
      <circle cx="33" cy="15" r="5" className="fill-slate-200 dark:fill-slate-700" strokeWidth="1.5" />
      <circle cx="67" cy="15" r="5" className="fill-slate-200 dark:fill-slate-700" strokeWidth="1.5" />
      <line x1="38" y1="15" x2="62" y2="15" strokeWidth="2" strokeDasharray="2 1" />
    </svg>
  );
}

// 7. Planetary Mixers Icon
export function PlanetaryMixersIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Circular Pan Bowl */}
      <circle cx="50" cy="50" r="40" className="fill-slate-100 dark:fill-slate-800" strokeWidth="3.5" />
      <circle cx="50" cy="50" r="35" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Central Star Sun Gear */}
      <circle cx="50" cy="50" r="8" className="fill-slate-200 dark:fill-slate-700" strokeWidth="2" />
      
      {/* 3 Epicyclic Planetary Mixing Arms */}
      <g>
        {/* Arm 1 (Up) */}
        <line x1="50" y1="42" x2="50" y2="24" strokeWidth="3" className="stroke-indigo-500" />
        <circle cx="50" cy="24" r="5" className="fill-indigo-500/20 stroke-indigo-500" />
        <path d="M44 20 L56 24" strokeWidth="2.5" />

        {/* Arm 2 (Bottom Left) */}
        <line x1="44" y1="54" x2="28" y2="64" strokeWidth="3" className="stroke-indigo-500" />
        <circle cx="28" cy="64" r="5" className="fill-indigo-500/20 stroke-indigo-500" />
        <path d="M22 66 L32 72" strokeWidth="2.5" />

        {/* Arm 3 (Bottom Right) */}
        <line x1="56" y1="54" x2="72" y2="64" strokeWidth="3" className="stroke-indigo-500" />
        <circle cx="72" cy="64" r="5" className="fill-indigo-500/20 stroke-indigo-500" />
        <path d="M78 66 L68 72" strokeWidth="2.5" />
      </g>

      {/* Direction of Rotation Arrows */}
      <path d="M18 40 A30 30 0 0 1 40 18" strokeWidth="1.5" className="stroke-slate-400" />
      <path d="M38 14 L42 18 L38 22" strokeWidth="1.5" className="stroke-slate-400" />
    </svg>
  );
}

// 8. Pan Mixers Icon
export function PanMixersIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Side-top 3D Pan Cylinder */}
      <path d="M12 42 A38 18 0 0 0 88 42 L88 66 A38 18 0 0 1 12 66 Z" className="fill-slate-100 dark:fill-slate-800" strokeWidth="3" />
      <ellipse cx="50" cy="42" rx="38" ry="18" className="fill-slate-200 dark:fill-slate-700" strokeWidth="3" />

      {/* Support Legs */}
      <line x1="20" y1="62" x2="16" y2="84" strokeWidth="3.5" />
      <line x1="80" y1="62" x2="84" y2="84" strokeWidth="3.5" />
      <line x1="50" y1="66" x2="50" y2="86" strokeWidth="2.5" className="stroke-slate-400 dark:stroke-slate-500" />

      {/* Central Shaft and scraper arms */}
      <line x1="50" y1="20" x2="50" y2="46" strokeWidth="4" />
      <line x1="30" y1="44" x2="70" y2="44" strokeWidth="3.5" className="stroke-indigo-500" />
      <path d="M28 40 L30 48 M72 40 L70 48" strokeWidth="3" />

      {/* Discharge Chute gate handle */}
      <path d="M12 55 L2 55 L2 63" strokeWidth="2" className="stroke-slate-400" />
    </svg>
  );
}

// 9. Rockmix Mobile (RMP) Icon
export function RockmixMobileIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Mobile Truck Chassis Trailer */}
      <line x1="10" y1="72" x2="88" y2="72" strokeWidth="4" />
      <path d="M10 72 L6 62 L20 62 L20 72" className="fill-slate-200 dark:fill-slate-800" />

      {/* Heavy Duty Wheels */}
      <circle cx="28" cy="78" r="6" className="fill-slate-300 dark:fill-slate-750" />
      <circle cx="28" cy="78" r="2" fill="currentColor" />
      <circle cx="42" cy="78" r="6" className="fill-slate-300 dark:fill-slate-750" />
      <circle cx="42" cy="78" r="2" fill="currentColor" />
      <circle cx="76" cy="78" r="6" className="fill-slate-300 dark:fill-slate-750" />
      <circle cx="76" cy="78" r="2" fill="currentColor" />

      {/* On-Board Rotating Drum Mixer */}
      <g transform="rotate(-8 50 48)">
        <path d="M28 42 L64 30 L64 56 L28 44 Z" className="fill-slate-100 dark:fill-slate-800" strokeWidth="2.5" />
        <ellipse cx="28" cy="43" rx="4" ry="7" className="fill-slate-300 dark:fill-slate-650" />
        <line x1="46" y1="36" x2="46" y2="50" className="stroke-indigo-500" strokeWidth="2" />
      </g>

      {/* Folding support jacks */}
      <line x1="60" y1="72" x2="60" y2="82" strokeWidth="2" />
      <line x1="57" y1="82" x2="63" y2="82" strokeWidth="2" />

      {/* Small Aggregate Hopper */}
      <path d="M70 40 L88 40 L84 58 L76 58 Z" className="fill-slate-200 dark:fill-slate-700" />
      <line x1="80" y1="58" x2="80" y2="72" />
    </svg>
  );
}

// 10. Rockmix Compact (RCP) Icon
export function RockmixCompactIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Compact Main Structure Frame */}
      <rect x="15" y="65" width="70" height="18" rx="2" className="fill-slate-200 dark:fill-slate-700" />
      <line x1="25" y1="65" x2="25" y2="83" />
      <line x1="75" y1="65" x2="75" y2="83" />

      {/* Integrated Small Silo */}
      <rect x="22" y="15" width="16" height="34" rx="1" className="fill-slate-100 dark:fill-slate-800" />
      <path d="M22 15 L30 5 L38 15 Z" className="fill-slate-200 dark:fill-slate-700" />
      <path d="M22 49 L30 55 L38 49" />
      <line x1="30" y1="55" x2="30" y2="65" />

      {/* Aggregate Bins (Stacked close) */}
      <path d="M50 35 L80 35 L76 52 L54 52 Z" className="fill-slate-100 dark:fill-slate-800" />
      <line x1="65" y1="35" x2="65" y2="52" className="stroke-slate-300 dark:stroke-slate-600" />
      <line x1="58" y1="52" x2="58" y2="65" />
      <line x1="72" y1="52" x2="72" y2="65" />

      {/* Core Mixer in center */}
      <circle cx="48" cy="58" r="6" className="fill-indigo-500/10 stroke-indigo-500" />
    </svg>
  );
}

// 11. Rockmix Stationary (RSP) Icon
export function RockmixStationaryIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Concrete Foundation Base blocks */}
      <rect x="12" y="76" width="76" height="10" rx="1" className="fill-slate-200 dark:fill-slate-700" strokeWidth="2" />
      
      {/* Three Large Storage Silos */}
      <g transform="translate(48, 2) scale(0.95)">
        <rect x="0" y="10" width="12" height="34" rx="1" className="fill-slate-100 dark:fill-slate-800" />
        <path d="M0 10 L6 2 L12 10 Z" className="fill-slate-250 dark:fill-slate-650" />
        <path d="M0 44 L6 50 L12 44" />
        <line x1="6" y1="50" x2="6" y2="78" className="stroke-slate-400" />

        <rect x="16" y="10" width="12" height="34" rx="1" className="fill-slate-100 dark:fill-slate-800" />
        <path d="M16 10 L22 2 L28 10 Z" className="fill-slate-250 dark:fill-slate-650" />
        <path d="M16 44 L22 50 L28 44" />
        <line x1="22" y1="50" x2="22" y2="78" className="stroke-slate-400" />

        <rect x="32" y="10" width="12" height="34" rx="1" className="fill-slate-100 dark:fill-slate-800" />
        <path d="M32 10 L38 2 L44 10 Z" className="fill-slate-250 dark:fill-slate-650" />
        <path d="M32 44 L38 50 L44 44" />
        <line x1="38" y1="50" x2="38" y2="78" className="stroke-slate-400" />
      </g>

      {/* Main Large Belt Conveyor */}
      <line x1="8" y1="70" x2="48" y2="40" strokeWidth="4.5" className="stroke-indigo-500" />
      <line x1="8" y1="70" x2="8" y2="76" />
      <line x1="26" y1="57" x2="26" y2="76" className="stroke-slate-400" />

      {/* Massive Central Mixing Tower house */}
      <rect x="38" y="38" width="18" height="26" rx="2" className="fill-slate-100 dark:fill-slate-800" />
      <rect x="42" y="44" width="10" height="10" className="stroke-indigo-500/40" />
    </svg>
  );
}

// 12. Rockmix Compact Mobility (RCMP) Icon
export function RockmixCompactMobilityIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Super Long Trailer Chassis */}
      <line x1="5" y1="72" x2="95" y2="72" strokeWidth="4.5" />

      {/* Multiple Axle Wheels */}
      <circle cx="15" cy="78" r="6" className="fill-slate-300 dark:fill-slate-750" />
      <circle cx="15" cy="78" r="2" fill="currentColor" />
      <circle cx="27" cy="78" r="6" className="fill-slate-300 dark:fill-slate-750" />
      <circle cx="27" cy="78" r="2" fill="currentColor" />
      <circle cx="75" cy="78" r="6" className="fill-slate-300 dark:fill-slate-750" />
      <circle cx="75" cy="78" r="2" fill="currentColor" />
      <circle cx="87" cy="78" r="6" className="fill-slate-300 dark:fill-slate-750" />
      <circle cx="87" cy="78" r="2" fill="currentColor" />

      {/* Aggregate hoppers on Left */}
      <path d="M8 42 L34 42 L30 62 L12 62 Z" className="fill-slate-100 dark:fill-slate-800" />
      <line x1="21" y1="42" x2="21" y2="62" className="stroke-slate-300 dark:stroke-slate-600" />

      {/* Additive Tanks and Control Cabin in middle */}
      <rect x="38" y="45" width="22" height="22" rx="3" className="fill-slate-200 dark:fill-slate-700" />
      <rect x="42" y="49" width="8" height="8" className="stroke-indigo-500" />
      <line x1="54" y1="45" x2="54" y2="67" />

      {/* Monolithic dry powder storage on Right */}
      <rect x="64" y="32" width="26" height="35" rx="2" className="fill-slate-100 dark:fill-slate-800" strokeWidth="3" />
      <line x1="64" y1="44" x2="90" y2="44" className="stroke-indigo-500" strokeWidth="1.5" />
      <line x1="64" y1="56" x2="90" y2="56" className="stroke-indigo-500" strokeWidth="1.5" />
    </svg>
  );
}
