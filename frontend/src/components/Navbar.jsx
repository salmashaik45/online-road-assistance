import { Link, useLocation } from 'react-router-dom';

function Navbar({ title = 'RoadAssist', links = [], rightContent }) {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 z-50 flex h-touch-target-min w-full items-center justify-between border-b border-outline-variant bg-surface/90 px-container-padding backdrop-blur">
      <Link to="/" className="text-headline-lg font-headline-lg tracking-tight text-primary">
        {title}
      </Link>

      {links.length > 0 && (
        <nav className="hidden items-center gap-stack-gap-md md:flex">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`font-label-bold text-label-bold transition-colors ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}

      {rightContent}
    </header>
  );
}

export default Navbar;
