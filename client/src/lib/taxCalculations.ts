// Greek income tax calculation functions for 2025

// Income Tax Calculation
export function calculateIncomeTax(data: {
  employmentIncome: number;
  selfEmploymentIncome: number;
  rentalIncome: number;
  pensionIncome: number;
  medicalExpenses: number;
  charitableDonations: number;
  familyStatus: string;
  children: string;
}) {
  // Parse numbers
  const employmentIncome = parseFloat(data.employmentIncome.toString()) || 0;
  const selfEmploymentIncome = parseFloat(data.selfEmploymentIncome.toString()) || 0;
  const rentalIncome = parseFloat(data.rentalIncome.toString()) || 0;
  const pensionIncome = parseFloat(data.pensionIncome.toString()) || 0;
  const medicalExpenses = parseFloat(data.medicalExpenses.toString()) || 0;
  const charitableDonations = parseFloat(data.charitableDonations.toString()) || 0;
  
  // Calculate total gross income
  const totalGrossIncome = employmentIncome + selfEmploymentIncome + rentalIncome + pensionIncome;
  
  // Calculate social security contributions first (based on income type)
  // For employment income: 13.87%
  const employmentSocialSecurity = employmentIncome * 0.1387;
  // For self-employment (approximately 27% but varies depending on profession)
  const selfEmploymentSocialSecurity = selfEmploymentIncome * 0.27;
  // Pension income has no social security deduction
  const pensionSocialSecurity = 0;
  // Rental income has no social security deduction
  const rentalSocialSecurity = 0;
  
  // Total social security contributions
  const totalSocialSecurity = employmentSocialSecurity + selfEmploymentSocialSecurity + 
                              pensionSocialSecurity + rentalSocialSecurity;
  
  // Calculate taxable income after social security
  const totalIncomeAfterSocialSecurity = totalGrossIncome - totalSocialSecurity;
  
  // Calculate tax-free allowance based on family status and children
  let taxFreeAllowance = 1000; // Base amount
  
  // Add additional tax-free amount for children
  if (data.children === '1') {
    taxFreeAllowance += 1000;
  } else if (data.children === '2') {
    taxFreeAllowance += 2000;
  } else if (data.children === '3') {
    taxFreeAllowance += 5000;
  } else if (data.children === '4+') {
    taxFreeAllowance += 6000;
  }
  
  // Add additional tax-free amount for family status
  if (data.familyStatus === 'married') {
    taxFreeAllowance += 1000;
  }
  
  // Add deductions for medical expenses and charitable donations
  const medicalDeduction = Math.min(medicalExpenses, totalIncomeAfterSocialSecurity * 0.1);
  const charitableDeduction = Math.min(charitableDonations, totalIncomeAfterSocialSecurity * 0.05);
  
  // Calculate total deductions
  const totalDeductions = taxFreeAllowance + medicalDeduction + charitableDeduction;
  
  // Calculate taxable income after all deductions (cannot be negative)
  const taxableIncome = Math.max(0, totalIncomeAfterSocialSecurity - totalDeductions);
  
  // Calculate income tax using 2025 tax brackets (progressive tax system)
  let incomeTax = 0;
  let taxRate = "";
  
  if (taxableIncome <= 10000) {
    incomeTax = taxableIncome * 0.09;
    taxRate = "9%";
  } else if (taxableIncome <= 20000) {
    incomeTax = 10000 * 0.09 + (taxableIncome - 10000) * 0.22;
    taxRate = "9% - 22%";
  } else if (taxableIncome <= 30000) {
    incomeTax = 10000 * 0.09 + 10000 * 0.22 + (taxableIncome - 20000) * 0.28;
    taxRate = "9% - 28%";
  } else if (taxableIncome <= 40000) {
    incomeTax = 10000 * 0.09 + 10000 * 0.22 + 10000 * 0.28 + (taxableIncome - 30000) * 0.36;
    taxRate = "9% - 36%";
  } else {
    incomeTax = 10000 * 0.09 + 10000 * 0.22 + 10000 * 0.28 + 10000 * 0.36 + (taxableIncome - 40000) * 0.44;
    taxRate = "9% - 44%";
  }
  
  // Calculate solidarity contribution (assuming reduced for 2025)
  let solidarityContribution = 0;
  if (taxableIncome > 30000) {
    solidarityContribution = (taxableIncome - 30000) * 0.02;
  }
  
  // Calculate total tax
  const totalTax = incomeTax + solidarityContribution;
  
  return {
    totalIncome: totalGrossIncome,
    taxRate,
    taxDeductions: totalDeductions,
    incomeTaxAmount: incomeTax,
    solidarityAmount: solidarityContribution,
    totalTax
  };
}

// Withholding Tax Calculation
export function calculateWithholdingTax(data: {
  monthlySalary: number;
  employmentType: string;
  familyStatus: string;
  children: string;
}) {
  // Parse numbers
  const monthlySalary = parseFloat(data.monthlySalary.toString()) || 0;
  
  // Calculate annual gross salary (assuming 14 payments for Greek employment system)
  const annualGrossSalary = monthlySalary * 14;
  
  // Calculate social security contributions (approximately 13.87% for employees)
  const monthlySocialSecurity = monthlySalary * 0.1387;
  const annualSocialSecurity = monthlySocialSecurity * 14;
  
  // Calculate annual taxable amount after social security
  const annualTaxableIncome = annualGrossSalary - annualSocialSecurity;
  
  // Calculate tax-free allowance
  let taxFreeAllowance = 1000; // Base amount
  
  // Add additional allowance for family status
  if (data.familyStatus === 'married') {
    taxFreeAllowance += 1000;
  }
  
  // Add additional allowance for children
  if (data.children === '1') {
    taxFreeAllowance += 1000;
  } else if (data.children === '2') {
    taxFreeAllowance += 2000;
  } else if (data.children === '3') {
    taxFreeAllowance += 5000;
  } else if (data.children === '4+') {
    taxFreeAllowance += 6000;
  }
  
  // Part-time workers get an additional allowance
  if (data.employmentType === 'part-time') {
    taxFreeAllowance += 500;
  }
  
  // Calculate taxable income after tax-free allowance
  const annualTaxableIncomeAfterAllowance = Math.max(0, annualTaxableIncome - taxFreeAllowance);
  
  // Calculate annual withholding tax using progressive tax brackets
  let annualWithholdingTax = 0;
  
  if (annualTaxableIncomeAfterAllowance <= 10000) {
    annualWithholdingTax = annualTaxableIncomeAfterAllowance * 0.09;
  } else if (annualTaxableIncomeAfterAllowance <= 20000) {
    annualWithholdingTax = 10000 * 0.09 + (annualTaxableIncomeAfterAllowance - 10000) * 0.22;
  } else if (annualTaxableIncomeAfterAllowance <= 30000) {
    annualWithholdingTax = 10000 * 0.09 + 10000 * 0.22 + (annualTaxableIncomeAfterAllowance - 20000) * 0.28;
  } else if (annualTaxableIncomeAfterAllowance <= 40000) {
    annualWithholdingTax = 10000 * 0.09 + 10000 * 0.22 + 10000 * 0.28 + (annualTaxableIncomeAfterAllowance - 30000) * 0.36;
  } else {
    annualWithholdingTax = 10000 * 0.09 + 10000 * 0.22 + 10000 * 0.28 + 10000 * 0.36 + (annualTaxableIncomeAfterAllowance - 40000) * 0.44;
  }
  
  // Calculate monthly withholding tax (divide by 12 months for regular withholding)
  const monthlyWithholdingTax = annualWithholdingTax / 12;
  
  // Calculate net monthly salary
  const netSalary = monthlySalary - monthlySocialSecurity - monthlyWithholdingTax;
  
  return {
    grossSalary: monthlySalary,
    socialSecurity: monthlySocialSecurity,
    withholdingTaxAmount: monthlyWithholdingTax,
    netSalary
  };
}

// Holiday Bonus Calculation (Easter, Christmas, Summer/August)
export function calculateHolidayBonus(data: {
  monthlySalary: number;
  startDate: Date;
  bonusType: string; // "christmas", "easter", "summer"
  paymentDate: Date;
}) {
  // Parse numbers
  const monthlySalary = parseFloat(data.monthlySalary.toString()) || 0;
  
  // Set reference dates based on bonus type
  const year = data.paymentDate.getFullYear();
  let periodStartDate: Date;
  let periodEndDate: Date;
  let fullAmount: number;
  
  switch (data.bonusType) {
    case 'christmas':
      // Christmas bonus covers May 1 to December 31 (8 months)
      // Paid by December 21
      periodStartDate = new Date(year, 4, 1); // May 1
      periodEndDate = new Date(year, 11, 31); // December 31
      fullAmount = monthlySalary; // Full month's salary
      break;
    case 'easter':
      // Easter bonus covers January 1 to April 30 (4 months)
      // Paid before Easter (variable date, but use April 15 as approximate)
      periodStartDate = new Date(year, 0, 1); // January 1
      periodEndDate = new Date(year, 3, 30); // April 30
      fullAmount = monthlySalary / 2; // Half month's salary
      break;
    case 'summer':
      // Summer/vacation bonus covers January 1 to June 30 (6 months)
      // Paid by July 15
      periodStartDate = new Date(year, 0, 1); // January 1
      periodEndDate = new Date(year, 5, 30); // June 30
      fullAmount = monthlySalary / 2; // Half month's salary
      break;
    default:
      periodStartDate = new Date(year, 0, 1);
      periodEndDate = new Date(year, 11, 31);
      fullAmount = monthlySalary;
  }
  
  // Calculate days worked in the period
  const employmentStartDate = new Date(data.startDate);
  const effectiveStartDate = employmentStartDate > periodStartDate ? employmentStartDate : periodStartDate;
  
  // Calculate total days in period
  const totalDays = Math.floor((periodEndDate.getTime() - periodStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Calculate days worked
  const daysWorked = Math.max(0, Math.floor((periodEndDate.getTime() - effectiveStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  
  // Calculate pro-rated amount
  const eligibleAmount = (daysWorked / totalDays) * fullAmount;
  
  // Calculate tax (flat 15% for holiday bonuses in Greece)
  const taxRate = 0.15;
  const taxWithheld = eligibleAmount * taxRate;
  
  // Calculate net bonus amount
  const netBonusAmount = eligibleAmount - taxWithheld;
  
  return {
    grossSalary: monthlySalary,
    daysWorked,
    eligibleAmount,
    bonusType: data.bonusType,
    bonusAmount: eligibleAmount,
    taxWithheld,
    netBonusAmount
  };
}
