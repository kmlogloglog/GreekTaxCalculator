import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TaxCalculators from '@/components/TaxCalculators';
import Disclaimer from '@/components/Disclaimer';
import FAQ from '@/components/FAQ';

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Introduction Section */}
        <motion.section 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold mb-3 text-[#0D5EAF]">
            {t('home.title')}
          </h2>
          
          <p className="max-w-2xl mx-auto text-gray-600">
            {t('home.subtitle')}
          </p>
        </motion.section>
        
        <TaxCalculators />
        <Disclaimer />
        <FAQ />
      </main>
      
      <Footer />
    </div>
  );
}
