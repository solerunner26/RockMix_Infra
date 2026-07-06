import { Product, PastProject, NetworkLocation } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'rockmix-mobile-rmp',
    name: 'Rockmix Mobile Concrete Batching Plant (RMP Series)',
    shortDesc: 'Highly versatile, portable, wheel-mounted batching plants for rapid on-site setup.',
    description: 'Our mobile concrete batching plants are built on a heavy-duty single chassis with integrated wheel-axles and a towing kingpin, allowing rapid relocation between remote highway, bridge, and infrastructure projects. Engineered for swift crane-free erection and maximum throughput with minimal civil preparation.',
    category: 'Concrete Batching Plants',
    accentColor: 'indigo',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40',
    image: '/p1.webp',
    brochure: '/prd1/rb1.pdf',
    additionalImages: [
      '/prd1/p12.webp',
      '/prd1/p13.webp',
      '/prd1/p14.webp',
      '/prd1/p15.webp'
    ],
    features: [
      'Production capacities available: 30, 45, and 60 m³/hr options',
      'Integrated heavy-duty single-chassis wheel-mounted trailer with kingpin',
      'Pre-wired, pre-piped, and factory-tested for plug-and-play field setup',
      'Intuitive PLC control panel with SCADA interface and manual backup switches'
    ],
    specifications: [
      { label: 'Capacity Range', value: '30 m³/hr to 60 m³/hr' },
      { label: 'Mixer Type', value: 'High-Efficiency Twin Shaft or Planetary' },
      { label: 'Aggregate Bins', value: '2 to 4 compartments with adjustable gates' },
      { label: 'Control System', value: 'PLC with multi-language HMI touchscreen' },
      { label: 'Erection Time', value: 'Less than 24 hours under standard conditions' },
      { label: 'Water Weighing', value: 'Precision load cells (± 1% accuracy)' }
    ],
    highlights: [
      'The ultimate mobile solution for linear road projects, canal systems, and short-term casting yards.'
    ]
  },
  {
    id: 'rockmix-mini-mobile-rmp',
    name: 'Rockmix Mini Mobile Concrete Batching Plant (RMP Series)',
    shortDesc: 'Ultra-compact trailer-mounted concrete plants designed for rural and space-restricted urban projects.',
    description: 'The Mini Mobile Concrete Batching Plant is engineered for agile, localized batching where space constraints prevent the use of standard heavy plants. Features a low aggregate feeding height for easy bucket loading, combined with high-precision digital load cells for consistent, reliable mixes.',
    category: 'Concrete Batching Plants',
    accentColor: 'indigo',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40',
    image: '/p2.webp',
    brochure: '/prd2/rb2.pdf',
    additionalImages: [
      '/prd2/p22.webp',
      '/prd2/p23.webp',
      '/prd2/p24.webp'
    ],
    features: [
      'Designed for tight, congested urban spaces and hard-to-reach rural regions',
      'Optimized low aggregate feeding height for convenient loading via loader or manual labor',
      'Fitted with durable reversible drum mixer or vertical pan mixer systems',
      'Extremely quick setup with zero civil foundation work required on site'
    ],
    specifications: [
      { label: 'Capacity Range', value: '15 m³/hr to 25 m³/hr' },
      { label: 'Mixer Capacity', value: '0.5 m³ dry-fill volume per batch' },
      { label: 'Aggregate Feed', value: 'Low-height batching hoppers' },
      { label: 'Mobility', value: 'Heavy-duty dual axles with pneumatic tires' },
      { label: 'Total Weight', value: 'Compact structure for easy local towing' },
      { label: 'Power Options', value: 'Electric motor or optional onboard diesel generator' }
    ],
    highlights: [
      'Perfect for urban trenching, pipeline laying, telecom tower bases, and rural pathways.'
    ]
  },
  {
    id: 'rockmix-wetmix-rwmm',
    name: 'Rockmix Wetmix Macadam Plant (RWMM Series)',
    shortDesc: 'Continuous-mixing aggregate plants for highway sub-base and base course layers.',
    description: 'Specifically engineered for high-volume laying of sub-base, base, and cement-stabilized mixture layers on expressways, runways, and container terminals. Provides highly uniform blending of multi-grade aggregates, binding agents, and water in a robust continuous double-shaft pugmill mixer.',
    category: 'Paving Base Plants',
    accentColor: 'emerald',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40',
    image: '/p3.webp',
    brochure: '/prd3/rb3.pdf',
    additionalImages: [
      '/prd3/p32.webp',
      '/prd3/p33.webp',
      '/prd3/p34.webp',
      '/prd3/p35.webp'
    ],
    features: [
      'Massive output capabilities ranging from 100 TPH to 250 TPH (Tons Per Hour)',
      'Highly rigid dual-shaft pugmill with replaceable Hi-Chrome wear plates and alloy paddles',
      'Four-compartment cold aggregate feeder bins with integrated variable speed drives (VFD)',
      'Anti-segregation discharge surge hopper with hydraulic slide gates for direct truck loading'
    ],
    specifications: [
      { label: 'Output Capacity', value: '100 TPH to 250 TPH' },
      { label: 'Pugmill Drive', value: 'Heavy-duty dual-motor synchronization' },
      { label: 'Feeder Bins', value: '4 bins with fine-adjustment aggregate discharge gates' },
      { label: 'Water Tank', value: 'Integrated 4000L to 8000L capacity storage' },
      { label: 'Discharge Conveyor', value: 'Deep-groove Chevron belt for high aggregate volume' },
      { label: 'Screening Deck', value: 'Vibratory screen for rejecting oversized aggregates' }
    ],
    highlights: [
      'Constant-rate automatic water spraying system synchronizes perfectly with material mass-flow rates.'
    ]
  },
  {
    id: 'rockmix-compact-rcp',
    name: 'Rockmix Compact Concrete Batching Plant (RCP Series)',
    shortDesc: 'Vertical skip-hoist batching plants with a highly optimized, small footprint.',
    description: 'Designed for space-restricted concrete manufacturing yards, commercial ready-mix plants, and precast factories in dense urban centers. Utilizes a high-speed vertical skip-hoist aggregate delivery system to eliminate long conveyor belts, delivering optimal layout efficiency.',
    category: 'Concrete Batching Plants',
    accentColor: 'indigo',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40',
    image: '/p4.webp',
    brochure: '/prd4/rb4.pdf',
    additionalImages: [
      '/prd4/p41.webp',
      '/prd4/p42.webp'
    ],
    features: [
      'Vertical skip-hoist bucket feed reduces total installation footprint by up to 45%',
      'Equipped with durable, high-shear Twin Shaft mixers for complete homogeneity',
      'Inline aggregate storage bins with independent load cells for simultaneous weighing',
      'Modular pre-assembled sub-structures permit fast bolt-together site erection'
    ],
    specifications: [
      { label: 'Capacity Range', value: '30 m³/hr to 60 m³/hr' },
      { label: 'Mixer Volume', value: '0.5 m³ to 1.0 m³ compacted output per batch' },
      { label: 'Aggregate Bins', value: '3 or 4 compartment inline structure' },
      { label: 'Batch Cycle Time', value: '45 to 60 seconds average' },
      { label: 'Total Footprint', value: 'Extremely compact workspace requirement' },
      { label: 'Maintenance Access', value: 'Galvanized walking platforms with complete safety railings' }
    ],
    highlights: [
      'Maximizes real estate efficiency for precast block facilities and urban ready-mix hubs.'
    ]
  },
  {
    id: 'rockmix-stationary-rsp',
    name: 'Rockmix Stationary Concrete Batching Plant (RSP Series)',
    shortDesc: 'Heavy-duty high-output batching plants built for continuous mega-infrastructure supply.',
    description: 'The powerhouse of the heavy construction sector, our Stationary Concrete Plants are custom-designed for sustained, high-output production on major dams, deep-sea bridges, metro systems, and commercial ready-mix centers. Built on massive structural steel frames with inline aggregate bunkers.',
    category: 'Concrete Batching Plants',
    accentColor: 'indigo',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40',
    image: '/p5.webp',
    brochure: '/prd5/rb5.pdf',
    additionalImages: [
      '/prd5/p51.webp',
      '/prd5/p52.webp'
    ],
    features: [
      'Continuous production capacities from 60 m³/hr up to 120 m³/hr',
      'Large-volume inline storage bunkers with heavy-duty radial pneumatic gates',
      'Advanced computerized SCADA control center with real-time material logging and reports',
      'High-capacity dual-shaft mixer with automatic multi-nozzle high-pressure water washing'
    ],
    specifications: [
      { label: 'Capacity Range', value: '60 m³/hr to 120 m³/hr' },
      { label: 'Mixer Batch Output', value: '1.5 m³ to 3.0 m³ compacted per cycle' },
      { label: 'Inline Bins count', value: '4 to 6 compartments' },
      { label: 'Cement Weighing', value: 'Separate independent scale with pneumatic aeration' },
      { label: 'SCADA Software', value: 'Real-time production metrics with cloud reporting' },
      { label: 'Structural Steel', value: 'Hot-dip galvanized heavy-gauge framework' }
    ],
    highlights: [
      'Engineered to operate 24/7 under harsh conditions with zero aggregate bridging or cement hydration delays.'
    ]
  },
  {
    id: 'rockmix-compact-mobility-rcmp',
    name: 'Rockmix Compact Mobility Concrete Batching Plant (RCMP Series)',
    shortDesc: 'Modular container-friendly concrete batching plants combining high capacity with global shipping ease.',
    description: 'A revolutionary hybrid design that matches the robust output of stationary plants while fitting entirely inside standard 40-foot shipping containers. Features quick-bolting structural legs and foldable aggregate storage hopper gates for ultra-fast relocation and minimal setup cost.',
    category: 'Concrete Batching Plants',
    accentColor: 'indigo',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40',
    image: '/p6.webp',
    brochure: '/prd6/rb6.pdf',
    additionalImages: [
      '/prd6/p61.webp',
      '/prd6/p62.webp'
    ],
    features: [
      'Modular sections optimize container packing, saving thousands in global transport costs',
      'Pre-wired and pre-plumbed assembly with integrated socket plugs for swift commissioning',
      'Equipped with advanced multi-zone twin-shaft high-shear mixers',
      'Structural layout supports direct ground installation with basic level-compacting pads'
    ],
    specifications: [
      { label: 'Capacity Range', value: '45 m³/hr to 90 m³/hr' },
      { label: 'Shipping Container', value: 'Fully fits inside 40ft High Cube containers' },
      { label: 'Installation Type', value: 'Quick-erect fold-out legs with bolt-on structures' },
      { label: 'Water Connection', value: 'Integrated pressurized pump block with digital flow meter' },
      { label: 'Total Installed Power', value: '75 kW to 110 kW average' },
      { label: 'Weighing Sensors', value: 'Multi-directional tension load cells' }
    ],
    highlights: [
      'Designed for international contractors looking to shift operations globally with minimal logistic delays.'
    ]
  },
  {
    id: 'stationary-concrete-pump',
    name: 'Stationary Concrete Pump',
    shortDesc: 'High-pressure stationary pumping systems for reliable horizontal and vertical concrete conveyance.',
    description: 'Engineered for conveying concrete mixtures over massive vertical heights or long horizontal distances. Ideal for high-rise buildings, railway tunnels, flyover foundations, and deep shafts. Built with high-stroke pumping cylinders and robust S-valve technology.',
    category: 'Concrete Pumps',
    accentColor: 'blue',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40',
    image: '/p7.webp',
    features: [
      'Heavy-duty hydraulic circuits with smooth-acting S-valve transfer system',
      'Dual power options: fuel-efficient turbocharged diesel or high-efficiency electric motors',
      'Integrated auto-lubrication system for all critical seal rings and mixing arms',
      'Wireless remote control unit for flexible, secure operator positioning'
    ],
    specifications: [
      { label: 'Maximum Pressure', value: 'Max 120 Bar on concrete' },
      { label: 'Max Delivery Range', value: 'Up to 350m vertical / 800m horizontal' },
      { label: 'Cylinder Stroke', value: '1400 mm to 2100 mm long-stroke design' },
      { label: 'Maximum Aggregate', value: 'Handles aggregate sizes up to 40 mm' },
      { label: 'Hopper Capacity', value: '600 Liters with high-strength agitator' },
      { label: 'Hydraulic Pumps', value: 'Rexroth variable displacement axial piston pumps' }
    ],
    highlights: [
      'High-pressure dual-wall cylinders and heavy-duty wear rings guarantee maximum service life during demanding vertical concrete climbs.'
    ]
  }
];

export const PROJECTS: PastProject[] = [
  {
    id: 'delhi-mumbai-expressway',
    title: 'Delhi-Mumbai Expressway Sub-Base',
    location: 'Rajasthan Sector, India',
    category: 'Expressway & Highway Infrastructure',
    year: '2024-2025',
    machineryUsed: ['Wet Mix Macadam Plant (200 TPH)', 'Concrete Batching Plant (90 m³/hr)'],
    description: 'Supplied and commissioned high-capacity continuous Wet Mix Macadam Plants along with stationary batching units for the construction of Rajasthan sector of the 8-lane expressway. The equipment ran 18 hours daily, producing over 3,000,000 tons of graded sub-base aggregate mixture under extreme ambient temperatures.',
    metrics: [
      { label: 'Total Output Paved', value: '3.2M Tons' },
      { label: 'Avg Daily Run-time', value: '18 Hours' },
      { label: 'Mixer Blade Lifespan', value: '180,000 Tons' },
      { label: 'Unscheduled Downtime', value: '< 0.5%' }
    ]
  },
  {
    id: 'mumbai-metro-rail',
    title: 'Mumbai Metro Line 3 Precast Segment Yard',
    location: 'Wadala Cast Yard, Mumbai',
    category: 'Metro Rail & Transit Projects',
    year: '2023-2024',
    machineryUsed: ['Concrete Batching Plant (60 m³/hr)', 'Concrete Precast Moulds', 'Planetary Mixers'],
    description: 'Supplied high-precision heavy-duty steel segment moulds and counter-current Planetary Mixers for Wadala Precast Segment Yard. Custom planetary stars ensured perfect dye and fiber dispersion in the M60 grade self-compacting concrete, maintaining zero dimensional variation across all precast segment segments.',
    metrics: [
      { label: 'Precast Blocks Cast', value: '12,400 Segments' },
      { label: 'Concrete Grade', value: 'M60 Self-Compacted' },
      { label: 'Dimensional Tolerance', value: '± 0.8 mm' },
      { label: 'Batch Mixing Cycle', value: '45 Seconds' }
    ]
  },
  {
    id: 'chennai-coastal-viaduct',
    title: 'Chennai Coastal Bypass Viaduct Construction',
    location: 'Chennai South Bypass, Tamil Nadu',
    category: 'Marine Bridges & Overpasses',
    year: '2025',
    machineryUsed: ['Concrete Batching Plant (120 m³/hr)', 'Twin Shaft Mixers', 'Cement Storage Silos (150 Ton)'],
    description: 'Installed a massive 120 m³/hr stationary concrete plant on the coastal fringe. Integrated with modular 150-ton bolted storage silos with advanced desiccant filtration and twin-shaft high-shear mixers to handle high-performance anti-corrosive marine grade concrete.',
    metrics: [
      { label: 'Continuous Output', value: '120 m³/hr' },
      { label: 'Silo Capacity Active', value: '600 Tons' },
      { label: 'Total Volume Cast', value: '180,000 m³' },
      { label: 'Silica Fume Batching', value: '100% Automated' }
    ]
  },
  {
    id: 'bangalore-it-park',
    title: 'Whitefield Smart IT Hub Foundation',
    location: 'Whitefield Phase 2, Bengaluru',
    category: 'Commercial Mega-Structures',
    year: '2024',
    machineryUsed: ['Concrete Batching Plant (90 m³/hr)', 'Twin Shaft Mixers', 'Cement Storage Silos (100 Ton)'],
    description: 'Managed rapid foundation supply for multiple tech-park towers. Our Twin Shaft Mixers worked continuously to provide high-slump foundation concrete for mega raft pours, completing a massive single-stretch pour of 4,200 m³ of concrete in a record 36-hour period.',
    metrics: [
      { label: 'Raft Foundation Pour', value: '4,200 m³' },
      { label: 'Continuous Pour Duration', value: '36 Hours' },
      { label: 'Avg Batch Quality Ratio', value: '99.8%' },
      { label: 'Batching Cycle Rate', value: '75 batches/hr' }
    ]
  }
];

export const NETWORK_LOCATIONS: NetworkLocation[] = [
  {
    id: 'm-plant-1',
    city: 'Ahmedabad',
    state: 'Gujarat',
    type: 'Manufacturing Unit',
    address: 'Phase-IV, GIDC Industrial Estate, Vatva, Ahmedabad - 382445, Gujarat, India'
  },
  {
    id: 'm-plant-2',
    city: 'Mehsana',
    state: 'Gujarat',
    type: 'Manufacturing Unit',
    address: 'Dediyasan GIDC Phase-II, Mehsana - 384002, Gujarat, India'
  },
  {
    id: 'corp-off',
    city: 'Ahmedabad',
    state: 'Gujarat',
    type: 'Corporate Office',
    address: 'Rockmix House, Near Iscon Circle, SG Highway, Ahmedabad - 380054, Gujarat, India'
  },
  {
    id: 'hub-north',
    city: 'Delhi NCR',
    state: 'Haryana',
    type: 'Service Hub',
    address: 'Sector 37, Pace City II, Gurugram - 122001, Haryana, India'
  },
  {
    id: 'hub-south',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'Service Hub',
    address: 'Bommasandra Industrial Area, Hosur Road, Bengaluru - 560099, Karnataka, India'
  },
  {
    id: 'hub-east',
    city: 'Kolkata',
    state: 'West Bengal',
    type: 'Service Hub',
    address: 'Salt Lake Sector V, Electronic Complex, Kolkata - 700091, West Bengal, India'
  },
  {
    id: 'dealer-west-1',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'Dealer Outlet',
    address: 'Commercial Plaza, Andheri East, Mumbai - 400069, Maharashtra, India'
  },
  {
    id: 'dealer-south-1',
    city: 'Hyderabad',
    state: 'Telangana',
    type: 'Dealer Outlet',
    address: 'Balaji Towers, Kukatpally, Hyderabad - 500072, Telangana, India'
  }
];
