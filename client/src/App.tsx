import { Router, Route, Switch } from 'wouter';
import { Toaster } from './components/ui/toaster';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MealPlansPage from './pages/MealPlansPage';
import OrderPage from './pages/OrderPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MobileNavigation from './components/MobileNavigation';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Router>
            <Header />
            <main className="pb-20">
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/meals" component={MealPlansPage} />
                <Route path="/order/:id" component={OrderPage} />
                <Route path="/my-orders" component={MyOrdersPage} />
                <Route path="/profile" component={ProfilePage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
              </Switch>
            </main>
            <MobileNavigation />
          </Router>
          <Toaster />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;