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
      className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-2xl relative overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute h-8 w-8 rounded-full bg-white top-4 right-1/4 animate-pulse"></div>
        <div className="absolute h-16 w-16 rounded-full bg-white -bottom-6 left-1/3"></div>
        <div className="absolute h-12 w-12 rounded-full bg-white -top-4 right-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute h-6 w-6 rounded-full bg-yellow-300 top-8 left-1/4"></div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/10"></div>

      <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center relative z-10 gap-4">
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-12 h-12 relative p-1 bg-white rounded-xl shadow-lg transform hover:rotate-6 transition-transform"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src="https://cdn.countryflags.com/thumbs/greece/flag-400.png"
              alt="Greek Flag"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-md"></div>
          </motion.div>

          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight flex flex-wrap items-center gap-2">
              <span className="text-white drop-shadow-lg">{t('header.title')}</span>
              <span className="text-xs bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 px-3 py-1 rounded-full uppercase font-bold shadow-md">
                2025
              </span>
            </h1>
          </div>
        </div>

        <motion.button
          onClick={toggleLanguage}
          className="bg-white hover:bg-gradient-to-r hover:from-yellow-50 hover:to-white text-blue-700 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 border-2 border-white/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">{i18n.language === 'en' ? 'Ελληνικά 🇬🇷' : 'English 🇬🇧'}</span>
        </motion.button>
      </div>
    </motion.header>
  );
}
