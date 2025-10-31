import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';

interface WithholdingTaxResults {
  // Monthly values
  grossSalary: number;
  socialSecurity: number;
  withholdingTaxAmount: number;
  netSalary: number;
  // Annual values
  annualGross: number;
  annualInsurance: number;
  annualTaxableIncome: number;
  annualTax: number;
  annualNet: number;
  // Employer costs
  employerContributionsMonthly: number;
  employerContributionsAnnual: number;
  employerCostMonthly: number;
  employerCostAnnual: number;
  // Percentages
  insurancePercentage: string;
  taxPercentage: string;
  netPercentage: string;
}

export default function WithholdingTaxCalculator() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<WithholdingTaxResults | null>(null);
  
  const [formData, setFormData] = useState({
    monthlySalary: '',
    employmentType: 'full-time',
    familyStatus: 'single',
    children: '0',
    taxResidenceTransfer: false,
    annualSalaries: '14',
    taxYear: '2025',
    insuranceCarrier: 'IKA'
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
      const response = await apiRequest('POST', '/api/calculate/withholding-tax', formData);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error calculating withholding tax:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearForm = () => {
    setFormData({
      monthlySalary: '',
      employmentType: 'full-time',
      familyStatus: 'single',
      children: '0',
      taxResidenceTransfer: false,
      annualSalaries: '14',
      taxYear: '2025',
      insuranceCarrier: 'IKA'
    });
    setResults(null);
  };
  
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 text-[#0D5EAF]">
        Greek Salary Calculator - Net/Gross Calculation
      </h3>
      
      <form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Gross Salary (€)
            </label>
            <input 
              type="number" 
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="monthlySalary"
              value={formData.monthlySalary}
              onChange={handleInputChange}
              placeholder="Enter gross salary"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Year
            </label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="taxYear"
              value={formData.taxYear}
              onChange={handleInputChange}
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Carrier
            </label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0D5EAF] focus:border-transparent"
              id="insuranceCarrier"
              value={formData.insuranceCarrier}
              onChange={handleInputChange}
            >
              <option value="IKA">IKA (Social Security)</option>
              <option value="Other">Other</option>
            </select>
          </div>

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Children
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
          
          <div className="form-group flex items-center mt-6">
            <input 
              type="checkbox"
              id="taxResidenceTransfer"
              className="h-4 w-4 text-[#0D5EAF] focus:ring-[#0D5EAF] border-gray-300 rounded"
              checked={formData.taxResidenceTransfer}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="taxResidenceTransfer" className="ml-2 block text-sm text-gray-700">
              Tax Residence Transfer
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-6">
          <button 
            type="button" 
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-8 rounded-md transition duration-300 shadow-md disabled:opacity-50"
            onClick={calculateTax}
            disabled={isLoading}
          >
            {isLoading ? 'Calculating...' : 'Calculate'}
          </button>
          
          <button 
            type="button" 
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-8 rounded-md transition duration-300 shadow-md"
            onClick={clearForm}
          >
            Clear Form
          </button>
        </div>
      </form>

      {/* Results Section - Matching aftertax.gr layout */}
      {results && (
        <motion.div 
          className="mt-8 bg-white p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="text-2xl font-bold mb-6 text-blue-600 border-b-2 border-blue-500 pb-2">
            Calculation Results
          </h4>
          
          {/* Main Results Grid - Matching aftertax.gr */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Employer Cost */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <h5 className="font-semibold text-purple-800 mb-3">Employer Cost</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Per Year</span>
                  <span className="font-bold text-purple-700">€{results.employerCostAnnual.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Per Month</span>
                  <span className="font-bold text-purple-700">€{results.employerCostMonthly.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Employer Contributions */}
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
              <h5 className="font-semibold text-indigo-800 mb-3">Employer Contributions</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Per Year</span>
                  <span className="font-bold text-indigo-700">€{results.employerContributionsAnnual.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Per Month</span>
                  <span className="font-bold text-indigo-700">€{results.employerContributionsMonthly.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Gross Salary */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-3">Gross Salary</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Per Year</span>
                  <span className="font-bold text-blue-700">€{results.annualGross.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Per Month</span>
                  <span className="font-bold text-blue-700">€{results.grossSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Insurance Contributions */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
              <h5 className="font-semibold text-orange-800 mb-3">Insurance Contributions</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Per Year</span>
                  <span className="font-bold text-orange-700">€{results.annualInsurance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Per Month</span>
                  <span className="font-bold text-orange-700">€{results.socialSecurity.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Taxable Income */}
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200">
              <h5 className="font-semibold text-teal-800 mb-3">Taxable Income</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Per Year</span>
                  <span className="font-bold text-teal-700">€{results.annualTaxableIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Per Month</span>
                  <span className="font-bold text-teal-700">€{Math.round(results.annualTaxableIncome / 12).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Income Tax */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
              <h5 className="font-semibold text-red-800 mb-3">Income Tax</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Per Year</span>
                  <span className="font-bold text-red-700">€{results.annualTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Per Month</span>
                  <span className="font-bold text-red-700">€{results.withholdingTaxAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Net Income - Highlighted */}
            <div className="md:col-span-2 bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg">
              <h5 className="font-bold text-white text-lg mb-3">Net Income</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-green-100 block mb-1">Per Year</span>
                  <span className="font-bold text-2xl text-white">€{results.annualNet.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-green-100 block mb-1">Per Month</span>
                  <span className="font-bold text-2xl text-white">€{results.netSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Percentages */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-semibold text-gray-800 mb-3">Annual Income Analysis</h5>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{results.netPercentage}%</div>
                <div className="text-sm text-gray-600">Net Income</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{results.insurancePercentage}%</div>
                <div className="text-sm text-gray-600">Insurance</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{results.taxPercentage}%</div>
                <div className="text-sm text-gray-600">Income Tax</div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Calculations are based on Greek tax law for {formData.taxYear}. 
              Insurance contributions: {results.insurancePercentage}% of gross salary (employee portion). 
              {formData.taxResidenceTransfer && ' Tax residence transfer benefit applied (50% tax reduction).'}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
