import { useState, useRef, useEffect } from 'react';
import { MdSettings, MdHelpOutline, MdDarkMode, MdLanguage } from 'react-icons/md';

export default function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const settingsItems = [
    { id: 'theme', label: 'Dark Mode', icon: MdDarkMode },
    { id: 'language', label: 'Language', icon: MdLanguage },
    { id: 'help', label: 'Help & Support', icon: MdHelpOutline },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/25 backdrop-blur-[2px] transition-opacity"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className={`relative ${open ? 'z-50' : ''}`} ref={containerRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Settings"
          aria-expanded={open}
          className="rounded-full p-2 text-soft transition-all hover:bg-ink/5 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-sage/40 active:scale-95"
        >
          <MdSettings className="text-xl" aria-hidden="true" />
        </button>

        {open && (
          <div className="fixed left-3 right-3 top-[calc(env(safe-area-inset-top)+4.25rem)] z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-line bg-paper shadow-pop animate-menu-pop sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:max-h-none sm:w-64">
            <div className="border-b border-line px-4 py-3">
              <span className="text-sm font-bold text-ink">Settings</span>
            </div>
            <div className="p-1.5">
              {settingsItems.map(({ id, label, icon: Icon }) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => {
                    console.log(`Settings option clicked: ${label}`);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-cream-deep"
                >
                  <Icon className="text-base text-soft" aria-hidden="true" />
                  <span className="text-xs font-semibold text-ink">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
