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
          className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl border border-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-gray-800">
              Tax Calculation Results
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Annual Gross Salary */}
            <motion.div
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Annual Gross Salary</span>
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="font-bold text-2xl text-blue-700">€{results.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </motion.div>

            {/* Tax Rate */}
            <motion.div
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Effective Tax Rate</span>
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="font-bold text-2xl text-orange-600">{results.taxRate}</div>
            </motion.div>

            {/* Tax Deductions */}
            <motion.div
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Tax Credits</span>
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="font-bold text-2xl text-green-600">€{results.taxDeductions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </motion.div>

            {/* Income Tax Amount */}
            <motion.div
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Income Tax</span>
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="font-bold text-2xl text-red-600">€{results.incomeTaxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </motion.div>
          </div>

          {/* Total Tax - Highlighted */}
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl shadow-lg"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-100 text-sm font-medium mb-1">Total Annual Tax Payable</div>
                <div className="font-bold text-4xl text-white">€{results.totalTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <div className="p-4 bg-white/20 rounded-full">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Net Income Estimate */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">
                Estimated Net Income: €{(results.totalIncome - results.totalTax - (results.totalIncome * 0.134)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-xs ml-2">(after tax and social security)</span>
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
