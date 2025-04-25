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
      <h3 className="text-xl font-semibold mb-4 text-[#0D5EAF]">
        {t('calculators.holidayBonus.title')}
      </h3>
      
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('calculators.holidayBonus.monthlySalary')}
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
            className="bg-[#0D5EAF] hover:bg-[#4D89D6] text-white font-bold py-2 px-6 rounded-md transition duration-300 shadow-md disabled:opacity-50"
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
          className="mt-8 p-4 bg-gray-50 rounded-md"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="text-lg font-semibold mb-3 text-[#0D5EAF]">
            {t('calculators.holidayBonus.resultsTitle')}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="mb-2">
                <span className="font-medium">{t('calculators.holidayBonus.grossSalary')}:</span>
                <span className="font-bold ml-1">€{results.grossSalary.toFixed(2)}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">{t('calculators.holidayBonus.daysWorked')}:</span>
                <span className="font-bold ml-1">{results.daysWorked} {t('calculators.holidayBonus.days')}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">{t('calculators.holidayBonus.eligibleAmount')}:</span>
                <span className="font-bold ml-1">€{results.eligibleAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="mb-2">
                <span className="font-medium">{t('calculators.holidayBonus.bonusType')}:</span>
                <span className="font-bold ml-1">{t(`calculators.holidayBonus.${results.bonusType}Bonus`)}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">{t('calculators.holidayBonus.taxWithheld')}:</span>
                <span className="font-bold ml-1">€{results.taxWithheld.toFixed(2)}</span>
              </div>
              <div className="bg-[#0D5EAF] bg-opacity-10 p-2 rounded-md">
                <span className="font-medium">{t('calculators.holidayBonus.netBonusAmount')}:</span>
                <span className="font-bold text-[#0D5EAF] ml-1">€{results.netBonusAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}