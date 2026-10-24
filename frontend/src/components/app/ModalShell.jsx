import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

const sizes = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
};

export default function ModalShell({
  open,
  onClose,
  title,
  description,
  icon,
  eyebrow,
  children,
  footer,
  size = 'md',
  className = '',
  bodyClassName = '',
}) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-ink/45 backdrop-blur-[3px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={`relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[1.75rem] border border-ink/10 bg-paper shadow-modal animate-modal-in sm:rounded-[1.75rem] ${
          sizes[size] || sizes.md
        } ${className}`}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-ink/10 px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            {icon && (
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-cream-deep text-olive">
                {icon}
              </span>
            )}
            <div className="min-w-0">
              {eyebrow && <span className="app-eyebrow mb-1.5 text-[9px]">{eyebrow}</span>}
              <h2 className="font-display text-[1.35rem] font-medium leading-tight tracking-[-0.02em] text-ink">
                {title}
              </h2>
              {description && <p className="mt-1 text-[12px] leading-5 text-muted">{description}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-soft transition-colors hover:border-line-strong hover:bg-cream-deep hover:text-ink"
          >
            <FiX className="text-base" />
          </button>
        </header>

        <div className={`min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 ${bodyClassName}`}>
          {children}
        </div>

        {footer && (
          <footer className="shrink-0 border-t border-ink/10 bg-cream-deep/45 px-5 py-4 sm:px-6">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
}
