import { useNavigate, useLocation } from 'react-router-dom';

import { MdBiotech } from 'react-icons/md';
import { NotificationsMenu, ProfileMenu } from './index';

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
  const match = navLinks.find(
    (l) => pathname.startsWith(`${l.path}/`)
  );
  return match ? match.label : null;
}

function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const active = getActiveFromPath(location.pathname);

  const handleNavClick = (link) => {
    navigate(link.path);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/85 border-b border-[#E4ECE7]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/75">
      <div className="flex justify-between items-center px-4 md:px-8 min-h-16 max-w-[1200px] mx-auto w-full pt-[env(safe-area-inset-top)]">
        <button
          type="button"
          onClick={() => handleNavClick({ path: '/dashboard' })}
          aria-label="PoultraScan AI home"
          className="flex items-center gap-2.5 active:scale-[0.98] transition-transform"
        >
          <span className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#14532D] via-[#166534] to-[#10B981] flex items-center justify-center text-white shadow-md shadow-[#14532D]/30">
            <MdBiotech className="text-lg" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#FACC15] to-[#EAB308] ring-2 ring-white shadow-sm shadow-[#FACC15]/40" />
          </span>
          <span className="hidden lg:inline text-[17px] font-bold text-[#10231A] tracking-tight">
            PoultraScan <span className="text-[#166534] font-extrabold">AI</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-1 items-center p-1 rounded-full bg-[#F0F5F2]">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link)}
              className={`rounded-full px-4 py-1.5 text-sm transition-all duration-200 ${
                active === link.label
                  ? 'font-semibold text-white bg-gradient-to-r from-[#14532D] to-[#166534] shadow-sm shadow-[#14532D]/25'
                  : 'font-medium text-[#4B6357] hover:text-[#10231A] hover:bg-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NotificationsMenu />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

export default TopNav;