import { users, orders, seasonalDeals, type User, type InsertUser, type Order, type InsertOrder, type SeasonalDeal, type InsertSeasonalDeal } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  updateOrderPaymentStatus(id: number, stripePaymentIntentId: string): Promise<Order | undefined>;
  getOrderCountForDate(date: string): Promise<number>;
  
  getActiveSeasonalDeals(): Promise<SeasonalDeal[]>;
  createSeasonalDeal(deal: InsertSeasonalDeal): Promise<SeasonalDeal>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async updateOrderPaymentStatus(id: number, stripePaymentIntentId: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ paymentStatus: "paid", stripePaymentIntentId })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getOrderCountForDate(date: string): Promise<number> {
    const ordersOnDate = await db.select().from(orders).where(eq(orders.collectionDate, date));
    return ordersOnDate.length;
  }

  async getActiveSeasonalDeals(): Promise<SeasonalDeal[]> {
    return db.select().from(seasonalDeals).where(eq(seasonalDeals.isActive, 1));
  }

  async createSeasonalDeal(insertDeal: InsertSeasonalDeal): Promise<SeasonalDeal> {
    const [deal] = await db.insert(seasonalDeals).values(insertDeal).returning();
    return deal;
  }
}

export const storage = new DatabaseStorage();
