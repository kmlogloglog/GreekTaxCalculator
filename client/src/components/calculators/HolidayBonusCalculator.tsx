import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { calculateHolidayBonus } from '@/lib/taxCalculations';

interface HolidayBonusResults {
  grossSalary: number;
  daysWorked: number;
  eligibleAmount: number;
  bonusType: string;
  bonusAmount: number;
  taxWithheld: number;
  netBonusAmount: number;
}

export default function HolidayBonusCalculator() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<HolidayBonusResults | null>(null);
  
  const [formData, setFormData] = useState({
    monthlySalary: '',
    startDate: '',
    bonusType: 'christmas'
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const calculateBonus = async () => {
    setIsLoading(true);
    try {
      // Calculate locally for immediate results
      const monthlySalary = parseFloat(formData.monthlySalary) || 0;
      const startDate = new Date(formData.startDate);
      const paymentDate = new Date(); // Always use today's date
      
      const calculationData = {
        monthlySalary,
        startDate,
        bonusType: formData.bonusType,
        paymentDate
      };
      
      const result = calculateHolidayBonus(calculationData);
      setResults(result);
    } catch (error) {
      console.error('Error calculating holiday bonus:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 text-blue-600 relative">
        {t('calculators.holidayBonus.title')}
      </h3>
      
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calculators.holidayBonus.monthlySalary')} ({t('calculators.common.gross')})
            </label>
            <input 
              type="number" 
              min="0" 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="monthlySalary"
              value={formData.monthlySalary}
              onChange={handleInputChange}
              placeholder="e.g. 1000"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calculators.holidayBonus.startDate')}
            </label>
            <input 
              type="date" 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('calculators.holidayBonus.bonusType')}
          </label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
            id="bonusType"
            value={formData.bonusType}
            onChange={handleInputChange}
          >
            <option value="christmas">{t('calculators.holidayBonus.christmasBonus')}</option>
            <option value="easter">{t('calculators.holidayBonus.easterBonus')}</option>
            <option value="summer">{t('calculators.holidayBonus.summerBonus')}</option>
          </select>
        </div>

        {/* Calculate Button */}
        <div className="text-center mt-6">
          <button 
            type="button" 
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-md transition duration-300 shadow-md disabled:opacity-50"
            onClick={calculateBonus}
            disabled={isLoading || !formData.monthlySalary || !formData.startDate}
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
            Holiday Bonus Results
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-blue-500 rounded"></div>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-3">
              <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-gray-600 block mb-1 text-sm">Monthly Gross Salary</span>
                <span className="font-bold text-lg text-blue-700">€{results.grossSalary.toFixed(2)}</span>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-gray-600 block mb-1 text-sm">Days Worked</span>
                <span className="font-bold text-lg text-blue-700">{results.daysWorked} days</span>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-gray-600 block mb-1 text-sm">Eligible Bonus Amount</span>
                <span className="font-bold text-lg text-blue-700">€{results.eligibleAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-gray-600 block mb-1 text-sm">Bonus Type</span>
                <span className="font-bold text-lg text-blue-700">{t(`calculators.holidayBonus.${results.bonusType}Bonus`)}</span>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-gray-600 block mb-1 text-sm">Tax Withheld</span>
                <span className="font-bold text-lg text-blue-700">€{results.taxWithheld.toFixed(2)}</span>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg shadow-md">
                <span className="text-white block mb-1 text-sm">Net Bonus Amount</span>
                <span className="font-bold text-xl text-white">€{results.netBonusAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}