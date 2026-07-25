import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home, LayoutDashboard, Car, ReceiptText,
  Truck, Settings, Wrench, Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_FILTERS = ['all', 'pending', 'accepted', 'ongoing', 'completed', 'cancelled'];

const STATUS_COLORS = {
  pending:   'bg-warning/20 text-warning border-warning/30',
  accepted:  'bg-primary/20 text-primary border-primary/30',
  ongoing:   'bg-secondary/20 text-secondary border-secondary/30',
  completed: 'bg-success/20 text-success border-success/30',
  cancelled: 'bg-error/20 text-error border-error/30',
};

function MyRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  const fetchRequests = async () => {
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const res = await api.get(`/services/my-requests${params}`);
      setRequests(res.data.data || []);
    } catch {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const params = filter !== 'all' ? `?status=${filter}` : '';
        const res = await api.get(`/services/my-requests${params}`);
        if (active) setRequests(res.data.data || []);
      } catch {
        if (active) toast.error('Failed to load requests');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [filter]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this request?')) return;
    setCancelling(id);
    try {
      await api.put(`/services/${id}/cancel`, {
        cancelReason: 'Cancelled by user'
      });
      toast.success('Request cancelled');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen relative overflow-hidden">
      {/* Background accents */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />

      {/* TopNavBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-8 h-20 bg-surface/80 backdrop-blur-2xl border-b border-outline-variant shadow-sm">
        <Link to="/" className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tighter hover:opacity-90 transition-opacity">
          RoadAssist
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link to="/dashboard" className="text-on-surface-variant hover:text-on-surface transition-colors font-bold">Dashboard</Link>
          <span className="text-primary font-bold border-b-2 border-primary pb-1">Requests</span>
          <Link to="/vehicles" className="text-on-surface-variant hover:text-on-surface transition-colors font-bold">Vehicles</Link>
        </nav>
      </header>

      {/* SideNavBar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full border-r border-outline-variant bg-surface w-72 pt-24 z-40 shadow-sm">
        <div className="px-8 mb-8">
          <h2 className="text-2xl font-bold text-on-surface mb-1">RoadAssist Pro</h2>
          <p className="text-sm font-bold text-success">
            {user?.isVerified ? '✓ Verified Member' : 'Member'}
          </p>
        </div>
        <nav className="flex-grow px-4 space-y-2">
          <Link to="/dashboard" className="text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-xl mx-2 flex items-center px-4 py-3 font-bold transition-all">
            <LayoutDashboard size={20} className="mr-3" /> Dashboard
          </Link>
          <Link to="/vehicles" className="text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-xl mx-2 flex items-center px-4 py-3 font-bold transition-all">
            <Car size={20} className="mr-3" /> My Vehicles
          </Link>
          <span className="bg-primary/10 text-primary border border-primary/20 shadow-sm rounded-xl mx-2 flex items-center px-4 py-3 font-bold">
            <ReceiptText size={20} className="mr-3" /> History
          </span>
          <Link to="/providers" className="text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-xl mx-2 flex items-center px-4 py-3 font-bold transition-all">
            <Truck size={20} className="mr-3" /> Providers
          </Link>
          <Link to="/profile" className="text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-xl mx-2 flex items-center px-4 py-3 font-bold transition-all">
            <Settings size={20} className="mr-3" /> Settings
          </Link>
        </nav>
        <div className="p-6 mt-auto">
          <Link to="/request-service" className="block text-center bg-error text-white w-full py-4 rounded-xl font-bold uppercase text-xs tracking-widest shadow-md hover:shadow-lg hover:bg-error/90 hover:scale-[1.02] transition-all duration-300">
            Request Emergency Tow
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-28 pb-24 md:pb-12 lg:ml-72 px-6 max-w-[1000px] mx-auto min-h-screen relative z-10">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface">
            Service History
          </h1>
          <p className="text-lg text-on-surface-variant mt-3">
            Manage and review your past roadside assistance requests.
          </p>
        </header>

        {/* Filter Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 hide-scrollbar">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold border transition-all duration-300 capitalize ${
                filter === s
                  ? 'bg-primary/10 text-primary border-primary shadow-sm'
                  : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Request Cards */}
        {loading ? (
          <p className="text-on-surface-variant">Loading requests...</p>
        ) : requests.length === 0 ? (
          <div className="text-center p-16 bg-surface border border-outline-variant rounded-3xl shadow-sm">
            <Wrench size={64} className="text-on-surface-variant mx-auto mb-6" />
            <p className="text-lg text-on-surface-variant mb-8">No requests found.</p>
            <Link
              to="/request-service"
              className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
            >
              Request Help Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {requests.map((req) => (
              <article
                key={req._id}
                className="bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 hover:border-primary/50 hover:shadow-md transition-all duration-300 group"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className="w-14 h-14 bg-surface-variant border border-outline-variant flex items-center justify-center rounded-2xl group-hover:scale-105 transition-transform duration-300">
                      <Wrench size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-on-surface leading-none capitalize mb-2">
                        {req.serviceType} Service
                      </h3>
                      <p className="text-sm font-bold text-on-surface-variant">
                        {new Date(req.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${STATUS_COLORS[req.status]}`}>
                    {req.status}
                  </span>
                </div>

                {/* Card Details */}
                <div className="grid grid-cols-2 gap-y-6 md:grid-cols-3 border-t border-outline-variant pt-6 mb-6">
                  <div>
                    <p className="text-sm font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Vehicle</p>
                    <p className="text-lg font-bold text-on-surface">
                      {req.vehicleId
                        ? `${req.vehicleId.brand} ${req.vehicleId.model}`
                        : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Provider</p>
                    <p className="text-lg font-bold text-on-surface">
                      {req.providerId ? req.providerId.name : 'Not assigned'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Cost</p>
                    <p className="text-2xl font-extrabold text-primary">
                      {req.finalPrice ? `₹${req.finalPrice}` : '—'}
                    </p>
                  </div>
                </div>

                {/* OTP if accepted/ongoing */}
                {['accepted', 'ongoing'].includes(req.status) && req.otp && (
                  <div className="mb-6 p-4 md:p-5 bg-secondary/10 rounded-2xl border border-secondary/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-sm font-bold text-secondary">Your OTP (share with provider to start service)</p>
                    <p className="text-3xl font-extrabold text-secondary tracking-[0.2em]">{req.otp}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  {req.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(req._id)}
                      disabled={cancelling === req._id}
                      className="flex-1 py-3.5 border border-error/50 text-error font-bold rounded-xl hover:bg-error/10 transition-all disabled:opacity-60"
                    >
                      {cancelling === req._id ? 'Cancelling...' : 'Cancel Request'}
                    </button>
                  )}
                  {req.status === 'completed' && !req.isReviewed && (
                    <Link
                      to={`/review/${req._id}`}
                      className="flex-1 py-3.5 bg-secondary/10 border border-secondary/50 text-secondary font-bold rounded-xl hover:bg-secondary/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Star size={18} /> Write Review
                    </Link>
                  )}
                  {req.status === 'completed' && req.isReviewed && (
                    <span className="flex-1 py-3.5 border border-outline-variant bg-surface-variant text-on-surface-variant font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                      <Star size={18} className="text-on-surface-variant" /> Reviewed ✓
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-surface/90 backdrop-blur-2xl border-t border-outline-variant">
        <Link to="/request-service" className="flex flex-col items-center text-on-surface-variant hover:text-on-surface transition-colors">
          <Truck size={22} className="mb-1" />
          <span className="text-xs font-bold">SOS</span>
        </Link>
        <Link to="/dashboard" className="flex flex-col items-center text-on-surface-variant hover:text-on-surface transition-colors">
          <LayoutDashboard size={22} className="mb-1" />
          <span className="text-xs font-bold">Dashboard</span>
        </Link>
        <Link to="/my-requests" className="flex flex-col items-center bg-primary/10 text-primary rounded-xl px-5 py-2">
          <ReceiptText size={22} className="mb-1" />
          <span className="text-xs font-bold">Requests</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-on-surface-variant hover:text-on-surface transition-colors">
          <Settings size={22} className="mb-1" />
          <span className="text-xs font-bold">Profile</span>
        </Link>
      </nav>
    </div>
  );
}

export default MyRequestsPage;