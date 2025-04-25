// Greek tax calculation functions for 2025 - Matched to aftertax.gr

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
  
  // Calculate gross income by source
  const totalGrossIncome = employmentIncome + selfEmploymentIncome + rentalIncome + pensionIncome;
  
  // Employment income tax calculation - with 14 salaries system
  let employmentTax = 0;
  if (employmentIncome > 0) {
    // Employment income is annual, but paid in 14 installments
    // Calculate taxable employment income (after social security 13.87%)
    const employmentSocialSecurity = employmentIncome * 0.1387;
    const taxableEmploymentIncome = employmentIncome - employmentSocialSecurity;
    
    // Apply tax brackets to taxable employment income
    employmentTax = calculateIncomeTaxByBrackets(taxableEmploymentIncome);
  }
  
  // Self-employment income tax calculation
  let selfEmploymentTax = 0;
  if (selfEmploymentIncome > 0) {
    // Calculate taxable self-employment income (after social security 27.10%)
    const selfEmploymentSocialSecurity = selfEmploymentIncome * 0.271;
    const taxableSelfEmploymentIncome = selfEmploymentIncome - selfEmploymentSocialSecurity;
    
    // Apply tax brackets to taxable self-employment income
    selfEmploymentTax = calculateIncomeTaxByBrackets(taxableSelfEmploymentIncome);
  }
  
  // Rental income tax calculation
  let rentalTax = 0;
  if (rentalIncome > 0) {
    // Rental income has different brackets:
    // First 12,000€: 15%
    // 12,001€ - 35,000€: 35%
    // Above 35,000€: 45%
    if (rentalIncome <= 12000) {
      rentalTax = rentalIncome * 0.15;
    } else if (rentalIncome <= 35000) {
      rentalTax = 12000 * 0.15 + (rentalIncome - 12000) * 0.35;
    } else {
      rentalTax = 12000 * 0.15 + 23000 * 0.35 + (rentalIncome - 35000) * 0.45;
    }
  }
  
  // Pension income tax calculation
  let pensionTax = 0;
  if (pensionIncome > 0) {
    // Apply tax brackets directly to pension income (no social security deduction)
    pensionTax = calculateIncomeTaxByBrackets(pensionIncome);
  }
  
  // Apply tax credits based on family status and dependents
  let taxCredit = 777; // Base tax credit (single person)
  
  // Add tax credit for dependents (children)
  if (data.children === '1') {
    taxCredit = 810; // One child
  } else if (data.children === '2') {
    taxCredit = 900; // Two children
  } else if (data.children === '3') {
    taxCredit = 1120; // Three children
  } else if (data.children === '4+') {
    taxCredit = 1340; // Four or more children
  }
  
  // Reduce tax credit for higher incomes
  // For income > 12,000€, credit is reduced by 20€ per 1,000€
  const incomeAboveThreshold = Math.max(0, totalGrossIncome - 12000);
  const creditReduction = Math.min(taxCredit, Math.floor(incomeAboveThreshold / 1000) * 20);
  const finalTaxCredit = taxCredit - creditReduction;
  
  // Calculate total income tax before tax credit
  const totalIncomeTaxBeforeCredit = employmentTax + selfEmploymentTax + rentalTax + pensionTax;
  
  // Apply tax credit (cannot result in negative tax)
  const incomeTaxAmount = Math.max(0, totalIncomeTaxBeforeCredit - finalTaxCredit);
  
  // Calculate solidarity contribution (abolished in 2023, but we'll keep it for future implementation)
  let solidarityAmount = 0;
  
  // Calculate total tax
  const totalTax = incomeTaxAmount + solidarityAmount;
  
  // Generate appropriate tax rate string
  let taxRate = "Progressive 9% - 44%";
  
  return {
    totalIncome: totalGrossIncome,
    taxRate,
    taxDeductions: finalTaxCredit,
    incomeTaxAmount,
    solidarityAmount,
    totalTax
  };
}

// Helper function to apply tax brackets (matches aftertax.gr brackets)
function calculateIncomeTaxByBrackets(taxableIncome: number): number {
  let tax = 0;
  
  if (taxableIncome <= 10000) {
    tax = taxableIncome * 0.09;
  } else if (taxableIncome <= 20000) {
    tax = 10000 * 0.09 + (taxableIncome - 10000) * 0.22;
  } else if (taxableIncome <= 30000) {
    tax = 10000 * 0.09 + 10000 * 0.22 + (taxableIncome - 20000) * 0.28;
  } else if (taxableIncome <= 40000) {
    tax = 10000 * 0.09 + 10000 * 0.22 + 10000 * 0.28 + (taxableIncome - 30000) * 0.36;
  } else {
    tax = 10000 * 0.09 + 10000 * 0.22 + 10000 * 0.28 + 10000 * 0.36 + (taxableIncome - 40000) * 0.44;
  }
  
  return tax;
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
  
  // Calculate monthly taxable amount after social security
  const taxableAmount = monthlySalary - socialSecurity;
  
  // Estimate annual taxable income (with 14 payments in Greek system)
  const annualTaxableIncome = taxableAmount * 14;
  
  // Calculate annual tax based on aftertax.gr formula
  const annualTax = calculateIncomeTaxByBrackets(annualTaxableIncome);
  
  // Calculate tax credits
  let taxCredit = 777; // Base tax credit (single person)
  
  // Add tax credit for dependents (children)
  if (data.children === '1') {
    taxCredit = 810; // One child
  } else if (data.children === '2') {
    taxCredit = 900; // Two children
  } else if (data.children === '3') {
    taxCredit = 1120; // Three children
  } else if (data.children === '4+') {
    taxCredit = 1340; // Four or more children
  }
  
  // Reduce tax credit for higher incomes
  // For income > 12,000€, credit is reduced by 20€ per 1,000€
  const incomeAboveThreshold = Math.max(0, annualTaxableIncome - 12000);
  const creditReduction = Math.min(taxCredit, Math.floor(incomeAboveThreshold / 1000) * 20);
  const finalTaxCredit = taxCredit - creditReduction;
  
  // Calculate annual tax after credits
  const annualTaxAfterCredits = Math.max(0, annualTax - finalTaxCredit);
  
  // Calculate monthly withholding tax (divided by 12 for monthly withholding)
  const withholdingTaxAmount = annualTaxAfterCredits / 12;
  
  // Calculate net monthly salary
  const netSalary = monthlySalary - socialSecurity - withholdingTaxAmount;
  
  return {
    grossSalary: monthlySalary,
    socialSecurity,
    withholdingTaxAmount,
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
  // Parse numbers and dates
  const monthlySalary = parseFloat(data.monthlySalary.toString()) || 0;
  const startDate = new Date(data.startDate);
  const paymentDate = new Date(data.paymentDate || new Date());
  const currentYear = paymentDate.getFullYear();
  
  // Define calculation periods for each bonus type
  let periodStartDate: Date;
  let periodEndDate: Date;
  let fullBonusAmount: number;
  
  if (data.bonusType === 'christmas') {
    // Christmas bonus: period from May 1 to December 31
    periodStartDate = new Date(currentYear, 4, 1); // May 1
    periodEndDate = new Date(currentYear, 11, 31); // December 31
    fullBonusAmount = monthlySalary; // One full monthly salary
  } else if (data.bonusType === 'easter') {
    // Easter bonus: period from January 1 to April 30
    periodStartDate = new Date(currentYear, 0, 1); // January 1
    periodEndDate = new Date(currentYear, 3, 30); // April 30
    fullBonusAmount = monthlySalary / 2; // Half monthly salary
  } else { // Summer bonus
    // Summer bonus: period from January 1 to June 30
    periodStartDate = new Date(currentYear, 0, 1); // January 1
    periodEndDate = new Date(currentYear, 5, 30); // June 30
    fullBonusAmount = monthlySalary / 2; // Half monthly salary
  }
  
  // Calculate eligible portion based on days worked
  // If employee started after period start, use the later start date
  const effectiveStartDate = startDate > periodStartDate ? startDate : periodStartDate;
  
  // Total days in the period
  const totalDaysInPeriod = Math.floor((periodEndDate.getTime() - periodStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Days worked in the period
  const daysWorked = Math.max(0, Math.floor((periodEndDate.getTime() - effectiveStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  
  // Calculate eligible amount proportionally
  const eligibleAmount = (daysWorked / totalDaysInPeriod) * fullBonusAmount;
  
  // Apply tax withholding (flat 15% for holiday bonuses)
  const taxWithheld = eligibleAmount * 0.15;
  
  // Calculate net bonus
  const netBonusAmount = eligibleAmount - taxWithheld;
  
  return {
    grossSalary: monthlySalary,
    daysWorked,
    eligibleAmount,
    bonusType: data.bonusType,
    bonusAmount: eligibleAmount, // Same as eligibleAmount for clarity
    taxWithheld,
    netBonusAmount
  };
}
