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
  employmentIncome: z.string().or(z.number()).optional(),
  selfEmploymentIncome: z.string().or(z.number()).optional(),
  rentalIncome: z.string().or(z.number()).optional(),
  pensionIncome: z.string().or(z.number()).optional(),
  medicalExpenses: z.string().or(z.number()).optional(),
  charitableDonations: z.string().or(z.number()).optional(),
  familyStatus: z.string(),
  children: z.string(),
});

export const withholdingTaxCalculationSchema = z.object({
  monthlySalary: z.string().or(z.number()).optional(),
  employmentType: z.string(),
  familyStatus: z.string(),
  children: z.string(),
});

export const giftTaxCalculationSchema = z.object({
  giftValue: z.string().or(z.number()).optional(),
  relationship: z.string(),
  giftType: z.string(),
  previousGifts: z.string().or(z.number()).optional(),
});
