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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Hero Introduction Section */}
        <motion.section
          className="mb-12 text-center relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                {t('home.title')}
              </h1>
            </motion.div>

            <motion.p
              className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {t('home.subtitle')}
            </motion.p>

            {/* Feature badges */}
            <motion.div
              className="flex flex-wrap justify-center gap-3 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="px-4 py-2 bg-white rounded-full shadow-sm border border-blue-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">100% Free</span>
              </div>
              <div className="px-4 py-2 bg-white rounded-full shadow-sm border border-blue-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Accurate 2025 Rates</span>
              </div>
              <div className="px-4 py-2 bg-white rounded-full shadow-sm border border-blue-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Bilingual EN/EL</span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <TaxCalculators />
        <Disclaimer />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
