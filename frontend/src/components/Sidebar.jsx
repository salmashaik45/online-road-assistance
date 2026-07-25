import { Link, useLocation } from 'react-router-dom';

function Sidebar({ title = 'RoadAssist Pro', user, items = [], footer }) {
  const location = useLocation();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface-container-low px-4 py-6 lg:flex">
      <div className="mb-stack-gap-lg px-2">
        <h2 className="text-headline-lg font-headline-lg text-primary">{title}</h2>
        {user && (
          <p className="mt-2 text-label-sm font-label-sm text-on-surface-variant">
            {user.name || 'Welcome'}
            {user.role ? ` • ${user.role}` : ''}
          </p>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-label-bold font-label-bold transition-colors ${
                active
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
              }`}
            >
              {Icon && <Icon size={18} />}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {footer && <div className="mt-auto border-t border-outline-variant pt-4">{footer}</div>}
    </aside>
  );
}

export default Sidebar;
