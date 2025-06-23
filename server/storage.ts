import { MealPlan, Customer, Order, InsertMealPlan, InsertCustomer, InsertOrder } from '../shared/schema.js';

export interface IStorage {
  // Meal Plans
  getMealPlans(): Promise<MealPlan[]>;
  getMealPlanById(id: string): Promise<MealPlan | null>;
  createMealPlan(data: InsertMealPlan): Promise<MealPlan>;
  
  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomerById(id: string): Promise<Customer | null>;
  getCustomerByEmail(email: string): Promise<Customer | null>;
  createCustomer(data: InsertCustomer): Promise<Customer>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  getOrdersByCustomerId(customerId: string): Promise<Order[]>;
  createOrder(data: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: Order['status']): Promise<Order | null>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private mealPlans: Map<string, MealPlan> = new Map();
  private customers: Map<string, Customer> = new Map();
  private orders: Map<string, Order> = new Map();

  constructor() {
    this.seedData();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private seedData() {
    // Seed meal plans with South Indian dishes
    const seedMealPlans: MealPlan[] = [
      {
        id: '1',
        name: 'Traditional South Indian Thali',
        description: 'Complete vegetarian meal with sambar, rasam, dal, vegetables, rice, chapati, and pickle',
        price: 180,
        planType: 'daily',
        imageUrl: '/api/assets/south-indian-thali.jpg',
        items: ['Sambar', 'Rasam', 'Dal', 'Mixed Vegetables', 'Rice', 'Chapati', 'Pickle', 'Papad'],
        isVegetarian: true,
        servings: 1,
        availableFrom: new Date().toISOString(),
        availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        name: 'Weekly Breakfast Plan',
        description: 'Seven days of authentic South Indian breakfast - Idli, Dosa, Upma, Poha and more',
        price: 850,
        planType: 'weekly',
        imageUrl: '/api/assets/breakfast-plan.jpg',
        items: ['Idli with Sambar & Chutney', 'Masala Dosa', 'Upma', 'Poha', 'Uttapam', 'Rava Idli', 'Medu Vada'],
        isVegetarian: true,
        servings: 7,
        availableFrom: new Date().toISOString(),
        availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        name: 'Monthly Family Plan',
        description: 'Complete month of home-style South Indian meals for 4 people',
        price: 12000,
        planType: 'monthly',
        imageUrl: '/api/assets/family-plan.jpg',
        items: ['Daily Breakfast', 'Daily Lunch', 'Daily Dinner', 'Weekend Specials', 'Festival Meals'],
        isVegetarian: true,
        servings: 120,
        availableFrom: new Date().toISOString(),
        availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        name: 'Curd Rice & Pickle Combo',
        description: 'Comfort food combo with homemade curd rice, mixed vegetable curry, and traditional pickle',
        price: 120,
        planType: 'daily',
        imageUrl: '/api/assets/curd-rice-combo.jpg',
        items: ['Curd Rice', 'Mixed Vegetable Curry', 'Mango Pickle', 'Papad'],
        isVegetarian: true,
        servings: 1,
        availableFrom: new Date().toISOString(),
        availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    seedMealPlans.forEach(plan => {
      this.mealPlans.set(plan.id, plan);
    });
  }

  // Meal Plans
  async getMealPlans(): Promise<MealPlan[]> {
    return Array.from(this.mealPlans.values());
  }

  async getMealPlanById(id: string): Promise<MealPlan | null> {
    return this.mealPlans.get(id) || null;
  }

  async createMealPlan(data: InsertMealPlan): Promise<MealPlan> {
    const id = this.generateId();
    const mealPlan: MealPlan = { id, ...data };
    this.mealPlans.set(id, mealPlan);
    return mealPlan;
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    return this.customers.get(id) || null;
  }

  async getCustomerByEmail(email: string): Promise<Customer | null> {
    for (const customer of this.customers.values()) {
      if (customer.email === email) {
        return customer;
      }
    }
    return null;
  }

  async createCustomer(data: InsertCustomer): Promise<Customer> {
    const id = this.generateId();
    const customer: Customer = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.customers.set(id, customer);
    return customer;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orders.get(id) || null;
  }

  async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.customerId === customerId);
  }

  async createOrder(data: InsertOrder): Promise<Order> {
    const id = this.generateId();
    const order: Order = {
      id,
      ...data,
      orderDate: new Date().toISOString(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    const order = this.orders.get(id);
    if (!order) return null;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
}