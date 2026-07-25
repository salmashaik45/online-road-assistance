import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, DollarSign, History,
  UserCircle, Settings, Shield, Trash2, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function ProviderProfilePage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    experience: '',
    bio: '',
    serviceType: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
    charges: {
      baseFee: '',
      perKm: '',
    },
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/providers/dashboard');
        const p = res.data.data.provider;
        setFormData({
          name: p.name || '',
          phone: p.phone || '',
          gender: p.gender || '',
          experience: p.experience || '',
          bio: p.bio || '',
          serviceType: p.serviceType || '',
          address: {
            street: p.address?.street || '',
            city: p.address?.city || '',
            state: p.address?.state || '',
            pincode: p.address?.pincode || '',
          },
          charges: {
            baseFee: p.charges?.baseFee || '',
            perKm: p.charges?.perKm || '',
          },
          password: '',
          confirmPassword: '',
        });
      } catch {
        toast.error('Failed to load provider profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNestedChange = (parent, e) => {
    setFormData({
      ...formData,
      [parent]: { ...formData[parent], [e.target.name]: e.target.value },
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        experience: Number(formData.experience),
        bio: formData.bio,
        address: formData.address,
        charges: {
          baseFee: Number(formData.charges.baseFee),
          perKm: Number(formData.charges.perKm),
        }
      };
      if (formData.password) payload.password = formData.password;

      const res = await api.put('/providers/profile', payload);
      login({ ...user, name: res.data.data.name });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface-variant">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen relative overflow-hidden">
      {/* Background accents */}
      <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      {/* TopNavBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-8 h-20 bg-surface/80 backdrop-blur-2xl border-b border-outline-variant shadow-sm">
        <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tighter">RoadAssist Pro</span>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-extrabold shadow-sm">
          {user?.name?.[0]?.toUpperCase() || 'P'}
        </div>
      </header>

      {/* SideNavBar Desktop */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full border-r border-outline-variant bg-surface w-72 pt-24 z-40 shadow-sm">
        <div className="px-8 mb-8">
          <p className="text-sm font-bold text-success flex items-center gap-1">
            <CheckCircle2 size={16} /> Provider Portal
          </p>
        </div>
        <nav className="flex-grow px-4 space-y-2">
          <Link to="/provider-dashboard" className="text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-xl mx-2 flex items-center px-4 py-3 font-bold transition-all">
            <LayoutDashboard size={20} className="mr-3" /> Dashboard
          </Link>
          <Link to="/provider-earnings" className="text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-xl mx-2 flex items-center px-4 py-3 font-bold transition-all">
            <DollarSign size={20} className="mr-3" /> Earnings
          </Link>
          <Link to="/provider-history" className="text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-xl mx-2 flex items-center px-4 py-3 font-bold transition-all">
            <History size={20} className="mr-3" /> History
          </Link>
          <span className="bg-primary/10 text-primary border border-primary/20 shadow-sm rounded-xl mx-2 flex items-center px-4 py-3 font-bold">
            <UserCircle size={20} className="mr-3" /> Profile
          </span>
        </nav>
        <div className="p-6 mt-auto">
          <button
            onClick={logout}
            className="w-full py-4 border border-error/50 text-error rounded-xl font-bold hover:bg-error/10 transition-all"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-28 pb-24 md:pb-12 lg:ml-72 px-6 flex justify-center relative z-10">
        <div className="max-w-[800px] w-full space-y-10">
          <header className="text-center md:text-left mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface">
              Provider Profile
            </h1>
            <p className="text-lg text-on-surface-variant mt-3">
              Manage your professional details, charges, and security.
            </p>
          </header>

          <form onSubmit={handleSave} className="space-y-8">
            {/* Personal Information */}
            <section className="bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4">
                Professional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface-variant">Full Name</label>
                  <input
                    className="w-full h-14 px-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface-variant">Phone Number</label>
                  <input
                    className="w-full h-14 px-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface-variant">Email Address</label>
                  <input
                    className="w-full h-14 px-4 bg-surface-variant border border-outline-variant rounded-xl text-on-surface-variant cursor-not-allowed"
                    type="email"
                    value={user?.email || ''}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface-variant">Service Type</label>
                  <input
                    className="w-full h-14 px-4 bg-surface-variant border border-outline-variant rounded-xl text-on-surface-variant cursor-not-allowed capitalize"
                    type="text"
                    value={formData.serviceType || ''}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface-variant">Experience (Years)</label>
                  <input
                    className="w-full h-14 px-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant"
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface-variant">Gender</label>
                  <select
                    className="w-full h-14 px-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="" className="bg-surface">Select gender</option>
                    <option value="male" className="bg-surface">Male</option>
                    <option value="female" className="bg-surface">Female</option>
                    <option value="other" className="bg-surface">Other</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Service Charges */}
            <section className="bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4 flex items-center gap-3">
                <DollarSign size={24} className="text-primary" /> Service Charges
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface-variant">Base Fee (₹)</label>
                  <input
                    className="w-full h-14 px-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant"
                    name="baseFee"
                    type="number"
                    placeholder="e.g. 500"
                    value={formData.charges.baseFee}
                    onChange={(e) => handleNestedChange('charges', e)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface-variant">Charge Per Km (₹)</label>
                  <input
                    className="w-full h-14 px-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant"
                    name="perKm"
                    type="number"
                    placeholder="e.g. 20"
                    value={formData.charges.perKm}
                    onChange={(e) => handleNestedChange('charges', e)}
                  />
                </div>
              </div>
            </section>

            {/* Address */}
            <section className="bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4">
                Service Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Street', name: 'street', placeholder: '123 Main St' },
                  { label: 'City', name: 'city', placeholder: 'Hyderabad' },
                  { label: 'State', name: 'state', placeholder: 'Telangana' },
                  { label: 'Pincode', name: 'pincode', placeholder: '500001' },
                ].map(({ label, name, placeholder }) => (
                  <div key={name} className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant">{label}</label>
                    <input
                      className="w-full h-14 px-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant"
                      name={name}
                      placeholder={placeholder}
                      value={formData.address[name]}
                      onChange={(e) => handleNestedChange('address', e)}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Security */}
            <section className="bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4 flex items-center gap-3">
                <Shield size={24} className="text-primary" /> Security
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface-variant">New Password</label>
                  <input
                    className="w-full h-14 px-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant"
                    name="password"
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface-variant">Confirm Password</label>
                  <input
                    className="w-full h-14 px-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant"
                    name="confirmPassword"
                    type="password"
                    placeholder="Repeat new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-5 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 h-14 bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-surface/90 backdrop-blur-2xl border-t border-outline-variant">
        <Link to="/provider-dashboard" className="flex flex-col items-center text-on-surface-variant hover:text-on-surface transition-colors">
          <LayoutDashboard size={22} className="mb-1" />
          <span className="text-xs font-bold">Home</span>
        </Link>
        <Link to="/provider-history" className="flex flex-col items-center text-on-surface-variant hover:text-on-surface transition-colors">
          <History size={22} className="mb-1" />
          <span className="text-xs font-bold">History</span>
        </Link>
        <Link to="/provider-earnings" className="flex flex-col items-center text-on-surface-variant hover:text-on-surface transition-colors">
          <DollarSign size={22} className="mb-1" />
          <span className="text-xs font-bold">Earnings</span>
        </Link>
        <Link to="/provider-profile" className="flex flex-col items-center bg-primary/10 text-primary rounded-xl px-5 py-2">
          <UserCircle size={22} className="mb-1" />
          <span className="text-xs font-bold">Profile</span>
        </Link>
      </nav>
    </div>
  );
}

export default ProviderProfilePage;
