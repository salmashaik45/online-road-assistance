import { Link } from 'react-router-dom';
import { Search, Wrench, BatteryCharging, KeyRound, Disc, MapPin, Handshake, CheckCircle2, ArrowRight, Star } from 'lucide-react';

function HomePage() {
  return (
    <div className="font-sans text-on-background bg-background min-h-screen overflow-x-hidden">
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-surface/80 backdrop-blur-2xl border-b border-outline-variant shadow-sm transition-all duration-300">
        <Link to="/" className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tighter hover:opacity-90 transition-opacity">
          RoadAssist
        </Link>
        
        <div className="flex items-center gap-8">
          <Link
            to="/login"
            className="bg-gradient-to-r from-primary to-secondary text-on-primary px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_4px_14px_rgba(255,107,53,0.39)] hover:shadow-[0_6px_20px_rgba(255,107,53,0.23)] hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero */}
        <section className="relative w-full overflow-hidden bg-background py-32 px-6 flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 bg-surface/50 backdrop-blur-md text-primary px-4 py-2 rounded-full border border-primary/20 mb-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider">24/7 Emergency Support</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-on-background tracking-tight leading-tight">
              Roadside help that feels <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">instant and reliable.</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto font-medium">
              Fast, dependable roadside assistance for towing, battery issues, flat tires, and fuel delivery whenever you need it.
            </p>
            <div className="flex flex-col gap-4 w-full sm:flex-row justify-center mt-12">
              <Link
                to="/login"
                className="h-14 flex items-center justify-center bg-primary text-on-primary w-full sm:w-64 rounded-full text-lg font-bold shadow-[0_8px_30px_rgba(255,107,53,0.3)] hover:scale-105 transition-all duration-300 active:scale-95"
              >
                REQUEST HELP NOW
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Services */}
        <section className="px-6 pb-24 max-w-5xl mx-auto">
          <div className="bg-surface/80 backdrop-blur-xl p-8 rounded-3xl border border-outline-variant shadow-lg relative z-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-surface-variant/50 to-transparent pointer-events-none" />
            <div className="relative mb-10 z-10">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input
                className="w-full pl-12 pr-4 h-14 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface placeholder-on-surface-variant transition-all shadow-sm"
                placeholder="Search for services (Towing, Battery, Lockout...)"
                type="text"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
              {[
                { icon: Wrench, label: 'Mechanic' },
                { icon: BatteryCharging, label: 'Battery' },
                { icon: KeyRound, label: 'Lockout' },
                { icon: Disc, label: 'Flat Tire' },
              ].map(({ icon: Icon, label }) => (
                <Link
                  to="/login"
                  key={label}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl bg-surface border border-outline-variant hover:border-primary/50 hover:bg-surface-variant hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
                >
                  <Icon className="text-on-surface-variant group-hover:text-primary mb-4 transition-colors" size={32} />
                  <span className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="px-6 py-24 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-on-background mb-16 text-center">
            How RoadAssist Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: '1. Pin Location', desc: 'Tell us where you are. We use precise GPS to find the nearest available provider.' },
              { icon: Handshake, title: '2. Select Service', desc: 'Choose from towing, fuel delivery, tire changes, or battery jumps instantly.' },
              { icon: CheckCircle2, title: '3. Track & Go', desc: 'Watch your professional arrive in real-time. Rate and pay through the secure app.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-surface backdrop-blur-md border border-outline-variant shadow-sm rounded-3xl p-8 flex flex-col items-center text-center hover:bg-surface-variant transition-colors">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3">{title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-surface-container-low py-24 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2" />
          <div className="max-w-5xl mx-auto relative z-10">
            <h2 className="text-4xl font-bold text-on-background mb-16 text-center">
              Trusted by Drivers Nationwide
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { name: 'Sarah Jenkins', role: 'Sedan Owner', quote: 'My battery died in the middle of a rainstorm at night. RoadAssist had a provider with me in 15 minutes.' },
                { name: 'David Chen', role: 'SUV Owner', quote: 'Fast, professional, and transparent pricing. I knew exactly what I was paying before the truck even arrived.' },
              ].map((t) => (
                <div key={t.name} className="bg-surface backdrop-blur-xl p-8 rounded-3xl border-l-4 border-primary border-t border-r border-b border-outline-variant shadow-md">
                  <div className="flex text-primary mb-6 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-on-surface mb-8 italic leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                      <div className="w-full h-full bg-surface rounded-full" />
                    </div>
                    <div>
                      <div className="font-bold text-on-surface">{t.name}</div>
                      <div className="text-sm text-on-surface-variant">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA for Providers */}
        <section className="px-6 py-32 max-w-4xl mx-auto text-center">
          <div className="p-16 rounded-[3rem] bg-gradient-to-br from-surface to-surface-variant border border-outline-variant shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl font-bold text-on-surface">Are you a service provider?</h2>
              <p className="text-lg text-on-surface-variant max-w-xl mx-auto">
                Join our network of elite professionals and grow your business with high-quality dispatch leads in your area.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-8 py-4 rounded-full font-bold hover:bg-secondary/90 transition-colors shadow-lg hover:scale-105"
              >
                BECOME A PARTNER <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 flex flex-col items-center gap-6 bg-surface-container-lowest border-t border-outline-variant">
        <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">RoadAssist</div>
        <p className="text-sm text-on-surface-variant">
          © 2026 RoadAssist. Emergency Support 24/7.
        </p>
      </footer>
    </div>
  );
}

export default HomePage;