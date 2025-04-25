import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';

interface IncomeTaxResults {
  totalIncome: number;
  taxRate: string;
  taxDeductions: number;
  incomeTaxAmount: number;
  solidarityAmount: number;
  totalTax: number;
}

export default function IncomeTaxCalculator() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<IncomeTaxResults | null>(null);
  
  const [formData, setFormData] = useState({
    familyStatus: 'single',
    children: '0',
    employmentIncome: '',
    selfEmploymentIncome: '',
    rentalIncome: '',
    pensionIncome: '',
    taxResidenceTransfer: false,
    annualSalaries: '14'
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setFormData(prev => ({ ...prev, [id]: checked }));
  };
  
  const calculateTax = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/calculate/income-tax', formData);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error calculating income tax:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-[#0D5EAF]">
        {t('calculators.incomeTax.title')}
      </h3>
      
      <form className="space-y-4">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calculators.incomeTax.familyStatus')}
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

        {/* Income Sources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calculators.incomeTax.employmentIncome')} ({t('calculators.common.gross')})
            </label>
            <input 
              type="number" 
              min="0" 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent" 
              id="employmentIncome"
              value={formData.employmentIncome}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calculators.incomeTax.selfEmploymentIncome')} ({t('calculators.common.gross')})
            </label>
            <input 
              type="number" 
              min="0" 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="selfEmploymentIncome"
              value={formData.selfEmploymentIncome}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calculators.incomeTax.rentalIncome')} ({t('calculators.common.gross')})
            </label>
            <input 
              type="number" 
              min="0" 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="rentalIncome"
              value={formData.rentalIncome}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calculators.incomeTax.pensionIncome')} ({t('calculators.common.gross')})
            </label>
            <input 
              type="number" 
              min="0" 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="pensionIncome"
              value={formData.pensionIncome}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calculators.common.annualSalaries')}
            </label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="annualSalaries"
              value={formData.annualSalaries}
              onChange={handleInputChange}
            >
              <option value="12">12</option>
              <option value="14">14</option>
            </select>
          </div>
          
          <div className="form-group flex items-center mt-6">
            <input 
              type="checkbox"
              id="taxResidenceTransfer"
              className="h-4 w-4 text-[#0D5EAF] focus:ring-[#0D5EAF] border-gray-300 rounded"
              checked={formData.taxResidenceTransfer}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="taxResidenceTransfer" className="ml-2 block text-sm text-gray-700">
              {t('calculators.common.taxResidenceTransfer')}
            </label>
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
            {t('calculators.incomeTax.resultsTitle')}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="mb-2">
                <span className="font-medium">{t('calculators.incomeTax.totalIncome')}:</span>
                <span className="font-bold ml-1">€{results.totalIncome.toFixed(2)}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">{t('calculators.incomeTax.taxRate')}:</span>
                <span className="font-bold ml-1">{results.taxRate}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">{t('calculators.incomeTax.taxDeductions')}:</span>
                <span className="font-bold ml-1">€{results.taxDeductions.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="mb-2">
                <span className="font-medium">{t('calculators.incomeTax.incomeTaxAmount')}:</span>
                <span className="font-bold ml-1">€{results.incomeTaxAmount.toFixed(2)}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">{t('calculators.incomeTax.solidarityAmount')}:</span>
                <span className="font-bold ml-1">€{results.solidarityAmount.toFixed(2)}</span>
              </div>
              <div className="bg-[#0D5EAF] bg-opacity-10 p-2 rounded-md">
                <span className="font-medium">{t('calculators.incomeTax.totalTax')}:</span>
                <span className="font-bold text-[#0D5EAF] ml-1">€{results.totalTax.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
