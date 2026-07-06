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
          Terms & Conditions
        </h2>
        <p className="font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Last Updated: June 2026 • Rockmix Infra Equipments Pvt. Ltd.
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
              The term <strong className="text-slate-900 dark:text-white">"ROCKMIX"</strong> or <strong className="text-slate-900 dark:text-white">"us"</strong> or <strong className="text-slate-900 dark:text-white">"our"</strong> or <strong className="text-slate-900 dark:text-white">"we"</strong> refers to the owner of the website whose registered office is:
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
        
        {/* Item 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/60 p-5 md:p-6 shadow-xs flex items-start space-x-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
        >
          <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">1</div>
          <div className="space-y-1">
            <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
              <FileText className="h-4 w-4 text-slate-400 shrink-0" />
              <span>Acceptance of Terms</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              By accessing and using this website, you agree to comply with and be bound by these Terms & Conditions. If you do not agree, please discontinue use immediately.
            </p>
          </div>
        </motion.div>

        {/* Item 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/60 p-5 md:p-6 shadow-xs flex items-start space-x-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
        >
          <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">2</div>
          <div className="space-y-1">
            <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
              <span>Business Scope</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              This website provides information about construction equipment procurement, dealership services, and related business offerings. All transactions, quotations, and agreements are subject to separate written contracts between Rockmix Infra Equipments Pvt. Ltd. and the customer.
            </p>
          </div>
        </motion.div>

        {/* Item 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/60 p-5 md:p-6 shadow-xs flex items-start space-x-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
        >
          <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">3</div>
          <div className="space-y-1.5">
            <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
              <Scale className="h-4 w-4 text-slate-400 shrink-0" />
              <span>Use of Website</span>
            </h4>
            <ul className="space-y-2 pl-1">
              <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <span className="text-indigo-600 font-bold text-[14px] leading-none mt-0.5">•</span>
                <span>You agree to use this website only for lawful purposes related to construction equipment inquiries and purchases.</span>
              </li>
              <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <span className="text-indigo-600 font-bold text-[14px] leading-none mt-0.5">•</span>
                <span>Misuse of the website, including unauthorized access, data scraping, or fraudulent activity, is strictly prohibited.</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Item 4 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/60 p-5 md:p-6 shadow-xs flex items-start space-x-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
        >
          <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">4</div>
          <div className="space-y-1.5">
            <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-slate-400 shrink-0" />
              <span>Product Information & Pricing</span>
            </h4>
            <ul className="space-y-2 pl-1">
              <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <span className="text-indigo-600 font-bold text-[14px] leading-none mt-0.5">•</span>
                <span>While we strive to provide accurate product details, specifications, and pricing, errors may occur.</span>
              </li>
              <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <span className="text-indigo-600 font-bold text-[14px] leading-none mt-0.5">•</span>
                <span>Prices and availability are subject to change without prior notice.</span>
              </li>
              <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <span className="text-indigo-600 font-bold text-[14px] leading-none mt-0.5">•</span>
                <span>Final terms, including delivery schedules and payment conditions, will be confirmed in dealership agreements.</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Item 5 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/60 p-5 md:p-6 shadow-xs flex items-start space-x-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
        >
          <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">5</div>
          <div className="space-y-1.5">
            <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
              <span>Intellectual Property</span>
            </h4>
            <ul className="space-y-2 pl-1">
              <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <span className="text-indigo-600 font-bold text-[14px] leading-none mt-0.5">•</span>
                <span>This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</span>
              </li>
              <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <span className="text-indigo-600 font-bold text-[14px] leading-none mt-0.5">•</span>
                <span>All content, including product images, brochures, logos, and text, is the property of Rockmix.</span>
              </li>
              <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <span className="text-indigo-600 font-bold text-[14px] leading-none mt-0.5">•</span>
                <span>All trademarks reproduced in this website which are not the property of, or licensed to, the operator are acknowledged on the website. Unauthorised use of this website may give rise to a claim for damages and/or be a criminal offence.</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Item 6 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/60 p-5 md:p-6 shadow-xs flex items-start space-x-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
        >
          <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">6</div>
          <div className="space-y-1.5">
            <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
              <Scale className="h-4 w-4 text-slate-400 shrink-0" />
              <span>Limitation of Liability</span>
            </h4>
            <ul className="space-y-2 pl-1">
              <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <span className="text-indigo-600 font-bold text-[14px] leading-none mt-0.5">•</span>
                <span>We are not liable for any indirect, incidental, or consequential damages arising from the use of this website or reliance on its content.</span>
              </li>
              <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <span className="text-indigo-600 font-bold text-[14px] leading-none mt-0.5">•</span>
                <span>Equipment performance and warranties are subject to manufacturer terms and conditions.</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Item 7 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/60 p-5 md:p-6 shadow-xs flex items-start space-x-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
        >
          <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">7</div>
          <div className="space-y-1">
            <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
              <Lock className="h-4 w-4 text-slate-400 shrink-0" />
              <span>Privacy & Data Protection</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              Your use of this website is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information, including inquiries and dealership requests.
            </p>
          </div>
        </motion.div>

        {/* Item 8 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/60 p-5 md:p-6 shadow-xs flex items-start space-x-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
        >
          <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">8</div>
          <div className="space-y-1">
            <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 text-slate-400 shrink-0" />
              <span>Changes to Terms</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              We reserve the right to update or modify these Terms & Conditions at any time. Continued use of the website after changes constitutes acceptance of the revised terms.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
