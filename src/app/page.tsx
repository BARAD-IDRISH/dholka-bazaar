'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import styles from './page.module.css';
import BusinessCard, { Business } from '@/components/BusinessCard';
import NewsCard, { NewsItem } from '@/components/NewsCard';
import ClassifiedCard, { Classified } from '@/components/ClassifiedCard';

// Import data statically for simplicity on client side or fetch in useEffect
import rawBusinesses from '@/data/businesses.json';
import rawNews from '@/data/news.json';
import rawClassifieds from '@/data/classifieds.json';

const categoryIcons: Record<string, string> = {
  'Electronics': '🔌',
  'Food & Restaurants': '🍲',
  'Healthcare': '🏥',
  'Education': '🎓',
  'Real Estate': '🏠',
  'Vehicle Sales': '🚗',
  'Clothing & Fashion': '👕',
  'Grocery': '🛒',
  'Services': '🛠️'
};

export default function Home() {
  const { language, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter approved listings
  const featuredBusinesses = (rawBusinesses as Business[])
    .filter(b => b.featured);
  
  const recentNews = (rawNews as NewsItem[])
    .slice(0, 3);
  
  const recentClassifieds = (rawClassifieds as Classified[])
    .slice(0, 4);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.locationBadge}>
            📍 {language === 'en' ? 'Dholka, Gujarat • ધોળકા' : 'ધોળકા, ગુજરાત • Dholka'}
          </div>
          <h1 className={styles.heroTitle}>{t('discoverTitle')}</h1>
          <p className={styles.heroSub}>{t('discoverSub')}</p>
          
          <form className={styles.searchForm} onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link 
              href={`/businesses?search=${encodeURIComponent(searchQuery)}`} 
              className={styles.searchBtn}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {t('searchBtn')}
            </Link>
          </form>

          <div className={styles.badges}>
            <div className={styles.badgeItem}>
              <span className={styles.badgeIcon}>✨</span>
              <span>{t('verifiedShops')}</span>
            </div>
            <div className={styles.badgeItem}>
              <span className={styles.badgeIcon}>📰</span>
              <span>{t('localNews')}</span>
            </div>
            <div className={styles.badgeItem}>
              <span className={styles.badgeIcon}>🤝</span>
              <span>{t('trustedClassifieds')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className={styles.section} style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="container">
          <div className={styles.sectionHeader} style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div>
              <h2 className={styles.sectionTitle}>{t('browseCategory')}</h2>
              <p className={styles.sectionSub}>{t('exploreLocal')}</p>
            </div>
          </div>

          <div className={styles.catGrid}>
            {Object.keys(categoryIcons).slice(0, 6).map((catName) => (
              <Link href={`/businesses?category=${encodeURIComponent(catName)}`} key={catName} className={styles.catCard}>
                <span className={styles.catIcon}>{categoryIcons[catName]}</span>
                <span className={styles.catName}>
                  {language === 'en' ? catName : (
                    catName === 'Electronics' ? 'ઇલેક્ટ્રોનિક્સ' :
                    catName === 'Food & Restaurants' ? 'ખાણીપીણી' :
                    catName === 'Healthcare' ? 'આરોગ્ય' :
                    catName === 'Education' ? 'શિક્ષણ' :
                    catName === 'Real Estate' ? 'રિયલ એસ્ટેટ' :
                    catName === 'Vehicle Sales' ? 'વાહન વેચાણ' : catName
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>{language === 'en' ? 'Featured Businesses' : 'ખાસ વ્યવસાયો'}</h2>
              <p className={styles.sectionSub}>{language === 'en' ? 'Handpicked top-rated local establishments' : 'ધોળકાના ચુનંદા અને લોકપ્રિય વ્યવસાયો'}</p>
            </div>
            <Link href="/businesses" className={styles.viewAll}>
              {language === 'en' ? 'View All Businesses' : 'બધા વ્યવસાયો જુઓ'} →
            </Link>
          </div>

          <div className={styles.grid}>
            {featuredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      </section>

      {/* Local News */}
      <section className={styles.section} style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>{t('localNewsTitle')}</h2>
              <p className={styles.sectionSub}>{t('stayInformed')}</p>
            </div>
            <Link href="/news" className={styles.viewAll}>
              {language === 'en' ? 'Read More News' : 'વધુ સમાચાર વાંચો'} →
            </Link>
          </div>

          <div className={styles.grid}>
            {recentNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </div>
      </section>

      {/* Second Hand Marketplace */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>{t('secondHandTitle')}</h2>
              <p className={styles.sectionSub}>{t('popularItems')}</p>
            </div>
            <Link href="/classifieds" className={styles.viewAll}>
              {language === 'en' ? 'Browse Marketplace' : 'સેકન્ડ હેન્ડ વસ્તુઓ જુઓ'} →
            </Link>
          </div>

          <div className={styles.classifiedsGrid}>
            {recentClassifieds.map((item) => (
              <ClassifiedCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={styles.cta}>
            <h2 className={styles.ctaTitle}>
              {language === 'en' ? 'Grow Your Business Locally' : 'તમારા સ્થાનિક વ્યવસાયને વધારો'}
            </h2>
            <p className={styles.ctaSub}>
              {language === 'en'
                ? 'Get your shop listed on Dholka Bazaar and reach thousands of local customers easily.'
                : 'ધોળકા બજાર પર તમારી દુકાનની નોંધણી કરો અને હજારો સ્થાનિક ગ્રાહકો સુધી સરળતાથી પહોંચો.'}
            </p>
            <Link href="/submit" className={styles.ctaBtn}>
              📢 {language === 'en' ? 'List Your Business Now' : 'તમારા વ્યવસાયની નોંધણી કરો'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
