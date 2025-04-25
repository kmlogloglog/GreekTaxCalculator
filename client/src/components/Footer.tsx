import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <motion.footer 
      className="bg-[#0D5EAF] text-white py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold mb-2">{t('footer.title')}</h2>
            <p className="text-sm">{t('footer.subtitle')}</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <p className="text-sm mb-2">{t('footer.lastUpdated')}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300 transition">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
