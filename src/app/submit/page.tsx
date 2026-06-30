'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import categoriesData from '@/data/categories.json';

export default function SubmitListingPage() {
  const { language, t } = useApp();
  const [activeTab, setActiveTab] = useState<'business' | 'classified'>('business');
  
  // Success states
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states - Business
  const [bName, setBName] = useState('');
  const [bNameGu, setBNameGu] = useState('');
  const [bCategory, setBCategory] = useState(categoriesData.business[0]);
  const [bDesc, setBDesc] = useState('');
  const [bDescGu, setBDescGu] = useState('');
  const [bAddress, setBAddress] = useState('');
  const [bAddressGu, setBAddressGu] = useState('');
  const [bPhone, setBPhone] = useState('');
  const [bWhatsapp, setBWhatsapp] = useState('');
  const [bImage, setBImage] = useState('');

  // Form states - Classified
  const [cName, setCName] = useState('');
  const [cNameGu, setCNameGu] = useState('');
  const [cCategory, setCCategory] = useState(categoriesData.classifieds[0]);
  const [cDesc, setCDesc] = useState('');
  const [cDescGu, setCDescGu] = useState('');
  const [cPrice, setCPrice] = useState('');
  const [cLocation, setCLocation] = useState('Dholka');
  const [cSellerName, setCSellerName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cWhatsapp, setCWhatsapp] = useState('');
  const [cImage, setCImage] = useState('');

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: bName,
          nameGu: bNameGu || bName,
          category: bCategory,
          description: bDesc,
          descriptionGu: bDescGu || bDesc,
          address: bAddress || 'Dholka',
          addressGu: bAddressGu || bAddress || 'ધોળકા',
          phone: bPhone,
          whatsapp: bWhatsapp || bPhone,
          image: bImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80'
        })
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClassifiedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/classifieds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: cName,
          titleGu: cNameGu || cName,
          category: cCategory,
          description: cDesc,
          descriptionGu: cDescGu || cDesc,
          price: Number(cPrice),
          location: cLocation,
          sellerName: cSellerName,
          phone: cPhone,
          whatsapp: cWhatsapp || cPhone,
          image: cImage || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'
        })
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container" style={{ padding: '80px 20px', maxWidth: '600px', textAlign: 'center' }}>
        <span style={{ fontSize: '64px', display: 'block', marginBottom: '24px' }}>🎉</span>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
          {language === 'en' ? 'Submitted Successfully!' : 'સફળતાપૂર્વક સબમિટ કર્યું!'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '16px', lineHeight: 1.6 }}>
          {language === 'en' 
            ? 'Your listing has been submitted for approval. It will appear on the platform once approved by our administrator.' 
            : 'તમારું લિસ્ટિંગ મંજૂરી માટે સબમિટ કરવામાં આવ્યું છે. એડમિનિસ્ટ્રેટર દ્વારા મંજૂર થયા પછી તે પ્લેટફોર્મ પર દેખાશે.'}
        </p>
        <button 
          onClick={() => {
            setSubmitted(false);
            // Clear forms
            setBName(''); setBNameGu(''); setBDesc(''); setBDescGu(''); setBAddress(''); setBAddressGu(''); setBPhone(''); setBWhatsapp(''); setBImage('');
            setCName(''); setCNameGu(''); setCDesc(''); setCDescGu(''); setCPrice(''); setCSellerName(''); setCPhone(''); setCWhatsapp(''); setCImage('');
          }}
          className="ctaBtn"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            padding: '12px 30px',
            borderRadius: '30px',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {language === 'en' ? 'Submit Another' : 'બીજું સબમિટ કરો'}
        </button>
      </div>
    );
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '8px',
    textTransform: 'uppercase'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 20px',
    fontSize: '15px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-primary)',
    outline: 'none',
    marginBottom: '20px'
  };

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '700px', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800 }}>{t('submitTitle')}</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '30px' }}>
        <button
          onClick={() => setActiveTab('business')}
          style={{
            flex: 1,
            padding: '16px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            backgroundColor: activeTab === 'business' ? 'var(--accent)' : 'var(--card-bg)',
            color: activeTab === 'business' ? 'white' : 'var(--text-primary)',
            transition: 'var(--transition)'
          }}
        >
          🏢 {t('businessTab')}
        </button>
        <button
          onClick={() => setActiveTab('classified')}
          style={{
            flex: 1,
            padding: '16px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            backgroundColor: activeTab === 'classified' ? 'var(--accent)' : 'var(--card-bg)',
            color: activeTab === 'classified' ? 'white' : 'var(--text-primary)',
            transition: 'var(--transition)'
          }}
        >
          🏷️ {t('classifiedTab')}
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--card-bg)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
        {activeTab === 'business' ? (
          <form onSubmit={handleBusinessSubmit}>
            <label style={labelStyle}>{t('nameLabel')} *</label>
            <input type="text" required value={bName} onChange={(e) => setBName(e.target.value)} style={inputStyle} placeholder="e.g. Patel Sweets & Farsan" />

            <label style={labelStyle}>{t('nameGuLabel')}</label>
            <input type="text" value={bNameGu} onChange={(e) => setBNameGu(e.target.value)} style={inputStyle} placeholder="દા.ત. પટેલ સ્વીટ્સ એન્ડ ફરસાણ" />

            <label style={labelStyle}>{t('categoryLabel')}</label>
            <select value={bCategory} onChange={(e) => setBCategory(e.target.value)} style={inputStyle}>
              {categoriesData.business.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <label style={labelStyle}>{t('descLabel')} *</label>
            <textarea required value={bDesc} onChange={(e) => setBDesc(e.target.value)} style={{ ...inputStyle, height: '120px', resize: 'vertical' }} placeholder="Provide business description..." />

            <label style={labelStyle}>{t('descGuLabel')}</label>
            <textarea value={bDescGu} onChange={(e) => setBDescGu(e.target.value)} style={{ ...inputStyle, height: '120px', resize: 'vertical' }} placeholder="વ્યવસાયનું વર્ણન અહીં લખો..." />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>{t('addressLabel')}</label>
                <input type="text" value={bAddress} onChange={(e) => setBAddress(e.target.value)} style={inputStyle} placeholder="e.g. Main Market, Dholka" />
              </div>
              <div>
                <label style={labelStyle}>{t('addressGuLabel')}</label>
                <input type="text" value={bAddressGu} onChange={(e) => setBAddressGu(e.target.value)} style={inputStyle} placeholder="દા.ત. મુખ્ય બજાર, ધોળકા" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>{t('phoneLabel')} *</label>
                <input type="tel" required value={bPhone} onChange={(e) => setBPhone(e.target.value)} style={inputStyle} placeholder="+91 98XXX XXXXX" />
              </div>
              <div>
                <label style={labelStyle}>{t('whatsappLabel')}</label>
                <input type="tel" value={bWhatsapp} onChange={(e) => setBWhatsapp(e.target.value)} style={inputStyle} placeholder="e.g. 9198XXXXXXXX (no + or spaces)" />
              </div>
            </div>

            <label style={labelStyle}>{t('imageUrlLabel')}</label>
            <input type="url" value={bImage} onChange={(e) => setBImage(e.target.value)} style={inputStyle} placeholder="https://images.unsplash.com/..." />

            <button type="submit" disabled={loading} className="ctaBtn" style={{ width: '100%', border: 'none', padding: '16px', borderRadius: '30px', fontWeight: 700, cursor: 'pointer', backgroundColor: 'var(--accent)', color: 'white', fontSize: '16px' }}>
              {loading ? 'Submitting...' : t('submitBtn')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleClassifiedSubmit}>
            <label style={labelStyle}>{t('nameLabel')} *</label>
            <input type="text" required value={cName} onChange={(e) => setCName(e.target.value)} style={inputStyle} placeholder="e.g. Wooden Dining Table" />

            <label style={labelStyle}>{t('nameGuLabel')}</label>
            <input type="text" value={cNameGu} onChange={(e) => setCNameGu(e.target.value)} style={inputStyle} placeholder="દા.ત. લાકડાનું ડાઇનિંગ ટેબલ" />

            <label style={labelStyle}>{t('categoryLabel')}</label>
            <select value={cCategory} onChange={(e) => setCCategory(e.target.value)} style={inputStyle}>
              {categoriesData.classifieds.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <label style={labelStyle}>{t('descLabel')} *</label>
            <textarea required value={cDesc} onChange={(e) => setCDesc(e.target.value)} style={{ ...inputStyle, height: '120px', resize: 'vertical' }} placeholder="Condition, usage detail, size etc..." />

            <label style={labelStyle}>{t('descGuLabel')}</label>
            <textarea value={cDescGu} onChange={(e) => setCDescGu(e.target.value)} style={{ ...inputStyle, height: '120px', resize: 'vertical' }} placeholder="વસ્તુની વિગતો લખો..." />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>{t('priceLabel')} *</label>
                <input type="number" required value={cPrice} onChange={(e) => setCPrice(e.target.value)} style={inputStyle} placeholder="e.g. 5000" />
              </div>
              <div>
                <label style={labelStyle}>{t('locationLabel')}</label>
                <input type="text" value={cLocation} onChange={(e) => setCLocation(e.target.value)} style={inputStyle} placeholder="e.g. Dholka" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>{t('sellerLabel')} *</label>
                <input type="text" required value={cSellerName} onChange={(e) => setCSellerName(e.target.value)} style={inputStyle} placeholder="Your Name" />
              </div>
              <div>
                <label style={labelStyle}>{t('phoneLabel')}</label>
                <input type="tel" value={cPhone} onChange={(e) => setCPhone(e.target.value)} style={inputStyle} placeholder="+91 98XXX XXXXX" />
              </div>
            </div>

            <label style={labelStyle}>{t('whatsappLabel')}</label>
            <input type="tel" value={cWhatsapp} onChange={(e) => setCWhatsapp(e.target.value)} style={inputStyle} placeholder="e.g. 9198XXXXXXXX (no + or spaces)" />

            <label style={labelStyle}>{t('imageUrlLabel')}</label>
            <input type="url" value={cImage} onChange={(e) => setCImage(e.target.value)} style={inputStyle} placeholder="https://images.unsplash.com/..." />

            <button type="submit" disabled={loading} className="ctaBtn" style={{ width: '100%', border: 'none', padding: '16px', borderRadius: '30px', fontWeight: 700, cursor: 'pointer', backgroundColor: 'var(--accent)', color: 'white', fontSize: '16px' }}>
              {loading ? 'Submitting...' : t('submitBtn')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
