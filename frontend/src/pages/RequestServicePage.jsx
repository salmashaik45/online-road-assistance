import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  BatteryCharging,
  Disc,
  Fuel,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const SERVICE_TYPES = [
  { value: 'towing', label: 'Towing', icon: Truck },
  { value: 'battery', label: 'Battery', icon: BatteryCharging },
  { value: 'tire', label: 'Flat Tire', icon: Disc },
  { value: 'fuel', label: 'Fuel Delivery', icon: Fuel },
];

function RequestServicePage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const [serviceType, setServiceType] = useState('towing');
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState({
    latitude: null,
    longitude: null,
  });
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await api.get('/users/vehicles');
        const vehicleList = res.data.data || [];

        setVehicles(vehicleList);

        if (vehicleList.length > 0) {
          setSelectedVehicle(vehicleList[0]._id);
        }
      } catch {
        toast.error('Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();

    // Try to get the browser location.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          // The user can still enter an address manually.
        }
      );
    }
  }, []);

  const handleNext = () => {
    if (step === 2 && !selectedVehicle) {
      toast.error('Please select or add a vehicle first');
      return;
    }

    if (step === 3 && !address.trim()) {
      toast.error('Please enter your location');
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleGetAddress = async () => {
    if (coords.latitude == null || coords.longitude == null) {
      toast.error('Location coordinates are not available');
      return;
    }

    setIsLoadingAddress(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
      );

      if (!res.ok) {
        throw new Error('Address lookup failed');
      }

      const data = await res.json();

      if (data?.display_name) {
        setAddress(data.display_name);
        toast.success('Address populated!');
      } else {
        toast.error('Address not found');
      }
    } catch {
      toast.error('Failed to get address');
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleSubmit = async () => {
    if (coords.latitude == null || coords.longitude == null) {
      toast.error(
        'Location coordinates not available. Please allow location access.'
      );
      return;
    }

    if (!selectedVehicle) {
      toast.error('Please select a vehicle first');
      return;
    }

    if (!address.trim()) {
      toast.error('Please enter your location');
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.post('/services/request', {
        vehicleId: selectedVehicle,
        serviceType,
        userLocation: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          address: address.trim(),
        },
        description,
      });

      toast.success(
        `Request created! OTP: ${res.data.data.otp}`
      );

      navigate('/my-requests');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to create request'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedVehicleObj = vehicles.find(
    (vehicle) => vehicle._id === selectedVehicle
  );

  return (
    <div className="bg-background text-on-background min-h-screen pb-20 relative overflow-hidden font-body-md">
      {/* Background accents */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-20 bg-surface/80 backdrop-blur-2xl border-b border-outline-variant shadow-sm">
        <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tighter">
          RoadAssist
        </h1>
      </header>

      {/* Progress bar */}
      <div className="fixed top-20 left-0 w-full h-1 bg-surface z-40">
        <div
          className="h-full bg-primary transition-all duration-500 ease-in-out shadow-sm"
          style={{
            width: `${(step / totalSteps) * 100}%`,
          }}
        />
      </div>

      <main className="pt-28 px-6 max-w-[800px] mx-auto min-h-screen relative z-10">
        <div className="space-y-10">
          {/* Step 1: Select service */}
          {step === 1 && (
            <section className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-on-surface mb-2">
                  Select Service
                </h2>
                <p className="text-lg text-on-surface-variant">
                  What do you need assistance with today?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {SERVICE_TYPES.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setServiceType(value)}
                    className={`p-6 md:p-8 rounded-3xl flex flex-col items-center gap-4 transition-all duration-300 ${
                      serviceType === value
                        ? 'bg-primary/10 border-2 border-primary shadow-sm scale-[1.02]'
                        : 'bg-surface border border-outline-variant hover:border-primary/50 hover:bg-surface-variant'
                    }`}
                  >
                    <Icon
                      size={48}
                      className={
                        serviceType === value
                          ? 'text-primary'
                          : 'text-on-surface-variant'
                      }
                    />
                    <span
                      className={`font-bold text-lg ${
                        serviceType === value
                          ? 'text-primary'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Step 2: Select vehicle */}
          {step === 2 && (
            <section className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-on-surface mb-2">
                  Select Vehicle
                </h2>
                <p className="text-lg text-on-surface-variant">
                  Which vehicle needs assistance?
                </p>
              </div>

              {loading ? (
                <p className="text-on-surface-variant">
                  Loading vehicles...
                </p>
              ) : (
                <div className="space-y-4">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle._id}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        setSelectedVehicle(vehicle._id)
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key === 'Enter' ||
                          event.key === ' '
                        ) {
                          event.preventDefault();
                          setSelectedVehicle(vehicle._id);
                        }
                      }}
                      className={`p-5 rounded-2xl flex items-center gap-5 cursor-pointer transition-all duration-300 ${
                        selectedVehicle === vehicle._id
                          ? 'bg-primary/10 border-2 border-primary shadow-sm'
                          : 'bg-surface border border-outline-variant hover:border-primary/50 hover:bg-surface-variant'
                      }`}
                    >
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          selectedVehicle === vehicle._id
                            ? 'bg-primary text-white'
                            : 'bg-surface-variant border border-outline-variant text-on-surface-variant'
                        }`}
                      >
                        <Truck size={24} />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-on-surface text-lg">
                          {vehicle.year} {vehicle.brand}{' '}
                          {vehicle.model}
                        </h3>
                        <p className="text-sm text-on-surface-variant mt-1">
                          {vehicle.color} •{' '}
                          <span className="uppercase tracking-wider font-bold">
                            {vehicle.licensePlate}
                          </span>
                        </p>
                      </div>

                      {selectedVehicle === vehicle._id ? (
                        <CheckCircle2
                          className="text-primary"
                          size={28}
                        />
                      ) : (
                        <div className="w-7 h-7 border-2 border-outline-variant rounded-full" />
                      )}
                    </div>
                  ))}

                  {vehicles.length === 0 && (
                    <p className="text-on-surface-variant">
                      No vehicles found. Add a vehicle to continue.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate('/vehicles')}
                    className="w-full py-5 border border-dashed border-outline-variant rounded-2xl text-on-surface-variant font-bold flex items-center justify-center gap-3 hover:bg-surface-variant hover:text-on-surface transition-all"
                  >
                    <Plus size={20} />
                    Add New Vehicle
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <section className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-on-surface mb-2">
                  Confirm Location
                </h2>
                <p className="text-lg text-on-surface-variant">
                  Pinpoint where you are stranded.
                </p>
              </div>

              <div className="space-y-6">
                {/* Map view */}
                {coords.latitude != null &&
                  coords.longitude != null && (
                    <div className="space-y-3">
                      <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden border border-outline-variant shadow-sm bg-surface-variant/50 relative">
                        <iframe
                          title="Location Map"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://maps.google.com/maps?q=${coords.latitude},${coords.longitude}&z=15&output=embed`}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleGetAddress}
                        disabled={isLoadingAddress}
                        className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg font-bold text-sm hover:bg-primary/20 transition-all disabled:opacity-50"
                      >
                        {isLoadingAddress
                          ? 'Fetching Address...'
                          : 'Use Map Location as Address'}
                      </button>
                    </div>
                  )}

                <div className="space-y-2">
                  <label
                    htmlFor="current-address"
                    className="font-bold text-on-surface-variant text-sm"
                  >
                    Current Address
                  </label>
                  <input
                    id="current-address"
                    className="w-full h-14 px-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant"
                    placeholder="Enter your address"
                    type="text"
                    value={address}
                    onChange={(event) =>
                      setAddress(event.target.value)
                    }
                  />

                  {coords.latitude != null &&
                  coords.longitude != null ? (
                    <p className="text-sm text-success font-bold mt-2 flex items-center gap-1">
                      <span>📍</span>
                      Location detected automatically
                    </p>
                  ) : (
                    <p className="text-sm text-error font-bold mt-2 flex items-center gap-1">
                      <span>⚠</span>
                      Location not detected — please allow location access
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="issue-description"
                    className="font-bold text-on-surface-variant text-sm"
                  >
                    Describe the issue
                  </label>
                  <textarea
                    id="issue-description"
                    className="w-full p-4 bg-background border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant resize-none"
                    rows={4}
                    placeholder="e.g. Car won't start, flat tire on rear left..."
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                  />
                </div>
              </div>
            </section>
          )}

          {/* Step 4: Summary */}
          {step === 4 && (
            <section className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-on-surface mb-2">
                  Summary &amp; Confirm
                </h2>
                <p className="text-lg text-on-surface-variant">
                  Review your request details.
                </p>
              </div>

              <div className="bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 space-y-8 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start border-b border-outline-variant pb-6">
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      Service
                    </p>

                    <p className="text-2xl font-extrabold text-on-surface capitalize flex items-center gap-3">
                      <span className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-lg">
                        {(() => {
                          const SelectedIcon =
                            SERVICE_TYPES.find(
                              (service) =>
                                service.value === serviceType
                            )?.icon;

                          return SelectedIcon ? (
                            <SelectedIcon size={24} />
                          ) : null;
                        })()}
                      </span>
                      {serviceType}
                    </p>
                  </div>

                  <span className="bg-error/10 text-error px-4 py-1.5 rounded-full text-xs font-bold border border-error/20">
                    Urgent
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      Vehicle
                    </p>
                    <p className="text-lg font-bold text-on-surface">
                      {selectedVehicleObj
                        ? `${selectedVehicleObj.brand} ${selectedVehicleObj.model}`
                        : '—'}
                    </p>

                    {selectedVehicleObj && (
                      <p className="text-sm text-on-surface-variant font-bold mt-1 uppercase tracking-wider">
                        {selectedVehicleObj.licensePlate}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      Location
                    </p>
                    <p className="text-lg font-bold text-primary flex items-start gap-2">
                      <span className="mt-1">📍</span>
                      <span>{address || '—'}</span>
                    </p>
                  </div>
                </div>

                {description && (
                  <div className="pt-6 border-t border-outline-variant">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                      Description
                    </p>
                    <p className="text-on-surface font-medium italic">
                      &quot;{description}&quot;
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Action buttons */}
          <div className="pt-8 flex flex-col gap-4 max-w-sm mx-auto md:max-w-none md:flex-row-reverse pb-12">
            <button
              type="button"
              onClick={handleNext}
              disabled={submitting}
              className="flex-1 min-h-[60px] bg-primary text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center"
            >
              {step === totalSteps
                ? submitting
                  ? 'Submitting...'
                  : 'Confirm Request'
                : 'Continue'}
            </button>

            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={submitting}
                className="flex-1 min-h-[60px] bg-surface-variant border border-outline-variant text-on-surface-variant font-bold rounded-xl hover:bg-surface-variant/80 hover:text-on-surface transition-all flex items-center justify-center"
              >
                Go Back
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default RequestServicePage;