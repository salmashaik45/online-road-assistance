import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginAs, setLoginAs] = useState('user'); // 'user' or 'provider'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = loginAs === 'provider' ? '/auth/login-provider' : '/auth/login';
      const res = await api.post(endpoint, formData);

      login({ ...res.data.data, role: loginAs });
      toast.success('Login successful!');

      navigate(loginAs === 'provider' ? '/provider-dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center p-4 md:p-8 bg-background relative overflow-hidden text-on-background">
      {/* Background accents */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1200px] min-h-[600px] grid grid-cols-1 md:grid-cols-2 bg-surface/80 backdrop-blur-xl overflow-hidden rounded-[2rem] shadow-xl border border-outline-variant relative z-10">
        {/* Left Side */}
        <section className="hidden md:flex relative h-full flex-col justify-end p-12 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-secondary z-0 opacity-90" />
          <div className="absolute inset-0 bg-black/10 z-0" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">Help is one tap away.</h2>
            <p className="text-lg text-white/90 font-medium">
              Our verified service providers are ready to get you back on the road 24/7.
              Reliable, fast, and professional roadside assistance whenever you need it.
            </p>
          </div>
        </section>

        {/* Right Side */}
        <section className="flex flex-col justify-center items-center px-8 py-12 md:px-16 bg-surface">
          <div className="w-full max-w-[400px]">
            <div className="mb-10 flex flex-col items-center md:items-start">
              <Link to="/" className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tighter mb-4">
                RoadAssist
              </Link>
              <h1 className="text-3xl font-bold text-on-surface mb-2">Welcome back</h1>
              <p className="text-on-surface-variant">
                Log in to your account to continue
              </p>
            </div>

            {/* Role Toggle */}
            <div className="flex gap-4 mb-8">
              <button
                type="button"
                onClick={() => setLoginAs('user')}
                className={`flex-1 py-3 rounded-xl border font-bold transition-all duration-300 ${
                  loginAs === 'user'
                    ? 'bg-primary/10 text-primary border-primary shadow-sm'
                    : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setLoginAs('provider')}
                className={`flex-1 py-3 rounded-xl border font-bold transition-all duration-300 ${
                  loginAs === 'provider'
                    ? 'bg-secondary/10 text-secondary border-secondary shadow-sm'
                    : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                Provider
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface" htmlFor="email">
                  Email Address
                </label>
                <input
                  className="w-full h-14 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50 shadow-sm"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-on-surface" htmlFor="password">
                    Password
                  </label>
                  <Link className="text-sm font-bold text-primary hover:text-primary-fixed transition-colors" to="/forgot-password">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    className="w-full h-14 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50 shadow-sm"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                className="w-full h-14 bg-gradient-to-r from-primary to-secondary text-on-primary font-bold text-lg rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 mt-8 disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-on-surface-variant">
                Don't have an account?
                <Link className="font-bold text-primary hover:text-primary-fixed ml-2 transition-colors" to="/register">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;