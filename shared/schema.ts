import { pgTable, text, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  collectionDate: text("collection_date").notNull(),
  cakeType: text("cake_type").notNull(),
  cakeSize: text("cake_size").notNull(),
  cakeFlavour: text("cake_flavour"),
  cakeTheme: text("cake_theme"),
  specialRequirements: text("special_requirements"),
  estimatedPrice: decimal("estimated_price", { precision: 10, scale: 2 }).notNull(),
  depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }).notNull(),
  depositPaid: integer("deposit_paid").default(0), // 0 = not paid, 1 = paid
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const seasonalDeals = pgTable("seasonal_deals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  discount: text("discount"),
  validUntil: text("valid_until"),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  collectionDate: true,
  cakeType: true,
  cakeSize: true,
  cakeFlavour: true,
  cakeTheme: true,
  specialRequirements: true,
  estimatedPrice: true,
  depositAmount: true,
});

export const insertSeasonalDealSchema = createInsertSchema(seasonalDeals).pick({
  title: true,
  description: true,
  discount: true,
  validUntil: true,
  isActive: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertSeasonalDeal = z.infer<typeof insertSeasonalDealSchema>;
export type SeasonalDeal = typeof seasonalDeals.$inferSelect;
