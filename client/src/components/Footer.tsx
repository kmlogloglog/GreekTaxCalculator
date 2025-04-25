import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <motion.footer 
      className="relative bg-gradient-to-b from-blue-600 to-blue-700 text-white py-10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-blue-500 rounded-full opacity-10"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-blue-500 rounded-full opacity-10"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 bg-white bg-opacity-10 backdrop-blur-sm p-4 rounded-lg border border-blue-400 border-opacity-30">
            <h2 className="text-xl font-extrabold mb-2">
              {t('footer.title')}
            </h2>
            <p className="text-sm text-blue-100">{t('footer.subtitle')}</p>
          </div>
          
          {/* Right side content removed */}
        </div>
        
        <div className="mt-8 pt-4 border-t border-blue-400 border-opacity-30 text-center text-sm text-blue-100">
          <p className="text-xs md:text-sm">
            This calculator provides general tax estimates for informational purposes only. 
            Actual tax amounts may vary. Always consult with a tax professional for official advice.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
