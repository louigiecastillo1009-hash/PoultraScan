import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdBiotech, MdCenterFocusStrong } from 'react-icons/md';

import { NotificationsMenu, ProfileMenu } from './index';
import Button from './app/Button';

const navLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Scans', path: '/scan' },
  { label: 'History', path: '/scan/history' },
  { label: 'Farms', path: '/farm' },
];

function getActiveFromPath(pathname) {
  // exact path match first, so '/scan/history' highlights History not Scans
  const exact = navLinks.find((l) => pathname === l.path);
  if (exact) return exact.label;
  // then match nested routes like '/farm/123'
  const match = navLinks.find((l) => pathname.startsWith(`${l.path}/`));
  return match ? match.label : null;
}

function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const active = getActiveFromPath(location.pathname);

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-ink/12 bg-cream/92 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] w-full max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6 md:h-[76px] lg:px-10">
        <Link
          to="/dashboard"
          aria-label="PoultraScan AI dashboard"
          className="flex min-w-0 items-center gap-2.5 rounded-lg active:scale-[0.98]"
        >
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-cream">
            <MdBiotech className="text-[20px]" aria-hidden="true" />
            <span
              className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-cream bg-gold"
              aria-hidden="true"
            />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-display text-[1.25rem] font-semibold leading-none tracking-[-0.025em] text-ink">
              PoultraScan
            </span>
            <span className="mt-1 hidden text-[8px] font-bold uppercase tracking-[0.19em] text-muted sm:block">
              Poultry intelligence
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 rounded-full border border-ink/10 bg-paper/65 p-1 md:flex"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => {
            const isActive = active === link.label;
            return (
              <button
                key={link.label}
                type="button"
                onClick={() => navigate(link.path)}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-full px-4 py-2 text-[12.5px] transition-all duration-200 ${
                  isActive
                    ? 'bg-ink font-semibold text-cream shadow-[0_6px_14px_-10px_rgba(16,17,7,0.9)]'
                    : 'font-semibold text-soft hover:bg-white/70 hover:text-ink'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <div className="hidden md:block">
            <Button as={Link} to="/scan" size="sm" aria-label="Start a new scan">
              <MdCenterFocusStrong className="text-base" aria-hidden="true" />
              New scan
            </Button>
          </div>
          <NotificationsMenu />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

export default TopNav;
