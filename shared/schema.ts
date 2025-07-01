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
  productType: text("product_type").notNull(),
  productDetails: text("product_details").notNull(),
  specialRequirements: text("special_requirements"),
  extras: text("extras"),
  totalAmount: integer("total_amount").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paymentStatus: text("payment_status").default("pending"),
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

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  stripePaymentIntentId: true,
  paymentStatus: true,
  createdAt: true,
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
