'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'gu';
type Theme = 'light' | 'dark';

interface AppContextType {
  language: Language;
  theme: Theme;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: 'Home',
    businesses: 'Businesses',
    news: 'News',
    classifieds: 'Classifieds',
    submitListing: 'Submit Listing',
    searchPlaceholder: 'Search shops, news, or items...',
    searchBtn: 'Search',
    discoverTitle: 'Discover Dholka. Connect Locally.',
    discoverSub: 'Find trusted shops, latest news, and second-hand deals — all in one place for Dholka, Gujarat.',
    verifiedShops: '100+ verified shops',
    localNews: 'Daily local news',
    trustedClassifieds: 'Trusted classifieds',
    browseCategory: 'Browse by Category',
    exploreLocal: 'Explore local businesses across Dholka',
    localNewsTitle: 'Local News & Updates',
    stayInformed: 'Stay informed about Dholka',
    secondHandTitle: 'Second-Hand Marketplace',
    popularItems: 'Popular items for sale in Dholka',
    viewDetails: 'View Details',
    whatsapp: 'WhatsApp',
    call: 'Call',
    messageWhatsapp: 'Message on WhatsApp',
    address: 'ADDRESS',
    phone: 'PHONE',
    back: 'Back',
    readMore: 'Read more',
    adminLogin: 'Admin Login',
    password: 'PASSWORD',
    login: 'Login',
    submitTitle: 'Submit a New Listing',
    businessTab: 'Business',
    classifiedTab: 'Classified (Second-hand item)',
    nameLabel: 'NAME (ENGLISH)',
    nameGuLabel: 'NAME (GUJARATI)',
    categoryLabel: 'CATEGORY',
    descLabel: 'DESCRIPTION (ENGLISH)',
    descGuLabel: 'DESCRIPTION (GUJARATI)',
    addressLabel: 'ADDRESS (ENGLISH)',
    addressGuLabel: 'ADDRESS (GUJARATI)',
    phoneLabel: 'PHONE NUMBER',
    whatsappLabel: 'WHATSAPP NUMBER',
    imageUrlLabel: 'IMAGE URL',
    priceLabel: 'PRICE (₹)',
    locationLabel: 'LOCATION IN DHOLKA',
    sellerLabel: 'YOUR NAME',
    submitBtn: 'Submit for Approval',
    all: 'All',
    featured: 'FEATURED',
    noResults: 'No results found.'
  },
  gu: {
    home: 'હોમ',
    businesses: 'વ્યવસાયો',
    news: 'સમાચાર',
    classifieds: 'ક્લાસિફાઇડ્સ',
    submitListing: 'લિસ્ટિંગ ઉમેરો',
    searchPlaceholder: 'દુકાનો, સમાચાર અથવા વસ્તુઓ શોધો...',
    searchBtn: 'શોધો',
    discoverTitle: 'ધોળકા શોધો. સ્થાનિક રીતે જોડાઓ.',
    discoverSub: 'ધોળકા, ગુજરાત માટે વિશ્વસનીય દુકાનો, નવીનતમ સમાચાર અને સેકન્ડ હેન્ડ ડીલ્સ — બધું એક જ જગ્યાએ શોધો.',
    verifiedShops: '૧૦૦+ પ્રમાણિત દુકાનો',
    localNews: 'દૈનિક સ્થાનિક સમાચાર',
    trustedClassifieds: 'વિશ્વસનીય ક્લાસિફાઇડ્સ',
    browseCategory: 'કેટેગરી દ્વારા શોધો',
    exploreLocal: 'ધોળકામાં સ્થાનિક વ્યવસાયો શોધો',
    localNewsTitle: 'સ્થાનિક સમાચાર અને અપડેટ્સ',
    stayInformed: 'ધોળકા વિશે માહિતગાર રહો',
    secondHandTitle: 'સેકન્ડ હેન્ડ માર્કેટપ્લેસ',
    popularItems: 'ધોળકામાં વેચાણ માટે લોકપ્રિય વસ્તુઓ',
    viewDetails: 'વિગત જુઓ',
    whatsapp: 'વોટ્સએપ',
    call: 'કોલ',
    messageWhatsapp: 'વોટ્સએપ પર મેસેજ કરો',
    address: 'સરનામું',
    phone: 'ફોન',
    back: 'પાછા',
    readMore: 'વધુ વાંચો',
    adminLogin: 'એડમિન લોગિન',
    password: 'પાસવર્ડ',
    login: 'લોગિન',
    submitTitle: 'નવું લિસ્ટિંગ સબમિટ કરો',
    businessTab: 'વ્યવસાય',
    classifiedTab: 'ક્લાસિફાઇડ (સેકન્ડ હેન્ડ વસ્તુ)',
    nameLabel: 'નામ (અંગ્રેજી)',
    nameGuLabel: 'નામ (ગુજરાતી)',
    categoryLabel: 'કેટેગરી',
    descLabel: 'વર્ણન (અંગ્રેજી)',
    descGuLabel: 'વર્ણન (ગુજરાતી)',
    addressLabel: 'સરનામું (અંગ્રેજી)',
    addressGuLabel: 'સરનામું (ગુજરાતી)',
    phoneLabel: 'ફોન નંબર',
    whatsappLabel: 'વોટ્સએપ નંબર',
    imageUrlLabel: 'ઇમેજ યુઆરએલ',
    priceLabel: 'કિંમત (₹)',
    locationLabel: 'ધોળકામાં સ્થળ',
    sellerLabel: 'તમારું નામ',
    submitBtn: 'મંજૂરી માટે સબમિટ કરો',
    all: 'બધા',
    featured: 'ખાસ',
    noResults: 'કોઈ પરિણામ મળ્યા નથી.'
  }
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    if (savedLang) setLanguage(savedLang);
  }, []);

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'gu' : 'en';
    setLanguage(nextLang);
    localStorage.setItem('lang', nextLang);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <AppContext.Provider value={{ language, theme, toggleLanguage, toggleTheme, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
