import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { calculateIncomeTax, calculateWithholdingTax, calculateHolidayBonus } from "../client/src/lib/taxCalculations";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Income Tax Calculator API
  app.post("/api/calculate/income-tax", (req, res) => {
    try {
      const data = req.body;
      
      // Validate input data
      if (
        !data || 
        typeof data !== 'object' || 
        typeof data.familyStatus !== 'string' || 
        typeof data.children !== 'string'
      ) {
        return res.status(400).json({ message: "Invalid input data" });
      }
      
      const result = calculateIncomeTax({
        employmentIncome: parseFloat(data.employmentIncome) || 0,
        selfEmploymentIncome: parseFloat(data.selfEmploymentIncome) || 0,
        rentalIncome: parseFloat(data.rentalIncome) || 0,
        pensionIncome: parseFloat(data.pensionIncome) || 0,
        medicalExpenses: parseFloat(data.medicalExpenses) || 0,
        charitableDonations: parseFloat(data.charitableDonations) || 0,
        familyStatus: data.familyStatus,
        children: data.children
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
      
      // Validate input data
      if (
        !data || 
        typeof data !== 'object' || 
        typeof data.familyStatus !== 'string' || 
        typeof data.employmentType !== 'string' || 
        typeof data.children !== 'string'
      ) {
        return res.status(400).json({ message: "Invalid input data" });
      }
      
      const result = calculateWithholdingTax({
        monthlySalary: parseFloat(data.monthlySalary) || 0,
        employmentType: data.employmentType,
        familyStatus: data.familyStatus,
        children: data.children
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
      
      // Validate input data
      if (
        !data || 
        typeof data !== 'object' || 
        typeof data.bonusType !== 'string' || 
        !data.startDate || 
        !data.monthlySalary
      ) {
        return res.status(400).json({ message: "Invalid input data" });
      }
      
      const result = calculateHolidayBonus({
        monthlySalary: parseFloat(data.monthlySalary) || 0,
        startDate: new Date(data.startDate),
        bonusType: data.bonusType,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date()
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
