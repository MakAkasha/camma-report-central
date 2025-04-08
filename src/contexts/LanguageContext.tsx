
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<string>(localStorage.getItem('language') || 'en');
  const [isRTL, setIsRTL] = useState<boolean>(language === 'ar');

  useEffect(() => {
    // Set the language in localStorage and i18n
    localStorage.setItem('language', language);
    i18n.changeLanguage(language);
    
    // Set RTL attribute on html element
    const isRtl = language === 'ar';
    setIsRTL(isRtl);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  }, [language, i18n]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
