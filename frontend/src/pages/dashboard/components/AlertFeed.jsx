import { MdOutlineNotificationsNone } from 'react-icons/md';

import Surface from '../../../components/app/Surface';

const typeStyles = {
  anomaly: {
    tile: 'bg-critical-soft text-critical',
    dot: 'bg-critical',
  },
  completed: {
    tile: 'bg-sage-soft text-sage-dark',
    dot: 'bg-sage-dark',
  },
};

function timeAgo(value) {
  if (!value) return '';
  const diffMs = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export default function AlertFeed({ recentEvents = [] }) {
  return (
    <Surface padding="none" className="flex flex-col overflow-hidden lg:col-span-4">
      <div className="border-b border-ink/10 px-5 py-4 sm:px-6">
        <h2 className="font-display text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
          Alert feed
        </h2>
        <p className="mt-0.5 text-[10.5px] text-muted">Anomalies and completed checks</p>
      </div>

      {recentEvents.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-muted">
            <MdOutlineNotificationsNone className="text-xl" aria-hidden="true" />
          </span>
          <p className="text-[12px] text-muted">No recent activity.</p>
        </div>
      ) : (
        <ul className="max-h-[320px] divide-y divide-ink/8 overflow-y-auto">
          {recentEvents.map((alert, index) => {
            const style = typeStyles[alert.type] || typeStyles.completed;
            return (
              <li
                key={`${alert.created_at || 'event'}-${index}`}
                className="flex gap-3 px-5 py-3.5 transition-colors hover:bg-cream-deep/45 sm:px-6"
              >
                <span
                  className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${style.tile}`}
                >
                  <span className={`h-2 w-2 rounded-full ${style.dot}`} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold leading-snug text-ink">{alert.title}</p>
                  <p className="mt-1 text-[10.5px] text-muted">
                    {alert.farm_name} · {timeAgo(alert.created_at)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Surface>
  );
}
