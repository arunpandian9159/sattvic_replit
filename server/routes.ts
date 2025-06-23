import { Router, Request, Response } from 'express';
import { IStorage } from './storage.js';
import { insertMealPlanSchema, insertCustomerSchema, insertOrderSchema } from '../shared/schema.js';

export function createRoutes(storage: IStorage) {
  const router = Router();

  // Meal Plans Routes
  router.get('/api/meal-plans', async (req, res) => {
    try {
      const mealPlans = await storage.getMealPlans();
      res.json(mealPlans);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch meal plans' });
    }
  });

  router.get('/api/meal-plans/:id', async (req: Request, res: Response) => {
    try {
      const mealPlan = await storage.getMealPlanById(req.params.id);
      if (!mealPlan) {
        return res.status(404).json({ error: 'Meal plan not found' });
      }
      res.json(mealPlan);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch meal plan' });
    }
  });

  router.post('/api/meal-plans', async (req, res) => {
    try {
      const validatedData = insertMealPlanSchema.parse(req.body);
      const mealPlan = await storage.createMealPlan(validatedData);
      res.status(201).json(mealPlan);
    } catch (error) {
      res.status(400).json({ error: 'Invalid meal plan data' });
    }
  });

  // Customer Routes
  router.get('/api/customers', async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch customers' });
    }
  });

  router.get('/api/customers/:id', async (req, res) => {
    try {
      const customer = await storage.getCustomerById(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch customer' });
    }
  });

  router.post('/api/customers', async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      
      // Check if customer already exists
      const existingCustomer = await storage.getCustomerByEmail(validatedData.email);
      if (existingCustomer) {
        return res.status(400).json({ error: 'Customer with this email already exists' });
      }

      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ error: 'Invalid customer data' });
    }
  });

  // Order Routes
  router.get('/api/orders', async (req, res) => {
    try {
      const { customerId } = req.query;
      
      let orders;
      if (customerId) {
        orders = await storage.getOrdersByCustomerId(customerId as string);
      } else {
        orders = await storage.getOrders();
      }
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  router.get('/api/orders/:id', async (req, res) => {
    try {
      const order = await storage.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  });

  router.post('/api/orders', async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      
      // Validate that customer and meal plan exist
      const customer = await storage.getCustomerById(validatedData.customerId);
      if (!customer) {
        return res.status(400).json({ error: 'Customer not found' });
      }

      const mealPlan = await storage.getMealPlanById(validatedData.mealPlanId);
      if (!mealPlan) {
        return res.status(400).json({ error: 'Meal plan not found' });
      }

      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: 'Invalid order data' });
    }
  });

  router.patch('/api/orders/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!['confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const updatedOrder = await storage.updateOrderStatus(req.params.id, status);
      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  return router;
}