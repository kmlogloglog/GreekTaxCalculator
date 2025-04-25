import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';

interface GiftTaxResults {
  totalGiftValue: number;
  taxRate: string;
  taxFreeAmount: number;
  taxableGift: number;
  giftTaxAmount: number;
}

export default function GiftTaxCalculator() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GiftTaxResults | null>(null);
  
  const [formData, setFormData] = useState({
    giftValue: '',
    relationship: 'category-a',
    giftType: 'money',
    previousGifts: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const calculateTax = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/calculate/gift-tax', formData);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error calculating gift tax:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-[#0D5EAF]">
        {t('calculators.giftTax.title')}
      </h3>
      
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calculators.giftTax.giftValue')}
            </label>
            <input 
              type="number" 
              min="0" 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="giftValue"
              value={formData.giftValue}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calculators.giftTax.relationship')}
            </label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="relationship"
              value={formData.relationship}
              onChange={handleInputChange}
            >
              <option value="category-a">{t('calculators.giftTax.categoryA')}</option>
              <option value="category-b">{t('calculators.giftTax.categoryB')}</option>
              <option value="category-c">{t('calculators.giftTax.categoryC')}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calculators.giftTax.giftType')}
            </label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="giftType"
              value={formData.giftType}
              onChange={handleInputChange}
            >
              <option value="money">{t('calculators.giftTax.money')}</option>
              <option value="realestate">{t('calculators.giftTax.realEstate')}</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calculators.giftTax.previousGifts')}
            </label>
            <input 
              type="number" 
              min="0" 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="previousGifts"
              value={formData.previousGifts}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Calculate Button */}
        <div className="text-center mt-6">
          <button 
            type="button" 
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-md transition duration-300 shadow-md disabled:opacity-50"
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
          className="results-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="text-xl font-bold mb-4 text-blue-600 relative inline-block">
            Tax Calculation Results
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-blue-500 rounded"></div>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-3">
              <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-gray-600 block mb-1 text-sm">{t('calculators.giftTax.totalGiftValue')}</span>
                <span className="font-bold text-lg text-blue-700">€{results.totalGiftValue.toFixed(2)}</span>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-gray-600 block mb-1 text-sm">{t('calculators.giftTax.taxRate')}</span>
                <span className="font-bold text-lg text-blue-700">{results.taxRate}</span>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-gray-600 block mb-1 text-sm">{t('calculators.giftTax.taxFreeAmount')}</span>
                <span className="font-bold text-lg text-blue-700">€{results.taxFreeAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-gray-600 block mb-1 text-sm">{t('calculators.giftTax.taxableGift')}</span>
                <span className="font-bold text-lg text-blue-700">€{results.taxableGift.toFixed(2)}</span>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg shadow-md">
                <span className="text-white block mb-1 text-sm">{t('calculators.giftTax.giftTaxAmount')}</span>
                <span className="font-bold text-xl text-white">€{results.giftTaxAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
