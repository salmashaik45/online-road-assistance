import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Truck, ShieldCheck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState('user'); // 'user' or 'provider'
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    serviceType: 'mechanic', // only used if provider
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the Terms of Service');
      return;
    }

    setLoading(true);

    try {
      const endpoint = role === 'provider' ? '/auth/register-provider' : '/auth/register';

      const payload =
        role === 'provider'
          ? {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              password: formData.password,
              serviceType: formData.serviceType,
            }
          : {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              password: formData.password,
              role: 'user',
            };

      const res = await api.post(endpoint, payload);

      login({ ...res.data.data, role });
      toast.success('Account created successfully!');

      navigate(role === 'provider' ? '/provider-dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-surface/80 backdrop-blur-2xl border-b border-outline-variant shadow-sm">
        <Link to="/" className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tighter hover:opacity-90 transition-opacity">
          RoadAssist
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-16 px-6 relative z-10">
        <div className="w-full max-w-[550px] flex flex-col gap-8">
          {/* Heading */}
          <div className="text-center mb-2">
            <h1 className="text-4xl font-extrabold text-on-surface mb-3">
              Create Account
            </h1>
            <p className="text-on-surface-variant">
              Join thousands of drivers and service providers today.
            </p>
          </div>

          {/* Form */}
          <form
            className="bg-surface backdrop-blur-xl border border-outline-variant p-8 rounded-[2rem] flex flex-col gap-6 shadow-xl"
            onSubmit={handleSubmit}
          >
            {/* Role Selector */}
            <div className="flex gap-4 mb-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`flex-1 flex flex-col items-center justify-center py-4 border rounded-2xl transition-all duration-300 font-bold ${
                  role === 'user'
                    ? 'bg-primary/10 text-primary border-primary shadow-sm'
                    : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                <User className="mb-2" size={24} />
                I am a User
              </button>
              <button
                type="button"
                onClick={() => setRole('provider')}
                className={`flex-1 flex flex-col items-center justify-center py-4 border rounded-2xl transition-all duration-300 font-bold ${
                  role === 'provider'
                    ? 'bg-secondary/10 text-secondary border-secondary shadow-sm'
                    : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                <Truck className="mb-2" size={24} />
                I am a Provider
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-bold text-on-surface">Full Name</label>
              <input
                className="w-full h-14 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50 shadow-sm"
                name="name"
                placeholder="Enter your full name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-bold text-on-surface">Email Address</label>
              <input
                className="w-full h-14 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50 shadow-sm"
                name="email"
                placeholder="name@example.com"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-bold text-on-surface">Phone Number</label>
              <input
                className="w-full h-14 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50 shadow-sm"
                name="phone"
                placeholder="9999999999"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Service Type — only if Provider */}
            {role === 'provider' && (
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-bold text-on-surface">Service Type</label>
                <select
                  className="w-full h-14 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none shadow-sm"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                >
                  <option value="mechanic">Mechanic</option>
                  <option value="towing">Towing</option>
                  <option value="fuel">Fuel Delivery</option>
                  <option value="tire">Tire Change</option>
                  <option value="battery">Battery Jump</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-on-surface">Password</label>
                <input
                  className="w-full h-14 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50 shadow-sm"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-on-surface">Confirm Password</label>
                <input
                  className="w-full h-14 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50 shadow-sm"
                  name="confirmPassword"
                  placeholder="••••••••"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 mt-2">
              <input
                className="w-5 h-5 mt-0.5 rounded border border-outline-variant bg-surface text-primary focus:ring-primary"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                id="terms"
              />
              <label className="text-sm text-on-surface-variant leading-relaxed" htmlFor="terms">
                I agree to the <span className="text-primary font-bold hover:underline cursor-pointer">Terms of Service</span> and{' '}
                <span className="text-primary font-bold hover:underline cursor-pointer">Privacy Policy</span>. I understand RoadAssist
                uses my location for emergency dispatch.
              </label>
            </div>

            <button
              className="w-full h-14 bg-gradient-to-r from-primary to-secondary text-on-primary font-bold text-lg rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 mt-4 disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>

            <p className="text-center text-on-surface-variant mt-2">
              Already have an account?{' '}
              <Link className="text-primary font-bold hover:text-primary-fixed transition-colors" to="/login">
                Log in
              </Link>
            </p>
          </form>

          {/* Bento badges */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-surface border border-outline-variant p-4 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="bg-primary/10 text-primary p-3 rounded-full flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <span className="font-bold text-on-surface text-sm">256-bit Secure</span>
            </div>
            <div className="bg-surface border border-outline-variant p-4 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="bg-secondary/10 text-secondary p-3 rounded-full flex items-center justify-center">
                <Zap size={24} />
              </div>
              <span className="font-bold text-on-surface text-sm">Rapid Support</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;