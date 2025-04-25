import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IncomeTaxCalculator from './calculators/IncomeTaxCalculator';
import WithholdingTaxCalculator from './calculators/WithholdingTaxCalculator';
import HolidayBonusCalculator from './calculators/HolidayBonusCalculator';
import TaxExplanations from './calculators/TaxExplanations';

export default function TaxCalculators() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('income-tax');
  
  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };
  
  return (
    <motion.section 
      className="max-w-4xl mx-auto calculator-card mb-10 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Decorative elements */}
      <div className="accent-dot top-4 right-4"></div>
      <div className="accent-dot bottom-4 left-4"></div>
      <div className="accent-dot top-1/2 left-6 opacity-50"></div>
      <div className="accent-dot top-1/3 right-10 opacity-70"></div>
      
      <Tabs 
        defaultValue="income-tax" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex border-b border-gray-200">
          <TabsList className="flex w-full bg-gradient-to-r from-blue-50 to-blue-100 p-2 h-auto rounded-t-xl gap-2">
            <TabsTrigger 
              value="income-tax" 
              className="flex-1 text-center py-2 px-3 text-sm font-medium rounded-lg transition-all duration-300
                data-[state=active]:bg-gradient-to-r 
                data-[state=active]:from-blue-500 
                data-[state=active]:to-blue-600 
                data-[state=active]:text-white 
                data-[state=active]:shadow-md"
            >
              {t('calculators.tabs.incomeTax')}
            </TabsTrigger>
            <TabsTrigger 
              value="withholding-tax" 
              className="flex-1 text-center py-2 px-3 text-sm font-medium rounded-lg transition-all duration-300
                data-[state=active]:bg-gradient-to-r 
                data-[state=active]:from-blue-500 
                data-[state=active]:to-blue-600 
                data-[state=active]:text-white 
                data-[state=active]:shadow-md"
            >
              {t('calculators.tabs.withholdingTax')}
            </TabsTrigger>
            <TabsTrigger 
              value="holiday-bonus" 
              className="flex-1 text-center py-2 px-3 text-sm font-medium rounded-lg transition-all duration-300
                data-[state=active]:bg-gradient-to-r 
                data-[state=active]:from-blue-500 
                data-[state=active]:to-blue-600 
                data-[state=active]:text-white 
                data-[state=active]:shadow-md"
            >
              {t('calculators.tabs.holidayBonus')}
            </TabsTrigger>
            <TabsTrigger 
              value="explanations" 
              className="flex-1 text-center py-2 px-3 text-sm font-medium rounded-lg transition-all duration-300
                data-[state=active]:bg-gradient-to-r 
                data-[state=active]:from-blue-500 
                data-[state=active]:to-blue-600 
                data-[state=active]:text-white 
                data-[state=active]:shadow-md"
            >
              {t('calculators.tabs.explanations')}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="p-6 bg-white bg-opacity-80 backdrop-blur-sm">
          <motion.div 
            key={activeTab}
            initial="hidden"
            animate="visible"
            variants={tabVariants}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="income-tax" className="mt-0">
              <IncomeTaxCalculator />
            </TabsContent>
            
            <TabsContent value="withholding-tax" className="mt-0">
              <WithholdingTaxCalculator />
            </TabsContent>
            
            <TabsContent value="holiday-bonus" className="mt-0">
              <HolidayBonusCalculator />
            </TabsContent>
            
            <TabsContent value="explanations" className="mt-0">
              <TaxExplanations />
            </TabsContent>
          </motion.div>
        </div>
      </Tabs>
    </motion.section>
  );
}
