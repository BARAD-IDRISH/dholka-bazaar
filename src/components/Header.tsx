'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import styles from './Header.module.css';

export default function Header() {
  const { language, toggleLanguage, theme, toggleTheme, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/', label: t('home') },
    { href: '/businesses', label: t('businesses') },
    { href: '/news', label: t('news') },
    { href: '/classifieds', label: t('classifieds') },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoArea}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/dblogo.jpg" alt="Dholka Bazaar Logo" className={styles.logoImage} />
          <div className={styles.logoText}>
            <span className={styles.title}>Dholka Bazaar</span>
            <span className={styles.subtitle}>{language === 'en' ? 'Your local marketplace & news hub' : 'તમારું સ્થાનિક માર્કેટપ્લેસ અને ન્યૂઝ હબ'}</span>
          </div>
        </Link>

        <nav className={styles.nav}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <button onClick={toggleLanguage} className={styles.langBtn}>
            🌐 {language === 'en' ? 'ગુજરાતી' : 'English'}
          </button>
          
          <Link href="/submit" className={styles.submitBtn}>
            <span>➕ {t('submitListing')}</span>
          </Link>

          <button onClick={toggleTheme} className={styles.themeBtn} title="Toggle Theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <Link href="/admin" className={styles.adminBtn} title="Admin Panel">
            🛡️
          </Link>
        </div>

        <button
          className={`${styles.hamburger} ${isOpen ? styles.open : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={styles.mobileNavLink}
            onClick={() => setIsOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={() => {
            toggleLanguage();
            setIsOpen(false);
          }}
          className={styles.langBtn}
          style={{ width: 'fit-content', marginTop: '20px' }}
        >
          🌐 {language === 'en' ? 'ગુજરાતી' : 'English'}
        </button>
        <Link
          href="/submit"
          className={styles.submitBtn}
          style={{ width: 'fit-content', justifyContent: 'center' }}
          onClick={() => setIsOpen(false)}
        >
          <span>➕ {t('submitListing')}</span>
        </Link>
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <button onClick={toggleTheme} className={styles.themeBtn}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <Link href="/admin" className={styles.adminBtn} onClick={() => setIsOpen(false)}>
            🛡️ Admin Login
          </Link>
        </div>
      </div>
    </header>
  );
}
