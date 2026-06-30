'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import categoriesData from '@/data/categories.json';

export default function AdminPage() {
  const { language, t } = useApp();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Dashboard Stats & Lists
  const [activeTab, setActiveTab] = useState<'pending' | 'businesses' | 'news' | 'classifieds'>('pending');
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [classifieds, setClassifieds] = useState<any[]>([]);

  // Editing state
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editType, setEditType] = useState<'business' | 'news' | 'classified' | null>(null);

  // New item creation state
  const [creatingItem, setCreatingItem] = useState<'business' | 'news' | 'classified' | null>(null);

  // Common Form States (for Create & Edit)
  const [formName, setFormName] = useState('');
  const [formNameGu, setFormNameGu] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDescGu, setFormDescGu] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formAddressGu, setFormAddressGu] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formSeller, setFormSeller] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);

  // Check existing session on load
  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session === 'admin-secret-token') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const [resB, resN, resC] = await Promise.all([
        fetch('/api/businesses'),
        fetch('/api/news'),
        fetch('/api/classifieds')
      ]);
      const dataB = await resB.json();
      const dataN = await resN.json();
      const dataC = await resC.json();
      setBusinesses(dataB);
      setNews(dataN);
      setClassifieds(dataC);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('admin_session', data.token);
        setIsAuthenticated(true);
        fetchData();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    setIsAuthenticated(false);
  };

  // CRUD Handlers
  const handleApprove = async (type: 'business' | 'classified', id: string) => {
    try {
      const endpoint = type === 'business' ? `/api/businesses/${id}` : `/api/classifieds/${id}`;
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (type: 'business' | 'news' | 'classified', id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const endpoint = 
        type === 'business' ? `/api/businesses/${id}` : 
        type === 'news' ? `/api/news/${id}` : 
        `/api/classifieds/${id}`;
      
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Edit Dialog
  const openEdit = (type: 'business' | 'news' | 'classified', item: any) => {
    setEditType(type);
    setEditingItem(item);
    
    // Set field states
    if (type === 'business') {
      setFormName(item.name);
      setFormNameGu(item.nameGu);
      setFormCategory(item.category);
      setFormDesc(item.description);
      setFormDescGu(item.descriptionGu);
      setFormAddress(item.address);
      setFormAddressGu(item.addressGu);
      setFormPhone(item.phone);
      setFormWhatsapp(item.whatsapp);
      setFormImage(item.image);
      setFormFeatured(!!item.featured);
    } else if (type === 'news') {
      setFormName(item.title);
      setFormNameGu(item.titleGu);
      setFormCategory(item.category);
      setFormDesc(item.content);
      setFormDescGu(item.contentGu);
      setFormImage(item.image);
    } else {
      setFormName(item.title);
      setFormNameGu(item.titleGu);
      setFormCategory(item.category);
      setFormDesc(item.description);
      setFormDescGu(item.descriptionGu);
      setFormPrice(item.price.toString());
      setFormLocation(item.location);
      setFormSeller(item.sellerName);
      setFormPhone(item.phone);
      setFormWhatsapp(item.whatsapp);
      setFormImage(item.image);
    }
  };

  // Submit Edit
  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editType) return;
    
    try {
      let body: any = {};
      let endpoint = '';
      
      if (editType === 'business') {
        endpoint = `/api/businesses/${editingItem.id}`;
        body = {
          name: formName,
          nameGu: formNameGu,
          category: formCategory,
          description: formDesc,
          descriptionGu: formDescGu,
          address: formAddress,
          addressGu: formAddressGu,
          phone: formPhone,
          whatsapp: formWhatsapp,
          image: formImage,
          featured: formFeatured
        };
      } else if (editType === 'news') {
        endpoint = `/api/news/${editingItem.id}`;
        body = {
          title: formName,
          titleGu: formNameGu,
          category: formCategory,
          content: formDesc,
          contentGu: formDescGu,
          image: formImage
        };
      } else {
        endpoint = `/api/classifieds/${editingItem.id}`;
        body = {
          title: formName,
          titleGu: formNameGu,
          category: formCategory,
          description: formDesc,
          descriptionGu: formDescGu,
          price: Number(formPrice),
          location: formLocation,
          sellerName: formSeller,
          phone: formPhone,
          whatsapp: formWhatsapp,
          image: formImage
        };
      }

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setEditingItem(null);
        setEditType(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Create Dialog
  const openCreate = (type: 'business' | 'news' | 'classified') => {
    setCreatingItem(type);
    
    // Reset fields
    setFormName('');
    setFormNameGu('');
    setFormCategory(type === 'business' ? categoriesData.business[0] : type === 'news' ? categoriesData.news[0] : categoriesData.classifieds[0]);
    setFormDesc('');
    setFormDescGu('');
    setFormAddress('');
    setFormAddressGu('');
    setFormPhone('');
    setFormWhatsapp('');
    setFormImage('');
    setFormPrice('');
    setFormLocation('Dholka');
    setFormSeller('');
    setFormFeatured(false);
  };

  // Submit Create
  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatingItem) return;

    try {
      let body: any = {};
      let endpoint = '';

      if (creatingItem === 'business') {
        endpoint = '/api/businesses';
        body = {
          name: formName,
          nameGu: formNameGu || formName,
          category: formCategory,
          description: formDesc,
          descriptionGu: formDescGu || formDesc,
          address: formAddress || 'Dholka',
          addressGu: formAddressGu || formAddress || 'ધોળકા',
          phone: formPhone,
          whatsapp: formWhatsapp || formPhone,
          image: formImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
          featured: formFeatured,
          approved: true // admin added is auto-approved
        };
      } else if (creatingItem === 'news') {
        endpoint = '/api/news';
        body = {
          title: formName,
          titleGu: formNameGu || formName,
          category: formCategory,
          content: formDesc,
          contentGu: formDescGu || formDesc,
          image: formImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80'
        };
      } else {
        endpoint = '/api/classifieds';
        body = {
          title: formName,
          titleGu: formNameGu || formName,
          category: formCategory,
          description: formDesc,
          descriptionGu: formDescGu || formDesc,
          price: Number(formPrice),
          location: formLocation,
          sellerName: formSeller,
          phone: formPhone,
          whatsapp: formWhatsapp || formPhone,
          image: formImage || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
          approved: true
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setCreatingItem(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '80px 20px', maxWidth: '450px', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '40px', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span style={{ fontSize: '48px' }}>🛡️</span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginTop: '12px' }}>{t('adminLogin')}</h2>
          </div>
          
          <form onSubmit={handleLogin}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>{t('password')}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px 20px', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '20px', outline: 'none' }}
              placeholder="Enter admin password (hint: admin123)"
            />
            {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '20px' }}>⚠️ {error}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: 'var(--primary)', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>
              {loading ? 'Verifying...' : t('login')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Approved vs Pending Lists
  const pendingB = businesses.filter((b) => !b.approved);
  const pendingC = classifieds.filter((c) => !c.approved);
  const totalPending = pendingB.length + pendingC.length;

  const thStyle: React.CSSProperties = { padding: '16px 20px', textAlign: 'left', fontWeight: 700, borderBottom: '2px solid var(--border-color)' };
  const tdStyle: React.CSSProperties = { padding: '16px 20px', borderBottom: '1px solid var(--border-color)', fontSize: '14px' };

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800 }}>🛡️ Admin Control Panel</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage all directories, approvals, and content.</p>
        </div>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          Logout 🚪
        </button>
      </div>

      {/* Dashboard Sub-navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('pending')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'pending' ? 'var(--accent)' : 'transparent', color: activeTab === 'pending' ? 'white' : 'var(--text-primary)', fontWeight: 700, cursor: 'pointer' }}>
          ⏳ Pending Approvals ({totalPending})
        </button>
        <button onClick={() => setActiveTab('businesses')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'businesses' ? 'var(--accent)' : 'transparent', color: activeTab === 'businesses' ? 'white' : 'var(--text-primary)', fontWeight: 700, cursor: 'pointer' }}>
          🏢 Businesses ({businesses.length})
        </button>
        <button onClick={() => setActiveTab('news')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'news' ? 'var(--accent)' : 'transparent', color: activeTab === 'news' ? 'white' : 'var(--text-primary)', fontWeight: 700, cursor: 'pointer' }}>
          📰 News & Updates ({news.length})
        </button>
        <button onClick={() => setActiveTab('classifieds')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'classifieds' ? 'var(--accent)' : 'transparent', color: activeTab === 'classifieds' ? 'white' : 'var(--text-primary)', fontWeight: 700, cursor: 'pointer' }}>
          🏷️ Classifieds ({classifieds.length})
        </button>
      </div>

      {/* Main Panel Content */}
      <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '30px', boxShadow: 'var(--shadow)' }}>
        
        {/* Tab 1: Pending Approvals */}
        {activeTab === 'pending' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>⏳ Listings Requesting Approval</h2>
            {totalPending === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No pending approvals.</p>
            ) : (
              <div>
                {/* Pending Businesses */}
                {pendingB.length > 0 && (
                  <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', color: 'var(--accent)' }}>Pending Businesses</h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ color: 'var(--text-primary)' }}>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Category</th>
                            <th style={thStyle}>Phone</th>
                            <th style={thStyle}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingB.map((b) => (
                            <tr key={b.id}>
                              <td style={tdStyle}>{b.name}</td>
                              <td style={tdStyle}>{b.category}</td>
                              <td style={tdStyle}>{b.phone}</td>
                              <td style={tdStyle}>
                                <button onClick={() => handleApprove('business', b.id)} style={{ marginRight: '10px', padding: '6px 12px', backgroundColor: 'var(--success)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Approve</button>
                                <button onClick={() => handleDelete('business', b.id)} style={{ padding: '6px 12px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Pending Classifieds */}
                {pendingC.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', color: 'var(--accent)' }}>Pending Classifieds</h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ color: 'var(--text-primary)' }}>
                            <th style={thStyle}>Item</th>
                            <th style={thStyle}>Price</th>
                            <th style={thStyle}>Seller</th>
                            <th style={thStyle}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingC.map((c) => (
                            <tr key={c.id}>
                              <td style={tdStyle}>{c.title}</td>
                              <td style={tdStyle}>₹{c.price}</td>
                              <td style={tdStyle}>{c.sellerName}</td>
                              <td style={tdStyle}>
                                <button onClick={() => handleApprove('classified', c.id)} style={{ marginRight: '10px', padding: '6px 12px', backgroundColor: 'var(--success)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Approve</button>
                                <button onClick={() => handleDelete('classified', c.id)} style={{ padding: '6px 12px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Businesses Directory */}
        {activeTab === 'businesses' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>🏢 Active Businesses</h2>
              <button onClick={() => openCreate('business')} style={{ padding: '8px 16px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>+ Add Business</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: 'var(--text-primary)' }}>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Category</th>
                    <th style={thStyle}>Featured</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((b) => (
                    <tr key={b.id}>
                      <td style={tdStyle}>{b.name}</td>
                      <td style={tdStyle}>{b.category}</td>
                      <td style={tdStyle}>{b.featured ? '⭐ Yes' : 'No'}</td>
                      <td style={tdStyle}>
                        <button onClick={() => openEdit('business', b)} style={{ marginRight: '10px', padding: '6px 12px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleDelete('business', b.id)} style={{ padding: '6px 12px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: News Updates */}
        {activeTab === 'news' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>📰 News & Updates</h2>
              <button onClick={() => openCreate('news')} style={{ padding: '8px 16px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>+ Add News</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: 'var(--text-primary)' }}>
                    <th style={thStyle}>Title</th>
                    <th style={thStyle}>Category</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((n) => (
                    <tr key={n.id}>
                      <td style={tdStyle}>{n.title}</td>
                      <td style={tdStyle}>{n.category}</td>
                      <td style={tdStyle}>{n.date}</td>
                      <td style={tdStyle}>
                        <button onClick={() => openEdit('news', n)} style={{ marginRight: '10px', padding: '6px 12px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleDelete('news', n.id)} style={{ padding: '6px 12px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Classifieds */}
        {activeTab === 'classifieds' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>🏷️ Marketplace Classifieds</h2>
              <button onClick={() => openCreate('classified')} style={{ padding: '8px 16px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>+ Add Classified</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: 'var(--text-primary)' }}>
                    <th style={thStyle}>Item</th>
                    <th style={thStyle}>Price</th>
                    <th style={thStyle}>Seller</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classifieds.map((c) => (
                    <tr key={c.id}>
                      <td style={tdStyle}>{c.title}</td>
                      <td style={tdStyle}>₹{c.price}</td>
                      <td style={tdStyle}>{c.sellerName}</td>
                      <td style={tdStyle}>
                        <button onClick={() => openEdit('classified', c)} style={{ marginRight: '10px', padding: '6px 12px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleDelete('classified', c.id)} style={{ padding: '6px 12px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Edit Form Modal (Overlay style for speed/clarity) */}
      {(editingItem || creatingItem) && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', overflowY: 'auto' }}>
          <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px', padding: '30px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
              {creatingItem ? `Add New ${creatingItem}` : `Edit ${editType}`}
            </h2>
            
            <form onSubmit={creatingItem ? submitCreate : submitEdit}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Title/Name (English)</label>
              <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '14px', outline: 'none' }} />

              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Title/Name (Gujarati)</label>
              <input type="text" value={formNameGu} onChange={(e) => setFormNameGu(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '14px', outline: 'none' }} />

              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Category</label>
              <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '14px', outline: 'none' }}>
                {(creatingItem === 'business' || editType === 'business') ? categoriesData.business.map(cat => <option key={cat} value={cat}>{cat}</option>) :
                 (creatingItem === 'news' || editType === 'news') ? categoriesData.news.map(cat => <option key={cat} value={cat}>{cat}</option>) :
                 categoriesData.classifieds.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>

              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Description/Content (English)</label>
              <textarea required value={formDesc} onChange={(e) => setFormDesc(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '14px', outline: 'none', height: '100px', resize: 'vertical' }} />

              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Description/Content (Gujarati)</label>
              <textarea value={formDescGu} onChange={(e) => setFormDescGu(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '14px', outline: 'none', height: '100px', resize: 'vertical' }} />

              {/* Business specific fields */}
              {(creatingItem === 'business' || editType === 'business') && (
                <>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Address (English)</label>
                  <input type="text" value={formAddress} onChange={(e) => setFormAddress(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '14px', outline: 'none' }} />

                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Address (Gujarati)</label>
                  <input type="text" value={formAddressGu} onChange={(e) => setFormAddressGu(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '14px', outline: 'none' }} />

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700 }}>
                      <input type="checkbox" checked={formFeatured} onChange={(e) => setFormFeatured(e.target.checked)} />
                      Featured Listing ⭐
                    </label>
                  </div>
                </>
              )}

              {/* Classified specific fields */}
              {(creatingItem === 'classified' || editType === 'classified') && (
                <>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Price (₹)</label>
                  <input type="number" required value={formPrice} onChange={(e) => setFormPrice(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '14px', outline: 'none' }} />

                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Location</label>
                  <input type="text" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '14px', outline: 'none' }} />

                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Seller Name</label>
                  <input type="text" required value={formSeller} onChange={(e) => setFormSeller(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '14px', outline: 'none' }} />
                </>
              )}

              {/* Contact numbers for Business / Classified */}
              {(creatingItem !== 'news' && editType !== 'news') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Phone Number</label>
                    <input type="tel" required value={formPhone} onChange={(e) => setFormPhone(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '14px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>WhatsApp Number</label>
                    <input type="tel" value={formWhatsapp} onChange={(e) => setFormWhatsapp(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '14px', outline: 'none' }} />
                  </div>
                </div>
              )}

              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Image URL</label>
              <input type="url" value={formImage} onChange={(e) => setFormImage(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px', outline: 'none' }} />

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => { setEditingItem(null); setEditType(null); setCreatingItem(null); }} style={{ padding: '10px 20px', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
