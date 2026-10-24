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

  return (
    <>
      <div
        aria-hidden="true"
        className="app-scroll-fade pointer-events-none fixed inset-x-0 bottom-0 z-40 h-28 md:hidden"
      />

      <nav
        aria-label="Primary navigation"
        className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.625rem)] md:hidden"
      >
        <div className="mx-auto flex w-full max-w-md items-center gap-1 rounded-[1.35rem] border border-line bg-paper/95 p-1.5 shadow-[0_18px_42px_-18px_rgba(16,17,7,0.42)] backdrop-blur-xl">
          {links.map((link) => {
            const { key, label, icon: Icon } = link;
            const active = isActive(link);

            return (
              <button
                key={key}
                type="button"
                onClick={() => navigate(link.path)}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className={`relative flex h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl transition-colors duration-150 ${
                  active
                    ? 'bg-sage-soft text-ink'
                    : 'text-muted active:bg-cream-deep active:text-ink'
                }`}
              >
                <Icon className="text-[20px]" aria-hidden="true" />
                <span className={`text-[10px] leading-none ${active ? 'font-bold' : 'font-medium'}`}>
                  {label}
                </span>
                {active && (
                  <span
                    className="absolute -top-0.5 h-1 w-1 rounded-full bg-gold"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setQuickScanOpen(true)}
            aria-label="Quick scan"
            className="ml-0.5 flex h-12 w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl bg-ink text-cream shadow-[0_8px_20px_-8px_rgba(16,17,7,0.8)] transition-transform active:scale-95"
          >
            <HiPlus className="text-[21px]" aria-hidden="true" />
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
