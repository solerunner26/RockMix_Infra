import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, ChevronDown, ChevronRight, Hammer, ShieldCheck, Cpu, 
  Headphones, SendHorizontal, Mail, Award, Settings, MessageSquare 
} from 'lucide-react';
import { PRODUCTS } from '../data';
import {
  ConcreteBatchingPlantIcon,
  WetMixMacadamPlantIcon,
  AsphaltDrumMixPlantIcon,
  ConcretePrecastMouldIcon,
  CementStorageSilosIcon,
  TwinShaftMixersIcon,
  PlanetaryMixersIcon,
  PanMixersIcon,
  RockmixMobileIcon,
  RockmixCompactIcon,
  RockmixStationaryIcon,
  RockmixCompactMobilityIcon
} from './ProductIcons';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onProductSelect: (productId: string, seriesId?: string) => void;
}

const PRODUCT_ICON_MAP: Record<string, React.ComponentType<any>> = {
  'rockmix-mobile-rmp': RockmixMobileIcon,
  'rockmix-mini-mobile-rmp': RockmixMobileIcon,
  'rockmix-wetmix-rwmm': WetMixMacadamPlantIcon,
  'rockmix-compact-rcp': RockmixCompactIcon,
  'rockmix-stationary-rsp': RockmixStationaryIcon,
  'rockmix-compact-mobility-rcmp': RockmixCompactMobilityIcon,
  'stationary-concrete-pump': ConcretePrecastMouldIcon,
};

export default function Navbar({ activeTab, setActiveTab, onProductSelect }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Menu visibility states
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [inquiryMenuOpen, setInquiryMenuOpen] = useState(false);
  const [batchingSubmenuOpen, setBatchingSubmenuOpen] = useState(false);

  // Mobil specific accordion toggles
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileInquiryOpen, setMobileInquiryOpen] = useState(false);
  const [mobileBatchingOpen, setMobileBatchingOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Cpu },
    { id: 'about', label: 'About Us', icon: ShieldCheck },
    { id: 'products', label: 'Products', icon: Hammer, hasSubmenu: true },
    { id: 'dealership', label: 'Dealership', icon: Award },
    { id: 'support', label: 'Support', icon: Headphones },
    { id: 'contact', label: 'Contact Us', icon: Mail },
  ];

  const handleNavItemClick = (itemId: string) => {
    if (itemId === 'products') {
      setActiveTab('products');
      setProductsMenuOpen(!productsMenuOpen);
      setInquiryMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveTab(itemId);
      setIsOpen(false);
      setProductsMenuOpen(false);
      setInquiryMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProductClick = (productId: string) => {
    setActiveTab('products');
    onProductSelect(productId);
    setProductsMenuOpen(false);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSeriesClick = (seriesId: string) => {
    setActiveTab('products');
    onProductSelect('concrete-batching-plant', seriesId);
    setProductsMenuOpen(false);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const batchingSeries = [
    { id: 'rockmix-mobile-rmp', name: 'Rockmix Mobile (RMP Series)' },
    { id: 'rockmix-compact-rcp', name: 'Rockmix Compact (RCP Series)' },
    { id: 'rockmix-stationary-rsp', name: 'Rockmix Stationary (RSP Series)' },
    { id: 'rockmix-compact-mobility-rcmp', name: 'Rockmix Compact Mobility (RCMP Series)' }
  ];

  return (
    <header 
      id="app-header"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 pt-4 pb-2"
    >
      <div 
        className={`mx-auto max-w-7xl rounded-2xl transition-all duration-500 border ${
          isScrolled 
            ? 'bg-white/95 dark:bg-slate-900/95 py-3 shadow-xl border-slate-200/60 dark:border-slate-800' 
            : 'bg-white/85 dark:bg-slate-950/85 py-4 border-slate-100/50 dark:border-slate-900/50'
        } backdrop-blur-md`}
      >
        <div className="flex items-center justify-between px-6">
          {/* Logo */}
          <div 
            onClick={() => handleNavItemClick('home')}
            className="flex cursor-pointer items-center group"
            id="nav-logo-container"
          >
            <img 
              src="/LOGO.webp" 
              alt="ROCKMIX INFRASTRUCTURE" 
              className="h-[70px] md:h-[78px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-1" id="desktop-nav-menu">
            {navItems.map((item) => (
              <div 
                key={item.id} 
                className="relative group"
                onMouseEnter={() => {
                  if (item.id === 'products') setProductsMenuOpen(true);
                }}
                onMouseLeave={() => {
                  if (item.id === 'products') {
                    setProductsMenuOpen(false);
                    setBatchingSubmenuOpen(false);
                  }
                }}
              >
                <button
                  onClick={() => handleNavItemClick(item.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  id={`nav-item-${item.id}`}
                >
                  <span>{item.label}</span>
                  {item.hasSubmenu && (
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  )}
                </button>

                {/* Products Dropdown Submenu */}
                {item.id === 'products' && (
                  <div 
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 flex z-50 transition-all duration-200 ${
                      productsMenuOpen 
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible' 
                        : 'opacity-0 scale-95 translate-y-2 pointer-events-none invisible group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-hover:visible'
                    }`}
                  >
                    <div
                      className="w-96 rounded-2xl p-2 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/80 dark:border-slate-800"
                      id="products-submenu"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/60 mb-1">
                        Machinery Technical Catalog
                      </div>
                      
                      <div className="space-y-0.5">
                        {PRODUCTS.map((prod) => {
                          const ProductIcon = PRODUCT_ICON_MAP[prod.id] || Hammer;
                          return (
                            <button
                              key={prod.id}
                              onClick={() => handleProductClick(prod.id)}
                              className="flex w-full items-start space-x-3 rounded-xl p-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/85 group transition-all"
                            >
                              <div className="mt-0.5 rounded-lg p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 transition-colors shrink-0">
                                <ProductIcon className="h-4.5 w-4.5" />
                              </div>
                              <div className="flex-1">
                                <div className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                                  {prod.name}
                                </div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5 max-w-[240px]">
                                  {prod.shortDesc}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Call to Action Button */}
          <div className="hidden lg:flex items-center" id="nav-cta-container">
            <button
              onClick={() => {
                setActiveTab('inquiry');
                setIsOpen(false);
                setProductsMenuOpen(false);
                setInquiryMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative overflow-hidden group rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Get a Quote
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center" id="mobile-menu-trigger">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-xl p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden mx-auto max-w-7xl mt-2 overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl"
            id="mobile-nav-dropdown"
          >
            <div className="p-4 space-y-1">
              {navItems.map((item) => {
                const isProducts = item.id === 'products';
                const hasSub = isProducts;

                return (
                  <div key={item.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 pb-1 last:pb-0">
                    <button
                      onClick={() => {
                        if (isProducts) setMobileProductsOpen(!mobileProductsOpen);
                        else handleNavItemClick(item.id);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        activeTab === item.id && !hasSub
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      {hasSub && (
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isProducts && mobileProductsOpen ? 'rotate-180' : ''
                          }`} 
                        />
                      )}
                    </button>

                     {/* Mobile Products Accordion */}
                    {isProducts && mobileProductsOpen && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-1 ml-4 pl-4 border-l border-slate-200 dark:border-slate-800 space-y-1"
                      >
                        {PRODUCTS.map((prod) => {
                          const ProductIcon = PRODUCT_ICON_MAP[prod.id] || Hammer;
                          return (
                            <div key={prod.id} className="space-y-1">
                              <button
                                onClick={() => handleProductClick(prod.id)}
                                className="flex w-full items-center justify-between py-2.5 text-left text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                              >
                                <div className="flex items-center space-x-2.5">
                                  <ProductIcon className="h-4 w-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
                                  <span className="font-bold">{prod.name}</span>
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                );
              })}
              <button
                onClick={() => {
                  setActiveTab('inquiry');
                  setIsOpen(false);
                  setProductsMenuOpen(false);
                  setInquiryMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full mt-2 rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white shadow-md active:scale-[0.98] transition-transform cursor-pointer"
              >
                Get a Quote
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
