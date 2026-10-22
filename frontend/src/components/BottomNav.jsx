import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiPlus } from 'react-icons/hi2';

import { useActiveFarm } from '../context/activeFarmContext';
import { QuickScanModal } from './index';
import { navLinks, navLinksRight } from '../constant/navList';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeFarmId } = useActiveFarm();
  const [quickScanOpen, setQuickScanOpen] = useState(false);

  const isActive = (link) => location.pathname.startsWith(link.path);
  const links = [...navLinks, ...navLinksRight];

  const handleNavClick = (link) => {
    navigate(link.path);
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-28 bg-gradient-to-t from-[#F7FAF8] via-[#F7FAF8]/85 to-transparent md:hidden"
      />

      <nav
        aria-label="Primary navigation"
        className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.625rem)] md:hidden"
      >
        <div className="mx-auto flex w-full max-w-md items-center gap-1 rounded-[1.35rem] border border-[#DFE6E0] bg-white/95 p-1.5 shadow-[0_14px_36px_-12px_rgba(20,40,31,0.32)] backdrop-blur-xl">
          {links.map((link) => {
            const { key, label, icon: Icon } = link;
            const active = isActive(link);

            return (
              <button
                key={key}
                onClick={() => handleNavClick(link)}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className={`flex h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl transition-colors duration-150 ${
                  active
                    ? 'bg-[#E6F1EA] text-[#1E4A38]'
                    : 'text-[#7D8B82] active:bg-[#ECF1ED] active:text-[#1B2922]'
                }`}
              >
                <Icon className="text-[20px]" />
                <span
                  className={`text-[10px] leading-none ${
                    active ? 'font-bold' : 'font-medium'
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setQuickScanOpen(true)}
            aria-label="Quick scan"
            className="ml-0.5 flex h-12 w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl bg-[#1E4A38] text-white shadow-[0_8px_20px_-8px_rgba(40,92,69,0.8)] transition-transform active:scale-95"
          >
            <HiPlus className="text-[21px]" />
            <span className="text-[9px] font-semibold leading-none">Scan</span>
          </button>
        </div>
      </nav>

      <QuickScanModal
        isOpen={quickScanOpen}
        onClose={() => setQuickScanOpen(false)}
        farmId={activeFarmId}
      />
    </>
  );
}
