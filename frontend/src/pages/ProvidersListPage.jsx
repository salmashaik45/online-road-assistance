import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Truck, BatteryCharging, Disc,
  Wrench, Fuel, Star, MapPin, SlidersHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const SERVICE_FILTERS = ['all', 'towing', 'fuel', 'tire', 'mechanic', 'battery'];

const SERVICE_ICONS = {
  towing:   Truck,
  fuel:     Fuel,
  tire:     Disc,
  mechanic: Wrench,
  battery:  BatteryCharging,
};

function ProvidersListPage() {
  const [providers, setProviders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await api.get('/providers');
        const result = res.data.data || [];
        setProviders(result);
        setFiltered(result);
      } catch {
        toast.error('Failed to load providers');
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  const displayedProviders = useMemo(() => {
    let result = providers;

    if (serviceFilter !== 'all') {
      result = result.filter((p) => p.serviceType === serviceFilter);
    }

    if (search.trim()) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.serviceType.toLowerCase().includes(search.toLowerCase())
      );
    }

    return result;
  }, [providers, search, serviceFilter]);

  useEffect(() => {
    setFiltered(displayedProviders);
  }, [displayedProviders]);

  return (
    <div className="bg-background text-on-background min-h-screen relative overflow-hidden font-body-md">
      {/* Background accents */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />

      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-8 h-20 bg-surface/80 backdrop-blur-2xl border-b border-outline-variant shadow-sm">
        <Link to="/" className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tighter hover:opacity-90 transition-opacity">
          RoadAssist
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link to="/dashboard" className="text-on-surface-variant font-bold hover:text-on-surface transition-colors">
            Dashboard
          </Link>
          <Link to="/my-requests" className="text-on-surface-variant font-bold hover:text-on-surface transition-colors">
            My Requests
          </Link>
          <span className="text-primary font-bold border-b-2 border-primary pb-1">
            Providers
          </span>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-on-surface-variant hover:text-on-surface transition-colors">
            <Star size={24} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-24 min-h-screen relative z-10">
        <div className="max-w-[900px] mx-auto px-6 py-6">
          {/* Header & Search */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-4">
              Local Providers
            </h1>
            <p className="text-lg text-on-surface-variant mb-8">
              Browse vetted roadside assistance specialists near you.
            </p>
            <div className="relative max-w-2xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant" size={22} />
              <input
                className="w-full pl-14 pr-6 h-16 bg-surface border border-outline-variant rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-on-surface text-lg transition-all shadow-sm placeholder:text-on-surface-variant"
                placeholder="Search by name or service..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8 hide-scrollbar">
            <button className="whitespace-nowrap px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold flex items-center gap-2 shadow-sm">
              <SlidersHorizontal size={18} /> Filters
            </button>
            {SERVICE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setServiceFilter(f)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 capitalize ${
                  serviceFilter === f
                    ? 'bg-secondary/10 text-secondary border-secondary shadow-sm'
                    : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                }`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          {/* Count */}
          <div className="flex justify-between items-center mb-8 border-b border-outline-variant pb-4">
            <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">
              {filtered.length} Providers Found
            </span>
          </div>

          {/* Provider List */}
          {loading ? (
            <p className="text-on-surface-variant text-center py-16">Loading providers...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center p-16 bg-surface border border-outline-variant rounded-3xl shadow-sm">
              <Truck size={64} className="text-on-surface-variant mx-auto mb-6" />
              <p className="text-lg text-on-surface-variant">No providers found.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filtered.map((provider) => {
                const Icon = SERVICE_ICONS[provider.serviceType] || Wrench;
                return (
                  <div
                    key={provider._id}
                    className="bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 hover:border-primary/50 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Avatar */}
                      <div className="w-24 h-24 bg-surface-variant border border-outline-variant rounded-2xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        {provider.profileImage ? (
                          <img
                            src={provider.profileImage}
                            alt={provider.name}
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        ) : (
                          <Icon size={40} className="text-primary" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-on-surface group-hover:text-primary transition-colors">
                              {provider.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                              <Star size={18} className="text-yellow-500" fill="currentColor" />
                              <span className="font-bold text-on-surface text-lg">{provider.rating || '0.0'}</span>
                              <span className="text-sm font-medium text-on-surface-variant">
                                ({provider.totalReviews || 0} reviews)
                              </span>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                              provider.isAvailable
                                ? 'bg-success/10 text-success border-success/20'
                                : 'bg-error/10 text-error border-error/20'
                            }`}>
                              {provider.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-3 mb-4">
                          <span className="bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                            {provider.serviceType}
                          </span>
                          {provider.experience > 0 && (
                            <span className="bg-surface-variant border border-outline-variant text-on-surface-variant px-3 py-1.5 rounded-lg text-xs font-bold">
                              {provider.experience} YRS EXP
                            </span>
                          )}
                          {provider.completedJobs > 0 && (
                            <span className="bg-surface-variant border border-outline-variant text-on-surface-variant px-3 py-1.5 rounded-lg text-xs font-bold">
                              {provider.completedJobs} JOBS
                            </span>
                          )}
                        </div>

                        {/* Location & Bio */}
                        {provider.address?.city && (
                          <div className="flex items-center gap-2 mt-4 text-on-surface-variant bg-surface-variant inline-flex px-3 py-1.5 rounded-lg border border-outline-variant">
                            <MapPin size={16} className="text-on-surface-variant" />
                            <span className="text-sm font-bold">
                              {provider.address.city}, {provider.address.state}
                            </span>
                          </div>
                        )}
                        {provider.bio && (
                          <p className="text-sm text-on-surface-variant mt-4 leading-relaxed line-clamp-2">
                            {provider.bio}
                          </p>
                        )}

                        {/* Action */}
                        <div className="mt-6">
                          <Link
                            to="/request-service"
                            className={`inline-flex items-center gap-3 px-8 py-3.5 rounded-xl font-bold transition-all ${
                              provider.isAvailable
                                ? 'bg-primary text-white shadow-md hover:shadow-lg hover:scale-[1.02]'
                                : 'bg-surface-variant border border-outline-variant text-on-surface-variant cursor-not-allowed'
                            }`}
                          >
                            <Truck size={20} />
                            {provider.isAvailable ? 'Request Help' : 'Unavailable'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 flex flex-col items-center gap-6 bg-surface border-t border-outline-variant mb-20 lg:mb-0 shadow-sm">
        <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">RoadAssist</div>
        <p className="text-sm font-medium text-on-surface-variant text-center">
          © 2026 RoadAssist. Emergency Support 24/7.
        </p>
      </footer>

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-surface/90 backdrop-blur-2xl border-t border-outline-variant">
        <Link to="/request-service" className="flex flex-col items-center text-on-surface-variant hover:text-on-surface transition-colors">
          <Truck size={22} className="mb-1" />
          <span className="text-xs font-bold">SOS</span>
        </Link>
        <Link to="/providers" className="flex flex-col items-center bg-primary/10 text-primary rounded-xl px-5 py-2">
          <Wrench size={22} className="mb-1" />
          <span className="text-xs font-bold">Providers</span>
        </Link>
        <Link to="/my-requests" className="flex flex-col items-center text-on-surface-variant hover:text-on-surface transition-colors">
          <Search size={22} className="mb-1" />
          <span className="text-xs font-bold">Requests</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-on-surface-variant hover:text-on-surface transition-colors">
          <Star size={22} className="mb-1" />
          <span className="text-xs font-bold">Profile</span>
        </Link>
      </nav>
    </div>
  );
}

export default ProvidersListPage;