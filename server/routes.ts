import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { calculateGreekTaxes } from "../client/src/lib/taxCalculations";
import { incomeTaxCalculationSchema, withholdingTaxCalculationSchema, holidayBonusCalculationSchema } from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Income Tax Calculator API
  app.post("/api/calculate/income-tax", (req, res) => {
    try {
      const data = req.body;
      
      // Validate using schema
      const parseResult = incomeTaxCalculationSchema.safeParse(data);
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid input data", 
          errors: parseResult.error.format() 
        });
      }
      
      // Get yearly income from either yearly or monthly input
      let grossAnnualSalary = 0;
      if (data.yearlyIncome) {
        grossAnnualSalary = parseFloat(data.yearlyIncome) || 0;
      } else if (data.monthlyIncome) {
        const monthlyIncome = parseFloat(data.monthlyIncome) || 0;
        const annualSalaries = parseInt(data.annualSalaries || '14');
        grossAnnualSalary = monthlyIncome * annualSalaries;
      }
      
      // Use new calculation system
      const result = calculateGreekTaxes({
        grossAnnualSalary,
        children: data.children || 0,
        age: data.age,
        months: parseInt(data.annualSalaries || '14')
      });
      
      // Format response to match expected structure
      const response = {
        totalIncome: result.grossSalary,
        insuranceContributions: result.employeeContributions,
        employerContributions: result.employerContributions,
        taxableIncome: result.taxableIncome,
        taxCredit: result.taxCredit,
        incomeTax: result.incomeTax,
        netIncome: result.netIncome,
        effectiveTaxRate: result.effectiveTaxRate,
        breakdown: result.breakdown
      };
      
      res.json(response);
    } catch (error) {
      console.error("Income tax calculation error:", error);
      res.status(500).json({ message: "Error calculating income tax" });
    }
  });
  
  // Withholding Tax Calculator API
  app.post("/api/calculate/withholding-tax", (req, res) => {
    try {
      const data = req.body;
      
      // Validate using schema
      const parseResult = withholdingTaxCalculationSchema.safeParse(data);
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid input data", 
          errors: parseResult.error.format() 
        });
      }
      
      const monthlySalary = parseFloat(data.monthlySalary) || 0;
      const annualSalaries = parseInt(data.annualSalaries || '14');
      const grossAnnualSalary = monthlySalary * annualSalaries;
      
      // Use new calculation system with corrected progressive tax algorithm
      const result = calculateGreekTaxes({
        grossAnnualSalary,
        children: parseInt(data.children) || 0,
        age: data.age ? parseInt(data.age) : undefined,
        months: annualSalaries
      });
      
      // Format response for withholding tax UI
      // Includes all fields needed by WithholdingTaxCalculator component
      const response = {
        // Monthly values
        grossSalary: result.breakdown.monthlyGross,
        socialSecurity: result.breakdown.monthlyEmployeeContributions,
        withholdingTaxAmount: result.breakdown.monthlyTax,
        netSalary: result.breakdown.monthlyNet,
        
        // Annual values
        annualGross: result.grossSalary,
        annualInsurance: result.employeeContributions,
        annualTaxableIncome: result.taxableIncome,
        annualTax: result.incomeTax,
        annualNet: result.netIncome,
        
        // Employer costs
        employerContributionsMonthly: result.breakdown.monthlyEmployerContributions,
        employerContributionsAnnual: result.employerContributions,
        employerCostMonthly: result.breakdown.monthlyGross + result.breakdown.monthlyEmployerContributions,
        employerCostAnnual: result.grossSalary + result.employerContributions,
        
        // Percentages for breakdown chart
        insurancePercentage: ((result.employeeContributions / result.grossSalary) * 100).toFixed(1),
        taxPercentage: ((result.incomeTax / result.grossSalary) * 100).toFixed(1),
        netPercentage: ((result.netIncome / result.grossSalary) * 100).toFixed(1)
      };
      
      res.json(response);
    } catch (error) {
      console.error("Withholding tax calculation error:", error);
      res.status(500).json({ message: "Error calculating withholding tax" });
    }
  });
  
  // Holiday Bonus Calculator API
  app.post("/api/calculate/holiday-bonus", (req, res) => {
    try {
      const data = req.body;
      
      // Validate using schema
      const parseResult = holidayBonusCalculationSchema.safeParse(data);
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid input data", 
          errors: parseResult.error.format() 
        });
      }
      
      const monthlySalary = parseFloat(data.monthlySalary) || 0;
      const bonusType = data.bonusType;
      
      // Calculate bonus amount based on type
      let bonusAmount = 0;
      if (bonusType === 'christmas') {
        bonusAmount = monthlySalary; // Full month salary
      } else if (bonusType === 'easter') {
        bonusAmount = monthlySalary * 0.5; // Half month salary
      } else if (bonusType === 'summer') {
        bonusAmount = monthlySalary * 0.5; // Half month salary
      }
      
      // Calculate tax on bonus using the new system
      // Bonus is taxed as regular income
      const result = calculateGreekTaxes({
        grossAnnualSalary: bonusAmount,
        children: 0,
        months: 1 // Treat bonus as single payment
      });
      
      const response = {
        bonusAmount,
        bonusType,
        tax: result.incomeTax,
        insurance: result.employeeContributions,
        netBonus: result.netIncome
      };
      
      res.json(response);
    } catch (error) {
      console.error("Holiday bonus calculation error:", error);
      res.status(500).json({ message: "Error calculating holiday bonus" });
    }
  });

  // Gift Tax Calculator API
  app.post("/api/calculate/gift-tax", (req, res) => {
    try {
      const data = req.body;
      // Basic calculation logic (replace with real rules if needed)
      const giftValue = parseFloat(data.giftValue) || 0;
      const previousGifts = parseFloat(data.previousGifts) || 0;
      const relationship = data.relationship || 'category-a';
      const giftType = data.giftType || 'money';

      // Example thresholds (replace with real Greek tax law if available)
      let taxFreeAmount = 0;
      let taxRate = '0%';
      let rate = 0;
      if (relationship === 'category-a') {
        taxFreeAmount = 80000;
        rate = 0.10;
        taxRate = '10%';
      } else if (relationship === 'category-b') {
        taxFreeAmount = 30000;
        rate = 0.20;
        taxRate = '20%';
      } else {
        taxFreeAmount = 6000;
        rate = 0.40;
        taxRate = '40%';
      }

      const totalGiftValue = giftValue + previousGifts;
      const taxableGift = Math.max(0, totalGiftValue - taxFreeAmount);
      const giftTaxAmount = taxableGift * rate;

      res.json({
        totalGiftValue,
        taxRate,
        taxFreeAmount,
        taxableGift,
        giftTaxAmount
      });
    } catch (error) {
      console.error("Gift tax calculation error:", error);
      res.status(500).json({ message: "Error calculating gift tax" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
