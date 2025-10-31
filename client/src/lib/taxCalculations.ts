// Greek Tax Calculator - 2025-2026 Rates
// Based on official Greek tax legislation

// Insurance Contribution Rates (2025-2026)
const EMPLOYEE_CONTRIBUTION_RATE = 0.1337; // 13.37% of gross salary
const EMPLOYER_CONTRIBUTION_RATE = 0.2179; // 21.79% of gross salary (CORRECTED)
const MAX_INSURANCE_CAP = 7572.62; // Maximum monthly insurance cap (2025)
const ANNUAL_INSURANCE_CAP = 106016.68; // Annual cap: 14 months × €7,572.62

// Progressive Tax Brackets
interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 10000, rate: 0.09 },      // 0-10,000: 9%
  { min: 10000, max: 20000, rate: 0.22 },  // 10,001-20,000: 22%
  { min: 20000, max: 30000, rate: 0.28 },  // 20,001-30,000: 28%
  { min: 30000, max: 40000, rate: 0.36 },  // 30,001-40,000: 36%
  { min: 40000, max: Infinity, rate: 0.44 } // 40,001+: 44%
];

// Tax Credits by Number of Children (2025 Rules)
const TAX_CREDITS: Record<number, number> = {
  0: 0,      // No children: €0
  1: 777,    // 1 child: €777
  2: 1610,   // 2 children: €1,610
  3: 2800,   // 3 children: €2,800
  // 4+ children: €2,800 + €200 per additional child (calculated dynamically)
};

/**
 * Calculate tax credit based on number of children
 * 2025 Rules: 0=€0, 1=€777, 2=€1,610, 3=€2,800, 4+=€2,800+€200/child
 */
function calculateTaxCreditByChildren(children: number): number {
  if (children === 0) return 0;
  if (children === 1) return 777;
  if (children === 2) return 1610;
  if (children === 3) return 2800;
  // 4+ children: base €2,800 + €200 for each child beyond 3
  return 2800 + ((children - 3) * 200);
}

// Age-Based Tax Benefits (2026)
interface AgeBenefit {
  threshold?: number;
  rate?: number;
  bracket_10_20k?: number;
}

const AGE_BENEFITS: Record<string, AgeBenefit> = {
  'under_25': { threshold: 20000, rate: 0.00 },    // Zero tax up to €20,000
  '26_to_30': { bracket_10_20k: 0.09 }             // 9% on €10-20k bracket
};

/**
 * Calculate progressive tax based on tax brackets
 */
function calculateProgressiveTax(taxableIncome: number): number {
  let totalTax = 0;
  
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.min) {
      break;
    }
    
    const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
    if (taxableInBracket > 0) {
      totalTax += taxableInBracket * bracket.rate;
    }
  }
  
  return totalTax;
}


/**
 * Apply age-based tax benefits (2026 feature)
 */
function applyAgeBenefits(baseTax: number, taxableIncome: number, age?: number): number {
  if (!age) return baseTax;
  
  if (age < 25) {
    // Under 25: Zero tax up to €20,000
    const benefit = AGE_BENEFITS['under_25'];
    if (benefit.threshold && taxableIncome <= benefit.threshold) {
      return 0;
    }
    // If income exceeds threshold, calculate tax only on excess
    if (benefit.threshold && taxableIncome > benefit.threshold) {
      return calculateProgressiveTax(taxableIncome - benefit.threshold);
    }
  } else if (age >= 26 && age <= 30) {
    // 26-30: 9% on €10-20k bracket instead of 22%
    // Recalculate with adjusted rate for this bracket
    let adjustedTax = 0;
    
    for (const bracket of TAX_BRACKETS) {
      if (taxableIncome <= bracket.min) {
        break;
      }
      
      const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      if (taxableInBracket > 0) {
        // Apply special rate for 10-20k bracket
        if (bracket.min === 10000 && bracket.max === 20000) {
          adjustedTax += taxableInBracket * 0.09; // 9% instead of 22%
        } else {
          adjustedTax += taxableInBracket * bracket.rate;
        }
      }
    }
    
    return adjustedTax;
  }
  
  return baseTax;
}

/**
 * Main Greek tax calculation function
 */
export interface TaxCalculationInput {
  grossAnnualSalary: number;
  children?: number;
  age?: number;
  months?: number;
}

export interface TaxCalculationResult {
  grossSalary: number;
  employeeContributions: number;
  employerContributions: number;
  taxableIncome: number;
  baseTax: number;
  taxCredit: number;
  incomeTax: number;
  netIncome: number;
  effectiveTaxRate: number;
  breakdown: {
    monthlyGross: number;
    monthlyNet: number;
    monthlyEmployeeContributions: number;
    monthlyEmployerContributions: number;
    monthlyTax: number;
  };
}

export function calculateGreekTaxes(input: TaxCalculationInput): TaxCalculationResult {
  const {
    grossAnnualSalary,
    children = 0,
    age,
    months = 14 // Greek standard: 12 months + 2 bonuses
  } = input;
  
  // Step 1: Calculate insurance contributions
  const monthlySalary = grossAnnualSalary / months;
  const cappedMonthlySalary = Math.min(monthlySalary, MAX_INSURANCE_CAP);
  
  const annualEmployeeContributions = cappedMonthlySalary * EMPLOYEE_CONTRIBUTION_RATE * months;
  const annualEmployerContributions = cappedMonthlySalary * EMPLOYER_CONTRIBUTION_RATE * months;
  
  // Step 2: Calculate taxable income
  const taxableIncome = grossAnnualSalary - annualEmployeeContributions;
  
  // Step 3: Calculate base tax using progressive brackets
  let baseTax = calculateProgressiveTax(taxableIncome);
  
  // Step 4: Calculate tax credit based on number of children
  const taxCredit = calculateTaxCreditByChildren(children);
  
  // Step 5: Apply age benefits (2026)
  if (age) {
    baseTax = applyAgeBenefits(baseTax, taxableIncome, age);
  }
  
  // Step 6: Final tax calculation
  const incomeTax = Math.max(0, baseTax - taxCredit);
  
  // Step 7: Calculate net income
  const netIncome = grossAnnualSalary - annualEmployeeContributions - incomeTax;
  
  // Step 8: Calculate effective tax rate
  const effectiveTaxRate = (incomeTax / grossAnnualSalary) * 100;
  
  // Step 9: Calculate monthly breakdown
  const monthlyGross = grossAnnualSalary / months;
  const monthlyNet = netIncome / months;
  const monthlyEmployeeContributions = annualEmployeeContributions / months;
  const monthlyEmployerContributions = annualEmployerContributions / months;
  const monthlyTax = incomeTax / months;
  
  return {
    grossSalary: grossAnnualSalary,
    employeeContributions: annualEmployeeContributions,
    employerContributions: annualEmployerContributions,
    taxableIncome,
    baseTax,
    taxCredit,
    incomeTax,
    netIncome,
    effectiveTaxRate,
    breakdown: {
      monthlyGross,
      monthlyNet,
      monthlyEmployeeContributions,
      monthlyEmployerContributions,
      monthlyTax
    }
  };
}

/**
 * Algorithm 2: Calculate Gross from Net (Reverse Calculation)
 * Uses binary search to find the gross salary that yields the desired net salary
 */
export interface ReverseCalculationInput {
  desiredMonthlyNet: number;
  children?: number;
  age?: number;
  months?: number;
  maxIterations?: number;
  tolerance?: number;
}

export interface ReverseCalculationResult extends TaxCalculationResult {
  iterations: number;
  converged: boolean;
}

export function calculateGrossFromNet(input: ReverseCalculationInput): ReverseCalculationResult {
  const {
    desiredMonthlyNet,
    children = 0,
    age,
    months = 14,
    maxIterations = 100,
    tolerance = 0.01 // €0.01 tolerance
  } = input;
  
  const desiredAnnualNet = desiredMonthlyNet * months;
  
  // Set initial bounds for binary search
  let lowerBound = desiredAnnualNet; // Minimum possible gross
  let upperBound = desiredAnnualNet * 3; // Maximum reasonable gross (3x net)
  let iterations = 0;
  let converged = false;
  
  let bestResult: TaxCalculationResult | null = null;
  
  // Binary search
  while (iterations < maxIterations && !converged) {
    const testGross = (lowerBound + upperBound) / 2;
    
    // Calculate net for this test gross
    const result = calculateGreekTaxes({
      grossAnnualSalary: testGross,
      children,
      age,
      months
    });
    
    const calculatedNet = result.netIncome;
    const difference = calculatedNet - desiredAnnualNet;
    
    // Check if we've converged
    if (Math.abs(difference) < tolerance) {
      converged = true;
      bestResult = result;
      break;
    }
    
    // Adjust bounds
    if (calculatedNet < desiredAnnualNet) {
      // Need higher gross
      lowerBound = testGross;
    } else {
      // Need lower gross
      upperBound = testGross;
    }
    
    bestResult = result;
    iterations++;
  }
  
  if (!bestResult) {
    // Fallback: use upper bound
    bestResult = calculateGreekTaxes({
      grossAnnualSalary: upperBound,
      children,
      age,
      months
    });
  }
  
  return {
    ...bestResult,
    iterations,
    converged
  };
}

/**
 * Algorithm 3: Freelancer/Self-Employed Tax Calculator
 */

// Freelancer deduction rates by profession (2025)
export const FREELANCER_DEDUCTIONS: Record<string, number> = {
  "engineers_architects": 0.40,     // 40% of revenue
  "medical_professionals": 0.35,    // 35%
  "lawyers": 0.30,                  // 30%
  "accountants": 0.30,              // 30%
  "other_services": 0.20,           // 20%
  "traders": 0.10                   // 10%
};

const FREELANCER_INSURANCE_RATE = 0.2047; // 20.47% of net professional income
const MIN_MONTHLY_FREELANCER_INSURANCE = 230.29; // Minimum monthly insurance
const MIN_ANNUAL_FREELANCER_INSURANCE = MIN_MONTHLY_FREELANCER_INSURANCE * 12; // €2,763.48
const BUSINESS_TAX_MIN = 650; // Minimum business tax (telos epitidevmatos)
const BUSINESS_TAX_MAX = 1000; // Maximum business tax

export interface FreelancerCalculationInput {
  annualRevenue: number;
  profession?: keyof typeof FREELANCER_DEDUCTIONS;
  customExpenseRate?: number; // If profession not specified
  businessExpenses?: number; // Direct expenses amount
  children?: number;
  age?: number;
  city?: 'athens' | 'thessaloniki' | 'other'; // Affects business tax
}

export interface FreelancerCalculationResult {
  revenue: number;
  deductibleExpenses: number;
  netProfessionalIncome: number;
  socialInsurance: number;
  taxableIncome: number;
  taxCredit: number;
  incomeTax: number;
  businessTax: number;
  totalTaxAndInsurance: number;
  netIncome: number;
  effectiveTaxRate: number;
  breakdown: {
    monthlyRevenue: number;
    monthlyNet: number;
    monthlyInsurance: number;
    monthlyTax: number;
  };
}

export function calculateFreelancerTax(input: FreelancerCalculationInput): FreelancerCalculationResult {
  const {
    annualRevenue,
    profession,
    customExpenseRate,
    businessExpenses,
    children = 0,
    age,
    city = 'other'
  } = input;
  
  // Step 1: Calculate deductible expenses
  let deductibleExpenses = 0;
  if (businessExpenses !== undefined) {
    // Use direct expenses amount
    deductibleExpenses = businessExpenses;
  } else if (profession && FREELANCER_DEDUCTIONS[profession]) {
    // Use profession-based deduction rate
    deductibleExpenses = annualRevenue * FREELANCER_DEDUCTIONS[profession];
  } else if (customExpenseRate !== undefined) {
    // Use custom expense rate
    deductibleExpenses = annualRevenue * customExpenseRate;
  } else {
    // Default to 20% (other services)
    deductibleExpenses = annualRevenue * 0.20;
  }
  
  // Step 2: Calculate net professional income
  const netProfessionalIncome = annualRevenue - deductibleExpenses;
  
  // Step 3: Calculate social insurance
  let socialInsurance = netProfessionalIncome * FREELANCER_INSURANCE_RATE;
  
  // Apply minimum insurance
  if (socialInsurance < MIN_ANNUAL_FREELANCER_INSURANCE) {
    socialInsurance = MIN_ANNUAL_FREELANCER_INSURANCE;
  }
  
  // Apply annual cap
  if (socialInsurance > ANNUAL_INSURANCE_CAP) {
    socialInsurance = ANNUAL_INSURANCE_CAP;
  }
  
  // Step 4: Calculate taxable income
  const taxableIncome = netProfessionalIncome - socialInsurance;
  
  // Step 5: Calculate base tax
  let baseTax = calculateProgressiveTax(taxableIncome);
  
  // Step 6: Apply age benefits if applicable
  if (age) {
    baseTax = applyAgeBenefits(baseTax, taxableIncome, age);
  }
  
  // Step 7: Calculate tax credit
  const taxCredit = calculateTaxCreditByChildren(children);
  
  // Step 8: Calculate income tax
  const incomeTax = Math.max(0, baseTax - taxCredit);
  
  // Step 9: Calculate business tax (telos epitidevmatos)
  let businessTax = BUSINESS_TAX_MIN;
  if (city === 'athens' || city === 'thessaloniki') {
    businessTax = BUSINESS_TAX_MAX;
  }
  
  // Step 10: Calculate totals
  const totalTaxAndInsurance = incomeTax + socialInsurance + businessTax;
  const netIncome = annualRevenue - deductibleExpenses - totalTaxAndInsurance;
  const effectiveTaxRate = (totalTaxAndInsurance / annualRevenue) * 100;
  
  // Step 11: Calculate monthly breakdown
  const monthlyRevenue = annualRevenue / 12;
  const monthlyNet = netIncome / 12;
  const monthlyInsurance = socialInsurance / 12;
  const monthlyTax = (incomeTax + businessTax) / 12;
  
  return {
    revenue: annualRevenue,
    deductibleExpenses,
    netProfessionalIncome,
    socialInsurance,
    taxableIncome,
    taxCredit,
    incomeTax,
    businessTax,
    totalTaxAndInsurance,
    netIncome,
    effectiveTaxRate,
    breakdown: {
      monthlyRevenue,
      monthlyNet,
      monthlyInsurance,
      monthlyTax
    }
  };
}

/**
 * Algorithm 4: Enhanced Bonus Calculator with Prorated Calculations
 */

export interface BonusCalculationInput {
  monthlyGrossSalary: number;
  startDate: string; // ISO format: YYYY-MM-DD
  endDate?: string; // ISO format, defaults to end of current year
  children?: number;
  age?: number;
}

export interface BonusBreakdown {
  bonusType: 'christmas' | 'easter' | 'vacation';
  periodStart: string;
  periodEnd: string;
  daysInPeriod: number;
  daysWorked: number;
  grossAmount: number;
  insurance: number;
  tax: number;
  netAmount: number;
}

export interface BonusCalculationResult {
  employmentPeriod: {
    startDate: string;
    endDate: string;
    totalDaysWorked: number;
  };
  bonuses: {
    christmas: BonusBreakdown;
    easter: BonusBreakdown;
    vacation: BonusBreakdown;
  };
  totals: {
    grossBonuses: number;
    insurance: number;
    tax: number;
    netBonuses: number;
  };
}

/**
 * Calculate days between two dates (inclusive)
 */
function calculateDaysBetween(start: Date, end: Date): number {
  const diffTime = end.getTime() - start.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Calculate days worked in a specific period
 */
function calculateDaysInPeriod(
  employmentStart: Date,
  employmentEnd: Date,
  periodStart: Date,
  periodEnd: Date
): number {
  // Find the overlap between employment period and bonus period
  const overlapStart = employmentStart > periodStart ? employmentStart : periodStart;
  const overlapEnd = employmentEnd < periodEnd ? employmentEnd : periodEnd;
  
  // If no overlap, return 0
  if (overlapStart > overlapEnd) {
    return 0;
  }
  
  return calculateDaysBetween(overlapStart, overlapEnd);
}

export function calculateProRatedBonuses(input: BonusCalculationInput): BonusCalculationResult {
  const {
    monthlyGrossSalary,
    startDate,
    endDate,
    children = 0,
    age
  } = input;
  
  const employmentStart = new Date(startDate);
  const employmentEnd = endDate ? new Date(endDate) : new Date(new Date().getFullYear(), 11, 31);
  const currentYear = employmentStart.getFullYear();
  
  const totalDaysWorked = calculateDaysBetween(employmentStart, employmentEnd);
  
  // Define bonus periods for the year
  const christmasPeriodStart = new Date(currentYear, 0, 1); // Jan 1
  const christmasPeriodEnd = new Date(currentYear, 11, 31); // Dec 31
  const christmasTotalDays = 365; // Full year
  
  const easterPeriodStart = new Date(currentYear, 0, 1); // Jan 1
  const easterPeriodEnd = new Date(currentYear, 3, 30); // Apr 30
  const easterTotalDays = 123; // Jan 1 - Apr 30
  
  const vacationPeriodStart = new Date(currentYear, 0, 1); // Jan 1
  const vacationPeriodEnd = new Date(currentYear, 11, 31); // Dec 31
  const vacationTotalDays = 365; // Full year
  
  // Calculate days worked in each period
  const christmasDaysWorked = calculateDaysInPeriod(
    employmentStart,
    employmentEnd,
    christmasPeriodStart,
    christmasPeriodEnd
  );
  
  const easterDaysWorked = calculateDaysInPeriod(
    employmentStart,
    employmentEnd,
    easterPeriodStart,
    easterPeriodEnd
  );
  
  const vacationDaysWorked = calculateDaysInPeriod(
    employmentStart,
    employmentEnd,
    vacationPeriodStart,
    vacationPeriodEnd
  );
  
  // Calculate gross bonus amounts (prorated)
  const christmasGross = (christmasDaysWorked / christmasTotalDays) * monthlyGrossSalary;
  const easterGross = (easterDaysWorked / easterTotalDays) * (monthlyGrossSalary / 2);
  const vacationGross = (vacationDaysWorked / vacationTotalDays) * (monthlyGrossSalary / 2);
  
  // Calculate tax and insurance for each bonus
  const christmasResult = calculateGreekTaxes({
    grossAnnualSalary: christmasGross,
    children,
    age,
    months: 1
  });
  
  const easterResult = calculateGreekTaxes({
    grossAnnualSalary: easterGross,
    children,
    age,
    months: 1
  });
  
  const vacationResult = calculateGreekTaxes({
    grossAnnualSalary: vacationGross,
    children,
    age,
    months: 1
  });
  
  // Build bonus breakdowns
  const christmasBonus: BonusBreakdown = {
    bonusType: 'christmas',
    periodStart: christmasPeriodStart.toISOString().split('T')[0],
    periodEnd: christmasPeriodEnd.toISOString().split('T')[0],
    daysInPeriod: christmasTotalDays,
    daysWorked: christmasDaysWorked,
    grossAmount: christmasGross,
    insurance: christmasResult.employeeContributions,
    tax: christmasResult.incomeTax,
    netAmount: christmasResult.netIncome
  };
  
  const easterBonus: BonusBreakdown = {
    bonusType: 'easter',
    periodStart: easterPeriodStart.toISOString().split('T')[0],
    periodEnd: easterPeriodEnd.toISOString().split('T')[0],
    daysInPeriod: easterTotalDays,
    daysWorked: easterDaysWorked,
    grossAmount: easterGross,
    insurance: easterResult.employeeContributions,
    tax: easterResult.incomeTax,
    netAmount: easterResult.netIncome
  };
  
  const vacationBonus: BonusBreakdown = {
    bonusType: 'vacation',
    periodStart: vacationPeriodStart.toISOString().split('T')[0],
    periodEnd: vacationPeriodEnd.toISOString().split('T')[0],
    daysInPeriod: vacationTotalDays,
    daysWorked: vacationDaysWorked,
    grossAmount: vacationGross,
    insurance: vacationResult.employeeContributions,
    tax: vacationResult.incomeTax,
    netAmount: vacationResult.netIncome
  };
  
  // Calculate totals
  const totals = {
    grossBonuses: christmasGross + easterGross + vacationGross,
    insurance: christmasResult.employeeContributions + easterResult.employeeContributions + vacationResult.employeeContributions,
    tax: christmasResult.incomeTax + easterResult.incomeTax + vacationResult.incomeTax,
    netBonuses: christmasResult.netIncome + easterResult.netIncome + vacationResult.netIncome
  };
  
  return {
    employmentPeriod: {
      startDate: employmentStart.toISOString().split('T')[0],
      endDate: employmentEnd.toISOString().split('T')[0],
      totalDaysWorked
    },
    bonuses: {
      christmas: christmasBonus,
      easter: easterBonus,
      vacation: vacationBonus
    },
    totals
  };
}

/**
 * Validate calculation against known example
 */
export function validateCalculation(): boolean {
  const result = calculateGreekTaxes({
    grossAnnualSalary: 14000,
    children: 0,
    months: 14
  });
  
  const expectedNet = 11534;
  const expectedContributions = 1876;
  const expectedTax = 590;
  
  const netMatch = Math.abs(result.netIncome - expectedNet) < 10;
  const contributionsMatch = Math.abs(result.employeeContributions - expectedContributions) < 10;
  const taxMatch = Math.abs(result.incomeTax - expectedTax) < 10;
  
  return netMatch && contributionsMatch && taxMatch;
}
