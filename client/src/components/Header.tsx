import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'el' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <motion.header 
      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg relative overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute opacity-10 h-8 w-8 rounded-full bg-white top-4 right-1/4"></div>
        <div className="absolute opacity-10 h-16 w-16 rounded-full bg-white -bottom-6 left-1/3"></div>
        <div className="absolute opacity-10 h-12 w-12 rounded-full bg-white -top-4 right-1/2"></div>
      </div>
      
      <div className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 relative p-1 bg-white rounded-lg shadow-md transform rotate-3">
            <img 
              src="https://cdn.countryflags.com/thumbs/greece/flag-400.png" 
              alt="Greek Flag" 
              className="w-full h-full object-cover"
            />
            <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-white drop-shadow-sm">{t('header.title')}</span>
            <span className="text-xs ml-2 bg-yellow-400 text-blue-800 px-2 py-1 rounded-full uppercase font-bold shadow-sm">2025</span>
          </h1>
        </div>
        
        <button 
          onClick={toggleLanguage}
          className="bg-white hover:bg-yellow-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
        >
          <span style={{ color: 'white' }}>{i18n.language === 'en' ? 'Ελληνικά' : 'English'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </motion.header>
  );
}
