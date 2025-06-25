import { useEffect, useState } from 'react';
import { Clock, MapPin, Phone, CheckCircle, Truck, ChefHat, Package } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { LoadingSpinner } from '../components/ui/loading';
import { MealPlan } from '../../../shared/schema';

interface Order {
  id: string;
  meal_plan_id: string;
  customer_id: string;
  delivery_date: string;
  total_amount: number;
  special_instructions?: string;
  status: string;
  order_date: string;
  meal_plan?: MealPlan;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      // Fetch orders with related meal plan
      const { data, error } = await supabase
        .from('orders')
        .select('*, meal_plans(*)')
        .order('order_date', { ascending: false });
      if (!error && data) {
        setOrders(
          data.map((order: any) => ({
            ...order,
            meal_plan: order.meal_plans,
          }))
        );
      } else {
        setOrders([]);
      }
      setIsLoading(false);
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'preparing':
        return <ChefHat className="w-5 h-5 text-accent" />;
      case 'out_for_delivery':
        return <Truck className="w-5 h-5 text-primary" />;
      case 'delivered':
        return <Package className="w-5 h-5 text-success" />;
      case 'cancelled':
        return <Clock className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-success bg-success/10';
      case 'preparing':
        return 'text-accent bg-accent/10';
      case 'out_for_delivery':
        return 'text-primary bg-primary/10';
      case 'delivered':
        return 'text-success bg-success/10';
      case 'cancelled':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getImage = (plan?: MealPlan) => {
    if (plan?.imageUrl) return plan.imageUrl;
    if ((plan as any)?.image_url) return (plan as any).image_url;
    if (plan?.id) return `https://source.unsplash.com/600x400/?indian-food,meal,veg,thali&sig=${plan.id}`;
    return 'https://source.unsplash.com/600x400/?indian-food,veg,thali';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background safe-area-top flex items-center justify-center animate-fade-in">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-top animate-fade-in">
      {/* Header */}
      <header className="bg-card border-b px-4 py-4">
        <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your meal deliveries</p>
      </header>
      {!orders || orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">Start by browsing our delicious meal plans</p>
          <a href="/meals" className="btn-primary">Browse Meals</a>
        </div>
      ) : (
        <div className="space-y-4 max-w-2xl mx-auto py-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-card rounded-lg border overflow-hidden shadow-md animate-fade-in">
              <div className="flex gap-4 items-center p-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={getImage(order.meal_plan)} alt={order.meal_plan?.name || 'Meal'} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-foreground text-lg">Order #{order.id.substring(0, 8)}</h3>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{formatStatus(order.status)}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">Placed on {formatDate(order.order_date)}</p>
                  <h4 className="font-medium text-foreground mt-2 mb-1">{order.meal_plan?.name || 'Meal Plan'}</h4>
                  <p className="text-muted-foreground text-sm line-clamp-2">{order.meal_plan?.description}</p>
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Delivery Date:</span>
                    <span className="text-foreground font-medium">{formatDate(order.delivery_date)}</span>
                  </div>
                  {order.special_instructions && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-1">Special Instructions:</p>
                      <p className="text-sm text-foreground bg-muted/30 p-2 rounded">{order.special_instructions}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="text-xl font-bold text-primary">₹{order.total_amount}</span>
                  </div>
                </div>
              </div>
              {/* Order Progress Bar */}
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <div className="bg-muted/20 p-4 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Confirmed</span>
                    <span>Preparing</span>
                    <span>Out for Delivery</span>
                    <span>Delivered</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{
                          width:
                            order.status === 'confirmed'
                              ? '25%'
                              : order.status === 'preparing'
                              ? '50%'
                              : order.status === 'out_for_delivery'
                              ? '75%'
                              : '100%',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}