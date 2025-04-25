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
  
  // Calculate total income
  const totalIncome = employmentIncome + selfEmploymentIncome + rentalIncome + pensionIncome;
  
  // Calculate deductions based on family status and children
  let baseDeduction = 1000; // Base deduction
  
  // Add deductions for children
  if (data.children === '1') {
    baseDeduction += 1000;
  } else if (data.children === '2') {
    baseDeduction += 2000;
  } else if (data.children === '3') {
    baseDeduction += 5000;
  } else if (data.children === '4+') {
    baseDeduction += 6000;
  }
  
  // Add deductions for medical expenses and charitable donations (simplified)
  const medicalDeduction = Math.min(medicalExpenses, totalIncome * 0.1);
  const charitableDeduction = Math.min(charitableDonations, totalIncome * 0.05);
  
  const totalDeductions = baseDeduction + medicalDeduction + charitableDeduction;
  
  // Calculate income tax using 2025 tax brackets (simplified progressive tax system)
  let incomeTax = 0;
  let taxRate = "";
  
  if (totalIncome <= 10000) {
    incomeTax = totalIncome * 0.09;
    taxRate = "9%";
  } else if (totalIncome <= 20000) {
    incomeTax = 10000 * 0.09 + (totalIncome - 10000) * 0.22;
    taxRate = "9% - 22%";
  } else if (totalIncome <= 30000) {
    incomeTax = 10000 * 0.09 + 10000 * 0.22 + (totalIncome - 20000) * 0.28;
    taxRate = "9% - 28%";
  } else if (totalIncome <= 40000) {
    incomeTax = 10000 * 0.09 + 10000 * 0.22 + 10000 * 0.28 + (totalIncome - 30000) * 0.36;
    taxRate = "9% - 36%";
  } else {
    incomeTax = 10000 * 0.09 + 10000 * 0.22 + 10000 * 0.28 + 10000 * 0.36 + (totalIncome - 40000) * 0.44;
    taxRate = "9% - 44%";
  }
  
  // Calculate solidarity contribution (assuming reduced for 2025)
  let solidarityContribution = 0;
  if (totalIncome > 30000) {
    solidarityContribution = (totalIncome - 30000) * 0.02;
  }
  
  // Calculate final tax after deductions
  const finalIncomeTax = Math.max(0, incomeTax - totalDeductions);
  const totalTax = finalIncomeTax + solidarityContribution;
  
  return {
    totalIncome,
    taxRate,
    taxDeductions: totalDeductions,
    incomeTaxAmount: finalIncomeTax,
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
  
  // Calculate social security contributions (approximately 13.87% for employees)
  const socialSecurity = monthlySalary * 0.1387;
  
  // Calculate taxable amount
  const taxableAmount = monthlySalary - socialSecurity;
  
  // Annualize for tax rate determination
  const annualizedIncome = taxableAmount * 12;
  
  // Apply tax rate based on annual income projection
  let withholdingTaxRate = 0;
  
  if (annualizedIncome <= 10000) {
    withholdingTaxRate = 0.09;
  } else if (annualizedIncome <= 20000) {
    withholdingTaxRate = 0.22;
  } else if (annualizedIncome <= 30000) {
    withholdingTaxRate = 0.28;
  } else if (annualizedIncome <= 40000) {
    withholdingTaxRate = 0.36;
  } else {
    withholdingTaxRate = 0.44;
  }
  
  // Apply reduction for part-time if applicable
  if (data.employmentType === 'part-time') {
    withholdingTaxRate = Math.max(0, withholdingTaxRate - 0.02);
  }
  
  // Apply reduction for family status and children
  if (data.familyStatus === 'married') {
    withholdingTaxRate = Math.max(0, withholdingTaxRate - 0.01);
  }
  
  if (data.children === '1') {
    withholdingTaxRate = Math.max(0, withholdingTaxRate - 0.005);
  } else if (data.children === '2') {
    withholdingTaxRate = Math.max(0, withholdingTaxRate - 0.01);
  } else if (data.children === '3') {
    withholdingTaxRate = Math.max(0, withholdingTaxRate - 0.02);
  } else if (data.children === '4+') {
    withholdingTaxRate = Math.max(0, withholdingTaxRate - 0.03);
  }
  
  // Calculate withholding tax
  const withholdingTax = taxableAmount * withholdingTaxRate;
  
  // Calculate net salary
  const netSalary = monthlySalary - socialSecurity - withholdingTax;
  
  return {
    grossSalary: monthlySalary,
    socialSecurity,
    withholdingTaxAmount: withholdingTax,
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
