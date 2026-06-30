'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import styles from './Footer.module.css';

export default function Footer() {
  const { language, t } = useApp();

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <div className={styles.logoCircle}>ધ</div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Dholka Bazaar</h3>
          <p className={styles.brandDesc}>
            {language === 'en'
              ? 'Dholka Bazaar is the trusted local directory connecting businesses, news, and classifieds for the city of Dholka, Gujarat.'
              : 'ધોળકા બજાર એ ધોળકા શહેરના વ્યવસાયો, સમાચાર અને ક્લાસિફાઇડ્સને જોડતી એક વિશ્વસનીય સ્થાનિક ડિરેક્ટરી છે.'}
          </p>
        </div>

        <div>
          <h4 className={styles.title}>{language === 'en' ? 'QUICK LINKS' : 'ઝડપી લિંક્સ'}</h4>
          <div className={styles.links}>
            <Link href="/businesses" className={styles.link}>{t('businesses')}</Link>
            <Link href="/news" className={styles.link}>{t('news')}</Link>
            <Link href="/classifieds" className={styles.link}>{t('classifieds')}</Link>
            <Link href="/submit" className={styles.link}>{t('submitListing')}</Link>
          </div>
        </div>

        <div>
          <h4 className={styles.title}>{language === 'en' ? 'CONTACT' : 'સંપર્ક'}</h4>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              📍 <span>Dholka, Ahmedabad, Gujarat</span>
            </div>
            <div className={styles.contactItem}>
              📞 <span>+91 9876 543 210</span>
            </div>
            <div className={styles.contactItem}>
              ✉️ <span>hello@dholkabazaar.in</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>© {new Date().getFullYear()} Dholka Bazaar. All rights reserved.</span>
        <span>Made with care in Dholka</span>
      </div>
    </footer>
  );
}
