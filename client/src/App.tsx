import { Router, Route, Switch } from 'wouter';
import { Toaster } from './components/ui/toaster';
import HomePage from './pages/HomePage';
import MealPlansPage from './pages/MealPlansPage';
import OrderPage from './pages/OrderPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ProfilePage from './pages/ProfilePage';
import MobileNavigation from './components/MobileNavigation';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Router>
        <main className="pb-20">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/meals" component={MealPlansPage} />
            <Route path="/order/:id" component={OrderPage} />
            <Route path="/my-orders" component={MyOrdersPage} />
            <Route path="/profile" component={ProfilePage} />
          </Switch>
        </main>
        <MobileNavigation />
      </Router>
      <Toaster />
    </div>
  );
}

export default App;