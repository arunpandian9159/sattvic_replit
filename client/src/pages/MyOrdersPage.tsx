import { useQuery } from '@tanstack/react-query';
import { Clock, MapPin, Phone, CheckCircle, Truck, ChefHat, Package } from 'lucide-react';
import { Order, MealPlan, Customer } from '../../../shared/schema';

interface OrderWithDetails extends Order {
  mealPlan?: MealPlan;
  customer?: Customer;
}

export default function MyOrdersPage() {
  const { data: orders, isLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ['/api/orders'],
  });

  const getStatusIcon = (status: Order['status']) => {
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

  const getStatusColor = (status: Order['status']) => {
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

  const formatStatus = (status: Order['status']) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background safe-area-top">
        <header className="bg-card border-b px-4 py-4">
          <div className="skeleton h-8 w-32"></div>
        </header>
        <div className="px-4 py-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-lg border p-4 animate-pulse">
              <div className="skeleton h-6 w-3/4 mb-3"></div>
              <div className="skeleton h-4 w-1/2 mb-2"></div>
              <div className="skeleton h-4 w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-top">
      {/* Header */}
      <header className="bg-card border-b px-4 py-4">
        <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your meal deliveries
        </p>
      </header>

      <main className="px-4 py-6 pb-24">
        {!orders || orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Start by browsing our delicious meal plans
            </p>
            <a href="/meals" className="btn-primary">
              Browse Meals
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-card rounded-lg border overflow-hidden">
                <div className="p-4">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">
                        Order #{order.id.substring(0, 8)}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Placed on {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Meal Plan Info */}
                  <div className="bg-muted/30 rounded-lg p-3 mb-4">
                    <h4 className="font-medium text-foreground mb-1">
                      Traditional South Indian Thali
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Complete vegetarian meal with sambar, rasam, dal, vegetables, rice, chapati, and pickle
                    </p>
                  </div>

                  {/* Delivery Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Delivery Date:</span>
                      <span className="text-foreground font-medium">
                        {formatDate(order.deliveryDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">To:</span>
                      <span className="text-foreground">Pondicherry</span>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  {order.specialInstructions && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-1">Special Instructions:</p>
                      <p className="text-sm text-foreground bg-muted/30 p-2 rounded">
                        {order.specialInstructions}
                      </p>
                    </div>
                  )}

                  {/* Total Amount */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="text-xl font-bold text-primary">₹{order.totalAmount}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    {order.status === 'confirmed' && (
                      <button className="flex-1 bg-muted text-muted-foreground py-2 px-4 rounded-lg text-sm font-medium">
                        Cancel Order
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button className="flex-1 btn-secondary">
                        Reorder
                      </button>
                    )}
                    <button className="flex-1 bg-primary/10 text-primary py-2 px-4 rounded-lg text-sm font-medium">
                      Track Order
                    </button>
                  </div>
                </div>

                {/* Order Progress */}
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
                            width: order.status === 'confirmed' ? '25%' :
                                   order.status === 'preparing' ? '50%' :
                                   order.status === 'out_for_delivery' ? '75%' : '100%'
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

        {/* Help Section */}
        <div className="mt-8 bg-primary/5 rounded-lg p-4 text-center">
          <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
          <p className="text-muted-foreground text-sm mb-3">
            Contact us for any questions about your orders
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <a href="tel:9500261133" className="flex items-center gap-1 text-primary">
              <Phone className="w-4 h-4" />
              9500261133
            </a>
            <span className="text-muted-foreground">|</span>
            <a href="tel:9500261131" className="flex items-center gap-1 text-primary">
              <Phone className="w-4 h-4" />
              9500261131
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}