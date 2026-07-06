import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Building, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import SafeImage from './SafeImage';

interface ContactSectionProps {
  onNavigate?: (tab: string) => void;
}

export default function ContactSection({ onNavigate }: ContactSectionProps) {
  const { content } = useSiteContent();

  if (!content.contact.showSection) return null;

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    organization: '',
    city: '',
    emailId: '',
    mobileNo: '',
    subject: '',
    message: '',
    termsAccepted: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      setError('You must accept the Terms and Conditions to proceed.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSent(true);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          organization: '',
          city: '',
          emailId: '',
          mobileNo: '',
          subject: '',
          message: '',
          termsAccepted: false
        });
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit form. Please try again.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setError('A network error occurred. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactCardsList = content.contact.cards || [
    {
      title: 'Corporate HQ & Manufacturing Works',
      address: 'Plot No - 38, Nandanvan Industrial Park - 2,\nBakrol To Dhamatvan Road, Bakrol Bujrang,\nAhmedabad - 382430, Gujarat, India',
      phones: '+91 90335 23175, +91 90335 23176',
      email: 'sales@rockmixinfra.com',
      contactPerson: 'Corporate Desk'
    }
  ];

  const contactCards = contactCardsList.map(card => ({
    title: card.title,
    addressLines: card.address.split('\n'),
    phones: card.phones.split(',').map((p: string) => p.trim()),
    email: card.email,
    contactPerson: card.contactPerson
  }));

  return (
    <section id="contact-section" className="pt-[140px] md:pt-[160px] pb-24 px-4 max-w-7xl mx-auto space-y-16 relative">
      <div className="absolute top-[30%] left-[20%] w-72 h-72 bg-indigo-50/40 blur-3xl rounded-full -z-10 pointer-events-none dark:hidden"></div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {content.contact.title}
        </h2>
        <p className="font-sans text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          {content.contact.description}
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Factory Details & Contact parameters */}
        <div className="lg:col-span-6 space-y-6" id="contact-details-grid">
          {contactCards.map((card, idx) => (
            <div 
              key={idx}
              className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/60 p-6 md:p-8 space-y-6 shadow-sm hover:shadow-md hover:bg-white/90 dark:hover:bg-slate-900/90 backdrop-blur-md transition-all hover:scale-[1.01]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border border-indigo-100/30">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-slate-800 dark:text-white">
                      {card.title}
                    </h4>
                    {card.contactPerson && (
                      <p className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-extrabold">
                        {card.contactPerson}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="space-y-1 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-800/20">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">REGISTERED OFFICE & WORKS ADDRESS</p>
                  {card.addressLines.map((line, lidx) => (
                    <p key={lidx} className="font-medium text-slate-800 dark:text-slate-200">{line}</p>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 mt-0.5 shrink-0">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Sales & Technical Hotlines</p>
                      {card.phones.map((phone, pidx) => (
                        <p key={pidx} className="text-sm font-bold text-slate-800 dark:text-slate-200">{phone}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 mt-0.5 shrink-0">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Email Communication</p>
                      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{card.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-6" id="general-contact-form">
          <div className="rounded-3xl bg-white/90 dark:bg-slate-900/90 p-6 md:p-8 shadow-xl border border-slate-200/50 dark:border-slate-800 backdrop-blur-md">
            <AnimatePresence mode="wait">
              {!isSent ? (
                <motion.form
                  key="contact-form"
                  onSubmit={handleSubmit}
                  className="space-y-4 text-left"
                >
                  <h3 className="font-display text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                    {content.forms.contactTitle}
                  </h3>

                  {error && (
                    <div className="flex items-center space-x-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 p-3 rounded-xl text-xs">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Organization <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="organization"
                        required
                        value={formData.organization}
                        onChange={handleInputChange}
                        placeholder="Company Name"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Ahmedabad"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Email ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="emailId"
                        required
                        value={formData.emailId}
                        onChange={handleInputChange}
                        placeholder="e.g. name@company.com"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Mobile No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobileNo"
                        required
                        value={formData.mobileNo}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 90335 23175"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Inquiry Subject"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Write your specifications or request catalog..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none dark:text-white resize-none"
                    />
                  </div>

                  <div className="flex items-start space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleCheckboxChange}
                      className="mt-0.5 text-indigo-600 focus:ring-indigo-500 rounded border-slate-300 dark:border-slate-800 h-4 w-4 cursor-pointer"
                    />
                    <label htmlFor="termsAccepted" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                      I accept the <a href="#terms" onClick={(e) => e.preventDefault()} className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms and Conditions</a>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm py-3 transition-all active:scale-[0.98] shadow-md shadow-indigo-600/10 dark:shadow-none disabled:opacity-50"
                    id="submit-general-msg-btn"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}</span>
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="sent-confirmation"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                  id="message-sent-screen"
                >
                  <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-sm">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-display text-lg font-bold text-slate-800 dark:text-white">
                      Message Dispatched!
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
                      {content.forms.contactSuccess}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsSent(false)}
                    className="inline-flex items-center space-x-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-semibold px-4 py-2 transition-all"
                  >
                    <span>Send Another Message</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Join Hands with Rockmix Section */}
      <div id="join-hands-rockmix" className="pt-16 border-t border-slate-200/50 dark:border-slate-800/80">
         <div className="grid lg:grid-cols-12 gap-12 items-center">
           <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/40 dark:border-slate-800 aspect-[4/3] bg-slate-50 dark:bg-slate-950 group">
               <img 
                 src="/join hands.webp" 
                 alt="Join Hands with Rockmix Handshake" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                 referrerPolicy="no-referrer"
               />
             </div>
           </div>

          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 px-3 py-1 text-xs font-bold border border-indigo-100/50 dark:border-indigo-900/30">
              <span>Cooperation & Growth</span>
            </div>
            
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              Join Hands with Rockmix
            </h3>
            
            <div className="space-y-4 font-sans text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              <p>
                We are driven by a deep passion for excellence and a steadfast commitment to innovation. Our mission is to empower the construction and infrastructure industries with advanced, reliable, and efficient equipment that sets new standards of performance and quality.
              </p>
              <p>
                Partner with us to experience unparalleled service, premium-quality products, and cutting-edge solutions that redefine the future of infrastructure development. With our expertise, technology, and customer-centric approach, we ensure that every collaboration leads to lasting success and mutual growth.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dealership Opportunities Section */}
      <div id="dealership-opportunities" className="pt-16 mt-16 border-t border-slate-200/50 dark:border-slate-800/80">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left order-2 lg:order-1">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 px-3 py-1 text-xs font-bold border border-indigo-100/50 dark:border-indigo-900/30">
              <span>Partnership Network</span>
            </div>
            
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              Dealership Opportunities
            </h3>
            
            <div className="space-y-4 font-sans text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              <p>
                We are actively seeking dealers and business partners across India and in key international markets to join our expanding network. As a Rockmix dealer, you’ll gain access to our comprehensive product range, strong brand reputation, and dedicated support in sales, training, logistics, and after-sales service—empowering you to grow alongside one of the most trusted names in infrastructure equipment.
              </p>
              <p>
                Together, let’s build the foundation for a stronger, smarter, and more sustainable tomorrow.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate && onNavigate('dealership')}
                className="inline-flex items-center justify-center space-x-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 transition-all active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <span>BECOME A DEALER</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/40 dark:border-slate-800 aspect-[4/3] bg-slate-50 dark:bg-slate-950 group">
              <img 
                src="/dealership.webp" 
                loading="lazy"
                decoding="async" 
                alt="Dealership Opportunities Network" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
