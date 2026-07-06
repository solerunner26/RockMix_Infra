import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeSection from './components/HomeSection';
import AboutUsSection from './components/AboutUsSection';
import ProductsSection from './components/ProductsSection';
import SupportSection from './components/SupportSection';
import TermsSection from './components/TermsSection';
import InquirySection from './components/InquirySection';
import ContactSection from './components/ContactSection';
import DealershipSection from './components/DealershipSection';
import AdminPanel from './components/AdminPanel';
import { useSiteContent } from './context/SiteContentContext';

// Lucide icons for mobile bottom dock and theme switcher
import { Home, Hammer, Headphones, SendHorizontal, MessageCircle, ShieldAlert, Sun, Moon, Award } from 'lucide-react';

export default function App() {
  const { content, activeTab, setActiveTab } = useSiteContent();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);
  const [preselectedInquiryProduct, setPreselectedInquiryProduct] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Sync Dark Mode state with Document Element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleProductSelect = (productId: string, seriesId?: string) => {
    setSelectedProductId(productId);
    setSelectedSeriesId(seriesId || null);
    setActiveTab('products');
  };

  const handleInquireProduct = (productName: string) => {
    setPreselectedInquiryProduct(productName);
    setActiveTab('inquiry');
  };

  const handleNavigate = (tab: string) => {
    if (tab === 'products') {
      setSelectedProductId(null);
      setSelectedSeriesId(null);
    }
    setActiveTab(tab);
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'home':
        return <HomeSection onNavigate={handleNavigate} onProductSelect={handleProductSelect} isDarkMode={isDarkMode} />;
      case 'about':
        return <AboutUsSection />;
      case 'products':
        return (
          <ProductsSection 
            onInquireProduct={handleInquireProduct} 
            selectedProductIdFromNav={selectedProductId}
            clearSelectedProductFromNav={() => {
              setSelectedProductId(null);
              setSelectedSeriesId(null);
            }}
            selectedSeriesIdFromNav={selectedSeriesId}
          />
        );
      case 'support':
        return <SupportSection />;
      case 'terms':
        return <TermsSection />;
      case 'dealership':
        return <DealershipSection />;
      case 'inquiry':
        return (
          <InquirySection 
            preselectedProduct={preselectedInquiryProduct}
            clearPreselectedProduct={() => setPreselectedInquiryProduct(null)}
          />
        );
      case 'contact':
        return <ContactSection onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <HomeSection onNavigate={handleNavigate} isDarkMode={isDarkMode} />;
    }
  };

  // Mobile Bottom Sticky Dock config
  const mobileDockItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Products', icon: Hammer },
    { id: 'support', label: 'Support', icon: Headphones },
    { id: 'dealership', label: 'Dealership', icon: Award },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300`}>
      
      {/* Absolute floating atmospheric backdrop blobs for liquid glass depth */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] left-[-15%] w-[500px] h-[500px] rounded-full bg-indigo-200/15 blur-3xl liquid-orb-1 dark:opacity-10"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-100/20 blur-3xl liquid-orb-2 dark:opacity-10"></div>
        <div className="absolute top-[45%] right-[15%] w-96 h-96 rounded-full bg-rose-100/10 blur-3xl liquid-orb-3 dark:opacity-10"></div>
      </div>

      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleNavigate} 
        onProductSelect={handleProductSelect} 
      />

      {/* Floating Theme Switcher Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-24 right-6 lg:bottom-6 lg:right-6 z-50 p-3.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl border border-slate-700/30 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        title="Toggle Light/Dark Theme"
        id="theme-toggle-floating-btn"
      >
        {isDarkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-indigo-500" />}
      </button>

      {/* Primary Section Canvas */}
      <main className="flex-grow pb-24 lg:pb-0" id="main-content-canvas">
        {renderActiveSection()}
      </main>

      {/* Responsive Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-950 mt-16" id="app-footer-bar">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-start">
            <div className="flex items-center justify-center sm:justify-start">
              <img 
                src={content.global.logo} 
                alt={content.global.companyName} 
                className="h-24 w-auto object-contain brightness-0 invert" 
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-slate-300 leading-relaxed text-justify">
                {content.global.footerText}
              </p>
              <div className="text-[10px] text-slate-500 font-mono text-center sm:text-left">
                {content.footer?.copyright || `© ${new Date().getFullYear()} ${content.global.companyName}. All rights reserved.`}
              </div>
            </div>
          </div>

          <div className="md:col-span-5 space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest font-mono">
              {content.footer?.quickLinksHeader || "Quick Navigation"}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => handleNavigate('home')} className="text-left hover:text-white transition-colors">Home</button>
              <button onClick={() => handleNavigate('about')} className="text-left hover:text-white transition-colors">About Us</button>
              <button onClick={() => handleNavigate('products')} className="text-left hover:text-white transition-colors">Products Catalog</button>
              <button onClick={() => handleNavigate('support')} className="text-left hover:text-white transition-colors">Support Desk</button>
              <button onClick={() => handleNavigate('dealership')} className="text-left hover:text-white transition-colors">Dealership Inquiry</button>
              <button onClick={() => handleNavigate('terms')} className="text-left hover:text-white transition-colors">Terms & Conditions</button>
              <button onClick={() => handleNavigate('inquiry')} className="text-left hover:text-white transition-colors">Request Quote</button>
              <button onClick={() => handleNavigate('contact')} className="text-left hover:text-white transition-colors">Contact Office</button>
              <button onClick={() => handleNavigate('admin')} className="text-left text-slate-500 hover:text-indigo-400 font-bold transition-colors">Admin Panel</button>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Bottom Navigation Dock for Mobile (One-Hand Thumb Reach) */}
      <div 
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 lg:hidden w-[90%] max-w-sm"
        id="mobile-thumb-navigation-dock"
      >
        <div className="rounded-2xl liquid-glass dark:liquid-glass-dark bg-white/80 dark:bg-slate-900/80 py-2.5 px-4 flex justify-between items-center shadow-2xl border border-white/60 dark:border-slate-800/60">
          {mobileDockItems.map((item) => {
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="flex flex-col items-center space-y-1 justify-center relative px-2.5"
              >
                <div className={`p-1.5 rounded-xl transition-all ${
                  isSelected ? 'bg-indigo-600 text-white scale-110 shadow-sm shadow-indigo-200' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}>
                  <item.icon className="h-4.5 w-4.5" />
                </div>
                <span className={`text-[9px] font-bold ${
                  isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {item.label}
                </span>
                
                {/* Visual active tab feedback bar */}
                {isSelected && (
                  <div className="absolute -bottom-1 h-1 w-4 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
