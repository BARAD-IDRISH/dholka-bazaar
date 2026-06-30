'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import rawNews from '@/data/news.json';
import { NewsItem } from '@/components/NewsCard';

export default function NewsDetailPage() {
  const { language, t } = useApp();
  const router = useRouter();
  const { id } = useParams();

  const news = (rawNews as NewsItem[]).find((n) => n.id === id);

  if (!news) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>News not found</h2>
        <button onClick={() => router.back()} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
          Go Back
        </button>
      </div>
    );
  }

  const title = language === 'en' ? news.title : news.titleGu;
  const content = language === 'en' ? news.content : news.contentGu;
  const formattedDate = new Date(news.date).toLocaleDateString(
    language === 'en' ? 'en-US' : 'gu-IN',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
      <button
        onClick={() => router.back()}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '30px',
        }}
      >
        ← {t('back')}
      </button>

      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={news.image || 'https://via.placeholder.com/800x450'}
          alt={title}
          style={{ width: '100%', height: '400px', objectFit: 'cover' }}
        />

        <div style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span
              style={{
                backgroundColor: 'rgba(240, 160, 48, 0.1)',
                color: 'var(--accent)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              {news.category}
            </span>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              📅 {formattedDate}
            </span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '24px', lineHeight: 1.3 }}>
            {title}
          </h1>

          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-line',
            }}
          >
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
