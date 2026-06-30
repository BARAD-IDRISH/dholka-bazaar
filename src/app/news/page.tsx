'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import NewsCard, { NewsItem } from '@/components/NewsCard';
import rawNews from '@/data/news.json';
import categoriesData from '@/data/categories.json';

export default function NewsPage() {
  const { language, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...categoriesData.news];

  const filteredNews = (rawNews as NewsItem[]).filter((item) => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{ marginBottom: '40px' }}>
        <span style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', fontSize: '14px' }}>
          {t('news')}
        </span>
        <h1 style={{ fontSize: '36px', fontWeight: 800, marginTop: '8px' }}>
          {t('localNewsTitle')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          {t('stayInformed')}
        </p>
      </div>

      {/* Category Chips */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
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
                  cat === 'General' ? 'સામાન્ય' :
                  cat === 'Weather' ? 'હવામાન' :
                  cat === 'Events' ? 'કાર્યક્રમો' : cat
                )
              )}
            </button>
          );
        })}
      </div>

      {filteredNews.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {filteredNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📰</span>
          <h3>{t('noResults')}</h3>
        </div>
      )}
    </div>
  );
}
