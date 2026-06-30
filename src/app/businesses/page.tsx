'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import BusinessCard, { Business } from '@/components/BusinessCard';
import rawBusinesses from '@/data/businesses.json';
import categoriesData from '@/data/categories.json';

function BusinessesContent() {
  const { language, t } = useApp();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const categories = ['All', ...categoriesData.business];

  // Sync state if query parameters change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const filteredBusinesses = (rawBusinesses as Business[]).filter((b) => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch =
      search.trim() === '' ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.nameGu.includes(search) ||
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      b.descriptionGu.includes(search);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{ marginBottom: '40px' }}>
        <span style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', fontSize: '14px' }}>
          {t('businesses')}
        </span>
        <h1 style={{ fontSize: '36px', fontWeight: 800, marginTop: '8px' }}>
          {t('browseCategory')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          {t('exploreLocal')}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '16px 24px',
            fontSize: '16px',
            borderRadius: '30px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: isSelected ? 'var(--primary)' : 'var(--card-bg)',
                  color: isSelected ? 'white' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                {cat === 'All' ? t('all') : (
                  language === 'en' ? cat : (
                    cat === 'Electronics' ? 'ઇલેક્ટ્રોનિક્સ' :
                    cat === 'Food & Restaurants' ? 'ખાણીપીણી' :
                    cat === 'Healthcare' ? 'આરોગ્ય' :
                    cat === 'Education' ? 'શિક્ષણ' :
                    cat === 'Real Estate' ? 'રિયલ એસ્ટેટ' :
                    cat === 'Vehicle Sales' ? 'વાહન વેચાણ' : cat
                  )
                )}
              </button>
            );
          })}
        </div>
      </div>

      {filteredBusinesses.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {filteredBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🔍</span>
          <h3>{t('noResults')}</h3>
        </div>
      )}
    </div>
  );
}

export default function BusinessesPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>Loading...</div>}>
      <BusinessesContent />
    </Suspense>
  );
}
