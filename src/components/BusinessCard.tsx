'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import styles from './Cards.module.css';

export interface Business {
  id: string;
  name: string;
  nameGu: string;
  category: string;
  description: string;
  descriptionGu: string;
  address: string;
  addressGu: string;
  phone: string;
  whatsapp: string;
  image: string;
  featured?: boolean;
}

export default function BusinessCard({ business }: { business: Business }) {
  const { language, t } = useApp();

  const name = language === 'en' ? business.name : business.nameGu;
  const description = language === 'en' ? business.description : business.descriptionGu;
  const address = language === 'en' ? business.address : business.addressGu;

  // Generate fallback placeholder using SVG if needed, but since we can generate images, we have set valid names
  const imageUrl = business.image || 'https://via.placeholder.com/400x300';

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={name} className={styles.image} />
        {business.featured && <span className={styles.badge}>{t('featured')}</span>}
      </div>
      <div className={styles.content}>
        <span className={styles.category}>{business.category}</span>
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.description}>{description}</p>
        
        <div className={styles.metaInfo}>
          <div className={styles.metaItem}>
            📍 <span>{address}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <a
            href={`https://wa.me/${business.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.waBtn}
          >
            💬 {t('whatsapp')}
          </a>
          <a href={`tel:${business.phone}`} className={styles.callBtn}>
            📞 {t('call')}
          </a>
        </div>

        <Link href={`/businesses/${business.id}`} className={styles.viewDetailsLink}>
          {t('viewDetails')} →
        </Link>
      </div>
    </div>
  );
}
