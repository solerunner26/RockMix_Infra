import React, { useState, useEffect } from 'react';
import { 
  Lock, User, Eye, EyeOff, LayoutDashboard, FileText, Image as ImageIcon, 
  Settings, Shield, LogOut, ChevronRight, Save, RotateCcw, Download, 
  Upload, Trash2, Plus, Edit, X, Check, AlertTriangle, ArrowLeft, ArrowUp, ArrowDown, Eye as EyeIcon, EyeOff as EyeOffIcon,
  BarChart3, FileSpreadsheet, Copy, ExternalLink, TrendingUp, Sparkles, CheckCircle, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteContent } from '../context/SiteContentContext';
import { Product, ProductSpecification } from '../types';
import SafeImage from './SafeImage';

export default function AdminPanel() {
  const { 
    content, 
    updateContent, 
    resetContent, 
    login, 
    logout, 
    changePassword, 
    uploadImage,
    setActiveTab
  } = useSiteContent();

  const [activeTab, setInternalTab] = useState<string>('dashboard');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Status/Toast states
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Password change states
  const [currentPass, setCurrentPass] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Leads & Analytics States
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsFilter, setLeadsFilter] = useState('all'); // all, Contact Us, Dealership App, Get a Quote
  const [leadsSearch, setLeadsSearch] = useState('');

  // PDF Management States
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);

  // Active edit/add product states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    id: '',
    name: '',
    shortDesc: '',
    description: '',
    category: 'Concrete Batching Plants',
    accentColor: 'indigo',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
    image: '',
    brochure: '',
    features: [''],
    specifications: [{ label: '', value: '' }],
    highlights: ['']
  });

  // Safe toast trigger helper
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch unified leads from backend
  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await fetch('/api/admin/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLeadsLoading(false);
    }
  };

  // Fetch listed PDF files from backend
  const fetchPdfs = async () => {
    setPdfLoading(true);
    try {
      const res = await fetch('/api/admin/pdfs');
      if (res.ok) {
        const data = await res.json();
        setPdfs(data);
      }
    } catch (err) {
      console.error('Failed to fetch PDFs:', err);
    } finally {
      setPdfLoading(false);
    }
  };

  // Upload dynamic PDF file
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showToast('error', 'Please upload a valid PDF document.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      showToast('error', 'PDF brochure size should not exceed 25MB.');
      return;
    }

    setPdfUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const response = await fetch('/api/pdf/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, fileData: base64 }),
        });

        if (response.ok) {
          showToast('success', 'PDF brochure uploaded successfully!');
          fetchPdfs();
        } else {
          const errData = await response.json();
          showToast('error', errData.error || 'Failed to upload PDF brochure.');
        }
      } catch (err) {
        showToast('error', 'Network failure uploading PDF brochure.');
      } finally {
        setPdfUploading(false);
      }
    };
  };

  // Trigger background loads reactively
  useEffect(() => {
    const isAuth = !!localStorage.getItem('rockmix_admin_auth');
    if (isAuth) {
      if (activeTab === 'analytics' || activeTab === 'dashboard') {
        fetchLeads();
      }
      if (activeTab === 'pdfs' || activeTab === 'products') {
        fetchPdfs();
      }
    }
  }, [activeTab]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const result = await login(username, password);
    setLoginLoading(false);

    if (result.success) {
      showToast('success', 'Logged in successfully!');
      fetchLeads();
      fetchPdfs();
    } else {
      setLoginError(result.message);
    }
  };

  // Change password handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass && newPass !== confirmPass) {
      showToast('error', 'New password and confirmation do not match.');
      return;
    }

    const { strength } = getPasswordRules();
    if (newPass && strength !== 'strong') {
      showToast('error', 'Please fulfill all password complexity requirements first.');
      return;
    }

    const result = await changePassword(currentPass, newPass || undefined, newUsername || undefined);
    if (result.success) {
      showToast('success', result.message);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setNewUsername('');
    } else {
      showToast('error', result.message);
    }
  };

  // Live Password Strength & rules validation calculator
  const getPasswordRules = () => {
    const p = newPass;
    const u = newUsername.trim() || 'rockmin';
    const weakWords = ["password", "admin", "rockmix", "qwerty", "123456", "welcome"];
    const lowerP = p.toLowerCase();
    
    const rules = {
      length: p.length >= 12,
      uppercase: /[A-Z]/.test(p),
      lowercase: /[a-z]/.test(p),
      number: /[0-9]/.test(p),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(p),
      noUsername: p.length > 0 && !lowerP.includes(u.toLowerCase()),
      noWeakWords: p.length > 0 && !weakWords.some(w => lowerP.includes(w))
    };

    const passedCount = Object.values(rules).filter(Boolean).length;
    let strength: 'none' | 'weak' | 'medium' | 'strong' = 'none';
    
    if (p.length === 0) {
      strength = 'none';
    } else if (passedCount === 7) {
      strength = 'strong';
    } else if (passedCount >= 4) {
      strength = 'medium';
    } else {
      strength = 'weak';
    }

    return { rules, passedCount, strength };
  };

  const { rules: passRules, passedCount: passCount, strength: passStrength } = getPasswordRules();

  // Export content JSON backup
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `rockmix_cms_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('success', 'CMS configuration JSON exported successfully!');
  };

  // Export leads database as standard CSV format
  const handleExportCSV = () => {
    if (leads.length === 0) {
      showToast('error', 'No leads available to export.');
      return;
    }
    const headers = ["Form", "Name", "Email", "Phone", "Company", "Message/Product", "DateTime"];
    const rows = leads.map(l => [
      l.formName || '',
      l.name || '',
      l.email || '',
      l.phone || '',
      l.company || '',
      (l.message || l.productName || '').replace(/"/g, '""'),
      l.dateTime || ''
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(r => r.map(val => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rockmix_Leads_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Leads database successfully exported as CSV!');
  };

  // Import content JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = async (evt) => {
        try {
          const parsed = JSON.parse(evt.target?.result as string);
          if (parsed.global && parsed.home && parsed.products) {
            const success = await updateContent(parsed);
            if (success) {
              showToast('success', 'CMS configuration JSON imported successfully!');
            }
          } else {
            showToast('error', 'Invalid configuration file structure. Please check and retry.');
          }
        } catch (err) {
          showToast('error', 'Failed to parse JSON file.');
        }
      };
    }
  };

  // Reset all to default
  const handleResetToDefault = async () => {
    if (window.confirm('Are you absolutely sure you want to reset all website text, images, and products to the factory defaults? All manual edits will be overwritten.')) {
      const success = await resetContent();
      if (success) {
        showToast('success', 'Website restored to default settings successfully.');
      } else {
        showToast('error', 'Failed to reset website content.');
      }
    }
  };

  // Save textual site content
  const handleSaveContent = async (section: keyof typeof content, updatedSectionData: any) => {
    const updatedContent = {
      ...content,
      [section]: updatedSectionData
    };
    const success = await updateContent(updatedContent);
    if (success) {
      showToast('success', `${String(section).toUpperCase()} content saved successfully!`);
    } else {
      showToast('error', `Failed to save changes.`);
    }
  };

  // Image upload to server or base64 handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, onComplete: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast('error', 'Image size should not exceed 15MB.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result as string;
      const uploadedUrl = await uploadImage(file.name, base64);
      if (uploadedUrl) {
        onComplete(uploadedUrl);
        showToast('success', 'Image uploaded successfully!');
      } else {
        showToast('error', 'Failed to upload image.');
      }
    };
  };

  // Products CRUD operations
  const handleAddProductClick = () => {
    setProductForm({
      id: 'product-' + Date.now(),
      name: '',
      shortDesc: '',
      description: '',
      category: 'Concrete Batching Plants',
      accentColor: 'indigo',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
      image: '/p1.webp',
      brochure: '/prd1/rb1.pdf',
      features: [''],
      specifications: [{ label: '', value: '' }],
      highlights: ['']
    });
    setIsAddingProduct(true);
    setEditingProduct(null);
  };

  const handleEditProductClick = (prod: Product) => {
    setProductForm({
      ...prod,
      features: prod.features?.length ? [...prod.features] : [''],
      specifications: prod.specifications?.length ? prod.specifications.map(s => ({ ...s })) : [{ label: '', value: '' }],
      highlights: prod.highlights?.length ? [...prod.highlights] : ['']
    });
    setEditingProduct(prod);
    setIsAddingProduct(false);
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this product? It will be removed immediately from the public showcase carousel, catalog, and quote dropdowns.')) {
      const updatedProducts = content.products.filter(p => p.id !== prodId);
      const success = await updateContent({
        ...content,
        products: updatedProducts
      });

      if (success) {
        showToast('success', 'Product deleted successfully.');
      } else {
        showToast('error', 'Failed to delete product.');
      }
    }
  };

  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productForm.name || !productForm.shortDesc || !productForm.description) {
      showToast('error', 'Please fill in the required Name, Short Description, and Full Description.');
      return;
    }

    // Clean features & specs
    const cleanFeatures = (productForm.features || []).filter(f => f.trim() !== '');
    const cleanHighlights = (productForm.highlights || []).filter(h => h.trim() !== '');
    const cleanSpecs = (productForm.specifications || []).filter(s => s.label.trim() !== '' && s.value.trim() !== '');

    const finalProduct: Product = {
      id: productForm.id || 'product-' + Date.now(),
      name: productForm.name || '',
      shortDesc: productForm.shortDesc || '',
      description: productForm.description || '',
      category: productForm.category || 'Concrete Batching Plants',
      accentColor: productForm.accentColor || 'indigo',
      badgeColor: productForm.badgeColor || 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
      image: productForm.image || '/p1.webp',
      brochure: productForm.brochure || '',
      additionalImages: productForm.additionalImages || [],
      features: cleanFeatures.length ? cleanFeatures : ['High-Efficiency Continuous Mix Cycle'],
      specifications: cleanSpecs.length ? cleanSpecs : [{ label: 'Capacity', value: 'Sustained Continuous Output' }],
      highlights: cleanHighlights.length ? cleanHighlights : ['Built with premium structural reinforcement.']
    };

    let updatedProducts = [...content.products];
    if (isAddingProduct) {
      updatedProducts.push(finalProduct);
    } else {
      updatedProducts = updatedProducts.map(p => p.id === finalProduct.id ? finalProduct : p);
    }

    const success = await updateContent({
      ...content,
      products: updatedProducts
    });

    if (success) {
      showToast('success', isAddingProduct ? 'New product registered successfully!' : 'Product details saved successfully.');
      setIsAddingProduct(false);
      setEditingProduct(null);
    } else {
      showToast('error', 'Failed to save product details.');
    }
  };

  const handleReorderProduct = async (index: number, direction: 'up' | 'down') => {
    const updatedProducts = [...content.products];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updatedProducts.length) return;

    // Swap
    const temp = updatedProducts[index];
    updatedProducts[index] = updatedProducts[targetIndex];
    updatedProducts[targetIndex] = temp;

    const success = await updateContent({
      ...content,
      products: updatedProducts
    });

    if (success) {
      showToast('success', 'Products reordered.');
    }
  };

  // Render Login state if not authenticated
  if (!localStorage.getItem('rockmix_admin_auth')) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-slate-900/40 relative pt-28 sm:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950/50 to-slate-950 -z-10"></div>
        
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/80 p-8 backdrop-blur-xl relative">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold font-sans tracking-tight text-slate-900 dark:text-white">
              Rockmix Console
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Authenticate to manage website text, images, and catalog
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/40 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {loginError}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 font-mono tracking-wider uppercase">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 outline-none text-slate-900 dark:text-white transition-all"
                  placeholder="rockmin"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 font-mono tracking-wider uppercase">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 outline-none text-slate-900 dark:text-white transition-all"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-200/50 dark:shadow-none hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In To Dashboard'}
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-center text-slate-400">
            Secure offline-first administrative access portal
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pt-28 sm:pt-32" id="admin-dashboard-container">
      {/* Toast Alert overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center space-x-3 text-xs font-semibold ${
              toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SIDEBAR TABS PANEL */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-4 space-y-2 shadow-sm">
          <div className="p-3 mb-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Admin Console</h3>
              <p className="text-[10px] text-slate-400">Manage site structures</p>
            </div>
            <button 
              onClick={() => setActiveTab('home')} 
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              title="Return to Public Website"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => { setInternalTab('dashboard'); setEditingProduct(null); setIsAddingProduct(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => { setInternalTab('content'); setEditingProduct(null); setIsAddingProduct(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'content' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Website Copy</span>
          </button>

          <button
            onClick={() => { setInternalTab('images'); setEditingProduct(null); setIsAddingProduct(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'images' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Image Manager</span>
          </button>

          <button
            onClick={() => { setInternalTab('pdfs'); setEditingProduct(null); setIsAddingProduct(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'pdfs' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Brochures & PDFs</span>
          </button>

          <button
            onClick={() => { setInternalTab('products'); setEditingProduct(null); setIsAddingProduct(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'products' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Product Catalog</span>
          </button>

          <button
            onClick={() => { setInternalTab('sections'); setEditingProduct(null); setIsAddingProduct(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'sections' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Section Manager</span>
          </button>

          <button
            onClick={() => { setInternalTab('forms'); setEditingProduct(null); setIsAddingProduct(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'forms' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Form Copy & Settings</span>
          </button>

          <button
            onClick={() => { setInternalTab('analytics'); setEditingProduct(null); setIsAddingProduct(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Leads & Analytics</span>
          </button>

          <button
            onClick={() => { setInternalTab('security'); setEditingProduct(null); setIsAddingProduct(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'security' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>Admin Password</span>
          </button>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/60">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout Control</span>
            </button>
          </div>
        </div>

        {/* MAIN PANEL CONTENT WINDOW */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Rockmix CMS Administrator
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Welcome to the Rockmix Infra corporate website administrator suite. From here, you can easily alter Hero copies, logo resources, About descriptions, or manage your technical machinery catalogs instantaneously without writing single code lines.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-xl space-y-1">
                    <span className="text-xs text-slate-400 font-medium">Catalog Products</span>
                    <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {content.products.length}
                    </h3>
                  </div>

                  <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 rounded-xl space-y-1">
                    <span className="text-xs text-slate-400 font-medium">Active Lead Forms</span>
                    <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      3 (Recorded in Excel)
                    </h3>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1">
                    <span className="text-xs text-slate-400 font-medium">Authentication</span>
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Secure (SHA-256 Hashed)
                    </h3>
                  </div>
                </div>
              </div>

              {/* FACTORY ACTIONS & BACKUP CONTROLS */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Database backups & resets
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Save backup snapshots of your website copy, layouts, and catalog into standard JSON files. Restoring is instantaneous. You can also revert all changes immediately back to factory defaults.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold tracking-wide shadow-sm cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export Content Backup JSON</span>
                  </button>

                  <label className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold tracking-wide shadow-sm cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <span>Import Content JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={handleResetToDefault}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold tracking-wide border border-slate-200 dark:border-slate-700 cursor-pointer transition-all"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset Factory Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEBSITE COPY TEXT EDITOR */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* GLOBAL DETAILS CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b pb-2">Global Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 font-mono">Company Display Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                      value={content.global.companyName}
                      onChange={(e) => handleSaveContent('global', { ...content.global, companyName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 font-mono">Footer Description Text</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white leading-relaxed"
                    value={content.global.footerText}
                    onChange={(e) => handleSaveContent('global', { ...content.global, footerText: e.target.value })}
                  />
                </div>
              </div>

              {/* HERO DETAILS CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b pb-2">Home Hero Landing Copy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 font-mono">Hero Display Title</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                      value={content.home.heroTitle}
                      onChange={(e) => handleSaveContent('home', { ...content.home, heroTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 font-mono">Hero Display Subtitle</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                      value={content.home.heroSubtitle}
                      onChange={(e) => handleSaveContent('home', { ...content.home, heroSubtitle: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 font-mono">Hero Sub-text Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white leading-relaxed"
                    value={content.home.heroDescription}
                    onChange={(e) => handleSaveContent('home', { ...content.home, heroDescription: e.target.value })}
                  />
                </div>
              </div>

              {/* ABOUT SECTION COPY CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b pb-2">About Us Content Copy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 font-mono">About Display Heading</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                      value={content.about.title}
                      onChange={(e) => handleSaveContent('about', { ...content.about, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 font-mono">About Subtitle</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                      value={content.about.subtitle}
                      onChange={(e) => handleSaveContent('about', { ...content.about, subtitle: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 font-mono">About Us Paragraph 1</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white leading-relaxed"
                    value={content.about.description1}
                    onChange={(e) => handleSaveContent('about', { ...content.about, description1: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 font-mono">About Us Paragraph 2</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white leading-relaxed"
                    value={content.about.description2}
                    onChange={(e) => handleSaveContent('about', { ...content.about, description2: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMAGE MANAGER */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b pb-2">Global Media Assets</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Manage the image paths or upload new replacements for primary brand graphics on the website. New dynamic uploads are saved securely into the filesystem of your virtual host server.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  
                  {/* LOGO IMAGE CARD */}
                  <div className="p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Corporate Logo</span>
                      <p className="text-[10px] text-slate-400">Main header and brand footer logo</p>
                    </div>
                    <div className="h-28 rounded-lg bg-slate-900 p-4 flex items-center justify-center border border-slate-800">
                      <SafeImage src={content.global.logo} alt="Logo" className="max-h-full object-contain" />
                    </div>
                    <label className="w-full py-2 px-3 text-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold cursor-pointer shadow-sm">
                      Upload Logo replacement
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (url) => handleSaveContent('global', { ...content.global, logo: url }))}
                        className="hidden"
                      />
                    </label>
                  </div>
 
                  {/* HERO BACKGROUND CARD */}
                  <div className="p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Hero Background Illustration</span>
                      <p className="text-[10px] text-slate-400">Background panel shown behind homepage banner</p>
                    </div>
                    <div className="h-28 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800">
                      <SafeImage src={content.home.backgroundImage} alt="Hero background" className="h-full w-full object-cover" />
                    </div>
                    <label className="w-full py-2 px-3 text-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold cursor-pointer shadow-sm">
                      Upload background replacement
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (url) => handleSaveContent('home', { ...content.home, backgroundImage: url }))}
                        className="hidden"
                      />
                    </label>
                  </div>
 
                  {/* ABOUT US GRAPHIC CARD */}
                  <div className="p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">About Section Cover</span>
                      <p className="text-[10px] text-slate-400">Image displayed beside corporate descriptions</p>
                    </div>
                    <div className="h-28 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800">
                      <SafeImage src={content.about.image} alt="About cover" className="h-full w-full object-cover" />
                    </div>
                    <label className="w-full py-2 px-3 text-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold cursor-pointer shadow-sm">
                      Upload image replacement
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (url) => handleSaveContent('about', { ...content.about, image: url }))}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* DEALERSHIP GRAPHIC CARD */}
                  <div className="p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Dealership Banner</span>
                      <p className="text-[10px] text-slate-400">Cover graphic shown in dealership partner section</p>
                    </div>
                    <div className="h-28 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800">
                      <img src={content.dealership.image} alt="Dealership Cover" className="h-full w-full object-cover" />
                    </div>
                    <label className="w-full py-2 px-3 text-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold cursor-pointer shadow-sm">
                      Upload image replacement
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (url) => handleSaveContent('dealership', { ...content.dealership, image: url }))}
                        className="hidden"
                      />
                    </label>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRODUCT MANAGER (CRUD) */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* IF NOT ADDING OR EDITING */}
              {!isAddingProduct && !editingProduct ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Product Catalog Inventory</h2>
                      <p className="text-[10px] text-slate-400">Total registered heavy machineries</p>
                    </div>
                    <button
                      onClick={handleAddProductClick}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold tracking-wide shadow-sm cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Register New Machinery</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-medium text-slate-500">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800/80 text-slate-400 text-[10px] uppercase font-bold tracking-wider font-mono">
                          <th className="py-3 px-2">Order</th>
                          <th className="py-3 px-2">Machine Details</th>
                          <th className="py-3 px-2">Category</th>
                          <th className="py-3 px-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {content.products.map((prod, index) => (
                          <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-slate-900 dark:text-slate-100">
                            <td className="py-3.5 px-2">
                              <div className="flex items-center space-x-1">
                                <button
                                  disabled={index === 0}
                                  onClick={() => handleReorderProduct(index, 'up')}
                                  className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button
                                  disabled={index === content.products.length - 1}
                                  onClick={() => handleReorderProduct(index, 'down')}
                                  className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                            <td className="py-3.5 px-2">
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded overflow-hidden bg-slate-100 border flex items-center justify-center">
                                  <img src={prod.image} alt="" className="h-full w-full object-cover" />
                                </div>
                                <div className="max-w-xs md:max-w-md">
                                  <span className="font-bold text-slate-800 dark:text-white block truncate">{prod.name}</span>
                                  <span className="text-[10px] text-slate-400 block truncate">{prod.shortDesc}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-2 text-xs text-slate-500 font-medium">
                              {prod.category}
                            </td>
                            <td className="py-3.5 px-2 text-right space-x-2">
                              <button
                                onClick={() => handleEditProductClick(prod)}
                                className="inline-flex p-1.5 rounded bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-all cursor-pointer"
                                title="Edit Product details"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="inline-flex p-1.5 rounded bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-400 hover:scale-105 transition-all cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                
                /* ADD / EDIT FORM OVERLAY */
                <form onSubmit={handleSaveProductForm} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b pb-3">
                    <button
                      type="button"
                      onClick={() => { setEditingProduct(null); setIsAddingProduct(false); }}
                      className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to Catalog inventory</span>
                    </button>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono uppercase tracking-wider">
                      {isAddingProduct ? 'Machinery Onboarding' : 'Edit Machinery Specs'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 font-mono">Product Name*</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                        placeholder="e.g. Rockmix High Pressure Mixer"
                        value={productForm.name || ''}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 font-mono">Category ID</label>
                      <select
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      >
                        <option value="Concrete Batching Plants">Concrete Batching Plants</option>
                        <option value="Paving Base Plants">Paving Base Plants</option>
                        <option value="Concrete Pumps">Concrete Pumps</option>
                        <option value="Cement Silos">Cement Silos</option>
                        <option value="Precast Equipment">Precast Equipment</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 font-mono">Short Card Sub-text Description*</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                        placeholder="Highly maneuverable mixing trailers for on-site execution..."
                        value={productForm.shortDesc || ''}
                        onChange={(e) => setProductForm({ ...productForm, shortDesc: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 font-mono">Full Detail Description*</label>
                      <textarea
                        rows={4}
                        required
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white leading-relaxed"
                        placeholder="Write detailed specifications, structural material layout, engineering advantages..."
                        value={productForm.description || ''}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 font-mono">Machinery Showcase Image Cover</label>
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded bg-slate-50 border flex items-center justify-center overflow-hidden">
                          <img src={productForm.image || '/p1.webp'} alt="" className="h-full w-full object-cover" />
                        </div>
                        <label className="flex-1 py-2 px-3 text-center rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 text-[10px] font-bold cursor-pointer">
                          Upload Custom Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (url) => setProductForm({ ...productForm, image: url }))}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 font-mono">Product brochure PDF file URL</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                        placeholder="e.g. /prd1/rb1.pdf"
                        value={productForm.brochure || ''}
                        onChange={(e) => setProductForm({ ...productForm, brochure: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* SPECIFICATIONS SUB-RECORDS ARRAY */}
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white font-mono uppercase tracking-wider">Technical Specifications</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const specs = productForm.specifications ? [...productForm.specifications] : [];
                          specs.push({ label: '', value: '' });
                          setProductForm({ ...productForm, specifications: specs });
                        }}
                        className="text-indigo-600 font-semibold text-[10px] flex items-center space-x-1"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add spec row</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {productForm.specifications?.map((spec, sIdx) => (
                        <div key={sIdx} className="grid grid-cols-[1fr_1.5fr_auto] gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Specification Label (e.g. Capacity)"
                            className="px-3 py-1.5 text-[11px] rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                            value={spec.label}
                            onChange={(e) => {
                              const specs = [...(productForm.specifications || [])];
                              specs[sIdx].label = e.target.value;
                              setProductForm({ ...productForm, specifications: specs });
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Specification Value (e.g. 45 m3/hr)"
                            className="px-3 py-1.5 text-[11px] rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                            value={spec.value}
                            onChange={(e) => {
                              const specs = [...(productForm.specifications || [])];
                              specs[sIdx].value = e.target.value;
                              setProductForm({ ...productForm, specifications: specs });
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const specs = (productForm.specifications || []).filter((_, idx) => idx !== sIdx);
                              setProductForm({ ...productForm, specifications: specs });
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FEATURES LIST */}
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white font-mono uppercase tracking-wider">Key Functional Features</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const feats = productForm.features ? [...productForm.features] : [];
                          feats.push('');
                          setProductForm({ ...productForm, features: feats });
                        }}
                        className="text-indigo-600 font-semibold text-[10px] flex items-center space-x-1"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add feature row</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {productForm.features?.map((feat, fIdx) => (
                        <div key={fIdx} className="grid grid-cols-[1fr_auto] gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Functional advantage bullet point"
                            className="px-3 py-1.5 text-[11px] rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                            value={feat}
                            onChange={(e) => {
                              const feats = [...(productForm.features || [])];
                              feats[fIdx] = e.target.value;
                              setProductForm({ ...productForm, features: feats });
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const feats = (productForm.features || []).filter((_, idx) => idx !== fIdx);
                              setProductForm({ ...productForm, features: feats });
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SUBMIT ROW */}
                  <div className="flex items-center justify-end space-x-3 border-t pt-4">
                    <button
                      type="button"
                      onClick={() => { setEditingProduct(null); setIsAddingProduct(false); }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-800/40"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Machine Data</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 5: SECTION MANAGER */}
          {activeTab === 'sections' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b pb-2">Website Sections & Visibility</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Turn primary sections on or off completely. This removes their sections from the layout cleanly without leaving trailing grids or breaking components.
                </p>

                <div className="space-y-3 pt-3">
                  {/* ABOUT SECTION TOGGLE */}
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-white block">Corporate About Us Section</span>
                      <p className="text-[10px] text-slate-400">Section details listing infrastructure history & team</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveContent('about', { ...content.about, showSection: !content.about.showSection })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        content.about.showSection ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        content.about.showSection ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* TECHNICAL SUPPORT TOGGLE */}
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-white block">Technical Service Desk Section</span>
                      <p className="text-[10px] text-slate-400">Showcase for wear-parts, installation guidance, and commissioning</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveContent('support', { ...content.support, showSection: !content.support.showSection })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        content.support.showSection ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        content.support.showSection ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* PARTNERSHIP/DEALERSHIP TOGGLE */}
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-white block">Dealership Franchise Section</span>
                      <p className="text-[10px] text-slate-400">Registration forms for global territory distributors</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveContent('dealership', { ...content.dealership, showSection: !content.dealership.showSection })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        content.dealership.showSection ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        content.dealership.showSection ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* CONTACT US TOGGLE */}
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-white block">Contact US Panel</span>
                      <p className="text-[10px] text-slate-400">Headquarters maps, general submission mailers, and contact details</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveContent('contact', { ...content.contact, showSection: !content.contact.showSection })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        content.contact.showSection ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        content.contact.showSection ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FORM SETTINGS */}
          {activeTab === 'forms' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b pb-2">Business Form Labels & Success alerts</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Customize the titles and successful completion alerts that users see when submitting inquiries on the website.
                </p>

                <div className="grid grid-cols-1 gap-4 pt-3">
                  
                  {/* QUOTE FORM SETTINGS */}
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 space-y-3">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono block uppercase">Get a Quote Form</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Form Title</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-xs rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                          value={content.forms.quoteTitle}
                          onChange={(e) => handleSaveContent('forms', { ...content.forms, quoteTitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Success message</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-xs rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                          value={content.forms.quoteSuccess}
                          onChange={(e) => handleSaveContent('forms', { ...content.forms, quoteSuccess: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* CONTACT FORM SETTINGS */}
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 space-y-3">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono block uppercase">Contact US Form</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Form Title</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-xs rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                          value={content.forms.contactTitle}
                          onChange={(e) => handleSaveContent('forms', { ...content.forms, contactTitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Success message</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-xs rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                          value={content.forms.contactSuccess}
                          onChange={(e) => handleSaveContent('forms', { ...content.forms, contactSuccess: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* DEALERSHIP FORM SETTINGS */}
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 space-y-3">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono block uppercase">Dealership Application Form</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Form Title</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-xs rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                          value={content.forms.dealershipTitle}
                          onChange={(e) => handleSaveContent('forms', { ...content.forms, dealershipTitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Success message</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-xs rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                          value={content.forms.dealershipSuccess}
                          onChange={(e) => handleSaveContent('forms', { ...content.forms, dealershipSuccess: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB: BROCHURES & PDFS MANAGER */}
          {activeTab === 'pdfs' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Brochures & PDFs Manager</h2>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Upload and manage technical catalog PDFs. These links can be assigned to product items or shared directly.
                    </p>
                  </div>
                  <label className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm cursor-pointer transition-all self-start sm:self-center">
                    <Upload className="h-4 w-4" />
                    <span>{pdfUploading ? 'Uploading...' : 'Upload New Brochure'}</span>
                    <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} disabled={pdfUploading} />
                  </label>
                </div>

                {pdfLoading ? (
                  <div className="py-12 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : pdfs.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <FileSpreadsheet className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No PDF Files Uploaded</p>
                      <p className="text-xs text-slate-400 mt-1">Upload client pamphlets, blueprints, or catalogs to start.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pdfs.map((pdf, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={pdf.name}>
                            {pdf.name}
                          </p>
                          <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                            <span>Size: {pdf.size}</span>
                            <span>•</span>
                            <span className="truncate">{pdf.url}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.origin + pdf.url);
                              showToast('success', 'Brochure direct link copied!');
                            }}
                            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
                            title="Copy Direct Link"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <a
                            href={pdf.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
                            title="Open/Download Brochure"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: LEADS & ANALYTICS DASHBOARD */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Stats Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-5 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider">Total Leads</span>
                    <TrendingUp className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div className="mt-3 flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{leads.length}</span>
                    <span className="text-[10px] text-emerald-500 font-semibold font-mono bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">All Channels</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-5 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider">Quotes (Quote Forms)</span>
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="mt-3 flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {leads.filter(l => l.formName === 'getAquote').length}
                    </span>
                    <span className="text-[10px] text-amber-500 font-semibold font-mono bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">High Intent</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-5 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider">General Inquiries</span>
                    <User className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="mt-3 flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {leads.filter(l => l.formName === 'Contact Us').length}
                    </span>
                    <span className="text-[10px] text-blue-500 font-semibold font-mono bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">Contact Us</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-5 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider">Franchise Applications</span>
                    <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="mt-3 flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {leads.filter(l => l.formName === 'Dealership Application').length}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-semibold font-mono bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">Partnerships</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Visual SVG Trends Graph */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Lead Activity Timeline (Last 10 Active Days)</h3>
                
                {leadsLoading ? (
                  <div className="h-44 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <div className="w-full">
                    {(() => {
                      // Process lead dates
                      const counts: { [date: string]: number } = {};
                      leads.forEach(l => {
                        if (l.dateTime) {
                          const datePart = l.dateTime.split(' ')[0] || 'N/A';
                          counts[datePart] = (counts[datePart] || 0) + 1;
                        }
                      });
                      const timeline = Object.entries(counts)
                        .map(([date, count]) => ({ date, count }))
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .slice(-10);

                      if (timeline.length === 0) {
                        return (
                          <div className="h-44 flex flex-col items-center justify-center text-slate-400 text-xs">
                            <HelpCircle className="h-8 w-8 mb-2 text-slate-300" />
                            No submissions recorded yet. Try submitting a brochure request or quote inquiry.
                          </div>
                        );
                      }

                      const maxVal = Math.max(...timeline.map(t => t.count), 4);
                      // Map timeline entries to coordinate pairs (Grid coordinates: Width=600, Height=150)
                      const points = timeline.map((item, index) => {
                        const x = timeline.length > 1 ? (index / (timeline.length - 1)) * 520 + 40 : 300;
                        const y = 140 - (item.count / maxVal) * 90 - 20;
                        return { x, y, date: item.date, count: item.count };
                      });

                      const pathD = points.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
                      const areaD = points.length > 0 ? `${pathD} L ${points[points.length - 1].x} 130 L ${points[0].x} 130 Z` : '';

                      return (
                        <div className="relative">
                          <svg viewBox="0 0 600 160" className="w-full h-auto overflow-visible select-none">
                            <defs>
                              <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            {/* Horizontal gridlines */}
                            {[20, 50, 80, 110, 130].map((v, i) => (
                              <line key={i} x1="30" y1={v} x2="570" y2={v} className="stroke-slate-100 dark:stroke-slate-800/60" strokeDasharray="3,3" />
                            ))}

                            {/* Filled Area */}
                            {areaD && (
                              <path d={areaD} fill="url(#glowGrad)" />
                            )}

                            {/* Line path */}
                            {pathD && (
                              <path d={pathD} fill="none" className="stroke-indigo-600 dark:stroke-indigo-400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            )}

                            {/* Dots and tooltips */}
                            {points.map((p, i) => (
                              <g key={i} className="group cursor-pointer">
                                <circle cx={p.x} cy={p.y} r="5" className="fill-white stroke-indigo-600 dark:stroke-indigo-400" strokeWidth="2" />
                                <circle cx={p.x} cy={p.y} r="10" className="fill-indigo-600 opacity-0 group-hover:opacity-20 transition-all" />
                                <text x={p.x} y={p.y - 12} className="text-[10px] font-bold fill-indigo-600 dark:fill-indigo-400 text-center font-mono" textAnchor="middle">
                                  {p.count}
                                </text>
                                <text x={p.x} y="150" className="text-[8px] fill-slate-400 font-mono" textAnchor="middle">
                                  {p.date.split('-').slice(1).join('/')}
                                </text>
                              </g>
                            ))}
                          </svg>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Leads Table Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Form Submissions Logs</h3>
                    <p className="text-xs text-slate-500">Search and filter leads captured directly into Excel database sheets.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleExportCSV}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={fetchLeads}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Filter and Search controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-8 pr-4 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                      placeholder="Search name, phone, or company..."
                      value={leadsSearch}
                      onChange={(e) => setLeadsSearch(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <select
                    className="px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    value={leadsFilter}
                    onChange={(e) => setLeadsFilter(e.target.value)}
                  >
                    <option value="all">All Form Types</option>
                    <option value="getAquote">Get a Quote Requests</option>
                    <option value="Contact Us">Contact Submissions</option>
                    <option value="Dealership Application">Franchise App</option>
                  </select>
                </div>

                {/* Leads list Table */}
                {(() => {
                  const filteredLeads = leads.filter(l => {
                    const matchesFilter = leadsFilter === 'all' || l.formName === leadsFilter;
                    const term = leadsSearch.toLowerCase();
                    const matchesSearch = !term || 
                      (l.name && l.name.toLowerCase().includes(term)) ||
                      (l.email && l.email.toLowerCase().includes(term)) ||
                      (l.company && l.company.toLowerCase().includes(term)) ||
                      (l.phone && l.phone.toLowerCase().includes(term)) ||
                      (l.message && l.message.toLowerCase().includes(term)) ||
                      (l.productName && l.productName.toLowerCase().includes(term));
                    return matchesFilter && matchesSearch;
                  });

                  if (leadsLoading) {
                    return (
                      <div className="py-12 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                    );
                  }

                  if (filteredLeads.length === 0) {
                    return (
                      <div className="py-12 text-center text-slate-400 text-xs font-mono">
                        No submissions match search filters.
                      </div>
                    );
                  }

                  return (
                    <div className="overflow-x-auto rounded-xl border border-slate-150 dark:border-slate-800">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-850">
                            <th className="p-3">Source Form</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Contact</th>
                            <th className="p-3">Details / Request</th>
                            <th className="p-3">Time Sent</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                          {filteredLeads.map((lead, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/40 text-slate-700 dark:text-slate-300">
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                                  lead.formName === 'getAquote' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400' :
                                  lead.formName === 'Contact Us' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400' :
                                  'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                                }`}>
                                  {lead.formName === 'getAquote' ? 'Quote Request' : lead.formName}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="font-semibold text-slate-900 dark:text-white">{lead.name}</div>
                                {lead.company && <div className="text-[10px] text-slate-400">{lead.company}</div>}
                              </td>
                              <td className="p-3 space-y-0.5">
                                <div className="font-mono">{lead.email}</div>
                                {lead.phone && <div className="text-[10px] text-slate-400 font-mono">{lead.phone}</div>}
                              </td>
                              <td className="p-3 max-w-xs truncate" title={lead.message || lead.productName}>
                                <span className="font-semibold">{lead.productName ? `${lead.productName}: ` : ''}</span>
                                <span className="text-slate-500 dark:text-slate-400">{lead.message || 'No written summary provided.'}</span>
                              </td>
                              <td className="p-3 text-slate-400 font-mono text-[10px]">
                                {lead.dateTime}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB 7: PASSWORD MANAGEMENT */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <form onSubmit={handlePasswordChange} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-6 shadow-sm space-y-5">
                <div className="border-b pb-3 space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Admin Account Credentials</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Update your administrative username or reset your password. Changes are persistently recorded inside hashed security configuration files.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Password - Verification Needed */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 font-mono">Current Password (Required to commit changes)</label>
                    <input
                      type="password"
                      required
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                      placeholder="Enter active password"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                    />
                  </div>

                  {/* New Username change */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 font-mono">New Username (Optional)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                      placeholder="Enter new admin username (optional)"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* New Password input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 font-mono">New Password (Optional)</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                      placeholder="Leave blank to only change username"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                    />
                  </div>

                  {/* Confirm new password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 font-mono">Confirm New Password</label>
                    <input
                      type="password"
                      required={!!newPass}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                      placeholder="Repeat new password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                    />
                  </div>
                </div>

                {/* Real-time Password Strength checklist & Progress Bar */}
                {newPass && (
                  <div className="p-4 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">Password Strength Indicator</span>
                      <span className={`text-[10px] font-extrabold font-mono uppercase ${
                        passStrength === 'strong' ? 'text-emerald-500' :
                        passStrength === 'medium' ? 'text-amber-500' : 'text-rose-500'
                      }`}>
                        {passStrength === 'strong' ? 'Compliant & Secure' :
                         passStrength === 'medium' ? 'Incomplete Complexity' : 'Weak/Vulnerable'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-350 ${
                          passStrength === 'strong' ? 'bg-emerald-500 w-full' :
                          passStrength === 'medium' ? 'bg-amber-500 w-[66%]' : 'bg-rose-500 w-[33%]'
                        }`} 
                      />
                    </div>

                    {/* Live Rules Checklist Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="flex items-center space-x-2">
                        {passRules.length ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-rose-500" />}
                        <span className={passRules.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>At least 12 characters long ({newPass.length})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passRules.uppercase ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-rose-500" />}
                        <span className={passRules.uppercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>Contains an uppercase letter (A-Z)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passRules.lowercase ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-rose-500" />}
                        <span className={passRules.lowercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>Contains a lowercase letter (a-z)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passRules.number ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-rose-500" />}
                        <span className={passRules.number ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>Contains at least one number (0-9)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passRules.special ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-rose-500" />}
                        <span className={passRules.special ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>Contains a special character (!@#$)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passRules.noUsername ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-rose-500" />}
                        <span className={passRules.noUsername ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>Does not contain the username</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:col-span-2">
                        {passRules.noWeakWords ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-rose-500" />}
                        <span className={passRules.noWeakWords ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>Does not contain common weak/predictable words</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    disabled={newPass ? (passStrength !== 'strong' || newPass !== confirmPass) : (!newUsername && !newPass)}
                    className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm cursor-pointer disabled:opacity-40 transition-all"
                  >
                    <Save className="h-4 w-4" />
                    <span>Update Account Details</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
