import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function Disclaimer() {
  const { t } = useTranslation();
  
  return (
    <motion.section 
      className="max-w-4xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="text-lg font-semibold mb-2 text-red-700">
        {t('disclaimer.title')}
      </h3>
      
      <p className="text-sm text-red-600">
        {t('disclaimer.content')}
      </p>
    </motion.section>
  );
}
