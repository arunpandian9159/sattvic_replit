import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { UtensilsCrossed, Clock, Shield, Truck, Star, Heart, Users } from 'lucide-react';
import { MealPlan } from '../../../shared/schema';
import { LoadingCard } from '../components/ui/loading';
import { SouthIndianFoodPlaceholder } from '../components/FoodImage';
import ErrorBoundary from '../components/ErrorBoundary';

export default function HomePage() {
  const { data: mealPlans, isLoading, error } = useQuery<MealPlan[]>({
    queryKey: ['/api/meal-plans'],
  });

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Hero Section with enhanced design */}
        <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 px-4 py-12 safe-area-top overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
          </div>

          <div className="relative text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-6 shadow-lg animate-fade-in">
              <UtensilsCrossed className="w-12 h-12 text-white" />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Home-Style Meals,<br />
                <span className="text-primary">Delivered Fresh!</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Tired of junk food? Enjoy healthy, tasty meals made with love – just like home.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 inline-block">
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 text-secondary">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>South Indian Veg Meals</span>
                </div>
                <div className="flex items-center gap-2 text-accent">
                  <Clock className="w-4 h-4" />
                  <span>Daily | Weekly | Monthly</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/20">
                <p className="text-primary font-semibold">📞 9500261133 | 9500261131</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-accent fill-current" />
                <span>4.8/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-secondary" />
                <span>1000+ Happy Customers</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full inline-block">
              *Pre-order a day in advance for fresh preparation
            </p>
          </div>
        </section>

      {/* Enhanced Features */}
      <section className="px-4 py-12 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            Why Choose Sattvic Foods?
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="group bg-card p-6 rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">100% Vegetarian</h3>
              <p className="text-sm text-muted-foreground">Pure & healthy ingredients</p>
            </div>

            <div className="group bg-card p-6 rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Fresh Daily</h3>
              <p className="text-sm text-muted-foreground">Made to order daily</p>
            </div>

            <div className="group bg-card p-6 rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Home Delivery</h3>
              <p className="text-sm text-muted-foreground">Next day delivery</p>
            </div>

            <div className="group bg-card p-6 rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Made with Love</h3>
              <p className="text-sm text-muted-foreground">Traditional recipes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Meal Plans */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Featured Meals</h2>
              <p className="text-muted-foreground">Handpicked favorites from our kitchen</p>
            </div>
            <Link href="/meals">
              <span className="text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-2">
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>

          {error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Unable to load meals</h3>
              <p className="text-muted-foreground mb-4">Please check your connection and try again</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          ) : isLoading ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : (
          <div className="space-y-6">
            {mealPlans?.slice(0, 2).map((plan) => (
              <div key={plan.id} className="food-card bg-card rounded-xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                {/* Food Image */}
                <div className="relative">
                  <SouthIndianFoodPlaceholder
                    className="h-48 sm:h-56"
                    mealType={plan.planType as 'daily' | 'weekly' | 'monthly'}
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                      plan.planType === 'daily' ? 'bg-accent text-accent-foreground' :
                      plan.planType === 'weekly' ? 'bg-secondary text-secondary-foreground' :
                      'bg-primary text-primary-foreground'
                    }`}>
                      {plan.planType.charAt(0).toUpperCase() + plan.planType.slice(1)}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2 text-sm bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Users className="w-4 h-4" />
                      <span>{plan.servings} serving{plan.servings > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-foreground text-xl mb-2 group-hover:text-primary transition-colors">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed line-clamp-2">
                      {plan.description}
                    </p>
                  </div>

                  {/* Meal Items */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <UtensilsCrossed className="w-4 h-4" />
                      What's included:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {plan.items.slice(0, 4).map((item, index) => (
                        <span
                          key={index}
                          className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {item}
                        </span>
                      ))}
                      {plan.items.length > 4 && (
                        <span className="text-muted-foreground text-sm px-3 py-1 bg-muted/30 rounded-full">
                          +{plan.items.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Vegetarian Badge */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span className="text-sm text-success font-medium">100% Vegetarian</span>
                    <div className="flex items-center gap-1 ml-auto">
                      <Star className="w-4 h-4 text-accent fill-current" />
                      <span className="text-sm text-muted-foreground">4.8</span>
                    </div>
                  </div>

                  {/* Pricing and Order */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">₹{plan.price}</span>
                        <span className="text-muted-foreground text-sm">
                          {plan.planType === 'daily' ? '/day' :
                           plan.planType === 'weekly' ? '/week' :
                           '/month'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Free delivery included</p>
                    </div>
                    <Link href={`/order/${plan.id}`}>
                      <button className="btn-primary group-hover:scale-105 transition-transform duration-200">
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