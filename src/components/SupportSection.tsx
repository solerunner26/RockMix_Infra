import React from 'react';
import { Headphones, Shield, PiggyBank, Handshake, Phone, Mail } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

const PILLAR_ICON_MAP: Record<string, React.ComponentType<any>> = {
  Headphones,
  Shield,
  PiggyBank,
  Handshake
};

export default function SupportSection() {
  const { content } = useSiteContent();

  if (!content.support.showSection) return null;

  const pillarsList = content.support.pillars || [
    {
      title: 'Technical Assistance',
      desc: 'Our engineering experts provide detailed consults to analyze aggregate specifications, output demands, and site parameters, ensuring you acquire the precise machinery configurations.',
      icon: 'Headphones',
      color: 'indigo'
    },
    {
      title: 'On-Site Support',
      desc: 'We stand beside you with experienced engineers. From complete concrete foundation blueprints, electrical line diagrams, mechanical erection, wet-mix calibration, and operator training.',
      icon: 'Shield',
      color: 'emerald'
    },
    {
      title: 'Financial Flexibility',
      desc: 'We recognize project cash-flow cycles. Our pricing is highly competitive, and we offer modular scaling choices where auxiliary feeders or silos can be added later as project scope climbs.',
      icon: 'PiggyBank',
      color: 'amber'
    },
    {
      title: 'Long-Term Partnership',
      desc: 'Commitment that goes miles beyond delivery. We guarantee immediate dispatch of critical wearing spares (anti-wear liners, mixing paddles, valves) and lifetime access to software updates for PLC panels.',
      icon: 'Handshake',
      color: 'blue'
    }
  ];

  const helplinesList = content.support.helplines || [
    {
      title: 'Service Support',
      phone: '+91 99798 57329',
      email: 'service@rockmixgroup.com',
      type: 'service'
    },
    {
      title: 'Spare Parts Support',
      phone: '+91 99798 57329',
      email: 'spares@rockmixgroup.com',
      type: 'spares'
    }
  ];

  return (
    <section id="support-section" className="pt-[140px] md:pt-[160px] pb-24 px-4 max-w-7xl mx-auto space-y-20 relative">
      <div className="absolute top-[20%] right-[15%] w-72 h-72 rounded-full bg-indigo-50/40 blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {content.support.title}
        </h2>
        <p className="font-sans text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base italic font-medium">
          “{content.support.description}”
        </p>
      </div>

      {/* 4 Support Pillars bento block */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" id="support-pillars-grid">
        {pillarsList.map((pillar, idx) => {
          const Icon = PILLAR_ICON_MAP[pillar.icon] || Headphones;
          return (
            <div 
              key={idx}
              className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/60 p-6 space-y-4 shadow-sm hover:shadow-md hover:bg-white/90 dark:hover:bg-slate-900/90 backdrop-blur-md transition-all hover:scale-[1.01]"
            >
              <div className={`p-2.5 rounded-xl bg-${pillar.color}-50 dark:bg-${pillar.color}-950/40 text-${pillar.color}-600 dark:text-${pillar.color}-400 border border-${pillar.color}-100/50 dark:border-${pillar.color}-900/40 inline-block shadow-sm`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 leading-snug">
                {pillar.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                {pillar.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Direct Service & Spares Helpline */}
      <div className="pt-12 border-t border-slate-100 dark:border-slate-800 max-w-4xl mx-auto space-y-10" id="support-contact-cards">
        <div className="text-center space-y-2">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Direct Support Helplines
          </h3>
          <p className="font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Get in touch with our specialized support departments for immediate assistance.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {helplinesList.map((help, idx) => {
            const isService = help.type === 'service';
            return (
              <div 
                key={idx}
                className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-8 border border-slate-200/50 dark:border-slate-800/60 shadow-sm hover:shadow-md hover:bg-white/90 dark:hover:bg-slate-900/90 backdrop-blur-md transition-all flex flex-col items-center text-center space-y-4 hover:scale-[1.01]"
              >
                {/* Dark Blue Icon container */}
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/40 flex items-center justify-center shadow-sm">
                  {isService ? (
                    /* Wrench SVG */
                    <svg 
                      className="h-7 w-7 text-indigo-600 dark:text-indigo-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth="2.2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                  ) : (
                    /* Overlapping Gears SVG */
                    <svg 
                      className="h-7 w-7 text-indigo-600 dark:text-indigo-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <circle cx="9.5" cy="14.5" r="3.5" />
                      <path d="M9.5 10v1M9.5 18v1M5 14.5h1M14 14.5h1M6.3 11.3l.7.7M12.5 17.5l.7.7M6.3 17.7l.7-.7M12.5 11.3l.7-.7" />
                      <circle cx="15.5" cy="8.5" r="2.5" />
                      <path d="M15.5 5v1M15.5 11v1M12 8.5h1M19 8.5h1" />
                    </svg>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-display text-base font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                  {help.title}
                </h4>

                {/* Contact Details */}
                <div className="space-y-2.5 font-sans text-sm text-slate-700 dark:text-slate-300">
                  <a 
                    href={`tel:${help.phone.replace(/\s+/g, '')}`} 
                    className="flex items-center justify-center space-x-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                  >
                    <Phone className="h-4 w-4 text-indigo-600 dark:text-indigo-400 fill-indigo-600/10 dark:fill-indigo-400/10 transition-transform group-hover:scale-110" />
                    <span className="font-bold tracking-wide text-slate-800 dark:text-slate-200">{help.phone}</span>
                  </a>

                  <a 
                    href={`mailto:${help.email}`} 
                    className="flex items-center justify-center space-x-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                  >
                    <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400 fill-indigo-600/10 dark:fill-indigo-400/10 transition-transform group-hover:scale-110" />
                    <span className="font-medium underline underline-offset-4 decoration-slate-200 dark:decoration-slate-800 hover:decoration-indigo-500 break-all text-slate-800 dark:text-slate-200">
                      {help.email}
                    </span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
