import { useEffect, useId, useRef } from 'react';
import { MdClose } from 'react-icons/md';

/**
 * Shared farm modal surface.
 *
 * On phones it becomes a near-full-screen bottom sheet with a fixed header and
 * footer, so the close button and submit action never scroll out of reach. On
 * larger screens it is a centered dialog. Body scrolling is locked while open.
 */
export default function FarmModalShell({
  title,
  description,
  icon: Icon,
  onClose,
  children,
  footer,
  size = 'md',
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !event.defaultPrevented) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    panelRef.current?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const width = size === 'sm' ? 'sm:max-w-md' : 'sm:max-w-[40rem]';

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#142A20]/45 backdrop-blur-[2px] sm:items-center sm:p-6">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={`flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-[0_24px_70px_-20px_rgba(20,40,31,0.45)] outline-none sm:max-h-[88dvh] sm:rounded-2xl ${width}`}
      >
        <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-[#D9E3DD] sm:hidden" />

        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#DFE6E0] px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            {Icon && (
              <span className="mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6F1EA] text-[#1E4A38] sm:flex">
                <Icon className="text-xl" />
              </span>
            )}
            <div className="min-w-0">
              <h2 id={titleId} className="text-[17px] font-bold tracking-tight text-[#1B2922] sm:text-lg">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="mt-1 text-[12px] leading-relaxed text-[#65746B] sm:text-[13px]">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#65746B] transition-colors hover:bg-[#ECF1ED] hover:text-[#1B2922] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A38]/35"
          >
            <MdClose className="text-xl" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          {children}
        </div>

        {footer && (
          <footer className="shrink-0 border-t border-[#DFE6E0] bg-white px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-6 sm:pb-4">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
