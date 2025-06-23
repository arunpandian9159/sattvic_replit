import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Filter, Search, Clock, Users } from 'lucide-react';
import { useState } from 'react';
import { MealPlan } from '../../../shared/schema';

export default function MealPlansPage() {
  const [selectedPlanType, setSelectedPlanType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: mealPlans, isLoading } = useQuery<MealPlan[]>({
    queryKey: ['/api/meal-plans'],
  });

  const filteredPlans = mealPlans?.filter(plan => {
    const matchesType = selectedPlanType === 'all' || plan.planType === selectedPlanType;
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const planTypes = [
    { value: 'all', label: 'All Plans' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <div className="min-h-screen bg-background safe-area-top">
      {/* Header */}
      <header className="bg-card border-b px-4 py-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Meal Plans</h1>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search meals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2">
          {planTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedPlanType(type.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedPlanType === type.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </header>

      {/* Meal Plans Grid */}
      <main className="px-4 py-6 pb-24">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-lg border p-4 animate-pulse">
                <div className="skeleton h-6 w-3/4 mb-3"></div>
                <div className="skeleton h-4 w-full mb-2"></div>
                <div className="skeleton h-4 w-2/3 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="skeleton h-6 w-16"></div>
                  <div className="skeleton h-6 w-20"></div>
                  <div className="skeleton h-6 w-14"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="skeleton h-8 w-24"></div>
                  <div className="skeleton h-10 w-28"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPlans?.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No meals found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPlans?.map((plan) => (
              <div key={plan.id} className="food-card bg-card rounded-lg border overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-semibold text-foreground pr-4">
                      {plan.name}
                    </h2>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        plan.planType === 'daily' ? 'bg-accent/10 text-accent' :
                        plan.planType === 'weekly' ? 'bg-secondary/10 text-secondary' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {plan.planType.charAt(0).toUpperCase() + plan.planType.slice(1)}
                      </span>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Users className="w-3 h-3" />
                        <span>{plan.servings} serving{plan.servings > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Meal Items */}
                  <div className="mb-5">
                    <h4 className="text-sm font-medium text-foreground mb-2">What's included:</h4>
                    <div className="flex flex-wrap gap-2">
                      {plan.items.map((item, index) => (
                        <span
                          key={index}
                          className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Vegetarian Badge */}
                  {plan.isVegetarian && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <span className="text-sm text-success font-medium">100% Vegetarian</span>
                    </div>
                  )}

                  {/* Pricing and Order */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-3xl font-bold text-primary">₹{plan.price}</span>
                      <div className="text-sm text-muted-foreground">
                        {plan.planType === 'daily' ? 'per day' :
                         plan.planType === 'weekly' ? 'per week' :
                         'per month'}
                      </div>
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
      </main>
    </div>
  );
}