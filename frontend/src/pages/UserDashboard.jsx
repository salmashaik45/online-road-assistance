import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home, LayoutDashboard, Car, ReceiptText, Truck, Settings,
  AlertTriangle, Bell, UserCircle, Fuel, BatteryCharging, Disc, Wrench
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function UserDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/users/dashboard');
        setData(res.data.data);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">Loading dashboard...</div>;
  }

  const stats = data?.stats || {};
  const recentRequests = data?.recentRequests || [];

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen relative overflow-hidden">
      {/* Background accents */}
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />

      {/* TopNavBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-8 h-20 bg-surface/80 backdrop-blur-2xl border-b border-outline-variant shadow-sm">
        <Link to="/" className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tighter hover:opacity-90 transition-opacity">
          RoadAssist
        </Link>
        <nav className="hidden md:flex gap-8">
          <span className="text-primary font-bold border-b-2 border-primary pb-1">Dashboard</span>
          <Link to="/my-requests" className="text-on-surface-variant hover:text-on-surface transition-colors font-bold">My Requests</Link>
          <Link to="/vehicles" className="text-on-surface-variant hover:text-on-surface transition-colors font-bold">Vehicles</Link>
        </nav>
        <div className="flex items-center gap-6 text-on-surface-variant">
          <button className="hover:text-on-surface transition-colors"><Bell size={24} /></button>
          <Link to="/profile" className="hover:text-on-surface transition-colors"><UserCircle size={28} /></Link>
        </div>
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
          <span className="bg-primary/10 text-primary border border-primary/20 shadow-sm rounded-xl mx-2 flex items-center px-4 py-3 font-bold">
            <LayoutDashboard size={20} className="mr-3" /> Dashboard
          </span>
          <Link to="/vehicles" className="text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-xl mx-2 flex items-center px-4 py-3 font-bold transition-all">
            <Car size={20} className="mr-3" /> My Vehicles
          </Link>
          <Link to="/my-requests" className="text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-xl mx-2 flex items-center px-4 py-3 font-bold transition-all">
            <ReceiptText size={20} className="mr-3" /> History
          </Link>
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
      <main className="pt-28 pb-24 lg:ml-72 px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-2 tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'there'}.
            </h1>
            <p className="text-lg text-on-surface-variant">Stay safe out there. We're here if you need us.</p>
          </div>
          <Link
            to="/request-service"
            className="bg-error text-white h-14 px-8 rounded-xl font-bold flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:bg-error/90 hover:scale-[1.02] transition-all duration-300 group"
          >
            <AlertTriangle size={24} className="group-hover:animate-pulse" />
            <span className="tracking-wide">SOS EMERGENCY</span>
          </Link>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Requests', value: stats.totalRequests ?? 0 },
            { label: 'Pending', value: stats.pendingRequests ?? 0 },
            { label: 'Completed', value: stats.completedRequests ?? 0 },
            { label: 'My Vehicles', value: stats.totalVehicles ?? 0 },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <p className="text-sm font-bold text-on-surface-variant mb-2 uppercase tracking-wider">{s.label}</p>
              <p className="text-4xl font-extrabold text-on-surface">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Services */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-on-surface mb-6">Quick Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: 'Towing' },
              { icon: Fuel, label: 'Fuel Delivery' },
              { icon: BatteryCharging, label: 'Jump Start' },
              { icon: Disc, label: 'Tire Change' },
            ].map(({ icon: Icon, label }) => (
              <Link
                to="/request-service"
                key={label}
                className="bg-surface border border-outline-variant p-6 rounded-2xl flex flex-col items-center gap-4 hover:border-primary/50 hover:bg-primary/5 shadow-sm group transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-surface-variant rounded-full flex items-center justify-center text-primary border border-outline-variant group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon size={28} />
                </div>
                <span className="font-bold text-on-surface-variant group-hover:text-primary transition-colors">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-2xl font-bold text-on-surface">Recent Activity</h3>
            <Link to="/my-requests" className="text-primary font-bold hover:text-primary-fixed transition-colors">View All History</Link>
          </div>
          <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
            {recentRequests.length === 0 ? (
              <p className="p-8 text-center text-on-surface-variant">No requests yet. Tap "Request Emergency Tow" to get started.</p>
            ) : (
              <div className="divide-y divide-outline-variant">
                {recentRequests.map((req) => (
                  <div key={req._id} className="p-6 flex items-center justify-between hover:bg-surface-variant transition-colors group cursor-default">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                        <Wrench size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-lg capitalize mb-1">{req.serviceType}</p>
                        <p className="text-sm text-on-surface-variant capitalize flex items-center gap-2 font-bold">
                          <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                          <span className="w-1 h-1 rounded-full bg-on-surface-variant"></span>
                          <span className={`${
                            req.status === 'completed' ? 'text-success' :
                            req.status === 'pending' ? 'text-warning' :
                            req.status === 'cancelled' ? 'text-error' :
                            'text-primary'
                          }`}>{req.status}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-on-surface">
                      {req.finalPrice ? `₹${req.finalPrice}` : '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;