'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import styles from './Cards.module.css';

export interface Classified {
  id: string;
  title: string;
  titleGu: string;
  category: string;
  description: string;
  descriptionGu: string;
  price: number;
  location: string;
  sellerName: string;
  phone: string;
  whatsapp: string;
  image: string;
}

export default function ClassifiedCard({ item }: { item: Classified }) {
  const { language, t } = useApp();

  const title = language === 'en' ? item.title : item.titleGu;
  const description = language === 'en' ? item.description : item.descriptionGu;

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image || 'https://via.placeholder.com/400x300'} alt={title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <span className={styles.category}>{item.category}</span>
        <h3 className={styles.title} style={{ minHeight: '50px' }}>{title}</h3>
        <div className={styles.price}>₹{item.price.toLocaleString(language === 'en' ? 'en-IN' : 'gu-IN')}</div>
        <p className={styles.description}>{description}</p>
        
        <div className={styles.metaInfo}>
          <div className={styles.metaItem}>
            📍 <span>{item.location} • {item.sellerName}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <a
            href={`https://wa.me/${item.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.waBtn}
          >
            💬 {t('whatsapp')}
          </a>
          <a href={`tel:${item.phone}`} className={styles.callBtn}>
            📞 {t('call')}
          </a>
        </div>
      </div>
    </div>
  );
}
