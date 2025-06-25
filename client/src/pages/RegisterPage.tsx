import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { LoadingSpinner } from '../components/ui/loading';

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
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
    const ok = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode
    });
    if (ok) {
      setSuccess(true);
      toast({ title: 'Registration successful!', description: 'You can now log in.' });
      setTimeout(() => setLocation('/login'), 1200);
    } else {
      toast({ title: 'Registration failed', description: 'Please check your details or try again.', variant: 'destructive' });
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Join Sattvic Foods</h1>
          <p className="text-muted-foreground">Create your account for fresh, healthy meals</p>
        </div>
        {/* Register Form */}
        <div className="bg-card rounded-xl shadow-lg border p-6 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className={`input-field pl-10 ${errors.name ? 'border-destructive' : ''}`} placeholder="Your Name" disabled={isLoading} />
              </div>
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={`input-field pl-10 ${errors.email ? 'border-destructive' : ''}`} placeholder="you@email.com" disabled={isLoading} />
              </div>
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
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
              <div className="flex-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">Confirm *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`} placeholder="Repeat Password" disabled={isLoading} />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" onClick={() => setShowConfirmPassword(v => !v)} tabIndex={-1}>
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className={`input-field pl-10 ${errors.phone ? 'border-destructive' : ''}`} placeholder="+91 9876543210" disabled={isLoading} />
              </div>
              {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <textarea id="address" name="address" value={formData.address} onChange={handleInputChange} rows={2} className={`input-field pl-10 resize-none ${errors.address ? 'border-destructive' : ''}`} placeholder="Enter your delivery address" disabled={isLoading} />
              </div>
              {errors.address && <p className="text-destructive text-sm mt-1">{errors.address}</p>}
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">City *</label>
                <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} className={`input-field ${errors.city ? 'border-destructive' : ''}`} placeholder="City" disabled={isLoading} />
                {errors.city && <p className="text-destructive text-sm mt-1">{errors.city}</p>}
              </div>
              <div className="flex-1">
                <label htmlFor="pincode" className="block text-sm font-medium text-foreground mb-2">Pincode *</label>
                <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} className={`input-field ${errors.pincode ? 'border-destructive' : ''}`} placeholder="Pincode" disabled={isLoading} />
                {errors.pincode && <p className="text-destructive text-sm mt-1">{errors.pincode}</p>}
              </div>
            </div>
            <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size="sm" /> : 'Register'}
            </button>
            {success && <p className="text-success text-center mt-2 animate-fade-in">Registration successful! Redirecting...</p>}
          </form>
          <div className="text-center mt-4 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
