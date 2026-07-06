import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Play, Pause, Activity, Cpu, Sparkles, AlertCircle } from 'lucide-react';

interface Product360ViewerProps {
  productId: string;
}

export default function Product360Viewer({ productId }: Product360ViewerProps) {
  const [rotation, setRotation] = useState<number>(35); // Initial beautiful angle
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [simulationActive, setSimulationActive] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startRotationRef = useRef<number>(35);

  // Auto-rotation effect
  useEffect(() => {
    let animId: number;
    const rotate = () => {
      if (isRotating && !isDraggingRef.current && !simulationActive) {
        setRotation((prev) => (prev + 0.4) % 360);
      }
      animId = requestAnimationFrame(rotate);
    };
    animId = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(animId);
  }, [isRotating, simulationActive]);

  // Handle Drag / Touch rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startRotationRef.current = rotation;
    setIsRotating(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    const speed = 0.8; // degrees per pixel
    setRotation((startRotationRef.current + deltaX * speed + 360) % 360);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      startXRef.current = e.touches[0].clientX;
      startRotationRef.current = rotation;
      setIsRotating(false);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    const speed = 0.8;
    setRotation((startRotationRef.current + deltaX * speed + 360) % 360);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();
    const handleGlobalTouchMove = (e: TouchEvent) => handleTouchMove(e);
    const handleGlobalTouchEnd = () => handleMouseUp();

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
    window.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [rotation]);

  // Simulation steps
  const runSimulation = () => {
    if (simulationActive) return;
    setSimulationActive(true);
    setSimulationStep(1);
    setIsRotating(false);
    setSelectedHotspot(null);
    setSimulationLogs(['Initializing system diagnostics...', 'Pneumatic valves verified.']);
    
    setTimeout(() => {
      setSimulationStep(2);
      setSimulationLogs(prev => [...prev, 'Step 1: Commencing aggregate cold-feed weighing...', 'Sensors locked: Weighing ±0.2% accuracy.']);
    }, 1500);

    setTimeout(() => {
      setSimulationStep(3);
      setSimulationLogs(prev => [...prev, 'Step 2: Conveying aggregates. Injecting binder/water lines...', 'Pressure: 4.5 Bar. Cement screw scale active.']);
    }, 3200);

    setTimeout(() => {
      setSimulationStep(4);
      setSimulationLogs(prev => [...prev, 'Step 3: High-shear mixing cycle engaged...', 'Turbulence: 100%. Twin-shaft counter-rotation dynamic active.']);
    }, 4800);

    setTimeout(() => {
      setSimulationStep(5);
      setSimulationLogs(prev => [...prev, 'Step 4: Discharge gate open. Loading dispatch mixer truck...', 'Cycle completed successfully. Output logged.']);
    }, 6500);

    setTimeout(() => {
      setSimulationActive(false);
      setSimulationStep(0);
      setIsRotating(true);
    }, 8500);
  };

  // Configure hotspots based on productId
  interface Hotspot {
    id: string;
    label: string;
    x: number;
    y: number;
    desc: string;
  }

  const getHotspotsForProduct = (id: string): Hotspot[] => {
    switch (id) {
      case 'concrete-batching-plant':
        return [
          { id: 'feeder', label: 'Inline Aggregates Feeder', x: 25, y: 65, desc: 'Stores and weighs multi-grade sand and gravel with precision load cells.' },
          { id: 'hoist', label: 'Skip Hoist Elevating System', x: 45, y: 40, desc: 'Elevates measured aggregates vertically to minimize footprint.' },
          { id: 'mixer', label: 'Twin-Shaft Mixing Tower', x: 65, y: 35, desc: 'Produces perfectly homogeneous structural concrete batches in under 30 seconds.' },
          { id: 'cabin', label: 'PLC Operator Cabin', x: 80, y: 75, desc: 'Features SCADA visualization panel and automated ingredient dispatch controls.' }
        ];
      case 'wet-mix-macadam-plant':
        return [
          { id: 'feeder', label: '4-Bin Cold Feeder', x: 20, y: 65, desc: 'Features individual variable frequency drives for synchronized aggregate flow.' },
          { id: 'screen', label: 'Vibratory Screen', x: 48, y: 45, desc: 'Filters out oversize materials and roots from aggregate feed.' },
          { id: 'pugmill', label: 'High-Shear Pugmill', x: 68, y: 40, desc: 'Equipped with dual counter-rotating shafts lined with wear-resistant alloy blades.' },
          { id: 'silo', label: 'Anti-Segregation Surge Silo', x: 88, y: 55, desc: 'Stores finished wet mix temporarily with pneumatic gates to prevent aggregate segregation.' }
        ];
      case 'asphalt-drum-mix-plant':
        return [
          { id: 'bins', label: 'Cold Feed Bins', x: 20, y: 65, desc: 'Delivers proportionate aggregate blends continuously with high accuracy.' },
          { id: 'dryer', label: 'Parallel-Flow Drying Drum', x: 50, y: 45, desc: 'Simultaneously dries aggregates with a high-efficiency multi-fuel burner.' },
          { id: 'bitumen', label: 'Bitumen Jacketed Tank', x: 72, y: 60, desc: 'Maintains binder at 160°C with automated thermostatic oil coil heaters.' },
          { id: 'cyclone', label: 'Multi-Cyclone Dust Filter', x: 85, y: 40, desc: 'Extracts ultra-fine dust particles from exhaust gas for strict pollution control.' }
        ];
      case 'cement-storage-silos':
        return [
          { id: 'filter', label: 'Reverse-Jet Dust Filter', x: 50, y: 15, desc: 'Self-cleaning pneumatic filter keeps air clean during pressure fill cycles.' },
          { id: 'body', label: 'Segmented Bolted Body', x: 50, y: 45, desc: 'High-tensile structural steel panels with waterproof gasket seals.' },
          { id: 'aeration', label: 'Fluidization Aeration Pads', x: 50, y: 70, desc: 'Prevents dry cement powder from bridging, ensuring consistent discharge.' },
          { id: 'screw', label: 'Discharge Screw Conveyor', x: 70, y: 80, desc: 'Feeds cement safely into batching mixers via heavy-duty spiral flights.' }
        ];
      case 'twin-shaft-mixers':
        return [
          { id: 'gears', label: 'Synchronized Gearbox', x: 15, y: 50, desc: 'Heavy-duty planetary drive splits power to dual horizontal mixing shafts.' },
          { id: 'shafts', label: 'Counter-Rotating Shafts', x: 50, y: 40, desc: 'Equipped with 16 high-chrome Ni-Hard paddle arms arranged in a spiral sequence.' },
          { id: 'lubricator', label: 'Central Automatic Lubrication', x: 80, y: 25, desc: 'Pumps grease automatically to dual shaft face seals under high pressure.' },
          { id: 'discharge', label: 'Hydraulic Slide Gate', x: 50, y: 75, desc: 'Opens fully for rapid discharge with a manual lever emergency override pump.' }
        ];
      case 'planetary-mixers':
        return [
          { id: 'motor', label: 'Vertical Planetary Gear Motor', x: 50, y: 20, desc: 'Delivers immense torque. Mounted centrally for maximum force distribution.' },
          { id: 'stars', label: 'Orbiting Mixing Stars', x: 35, y: 55, desc: 'Mixing stars spin on their own axis while revolving around the entire pan floor.' },
          { id: 'scraper', label: 'Continuous Scraper Arm', x: 65, y: 60, desc: 'Keeps inner pan walls completely clean of concrete buildup.' },
          { id: 'doors', label: 'Double Safety Inspection Doors', x: 50, y: 78, desc: 'Fitted with double safety micro-switches that cut off power when opened.' }
        ];
      default:
        return [
          { id: 'structure', label: 'Heavy Duty Frame', x: 50, y: 40, desc: 'Constructed with premium structural elements to absorb heavy aggregate loads.' },
          { id: 'controls', label: 'Operator Control Desk', x: 75, y: 70, desc: 'Includes digital parameters display and diagnostic overrides.' }
        ];
    }
  };

  const hotspots = getHotspotsForProduct(productId);

  // SVG representation map to render high-tech wireframes and blueprints
  const renderInteractiveMachineSVG = () => {
    // Determine neon colors
    const strokeColor = wireframeMode ? 'stroke-cyan-400' : 'stroke-indigo-500';
    const fillColor = wireframeMode ? 'fill-transparent' : 'fill-slate-100 dark:fill-slate-900';
    const accentFillColor = wireframeMode ? 'fill-cyan-500/10' : 'fill-indigo-50/70 dark:fill-indigo-950/20';
    const structuralLineColor = wireframeMode ? 'stroke-cyan-500/30' : 'stroke-slate-300';

    // Apply rotation calculation
    const cosAngle = Math.cos((rotation * Math.PI) / 180);
    const sinAngle = Math.sin((rotation * Math.PI) / 180);

    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Subtle grid pattern background to enhance engineering vibe */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]"></div>
        
        {/* Animated HUD / Compass ring around the machine */}
        <svg className="absolute w-[240px] h-[240px] opacity-25 pointer-events-none" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" className="stroke-indigo-400 stroke-dashed" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="41" fill="none" className="stroke-indigo-300" strokeWidth="0.25" />
          <text x="50" y="8" className="text-[4px] fill-indigo-500 font-mono text-center font-bold" textAnchor="middle">ROTATIONAL COMPASS</text>
          <text x="50" y="95" className="text-[4px] fill-indigo-500 font-mono text-center" textAnchor="middle">ANGL: {Math.round(rotation)}°</text>
        </svg>

        {/* 3D Rotating SVG representation */}
        <div 
          className="w-4/5 h-4/5 flex items-center justify-center transition-transform duration-75 select-none"
          style={{
            transform: `perspective(800px) rotateY(${rotation}deg) rotateX(15deg) scale(1.05)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {productId === 'concrete-batching-plant' && (
            <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-lg">
              {/* Aggregate bins */}
              <rect x="15" y="55" width="25" height="20" rx="2" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
              <line x1="23.3" y1="55" x2="23.3" y2="75" className={structuralLineColor} strokeWidth="0.5" />
              <line x1="31.6" y1="55" x2="31.6" y2="75" className={structuralLineColor} strokeWidth="0.5" />
              {/* Skip hoist track */}
              <path d="M 40 70 L 60 25" className={`${strokeColor}`} strokeWidth="1.5" strokeDasharray={wireframeMode ? "1,1" : "none"} />
              {/* Skip hoist skip */}
              <rect 
                x={simulationStep === 2 ? "43" : simulationStep === 3 ? "52" : "38"} 
                y={simulationStep === 2 ? "60" : simulationStep === 3 ? "40" : "68"} 
                width="6" 
                height="5" 
                rx="1" 
                className="stroke-amber-500 fill-amber-500/20 transition-all duration-1000" 
                strokeWidth="1" 
              />
              {/* Mixing tower */}
              <rect x="60" y="25" width="20" height="35" rx="3" className={`${strokeColor} ${accentFillColor}`} strokeWidth="1" />
              <rect x="62" y="32" width="16" height="15" rx="1" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
              {/* Mixing blades simulation */}
              {simulationStep === 4 && (
                <g className="animate-spin" style={{ transformOrigin: '70px 39.5px' }}>
                  <line x1="65" y1="39.5" x2="75" y2="39.5" className="stroke-indigo-500" strokeWidth="1" />
                  <line x1="70" y1="34.5" x2="70" y2="44.5" className="stroke-indigo-500" strokeWidth="1" />
                </g>
              )}
              {/* Cabin office */}
              <rect x="85" y="60" width="15" height="15" rx="2" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
              <rect x="88" y="63" width="9" height="5" className="stroke-cyan-500 fill-cyan-400/25" strokeWidth="0.5" />
              {/* Support legs */}
              <line x1="63" y1="60" x2="63" y2="85" className={strokeColor} strokeWidth="1" />
              <line x1="77" y1="60" x2="77" y2="85" className={strokeColor} strokeWidth="1" />
              {/* Silo cylinder on right */}
              <rect x="95" y="20" width="14" height="40" rx="1" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
              <polygon points="95,60 102,70 109,60" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
              <line x1="97" y1="70" x2="97" y2="85" className={strokeColor} strokeWidth="0.75" />
              <line x1="107" y1="70" x2="107" y2="85" className={strokeColor} strokeWidth="0.75" />
              {/* Concrete truck */}
              <g className={simulationStep === 5 ? "translate-x-2 transition-transform duration-1000" : ""}>
                <rect x="58" y="70" width="14" height="10" rx="1" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
                <circle cx="62" cy="80" r="2" className={strokeColor} />
                <circle cx="68" cy="80" r="2" className={strokeColor} />
                <rect x="72" y="74" width="6" height="6" rx="1" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
              </g>
            </svg>
          )}

          {productId === 'wet-mix-macadam-plant' && (
            <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-lg">
              {/* Feeder bins */}
              <rect x="10" y="55" width="30" height="20" rx="2" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
              <line x1="17.5" y1="55" x2="17.5" y2="75" className={structuralLineColor} strokeWidth="0.5" />
              <line x1="25" y1="55" x2="25" y2="75" className={structuralLineColor} strokeWidth="0.5" />
              <line x1="32.5" y1="55" x2="32.5" y2="75" className={structuralLineColor} strokeWidth="0.5" />
              {/* Conveyor belt */}
              <line x1="35" y1="70" x2="70" y2="40" className={`${strokeColor}`} strokeWidth="2.5" />
              {simulationStep >= 3 && (
                <circle cx="52" cy="55" r="1.5" className="fill-indigo-500 animate-ping" />
              )}
              {/* Vibratory screen */}
              <polygon points="68,36 78,36 74,44 64,44" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
              {/* Pugmill mixer */}
              <rect x="74" y="32" width="22" height="15" rx="2" className={`${strokeColor} ${accentFillColor}`} strokeWidth="1" />
              <line x1="74" y1="39.5" x2="96" y2="39.5" className={`${strokeColor} stroke-dashed`} strokeWidth="1" />
              {/* Surge silo */}
              <rect x="100" y="30" width="14" height="28" rx="1" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
              <polygon points="100,58 107,66 114,58" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
              {/* Legs for surge silo */}
              <line x1="102" y1="66" x2="102" y2="82" className={strokeColor} strokeWidth="1" />
              <line x1="112" y1="66" x2="112" y2="82" className={strokeColor} strokeWidth="1" />
            </svg>
          )}

          {productId === 'asphalt-drum-mix-plant' && (
            <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-lg">
              {/* Feeder bins */}
              <rect x="10" y="55" width="28" height="20" rx="2" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
              <line x1="17" y1="55" x2="17" y2="75" className={structuralLineColor} strokeWidth="0.5" />
              <line x1="24" y1="55" x2="24" y2="75" className={structuralLineColor} strokeWidth="0.5" />
              <line x1="31" y1="55" x2="31" y2="75" className={structuralLineColor} strokeWidth="0.5" />
              {/* Conveyor */}
              <line x1="34" y1="70" x2="52" y2="48" className={`${strokeColor}`} strokeWidth="2" />
              {/* Drying Drum (Rotary Cylinder) */}
              <g style={{ transform: `rotate(${simulationStep === 4 ? '10deg' : '0deg'})`, transformOrigin: '70px 48px' }} className="transition-transform duration-1000">
                <rect x="50" y="38" width="38" height="18" rx="3" className={`${strokeColor} ${accentFillColor}`} strokeWidth="1" />
                <ellipse cx="50" cy="47" rx="2" ry="9" className={strokeColor} fill="none" />
                <ellipse cx="88" cy="47" rx="2" ry="9" className={strokeColor} fill="none" />
                <line x1="50" y1="41" x2="88" y2="41" className={structuralLineColor} strokeWidth="0.5" />
                <line x1="50" y1="53" x2="88" y2="53" className={structuralLineColor} strokeWidth="0.5" />
              </g>
              {/* Exhaust Chimney & Cyclone */}
              <rect x="92" y="30" width="10" height="20" rx="1" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
              <line x1="97" y1="30" x2="97" y2="12" className={strokeColor} strokeWidth="1.5" />
              {simulationStep >= 3 && (
                <path d="M 97 12 Q 95 6 98 2" className="stroke-indigo-400 stroke-dashed fill-none animate-pulse" strokeWidth="1" />
              )}
              {/* Bitumen heated tank */}
              <rect x="68" y="62" width="22" height="15" rx="2" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
              <line x1="68" y1="67" x2="90" y2="67" className={structuralLineColor} strokeWidth="0.5" />
              {/* Piping */}
              <path d="M 79 62 L 79 56" className="stroke-indigo-500 fill-none" strokeWidth="1" />
            </svg>
          )}

          {productId === 'cement-storage-silos' && (
            <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-lg">
              {/* Huge central silo cylinder */}
              <rect x="46" y="15" width="28" height="48" rx="2" className={`${strokeColor} ${accentFillColor}`} strokeWidth="1.5" />
              {/* Bolted panel lines */}
              <line x1="46" y1="27" x2="74" y2="27" className={structuralLineColor} strokeWidth="0.5" />
              <line x1="46" y1="39" x2="74" y2="39" className={structuralLineColor} strokeWidth="0.5" />
              <line x1="46" y1="51" x2="74" y2="51" className={structuralLineColor} strokeWidth="0.5" />
              <line x1="60" y1="15" x2="60" y2="63" className={structuralLineColor} strokeWidth="0.5" />
              {/* Top Filter and valve */}
              <rect x="56" y="7" width="8" height="8" rx="0.5" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
              {/* Bottom cone */}
              <polygon points="46,63 60,78 74,63" className={`${strokeColor} ${fillColor}`} strokeWidth="1.5" />
              {/* Support structural legs */}
              <line x1="48" y1="63" x2="48" y2="92" className={strokeColor} strokeWidth="1.5" />
              <line x1="72" y1="63" x2="72" y2="92" className={strokeColor} strokeWidth="1.5" />
              <line x1="48" y1="74" x2="72" y2="74" className={structuralLineColor} strokeWidth="0.75" strokeDasharray="2,2" />
              {/* Screw conveyor discharging */}
              <g style={{ transform: 'rotate(-25deg)', transformOrigin: '60px 78px' }}>
                <rect x="60" y="75" width="28" height="5" rx="0.5" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
                <line x1="60" y1="77.5" x2="88" y2="77.5" className="stroke-orange-500 stroke-dashed" strokeWidth="0.75" />
              </g>
            </svg>
          )}

          {productId === 'twin-shaft-mixers' && (
            <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-lg">
              {/* Outer mixer casing shell */}
              <rect x="25" y="25" width="70" height="42" rx="4" className={`${strokeColor} ${accentFillColor}`} strokeWidth="1.5" />
              <rect x="29" y="29" width="62" height="34" rx="2" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
              {/* Dual horizontal shafts */}
              <g className={simulationStep === 4 ? "animate-pulse" : ""}>
                <line x1="20" y1="38" x2="100" y2="38" className={`${strokeColor} stroke-indigo-500`} strokeWidth="2.5" />
                <line x1="20" y1="54" x2="100" y2="54" className={`${strokeColor} stroke-indigo-500`} strokeWidth="2.5" />
                {/* Mixing paddles */}
                <rect x="35" y="32" width="3" height="12" className="fill-orange-500 stroke-none" />
                <rect x="52" y="32" width="3" height="12" className="fill-orange-500 stroke-none" />
                <rect x="69" y="32" width="3" height="12" className="fill-orange-500 stroke-none" />
                <rect x="86" y="32" width="3" height="12" className="fill-orange-500 stroke-none" />
                
                <rect x="42" y="48" width="3" height="12" className="fill-orange-500 stroke-none" />
                <rect x="59" y="48" width="3" height="12" className="fill-orange-500 stroke-none" />
                <rect x="76" y="48" width="3" height="12" className="fill-orange-500 stroke-none" />
              </g>
              {/* Left synchronization gearbox */}
              <rect x="12" y="32" width="13" height="30" rx="1" className={`${strokeColor} ${fillColor}`} strokeWidth="1.5" />
              <circle cx="18.5" cy="41" r="3" className={strokeColor} />
              <circle cx="18.5" cy="53" r="3" className={strokeColor} />
              {/* Central oil lub indicator */}
              <rect x="48" y="74" width="24" height="12" rx="1.5" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
              <text x="60" y="82" className="text-[5px] fill-emerald-500 font-mono text-center font-bold" textAnchor="middle">AUTO LUB</text>
            </svg>
          )}

          {productId === 'planetary-mixers' && (
            <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-lg">
              {/* Top gear motor vertically mounted */}
              <rect x="52" y="10" width="16" height="20" rx="1.5" className={`${strokeColor} ${fillColor}`} strokeWidth="1.5" />
              <line x1="52" y1="16" x2="68" y2="16" className={structuralLineColor} strokeWidth="0.5" />
              <line x1="52" y1="22" x2="68" y2="22" className={structuralLineColor} strokeWidth="0.5" />
              <line x1="52" y1="28" x2="68" y2="28" className={structuralLineColor} strokeWidth="0.5" />
              {/* Shaft connection */}
              <rect x="58" y="30" width="4" height="10" className={`${strokeColor} fill-slate-500`} strokeWidth="1" />
              {/* Giant cylindrical pan body */}
              <ellipse cx="60" cy="52" rx="38" ry="12" className={`${strokeColor} ${accentFillColor}`} strokeWidth="1.5" />
              <rect x="22" y="52" width="76" height="18" className={`${strokeColor} ${fillColor}`} strokeWidth="1" />
              <ellipse cx="60" cy="70" rx="38" ry="12" className={`${strokeColor} ${fillColor}`} strokeWidth="1.5" />
              {/* Outer scrapers inside the pan */}
              <line x1="30" y1="55" x2="30" y2="67" className="stroke-indigo-400 stroke-dashed" strokeWidth="1" />
              <line x1="90" y1="55" x2="90" y2="67" className="stroke-indigo-400 stroke-dashed" strokeWidth="1" />
              {/* Center star rotates */}
              {simulationStep === 4 && (
                <circle cx="60" cy="62" r="8" className="stroke-orange-500 fill-orange-500/10 animate-ping" strokeWidth="1" />
              )}
            </svg>
          )}

          {/* Fallback rendering for any newly added / custom products */}
          {!['concrete-batching-plant', 'wet-mix-macadam-plant', 'asphalt-drum-mix-plant', 'cement-storage-silos', 'twin-shaft-mixers', 'planetary-mixers'].includes(productId) && (
            <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-lg">
              <rect x="30" y="25" width="60" height="40" rx="3" className={`${strokeColor} ${accentFillColor}`} strokeWidth="1.5" />
              <polygon points="30,65 40,82 80,82 90,65" className={`${strokeColor} ${fillColor}`} strokeWidth="1.5" />
              <line x1="60" y1="25" x2="60" y2="82" className={structuralLineColor} strokeWidth="0.5" />
              <line x1="30" y1="45" x2="90" y2="45" className={structuralLineColor} strokeWidth="0.5" />
              <circle cx="60" cy="45" r="8" className="stroke-indigo-400 fill-indigo-400/10 animate-pulse" strokeWidth="1" />
            </svg>
          )}
        </div>

        {/* Dynamic coordinate overlay in corners */}
        <div className="absolute top-3 left-3 flex flex-col space-y-0.5 font-mono text-[9px] text-slate-400 dark:text-slate-500">
          <span>X: {cosAngle.toFixed(3)}</span>
          <span>Y: {sinAngle.toFixed(3)}</span>
          <span>Z: {(0.25).toFixed(3)}</span>
        </div>

        <div className="absolute top-3 right-3 flex items-center space-x-1 font-mono text-[9px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/30">
          <Cpu className="h-3 w-3 text-indigo-500 animate-pulse" />
          <span>SYS STATE: {simulationActive ? 'CALCULATING' : 'IDLE'}</span>
        </div>

        {/* Hotspots layer plotted dynamically over the visual */}
        {hotspots.map((spot) => (
          <button
            key={spot.id}
            onClick={() => setSelectedHotspot(selectedHotspot === spot.id ? null : spot.id)}
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-5 w-5 rounded-full cursor-pointer transition-all duration-300 z-10 ${
              selectedHotspot === spot.id 
                ? 'bg-amber-500 text-white scale-110 shadow-lg shadow-amber-500/50' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
            }`}
          >
            <span className="absolute inset-0 rounded-full bg-inherit animate-ping opacity-35"></span>
            <span className="text-[9px] font-black">{spot.id === selectedHotspot ? '×' : '+'}</span>
            
            {/* Popover overlay */}
            {selectedHotspot === spot.id && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-48 sm:w-56 p-3 rounded-xl bg-slate-900 text-white shadow-xl text-left border border-slate-800 pointer-events-auto z-20 space-y-1">
                <h6 className="font-display text-xs font-bold text-amber-400">
                  {spot.label}
                </h6>
                <p className="text-[10px] text-slate-300 leading-normal font-sans font-medium">
                  {spot.desc}
                </p>
              </div>
            )}
          </button>
        ))}

        {/* Drag Hint overlay */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-slate-400 select-none pointer-events-none uppercase tracking-widest font-mono">
          ← Hold & Slide to Rotate 360° →
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-4 rounded-3xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/40 overflow-hidden" ref={containerRef}>
      {/* Viewer Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/50 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-slate-800 dark:text-white">
              360° Engineering Sandbox
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Interactive 3D model simulation & diagnostic tests
            </p>
          </div>
        </div>

        {/* Control Switches */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${
              wireframeMode 
                ? 'bg-cyan-500 text-white shadow-xs' 
                : 'bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300/50'
            }`}
          >
            {wireframeMode ? 'CAD Wireframe' : 'Solid Shell'}
          </button>
        </div>
      </div>

      {/* Primary 3D Space */}
      <div 
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="h-[280px] sm:h-[340px] relative cursor-grab active:cursor-grabbing select-none"
      >
        {renderInteractiveMachineSVG()}
      </div>

      {/* Viewer Footer: Orbit Controls & Active Simulation Dashboard */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-800 space-y-4 bg-slate-100/50 dark:bg-slate-950/20">
        {/* Orbit State controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800/80 transition-colors shadow-xs"
              title={isRotating ? "Pause Autoplay Orbit" : "Play Autoplay Orbit"}
            >
              {isRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setRotation(35)}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800/80 transition-colors shadow-xs"
              title="Reset View Orientation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <span className="text-[10px] font-mono text-slate-400">
              Angle: {Math.round(rotation)}°
            </span>
          </div>

          <button
            onClick={runSimulation}
            disabled={simulationActive}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-xs ${
              simulationActive 
                ? 'bg-amber-100 text-amber-700 border border-amber-200 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
            }`}
          >
            <Activity className={`h-4 w-4 ${simulationActive ? 'animate-bounce' : ''}`} />
            <span>{simulationActive ? 'Running Batch Cycle...' : 'Simulate Operational Cycle'}</span>
          </button>
        </div>

        {/* Live diagnostics simulation console logs */}
        {(simulationActive || simulationLogs.length > 0) && (
          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-[10px] leading-relaxed text-slate-300 space-y-1 max-h-[110px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
              <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">
                Telemetry Log Diagnostics
              </span>
              <span className="text-[8px] text-emerald-400 font-bold uppercase animate-pulse">
                • ONLINE
              </span>
            </div>
            {simulationLogs.map((log, index) => (
              <div key={index} className="flex items-start space-x-1">
                <span className="text-indigo-500 shrink-0 select-none">&gt;</span>
                <p className="text-slate-300">{log}</p>
              </div>
            ))}
            {simulationActive && (
              <div className="text-[9px] text-amber-400 font-bold animate-pulse pt-1">
                Processing cycle calculations... [STAGE {simulationStep}/5]
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
