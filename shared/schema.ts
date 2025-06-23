import { z } from 'zod';

// Base schemas for our data models
export const mealPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  planType: z.enum(['daily', 'weekly', 'monthly']),
  imageUrl: z.string().optional(),
  items: z.array(z.string()),
  isVegetarian: z.boolean().default(true),
  servings: z.number(),
  availableFrom: z.string(),
  availableUntil: z.string(),
});

export const customerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  pincode: z.string(),
  createdAt: z.string(),
});

export const orderSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  mealPlanId: z.string(),
  deliveryDate: z.string(),
  totalAmount: z.number(),
  status: z.enum(['confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']).default('confirmed'),
  specialInstructions: z.string().optional(),
  orderDate: z.string(),
});

// Insert schemas (without auto-generated fields)
export const insertMealPlanSchema = mealPlanSchema.omit({ id: true });
export const insertCustomerSchema = customerSchema.omit({ id: true, createdAt: true });
export const insertOrderSchema = orderSchema.omit({ id: true, orderDate: true });

// Types
export type MealPlan = z.infer<typeof mealPlanSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type Order = z.infer<typeof orderSchema>;

export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;