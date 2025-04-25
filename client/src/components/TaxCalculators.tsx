import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IncomeTaxCalculator from './calculators/IncomeTaxCalculator';
import WithholdingTaxCalculator from './calculators/WithholdingTaxCalculator';
import HolidayBonusCalculator from './calculators/HolidayBonusCalculator';

export default function TaxCalculators() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('income-tax');
  
  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };
  
  return (
    <motion.section 
      className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Tabs 
        defaultValue="income-tax" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex border-b border-gray-200">
          <TabsList className="flex w-full bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="income-tax" 
              className="flex-1 text-center py-4 px-4 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-[#0D5EAF] data-[state=active]:text-[#0D5EAF] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {t('calculators.tabs.incomeTax')}
            </TabsTrigger>
            <TabsTrigger 
              value="withholding-tax" 
              className="flex-1 text-center py-4 px-4 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-[#0D5EAF] data-[state=active]:text-[#0D5EAF] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {t('calculators.tabs.withholdingTax')}
            </TabsTrigger>
            <TabsTrigger 
              value="holiday-bonus" 
              className="flex-1 text-center py-4 px-4 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-[#0D5EAF] data-[state=active]:text-[#0D5EAF] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {t('calculators.tabs.holidayBonus')}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="p-6">
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
          </motion.div>
        </div>
      </Tabs>
    </motion.section>
  );
}
