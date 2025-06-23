import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { UtensilsCrossed, Clock, Shield, Truck } from 'lucide-react';
import { MealPlan } from '../../../shared/schema';

export default function HomePage() {
  const { data: mealPlans, isLoading } = useQuery<MealPlan[]>({
    queryKey: ['/api/meal-plans'],
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with attached images */}
      <section className="relative bg-gradient-to-br from-primary/10 to-secondary/5 px-4 py-8 safe-area-top">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Home-Style Meals,<br />
            Delivered Fresh!
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Tired of junk food? Enjoy healthy, tasty meals made with love – just like home.
          </p>
          <div className="bg-secondary/20 p-4 rounded-lg inline-block">
            <p className="text-sm font-medium text-secondary">
              🌿 South Indian Veg Meals<br />
              📅 Daily | Weekly | Monthly Plans<br />
              📞 9500261133 | 9500261131
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            *Pre-order a day in advance
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border text-center">
            <Shield className="w-8 h-8 text-success mx-auto mb-2" />
            <h3 className="font-semibold text-foreground">100% Vegetarian</h3>
            <p className="text-sm text-muted-foreground">Pure & healthy</p>
          </div>
          <div className="bg-card p-4 rounded-lg border text-center">
            <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
            <h3 className="font-semibold text-foreground">Fresh Daily</h3>
            <p className="text-sm text-muted-foreground">Made to order</p>
          </div>
          <div className="bg-card p-4 rounded-lg border text-center">
            <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-foreground">Home Delivery</h3>
            <p className="text-sm text-muted-foreground">Next day delivery</p>
          </div>
          <div className="bg-card p-4 rounded-lg border text-center">
            <UtensilsCrossed className="w-8 h-8 text-secondary mx-auto mb-2" />
            <h3 className="font-semibold text-foreground">Traditional</h3>
            <p className="text-sm text-muted-foreground">Authentic taste</p>
          </div>
        </div>
      </section>

      {/* Featured Meal Plans */}
      <section className="px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Featured Meals</h2>
          <Link href="/meals">
            <span className="text-primary font-medium">View All</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card rounded-lg border p-4 animate-pulse">
                <div className="skeleton h-4 w-3/4 mb-2"></div>
                <div className="skeleton h-3 w-1/2 mb-4"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {mealPlans?.slice(0, 2).map((plan) => (
              <div key={plan.id} className="food-card bg-card rounded-lg border overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground text-lg">{plan.name}</h3>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                      {plan.planType}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {plan.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {plan.items.slice(0, 3).map((item, index) => (
                      <span key={index} className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs">
                        {item}
                      </span>
                    ))}
                    {plan.items.length > 3 && (
                      <span className="text-muted-foreground text-xs px-2 py-1">
                        +{plan.items.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">₹{plan.price}</span>
                      <span className="text-muted-foreground text-sm ml-1">
                        / {plan.servings} serving{plan.servings > 1 ? 's' : ''}
                      </span>
                    </div>
                    <Link href={`/order/${plan.id}`}>
                      <button className="btn-primary">
                        Order Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="px-4 py-8 bg-primary/5 mb-20">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Ready to Order?</h2>
          <p className="text-muted-foreground">
            Experience authentic South Indian flavors delivered to your doorstep
          </p>
          <Link href="/meals">
            <button className="btn-primary w-full max-w-sm">
              Browse All Meal Plans
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}