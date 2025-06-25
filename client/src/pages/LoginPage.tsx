import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { LoadingSpinner } from '../components/ui/loading';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const ok = await login(formData.email, formData.password);
    if (ok) {
      setSuccess(true);
      toast({ title: 'Login successful!', description: 'Welcome back!' });
      setTimeout(() => setLocation('/'), 1200);
    } else {
      toast({ title: 'Login failed', description: 'Invalid credentials or user not found.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <button className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your Sattvic Foods account</p>
        </div>
        {/* Login Form */}
        <div className="bg-card rounded-xl shadow-lg border p-6 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={`input-field pl-10 ${errors.email ? 'border-destructive' : ''}`} placeholder="you@email.com" disabled={isLoading} />
              </div>
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleInputChange} className={`input-field pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`} placeholder="Password" disabled={isLoading} />
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
            </div>
            <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size="sm" /> : 'Sign In'}
            </button>
            {success && <p className="text-success text-center mt-2 animate-fade-in">Login successful! Redirecting...</p>}
          </form>
          <div className="text-center mt-4 text-sm">
            New to Sattvic?{' '}
            <Link href="/register" className="text-primary hover:underline">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
