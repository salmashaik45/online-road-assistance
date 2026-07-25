import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Plus, Trash2, Pencil, Home, LayoutDashboard, ReceiptText, Truck, Settings, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const FUEL_TYPES = ['petrol', 'diesel', 'electric', 'cng', 'hybrid'];
const VEHICLE_TYPES = ['car', 'bike', 'truck', 'bus', 'auto', 'van'];

function VehiclesPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    color: '',
    licensePlate: '',
    fuelType: 'petrol',
    vehicleType: 'car',
  });

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/users/vehicles');
      setVehicles(res.data.data || []);
    } catch {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get('/users/vehicles');
        if (active) setVehicles(res.data.data || []);
      } catch {
        if (active) toast.error('Failed to load vehicles');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAdd = () => {
    setEditVehicle(null);
    setFormData({
      brand: '', model: '', year: '', color: '',
      licensePlate: '', fuelType: 'petrol', vehicleType: 'car',
    });
    setShowForm(true);
  };

  const openEdit = (v) => {
    setEditVehicle(v);
    setFormData({
      brand: v.brand,
      model: v.model,
      year: v.year,
      color: v.color || '',
      licensePlate: v.licensePlate,
      fuelType: v.fuelType,
      vehicleType: v.vehicleType,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editVehicle) {
        await api.put(`/users/vehicles/${editVehicle._id}`, formData);
        toast.success('Vehicle updated!');
      } else {
        await api.post('/users/vehicles', formData);
        toast.success('Vehicle added!');
      }
      setShowForm(false);
      fetchVehicles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await api.delete(`/users/vehicles/${id}`);
      toast.success('Vehicle deleted');
      fetchVehicles();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen relative overflow-hidden">
      {/* Background accents */}
      <div className="fixed top-[10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />

      {/* TopNavBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-8 h-20 bg-surface/80 backdrop-blur-2xl border-b border-outline-variant shadow-sm">
        <Link to="/" className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tighter hover:opacity-90 transition-opacity">
          RoadAssist
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link to="/dashboard" className="text-on-surface-variant hover:text-on-surface transition-colors font-bold">Dashboard</Link>
          <span className="text-primary font-bold border-b-2 border-primary pb-1">Vehicles</span>
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
          <span className="bg-primary/10 text-primary border border-primary/20 shadow-sm rounded-xl mx-2 flex items-center px-4 py-3 font-bold">
            <Car size={20} className="mr-3" /> My Vehicles
          </span>
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
      <main className="pt-28 pb-24 lg:ml-72 px-6 max-w-[900px] mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-on-surface">My Vehicles</h1>
            <p className="text-lg text-on-surface-variant mt-2">Manage your registered vehicles.</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <Plus size={20} /> Add Vehicle
          </button>
        </div>

        {/* Vehicle List */}
        {loading ? (
          <p className="text-on-surface-variant">Loading...</p>
        ) : vehicles.length === 0 ? (
          <div className="text-center p-16 bg-surface border border-outline-variant rounded-3xl shadow-sm">
            <Car size={64} className="text-on-surface-variant mx-auto mb-6" />
            <p className="text-lg text-on-surface-variant mb-8">No vehicles added yet.</p>
            <button
              onClick={openAdd}
              className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
            >
              Add Your First Vehicle
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {vehicles.map((v) => (
              <div key={v._id} className="bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 hover:border-primary/50 transition-colors shadow-sm group">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-surface-variant border border-outline-variant rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Car size={26} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-on-surface mb-1">
                        {v.year} {v.brand} {v.model}
                      </h3>
                      <p className="text-sm font-bold text-on-surface-variant">
                        {v.color && `${v.color} • `}<span className="uppercase">{v.licensePlate}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => openEdit(v)}
                      className="p-2.5 bg-surface-variant border border-outline-variant rounded-xl hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all text-on-surface-variant"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="p-2.5 bg-surface-variant border border-outline-variant rounded-xl hover:bg-error/10 hover:text-error hover:border-error/30 transition-all text-on-surface-variant"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-outline-variant">
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Fuel Type</p>
                    <p className="text-lg font-bold text-on-surface capitalize">{v.fuelType}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Vehicle Type</p>
                    <p className="text-lg font-bold text-on-surface capitalize">{v.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Mileage</p>
                    <p className="text-lg font-bold text-on-surface">{v.mileage ? `${v.mileage} km` : '—'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-outline-variant rounded-3xl w-full max-w-[550px] p-6 md:p-8 shadow-2xl relative">
            <div className="flex justify-between items-center mb-8 border-b border-outline-variant pb-4">
              <h2 className="text-2xl font-bold text-on-surface">
                {editVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-on-surface-variant">Brand</label>
                  <input
                    className="w-full mt-2 h-14 px-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant"
                    name="brand"
                    placeholder="e.g. Toyota"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-on-surface-variant">Model</label>
                  <input
                    className="w-full mt-2 h-14 px-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant"
                    name="model"
                    placeholder="e.g. Innova"
                    value={formData.model}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-on-surface-variant">Year</label>
                  <input
                    className="w-full mt-2 h-14 px-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant"
                    name="year"
                    placeholder="2020"
                    type="number"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-on-surface-variant">Color</label>
                  <input
                    className="w-full mt-2 h-14 px-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant"
                    name="color"
                    placeholder="e.g. White"
                    value={formData.color}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-on-surface-variant">License Plate</label>
                <input
                  className="w-full mt-2 h-14 px-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant uppercase"
                  name="licensePlate"
                  placeholder="TS09AB1234"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-on-surface-variant">Fuel Type</label>
                  <select
                    className="w-full mt-2 h-14 px-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all capitalize appearance-none"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                  >
                    {FUEL_TYPES.map((f) => (
                      <option key={f} value={f} className="bg-surface">{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-on-surface-variant">Vehicle Type</label>
                  <select
                    className="w-full mt-2 h-14 px-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all capitalize appearance-none"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                  >
                    {VEHICLE_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-surface">{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-14 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-60 mt-4"
              >
                {submitting ? 'Saving...' : editVehicle ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
            </form>
          </div>
        </div>
      )}

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
        <Link to="/my-requests" className="flex flex-col items-center text-on-surface-variant hover:text-on-surface transition-colors">
          <ReceiptText size={22} className="mb-1" />
          <span className="text-xs font-bold">Requests</span>
        </Link>
        <Link to="/vehicles" className="flex flex-col items-center bg-primary/10 text-primary rounded-xl px-5 py-2">
          <Car size={22} className="mb-1" />
          <span className="text-xs font-bold">Vehicles</span>
        </Link>
      </nav>
    </div>
  );
}

export default VehiclesPage;