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
      className="bg-white shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img 
            src="https://cdn.countryflags.com/thumbs/greece/flag-400.png" 
            alt="Greek Flag" 
            className="h-6 w-auto border border-gray-200"
          />
          <h1 className="text-xl font-bold text-[#0D5EAF]">
            {t('header.title')}
          </h1>
        </div>
        
        <div className="flex items-center">
          <button 
            className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200 transition"
            onClick={toggleLanguage}
          >
            <span>{i18n.language === 'en' ? 'EL' : 'EN'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0D5EAF]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
