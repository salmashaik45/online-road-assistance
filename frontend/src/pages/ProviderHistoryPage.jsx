import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, DollarSign, History,
  UserCircle, CheckCircle2, AlertCircle, Wrench
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

function ProviderHistoryPage() {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchRequests = async () => {
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const res = await api.get(`/providers/my-requests${params}`);
      setRequests(res.data.data || []);
    } catch {
      toast.error('Failed to load history');
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
        const res = await api.get(`/providers/my-requests${params}`);
        if (active) setRequests(res.data.data || []);
      } catch {
        if (active) toast.error('Failed to load history');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [filter]);

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
          <span className="bg-primary/10 text-primary border border-primary/20 shadow-sm rounded-xl mx-2 flex items-center px-4 py-3 font-bold">
            <History size={20} className="mr-3" /> History
          </span>
          <Link to="/provider-profile" className="text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-xl mx-2 flex items-center px-4 py-3 font-bold transition-all">
            <UserCircle size={20} className="mr-3" /> Profile
          </Link>
        </nav>
        <div className="p-6 mt-auto">
          <button onClick={logout} className="w-full py-4 border border-error/50 text-error rounded-xl font-bold hover:bg-error/10 transition-all">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-28 pb-24 md:pb-12 lg:ml-72 px-6 max-w-[1000px] mx-auto relative z-10">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface">Service History</h1>
          <p className="text-lg text-on-surface-variant mt-3">Track all your past and current jobs.</p>
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
          <p className="text-on-surface-variant">Loading history...</p>
        ) : requests.length === 0 ? (
          <div className="text-center p-16 bg-surface border border-outline-variant rounded-3xl shadow-sm">
            <Wrench size={64} className="text-on-surface-variant mx-auto mb-6" />
            <p className="text-lg text-on-surface-variant mb-8">No requests found for this filter.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {requests.map((req) => (
              <article
                key={req._id}
                className="bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 hover:border-primary/50 hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-on-surface capitalize mb-1">
                      {req.userId?.name || 'Customer'}
                    </h3>
                    <p className="text-sm font-bold text-on-surface-variant">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${STATUS_COLORS[req.status]}`}>
                    {req.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-6 md:grid-cols-3 border-t border-outline-variant pt-6">
                  <div>
                    <p className="text-sm font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Vehicle</p>
                    <p className="text-lg font-bold text-on-surface">
                      {req.vehicleId ? `${req.vehicleId.brand} ${req.vehicleId.model}` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Location</p>
                    <p className="text-sm font-bold text-on-surface truncate pr-4">
                      {req.userLocation?.address || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Earnings</p>
                    <p className="text-2xl font-extrabold text-primary">
                      {req.finalPrice ? `₹${req.finalPrice}` : '—'}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-surface/90 backdrop-blur-2xl border-t border-outline-variant">
        <Link to="/provider-dashboard" className="flex flex-col items-center text-on-surface-variant hover:text-on-surface transition-colors">
          <LayoutDashboard size={22} className="mb-1" />
          <span className="text-xs font-bold">Home</span>
        </Link>
        <Link to="/provider-history" className="flex flex-col items-center bg-primary/10 text-primary rounded-xl px-5 py-2">
          <History size={22} className="mb-1" />
          <span className="text-xs font-bold">History</span>
        </Link>
        <Link to="/provider-earnings" className="flex flex-col items-center text-on-surface-variant hover:text-on-surface transition-colors">
          <DollarSign size={22} className="mb-1" />
          <span className="text-xs font-bold">Earnings</span>
        </Link>
        <Link to="/provider-profile" className="flex flex-col items-center text-on-surface-variant hover:text-on-surface transition-colors">
          <UserCircle size={22} className="mb-1" />
          <span className="text-xs font-bold">Profile</span>
        </Link>
      </nav>
    </div>
  );
}

export default ProviderHistoryPage;
