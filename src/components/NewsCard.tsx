'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import styles from './Cards.module.css';

export interface NewsItem {
  id: string;
  title: string;
  titleGu: string;
  category: string;
  content: string;
  contentGu: string;
  image: string;
  date: string;
}

export default function NewsCard({ news }: { news: NewsItem }) {
  const { language, t } = useApp();

  const title = language === 'en' ? news.title : news.titleGu;
  const content = language === 'en' ? news.content : news.contentGu;
  const formattedDate = new Date(news.date).toLocaleDateString(
    language === 'en' ? 'en-US' : 'gu-IN',
    { day: 'numeric', month: 'short', year: 'numeric' }
  );

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={news.image || 'https://via.placeholder.com/600x400'} alt={title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className={styles.category}>{news.category}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📅 {formattedDate}</span>
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{content}</p>
        
        <Link href={`/news/${news.id}`} className={styles.viewDetailsLink} style={{ marginTop: 'auto' }}>
          {t('readMore')} →
        </Link>
      </div>
    </div>
  );
}
