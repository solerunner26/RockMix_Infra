import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InquiryFormData } from '../types';
import { PRODUCTS } from '../data';
import { 
  Send, Sparkles, Clipboard, Check, RotateCcw, AlertCircle, FileText, 
  MapPin, Phone, Mail, Building, User, FileEdit, ClipboardCheck, Info,
  CheckSquare, Square
} from 'lucide-react';

import { useSiteContent } from '../context/SiteContentContext';

interface InquirySectionProps {
  preselectedProduct: string | null;
  clearPreselectedProduct: () => void;
}

export default function InquirySection({ preselectedProduct, clearPreselectedProduct }: InquirySectionProps) {
  const { content } = useSiteContent();
  const primaryPhone = content.contact.cards?.[0]?.phones?.split(',')[0]?.trim() || '+91 90335 23175';
  const primaryEmail = content.contact.cards?.[0]?.email || 'sales@rockmixinfra.com';
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    selectedProducts: [],
    customNotes: '',
    address: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Sync pre-selected product
  useEffect(() => {
    if (preselectedProduct) {
      setFormData(prev => {
        const alreadySelected = prev.selectedProducts.includes(preselectedProduct);
        return {
          ...prev,
          selectedProducts: alreadySelected 
            ? prev.selectedProducts 
            : [...prev.selectedProducts, preselectedProduct]
        };
      });
      clearPreselectedProduct();
    }
  }, [preselectedProduct, clearPreselectedProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const toggleProductSelection = (productName: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedProducts.includes(productName);
      const updated = isSelected
        ? prev.selectedProducts.filter(p => p !== productName)
        : [...prev.selectedProducts, productName];
      return { ...prev, selectedProducts: updated };
    });

    if (errors.selectedProducts) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.selectedProducts;
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const tempErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      tempErrors.name = 'Full Name is required';
    }

    if (!formData.company.trim()) {
      tempErrors.company = 'Company Name is required';
    }

    if (!formData.address.trim()) {
      tempErrors.address = 'Address is required';
    }

    if (formData.selectedProducts.length === 0) {
      tempErrors.selectedProducts = 'Please select at least one product';
    }

    // Email validation
    if (!formData.email.trim()) {
      tempErrors.email = 'Email Address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        tempErrors.email = 'Please enter a valid email address';
      }
    }

    // Phone validation (checks 10 digit Indian/generic mobile number)
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone Number is required';
    } else {
      // Strips extra non-digit chars to check 10 digit count
      const digits = formData.phone.replace(/\D/g, '');
      if (digits.length < 10) {
        tempErrors.phone = 'Please enter a valid 10-digit mobile number';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const submitQuoteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const el = document.getElementById(`field-${firstErrorKey}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    setIsLoading(true);

    try {
      // 1. Store locally in localStorage
      const existingQuotes = JSON.parse(localStorage.getItem('rockmix_quotes') || '[]');
      const newQuote = {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString()
      };
      existingQuotes.push(newQuote);
      localStorage.setItem('rockmix_quotes', JSON.stringify(existingQuotes));

      // 2. Log clearly to the console
      console.log("Submitted Quote Request successfully saved locally.");

      // 3. Post to backend API if available to trigger the custom proposal
      const response = await fetch('/api/inquiry/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          projectType: 'General Construction & Infrastructure',
          products: formData.selectedProducts,
          estimatedVolume: 'Medium Scale',
          timeline: 'Immediate Setup',
          customNotes: formData.customNotes,
          address: formData.address
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.proposal) {
          setGeneratedProposal(data.proposal);
        }
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting quote request:", err);
      // Still show success local state even if api connection had an issue
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      selectedProducts: [],
      customNotes: '',
      address: ''
    });
    setErrors({});
    setGeneratedProposal(null);
    setIsSubmitted(false);
  };

  const handleCopyToClipboard = () => {
    if (!generatedProposal) return;
    navigator.clipboard.writeText(generatedProposal);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section id="get-a-quote-section" className="pt-[140px] md:pt-[160px] pb-24 px-4 max-w-7xl mx-auto space-y-16 relative">
      <div className="absolute top-[20%] left-[-10%] w-96 h-96 rounded-full bg-indigo-50/50 dark:bg-indigo-950/10 blur-3xl -z-10 pointer-events-none"></div>

      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-3 py-1 text-xs font-bold border border-indigo-100/50 dark:border-indigo-900/50">
          <span>Official Quotation Portal</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Get a Quote
        </h2>
        <p className="font-sans text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
          Tell us your requirement and our team will help you with the right machinery solution.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="quote-form-layout"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left/Main Column: Professional Inquiry Form */}
            <div className="lg:col-span-8 rounded-3xl liquid-glass bg-white/75 dark:bg-slate-900/75 shadow-xl border border-indigo-100/40 dark:border-slate-800/80 p-6 md:p-8">
              <form onSubmit={submitQuoteRequest} className="space-y-6" id="quote-inquiry-form" noValidate>
                
                {/* Contact Information Subheading */}
                <div>
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-4">
                    1. Personal & Company Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5" id="field-name">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Rajesh Kumar"
                          className={`w-full rounded-xl border ${
                            errors.name ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200/80 dark:border-slate-700/80'
                          } bg-white dark:bg-slate-950 px-10 py-3 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 dark:text-slate-200`}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-rose-500 text-[11px] font-semibold flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Company Name */}
                    <div className="space-y-1.5" id="field-company">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Company Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          name="company"
                          required
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="e.g. RK Infrastructure Pvt Ltd"
                          className={`w-full rounded-xl border ${
                            errors.company ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200/80 dark:border-slate-700/80'
                          } bg-white dark:bg-slate-950 px-10 py-3 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 dark:text-slate-200`}
                        />
                      </div>
                      {errors.company && (
                        <p className="text-rose-500 text-[11px] font-semibold flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.company}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Channels Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Email Address */}
                  <div className="space-y-1.5" id="field-email">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. rajesh@rkinfra.com"
                        className={`w-full rounded-xl border ${
                          errors.email ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200/80 dark:border-slate-700/80'
                        } bg-white dark:bg-slate-950 px-10 py-3 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 dark:text-slate-200`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-rose-500 text-[11px] font-semibold flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5" id="field-phone">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9898XXXXXX (10-digit mobile)"
                        className={`w-full rounded-xl border ${
                          errors.phone ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200/80 dark:border-slate-700/80'
                        } bg-white dark:bg-slate-950 px-10 py-3 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 dark:text-slate-200`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-rose-500 text-[11px] font-semibold flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5" id="field-address">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Address / Site Location <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      name="address"
                      required
                      rows={2}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Please specify your office or active construction site delivery address..."
                      className={`w-full rounded-xl border ${
                        errors.address ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200/80 dark:border-slate-700/80'
                      } bg-white dark:bg-slate-950 p-4 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 dark:text-slate-200 resize-none`}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-rose-500 text-[11px] font-semibold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.address}
                    </p>
                  )}
                </div>

                {/* Product Selection */}
                <div id="field-selectedProducts">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-4">
                    2. Machinery Configuration / Product Selection <span className="text-rose-500">*</span>
                  </h3>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-3">
                    Select one or more Rockmix products you would like included in your unified price estimate:
                  </p>

                  <div className="flex flex-col gap-2.5" id="multi-product-checkbox-group">
                    {PRODUCTS.map((prod) => {
                      const isSelected = formData.selectedProducts.includes(prod.name);
                      return (
                        <div
                          key={prod.id}
                          onClick={() => toggleProductSelection(prod.name)}
                          className={`cursor-pointer rounded-xl p-3 px-4 border flex items-center gap-4 transition-all select-none ${
                            isSelected
                              ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800 text-slate-800 dark:text-white shadow-xs ring-1 ring-indigo-500/15'
                              : 'bg-white/80 dark:bg-slate-950/80 border-slate-200/75 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <div className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                          }`}>
                            {isSelected ? <CheckSquare className="h-4.5 w-4.5" /> : <Square className="h-4.5 w-4.5 text-slate-300 dark:text-slate-600" />}
                          </div>
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            className="w-12 h-12 object-contain rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wide block">
                              {prod.category}
                            </span>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug whitespace-normal break-words">
                              {prod.name}
                            </h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {errors.selectedProducts && (
                    <p className="text-rose-500 text-[11px] font-semibold mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.selectedProducts}
                    </p>
                  )}
                </div>

                {/* Message / Custom Requirements */}
                <div className="space-y-1.5" id="field-customNotes">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-4">
                    3. Custom Requirements
                  </h3>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Message / Custom Requirement <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    name="customNotes"
                    value={formData.customNotes}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Please describe your requirement, capacity, location, project type, or any customization needed."
                    className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-950 p-4 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 dark:text-slate-200 resize-none"
                  />
                </div>

                {/* Form Submit Row */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" /> We respect your privacy. Form data is secured locally.
                  </p>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center space-x-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:scale-100 text-white font-bold text-xs sm:text-sm px-6 py-4 transition-all active:scale-[0.98] shadow-lg shadow-indigo-100 dark:shadow-none cursor-pointer"
                    id="submit-quote-btn"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Quote Request</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>

            {/* Right Column: Why Choose Rockmix Infra Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl bg-white/75 dark:bg-slate-900/75 text-slate-800 dark:text-slate-200 p-6 shadow-xl space-y-6 border border-slate-200/50 dark:border-slate-800/80">
                <div className="space-y-2">
                  <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white">Why choose Rockmix Infra?</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    We deliver heavy machinery solutions designed for rugged performance and maximum active lifecycle.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: 'Reliable construction machinery',
                      desc: 'Built using structural high-tensile steel, high-wear chromium lining plates, and premium components.'
                    },
                    {
                      title: 'Technical support',
                      desc: '24/7 technical help desk coupled with on-site deployment assistance and operational calibration.'
                    },
                    {
                      title: 'Custom project solutions',
                      desc: 'Tailored configurations spanning compact mobile, container modular, and continuous paving layouts.'
                    },
                    {
                      title: 'Dealer and customer support',
                      desc: 'Nationwide distribution hub guaranteeing immediate dispatch of wear components and spare parts.'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3.5 items-start">
                      <div className="mt-0.5 shrink-0 h-6 w-6 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-100 dark:border-indigo-900/50">
                        {idx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</h5>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instant Contact Info Card */}
              <div className="rounded-3xl bg-white/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800 p-6 space-y-4">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-500">Need Immediate Help?</h4>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <p className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-indigo-600" />
                    <span>{primaryPhone}</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-indigo-600" />
                    <span>{primaryEmail}</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Success Screen layout */
          <motion.div
            key="quote-success-state"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            {/* Success notification banner with required text */}
            <div className="rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 p-6 md:p-8 text-center space-y-4 shadow-lg shadow-emerald-100/10">
              <div className="inline-flex h-14 w-14 rounded-full bg-emerald-500 text-white items-center justify-center text-2xl font-bold shrink-0 shadow-lg shadow-emerald-500/20 animate-bounce">
                ✓
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-xl md:text-2xl font-extrabold text-emerald-900 dark:text-emerald-400">
                  Submission Successful!
                </h3>
                <p className="font-sans text-sm sm:text-base text-emerald-800/95 dark:text-emerald-300/90 leading-relaxed font-semibold max-w-2xl mx-auto">
                  Thank you. Your quote request has been submitted. Our Rockmix Infra team will contact you shortly.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={handleResetForm}
                  className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2.5 transition-all shadow-xs cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Submit Another Request</span>
                </button>
              </div>
            </div>

            {/* Submitted Info Overview */}
            <div className="rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-md text-left">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-500">Summary of Inquiry:</h4>
              <div className="grid md:grid-cols-2 gap-4 text-xs text-slate-700 dark:text-slate-300">
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Company:</strong> {formData.company}</p>
                <p><strong>Delivery Location:</strong> {formData.address}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p className="md:col-span-2"><strong>Selected Machinery:</strong> {formData.selectedProducts.join(", ")}</p>
              </div>
            </div>

            {/* Generated Technical Specification Proposal (Bonus Value Add) */}
            {generatedProposal && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4 text-left"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    <span>AI-Generated Machinery Proposal & Roadmap</span>
                  </h3>
                  <button
                    onClick={handleCopyToClipboard}
                    className="flex items-center space-x-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 transition-all shadow-xs"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Clipboard className="h-3.5 w-3.5" />
                        <span>Copy Proposal</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800/90 shadow-xl p-6 md:p-8 max-h-[500px] overflow-y-auto" id="proposal-document-view">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 text-slate-400">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500">
                        OFFICIAL ROCKMIX ESTIMATE PROPOSAL
                      </span>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-400 font-mono">
                      REF: RM-{Date.now().toString().slice(-6)}
                    </span>
                  </div>

                  {/* Render markdown letter */}
                  <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm font-sans" id="proposal-markdown-content">
                    {generatedProposal.split('\n').map((line, lIdx) => {
                      if (line.trim().startsWith('# ')) {
                        return <h2 key={lIdx} className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white pt-3 first:pt-0 border-b border-slate-100 dark:border-slate-800 pb-1">{line.replace('# ', '')}</h2>;
                      }
                      if (line.trim().startsWith('## ')) {
                        return <h3 key={lIdx} className="font-display text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 pt-2">{line.replace('## ', '')}</h3>;
                      }
                      if (line.trim().startsWith('### ')) {
                        return <h4 key={lIdx} className="font-display text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 pt-2">{line.replace('### ', '')}</h4>;
                      }
                      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                        const text = line.replace(/^[\s*-]+/, '');
                        const parts = text.split('**');
                        return (
                          <div key={lIdx} className="flex items-start space-x-2 pl-3">
                            <span className="text-indigo-600 dark:text-indigo-400 mt-1.5 shrink-0 text-[10px]">•</span>
                            <span>
                              {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-extrabold text-slate-900 dark:text-white">{p}</strong> : p)}
                            </span>
                          </div>
                        );
                      }
                      if (line.trim() === '---') {
                        return <hr key={lIdx} className="border-t border-slate-100 dark:border-slate-800 my-4" />;
                      }
                      const parts = line.split('**');
                      return (
                        <p key={lIdx} className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-extrabold text-slate-900 dark:text-white">{p}</strong> : p)}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
