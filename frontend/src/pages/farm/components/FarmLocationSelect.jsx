import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MdExpandMore,
  MdExpandLess,
  MdClose,
  MdRefresh,
  MdCheck,
} from 'react-icons/md';

const TRIGGER_CLASSES =
  'no-focus-ring flex h-11 w-full items-center justify-between gap-2 rounded-xl border bg-paper px-3.5 text-left text-sm transition-colors focus:outline-none';
const TRIGGER_ENABLED =
  'border-line text-ink hover:border-line-strong focus:border-sage';
const TRIGGER_DISABLED =
  'border-line bg-cream-deep text-muted cursor-not-allowed';

const MENU_MAX_HEIGHT = 280;

/**
 * Searchable single-select dropdown, used for the PSGC location levels.
 *
 * Props:
 *  - label            Label text (plain <label>, not htmlFor — trigger is focused instead)
 *  - placeholder      Shown when no value selected
 *  - options          [{ code, name }]
 *  - value            Selected option object or null
 *  - onSelect(option) Call with the option, or with null to clear
 *  - loading          Show a loading state inside the menu
 *  - error            Error message string; shows a Retry button
 *  - onRetry          Called when the user clicks Retry
 *  - disabled         Disable the trigger (parent missing/level loading)
 *  - notApplicable    Level exists but has no options for the chosen parent (e.g. province in NCR)
 *  - loadingMessage   e.g. "Loading provinces..."
 *
 * The dropdown is rendered in a portal with fixed positioning so it can
 * never be clipped by the scrollable Create/Edit Farm modal. On phones the
 * available height is measured against the visual viewport, so opening the
 * keyboard while searching cannot push the list behind it.
 */
export default function FarmLocationSelect({
  label,
  placeholder,
  options,
  value,
  onSelect,
  loading = false,
  error = null,
  onRetry = null,
  disabled = false,
  notApplicable = false,
  loadingMessage = 'Loading...',
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuStyle, setMenuStyle] = useState(null);

  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const listRef = useRef(null);

  // Reset the search box each time the menu opens, or when options change
  // while it is open (parent changed and the user re-opens).
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options ?? [];
    return (options ?? []).filter((o) => o.name.toLowerCase().includes(q));
  }, [options, query]);

  // Ensure the actively-highlighted option stays scrolled into view.
  useLayoutEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open, filtered.length]);

  function positionMenu() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const viewport = window.visualViewport;
    const viewportHeight = viewport?.height ?? window.innerHeight;
    const viewportWidth = viewport?.width ?? window.innerWidth;
    const gutter = 8;

    const width = Math.min(rect.width, viewportWidth - gutter * 2);
    const left = Math.min(
      Math.max(gutter, rect.left),
      viewportWidth - width - gutter
    );

    const spaceBelow = viewportHeight - rect.bottom - gutter;
    const spaceAbove = rect.top - gutter;
    const above = spaceBelow < 220 && spaceAbove > spaceBelow;
    const available = above ? spaceAbove : spaceBelow;
    const maxHeight = Math.max(
      140,
      Math.min(MENU_MAX_HEIGHT, available, viewportHeight * 0.45)
    );

    setMenuStyle({
      position: 'fixed',
      left,
      width,
      maxHeight,
      ...(above
        ? { bottom: window.innerHeight - rect.top + 6 }
        : { top: rect.bottom + 6 }),
    });
  }

  useLayoutEffect(() => {
    if (!open) return undefined;
    positionMenu();
    // Follow page scroll, viewport resize, and the mobile keyboard opening.
    const reposition = () => positionMenu();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    window.visualViewport?.addEventListener('resize', reposition);
    window.visualViewport?.addEventListener('scroll', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
      window.visualViewport?.removeEventListener('resize', reposition);
      window.visualViewport?.removeEventListener('scroll', reposition);
    };
  }, [open]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return undefined;
    const handlePointer = (e) => {
      if (
        triggerRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('touchstart', handlePointer);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('touchstart', handlePointer);
    };
  }, [open]);

  if (notApplicable) {
    return null; // e.g. province level in NCR — level simply disappears.
  }

  function toggleOpen() {
    if (disabled) return;
    setOpen((prev) => !prev);
  }

  function handleSelect(option) {
    onSelect(option);
    setOpen(false);
    setQuery('');
  }

  const showValue = !loading && !error && value;

  // Keep focus inside the search box while navigating with arrows.
  function handleSearchKey(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (filtered.length === 0) return;
      const delta = e.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((i) => (i + delta + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeIndex]) handleSelect(filtered[activeIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    }
  }

  function handleTriggerKey(e) {
    if (disabled) return;
    if (e.key === 'Escape' && open) {
      e.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-olive">{label}</span>

      {error ? (
        <div className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-[#E9C4BE] bg-critical-soft px-3 text-[12px] font-medium text-critical">
          <span className="truncate">{error}</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex shrink-0 items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-sage-dark hover:underline"
            >
              <MdRefresh className="text-base" />
              Retry
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          ref={triggerRef}
          onClick={toggleOpen}
          onKeyDown={handleTriggerKey}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`${TRIGGER_CLASSES} ${
            disabled ? TRIGGER_DISABLED : TRIGGER_ENABLED
          } ${open ? 'border-sage' : ''}`}
        >
          <span className={`truncate ${showValue ? 'font-medium' : ''}`}>
            {loading
              ? loadingMessage
              : showValue
                ? value.name
                : placeholder}
          </span>
          {!disabled && (
            showValue ? (
              <span
                role="button"
                tabIndex={0}
                aria-label={`Clear ${label.toLowerCase()} selection`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    e.preventDefault();
                    onSelect(null);
                  }
                }}
                className="-mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-cream-deep hover:text-critical"
              >
                <MdClose className="text-sm" />
              </span>
            ) : open ? (
              <MdExpandLess className="shrink-0 text-lg" />
            ) : (
              <MdExpandMore className="shrink-0 text-lg" />
            )
          )}
        </button>
      )}

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            aria-label={label}
            style={{ ...menuStyle }}
            className="z-[80] flex flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-pop"
          >
            <div className="sticky top-0 border-b border-ink/10 bg-paper p-2">
              <input
                ref={searchRef}
                autoFocus
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleSearchKey}
                disabled={loading || !!error}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="h-10 w-full rounded-xl border border-line bg-cream-deep px-3 text-[16px] text-ink placeholder:text-muted transition-colors focus:border-sage sm:text-sm"
              />
            </div>

            <div ref={listRef} className="overflow-y-auto py-1">
              {loading && !error && (
                <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-line border-t-sage-dark" />
                  {loadingMessage}
                </div>
              )}

              {!loading && !error && filtered.length === 0 && (
                <div className="px-4 py-3 text-sm text-muted">
                  {query.trim()
                    ? 'No matching locations found'
                    : options?.length
                      ? 'No options available'
                      : emptyPlaceholder(loadingMessage)}
                </div>
              )}

              {!loading &&
                !error &&
                filtered.map((option, i) => {
                  const selected = value?.code === option.code;
                  const active = i === activeIndex;
                  return (
                    <button
                      key={option.code}
                      type="button"
                      data-index={i}
                      role="option"
                      aria-selected={selected}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => handleSelect(option)}
                      className={`flex min-h-11 w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                        selected
                          ? 'bg-sage-soft font-semibold text-sage-dark'
                          : active
                            ? 'bg-cream-deep text-ink'
                            : 'text-ink'
                      }`}
                    >
                      <span className="truncate">{option.name}</span>
                      {selected && <MdCheck className="shrink-0 text-base" />}
                    </button>
                  );
                })}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

function emptyPlaceholder(loadingMessage) {
  const subject = loadingMessage.replace(/^Loading /, '').replace(/\.\.\.$/, '');
  return subject ? `No ${subject} available` : 'No options available';
}
