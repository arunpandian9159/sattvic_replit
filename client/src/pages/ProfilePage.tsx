import { useState } from 'react';
import { User, MapPin, Phone, Mail, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { LoadingSpinner } from '../components/ui/loading';

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user || {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await updateProfile(editData);
    setSaving(false);
    if (ok) {
      toast({ title: 'Profile updated', description: 'Your profile was updated successfully.' });
      setIsEditing(false);
    } else {
      toast({ title: 'Update failed', description: 'Could not update profile.', variant: 'destructive' });
    }
  };

  const handleCancel = () => {
    setEditData(user || {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      pincode: '',
    });
    setIsEditing(false);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background animate-fade-in">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-card rounded-xl shadow-lg border p-8 animate-slide-up">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Manage your account details</p>
          </div>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" name="name" value={editData.name} onChange={handleChange} className="input-field pl-10" disabled={!isEditing || saving} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="email" name="email" value={editData.email} disabled className="input-field pl-10 bg-muted/30 cursor-not-allowed" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="tel" name="phone" value={editData.phone || ''} onChange={handleChange} className="input-field pl-10" disabled={!isEditing || saving} />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">City</label>
              <input type="text" name="city" value={editData.city || ''} onChange={handleChange} className="input-field" disabled={!isEditing || saving} />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">Pincode</label>
              <input type="text" name="pincode" value={editData.pincode || ''} onChange={handleChange} className="input-field" disabled={!isEditing || saving} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">Address</label>
              <input type="text" name="address" value={editData.address || ''} onChange={handleChange} className="input-field" disabled={!isEditing || saving} />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            {isEditing ? (
              <>
                <button type="button" className="btn-primary flex-1 flex items-center justify-center gap-2" onClick={handleSave} disabled={saving}>
                  {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />} Save
                </button>
                <button type="button" className="btn-secondary flex-1 flex items-center justify-center gap-2" onClick={handleCancel} disabled={saving}>
                  <X className="w-4 h-4" /> Cancel
                </button>
              </>
            ) : (
              <button type="button" className="btn-primary flex items-center gap-2" onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}