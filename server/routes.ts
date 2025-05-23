import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { calculateIncomeTax, calculateWithholdingTax, calculateHolidayBonus } from "../client/src/lib/taxCalculations";
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
      let employmentIncome = 0;
      if (data.yearlyIncome) {
        employmentIncome = parseFloat(data.yearlyIncome) || 0;
      } else if (data.monthlyIncome) {
        const monthlyIncome = parseFloat(data.monthlyIncome) || 0;
        const annualSalaries = parseInt(data.annualSalaries || '14');
        employmentIncome = monthlyIncome * annualSalaries;
      }
      
      const result = calculateIncomeTax({
        employmentIncome,
        selfEmploymentIncome: 0, // Removed from UI as requested
        rentalIncome: 0, // Removed from UI as requested
        pensionIncome: 0, // Removed from UI as requested
        medicalExpenses: 0,
        charitableDonations: 0,
        familyStatus: data.familyStatus,
        children: data.children,
        taxResidenceTransfer: data.taxResidenceTransfer === true,
        annualSalaries: parseInt(data.annualSalaries || '14')
      });
      
      res.json(result);
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
      
      const result = calculateWithholdingTax({
        monthlySalary: parseFloat(data.monthlySalary) || 0,
        employmentType: data.employmentType,
        familyStatus: data.familyStatus,
        children: data.children,
        taxResidenceTransfer: data.taxResidenceTransfer === true,
        annualSalaries: parseInt(data.annualSalaries || '14')
      });
      
      res.json(result);
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
      
      const result = calculateHolidayBonus({
        monthlySalary: parseFloat(data.monthlySalary) || 0,
        startDate: new Date(data.startDate),
        bonusType: data.bonusType,
        paymentDate: new Date() // Always use today's date
      });
      
      res.json(result);
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
