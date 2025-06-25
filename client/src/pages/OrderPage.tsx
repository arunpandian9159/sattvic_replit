import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, MapPin, Phone, User, ShoppingBag, ArrowLeft, Mail } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../hooks/use-toast';
import { LoadingSpinner } from '../components/ui/loading';

const orderFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  deliveryDate: z.string().min(1, 'Please select a delivery date'),
  specialInstructions: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

interface OrderPageProps {
  params: { id: string };
}

interface MealPlan {
  id: string;
  name: string;
  description: string;
  planType: string;
  servings: number;
  price: number;
  items: string[];
  isVegetarian: boolean;
  image_url?: string;
}

export default function OrderPage({ params }: OrderPageProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMealPlan = async () => {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase.from('meal_plans').select('*').eq('id', params.id).single();
      if (error) setError(error.message);
      else setMealPlan(data as MealPlan);
      setIsLoading(false);
    };
    fetchMealPlan();
  }, [params.id]);

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

  const onSubmit = async (data: OrderFormData) => {
    if (!mealPlan) return;
    setIsSubmitting(true);
    try {
      // Create customer (or upsert by email)
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .upsert([
          {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            pincode: data.pincode,
          }
        ], { onConflict: 'email' })
        .select()
        .single();
      if (customerError || !customer) throw new Error('Customer creation failed');
      // Create order
      const { error: orderError } = await supabase.from('orders').insert({
        customer_id: customer.id,
        meal_plan_id: mealPlan.id,
        delivery_date: data.deliveryDate,
        total_amount: mealPlan.price,
        special_instructions: data.specialInstructions,
      });
      if (orderError) throw new Error('Order creation failed');
      toast({
        title: 'Order placed successfully!',
        description: 'Your meal will be delivered on the selected date.',
      });
      setLocation('/my-orders');
    } catch (err: any) {
      toast({
        title: 'Order failed',
        description: err.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date as minimum delivery date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const getImage = (plan: MealPlan) => {
    if (plan.image_url) return plan.image_url;
    return `https://source.unsplash.com/600x400/?indian-food,meal,veg,thali&sig=${plan.id}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background safe-area-top flex items-center justify-center animate-fade-in">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="min-h-screen bg-background safe-area-top flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Meal plan not found</h2>
          <button onClick={() => setLocation('/meals')} className="btn-primary">Browse Meals</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-top animate-fade-in">
      {/* Header */}
      <header className="bg-card border-b px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setLocation('/meals')} className="p-2 -ml-2 hover:bg-muted rounded-lg">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Place Order</h1>
        </div>
      </header>
      <div className="px-4 py-6 pb-24 max-w-2xl mx-auto">
        {/* Meal Plan Summary */}
        <div className="bg-card rounded-lg border p-4 mb-6 animate-slide-up">
          <div className="flex gap-4 items-center">
            <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <img src={getImage(mealPlan)} alt={mealPlan.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground mb-2">{mealPlan.name}</h2>
              <p className="text-muted-foreground text-sm mb-3">{mealPlan.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">₹{mealPlan.price}</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {mealPlan.planType}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Order Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input {...form.register('name')} type="text" className="input-field pl-10" placeholder="Your Name" disabled={isSubmitting} />
              </div>
              {form.formState.errors.name && <p className="text-destructive text-sm mt-1">{form.formState.errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input {...form.register('email')} type="email" className="input-field pl-10" placeholder="you@email.com" disabled={isSubmitting} />
              </div>
              {form.formState.errors.email && <p className="text-destructive text-sm mt-1">{form.formState.errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input {...form.register('phone')} type="tel" className="input-field pl-10" placeholder="+91 9876543210" disabled={isSubmitting} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <textarea {...form.register('address')} rows={2} className="input-field pl-10 resize-none" placeholder="Enter your delivery address" disabled={isSubmitting} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">City *</label>
              <input {...form.register('city')} type="text" className="input-field" placeholder="City" disabled={isSubmitting} />
              {form.formState.errors.city && <p className="text-destructive text-sm mt-1">{form.formState.errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Pincode *</label>
              <input {...form.register('pincode')} type="text" className="input-field" placeholder="Pincode" disabled={isSubmitting} />
              {form.formState.errors.pincode && <p className="text-destructive text-sm mt-1">{form.formState.errors.pincode.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Delivery Date *</label>
              <input {...form.register('deliveryDate')} type="date" min={minDate} className="input-field" disabled={isSubmitting} />
              {form.formState.errors.deliveryDate && <p className="text-destructive text-sm mt-1">{form.formState.errors.deliveryDate.message}</p>}
              <p className="text-xs text-muted-foreground mt-1">Orders must be placed one day in advance</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Special Instructions (Optional)</label>
              <textarea {...form.register('specialInstructions')} className="input-field resize-none" placeholder="Any special delivery instructions..." disabled={isSubmitting} />
            </div>
          </div>
          {/* Order Summary */}
          <div className="bg-muted/20 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Order Summary
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
          <button type="submit" disabled={isSubmitting} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2">
            {isSubmitting ? <LoadingSpinner size="sm" /> : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}