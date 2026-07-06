import React, { useState, useEffect } from 'react';
import { 
  Lock, User, Eye, EyeOff, LayoutDashboard, FileText, Image as ImageIcon, 
  Settings, Shield, LogOut, ChevronRight, Save, RotateCcw, Download, 
  Upload, Trash2, Plus, Edit, X, Check, AlertTriangle, ArrowLeft, ArrowUp, ArrowDown,
  BarChart3, FileSpreadsheet, Copy, ExternalLink, TrendingUp, Sparkles, CheckCircle, HelpCircle,
  Mail, Phone, MapPin, MessageSquare, Clipboard, Calendar, Search, Filter, BookOpen, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteContent } from '../context/SiteContentContext';
import { Product, ProductSpecification } from '../types';

export default function AdminPanel() {
  const { 
    content, 
    updateContent, 
    resetContent, 
    login, 
    logout, 
    changePassword, 
    uploadImage,
    fetchWithAuth,
    setActiveTab
  } = useSiteContent();

  const [activeTab, setInternalTab] = useState<string>('dashboard');
  const [contentSubTab, setContentSubTab] = useState<string>('global');
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
  const [leadsFilter, setLeadsFilter] = useState('all'); 
  const [leadsStatusFilter, setLeadsStatusFilter] = useState('all');
  const [leadsSearch, setLeadsSearch] = useState('');
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Media Management States
  const [mediaAssets, setMediaAssets] = useState<any[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

  // Selected lead modal for editing notes/status
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [leadStatusEdit, setLeadStatusEdit] = useState('New');
  const [leadNotesEdit, setLeadNotesEdit] = useState('');

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

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch unified leads from SQLite
  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await fetchWithAuth('/api/admin/leads');
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

  // Fetch Media Assets
  const fetchMedia = async () => {
    setMediaLoading(true);
    try {
      const res = await fetchWithAuth('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMediaAssets(data);
      }
    } catch (err) {
      console.error('Failed to fetch media assets:', err);
    } finally {
      setMediaLoading(false);
    }
  };

  // Fetch Analytics data
  const fetchAnalytics = async () => {
    try {
      const res = await fetchWithAuth('/api/admin/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  // Initialize Admin Data
  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('rockmix_admin_token');
    if (isAuthenticated) {
      fetchLeads();
      fetchMedia();
      fetchAnalytics();
    }
  }, [activeTab]);

  // Handle Admin Authentication
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await login(username, password);
      if (res.success) {
        showToast('success', 'Welcome back! Signed in securely.');
        fetchLeads();
        fetchMedia();
        fetchAnalytics();
      } else {
        setLoginError(res.message);
      }
    } catch (err) {
      setLoginError('Authentication service failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Update password & username
  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass && newPass !== confirmPass) {
      showToast('error', 'New passwords do not match.');
      return;
    }

    const res = await changePassword(currentPass, newPass || undefined, newUsername || undefined);
    if (res.success) {
      showToast('success', res.message);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setNewUsername('');
    } else {
      showToast('error', res.error || res.message);
    }
  };

  // Export DB Backup as JSON
  const handleExportBackup = async () => {
    try {
      const res = await fetchWithAuth('/api/admin/export');
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rockmix_database_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('success', 'Database backup exported successfully!');
      }
    } catch (e) {
      showToast('error', 'Failed to export database.');
    }
  };

  // Import DB Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (window.confirm('WARNING: Importing a backup file will OVERWRITE all current leads, site settings, and products. Do you want to proceed?')) {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const importData = JSON.parse(reader.result as string);
          const res = await fetchWithAuth('/api/admin/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(importData)
          });
          
          if (res.ok) {
            showToast('success', 'Backup restored successfully! Refreshing database.');
            window.location.reload();
          } else {
            showToast('error', 'Failed to restore database from backup file.');
          }
        } catch (err) {
          showToast('error', 'Invalid JSON backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Content Saving Helper
  const handleSaveContent = async (section: keyof typeof content, updatedSectionData: any) => {
    const updatedContent = {
      ...content,
      [section]: updatedSectionData
    };
    const success = await updateContent(updatedContent);
    if (success) {
      showToast('success', `Content section [${String(section).toUpperCase()}] updated in SQLite.`);
      fetchAnalytics();
    } else {
      showToast('error', `Failed to save changes.`);
    }
  };

  // File Upload Helper (Image / PDF)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf', onComplete: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'image' && !file.type.startsWith('image/')) {
      showToast('error', 'Please upload a valid PNG, JPG, or WEBP image.');
      return;
    }
    if (type === 'pdf' && file.type !== 'application/pdf') {
      showToast('error', 'Please upload a valid PDF brochure.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast('error', 'File size exceeds 15MB limit.');
      return;
    }

    setFileUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const uploadUrl = '/api/' + (type === 'pdf' ? 'pdf' : 'image') + '/upload';
        const res = await fetchWithAuth(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, fileData: base64 })
        });

        if (res.ok) {
          const data = await res.json();
          onComplete(data.filePath);
          showToast('success', `${type.toUpperCase()} file uploaded and mapped in SQLite!`);
          fetchMedia();
        } else {
          const data = await res.json();
          showToast('error', data.error || 'Upload failed.');
        }
      } catch (err) {
        showToast('error', 'Network upload error.');
      } finally {
        setFileUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Lead Operations
  const handleOpenLeadModal = (lead: any) => {
    setSelectedLead(lead);
    setLeadStatusEdit(lead.status || 'New');
    setLeadNotesEdit(lead.notes || '');
  };

  const handleSaveLeadEdits = async () => {
    if (!selectedLead) return;
    try {
      const res = await fetchWithAuth(`/api/admin/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: leadStatusEdit, notes: leadNotesEdit })
      });
      if (res.ok) {
        showToast('success', 'Lead record updated successfully.');
        setSelectedLead(null);
        fetchLeads();
        fetchAnalytics();
      }
    } catch (e) {
      showToast('error', 'Failed to update lead.');
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (window.confirm('Delete this lead record permanently?')) {
      try {
        const res = await fetchWithAuth(`/api/admin/leads/${id}`, { method: 'DELETE' });
        if (res.ok) {
          showToast('success', 'Lead record removed.');
          fetchLeads();
          fetchAnalytics();
        }
      } catch (e) {
        showToast('error', 'Failed to delete lead.');
      }
    }
  };

  const handleDeleteMediaAsset = async (id: number) => {
    if (window.confirm('Delete this media file? It will be erased from local storage.')) {
      try {
        const res = await fetchWithAuth(`/api/admin/media/${id}`, { method: 'DELETE' });
        if (res.ok) {
          showToast('success', 'Media file deleted.');
          fetchMedia();
        }
      } catch (e) {
        showToast('error', 'Failed to remove media.');
      }
    }
  };

  // Product CRUD
  const handleAddProductClick = () => {
    setProductForm({
      id: 'product-' + Date.now(),
      name: '',
      shortDesc: '',
      description: '',
      category: 'Concrete Batching Plants',
      accentColor: 'indigo',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
      image: '/LOGO.webp',
      brochure: '',
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
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      const updatedProducts = content.products.filter(p => p.id !== prodId);
      const success = await updateContent({
        ...content,
        products: updatedProducts
      });

      if (success) {
        showToast('success', 'Product deleted successfully.');
        fetchAnalytics();
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
      image: productForm.image || '/LOGO.webp',
      brochure: productForm.brochure || '',
      additionalImages: productForm.additionalImages || [],
      features: cleanFeatures.length ? cleanFeatures : ['High-Efficiency continuous blending'],
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
      fetchAnalytics();
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

  // Helper for password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 12) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Moderate', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  // CSV Lead Export
  const handleExportCSVLeads = () => {
    if (leads.length === 0) return;
    const headers = ['Date', 'Form Source', 'Name', 'Email', 'Phone', 'Company', 'City/Country', 'Inquired Products', 'Status', 'Notes'];
    const rows = leads.map(l => [
      new Date(l.submitted_at).toLocaleDateString(),
      l.source_form,
      l.name,
      l.email,
      l.phone,
      l.company,
      `${l.city || ''} / ${l.country || ''}`,
      l.products,
      l.status,
      l.notes ? l.notes.replace(/\n/g, ' ') : ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rockmix_leads_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Leads CSV report generated!');
  };

  // Filtered Leads list
  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      l.email.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      l.company.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      l.products.toLowerCase().includes(leadsSearch.toLowerCase());
    
    const matchesSource = leadsFilter === 'all' || l.source_form === leadsFilter;
    const matchesStatus = leadsStatusFilter === 'all' || l.status === leadsStatusFilter;

    return matchesSearch && matchesSource && matchesStatus;
  });

  // Render Login state if not authenticated
  const isAuthenticated = !!localStorage.getItem('rockmix_admin_token');
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-slate-900/40 relative pt-28 sm:pt-32">
        <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-indigo-500/10 blur-3xl rounded-full -z-10"></div>
        <div className="absolute bottom-[20%] right-[10%] w-72 h-72 bg-emerald-500/10 blur-3xl rounded-full -z-10"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/80 p-8 shadow-2xl backdrop-blur-xl space-y-6 text-left"
        >
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-inner">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="font-display text-2xl font-black text-white tracking-tight">CMS Administrator Portal</h2>
            <p className="font-sans text-xs text-slate-400">Authenticate credentials to manage Rockmix site database</p>
          </div>

          {loginError && (
            <div className="flex items-center space-x-2 bg-red-950/30 text-red-400 border border-red-900/50 p-3 rounded-2xl text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 font-sans">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Admin Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 pl-10.5 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Admin Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 pl-4 pr-11 py-3 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-2xl bg-indigo-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              {loginLoading ? (
                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span>Sign In Securely</span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- Main Redesigned Dashboard View ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative font-sans pt-24 md:pt-28">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 flex items-center space-x-3 px-5 py-3 rounded-2xl border shadow-2xl backdrop-blur-md ${
              toast.type === 'success' 
                ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300' 
                : 'bg-red-950/40 border-red-900/60 text-red-300'
            }`}
          >
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span className="text-sm font-bold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-900 bg-slate-950 shrink-0 p-6 flex flex-col justify-between">
        <div className="space-y-8">
          {/* Corporate Identifier */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black">
              RM
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wider uppercase">Rockmix CMS</h1>
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-extrabold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> SQLite Active
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'content', label: 'Page Content', icon: FileText },
              { id: 'products', label: 'Product Catalog', icon: Layers },
              { id: 'media', label: 'Media Library', icon: ImageIcon },
              { id: 'leads', label: 'Leads & Inquiries', icon: Clipboard },
              { id: 'settings', label: 'System Settings', icon: Settings }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setInternalTab(item.id);
                    setIsAddingProduct(false);
                    setEditingProduct(null);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4.5 w-4.5" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User logout section */}
        <div className="pt-6 border-t border-slate-900 mt-8 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-extrabold text-sm border border-slate-700">
              U
            </div>
            <div>
              <p className="text-xs font-bold text-white">Administrator</p>
              <p className="text-[10px] text-slate-500">Access role: Superuser</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl border border-slate-900 hover:bg-red-950/20 hover:border-red-900/50 hover:text-red-400 text-slate-400 text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-grow p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Dynamic Canvas Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
          <div className="text-left space-y-1">
            <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <span>Admin Portal</span>
              <span>/</span>
              <span className="text-slate-400 capitalize">{activeTab}</span>
            </div>
            <h2 className="text-2xl font-black text-white capitalize">Site {activeTab} Console</h2>
          </div>

          {/* Quick link button to view public website */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-2 text-xs font-extrabold bg-slate-900 hover:bg-slate-850 px-4 py-2.5 rounded-xl border border-slate-800 transition-all text-indigo-400 cursor-pointer w-fit"
          >
            <span>View Public Website</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* --- TAB PANEL: DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn text-left">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Inquiries', value: analyticsData?.stats?.totalLeads ?? 0, desc: 'Cumulative submissions', icon: Clipboard, color: 'text-indigo-400' },
                { label: 'Leads Today', value: analyticsData?.stats?.leadsToday ?? 0, desc: 'Submitted in last 24h', icon: Calendar, color: 'text-emerald-400' },
                { label: 'Leads This Week', value: analyticsData?.stats?.leadsWeek ?? 0, desc: 'Submitted past 7 days', icon: TrendingUp, color: 'text-amber-400' },
                { label: 'Registered Products', value: content.products.length, desc: 'Active in marketplace', icon: Layers, color: 'text-blue-400' }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-900 p-5 rounded-2xl shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">{stat.value}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">{stat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dashboard Visualizer widgets */}
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Form distribution */}
              <div className="lg:col-span-6 bg-slate-900/60 border border-slate-900 p-6 rounded-2xl space-y-4 shadow-md">
                <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-400" />
                  <span>Leads Distribution by Form Source</span>
                </h3>
                <div className="space-y-3 pt-2">
                  {analyticsData?.sourceWise?.length ? (
                    analyticsData.sourceWise.map((src: any, idx: number) => {
                      const total = analyticsData?.stats?.totalLeads || 1;
                      const percentage = Math.round((src.count / total) * 100);
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                            <span>{src.source}</span>
                            <span>{src.count} ({percentage}%)</span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-slate-500 py-6 text-center">No lead sources mapped.</div>
                  )}
                </div>
              </div>

              {/* Product interest summary */}
              <div className="lg:col-span-6 bg-slate-900/60 border border-slate-900 p-6 rounded-2xl space-y-4 shadow-md">
                <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span>Top Product Inquiries & Interest</span>
                </h3>
                <div className="space-y-3 pt-2">
                  {analyticsData?.productSummary?.length ? (
                    analyticsData.productSummary.slice(0, 4).map((p: any, idx: number) => {
                      const total = analyticsData?.stats?.totalLeads || 1;
                      const percentage = Math.round((p.count / total) * 100);
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                            <span className="truncate max-w-[280px]">{p.products}</span>
                            <span>{p.count} leads</span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-slate-500 py-6 text-center">No product-specific interest logs.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Leads Widget */}
            <div className="bg-slate-900/60 border border-slate-900 p-6 rounded-2xl shadow-md space-y-4">
              <h3 className="font-display text-sm font-bold text-white">Recent Customer Submissions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-400 uppercase tracking-widest text-[10px] font-extrabold text-left">
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Source</th>
                      <th className="pb-3 pr-4">Company</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData?.recent?.length ? (
                      analyticsData.recent.map((lead: any, idx: number) => (
                        <tr key={idx} className="border-b border-slate-850/60 hover:bg-slate-850/20">
                          <td className="py-3.5 pr-4 whitespace-nowrap text-slate-500">
                            {new Date(lead.submitted_at).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 pr-4 font-bold text-white">{lead.name}</td>
                          <td className="py-3.5 pr-4 text-indigo-400 font-semibold">{lead.source_form}</td>
                          <td className="py-3.5 pr-4 truncate max-w-[120px]">{lead.company}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase border ${
                              lead.status === 'New' ? 'bg-indigo-950/40 text-indigo-400 border-indigo-900/50' :
                              lead.status === 'Contacted' ? 'bg-blue-950/40 text-blue-400 border-blue-900/50' :
                              lead.status === 'In Progress' ? 'bg-amber-950/40 text-amber-400 border-amber-900/50' :
                              'bg-emerald-950/40 text-emerald-400 border-emerald-900/50'
                            }`}>
                              {lead.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-500">No leads recorded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB PANEL: CONTENT MANAGER --- */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-fadeIn text-left">
            {/* Page Sub-Tabs Selector */}
            <div className="flex flex-wrap gap-2 border-b border-slate-900 pb-4">
              {[
                { id: 'global', label: 'Navigation & Global' },
                { id: 'home', label: 'Homepage' },
                { id: 'about', label: 'About Us' },
                { id: 'support', label: 'Support Desk' },
                { id: 'dealership', label: 'Partnership Page' },
                { id: 'contact', label: 'Contact details' },
                { id: 'forms', label: 'Forms & Messages' },
                { id: 'buttons', label: 'Buttons & Controls' },
                { id: 'footer', label: 'Footer Settings' }
              ].map(sub => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setContentSubTab(sub.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    contentSubTab === sub.id 
                      ? 'bg-indigo-600 text-white border border-indigo-500/30' 
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-850'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-Tab Panel: Global & Navigation */}
            {contentSubTab === 'global' && (
              <div className="space-y-6">
                <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Site Branding Settings</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Company Branding Name</label>
                      <input 
                        type="text" 
                        defaultValue={content.global.companyName}
                        onBlur={(e) => handleSaveContent('global', { ...content.global, companyName: e.target.value })}
                        className="w-full text-sm py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Header Logo Image</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={content.global.logo}
                          readOnly
                          className="flex-grow text-xs py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-400"
                        />
                        <label className="shrink-0 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5">
                          <Upload className="h-3.5 w-3.5" />
                          <span>Upload</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, 'image', (url) => handleSaveContent('global', { ...content.global, logo: url }))}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Footer Brand Description</label>
                    <textarea 
                      rows={3}
                      defaultValue={content.global.footerText}
                      onBlur={(e) => handleSaveContent('global', { ...content.global, footerText: e.target.value })}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Navbar/Menu Item list editing */}
                <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation Menu Items / Navbar Manager</h4>
                  </div>
                  <p className="text-[10px] text-slate-500">Edit menu names, reorder them, or toggle their visibility in the main header.</p>
                  
                  <div className="border border-slate-900 rounded-xl overflow-hidden">
                    <table className="w-full text-xs text-slate-300 border-collapse">
                      <thead>
                        <tr className="border-b border-slate-900 bg-slate-900/60 text-[10px] uppercase font-bold text-left text-slate-400">
                          <th className="py-2.5 px-3">Order</th>
                          <th className="py-2.5 px-3">Target ID</th>
                          <th className="py-2.5 px-3">Menu Label (Navbar Text)</th>
                          <th className="py-2.5 px-3 text-right">Visibility</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(content.global.menuItems || []).map((item, idx) => (
                          <tr key={item.id} className="border-b border-slate-900/50 hover:bg-slate-900/10">
                            <td className="py-2 px-3">
                              <div className="flex items-center space-x-1.5">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    const copy = [...(content.global.menuItems || [])];
                                    const temp = copy[idx];
                                    copy[idx] = copy[idx - 1];
                                    copy[idx - 1] = temp;
                                    handleSaveContent('global', { ...content.global, menuItems: copy });
                                  }}
                                  className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === (content.global.menuItems || []).length - 1}
                                  onClick={() => {
                                    const copy = [...(content.global.menuItems || [])];
                                    const temp = copy[idx];
                                    copy[idx] = copy[idx + 1];
                                    copy[idx + 1] = temp;
                                    handleSaveContent('global', { ...content.global, menuItems: copy });
                                  }}
                                  className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                            <td className="py-2 px-3 font-mono text-[10px] text-slate-500">{item.id}</td>
                            <td className="py-2 px-3">
                              <input 
                                type="text"
                                defaultValue={item.label}
                                onBlur={(e) => {
                                  const copy = [...(content.global.menuItems || [])];
                                  copy[idx].label = e.target.value;
                                  handleSaveContent('global', { ...content.global, menuItems: copy });
                                }}
                                className="bg-slate-950 border border-slate-850 px-2 py-1 rounded text-xs text-white max-w-[150px] focus:outline-none"
                              />
                            </td>
                            <td className="py-2 px-3 text-right">
                              <input 
                                type="checkbox"
                                defaultChecked={item.visible}
                                onChange={(e) => {
                                  const copy = [...(content.global.menuItems || [])];
                                  copy[idx].visible = e.target.checked;
                                  handleSaveContent('global', { ...content.global, menuItems: copy });
                                }}
                                className="rounded border-slate-800 bg-slate-950 text-indigo-650"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab Panel: Homepage */}
            {contentSubTab === 'home' && (
              <div className="space-y-6 bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Homepage Contents</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Main Tagline Heading</label>
                    <textarea 
                      rows={2}
                      defaultValue={content.home.heroTitle}
                      onBlur={(e) => handleSaveContent('home', { ...content.home, heroTitle: e.target.value })}
                      className="w-full text-sm py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Sub-Tagline Text</label>
                    <textarea 
                      rows={2}
                      defaultValue={content.home.heroSubtitle}
                      onBlur={(e) => handleSaveContent('home', { ...content.home, heroSubtitle: e.target.value })}
                      className="w-full text-sm py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Description Body</label>
                  <textarea 
                    rows={3}
                    defaultValue={content.home.heroDescription}
                    onBlur={(e) => handleSaveContent('home', { ...content.home, heroDescription: e.target.value })}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Browse Button Label</label>
                    <input 
                      type="text" 
                      defaultValue={content.home.buttonBrowseLabel}
                      onBlur={(e) => handleSaveContent('home', { ...content.home, buttonBrowseLabel: e.target.value })}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Quote Button Label</label>
                    <input 
                      type="text" 
                      defaultValue={content.home.buttonQuoteLabel}
                      onBlur={(e) => handleSaveContent('home', { ...content.home, buttonQuoteLabel: e.target.value })}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Callback Button Label</label>
                    <input 
                      type="text" 
                      defaultValue={content.home.buttonCallbackLabel}
                      onBlur={(e) => handleSaveContent('home', { ...content.home, buttonCallbackLabel: e.target.value })}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Hero Background Image</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={content.home.backgroundImage}
                        readOnly
                        className="flex-grow text-xs py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-400"
                      />
                      <label className="shrink-0 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, 'image', (url) => handleSaveContent('home', { ...content.home, backgroundImage: url }))}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab Panel: About Us */}
            {contentSubTab === 'about' && (
              <div className="space-y-6 bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About Us Page Configuration</h4>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={content.about.showSection}
                      onChange={(e) => handleSaveContent('about', { ...content.about, showSection: e.target.checked })}
                      className="rounded border-slate-800 bg-slate-950 text-indigo-650"
                    />
                    <span className="text-xs text-slate-300">Show Section on Website</span>
                  </label>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Title Header</label>
                    <input 
                      type="text" 
                      defaultValue={content.about.title}
                      onBlur={(e) => handleSaveContent('about', { ...content.about, title: e.target.value })}
                      className="w-full text-sm py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Subtitle Header</label>
                    <input 
                      type="text" 
                      defaultValue={content.about.subtitle}
                      onBlur={(e) => handleSaveContent('about', { ...content.about, subtitle: e.target.value })}
                      className="w-full text-sm py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Description Body</label>
                  <textarea 
                    rows={4}
                    defaultValue={content.about.description1}
                    onBlur={(e) => handleSaveContent('about', { ...content.about, description1: e.target.value })}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Page Graphics Image</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={content.about.image}
                      readOnly
                      className="flex-grow text-xs py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-400"
                    />
                    <label className="shrink-0 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, 'image', (url) => handleSaveContent('about', { ...content.about, image: url }))}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab Panel: Support Desk */}
            {contentSubTab === 'support' && (
              <div className="space-y-6">
                <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Support Section Header</h4>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={content.support.showSection}
                        onChange={(e) => handleSaveContent('support', { ...content.support, showSection: e.target.checked })}
                        className="rounded border-slate-800 bg-slate-950 text-indigo-650"
                      />
                      <span className="text-xs text-slate-300">Show Section on Website</span>
                    </label>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Title Header</label>
                      <input 
                        type="text" 
                        defaultValue={content.support.title}
                        onBlur={(e) => handleSaveContent('support', { ...content.support, title: e.target.value })}
                        className="w-full text-sm py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Description Subtitle Statement</label>
                      <input 
                        type="text" 
                        defaultValue={content.support.description}
                        onBlur={(e) => handleSaveContent('support', { ...content.support, description: e.target.value })}
                        className="w-full text-sm py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Pillars manager */}
                <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Support Pillars (4 Features)</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(content.support.pillars || []).map((pillar, idx) => (
                      <div key={idx} className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-indigo-400 font-bold uppercase">Pillar #{idx + 1}</span>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-slate-500 font-bold uppercase block">Pillar Title</label>
                          <input 
                            type="text"
                            defaultValue={pillar.title}
                            onBlur={(e) => {
                              const copy = [...(content.support.pillars || [])];
                              copy[idx].title = e.target.value;
                              handleSaveContent('support', { ...content.support, pillars: copy });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 px-2 py-1 rounded text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-slate-500 font-bold uppercase block">Description text</label>
                          <textarea 
                            rows={2}
                            defaultValue={pillar.desc}
                            onBlur={(e) => {
                              const copy = [...(content.support.pillars || [])];
                              copy[idx].desc = e.target.value;
                              handleSaveContent('support', { ...content.support, pillars: copy });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 px-2 py-1 rounded text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Helplines */}
                <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Direct Support Hotlines</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(content.support.helplines || []).map((line, idx) => (
                      <div key={idx} className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-2">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">{line.title}</span>
                        <div className="space-y-1">
                          <label className="text-[8px] text-slate-500 font-bold uppercase block">Phone Hotline</label>
                          <input 
                            type="text"
                            defaultValue={line.phone}
                            onBlur={(e) => {
                              const copy = [...(content.support.helplines || [])];
                              copy[idx].phone = e.target.value;
                              handleSaveContent('support', { ...content.support, helplines: copy });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 px-2 py-1 rounded text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-slate-500 font-bold uppercase block">Email Address</label>
                          <input 
                            type="text"
                            defaultValue={line.email}
                            onBlur={(e) => {
                              const copy = [...(content.support.helplines || [])];
                              copy[idx].email = e.target.value;
                              handleSaveContent('support', { ...content.support, helplines: copy });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 px-2 py-1 rounded text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab Panel: Dealership */}
            {contentSubTab === 'dealership' && (
              <div className="space-y-6 bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Partnership & Dealership Settings</h4>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={content.dealership.showSection}
                      onChange={(e) => handleSaveContent('dealership', { ...content.dealership, showSection: e.target.checked })}
                      className="rounded border-slate-800 bg-slate-950 text-indigo-650"
                    />
                    <span className="text-xs text-slate-300">Show Section on Website</span>
                  </label>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Title Header</label>
                    <input 
                      type="text" 
                      defaultValue={content.dealership.title}
                      onBlur={(e) => handleSaveContent('dealership', { ...content.dealership, title: e.target.value })}
                      className="w-full text-sm py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Showcase Image</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={content.dealership.image}
                        readOnly
                        className="flex-grow text-xs py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-400"
                      />
                      <label className="shrink-0 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, 'image', (url) => handleSaveContent('dealership', { ...content.dealership, image: url }))}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Partnership Pitch Description</label>
                  <textarea 
                    rows={4}
                    defaultValue={content.dealership.description}
                    onBlur={(e) => handleSaveContent('dealership', { ...content.dealership, description: e.target.value })}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Sub-Tab Panel: Contact Details */}
            {contentSubTab === 'contact' && (
              <div className="space-y-6">
                <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Us Section Header</h4>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={content.contact.showSection}
                        onChange={(e) => handleSaveContent('contact', { ...content.contact, showSection: e.target.checked })}
                        className="rounded border-slate-800 bg-slate-950 text-indigo-650"
                      />
                      <span className="text-xs text-slate-300">Show Section on Website</span>
                    </label>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Title Header</label>
                      <input 
                        type="text" 
                        defaultValue={content.contact.title}
                        onBlur={(e) => handleSaveContent('contact', { ...content.contact, title: e.target.value })}
                        className="w-full text-sm py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Description Body</label>
                      <input 
                        type="text" 
                        defaultValue={content.contact.description}
                        onBlur={(e) => handleSaveContent('contact', { ...content.contact, description: e.target.value })}
                        className="w-full text-sm py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* HQ details Card */}
                <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Corporate HQ & Works Address details</h4>
                  {(content.contact.cards || []).map((card, idx) => (
                    <div key={idx} className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] text-slate-500 font-bold uppercase block">Card / Office Title</label>
                          <input 
                            type="text"
                            defaultValue={card.title}
                            onBlur={(e) => {
                              const copy = [...(content.contact.cards || [])];
                              copy[idx].title = e.target.value;
                              handleSaveContent('contact', { ...content.contact, cards: copy });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 px-2 py-1 rounded text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-slate-500 font-bold uppercase block">Contact Person Desk</label>
                          <input 
                            type="text"
                            defaultValue={card.contactPerson}
                            onBlur={(e) => {
                              const copy = [...(content.contact.cards || [])];
                              copy[idx].contactPerson = e.target.value;
                              handleSaveContent('contact', { ...content.contact, cards: copy });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 px-2 py-1 rounded text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] text-slate-500 font-bold uppercase block">Registered Works Address (Lines separated by Enter)</label>
                        <textarea 
                          rows={3}
                          defaultValue={card.address}
                          onBlur={(e) => {
                            const copy = [...(content.contact.cards || [])];
                            copy[idx].address = e.target.value;
                            handleSaveContent('contact', { ...content.contact, cards: copy });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 px-2 py-1 rounded text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] text-slate-500 font-bold uppercase block">Hotlines (comma separated)</label>
                          <input 
                            type="text"
                            defaultValue={card.phones}
                            onBlur={(e) => {
                              const copy = [...(content.contact.cards || [])];
                              copy[idx].phones = e.target.value;
                              handleSaveContent('contact', { ...content.contact, cards: copy });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 px-2 py-1 rounded text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-slate-500 font-bold uppercase block">Sales Email Address</label>
                          <input 
                            type="text"
                            defaultValue={card.email}
                            onBlur={(e) => {
                              const copy = [...(content.contact.cards || [])];
                              copy[idx].email = e.target.value;
                              handleSaveContent('contact', { ...content.contact, cards: copy });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 px-2 py-1 rounded text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab Panel: Forms & Messages */}
            {contentSubTab === 'forms' && (
              <div className="space-y-6 bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Forms Header Titles & Success Response Prompts</h4>
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Quote Form */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-2 text-left">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase">Configure Machinery Quote Form</span>
                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-500 font-bold uppercase block">Form Header Title</label>
                      <input 
                        type="text"
                        defaultValue={content.forms.quoteTitle}
                        onBlur={(e) => handleSaveContent('forms', { ...content.forms, quoteTitle: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 px-2 py-1.5 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-500 font-bold uppercase block">Success Message Text</label>
                      <textarea 
                        rows={2}
                        defaultValue={content.forms.quoteSuccess}
                        onBlur={(e) => handleSaveContent('forms', { ...content.forms, quoteSuccess: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 px-2 py-1 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Callback Form */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-2 text-left">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase">Call Back Intake Form</span>
                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-500 font-bold uppercase block">Form Header Title</label>
                      <input 
                        type="text"
                        defaultValue={content.forms.callbackTitle}
                        onBlur={(e) => handleSaveContent('forms', { ...content.forms, callbackTitle: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 px-2 py-1.5 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-500 font-bold uppercase block">Success Message Text</label>
                      <textarea 
                        rows={2}
                        defaultValue={content.forms.callbackSuccess}
                        onBlur={(e) => handleSaveContent('forms', { ...content.forms, callbackSuccess: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 px-2 py-1 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Contact office Form */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-2 text-left">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase">General Contact Office Form</span>
                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-500 font-bold uppercase block">Form Header Title</label>
                      <input 
                        type="text"
                        defaultValue={content.forms.contactTitle}
                        onBlur={(e) => handleSaveContent('forms', { ...content.forms, contactTitle: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 px-2 py-1.5 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-500 font-bold uppercase block">Success Message Text</label>
                      <textarea 
                        rows={2}
                        defaultValue={content.forms.contactSuccess}
                        onBlur={(e) => handleSaveContent('forms', { ...content.forms, contactSuccess: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 px-2 py-1 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Dealership Application Form */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-2 text-left">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase">Dealership & Franchise Partner Application</span>
                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-500 font-bold uppercase block">Form Header Title</label>
                      <input 
                        type="text"
                        defaultValue={content.forms.dealershipTitle}
                        onBlur={(e) => handleSaveContent('forms', { ...content.forms, dealershipTitle: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 px-2 py-1.5 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-500 font-bold uppercase block">Success Message Text</label>
                      <textarea 
                        rows={2}
                        defaultValue={content.forms.dealershipSuccess}
                        onBlur={(e) => handleSaveContent('forms', { ...content.forms, dealershipSuccess: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 px-2 py-1 rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab Panel: Buttons & Controls */}
            {contentSubTab === 'buttons' && (
              <div className="space-y-6 bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Action Control Buttons Text Config</h4>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">Quote CTA Text</label>
                    <input 
                      type="text"
                      defaultValue={content.buttons.quoteBtnText}
                      onBlur={(e) => handleSaveContent('buttons', { ...content.buttons, quoteBtnText: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">Request Call Back CTA</label>
                    <input 
                      type="text"
                      defaultValue={content.buttons.callbackBtnText}
                      onBlur={(e) => handleSaveContent('buttons', { ...content.buttons, callbackBtnText: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">Download Catalogue CTA</label>
                    <input 
                      type="text"
                      defaultValue={content.buttons.brochureBtnText}
                      onBlur={(e) => handleSaveContent('buttons', { ...content.buttons, brochureBtnText: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">View Specs / Details CTA</label>
                    <input 
                      type="text"
                      defaultValue={content.buttons.detailsBtnText}
                      onBlur={(e) => handleSaveContent('buttons', { ...content.buttons, detailsBtnText: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">Browse Machinery CTA</label>
                    <input 
                      type="text"
                      defaultValue={content.buttons.machineryBtnText}
                      onBlur={(e) => handleSaveContent('buttons', { ...content.buttons, machineryBtnText: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab Panel: Footer Settings */}
            {contentSubTab === 'footer' && (
              <div className="space-y-6 bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Footer Column Headers & Copyright Text</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block">Navigation Header</label>
                    <input 
                      type="text" 
                      defaultValue={content.footer?.quickLinksHeader || 'Quick Navigation'}
                      onBlur={(e) => handleSaveContent('footer', { ...content.footer, quickLinksHeader: e.target.value })}
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block">Products Column Header</label>
                    <input 
                      type="text" 
                      defaultValue={content.footer?.productsHeader || 'Our Products'}
                      onBlur={(e) => handleSaveContent('footer', { ...content.footer, productsHeader: e.target.value })}
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase block">Copyright Notice Copy</label>
                  <input 
                    type="text" 
                    defaultValue={content.footer?.copyright || '© 2026 Rockmix Infra Equipments Pvt. Ltd. All rights reserved.'}
                    onBlur={(e) => handleSaveContent('footer', { ...content.footer, copyright: e.target.value })}
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB PANEL: PRODUCTS CATALOG --- */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn text-left">
            {/* Conditional Listing or Form Edit */}
            {!editingProduct && !isAddingProduct ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-black text-white">Configured Heavy Machinery Showcase</h3>
                  <button
                    onClick={handleAddProductClick}
                    className="flex items-center space-x-2 text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl text-white shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Register New Product</span>
                  </button>
                </div>

                <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-xs text-slate-300 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-400 uppercase tracking-widest text-[10px] font-extrabold text-left bg-slate-900/60">
                        <th className="py-3 px-4">Ordering</th>
                        <th className="py-3 px-4">Thumbnail</th>
                        <th className="py-3 px-4">Product Name</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Brochure PDF</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.products.map((prod, idx) => (
                        <tr key={prod.id} className="border-b border-slate-900/50 hover:bg-slate-900/20">
                          <td className="py-3 px-4">
                            <div className="flex flex-col items-center space-y-1">
                              <button 
                                disabled={idx === 0}
                                onClick={() => handleReorderProduct(idx, 'up')}
                                className="p-0.5 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>
                              <button 
                                disabled={idx === content.products.length - 1}
                                onClick={() => handleReorderProduct(idx, 'down')}
                                className="p-0.5 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="h-10 w-12 rounded border border-slate-800 overflow-hidden flex items-center justify-center p-1 bg-slate-950 shrink-0">
                              <img src={prod.image} alt="" className="max-h-full max-w-full object-contain" />
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-white">{prod.name}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase border border-slate-800 bg-slate-900/50">
                              {prod.category}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {prod.brochure ? (
                              <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wide flex items-center gap-1.5">
                                <Check className="h-3.5 w-3.5" /> Yes
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">None</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEditProductClick(prod)}
                                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all cursor-pointer"
                                title="Edit Product details"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-2 rounded-xl bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-950/60 transition-all cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Add / Edit Form */
              <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSaveProductForm}
                className="bg-slate-900/40 border border-slate-900 p-6 rounded-3xl space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="h-4 w-4 text-indigo-400" />
                    <span>{isAddingProduct ? 'Register New Infrastructure Machinery' : `Edit Product: ${editingProduct?.name}`}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingProduct(false);
                      setEditingProduct(null);
                    }}
                    className="p-2 rounded-full bg-slate-850 hover:bg-slate-800 text-slate-400 cursor-pointer"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Product Showcase Name</label>
                    <input 
                      type="text" 
                      required
                      value={productForm.name}
                      onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Stationary Concrete Pump"
                      className="w-full text-sm py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Machinery Category</label>
                    <select
                      value={productForm.category}
                      onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full text-sm py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="Concrete Batching Plants">Concrete Batching Plants</option>
                      <option value="Concrete Mixers">Concrete Mixers</option>
                      <option value="Paving Base Plants">Paving Base Plants</option>
                      <option value="Concrete Pumps">Concrete Pumps</option>
                      <option value="Cement Silos">Cement Silos</option>
                      <option value="Precast Moulds">Precast Moulds</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Brief/Short Description (Showcase grid card)</label>
                  <input 
                    type="text" 
                    required
                    value={productForm.shortDesc}
                    onChange={e => setProductForm({ ...productForm, shortDesc: e.target.value })}
                    placeholder="Short description snippet"
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Full Engineering Description</label>
                  <textarea 
                    rows={4}
                    required
                    value={productForm.description}
                    onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Provide deep details about operations and parameters..."
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* File mappings */}
                <div className="grid sm:grid-cols-2 gap-4 bg-slate-950/30 p-4 rounded-2xl border border-slate-900">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Primary Machinery Image</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={productForm.image}
                        readOnly
                        className="flex-grow text-xs py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-400"
                      />
                      <label className="shrink-0 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, 'image', (url) => setProductForm(prev => ({ ...prev, image: url })))}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Technical Catalogue PDF Brochure</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={productForm.brochure || ''}
                        readOnly
                        placeholder="e.g. /prd1/rb1.pdf"
                        className="flex-grow text-xs py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-400"
                      />
                      <label className="shrink-0 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload</span>
                        <input 
                          type="file" 
                          accept="application/pdf"
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, 'pdf', (url) => setProductForm(prev => ({ ...prev, brochure: url })))}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Dynamic Spec Compiler */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Technical Specifications Table</label>
                    <button
                      type="button"
                      onClick={() => setProductForm(prev => ({
                        ...prev,
                        specifications: [...(prev.specifications || []), { label: '', value: '' }]
                      }))}
                      className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Field
                    </button>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {productForm.specifications?.map((spec, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input 
                          type="text"
                          value={spec.label}
                          placeholder="Label (e.g. Mixer Type)"
                          onChange={e => {
                            const copy = [...(productForm.specifications || [])];
                            copy[idx].label = e.target.value;
                            setProductForm({ ...productForm, specifications: copy });
                          }}
                          className="flex-1 text-xs py-2 px-3 rounded-xl border border-slate-850 bg-slate-950 text-white focus:outline-none"
                        />
                        <input 
                          type="text"
                          value={spec.value}
                          placeholder="Value (e.g. Twin Shaft)"
                          onChange={e => {
                            const copy = [...(productForm.specifications || [])];
                            copy[idx].value = e.target.value;
                            setProductForm({ ...productForm, specifications: copy });
                          }}
                          className="flex-1 text-xs py-2 px-3 rounded-xl border border-slate-850 bg-slate-950 text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const copy = (productForm.specifications || []).filter((_, i) => i !== idx);
                            setProductForm({ ...productForm, specifications: copy.length ? copy : [{ label: '', value: '' }] });
                          }}
                          className="p-2 text-slate-500 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-900">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingProduct(false);
                      setEditingProduct(null);
                    }}
                    className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-indigo-600 text-white text-xs font-extrabold shadow-md shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Machinery Details</span>
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        )}

        {/* --- TAB PANEL: MEDIA LIBRARY --- */}
        {activeTab === 'media' && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-sm font-bold text-white">CMS Media Storage</h3>
                <p className="text-[10px] text-slate-500 mt-1">Direct upload of custom brochures and pictures to public repository</p>
              </div>

              <div className="flex gap-2">
                <label className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-md shadow-indigo-600/25 cursor-pointer flex items-center gap-1.5 transition-all">
                  <Upload className="h-4 w-4" />
                  <span>Upload Image</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, 'image', () => {})}
                  />
                </label>

                <label className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5 transition-all">
                  <BookOpen className="h-4 w-4 text-emerald-400" />
                  <span>Upload PDF</span>
                  <input 
                    type="file" 
                    accept="application/pdf"
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, 'pdf', () => {})}
                  />
                </label>
              </div>
            </div>

            {/* Media asset grid */}
            {mediaLoading ? (
              <div className="flex flex-col items-center py-20 text-slate-500 gap-2">
                <div className="h-6 w-6 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
                <span className="text-xs">Accessing assets library...</span>
              </div>
            ) : mediaAssets.length === 0 ? (
              <div className="py-20 border border-dashed border-slate-900 rounded-3xl text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
                <ImageIcon className="h-10 w-10 text-slate-600" />
                <div className="text-sm font-bold">No uploaded media files.</div>
                <p className="text-xs text-slate-600">Upload assets using the triggers above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaAssets.map((asset) => {
                  const isPdf = asset.mime_type === 'application/pdf';
                  return (
                    <div 
                      key={asset.id} 
                      className="bg-slate-900/40 border border-slate-900 rounded-2xl p-3 flex flex-col justify-between space-y-3 shadow-inner hover:border-slate-800 transition-all group relative overflow-hidden"
                    >
                      {/* File visualizer */}
                      <div className="h-28 rounded-lg bg-slate-950 border border-slate-900/60 overflow-hidden flex items-center justify-center p-2">
                        {isPdf ? (
                          <div className="flex flex-col items-center text-red-400 gap-1.5 select-none">
                            <BookOpen className="h-8 w-8" />
                            <span className="text-[9px] font-bold tracking-wide uppercase">PDF Brochure</span>
                          </div>
                        ) : (
                          <img src={asset.file_path} alt="" className="max-h-full max-w-full object-contain" />
                        )}
                      </div>

                      {/* File parameters */}
                      <div className="space-y-1 text-left">
                        <p className="text-xs font-bold text-white truncate" title={asset.file_name}>{asset.file_name}</p>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold">
                          <span>{asset.file_size}</span>
                          <span>{new Date(asset.uploaded_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Overlays / Action */}
                      <button
                        onClick={() => handleDeleteMediaAsset(asset.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-950/80 border border-red-900/50 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                        title="Delete File from Disk"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- TAB PANEL: LEADS & ENQUIRIES --- */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-fadeIn text-left">
            {/* Search and Filters grid */}
            <div className="bg-slate-900/60 border border-slate-900 p-5 rounded-2xl grid sm:grid-cols-12 gap-4 items-center">
              {/* Search */}
              <div className="sm:col-span-6 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input 
                  type="text" 
                  value={leadsSearch}
                  onChange={e => setLeadsSearch(e.target.value)}
                  placeholder="Search by Name, Company, Email, or Inquired Product..."
                  className="w-full text-xs py-2.5 pl-10 pr-4 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              {/* Source Filter */}
              <div className="sm:col-span-3 flex items-center space-x-2">
                <Filter className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <select
                  value={leadsFilter}
                  onChange={e => setLeadsFilter(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                >
                  <option value="all">All Forms</option>
                  <option value="Contact Us">Contact Us</option>
                  <option value="Dealership App">Dealership App</option>
                  <option value="Get a Quote">Get a Quote</option>
                  <option value="Download Brochure">Download Brochure</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="sm:col-span-3 flex items-center space-x-2">
                <select
                  value={leadsStatusFilter}
                  onChange={e => setLeadsStatusFilter(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Leads list table */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-900 flex justify-between items-center bg-slate-900/20">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Filtered submissions: {filteredLeads.length}</span>
                <button
                  onClick={handleExportCSVLeads}
                  disabled={leads.length === 0}
                  className="flex items-center space-x-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:pointer-events-none text-white px-3 py-2 rounded-xl transition-all cursor-pointer shadow"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 text-slate-400 uppercase tracking-widest text-[10px] font-extrabold text-left bg-slate-900/60">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4">Contact Details</th>
                      <th className="py-3 px-4">Inquiry / Note</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadsLoading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          <div className="h-6 w-6 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2"></div>
                          <span>Loading database records...</span>
                        </td>
                      </tr>
                    ) : filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-500">No matching leads found.</td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="border-b border-slate-900/50 hover:bg-slate-900/20 align-top">
                          <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                            {new Date(lead.submitted_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase border border-slate-800 bg-slate-900">
                              {lead.source_form}
                            </span>
                          </td>
                          <td className="py-4 px-4 space-y-1.5 text-left">
                            <p className="font-bold text-white text-sm">{lead.name}</p>
                            <div className="space-y-0.5 text-slate-400">
                              <p className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {lead.email}</p>
                              <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {lead.phone}</p>
                              <p className="flex items-center gap-1.5"><Building className="h-3 w-3" /> {lead.company}</p>
                              <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {lead.city} {lead.country ? `, ${lead.country}` : ''}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 max-w-[280px] text-left space-y-2">
                            {lead.products && lead.products !== 'N/A' && (
                              <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Interest: {lead.products}</p>
                            )}
                            <p className="text-xs font-medium text-slate-300 leading-relaxed italic bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
                              "{lead.message}"
                            </p>
                            {lead.notes && (
                              <p className="text-[10px] text-amber-400 font-medium">
                                <span className="font-bold block uppercase tracking-widest text-[8px] text-amber-500">Admin Note:</span>
                                {lead.notes}
                              </p>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase border ${
                              lead.status === 'New' ? 'bg-indigo-950/40 text-indigo-400 border-indigo-900/50' :
                              lead.status === 'Contacted' ? 'bg-blue-950/40 text-blue-400 border-blue-900/50' :
                              lead.status === 'In Progress' ? 'bg-amber-950/40 text-amber-400 border-amber-900/50' :
                              'bg-emerald-950/40 text-emerald-400 border-emerald-900/50'
                            }`}>
                              {lead.status || 'New'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => handleOpenLeadModal(lead)}
                                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all cursor-pointer"
                                title="Update Status & Add Notes"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-2 rounded-xl bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-950/60 transition-all cursor-pointer"
                                title="Delete lead record"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Leads Modal (Edit status and notes) */}
            {selectedLead && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl text-left"
                >
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                    <h3 className="font-display text-sm font-bold text-white">Manage Inquiry Status & Notes</h3>
                    <button onClick={() => setSelectedLead(null)} className="text-slate-400 p-1 hover:text-white cursor-pointer">
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Status selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Lead Status</label>
                      <select
                        value={leadStatusEdit}
                        onChange={e => setLeadStatusEdit(e.target.value)}
                        className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                      >
                        <option value="New">New (Needs evaluation)</option>
                        <option value="Contacted">Contacted (Emailed/Called)</option>
                        <option value="In Progress">In Progress (Reviewing quotation)</option>
                        <option value="Closed">Closed (Deal resolved)</option>
                      </select>
                    </div>

                    {/* Notes textarea */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Administrative Notes</label>
                      <textarea
                        rows={4}
                        value={leadNotesEdit}
                        onChange={e => setLeadNotesEdit(e.target.value)}
                        placeholder="Log timeline, customer response, or quotation requirements..."
                        className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-850">
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleSaveLeadEdits}
                      className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-extrabold hover:bg-indigo-500 cursor-pointer"
                    >
                      <Check className="h-4 w-4" />
                      <span>Save Record</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB PANEL: SYSTEM SETTINGS --- */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn text-left">
            {/* Password Credentials panel */}
            <div className="bg-slate-900/50 border border-slate-900 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-850 pb-2">Change Account Access Credentials</h3>
              <form onSubmit={handleAccountUpdate} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Current Password <span className="text-red-500">*</span></label>
                    <input 
                      type="password"
                      required
                      value={currentPass}
                      onChange={e => setCurrentPass(e.target.value)}
                      placeholder="Current Password"
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-850 bg-slate-950 text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">New Username (Optional)</label>
                    <input 
                      type="text"
                      value={newUsername}
                      onChange={e => setNewUsername(e.target.value)}
                      placeholder="New Admin Username"
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-850 bg-slate-950 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">New Secure Password</label>
                    <input 
                      type="password"
                      value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                      placeholder="At least 12 characters"
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-850 bg-slate-950 text-white focus:outline-none"
                    />
                    {/* Password Strength meter */}
                    {newPass && (
                      <div className="space-y-1 pt-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-500">Security Strength:</span>
                          <span className={
                            getPasswordStrength(newPass).label === 'Weak' ? 'text-red-400' :
                            getPasswordStrength(newPass).label === 'Moderate' ? 'text-yellow-400' :
                            'text-emerald-400'
                          }>
                            {getPasswordStrength(newPass).label}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-slate-850 rounded-full overflow-hidden">
                          <div className={`h-full ${getPasswordStrength(newPass).color}`} style={{ width: `${(getPasswordStrength(newPass).score / 5) * 100}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Confirm New Password</label>
                    <input 
                      type="password"
                      value={confirmPass}
                      onChange={e => setConfirmPass(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-850 bg-slate-950 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center space-x-1.5 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition-all cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Update Credentials</span>
                </button>
              </form>
            </div>

            {/* Database backups and Factory Resets */}
            <div className="bg-slate-900/50 border border-slate-900 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-850 pb-2">Database Backup & CMS Operations</h3>
              
              <div className="grid sm:grid-cols-3 gap-4">
                {/* Export backup button */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 flex flex-col justify-between space-y-4 text-left">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Export Database</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Saves all settings, products, and leads data as a local JSON backup file.</p>
                  </div>
                  <button
                    onClick={handleExportBackup}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl border border-slate-800 hover:bg-slate-850 text-indigo-400 text-xs font-extrabold transition-all cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                {/* Import backup button */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 flex flex-col justify-between space-y-4 text-left">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Restore Database</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Upload a JSON backup file to overwrite current site settings and leads records.</p>
                  </div>
                  <label className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl border border-slate-850 hover:bg-slate-800 text-white text-xs font-extrabold cursor-pointer transition-all">
                    <Upload className="h-4 w-4" />
                    <span>Select JSON File</span>
                    <input 
                      type="file" 
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden" 
                    />
                  </label>
                </div>

                {/* Reset Content button */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 flex flex-col justify-between space-y-4 text-left">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Factory System Reset</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Resets CMS descriptions, tags, and product catalog to factory defaults.</p>
                  </div>
                  <button
                    onClick={async () => {
                      if (window.confirm('WARNING: Reset the entire website configuration to factory default siteContent.json?')) {
                        const success = await resetContent();
                        if (success) {
                          showToast('success', 'CMS settings reset to factory defaults.');
                        }
                      }
                    }}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-red-950/20 border border-red-950/60 hover:bg-red-950/40 text-red-400 text-xs font-extrabold transition-all cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Trigger System Reset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
