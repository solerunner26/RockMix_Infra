import React from 'react';
import { ShieldCheck, FileText, Building2, Scale, Lock, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

import { useSiteContent } from '../context/SiteContentContext';

export default function TermsSection() {
  const { content } = useSiteContent();
  const primaryAddress = content.contact.cards?.[0]?.address?.replace(/\n/g, ', ') || 
    "Plot No - 38, Nandanvan Industrial Park - 2, Bakrol To Dhamatvan Road, Bakrol Bujrang, Ahmedabad - 382430, Gujarat, India";
  return (
    <section id="terms-section" className="pt-[140px] md:pt-[160px] pb-24 px-4 max-w-4xl mx-auto space-y-12 relative">
      {/* Background ambient light blob */}
      <div className="absolute top-[20%] right-[10%] w-72 h-72 rounded-full bg-indigo-100/30 dark:bg-indigo-950/10 blur-3xl -z-10 pointer-events-none"></div>

      {/* Header block */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-1.5 rounded-full bg-indigo-50 dark:bg-slate-900/60 text-indigo-700 dark:text-indigo-400 px-3.5 py-1 text-xs font-bold border border-indigo-100/50 dark:border-indigo-900/40 shadow-xs">
          <ShieldCheck className="h-4 w-4" />
          <span>Legal & Compliance Documentation</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {content.terms?.title || "Terms & Conditions"}
        </h2>
        <p className="font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {content.terms?.subtitle || "Last Updated: June 2026 • Rockmix Infra Equipments Pvt. Ltd."}
        </p>
      </div>

      {/* Introduction Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 md:p-8 shadow-xl space-y-6"
      >
        <div className="flex items-start space-x-4">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-slate-800 dark:text-white">
              Welcome to our website
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              {content.terms?.welcomeText || 'The term "ROCKMIX" or "us" or "our" or "we" refers to the owner of the website whose registered office is:'}
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-300 italic leading-relaxed">
              "{primaryAddress}"
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              The term <strong className="text-slate-900 dark:text-white">"you"</strong> refers to the user or viewer of our website. The use of this website is subject to the following terms of use:
            </p>
          </div>
        </div>
      </motion.div>

      {/* Detailed Clauses (Bento Grid of Terms) */}
      <div className="grid gap-6">
        {(content.terms?.items || [
          {
            title: "Acceptance of Terms",
            desc: "By accessing and using this website, you agree to comply with and be bound by these Terms & Conditions. If you do not agree, please discontinue use immediately."
          },
          {
            title: "Business Scope",
            desc: "This website provides information about construction equipment procurement, dealership services, and related business offerings. All transactions, quotations, and agreements are subject to separate written contracts between Rockmix Infra Equipments Pvt. Ltd. and the customer."
          }
        ]).map((item, idx) => {
          const lower = item.title.toLowerCase();
          let IconComponent = AlertCircle;
          if (lower.includes('acceptance') || lower.includes('changes')) IconComponent = FileText;
          else if (lower.includes('scope') || lower.includes('intellectual') || lower.includes('business')) IconComponent = Building2;
          else if (lower.includes('use') || lower.includes('liability')) IconComponent = Scale;
          else if (lower.includes('privacy')) IconComponent = Lock;
          else if (lower.includes('changes')) IconComponent = RefreshCw;

          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/60 p-5 md:p-6 shadow-xs flex items-start space-x-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
                  <IconComponent className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{item.title}</span>
                </h4>
                {item.desc && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                    {item.desc}
                  </p>
                )}
                {Array.isArray(item.bullets) && item.bullets.length > 0 && (
                  <ul className="space-y-2 pl-1">
                    {item.bullets.map((bullet, bidx) => (
                      <li key={bidx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        <span className="text-indigo-600 font-bold text-[14px] leading-none mt-0.5">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
