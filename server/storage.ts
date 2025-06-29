import { users, orders, seasonalDeals, type User, type InsertUser, type Order, type InsertOrder, type SeasonalDeal, type InsertSeasonalDeal } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  updateOrderPaymentStatus(id: number, stripePaymentIntentId: string): Promise<Order | undefined>;
  
  getActiveSeasonalDeals(): Promise<SeasonalDeal[]>;
  createSeasonalDeal(deal: InsertSeasonalDeal): Promise<SeasonalDeal>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private orders: Map<number, Order>;
  private seasonalDeals: Map<number, SeasonalDeal>;
  private currentUserId: number;
  private currentOrderId: number;
  private currentDealId: number;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.seasonalDeals = new Map();
    this.currentUserId = 1;
    this.currentOrderId = 1;
    this.currentDealId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id,
      depositPaid: 0,
      stripePaymentIntentId: null,
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async updateOrderPaymentStatus(id: number, stripePaymentIntentId: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, depositPaid: 1, stripePaymentIntentId };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }

  async getActiveSeasonalDeals(): Promise<SeasonalDeal[]> {
    return Array.from(this.seasonalDeals.values()).filter(deal => deal.isActive === 1);
  }

  async createSeasonalDeal(insertDeal: InsertSeasonalDeal): Promise<SeasonalDeal> {
    const id = this.currentDealId++;
    const deal: SeasonalDeal = { 
      ...insertDeal, 
      id,
      createdAt: new Date()
    };
    this.seasonalDeals.set(id, deal);
    return deal;
  }
}

export const storage = new MemStorage();
