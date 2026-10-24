import { useState, useRef, useEffect } from 'react';
import {
  MdNotifications,
  MdClose,
  MdDoneAll,
  MdNotificationsNone,
  MdExpandMore,
  MdExpandLess,
} from 'react-icons/md';

import { useNotifications } from '../hooks/useNotification';
import { PoultraScanLoader } from './ui';

const VISIBLE_LIMIT = 5;

function timeAgo(value) {
  if (!value) return '';
  const diffMs = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);
  const { notifications, unreadCount, loading, error, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) setExpanded(false);
  }, [open]);

  const visibleNotifications = expanded ? notifications : notifications.slice(0, VISIBLE_LIMIT);
  const hasMore = notifications.length > VISIBLE_LIMIT;

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
          aria-label="Notifications"
          aria-expanded={open}
          className="relative rounded-full p-2 text-soft transition-all hover:bg-ink/5 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-sage/40 active:scale-95"
        >
          <MdNotifications className="text-xl" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-ink px-1 text-[9px] font-bold leading-none text-cream ring-2 ring-cream">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="fixed left-3 right-3 top-[calc(env(safe-area-inset-top)+4.25rem)] z-50 flex max-h-[min(70vh,calc(100dvh-9.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-pop animate-menu-pop sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:max-h-[26rem] sm:w-80">
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-line px-4 py-3">
              <div>
                <p className="text-sm font-bold text-ink">Notifications</p>
                <p className="text-[10px] text-muted">
                  {unreadCount > 0 ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'}` : 'You are all caught up'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="rounded-full p-1 text-muted transition-all hover:bg-cream-deep hover:text-ink"
              >
                <MdClose className="text-base" />
              </button>
            </div>

            {/* List */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {loading && (
                <div className="px-4 py-8">
                  <PoultraScanLoader size={32} label="Loading..." />
                </div>
              )}

              {!loading && error && (
                <div className="px-4 py-10 text-center text-xs text-critical">
                  Couldn't load notifications.
                </div>
              )}

              {!loading && !error && notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-muted">
                    <MdNotificationsNone className="text-xl" aria-hidden="true" />
                  </span>
                  <span className="text-xs text-muted">No notifications yet.</span>
                </div>
              )}

              {!loading &&
                !error &&
                visibleNotifications.map((n) => (
                  <button
                    type="button"
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className="flex w-full gap-2.5 border-b border-line px-4 py-3 text-left transition-all last:border-0 hover:bg-cream-deep/55"
                  >
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                        n.is_read ? 'bg-transparent' : 'bg-gold'
                      }`}
                      aria-hidden="true"
                    />
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span
                        className={`text-xs ${
                          n.is_read ? 'font-medium text-soft' : 'font-semibold text-ink'
                        }`}
                      >
                        {n.title}
                      </span>
                      <span className="text-[11px] leading-snug text-soft">{n.message}</span>
                      <span className="mt-0.5 text-[10px] text-muted">{timeAgo(n.created_at)}</span>
                    </div>
                  </button>
                ))}

              {!loading && !error && hasMore && (
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="flex w-full items-center justify-center gap-1.5 border-b border-line py-2.5 text-xs font-semibold text-olive transition-all hover:bg-cream-deep"
                >
                  {expanded ? (
                    <>
                      <MdExpandLess className="text-sm" />
                      <span className="hidden sm:inline">Show less</span>
                    </>
                  ) : (
                    <>
                      <MdExpandMore className="text-sm" />
                      <span className="hidden sm:inline">Show more</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Footer */}
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="flex flex-shrink-0 items-center justify-center gap-1.5 border-t border-line py-2.5 text-xs font-semibold text-olive transition-all hover:bg-cream-deep disabled:cursor-not-allowed disabled:opacity-40"
            >
              <MdDoneAll className="text-sm" />
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </>
  );
}
