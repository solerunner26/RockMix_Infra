import React from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { 
  ShieldCheck, 
  Settings, 
  Award, 
  Users,
  Layers,
  Route,
  Box,
  ArrowUpRight,
  Database,
  RefreshCw,
  Compass,
  ArrowRightLeft,
  Wrench,
  Globe,
  TrendingUp
} from 'lucide-react';

export default function AboutUsSection() {
  const { content } = useSiteContent();

  if (!content.about.showSection) return null;

  const teamFunctions = [
    {
      title: 'Sales & Customer Relations',
      desc: 'A client-focused team that understands diverse project requirements and provides personalized solutions.',
      icon: Users,
    },
    {
      title: 'Manufacturing & Engineering',
      desc: 'Skilled engineers and technicians who leverage advanced technology and precision processes to produce reliable equipment.',
      icon: Settings,
    },
    {
      title: 'Quality & Testing',
      desc: 'Experts who enforce stringent quality checks and rigorous testing protocols to guarantee performance and safety.',
      icon: Award,
    },
    {
      title: 'Logistics & Supply Chain',
      desc: 'Professionals ensuring timely delivery and seamless coordination across domestic and international markets.',
      icon: Compass,
    },
    {
      title: 'Installation & Calibration',
      desc: 'Specialists who oversee smooth setup and precise calibration of equipment at project sites.',
      icon: Wrench,
    },
    {
      title: 'Training & Knowledge Transfer',
      desc: 'Engineers who empower plant operators with the skills to operate and maintain equipment effectively.',
      icon: ArrowRightLeft,
    },
    {
      title: 'After-Sales Support',
      desc: 'A dedicated service team providing ongoing assistance, spare parts, and technical support to maximize equipment lifespan.',
      icon: ShieldCheck,
    },
  ];

  const offerings = [
    {
      title: 'Concrete Batching Plants',
      desc: 'Mobile, Stationary, Compact Mobile, and foundation-free models.',
      icon: Layers,
      bgColor: 'bg-indigo-50/70 text-indigo-700 border-indigo-100/50 dark:bg-indigo-950/35 dark:text-indigo-300 dark:border-indigo-900/30'
    },
    {
      title: 'Wet Mix Macadam Plants',
      desc: 'Purpose-built for road construction projects.',
      icon: Route,
      bgColor: 'bg-indigo-50/70 text-indigo-700 border-indigo-100/50 dark:bg-indigo-950/35 dark:text-indigo-300 dark:border-indigo-900/30'
    },
    {
      title: 'Concrete Precast Moulds',
      desc: 'Including Tetra Pod Moulds, U-Drain Moulds, Noise Barrier Moulds, and more.',
      icon: Box,
      bgColor: 'bg-indigo-50/70 text-indigo-700 border-indigo-100/50 dark:bg-indigo-950/35 dark:text-indigo-300 dark:border-indigo-900/30'
    },
    {
      title: 'Stationary Concrete Pumps',
      desc: 'Designed for vertical and horizontal pumping, ensuring a steady and consistent concrete flow.',
      icon: ArrowUpRight,
      bgColor: 'bg-indigo-50/70 text-indigo-700 border-indigo-100/50 dark:bg-indigo-950/35 dark:text-indigo-300 dark:border-indigo-900/30'
    },
    {
      title: 'Cement Silos',
      desc: 'Available in vertical and horizontal configurations, with welded and bolted options.',
      icon: Database,
      bgColor: 'bg-indigo-50/70 text-indigo-700 border-indigo-100/50 dark:bg-indigo-950/35 dark:text-indigo-300 dark:border-indigo-900/30'
    },
    {
      title: 'Twin Shaft Mixers',
      desc: 'Customizable capacities to suit diverse applications.',
      icon: RefreshCw,
      bgColor: 'bg-indigo-50/70 text-indigo-700 border-indigo-100/50 dark:bg-indigo-950/35 dark:text-indigo-300 dark:border-indigo-900/30'
    },
    {
      title: 'Planetary Mixers',
      desc: 'Flexible capacities designed for specialized mixing needs.',
      icon: Compass,
      bgColor: 'bg-indigo-50/70 text-indigo-700 border-indigo-100/50 dark:bg-indigo-950/35 dark:text-indigo-300 dark:border-indigo-900/30'
    },
    {
      title: 'Conveyors',
      desc: 'Rotary and radial conveyor systems for efficient material handling.',
      icon: ArrowRightLeft,
      bgColor: 'bg-indigo-50/70 text-indigo-700 border-indigo-100/50 dark:bg-indigo-950/35 dark:text-indigo-300 dark:border-indigo-900/30'
    },
    {
      title: 'Spare Parts',
      desc: 'Genuine spares for all our products, ensuring reliability and long-term support.',
      icon: Wrench,
      bgColor: 'bg-indigo-50/70 text-indigo-700 border-indigo-100/50 dark:bg-indigo-950/35 dark:text-indigo-300 dark:border-indigo-900/30'
    }
  ];

  return (
    <section id="about-us-section" className="w-full relative pt-[140px] md:pt-[160px] pb-24 px-4 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/about.webp" 
          alt="About Us Background" 
          className="w-full h-full object-cover object-top"
        />
        {/* Transparent adaptive overlays allowing high image visibility while maintaining perfect text readability */}
        <div className="absolute inset-0 bg-white/35 dark:bg-slate-950/55 transition-colors duration-300"></div>
      </div>

      {/* Background blur accents */}
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 rounded-full bg-indigo-50/30 blur-3xl z-0 pointer-events-none dark:opacity-10"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-96 h-96 rounded-full bg-indigo-50/30 blur-3xl z-0 pointer-events-none dark:opacity-10"></div>

      {/* Main Content Wrapper */}
      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Header - Experts With Experience */}
        <div className="text-center max-w-4xl mx-auto space-y-4 p-6 sm:p-8 rounded-3xl bg-white/75 dark:bg-slate-900/75 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md shadow-md">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {content.about.subtitle}
          </h2>
          <div className="font-sans text-slate-700 dark:text-slate-200 leading-relaxed text-sm sm:text-base max-w-3xl mx-auto space-y-4 text-justify">
            {content.about.description1 && <p>{content.about.description1}</p>}
            {content.about.description2 && <p>{content.about.description2}</p>}
          </div>
        </div>

      {/* Our People - The Driving Force Behind Excellence */}
      <div className="space-y-8" id="our-people-excellence">
        <div className="border-b border-slate-200/60 dark:border-slate-800 pb-4 text-center max-w-2xl mx-auto p-4 sm:p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/30 dark:border-slate-800/30 shadow-sm">
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Our People – The Driving Force Behind Excellence
          </h3>
          <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm mt-1">
            What truly sets us apart is our team of highly skilled and experienced professionals. Their collective experience ensures that we provide complete, custom end-to-end solutions.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamFunctions.map((team, idx) => {
            const Icon = team.icon;
            return (
              <div 
                key={idx}
                className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/60 p-5 space-y-3.5 shadow-sm hover:shadow-md hover:bg-white/90 dark:hover:bg-slate-900/90 backdrop-blur-md transition-all hover:scale-[1.01]"
              >
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/40 inline-block shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-display text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 leading-snug">
                  {team.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {team.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manufacturing Excellence & Global Reach */}
      <div className="grid md:grid-cols-2 gap-8 pt-6" id="manufacturing-excellence-global">
        <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/60 p-8 space-y-4 shadow-sm hover:shadow-md backdrop-blur-md transition-all">
          <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="h-6 w-6" />
            <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Manufacturing Excellence
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed text-justify">
            As a manufacturer, we ensure that every product is meticulously engineered with attention to detail, using high-grade raw materials and state-of-the-art technology. Our robust manufacturing processes are reinforced by stringent quality checks, guaranteeing unmatched performance, durability, and consistency across all our equipment.
          </p>
        </div>

        <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/60 p-8 space-y-4 shadow-sm hover:shadow-md backdrop-blur-md transition-all">
          <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400">
            <Globe className="h-6 w-6" />
            <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Global Reach
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed text-justify">
            As an exporter, we extend our expertise to the global market, delivering infrastructure solutions to clients worldwide. By combining technical excellence with customer-centric service, we continue to build long-term partnerships and contribute to the advancement of infrastructure development across borders.
          </p>
        </div>
      </div>

      {/* Our Offerings Grid */}
      <div className="space-y-8" id="our-offerings-grid-section">
        <div className="border-b border-slate-200/60 dark:border-slate-800 pb-4 p-4 sm:p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/30 dark:border-slate-800/30 shadow-sm">
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Our Offerings
          </h3>
          <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm mt-1">
            A comprehensive, high-grade line of mixing bases and modular assemblies built to sustain high production cycles under rugged operations.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerings.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white/80 dark:bg-slate-900/80 p-6 space-y-4 shadow-sm border border-slate-200/50 dark:border-slate-800 hover:bg-white/90 dark:hover:bg-slate-900/90 backdrop-blur-md hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:scale-[1.01]"
              >
                <div className={`p-2.5 rounded-xl inline-block border ${item.bgColor}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <h4 className="font-display text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </section>
  );
}
