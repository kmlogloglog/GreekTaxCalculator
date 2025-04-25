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
    monthlyIncome: '',
    yearlyIncome: '',
    taxResidenceTransfer: false,
    annualSalaries: '14'
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    // Handle monthly/yearly income synchronization with correct decimal places
    if (id === 'monthlyIncome') {
      const monthlyValue = parseFloat(value) || 0;
      const annualSalaries = parseInt(formData.annualSalaries);
      const yearlyValue = monthlyValue * annualSalaries;
      
      setFormData(prev => ({ 
        ...prev, 
        [id]: value,
        yearlyIncome: yearlyValue.toFixed(2)
      }));
      
      console.log(`Monthly value ${monthlyValue} × ${annualSalaries} payments = yearly ${yearlyValue}`);
    } 
    else if (id === 'yearlyIncome') {
      const yearlyValue = parseFloat(value) || 0;
      const annualSalaries = parseInt(formData.annualSalaries);
      const monthlyValue = yearlyValue / annualSalaries;
      
      setFormData(prev => ({ 
        ...prev, 
        [id]: value,
        monthlyIncome: monthlyValue.toFixed(2)
      }));
      
      console.log(`Yearly value ${yearlyValue} ÷ ${annualSalaries} payments = monthly ${monthlyValue}`);
    }
    else if (id === 'annualSalaries') {
      // When annual salaries change, recalculate yearly from monthly
      const monthlyValue = parseFloat(formData.monthlyIncome) || 0;
      const annualSalaries = parseInt(value);
      const yearlyValue = monthlyValue * annualSalaries;
      
      console.log(`Annual salaries changed to ${annualSalaries}, recalculating: ${monthlyValue} × ${annualSalaries} = ${yearlyValue}`);
      
      setFormData(prev => ({ 
        ...prev, 
        [id]: value,
        yearlyIncome: yearlyValue.toFixed(2)
      }));
    }
    else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setFormData(prev => ({ ...prev, [id]: checked }));
  };
  
  const calculateTax = async () => {
    setIsLoading(true);
    try {
      // Create a modified payload with the calculated yearly income
      const requestData = {
        ...formData,
        employmentIncome: formData.yearlyIncome || 
          (parseFloat(formData.monthlyIncome) * parseInt(formData.annualSalaries)).toString()
      };
      
      console.log("Sending calculation request with data:", requestData);
      
      const response = await apiRequest('POST', '/api/calculate/income-tax', requestData);
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
              Monthly Gross Salary (€)
            </label>
            <input 
              type="number" 
              min="0" 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent" 
              id="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleInputChange}
              placeholder="Enter monthly gross income"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Gross Salary (€)
            </label>
            <input 
              type="number" 
              min="0" 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="yearlyIncome"
              value={formData.yearlyIncome}
              onChange={handleInputChange}
              placeholder="Annual gross income"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Salaries
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
              Tax Residence Transfer (50% reduction)
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
                <span className="text-gray-600 block mb-1 text-sm">Annual Gross Salary</span>
                <span className="font-bold text-lg text-blue-700">€{results.totalIncome.toFixed(2)}</span>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-gray-600 block mb-1 text-sm">Tax Rate</span>
                <span className="font-bold text-lg text-blue-700">{results.taxRate}</span>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-gray-600 block mb-1 text-sm">Tax Deductions</span>
                <span className="font-bold text-lg text-blue-700">€{results.taxDeductions.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-gray-600 block mb-1 text-sm">Income Tax Amount</span>
                <span className="font-bold text-lg text-blue-700">€{results.incomeTaxAmount.toFixed(2)}</span>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-gray-600 block mb-1 text-sm">Solidarity Contribution</span>
                <span className="font-bold text-lg text-blue-700">€{results.solidarityAmount.toFixed(2)}</span>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg shadow-md">
                <span className="text-white block mb-1 text-sm">Total Tax</span>
                <span className="font-bold text-xl text-white">€{results.totalTax.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
