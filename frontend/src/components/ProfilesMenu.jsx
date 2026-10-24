import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPerson, MdLogout } from 'react-icons/md';

import { useProfile } from '../pages/profile/hooks/useProfile';
import { ProfileAPI } from '../pages/profile/api/profileApi';
import { MiniAvatar } from './index';

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const { user, loading } = useProfile();

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewProfile = () => {
    setOpen(false);
    navigate('/profile');
  };

  const handleLogout = async () => {
    setOpen(false);
    setLoggingOut(true);
    try {
      await ProfileAPI.logout();
    } catch (err) {
      console.error('Logout failed:', err.message);
      // even if the API call fails, we still clear the client-side session below
    } finally {
      setLoggingOut(false);
      navigate('/login');
    }
  };

  const profileItems = [
    { id: 'profile', label: 'View profile', icon: MdPerson, onClick: handleViewProfile },
    { id: 'logout', label: 'Log out', icon: MdLogout, onClick: handleLogout },
  ];

  const displayName = loading ? '...' : user?.fullname || 'Farm Manager';
  const displayEmail = loading ? '' : user?.email || '';

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
          aria-label="Profile menu"
          aria-expanded={open}
          disabled={loggingOut}
          className="h-9 w-9 rounded-full border border-line bg-paper p-0.5 ring-1 ring-ink/10 transition-all hover:ring-sage/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage/50 disabled:opacity-60"
        >
          <MiniAvatar fullname={user?.fullname} avatarUrl={user?.avatar_url} sizeClass="h-full w-full" />
        </button>

        {open && (
          <div className="fixed left-3 right-3 top-[calc(env(safe-area-inset-top)+4.25rem)] z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-line bg-paper shadow-pop animate-menu-pop sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:max-h-none sm:w-60">
            <div className="flex items-center gap-3 border-b border-line bg-cream-deep/40 px-4 py-3.5">
              <MiniAvatar
                fullname={user?.fullname}
                avatarUrl={user?.avatar_url}
                sizeClass="h-9 w-9 border-2 border-paper ring-1 ring-line"
              />
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-xs font-bold text-ink">{displayName}</span>
                <span className="truncate text-[10px] text-muted">{displayEmail}</span>
              </div>
            </div>
            <div className="p-1.5">
              {profileItems.map(({ id, label, icon: Icon, onClick }) => (
                <button
                  key={id}
                  type="button"
                  onClick={onClick}
                  disabled={loggingOut}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors disabled:opacity-60 ${
                    id === 'logout'
                      ? 'text-critical hover:bg-critical-soft'
                      : 'text-ink hover:bg-cream-deep'
                  }`}
                >
                  <Icon className="text-base opacity-70" aria-hidden="true" />
                  <span className="text-xs font-semibold">
                    {id === 'logout' && loggingOut ? 'Logging out...' : label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
