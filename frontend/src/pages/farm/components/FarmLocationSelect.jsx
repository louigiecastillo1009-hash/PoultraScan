import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MdExpandMore, MdExpandLess, MdClose, MdRefresh } from 'react-icons/md';

// Styling constants kept identical to the existing form inputs and labels
// in EditFarmModal so the selector feels native to the form.
const TRIGGER_CLASSES = `
  w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border
  text-sm text-left transition-all bg-white
  focus:outline-none focus:ring-2 focus:ring-[#14532D]/30
`;
const TRIGGER_ENABLED = 'border-[#E4ECE7] hover:border-[#C9E8D9] text-[#10231A]';
const TRIGGER_DISABLED = 'border-[#E4ECE7] bg-[#F7FAF8] text-[#718279] cursor-not-allowed';

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
 * never be clipped by the scrollable Create/Edit Farm modal.
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
    const width = rect.width;
    const spaceBelow = window.innerHeight - rect.bottom;
    const above = spaceBelow < MENU_MAX_HEIGHT && rect.top > spaceBelow;
    const maxHeight = Math.min(
      MENU_MAX_HEIGHT,
      Math.max(160, above ? rect.top - 12 : spaceBelow - 12)
    );
    setMenuStyle({
      position: 'fixed',
      left: rect.left,
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
    // Follow scroll/resize so a fixed menu cannot drift from its trigger.
    const reposition = () => positionMenu();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
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
    <div className="flex flex-col gap-1.5 min-w-0">
      <span className="text-xs font-semibold text-[#4B6357]">{label}</span>

      {error ? (
        <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-[#FECACA] bg-white text-sm text-[#EF4444] font-medium">
          <span className="truncate">{error}</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-[#14532D] hover:underline flex-shrink-0"
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
          className={`${TRIGGER_CLASSES} ${disabled ? TRIGGER_DISABLED : TRIGGER_ENABLED} ${
            open ? 'ring-2 ring-[#14532D]/30 border-[#14532D]' : ''
          }`}
        >
          <span className="truncate">
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
                className="text-[#718279] hover:text-[#EF4444] hover:bg-[#F7FAF8] rounded-full p-0.5 flex-shrink-0 transition-colors"
              >
                <MdClose className="text-sm" />
              </span>
            ) : (
              open ? <MdExpandLess className="text-lg flex-shrink-0" /> : <MdExpandMore className="text-lg flex-shrink-0" />
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
            className="z-[70] flex flex-col overflow-hidden rounded-xl border border-[#E4ECE7] bg-white shadow-lg shadow-[#14532D]/10 animate-[150ms_ease-out]"
          >
            <div className="p-2 border-b border-[#E4ECE7] sticky top-0 bg-white">
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
                placeholder={`Search for ${label.toLowerCase()}...`}
                className="w-full px-3 py-2 rounded-lg bg-[#F7FAF8] border border-[#E4ECE7] text-sm text-[#10231A] placeholder-[#718279] focus:outline-none focus:border-[#14532D] transition-colors"
              />
            </div>

            <div ref={listRef} className="overflow-y-auto py-1">
              {loading && !error && (
                <div className="px-4 py-3 text-sm text-[#718279] flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#E4ECE7] border-t-[#14532D] rounded-full animate-spin" />
                  {loadingMessage}
                </div>
              )}

              {!loading && !error && filtered.length === 0 && (
                <div className="px-4 py-3 text-sm text-[#718279]">
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
                      className={`w-full text-left px-4 py-2 text-sm transition-colors truncate ${
                        selected
                          ? 'bg-[#E9F4EE] text-[#14532D] font-semibold'
                          : active
                            ? 'bg-[#F7FAF8] text-[#10231A]'
                            : 'text-[#10231A]'
                      }`}
                    >
                      {option.name}
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
