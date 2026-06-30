'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import ClassifiedCard, { Classified } from '@/components/ClassifiedCard';
import rawClassifieds from '@/data/classifieds.json';
import categoriesData from '@/data/categories.json';

export default function ClassifiedsPage() {
  const { language, t } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...categoriesData.classifieds];

  const filteredClassifieds = (rawClassifieds as Classified[]).filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      search.trim() === '' ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.titleGu.includes(search) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.descriptionGu.includes(search);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{ marginBottom: '40px' }}>
        <span style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', fontSize: '14px' }}>
          {t('classifieds')}
        </span>
        <h1 style={{ fontSize: '36px', fontWeight: 800, marginTop: '8px' }}>
          {t('secondHandTitle')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          {t('popularItems')}
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
                    cat === 'Furniture' ? 'ફર્નિચર' :
                    cat === 'Vehicles' ? 'વાહનો' :
                    cat === 'Phones' ? 'ફોન' :
                    cat === 'Others' ? 'અન્ય' : cat
                  )
                )}
              </button>
            );
          })}
        </div>
      </div>

      {filteredClassifieds.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {filteredClassifieds.map((item) => (
            <ClassifiedCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🏷️</span>
          <h3>{t('noResults')}</h3>
        </div>
      )}
    </div>
  );
}
