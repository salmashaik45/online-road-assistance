import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, DollarSign, History,
  UserCircle, CheckCircle2, TrendingUp, Wallet
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function ProviderEarningsPage() {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/providers/dashboard');
        setData(res.data.data);
      } catch {
        toast.error('Failed to load earnings data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant font-medium">
        Loading earnings...
      </div>
    );
  }

  const stats = data?.stats || {};
  const completedJobs = stats.completedRequests || 0;
  const totalEarnings = stats.totalEarnings || 0;
  const averagePerJob = completedJobs > 0 ? (totalEarnings / completedJobs).toFixed(0) : 0;

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
          <span className="bg-primary/10 text-primary border border-primary/20 shadow-sm rounded-xl mx-2 flex items-center px-4 py-3 font-bold">
            <DollarSign size={20} className="mr-3" /> Earnings
          </span>
          <Link to="/provider-history" className="text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-xl mx-2 flex items-center px-4 py-3 font-bold transition-all">
            <History size={20} className="mr-3" /> History
          </Link>
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface">Your Earnings</h1>
          <p className="text-lg text-on-surface-variant mt-3">Overview of your completed jobs and revenue.</p>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface p-8 rounded-3xl border border-outline-variant shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 bg-success/10 text-success rounded-xl flex items-center justify-center">
                <Wallet size={24} />
              </div>
              <h2 className="text-xl font-bold text-on-surface-variant">Total Earnings</h2>
            </div>
            <p className="text-5xl font-extrabold text-success relative z-10">₹{totalEarnings}</p>
          </div>

          <div className="bg-surface p-8 rounded-3xl border border-outline-variant shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-xl font-bold text-on-surface-variant">Jobs Done</h2>
            </div>
            <p className="text-5xl font-extrabold text-on-surface relative z-10">{completedJobs}</p>
          </div>

          <div className="bg-surface p-8 rounded-3xl border border-outline-variant shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <h2 className="text-xl font-bold text-on-surface-variant">Avg per Job</h2>
            </div>
            <p className="text-5xl font-extrabold text-secondary relative z-10">₹{averagePerJob}</p>
          </div>
        </section>

        {/* Withdrawal Section */}
        <section className="bg-surface border border-outline-variant rounded-3xl p-8 shadow-sm text-center md:text-left md:flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-on-surface mb-2">Available Balance</h3>
            <p className="text-on-surface-variant">Withdraw your earnings directly to your bank account.</p>
          </div>
          <button className="mt-6 md:mt-0 px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all">
            Withdraw Funds
          </button>
        </section>

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
        <Link to="/provider-earnings" className="flex flex-col items-center bg-primary/10 text-primary rounded-xl px-5 py-2">
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

export default ProviderEarningsPage;
