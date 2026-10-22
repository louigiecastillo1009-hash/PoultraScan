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
  'flex h-11 w-full items-center justify-between gap-2 rounded-xl border bg-white px-3.5 text-left text-sm transition-colors focus:outline-none';
const TRIGGER_ENABLED =
  'border-[#DFE6E0] text-[#1B2922] hover:border-[#B7CABE] focus:border-[#1E4A38]';
const TRIGGER_DISABLED =
  'border-[#DFE6E0] bg-[#ECF1ED] text-[#8F9B93] cursor-not-allowed';

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
      <span className="text-[12px] font-semibold text-[#56665C]">{label}</span>

      {error ? (
        <div className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3 text-[12px] font-medium text-[#B42318]">
          <span className="truncate">{error}</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex shrink-0 items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-[#1E4A38] hover:underline"
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
          } ${open ? 'border-[#1E4A38]' : ''}`}
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
                className="-mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#7D8B82] transition-colors hover:bg-[#ECF1ED] hover:text-[#B42318]"
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
            className="z-[80] flex flex-col overflow-hidden rounded-xl border border-[#DFE6E0] bg-white shadow-[0_18px_45px_-16px_rgba(20,40,31,0.35)]"
          >
            <div className="sticky top-0 border-b border-[#ECF1ED] bg-white p-2">
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
                className="h-10 w-full rounded-lg border border-[#DFE6E0] bg-[#F4F6F2] px-3 text-[16px] text-[#1B2922] placeholder:text-[#8F9B93] transition-colors focus:border-[#1E4A38] sm:text-sm"
              />
            </div>

            <div ref={listRef} className="overflow-y-auto py-1">
              {loading && !error && (
                <div className="flex items-center gap-2 px-4 py-3 text-sm text-[#65746B]">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#D9E3DD] border-t-[#1E4A38]" />
                  {loadingMessage}
                </div>
              )}

              {!loading && !error && filtered.length === 0 && (
                <div className="px-4 py-3 text-sm text-[#65746B]">
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
                          ? 'bg-[#E6F1EA] font-semibold text-[#1E4A38]'
                          : active
                            ? 'bg-[#F4F6F2] text-[#1B2922]'
                            : 'text-[#1B2922]'
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
