import React from 'react';

interface IllustrationProps {
  className?: string;
}

// 1. PLANETARY MIXERS
export function PlanetaryMixerIllustration({ className = '' }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 800 450"
      className={`w-full h-full bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 transition-colors ${className}`}
      id="illustration-planetary-mixer"
    >
      {/* Background grids for a blueprint / schematic look */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.07" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Main outer mixing pan */}
      <circle cx="380" cy="210" r="150" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="3" />
      <circle cx="380" cy="210" r="142" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />
      <circle cx="380" cy="210" r="135" fill="none" stroke="currentColor" strokeWidth="1.5" />

      {/* Outer circular gear ring */}
      <circle cx="380" cy="210" r="110" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.7" />

      {/* Central sun gear assembly */}
      <circle cx="380" cy="210" r="32" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" />
      <circle cx="380" cy="210" r="22" fill="none" stroke="currentColor" strokeWidth="1" />
      
      {/* Gear teeth details for central sun gear */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 360) / 12;
        return (
          <line
            key={`teeth-sun-${i}`}
            x1="380"
            y1="182"
            x2="380"
            y2="176"
            transform={`rotate(${angle} 380 210)`}
            stroke="currentColor"
            strokeWidth="2"
          />
        );
      })}

      {/* Planetary orbiting gear 1 */}
      <g transform="rotate(30 380 210) translate(0 -70)">
        <circle cx="380" cy="210" r="22" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="380" cy="210" r="14" fill="none" stroke="currentColor" strokeWidth="1" />
        {/* Gear teeth */}
        {[...Array(8)].map((_, i) => (
          <line
            key={`teeth-p1-${i}`}
            x1="380"
            y1="192"
            x2="380"
            y2="188"
            transform={`rotate(${(i * 360) / 8} 380 210)`}
            stroke="currentColor"
            strokeWidth="1.5"
          />
        ))}
        {/* Connecting arm */}
        <line x1="380" y1="210" x2="380" y2="280" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        {/* Scraper Paddle */}
        <path d="M 368 280 L 392 280 L 395 305 L 365 305 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* Planetary orbiting gear 2 */}
      <g transform="rotate(150 380 210) translate(0 -70)">
        <circle cx="380" cy="210" r="22" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="380" cy="210" r="14" fill="none" stroke="currentColor" strokeWidth="1" />
        {/* Gear teeth */}
        {[...Array(8)].map((_, i) => (
          <line
            key={`teeth-p2-${i}`}
            x1="380"
            y1="192"
            x2="380"
            y2="188"
            transform={`rotate(${(i * 360) / 8} 380 210)`}
            stroke="currentColor"
            strokeWidth="1.5"
          />
        ))}
        {/* Connecting arm */}
        <line x1="380" y1="210" x2="380" y2="280" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        {/* Scraper Paddle */}
        <path d="M 368 280 L 392 280 L 395 305 L 365 305 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* Outer Pan Scraper Sweeper Arms */}
      <g transform="rotate(270 380 210)">
        <path d="M 380 210 L 380 345" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        {/* Outer Curved Scraper Blade */}
        <path d="M 355 345 C 370 348, 390 348, 405 345 L 400 325 C 390 327, 370 327, 360 325 Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* Side Drive Assembly (Electric Motor & Transmission Box) */}
      <g transform="translate(530 130)">
        {/* Shaft interface */}
        <rect x="0" y="65" width="45" height="30" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
        <line x1="0" y1="80" x2="45" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        
        {/* Reduction Gearbox Box */}
        <rect x="45" y="30" width="75" height="100" rx="6" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="82" cy="80" r="15" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />

        {/* Electric Motor body */}
        <rect x="120" y="45" width="90" height="70" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
        {/* Motor Cooling Fins */}
        {[...Array(6)].map((_, i) => (
          <line
            key={`fin-${i}`}
            x1={130 + i * 14}
            y1="45"
            x2={130 + i * 14}
            y2="115"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />
        ))}
        {/* Electrical connection box */}
        <rect x="150" y="27" width="28" height="18" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* Frame / Structural lugs */}
      <rect x="190" y="195" width="40" height="30" rx="4" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" />
      <line x1="210" y1="180" x2="210" y2="240" stroke="currentColor" strokeWidth="1.5" />

      {/* Title Text within vector */}
      <text x="380" y="415" textAnchor="middle" className="font-sans text-sm font-bold tracking-widest fill-slate-400 dark:fill-slate-500 uppercase">
        Planetary Mixer Section
      </text>
    </svg>
  );
}

// 2. TWIN SHAFT MIXERS
export function TwinShaftMixerIllustration({ className = '' }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 800 450"
      className={`w-full h-full bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 transition-colors ${className}`}
      id="illustration-twin-shaft"
    >
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Core Mixing Trough Shell */}
      <rect x="180" y="110" width="440" height="210" rx="25" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="3" />
      
      {/* Structural horizontal reinforcement beams */}
      <line x1="180" y1="145" x2="620" y2="145" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
      <line x1="180" y1="285" x2="620" y2="285" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />

      {/* Double circular trough lines in background (showing twin cylindrical chamber sweep) */}
      <path d="M 220 110 A 105 105 0 0 0 220 320 L 580 320 A 105 105 0 0 0 580 110 Z" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.4" />

      {/* Two Horizontal Shafts */}
      {/* Shaft 1 (Top) */}
      <g>
        {/* Main Shaft Line */}
        <rect x="140" y="155" width="520" height="16" rx="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
        <line x1="130" y1="163" x2="670" y2="163" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" strokeOpacity="0.5" />
        {/* Mixing Arms & Paddles along Shaft 1 */}
        {[220, 290, 360, 430, 500, 570].map((x, idx) => {
          const isUp = idx % 2 === 0;
          return (
            <g key={`arm-s1-${idx}`} transform={`translate(${x} 163)`}>
              {/* Arm stem */}
              <line x1="0" y1="0" x2="0" y2={isUp ? -38 : 38} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              {/* Paddle tip */}
              <rect
                x="-12"
                y={isUp ? -46 : 38}
                width="24"
                height="10"
                rx="2"
                transform={`rotate(${isUp ? 25 : -25} 0 ${isUp ? -41 : 43})`}
                fill="currentColor"
                fillOpacity="0.3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </g>
          );
        })}
      </g>

      {/* Shaft 2 (Bottom) */}
      <g>
        {/* Main Shaft Line */}
        <rect x="140" y="235" width="520" height="16" rx="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
        <line x1="130" y1="243" x2="670" y2="243" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" strokeOpacity="0.5" />
        {/* Mixing Arms & Paddles along Shaft 2 (Interleaved offset) */}
        {[185, 255, 325, 395, 465, 535, 605].map((x, idx) => {
          const isUp = idx % 2 !== 0;
          return (
            <g key={`arm-s2-${idx}`} transform={`translate(${x} 243)`}>
              {/* Arm stem */}
              <line x1="0" y1="0" x2="0" y2={isUp ? -38 : 38} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              {/* Paddle tip */}
              <rect
                x="-12"
                y={isUp ? -46 : 38}
                width="24"
                height="10"
                rx="2"
                transform={`rotate(${isUp ? -25 : 25} 0 ${isUp ? -41 : 43})`}
                fill="currentColor"
                fillOpacity="0.3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </g>
          );
        })}
      </g>

      {/* End Bearing / Shaft Housings */}
      <rect x="160" y="145" width="20" height="116" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="620" y="145" width="20" height="116" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />

      {/* Side Drive / Transmission cover (Pulley/Belt case) on right */}
      <path d="M 640 120 L 680 120 A 40 40 0 0 1 720 160 L 720 250 A 40 40 0 0 1 680 290 L 640 290 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2.5" />
      
      {/* Drive motor mounted below belt cover */}
      <rect x="648" y="290" width="56" height="45" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="658" y1="290" x2="658" y2="335" stroke="currentColor" strokeWidth="1" />
      <line x1="668" y1="290" x2="668" y2="335" stroke="currentColor" strokeWidth="1" />
      <line x1="678" y1="290" x2="678" y2="335" stroke="currentColor" strokeWidth="1" />

      {/* Heavy Bottom Discharge Hydraulic Gate */}
      <path d="M 330 320 L 470 320 L 450 345 L 350 345 Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2" />
      {/* Hydraulic Cylinders */}
      <line x1="320" y1="310" x2="350" y2="340" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="480" y1="310" x2="450" y2="340" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

      {/* Title Text */}
      <text x="380" y="415" textAnchor="middle" className="font-sans text-sm font-bold tracking-widest fill-slate-400 dark:fill-slate-500 uppercase">
        Twin Shaft Mixer Section
      </text>
    </svg>
  );
}

// 3. CEMENT STORAGE SILOS
export function CementSilosIllustration({ className = '' }: IllustrationProps) {
  const siloXCoords = [170, 310, 450, 590];

  return (
    <svg
      viewBox="0 0 800 450"
      className={`w-full h-full bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 transition-colors ${className}`}
      id="illustration-cement-silos"
    >
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Ground Line */}
      <line x1="80" y1="380" x2="720" y2="380" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

      {/* Draw the 4 Silos */}
      {siloXCoords.map((x, index) => (
        <g key={`silo-${index}`}>
          {/* Silo cylinder body */}
          <rect x={x} y="110" width="80" height="150" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="2.5" />
          
          {/* Silo shell section joints (horizontal lines) */}
          <line x1={x} y1="150" x2={x + 80} y2="150" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
          <line x1={x} y1="190" x2={x + 80} y2="190" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
          <line x1={x} y1="230" x2={x + 80} y2="230" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />

          {/* Conical Top Dome */}
          <path d={`M ${x} 110 Q ${x + 40} 85 ${x + 80} 110 Z`} fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" />
          {/* Top Safety Filter Hatch */}
          <rect x={x + 28} y="75" width="24" height="15" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
          
          {/* Conical bottom hopper */}
          <path d={`M ${x} 260 L ${x + 40} 310 L ${x + 80} 260 Z`} fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />

          {/* Individual Support Legs */}
          <line x1={x + 6} y1="260" x2={x + 6} y2="380" stroke="currentColor" strokeWidth="3" />
          <line x1={x + 74} y1="260" x2={x + 74} y2="380" stroke="currentColor" strokeWidth="3" />
          {/* Leg cross bracing for stability */}
          <line x1={x + 6} y1="280" x2={x + 74} y2="340" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
          <line x1={x + 74} y1="280" x2={x + 6} y2="340" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
          <line x1={x + 6} y1="340" x2={x + 74} y2="380" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />

          {/* Discharge valve assembly at bottom cone */}
          <rect x={x + 32} y="310" width="16" height="12" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />
        </g>
      ))}

      {/* Top Walkway handrail spanning across all silos */}
      <line x1="140" y1="95" x2="690" y2="95" stroke="currentColor" strokeWidth="1.5" />
      <line x1="140" y1="83" x2="690" y2="83" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      {/* Handrail support posts */}
      {[140, 210, 280, 350, 420, 490, 560, 630, 690].map((xPost) => (
        <line key={`post-${xPost}`} x1={xPost} y1="95" x2={xPost} y2="110" stroke="currentColor" strokeWidth="1" />
      ))}

      {/* Main vertical access ladder with safety cage rings on Silo 1 */}
      <g transform="translate(148 110)">
        {/* Ladder rails */}
        <line x1="0" y1="0" x2="0" y2="270" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="0" x2="12" y2="270" stroke="currentColor" strokeWidth="1.5" />
        {/* Ladder rungs */}
        {[...Array(18)].map((_, i) => (
          <line key={`rung-${i}`} x1="0" y1={i * 15} x2="12" y2={i * 15} stroke="currentColor" strokeWidth="1" strokeOpacity="0.8" />
        ))}
        {/* Safety cage outline */}
        <path d="M -8 20 C -15 20, -15 250, -8 250" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />
      </g>

      {/* Bottom Horizontal Screw Conveyor collector pipe */}
      <rect x="195" y="318" width="415" height="12" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
      {/* Connecting flanges */}
      {siloXCoords.map((x) => (
        <line key={`flange-${x}`} x1={x + 40} y1="310" x2={x + 40} y2="330" stroke="currentColor" strokeWidth="2.5" />
      ))}
      
      {/* Final outlet of screw conveyor */}
      <path d="M 610 324 L 625 324 L 620 345 L 605 345 Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />

      {/* Title Text */}
      <text x="380" y="415" textAnchor="middle" className="font-sans text-sm font-bold tracking-widest fill-slate-400 dark:fill-slate-500 uppercase">
        Cement Storage Silos
      </text>
    </svg>
  );
}

// 4. CONCRETE BATCHING PLANT (STATIONARY)
export function ConcreteBatchingPlantIllustration({ className = '' }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 800 450"
      className={`w-full h-full bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 transition-colors ${className}`}
      id="illustration-batching-plant"
    >
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Ground Line */}
      <line x1="50" y1="370" x2="750" y2="370" stroke="currentColor" strokeWidth="3" />

      {/* --- LEFT SIDE: 3 Inline Aggregate Feeder Bins --- */}
      <g id="aggregate-bins">
        {/* Supporting legs */}
        {[80, 140, 200, 260].map((xLeg) => (
          <line key={`leg-bin-${xLeg}`} x1={xLeg} y1="210" x2={xLeg} y2="370" stroke="currentColor" strokeWidth="2.5" />
        ))}
        {/* Horizontal structural beams */}
        <line x1="75" y1="210" x2="265" y2="210" stroke="currentColor" strokeWidth="2" />
        <line x1="75" y1="270" x2="265" y2="270" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />

        {/* 3 Hopper Bins */}
        {[80, 140, 200].map((x) => (
          <g key={`hopper-${x}`}>
            <path d={`M ${x} 145 L ${x + 60} 145 L ${x + 50} 210 L ${x + 10} 210 Z`} fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" />
            {/* Gravel / Aggregate pile visual */}
            <path d={`M ${x + 5} 145 Q ${x + 30} 125 ${x + 55} 145 Z`} fill="currentColor" fillOpacity="0.3" stroke="none" />
          </g>
        ))}
      </g>

      {/* --- INCLINED CHARGING CONVEYOR BELT --- */}
      <g id="inclined-conveyor">
        {/* Main Conveyor Frame */}
        <line x1="170" y1="320" x2="430" y2="155" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeOpacity="0.1" />
        <line x1="170" y1="325" x2="430" y2="160" stroke="currentColor" strokeWidth="2" />
        <line x1="170" y1="315" x2="430" y2="150" stroke="currentColor" strokeWidth="2" />
        
        {/* Support columns for conveyor */}
        <line x1="300" y1="237" x2="300" y2="370" stroke="currentColor" strokeWidth="2" />
        <line x1="390" y1="180" x2="390" y2="370" stroke="currentColor" strokeWidth="2" />

        {/* Conveyor belt rollers details */}
        {[200, 240, 280, 320, 360, 400].map((cx) => {
          const cy = 320 - ((cx - 170) * 165) / 260;
          return <circle key={`roller-${cx}`} cx={cx} cy={cy} r="3.5" fill="currentColor" />;
        })}
      </g>

      {/* --- CENTER: MAIN MIXER TOWER --- */}
      <g id="mixer-tower">
        {/* Support Pillars */}
        <line x1="430" y1="120" x2="430" y2="370" stroke="currentColor" strokeWidth="3.5" />
        <line x1="510" y1="120" x2="510" y2="370" stroke="currentColor" strokeWidth="3.5" />
        {/* Platform walkways and cross bracing */}
        <line x1="410" y1="130" x2="530" y2="130" stroke="currentColor" strokeWidth="2.5" />
        <line x1="410" y1="240" x2="530" y2="240" stroke="currentColor" strokeWidth="2.5" />
        <line x1="430" y1="180" x2="510" y2="240" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
        <line x1="510" y1="180" x2="430" y2="240" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />

        {/* Mixer Bowl housing (Twin-shaft/Planetary inside) */}
        <rect x="440" y="145" width="60" height="45" rx="5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
        {/* Discharge chute */}
        <path d="M 455 190 L 485 190 L 480 215 L 460 215 Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" />

        {/* Control Cabin built into structure */}
        <rect x="440" y="255" width="60" height="55" rx="4" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="2" />
        {/* Cabin Window */}
        <rect x="448" y="262" width="22" height="18" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* Cabin Door */}
        <rect x="476" y="262" width="18" height="48" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* --- RIGHT SIDE: TALL CEMENT STORAGE SILO --- */}
      <g id="cement-silo-right">
        {/* Supporting legs */}
        <line x1="560" y1="210" x2="560" y2="370" stroke="currentColor" strokeWidth="3" />
        <line x1="630" y1="210" x2="630" y2="370" stroke="currentColor" strokeWidth="3" />
        <line x1="560" y1="240" x2="630" y2="280" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="630" y1="240" x2="560" y2="280" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />

        {/* Silo cylinder body */}
        <rect x="550" y="80" width="90" height="150" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2.5" />
        <path d="M 550 80 Q 595 55 640 80 Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" />
        <path d="M 550 230 L 595 270 L 640 230 Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />

        {/* Inclined Screw Conveyor tube feeding into Mixer */}
        <line x1="595" y1="270" x2="485" y2="140" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <line x1="595" y1="270" x2="485" y2="140" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.5" />
      </g>

      {/* --- TRUCK PARKED UNDERNEATH DISCHARGE --- */}
      <g id="concrete-truck" transform="translate(305 275)">
        {/* Cabin */}
        <path d="M 0 45 L 30 45 L 30 20 L 15 20 L 5 32 L 0 35 Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="24" width="12" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
        
        {/* Chassis */}
        <rect x="30" y="40" width="85" height="12" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
        
        {/* Rotating Concrete Drum */}
        <path d="M 40 38 L 50 12 L 85 12 L 105 26 L 105 38 Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.8" />
        <ellipse cx="72" cy="24" rx="28" ry="14" transform="rotate(-15 72 24)" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />

        {/* Feed Hopper funnel */}
        <path d="M 100 8 L 112 8 L 108 22 L 100 22 Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" />

        {/* Wheels */}
        <circle cx="20" cy="58" r="11" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="58" r="4" fill="currentColor" />
        <circle cx="50" cy="58" r="11" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="58" r="4" fill="currentColor" />
        <circle cx="85" cy="58" r="11" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
        <circle cx="85" cy="58" r="4" fill="currentColor" />
        <circle cx="100" cy="58" r="11" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="58" r="4" fill="currentColor" />
      </g>

      {/* Title Text */}
      <text x="380" y="415" textAnchor="middle" className="font-sans text-sm font-bold tracking-widest fill-slate-400 dark:fill-slate-500 uppercase">
        Concrete Batching Plant
      </text>
    </svg>
  );
}

// 5. WET MIX MACADAM PLANT
export function WetMixPlantIllustration({ className = '' }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 800 450"
      className={`w-full h-full bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 transition-colors ${className}`}
      id="illustration-wet-mix"
    >
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Ground Line */}
      <line x1="50" y1="370" x2="750" y2="370" stroke="currentColor" strokeWidth="3" />

      {/* --- LEFT SIDE: 4 Cold Aggregate Feeder Bins --- */}
      <g id="cold-bins">
        {/* Support columns */}
        {[65, 120, 175, 230, 285].map((x) => (
          <line key={`leg-cold-${x}`} x1={x} y1="210" x2={x} y2="370" stroke="currentColor" strokeWidth="2.2" />
        ))}
        {/* Gathering horizontal framing */}
        <line x1="60" y1="210" x2="290" y2="210" stroke="currentColor" strokeWidth="2" />

        {/* 4 Inline Feeder Bins */}
        {[65, 120, 175, 230].map((x) => (
          <g key={`coldbin-${x}`}>
            <path d={`M ${x} 135 L ${x + 50} 135 L ${x + 42} 210 L ${x + 8} 210 Z`} fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" />
            <line x1={x + 25} y1="210" x2={x + 25} y2="235" stroke="currentColor" strokeWidth="1.5" />
          </g>
        ))}

        {/* Horizontal gathering conveyor under bins */}
        <rect x="60" y="235" width="235" height="12" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* --- INCLINED AGGREGATE CHARGING CONVEYOR --- */}
      <g id="charging-conveyor">
        <line x1="260" y1="242" x2="430" y2="152" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.15" />
        <line x1="260" y1="245" x2="430" y2="155" stroke="currentColor" strokeWidth="2" />
        <line x1="260" y1="239" x2="430" y2="149" stroke="currentColor" strokeWidth="2" />
        <line x1="350" y1="195" x2="350" y2="370" stroke="currentColor" strokeWidth="1.8" />
      </g>

      {/* --- CENTER: PUGMILL CONTINUOUS MIXER --- */}
      <g id="pugmill-mixer">
        {/* Support columns */}
        <line x1="430" y1="150" x2="430" y2="370" stroke="currentColor" strokeWidth="3" />
        <line x1="530" y1="150" x2="530" y2="370" stroke="currentColor" strokeWidth="3" />
        
        {/* Pugmill horizontal mixing chamber body */}
        <rect x="420" y="130" width="120" height="50" rx="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5" />
        {/* Twin drive gear caps on left side of pugmill */}
        <rect x="408" y="138" width="12" height="34" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />

        {/* Electric driving motor */}
        <rect x="445" y="100" width="45" height="30" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
        {/* Water Pipe leading into Pugmill */}
        <path d="M 500 90 L 500 130" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="500" cy="85" r="5" fill="currentColor" />
      </g>

      {/* --- SLANTED WET MIX DISCHARGE CONVEYOR --- */}
      <g id="discharge-conveyor">
        <line x1="490" y1="200" x2="650" y2="140" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.15" />
        <line x1="490" y1="203" x2="650" y2="143" stroke="currentColor" strokeWidth="2" />
        <line x1="490" y1="197" x2="650" y2="137" stroke="currentColor" strokeWidth="2" />
        <line x1="585" y1="165" x2="585" y2="370" stroke="currentColor" strokeWidth="1.8" />
      </g>

      {/* --- RIGHT SIDE: SURGE SILO HOPPER --- */}
      <g id="surge-silo">
        {/* Structural tower legs */}
        <line x1="640" y1="130" x2="640" y2="370" stroke="currentColor" strokeWidth="3" />
        <line x1="710" y1="130" x2="710" y2="370" stroke="currentColor" strokeWidth="3" />
        
        {/* Surge Hopper tank */}
        <rect x="635" y="100" width="80" height="60" rx="3" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2.2" />
        <path d="M 635 160 L 675 195 L 715 160 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
        
        {/* Radial pneumatic discharge gate at bottom */}
        <rect x="667" y="195" width="16" height="10" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* --- DUMP TRUCK PARKED UNDER HOPPER --- */}
      <g id="dump-truck" transform="translate(560 288)">
        {/* Cabin */}
        <path d="M 120 40 L 142 40 L 142 16 L 130 16 L 122 28 Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        {/* Chassis */}
        <rect x="0" y="38" width="122" height="10" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
        {/* Heavy Dump Tipper Cargo Box */}
        <path d="M 5 12 L 115 12 L 115 38 L 12 38 Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.8" />

        {/* Wheels */}
        <circle cx="25" cy="54" r="11" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
        <circle cx="25" cy="54" r="4" fill="currentColor" />
        <circle cx="50" cy="54" r="11" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="54" r="4" fill="currentColor" />
        <circle cx="95" cy="54" r="11" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
        <circle cx="95" cy="54" r="4" fill="currentColor" />
        <circle cx="110" cy="54" r="11" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
        <circle cx="110" cy="54" r="4" fill="currentColor" />
      </g>

      {/* Title Text */}
      <text x="380" y="415" textAnchor="middle" className="font-sans text-sm font-bold tracking-widest fill-slate-400 dark:fill-slate-500 uppercase">
        Wet Mix Macadam Plant
      </text>
    </svg>
  );
}

// 6. CONCRETE BATCHING PLANT (COMPACT)
export function ConcreteBatchingPlantCompactIllustration({ className = '' }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 800 450"
      className={`w-full h-full bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 transition-colors ${className}`}
      id="illustration-compact-plant"
    >
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Ground Line */}
      <line x1="50" y1="370" x2="750" y2="370" stroke="currentColor" strokeWidth="3" />

      {/* --- LEFT SIDE: TALL COMPACT CEMENT SILO --- */}
      <g id="compact-silo">
        {/* Support structural columns */}
        <line x1="160" y1="210" x2="160" y2="370" stroke="currentColor" strokeWidth="3" />
        <line x1="230" y1="210" x2="230" y2="370" stroke="currentColor" strokeWidth="3" />
        <line x1="160" y1="250" x2="230" y2="290" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="230" y1="250" x2="160" y2="290" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />

        {/* Silo cylindrical body */}
        <rect x="150" y="80" width="90" height="160" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2.5" />
        {/* Silo conical top and bottom */}
        <path d="M 150 80 Q 195 52 240 80 Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" />
        <path d="M 150 240 L 195 285 L 240 240 Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />

        {/* Inclined short screw conveyor feeding into Compact Mixer */}
        <line x1="195" y1="285" x2="310" y2="155" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
      </g>

      {/* --- CENTER: COMPACT MIXER TOWER WITH INTEGRATED SKIP HOIST --- */}
      <g id="compact-tower">
        {/* Structural tower posts */}
        <line x1="310" y1="120" x2="310" y2="370" stroke="currentColor" strokeWidth="3.5" />
        <line x1="390" y1="120" x2="390" y2="370" stroke="currentColor" strokeWidth="3.5" />
        
        {/* Platform floor */}
        <line x1="290" y1="130" x2="410" y2="130" stroke="currentColor" strokeWidth="2.5" />

        {/* Integrated compact pan/planetary mixer unit */}
        <rect x="320" y="140" width="60" height="40" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.2" />
        {/* Discharge pipe funnel */}
        <path d="M 335 180 L 365 180 L 360 210 L 340 210 Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" />

        {/* Skip Track Guide Rails (Inclined rails on right side of tower) */}
        <line x1="385" y1="140" x2="480" y2="310" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="395" y1="140" x2="490" y2="310" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        
        {/* Skip Hoist Bucket (halfway up the rails) */}
        <g transform="translate(432 215) rotate(30)">
          <path d="M -10 -15 L 15 -15 L 12 15 L -12 15 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />
          {/* Wheels of skip bucket */}
          <circle cx="-10" cy="15" r="3.5" fill="currentColor" />
          <circle cx="10" cy="15" r="3.5" fill="currentColor" />
        </g>
      </g>

      {/* --- RIGHT SIDE: COMPACT AGGREGATE BIN AND HOPPER (GROUND FEED) --- */}
      <g id="compact-ground-feed">
        {/* Ground aggregator skip hopper pit */}
        <path d="M 465 295 L 535 295 L 520 370 L 480 370 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
        <path d="M 470 295 Q 500 275 530 295 Z" fill="currentColor" fillOpacity="0.25" stroke="none" />
        
        {/* Winch gear motor for the skip cable */}
        <rect x="335" y="95" width="30" height="20" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="350" cy="105" r="6" fill="none" stroke="currentColor" strokeWidth="1" />
      </g>

      {/* Concrete chute with a delivery outlet */}
      <path d="M 340 250 L 360 250 L 380 300 L 330 300 Z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.5" />

      {/* Title Text */}
      <text x="380" y="415" textAnchor="middle" className="font-sans text-sm font-bold tracking-widest fill-slate-400 dark:fill-slate-500 uppercase">
        Compact Batching Plant
      </text>
    </svg>
  );
}

// 7. General Fallback illustration (or for other categories like precast molds)
export function PrecastMouldIllustration({ className = '' }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 800 450"
      className={`w-full h-full bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 transition-colors ${className}`}
      id="illustration-precast-mould"
    >
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Outer clamping framing */}
      <rect x="180" y="90" width="440" height="240" rx="12" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="3.5" />

      {/* Segment mold divisions (showing steel shuttering plates) */}
      {[240, 300, 360, 420, 480, 540].map((x) => (
        <g key={`shutter-${x}`}>
          <line x1={x} y1="90" x2={x} y2="330" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
          {/* Bolt lugs holding plates together */}
          <circle cx={x} cy="130" r="4" fill="currentColor" />
          <circle cx={x} cy="210" r="4" fill="currentColor" />
          <circle cx={x} cy="290" r="4" fill="currentColor" />
        </g>
      ))}

      {/* Center cavity for a concrete block / girder mould */}
      <path d="M 210 160 L 590 160 L 560 260 L 240 260 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2.5" />
      <line x1="210" y1="160" x2="590" y2="160" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />

      {/* Shutter mechanical locking hinges at the base */}
      {[220, 280, 340, 400, 460, 520, 580].map((x) => (
        <g key={`hinge-${x}`}>
          <rect x={x - 10} y="330" width="20" height="15" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.2" />
          <circle cx={x} cy="338" r="2.5" fill="currentColor" />
        </g>
      ))}

      {/* Vertical stiffener ribs */}
      {[200, 260, 320, 380, 440, 500, 560, 600].map((x) => (
        <line key={`rib-${x}`} x1={x} y1="90" x2={x} y2="330" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      ))}

      {/* Title Text */}
      <text x="380" y="415" textAnchor="middle" className="font-sans text-sm font-bold tracking-widest fill-slate-400 dark:fill-slate-500 uppercase">
        Precast Shuttering Mould
      </text>
    </svg>
  );
}

// Map helper to fetch the corresponding component based on product id
export function getProductIllustration(productId: string) {
  switch (productId) {
    case 'planetary-mixers':
      return <PlanetaryMixerIllustration />;
    case 'twin-shaft-mixers':
      return <TwinShaftMixerIllustration />;
    case 'cement-storage-silos':
      return <CementSilosIllustration />;
    case 'concrete-batching-plant':
      return <ConcreteBatchingPlantIllustration />;
    case 'rockmix-mobile-rmp':
    case 'rockmix-compact-rcp':
    case 'rockmix-compact-mobility-rcmp':
      return <ConcreteBatchingPlantCompactIllustration />;
    case 'rockmix-stationary-rsp':
      return <ConcreteBatchingPlantIllustration />;
    case 'wet-mix-macadam-plant':
      return <WetMixPlantIllustration />;
    case 'concrete-precast-mould':
      return <PrecastMouldIllustration />;
    default:
      // Fallback for other items (like asphalt plants, pan mixers)
      return <TwinShaftMixerIllustration />;
  }
}
