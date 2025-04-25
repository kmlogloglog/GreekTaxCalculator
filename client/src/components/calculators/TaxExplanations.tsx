import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function TaxExplanations() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('income-tax');
  
  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4 text-[#0D5EAF]">
        {t('calculators.explanations.title')}
      </h3>
      
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
              className="flex-1 text-center py-3 px-4 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-[#0D5EAF] data-[state=active]:text-[#0D5EAF] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {t('calculators.explanations.incomeTaxExplain')}
            </TabsTrigger>
            <TabsTrigger 
              value="withholding-tax" 
              className="flex-1 text-center py-3 px-4 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-[#0D5EAF] data-[state=active]:text-[#0D5EAF] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {t('calculators.explanations.withholdingExplain')}
            </TabsTrigger>
            <TabsTrigger 
              value="holiday-bonus" 
              className="flex-1 text-center py-3 px-4 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-[#0D5EAF] data-[state=active]:text-[#0D5EAF] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {t('calculators.explanations.holidayBonusExplain')}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="py-4">
          <motion.div 
            key={activeTab}
            initial="hidden"
            animate="visible"
            variants={tabVariants}
            transition={{ duration: 0.3 }}
          >
            {/* Income Tax Explanations */}
            <TabsContent value="income-tax" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('calculators.explanations.incomeBasics')}</CardTitle>
                  <CardDescription>Understanding the Greek income tax system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    In Greece, income tax for individuals is calculated using a progressive tax system, where the tax rate increases
                    as the taxable income increases. Income is categorized into different sources including employment, business,
                    capital (rent, dividends, interest), and pensions.
                  </p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="rates">
                      <AccordionTrigger className="font-medium text-[#0D5EAF]">
                        {t('calculators.explanations.incomeRates')}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border p-2 text-left">Income Range (€)</th>
                                <th className="border p-2 text-left">Tax Rate</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border p-2">0 - 10,000</td>
                                <td className="border p-2">9%</td>
                              </tr>
                              <tr>
                                <td className="border p-2">10,001 - 20,000</td>
                                <td className="border p-2">22%</td>
                              </tr>
                              <tr>
                                <td className="border p-2">20,001 - 30,000</td>
                                <td className="border p-2">28%</td>
                              </tr>
                              <tr>
                                <td className="border p-2">30,001 - 40,000</td>
                                <td className="border p-2">36%</td>
                              </tr>
                              <tr>
                                <td className="border p-2">Above 40,000</td>
                                <td className="border p-2">44%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-3 text-sm text-gray-600">
                          Note: These rates apply to employment, pension, and business income. Different rates may apply to other income types.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="deductions">
                      <AccordionTrigger className="font-medium text-[#0D5EAF]">
                        Key Deductions
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Child tax allowance: €1,000 for one child, €2,000 for two children, €5,000 for three children, and €1,000 additional for each child beyond three</li>
                          <li>Medical expenses: Up to 10% of income may be deducted</li>
                          <li>Charitable donations: Up to 5% of taxable income</li>
                          <li>E-payments deduction: Taxpayers need to spend a percentage of their income via electronic means to qualify for full tax reduction</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="solidarity">
                      <AccordionTrigger className="font-medium text-[#0D5EAF]">
                        Solidarity Contribution
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>
                          The special solidarity contribution is an additional tax on income that was introduced as a temporary measure
                          during the financial crisis. For 2025, it is expected to be further reduced or eliminated for certain income categories.
                          Currently, it applies only to income above €30,000 at a rate of 2%.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('calculators.explanations.incomeExamples')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-md">
                      <h4 className="font-semibold mb-2">Example 1: Single person with €25,000 annual income</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>First €10,000: 9% tax = €900</li>
                        <li>Next €10,000: 22% tax = €2,200</li>
                        <li>Remaining €5,000: 28% tax = €1,400</li>
                        <li>Total tax before deductions: €4,500</li>
                        <li>Basic deduction: €1,000</li>
                        <li>Final income tax: €3,500</li>
                        <li>Solidarity contribution: €0 (income below €30,000)</li>
                        <li>Total tax liability: €3,500</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-md">
                      <h4 className="font-semibold mb-2">Example 2: Married person with 2 children and €45,000 annual income</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>First €10,000: 9% tax = €900</li>
                        <li>Next €10,000: 22% tax = €2,200</li>
                        <li>Next €10,000: 28% tax = €2,800</li>
                        <li>Next €10,000: 36% tax = €3,600</li>
                        <li>Remaining €5,000: 44% tax = €2,200</li>
                        <li>Total tax before deductions: €11,700</li>
                        <li>Basic deduction: €1,000</li>
                        <li>Child deduction (2 children): €2,000</li>
                        <li>Final income tax: €8,700</li>
                        <li>Solidarity contribution: €300 (2% on €15,000 above the €30,000 threshold)</li>
                        <li>Total tax liability: €9,000</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Withholding Tax Explanations */}
            <TabsContent value="withholding-tax" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('calculators.explanations.withholdingBasics')}</CardTitle>
                  <CardDescription>Understanding withholding tax on salaries in Greece</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Withholding tax in Greece is the amount of income tax withheld by employers from employees' monthly salaries
                    and paid directly to the tax authorities. This serves as an advance payment toward the employee's annual income
                    tax liability.
                  </p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="calculation">
                      <AccordionTrigger className="font-medium text-[#0D5EAF]">
                        How It's Calculated
                      </AccordionTrigger>
                      <AccordionContent>
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>The monthly salary is first reduced by social security contributions (approximately 13.87% for employees)</li>
                          <li>The resulting amount is projected to an annual basis (multiplied by 12)</li>
                          <li>The progressive income tax rates are applied to this projected annual income</li>
                          <li>Adjustments are made based on family status and number of children</li>
                          <li>The resulting annual tax is divided by 12 to determine the monthly withholding amount</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="reductions">
                      <AccordionTrigger className="font-medium text-[#0D5EAF]">
                        Rate Reductions
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>Various factors can reduce the withholding tax rate:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                          <li>Part-time employment: 2% reduction</li>
                          <li>Married taxpayers: 1% reduction</li>
                          <li>One child: 0.5% reduction</li>
                          <li>Two children: 1% reduction</li>
                          <li>Three children: 2% reduction</li>
                          <li>Four or more children: 3% reduction</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('calculators.explanations.withholdingExamples')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-md">
                      <h4 className="font-semibold mb-2">Example 1: Single full-time employee with €1,500 monthly salary</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Monthly salary: €1,500</li>
                        <li>Social security contribution (13.87%): €208.05</li>
                        <li>Net taxable monthly amount: €1,291.95</li>
                        <li>Projected annual income: €15,503.40</li>
                        <li>Tax rate: 9% up to €10,000 = €900, 22% on €5,503.40 = €1,210.75</li>
                        <li>Total projected annual tax: €2,110.75</li>
                        <li>Monthly withholding (€2,110.75 ÷ 12): €175.90</li>
                        <li>Net monthly salary: €1,116.05</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-md">
                      <h4 className="font-semibold mb-2">Example 2: Married part-time employee with 2 children and €1,000 monthly salary</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Monthly salary: €1,000</li>
                        <li>Social security contribution (13.87%): €138.70</li>
                        <li>Net taxable monthly amount: €861.30</li>
                        <li>Projected annual income: €10,335.60</li>
                        <li>Base tax rate: €900 + 22% on €335.60 = €973.83</li>
                        <li>Reductions: Part-time (2%) + Married (1%) + 2 children (1%) = 4% reduction</li>
                        <li>Effective tax rate: 5% on first €10,000, 18% above</li>
                        <li>Total projected annual tax: €560.41</li>
                        <li>Monthly withholding (€560.41 ÷ 12): €46.70</li>
                        <li>Net monthly salary: €814.60</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Holiday Bonus Explanations */}
            <TabsContent value="holiday-bonus" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('calculators.explanations.holidayTypes')}</CardTitle>
                  <CardDescription>Understanding Greek holiday bonuses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    In Greece, employees are entitled to three additional payments throughout the year beyond their regular monthly salary:
                    Christmas bonus, Easter bonus, and Summer holiday bonus. These are mandatory payments regulated by labor law.
                  </p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="christmas">
                      <AccordionTrigger className="font-medium text-[#0D5EAF]">
                        Christmas Bonus (Δώρο Χριστουγέννων)
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><span className="font-medium">Amount:</span> One full month's salary</li>
                          <li><span className="font-medium">Qualifying period:</span> May 1 to December 31 (8 months)</li>
                          <li><span className="font-medium">Payment deadline:</span> December 21</li>
                          <li><span className="font-medium">Pro-ration:</span> If employed for less than the full period, the bonus is calculated proportionally to the time worked (days worked ÷ total days in period × full month's salary)</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="easter">
                      <AccordionTrigger className="font-medium text-[#0D5EAF]">
                        Easter Bonus (Δώρο Πάσχα)
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><span className="font-medium">Amount:</span> Half a month's salary</li>
                          <li><span className="font-medium">Qualifying period:</span> January 1 to April 30 (4 months)</li>
                          <li><span className="font-medium">Payment deadline:</span> Before Holy Wednesday (the Wednesday before Easter)</li>
                          <li><span className="font-medium">Pro-ration:</span> If employed for less than the full period, the bonus is calculated proportionally (days worked ÷ total days in period × half month's salary)</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="summer">
                      <AccordionTrigger className="font-medium text-[#0D5EAF]">
                        Summer Holiday Bonus (Επίδομα Αδείας)
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><span className="font-medium">Amount:</span> Half a month's salary</li>
                          <li><span className="font-medium">Qualifying period:</span> January 1 to June 30 (6 months)</li>
                          <li><span className="font-medium">Payment deadline:</span> By July 15</li>
                          <li><span className="font-medium">Pro-ration:</span> If employed for less than the full period, the bonus is calculated proportionally (days worked ÷ total days in period × half month's salary)</li>
                          <li><span className="font-medium">Special note:</span> This bonus is tied to the employee's annual leave and is typically paid before the employee takes their summer vacation</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="taxation">
                      <AccordionTrigger className="font-medium text-[#0D5EAF]">
                        Taxation of Bonuses
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Holiday bonuses in Greece are subject to a flat 15% withholding tax rate. Additionally, these bonuses are subject to 
                          social security contributions at the same rate as regular salary. The tax and social security are withheld by the employer
                          at the time of payment.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('calculators.explanations.holidayExamples')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-md">
                      <h4 className="font-semibold mb-2">Example 1: Christmas bonus for employee who worked the full period</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Monthly salary: €1,200</li>
                        <li>Employment period: Full 8 months (May 1 to December 31)</li>
                        <li>Full Christmas bonus: €1,200</li>
                        <li>Withholding tax (15%): €180</li>
                        <li>Net Christmas bonus: €1,020</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-md">
                      <h4 className="font-semibold mb-2">Example 2: Easter bonus for employee who started mid-period</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Monthly salary: €1,500</li>
                        <li>Full Easter bonus (half month's salary): €750</li>
                        <li>Start date: March 1 (worked 61 days of the 120-day period)</li>
                        <li>Pro-rated bonus: (61 ÷ 120) × €750 = €381.25</li>
                        <li>Withholding tax (15%): €57.19</li>
                        <li>Net Easter bonus: €324.06</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-md">
                      <h4 className="font-semibold mb-2">Example 3: Summer holiday bonus for new employee</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Monthly salary: €1,800</li>
                        <li>Full summer bonus (half month's salary): €900</li>
                        <li>Start date: April 15 (worked 77 days of the 181-day period)</li>
                        <li>Pro-rated bonus: (77 ÷ 181) × €900 = €382.87</li>
                        <li>Withholding tax (15%): €57.43</li>
                        <li>Net summer holiday bonus: €325.44</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </div>
      </Tabs>
    </div>
  );
}