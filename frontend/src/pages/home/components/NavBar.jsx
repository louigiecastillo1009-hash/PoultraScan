import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiMenu, FiX } from 'react-icons/fi';
import { MdBiotech } from 'react-icons/md';

import { useAuth } from '../../../middleware/AuthContext';

const links = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
];

export default function NavBar() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const primaryPath = user ? '/scan' : '/register';
  const primaryLabel = user ? 'Start a scan' : 'Start scanning';

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };

    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const handleDesktop = (event) => {
      if (event.matches) setMobileOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    desktopQuery.addEventListener('change', handleDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      desktopQuery.removeEventListener('change', handleDesktop);
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#101107]/12 bg-[#F4F8E5]/92 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="ps-container flex h-[72px] items-center justify-between gap-4 sm:h-[78px]">
        <Link
          to="/home"
          onClick={closeMobile}
          className="flex min-w-0 items-center gap-2.5 rounded-lg"
          aria-label="PoultraScan home"
        >
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#101107] text-[#F4F8E5]">
            <MdBiotech className="text-[20px]" aria-hidden="true" />
            <span
              className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#F4F8E5] bg-[#B1A03E]"
              aria-hidden="true"
            />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-display text-[1.3rem] font-semibold leading-none tracking-[-0.025em] text-[#101107]">
              PoultraScan
            </span>
            <span className="mt-1 hidden text-[8px] font-bold uppercase tracking-[0.19em] text-[#6B6D57] sm:block">
              Poultry intelligence
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="ps-nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            to={user ? '/dashboard' : '/login'}
            className="text-[13px] font-semibold text-[#3F412F] transition-colors duration-150 hover:text-[#101107]"
          >
            {user ? 'Dashboard' : 'Log in'}
          </Link>
          <Link to={primaryPath} className="ps-btn ps-btn-primary ps-btn-sm">
            {primaryLabel}
            <FiArrowUpRight className="text-[15px]" aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#101107]/20 bg-transparent text-[#101107] transition-colors hover:bg-[#101107]/5 lg:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="home-mobile-menu"
        >
          {mobileOpen ? (
            <FiX className="text-[21px]" aria-hidden="true" />
          ) : (
            <FiMenu className="text-[21px]" aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div
          id="home-mobile-menu"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-b border-[#101107]/12 bg-[#F4F8E5] shadow-[0_28px_50px_-32px_rgba(16,17,7,0.45)] lg:hidden"
        >
          <nav className="ps-container flex flex-col py-3" aria-label="Mobile navigation">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className="flex min-h-[52px] items-center justify-between border-b border-[#101107]/10 text-[15px] font-semibold text-[#101107]"
              >
                {link.label}
                <FiArrowUpRight className="text-[17px] text-[#6B6D57]" aria-hidden="true" />
              </a>
            ))}

            <div className="mt-4 grid gap-2.5 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
              <Link
                to={user ? '/dashboard' : '/login'}
                onClick={closeMobile}
                className="ps-btn ps-btn-outline"
              >
                {user ? 'Open dashboard' : 'Log in'}
              </Link>
              <Link
                to={primaryPath}
                onClick={closeMobile}
                className="ps-btn ps-btn-primary"
              >
                {primaryLabel}
                <FiArrowUpRight className="text-base" aria-hidden="true" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
