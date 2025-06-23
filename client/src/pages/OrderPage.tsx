import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, MapPin, Phone, User, ShoppingBag, ArrowLeft } from 'lucide-react';
import { MealPlan, insertCustomerSchema, insertOrderSchema } from '../../../shared/schema';
import { apiRequest, queryClient } from '../lib/queryClient';
import { useToast } from '../hooks/use-toast';

interface OrderPageProps {
  params: { id: string };
}

const orderFormSchema = insertCustomerSchema.extend({
  deliveryDate: z.string().min(1, 'Please select a delivery date'),
  specialInstructions: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

export default function OrderPage({ params }: OrderPageProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: mealPlan, isLoading } = useQuery<MealPlan>({
    queryKey: ['/api/meal-plans', params.id],
  });

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      pincode: '',
      deliveryDate: '',
      specialInstructions: '',
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: { customer: OrderFormData; order: any }) => {
      // First create or get customer
      const customer = await apiRequest('/api/customers', {
        method: 'POST',
        body: JSON.stringify({
          name: orderData.customer.name,
          email: orderData.customer.email,
          phone: orderData.customer.phone,
          address: orderData.customer.address,
          city: orderData.customer.city,
          pincode: orderData.customer.pincode,
        }),
      });

      // Then create order
      const order = await apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerId: customer.id,
          mealPlanId: params.id,
          deliveryDate: orderData.customer.deliveryDate,
          totalAmount: mealPlan?.price || 0,
          specialInstructions: orderData.customer.specialInstructions,
        }),
      });

      return { customer, order };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: 'Order placed successfully!',
        description: 'Your meal will be delivered on the selected date.',
      });
      setLocation('/my-orders');
    },
    onError: (error: any) => {
      toast({
        title: 'Order failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: OrderFormData) => {
    if (!mealPlan) return;
    
    setIsSubmitting(true);
    try {
      await createOrderMutation.mutateAsync({
        customer: data,
        order: {},
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date as minimum delivery date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background safe-area-top">
        <div className="p-4">
          <div className="skeleton h-8 w-32 mb-6"></div>
          <div className="skeleton h-32 w-full mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton h-12 w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="min-h-screen bg-background safe-area-top flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Meal plan not found</h2>
          <button
            onClick={() => setLocation('/meals')}
            className="btn-primary"
          >
            Browse Meals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-top">
      {/* Header */}
      <header className="bg-card border-b px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setLocation('/meals')}
            className="p-2 -ml-2 hover:bg-muted rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Place Order</h1>
        </div>
      </header>

      <div className="px-4 py-6 pb-24">
        {/* Meal Plan Summary */}
        <div className="bg-card rounded-lg border p-4 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">{mealPlan.name}</h2>
          <p className="text-muted-foreground text-sm mb-3">{mealPlan.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">₹{mealPlan.price}</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {mealPlan.planType}
            </span>
          </div>
        </div>

        {/* Order Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-card rounded-lg border p-4">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  {...form.register('name')}
                  type="text"
                  className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your full name"
                />
                {form.formState.errors.name && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    {...form.register('email')}
                    type="email"
                    className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-destructive text-sm mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <input
                    {...form.register('phone')}
                    type="tel"
                    className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="9500261133"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-destructive text-sm mt-1">{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-card rounded-lg border p-4">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Delivery Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Delivery Address *
                </label>
                <textarea
                  {...form.register('address')}
                  className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-20"
                  placeholder="Enter your complete delivery address"
                />
                {form.formState.errors.address && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    City *
                  </label>
                  <input
                    {...form.register('city')}
                    type="text"
                    className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Pondicherry"
                  />
                  {form.formState.errors.city && (
                    <p className="text-destructive text-sm mt-1">{form.formState.errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pincode *
                  </label>
                  <input
                    {...form.register('pincode')}
                    type="text"
                    className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="605001"
                  />
                  {form.formState.errors.pincode && (
                    <p className="text-destructive text-sm mt-1">{form.formState.errors.pincode.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Delivery Date *
                </label>
                <input
                  {...form.register('deliveryDate')}
                  type="date"
                  min={minDate}
                  className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {form.formState.errors.deliveryDate && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.deliveryDate.message}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Orders must be placed one day in advance
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  {...form.register('specialInstructions')}
                  className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-16"
                  placeholder="Any special delivery instructions..."
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-primary/5 rounded-lg border p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Meal Plan</span>
                <span className="text-foreground">{mealPlan.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Servings</span>
                <span className="text-foreground">{mealPlan.servings}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="text-success">Free</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between font-semibold">
                <span className="text-foreground">Total Amount</span>
                <span className="text-primary text-lg">₹{mealPlan.price}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || createOrderMutation.isPending}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || createOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}