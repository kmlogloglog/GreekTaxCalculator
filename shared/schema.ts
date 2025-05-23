import { pgTable, text, serial, integer, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Tax calculation schemas
export const incomeTaxCalculationSchema = z.object({
  // New simplified input fields
  monthlyIncome: z.string().or(z.number()).optional(),
  yearlyIncome: z.string().or(z.number()).optional(),
  // Kept for backward compatibility, might be removed later
  employmentIncome: z.string().or(z.number()).optional(),
  selfEmploymentIncome: z.string().or(z.number()).optional(),
  rentalIncome: z.string().or(z.number()).optional(),
  pensionIncome: z.string().or(z.number()).optional(),
  familyStatus: z.string(),
  children: z.string(),
  taxResidenceTransfer: z.boolean().optional(),
  annualSalaries: z.string().or(z.number()).optional(),
});

export const withholdingTaxCalculationSchema = z.object({
  monthlySalary: z.string().or(z.number()).optional(),
  employmentType: z.string(),
  familyStatus: z.string(),
  children: z.string(),
  taxResidenceTransfer: z.boolean().optional(),
  annualSalaries: z.string().or(z.number()).optional(),
});

export const holidayBonusCalculationSchema = z.object({
  monthlySalary: z.string().or(z.number()).optional(),
  startDate: z.string().or(z.date()),
  bonusType: z.string(),
});
