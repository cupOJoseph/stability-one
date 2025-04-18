import { pgTable, text, serial, integer, boolean, numeric, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  capitalOneAccessToken: text("capital_one_access_token"),
  capitalOneRefreshToken: text("capital_one_refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  userProfile: json("user_profile")
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Financial account schema
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  accountId: text("account_id").notNull().unique(),
  type: text("type").notNull(), // checking, savings, etc.
  name: text("name").notNull(),
  balance: numeric("balance").notNull(),
  available: numeric("available"),
  accountNumber: text("account_number"),
  interestRate: numeric("interest_rate"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertAccountSchema = createInsertSchema(accounts).omit({
  id: true,
  createdAt: true
});

// Transaction schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  accountId: integer("account_id").notNull().references(() => accounts.id),
  transactionId: text("transaction_id").notNull().unique(),
  date: timestamp("date").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount").notNull(),
  category: text("category"),
  merchant: text("merchant"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true
});

// Spending category summary schema
export const spendingCategories = pgTable("spending_categories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  category: text("category").notNull(),
  amount: numeric("amount").notNull(),
  percentage: numeric("percentage"),
  icon: text("icon"),
  color: text("color"),
  period: text("period").notNull(), // current_month, last_month, etc.
  createdAt: timestamp("created_at").defaultNow()
});

export const insertSpendingCategorySchema = createInsertSchema(spendingCategories).omit({
  id: true,
  createdAt: true
});

// Upcoming bills schema
export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  amount: numeric("amount").notNull(),
  dueDate: timestamp("due_date").notNull(),
  category: text("category"),
  icon: text("icon"),
  color: text("color"),
  isPaid: boolean("is_paid").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertBillSchema = createInsertSchema(bills).omit({
  id: true,
  createdAt: true
});

// Auth state schema (for OAuth flow)
export const authStates = pgTable("auth_states", {
  id: serial("id").primaryKey(),
  state: text("state").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertAuthStateSchema = createInsertSchema(authStates).omit({
  id: true,
  createdAt: true
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Account = typeof accounts.$inferSelect;
export type InsertAccount = z.infer<typeof insertAccountSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type SpendingCategory = typeof spendingCategories.$inferSelect;
export type InsertSpendingCategory = z.infer<typeof insertSpendingCategorySchema>;

export type Bill = typeof bills.$inferSelect;
export type InsertBill = z.infer<typeof insertBillSchema>;

export type AuthState = typeof authStates.$inferSelect;
export type InsertAuthState = z.infer<typeof insertAuthStateSchema>;
