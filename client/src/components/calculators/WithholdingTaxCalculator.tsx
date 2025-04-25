import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';

interface WithholdingTaxResults {
  grossSalary: number;
  socialSecurity: number;
  withholdingTaxAmount: number;
  netSalary: number;
}

export default function WithholdingTaxCalculator() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<WithholdingTaxResults | null>(null);
  
  const [formData, setFormData] = useState({
    monthlySalary: '',
    employmentType: 'full-time',
    familyStatus: 'single',
    children: '0'
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const calculateTax = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/calculate/withholding-tax', formData);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error calculating withholding tax:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-[#0D5EAF]">
        {t('calculators.withholdingTax.title')}
      </h3>
      
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calculators.withholdingTax.monthlySalary')} ({t('calculators.common.gross')})
            </label>
            <input 
              type="number" 
              min="0" 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="monthlySalary"
              value={formData.monthlySalary}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calculators.withholdingTax.employmentType')}
            </label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="employmentType"
              value={formData.employmentType}
              onChange={handleInputChange}
            >
              <option value="full-time">{t('calculators.withholdingTax.fullTime')}</option>
              <option value="part-time">{t('calculators.withholdingTax.partTime')}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calculators.common.familyStatus')}
            </label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="familyStatus"
              value={formData.familyStatus}
              onChange={handleInputChange}
            >
              <option value="single">{t('calculators.common.single')}</option>
              <option value="married">{t('calculators.common.married')}</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calculators.common.children')}
            </label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="children"
              value={formData.children}
              onChange={handleInputChange}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4+">4+</option>
            </select>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="text-center mt-6">
          <button 
            type="button" 
            className="bg-[#0D5EAF] hover:bg-[#4D89D6] text-white font-bold py-2 px-6 rounded-md transition duration-300 shadow-md disabled:opacity-50"
            onClick={calculateTax}
            disabled={isLoading}
          >
            {isLoading ? t('calculators.common.calculating') : t('calculators.common.calculate')}
          </button>
        </div>
      </form>

      {/* Results Section */}
      {results && (
        <motion.div 
          className="mt-8 p-4 bg-gray-50 rounded-md"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="text-lg font-semibold mb-3 text-[#0D5EAF]">
            {t('calculators.withholdingTax.resultsTitle')}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="mb-2">
                <span className="font-medium">{t('calculators.withholdingTax.grossSalary')}:</span>
                <span className="font-bold ml-1">€{results.grossSalary.toFixed(2)}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">{t('calculators.withholdingTax.socialSecurity')}:</span>
                <span className="font-bold ml-1">€{results.socialSecurity.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="mb-2">
                <span className="font-medium">{t('calculators.withholdingTax.withholdingTaxAmount')}:</span>
                <span className="font-bold ml-1">€{results.withholdingTaxAmount.toFixed(2)}</span>
              </div>
              <div className="bg-[#0D5EAF] bg-opacity-10 p-2 rounded-md">
                <span className="font-medium">{t('calculators.withholdingTax.netSalary')}:</span>
                <span className="font-bold text-[#0D5EAF] ml-1">€{results.netSalary.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
