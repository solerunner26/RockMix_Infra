import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent, DEFAULT_CONTENT } from '../data/defaultContent';

interface SiteContentContextType {
  content: SiteContent;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminAuthenticated: boolean;
  token: string | null;
  updateContent: (newContent: SiteContent) => Promise<boolean>;
  resetContent: () => Promise<boolean>;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  changePassword: (currentPass: string, newPass?: string, newUsername?: string) => Promise<{ success: boolean; message: string }>;
  uploadImage: (fileName: string, base64Data: string) => Promise<string | null>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [activeTab, setActiveTabState] = useState<string>('home');
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem('rockmix_admin_token');
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('rockmix_admin_token');
  });

  // Fetch content on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const data = await response.json();
          setContent(data);
          return;
        }
      } catch (err) {
        console.warn('Backend API /api/content not reachable. Falling back to localStorage/defaults.', err);
      }

      // Local Fallback
      const local = localStorage.getItem('rockmix_site_content');
      if (local) {
        try {
          setContent(JSON.parse(local));
        } catch (e) {
          console.error('Error parsing localStorage site content:', e);
        }
      }
    };

    fetchContent();
  }, []);

  // Handle URL Sync & History
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const cleanPath = path.replace(/^\//, '');
      if (cleanPath === 'admin') {
        setActiveTabState('admin');
      } else if (['home', 'about', 'products', 'support', 'terms', 'dealership', 'inquiry', 'contact'].includes(cleanPath)) {
        setActiveTabState(cleanPath);
      } else {
        setActiveTabState('home');
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    const targetUrl = tab === 'home' ? '/' : `/${tab}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper for Authenticated Fetches
  const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const headers = new Headers(options.headers || {});
    const activeToken = token || localStorage.getItem('rockmix_admin_token');
    if (activeToken) {
      headers.set('Authorization', `Bearer ${activeToken}`);
    }
    return fetch(url, { ...options, headers });
  };

  // 1. Update Content
  const updateContent = async (newContent: SiteContent): Promise<boolean> => {
    try {
      const response = await fetchWithAuth('/api/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
      });

      if (response.ok) {
        setContent(newContent);
        localStorage.setItem('rockmix_site_content', JSON.stringify(newContent));
        return true;
      }
    } catch (err) {
      console.warn('Backend API content update failed. Using localStorage fallback.', err);
    }

    localStorage.setItem('rockmix_site_content', JSON.stringify(newContent));
    setContent(newContent);
    return true;
  };

  // 2. Reset to Default Content
  const resetContent = async (): Promise<boolean> => {
    try {
      const response = await fetchWithAuth('/api/content/reset', { method: 'POST' });
      if (response.ok) {
        setContent(DEFAULT_CONTENT);
        localStorage.removeItem('rockmix_site_content');
        return true;
      }
    } catch (err) {
      console.warn('Backend API content reset failed. Using localStorage fallback.', err);
    }

    localStorage.removeItem('rockmix_site_content');
    setContent(DEFAULT_CONTENT);
    return true;
  };

  // 3. Admin Login
  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.token) {
        setTokenState(data.token);
        setIsAdminAuthenticated(true);
        localStorage.setItem('rockmix_admin_token', data.token);
        
        // Sync cookie for static file uploads
        document.cookie = `rockmix_session=${data.token}; path=/; max-age=86400; SameSite=Strict; Secure`;
        
        return { success: true, message: 'Authenticated successfully.' };
      } else {
        return { success: false, message: data.error || 'Invalid username or password.' };
      }
    } catch (err) {
      console.warn('Backend admin login failed, attempting local fallback.', err);
      const storedPass = localStorage.getItem('rockmix_admin_password') || 'Rock@2026#mix';
      if (username === 'rockmin' && password === storedPass) {
        const dummyToken = 'dummy-token-' + Date.now();
        setTokenState(dummyToken);
        setIsAdminAuthenticated(true);
        localStorage.setItem('rockmix_admin_token', dummyToken);
        return { success: true, message: 'Authenticated successfully (local prototype).' };
      }
      return { success: false, message: 'Invalid credentials. Please verify your admin username and password.' };
    }
  };

  // 4. Admin Logout
  const logout = () => {
    setTokenState(null);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('rockmix_admin_token');
    document.cookie = 'rockmix_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure';
    setActiveTab('home');
  };

  // 5. Change Password & Account Details
  const changePassword = async (currentPass: string, newPass?: string, newUsername?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetchWithAuth('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass, newUsername: newUsername }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        if (newUsername) {
          // If username changed, force logout to re-authenticate with new username/token
          logout();
          return { success: true, message: 'Username changed successfully. Please log in again.' };
        }
        return { success: true, message: data.message || 'Account credentials updated successfully.' };
      } else {
        return { success: false, message: data.error || 'Failed to update account credentials.' };
      }
    } catch (err) {
      console.warn('Backend credentials update failed. Using localStorage fallback.', err);
      const storedPass = localStorage.getItem('rockmix_admin_password') || 'Rock@2026#mix';
      if (currentPass !== storedPass) {
        return { success: false, message: 'Current password verification failed.' };
      }
      if (newPass) {
        localStorage.setItem('rockmix_admin_password', newPass);
      }
      if (newUsername) {
        localStorage.setItem('rockmix_admin_username', newUsername);
      }
      return { success: true, message: 'Account credentials updated locally (local prototype).' };
    }
  };

  // 6. Image Upload
  const uploadImage = async (fileName: string, base64Data: string): Promise<string | null> => {
    try {
      const response = await fetchWithAuth('/api/image/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, fileData: base64Data }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.filePath;
      }
    } catch (err) {
      console.warn('Image upload API failed. Saving as local data URL.', err);
    }

    return base64Data;
  };

  return (
    <SiteContentContext.Provider value={{
      content,
      activeTab,
      setActiveTab,
      isAdminAuthenticated,
      token,
      updateContent,
      resetContent,
      login,
      logout,
      changePassword,
      uploadImage,
      fetchWithAuth,
    }}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
