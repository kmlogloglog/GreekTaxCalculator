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
      
      const result = calculateIncomeTax({
        employmentIncome: parseFloat(data.employmentIncome) || 0,
        selfEmploymentIncome: parseFloat(data.selfEmploymentIncome) || 0,
        rentalIncome: parseFloat(data.rentalIncome) || 0,
        pensionIncome: parseFloat(data.pensionIncome) || 0,
        medicalExpenses: 0, // Default to 0 since removed from UI
        charitableDonations: 0, // Default to 0 since removed from UI
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

  const httpServer = createServer(app);

  return httpServer;
}
