import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, DollarSign, History,
  UserCircle, Settings, Bell, Star,
  CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  pending:   'bg-warning/20 text-warning border-warning/30',
  accepted:  'bg-primary/20 text-primary border-primary/30',
  ongoing:   'bg-secondary/20 text-secondary border-secondary/30',
  completed: 'bg-success/20 text-success border-success/30',
  cancelled: 'bg-error/20 text-error border-error/30',
};

function ProviderDashboard() {
  const { logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [toggling, setToggling] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [accepting, setAccepting] = useState(null);

  const fetchDashboard = async () => {
    try {
      const [dashRes, pendingRes] = await Promise.all([
        api.get('/providers/dashboard'),
        api.get('/services/pending'),
      ]);
      setData(dashRes.data.data);
      setIsAvailable(dashRes.data.data.provider.isAvailable);
      setPendingRequests(pendingRes.data.data);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const [dashRes, pendingRes] = await Promise.all([
          api.get('/providers/dashboard'),
          api.get('/services/pending'),
        ]);
        if (active) {
          setData(dashRes.data.data);
          setIsAvailable(dashRes.data.data.provider.isAvailable);
          setPendingRequests(pendingRes.data.data);
        }
      } catch {
        if (active) toast.error('Failed to load dashboard');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const handleToggleAvailability = async () => {
    setToggling(true);
    try {
      const res = await api.put('/providers/availability');
      setIsAvailable(res.data.isAvailable);
      toast.success(res.data.message);
    } catch {
      toast.error('Failed to toggle availability');
    } finally {
      setToggling(false);
    }
  };

  const handleAccept = async (requestId) => {
    setAccepting(requestId);
    try {
      await api.put(`/services/${requestId}/accept`, {
        estimatedTime: 20,
      });
      toast.success('Request accepted!');
      fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept');
    } finally {
      setAccepting(null);
    }
  };

  const handleComplete = async (requestId) => {
    const finalPrice = window.prompt('Enter final price (₹):');
    if (!finalPrice) return;
    try {
      await api.put(`/services/${requestId}/complete`, {
        finalPrice: Number(finalPrice),
        paymentMethod: 'cash',
      });
      toast.success('Service marked as completed!');
      fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete');
    }
  };

  const handleStartService = async (requestId) => {
    const otp = window.prompt('Enter OTP from customer:');
    if (!otp) return;
    try {
      await api.put(`/services/${requestId}/start`, { otp });
      toast.success('Service started!');
      fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant font-medium">
        Loading dashboard...
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentRequests = data?.recentRequests || [];
  const recentReviews = data?.recentReviews || [];
  const provider = data?.provider || {};

  return (
    <div className="text-on-background bg-background min-h-screen relative overflow-hidden">
      {/* Background accents */}
      <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full border-r border-outline-variant bg-surface w-72 z-50 shadow-sm">
        <div className="p-8 pb-4">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tighter mb-1">
            RoadAssist Pro
          </h1>
          <p className="text-sm font-bold text-success">
            {provider.isVerified ? '✓ Verified Provider' : 'Provider'}
          </p>
        </div>
        <nav className="flex-1 mt-4 px-4 space-y-2">
          <span className="bg-secondary/10 text-secondary border border-secondary/20 shadow-sm rounded-xl mx-2 flex items-center px-4 py-3 font-bold transition-all">
            <LayoutDashboard size={20} className="mr-3" />
            Dashboard
          </span>
          <Link to="/provider-earnings" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-xl mx-2 flex items-center px-4 py-3 font-bold transition-all">
            <DollarSign size={20} className="mr-3" />
            Earnings
          </Link>
          <Link to="/provider-profile" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-xl mx-2 flex items-center px-4 py-3 font-bold transition-all">
            <UserCircle size={20} className="mr-3" />
            Profile
          </Link>
          <Link to="/provider-history" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-xl mx-2 flex items-center px-4 py-3 font-bold transition-all">
            <History size={20} className="mr-3" />
            History
          </Link>
        </nav>
        <div className="p-6 mt-auto border-t border-outline-variant">
          <Link to="/provider-profile" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-xl flex items-center px-4 py-3 font-bold transition-all mb-4">
            <Settings size={20} className="mr-3" />
            Settings
          </Link>
          <button
            onClick={logout}
            className="w-full py-3 border border-outline-variant text-on-surface-variant rounded-xl font-bold hover:bg-error/10 hover:text-error hover:border-error/30 transition-all"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Top AppBar */}
      <header className="fixed top-0 left-0 lg:left-72 right-0 z-40 bg-surface/90 backdrop-blur-xl flex justify-between items-center px-6 h-20 border-b border-outline-variant shadow-sm">
        <div className="flex items-center gap-4">
          <span className="lg:hidden text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            RoadAssist
          </span>
          <span className="hidden lg:block text-xl font-bold text-on-surface">
            Provider Portal
          </span>
        </div>
        <div className="flex items-center gap-6">
          {/* Availability Toggle */}
          <div className="flex items-center gap-3 bg-background px-4 py-2 rounded-full border border-outline-variant shadow-inner">
            <span className={`text-sm font-bold ${isAvailable ? 'text-success' : 'text-on-surface-variant'}`}>
              {isAvailable ? 'Available' : 'Offline'}
            </span>
            <button
              onClick={handleToggleAvailability}
              disabled={toggling}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                isAvailable ? 'bg-success shadow-sm' : 'bg-outline'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${
                  isAvailable ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <button className="text-on-surface-variant hover:text-on-surface transition-colors">
            <Bell size={24} />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-extrabold shadow-sm">
            {provider.name?.[0]?.toUpperCase() || 'P'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-72 pt-28 pb-24 md:pb-12 relative z-10">
        <div className="max-w-[1000px] mx-auto px-6">

          {/* Quick Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Completed Jobs', value: stats.completedRequests ?? 0, icon: CheckCircle2, color: 'text-success bg-success/10' },
              { label: 'Total Earnings', value: `₹${stats.totalEarnings ?? 0}`, icon: DollarSign, color: 'text-primary bg-primary/10' },
              { label: 'Avg Rating', value: stats.rating ?? '0.0', icon: Star, color: 'text-warning bg-warning/10' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-surface p-6 rounded-2xl border border-outline-variant shadow-sm hover:-translate-y-1 transition-transform duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">{label}</span>
                  <div className={`p-2 rounded-lg ${color}`}>
                    <Icon size={24} />
                  </div>
                </div>
                <p className="text-4xl font-extrabold text-on-surface">{value}</p>
              </div>
            ))}
          </section>

          {/* More Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Pending', value: stats.pendingRequests ?? 0 },
              { label: 'Accepted', value: stats.acceptedRequests ?? 0 },
              { label: 'Ongoing', value: stats.ongoingRequests ?? 0 },
              { label: 'Cancelled', value: stats.cancelledRequests ?? 0 },
            ].map(({ label, value }) => (
              <div key={label} className="bg-surface border border-outline-variant rounded-xl p-5 hover:bg-surface-variant transition-colors shadow-sm">
                <p className="text-sm font-bold text-on-surface-variant mb-1">{label}</p>
                <p className="text-2xl font-bold text-on-surface">{value}</p>
              </div>
            ))}
          </section>

          {/* Incoming Requests */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-on-surface flex items-center gap-3">
                <AlertCircle className="text-error" />
                Incoming Requests
              </h2>
              {pendingRequests.length > 0 && (
                <button onClick={fetchDashboard} className="text-on-surface-variant hover:text-on-surface flex items-center gap-2 text-sm font-bold transition-colors">
                  <RefreshCw size={16} /> Refresh
                </button>
              )}
            </div>

            {pendingRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 bg-surface border border-outline-variant rounded-2xl shadow-sm">
                <div className="w-16 h-16 bg-surface-variant rounded-full flex items-center justify-center mb-4 text-outline">
                  <AlertCircle size={32} />
                </div>
                <p className="text-on-surface font-bold text-lg">No pending requests right now.</p>
                <p className="text-sm text-on-surface-variant mt-1">Make sure you're marked as 'Available' to receive jobs.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((req) => (
                  <div
                    key={req._id}
                    className="bg-surface border border-error/30 rounded-2xl p-6 shadow-md relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-error" />
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="bg-error/10 text-error border border-error/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          {req.serviceType}
                        </span>
                        <h3 className="text-xl font-bold text-on-surface mt-3 mb-1">
                          {req.userId?.name || 'User'}
                        </h3>
                        <p className="text-on-surface-variant text-sm mb-3">
                          {req.description || 'No description provided'}
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-on-surface flex items-center gap-2">
                            <span className="text-on-surface-variant">📍</span> {req.userLocation?.address || 'Location not provided'}
                          </p>
                          <p className="text-sm font-medium text-on-surface flex items-center gap-2">
                            <span className="text-on-surface-variant">🚗</span> {req.vehicleId
                              ? `${req.vehicleId.brand} ${req.vehicleId.model} • ${req.vehicleId.licensePlate}`
                              : '—'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="text-3xl font-extrabold text-primary mb-1">
                          {req.estimatedPrice ? `₹${req.estimatedPrice}` : 'TBD'}
                        </p>
                        <p className="text-xs font-bold text-on-surface-variant">
                          {new Date(req.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-2">
                      <button
                        onClick={() => handleAccept(req._id)}
                        disabled={accepting === req._id}
                        className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3.5 rounded-xl font-bold uppercase tracking-wide shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-60"
                      >
                        {accepting === req._id ? 'Accepting Job...' : 'Accept Job'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* My Assigned Requests */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-on-surface mb-6">My Active Jobs</h2>
            {recentRequests.length === 0 ? (
              <div className="text-center p-8 bg-surface border border-outline-variant rounded-2xl text-on-surface-variant font-medium shadow-sm">
                No active jobs.
              </div>
            ) : (
              <div className="space-y-4">
                {recentRequests.map((req) => (
                  <div
                    key={req._id}
                    className="bg-surface border border-outline-variant rounded-2xl p-6 hover:border-primary/30 transition-all shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${STATUS_COLORS[req.status]}`}>
                          {req.status}
                        </span>
                        <h3 className="text-xl font-bold text-on-surface mt-3 mb-2 capitalize">
                          {req.serviceType} <span className="text-outline mx-1">—</span> {req.userId?.name || ''}
                        </h3>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-on-surface">
                            <span className="text-on-surface-variant mr-2">📞</span> {req.userId?.phone || '—'}
                          </p>
                          <p className="text-sm font-medium text-on-surface">
                            <span className="text-on-surface-variant mr-2">🚗</span> {req.vehicleId
                              ? `${req.vehicleId.brand} ${req.vehicleId.model} • ${req.vehicleId.licensePlate}`
                              : '—'}
                          </p>
                        </div>
                      </div>
                      <p className="text-2xl font-extrabold text-primary">
                        {req.finalPrice ? `₹${req.finalPrice}` : req.estimatedPrice ? `₹${req.estimatedPrice}` : '—'}
                      </p>
                    </div>

                    {/* Action buttons based on status */}
                    <div className="flex gap-4 mt-6">
                      {req.status === 'accepted' && (
                        <button
                          onClick={() => handleStartService(req._id)}
                          className="flex-1 bg-secondary text-white py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                        >
                          Start Service (Enter OTP)
                        </button>
                      )}
                      {req.status === 'ongoing' && (
                        <button
                          onClick={() => handleComplete(req._id)}
                          className="flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={20} /> Mark Completed
                        </button>
                      )}
                      {req.status === 'completed' && (
                        <span className="flex-1 py-3 rounded-xl font-bold text-center bg-success/10 text-success border border-success/20 flex items-center justify-center gap-2">
                          <CheckCircle2 size={20} /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Reviews */}
          {recentReviews.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-on-surface mb-6">Recent Reviews</h2>
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review._id} className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-on-surface text-lg">{review.userId?.name || 'User'}</p>
                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? 'text-warning' : 'text-outline-variant'}
                              fill={i < review.rating ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-on-surface-variant bg-surface-variant px-2 py-1 rounded">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-on-surface text-sm mt-2 leading-relaxed italic border-l-2 border-outline-variant pl-4">"{review.comment}"</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-surface/90 backdrop-blur-xl border-t border-outline-variant">
        <Link to="/provider-dashboard" className="flex flex-col items-center bg-secondary/10 text-secondary rounded-xl px-5 py-2 font-bold">
          <LayoutDashboard size={22} className="mb-1" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/provider-history" className="flex flex-col items-center text-on-surface-variant hover:text-on-surface transition-colors font-medium">
          <History size={22} className="mb-1" />
          <span className="text-xs">History</span>
        </Link>
        <Link to="/provider-earnings" className="flex flex-col items-center text-on-surface-variant hover:text-on-surface transition-colors font-medium">
          <DollarSign size={22} className="mb-1" />
          <span className="text-xs">Earnings</span>
        </Link>
        <Link to="/provider-profile" className="flex flex-col items-center text-on-surface-variant hover:text-on-surface transition-colors font-medium">
          <UserCircle size={22} className="mb-1" />
          <span className="text-xs">Profile</span>
        </Link>
      </nav>
    </div>
  );
}

export default ProviderDashboard;