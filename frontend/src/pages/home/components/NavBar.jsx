import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdBiotech, MdMenu, MdClose, MdArrowForward } from 'react-icons/md';

export default function NavBar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Results', href: '#results' },
  ];

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const goTo = (path) => {
    closeMobile();
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#DDE2E4]/80 bg-[#ECEDF1]/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] w-full max-w-[1280px] items-center justify-between px-4 sm:h-[76px] sm:px-6 lg:px-8">
        <a
          href="/home"
          className="flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#41B05E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#ECEDF1]"
          aria-label="PoultraScan home"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#028915] text-white shadow-[0_8px_18px_-10px_rgba(2,137,21,0.8)]">
            <MdBiotech className="text-[19px]" aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate text-[17px] font-extrabold tracking-[-0.035em] text-[#0B0B0D]">
              PoultraScan
            </span>
            <span className="mt-1 hidden text-[8px] font-bold uppercase tracking-[0.16em] text-[#7B837E] sm:block">
              AI flock diagnostics
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-[13.5px] font-semibold text-[#4A4748] transition-colors duration-150 hover:bg-white/70 hover:text-[#0B0B0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#41B05E] focus-visible:ring-offset-2"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="rounded-lg px-3 py-2 text-[13.5px] font-bold text-[#0B0B0D] transition-colors duration-150 hover:text-[#028915] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#41B05E] focus-visible:ring-offset-2"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="ps-btn ps-btn-primary ps-btn-sm"
          >
            Get started
            <MdArrowForward className="text-base" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D7DCDE] bg-white/60 text-[#0B0B0D] transition-colors duration-150 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#41B05E] focus-visible:ring-offset-2 md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="home-mobile-menu"
        >
          {mobileOpen ? (
            <MdClose className="text-[22px]" aria-hidden="true" />
          ) : (
            <MdMenu className="text-[22px]" aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div
          id="home-mobile-menu"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4.25rem)] overflow-y-auto border-b border-[#DDE2E4] bg-[#F7F8F6] shadow-[0_24px_50px_-28px_rgba(11,18,13,0.4)] md:hidden"
        >
          <nav className="mx-auto w-full max-w-[1280px] px-4 py-3 sm:px-6" aria-label="Mobile navigation">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMobile}
                className="flex items-center justify-between border-b border-[#E5E8E9] py-3.5 text-[15px] font-semibold text-[#0B0B0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#41B05E] focus-visible:ring-offset-2"
              >
                {link.label}
                <MdArrowForward className="text-base text-[#7B837E]" aria-hidden="true" />
              </a>
            ))}

            <div className="grid grid-cols-2 gap-2.5 pt-4">
              <button
                type="button"
                onClick={() => goTo('/login')}
                className="ps-btn ps-btn-secondary"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => goTo('/register')}
                className="ps-btn ps-btn-primary"
              >
                Get started
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
