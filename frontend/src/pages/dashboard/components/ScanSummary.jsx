import { useNavigate } from 'react-router-dom';
import { MdCenterFocusStrong, MdAgriculture, MdArrowForward } from 'react-icons/md';

import Badge from '../../../components/app/Badge';
import EmptyState from '../../../components/app/EmptyState';
import Surface from '../../../components/app/Surface';
import { thumbnailSrc } from '../../../utils/thumbnailSrc';

const statusStyles = {
  COMPLETED: { tone: 'success', label: 'Completed' },
  PROCESSING: { tone: 'warning', label: 'Processing' },
  FAILED: { tone: 'danger', label: 'Failed' },
};

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function ScanSummary({ recentScans = [] }) {
  const navigate = useNavigate();

  return (
    <Surface padding="none" className="flex flex-col overflow-hidden lg:col-span-8">
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-4 sm:px-6">
        <div>
          <h2 className="font-display text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
            Recent scans
          </h2>
          <p className="mt-0.5 text-[10.5px] text-muted">Latest activity across your farms</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/scan/history')}
          className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.12em] text-olive transition-colors hover:text-ink"
        >
          View all
          <MdArrowForward className="text-sm" aria-hidden="true" />
        </button>
      </div>

      {recentScans.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-5 sm:p-6">
          <EmptyState
            icon={MdCenterFocusStrong}
            title="No scans yet"
            description="Run your first scan to see flock results here."
            className="w-full border-0 bg-transparent px-2 py-8"
          />
        </div>
      ) : (
        <ul className="max-h-[400px] divide-y divide-ink/8 overflow-y-auto">
          {recentScans.map((scan) => {
            const status = statusStyles[scan.status] || statusStyles.PROCESSING;
            return (
              <li
                key={scan.summary_id}
                className="flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-cream-deep/45 sm:px-6"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-cream-deep">
                  {scan.thumbnail_url ? (
                    <img
                      src={thumbnailSrc(scan.thumbnail_url)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <MdAgriculture className="text-lg text-olive" aria-hidden="true" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-[12.5px] font-semibold text-ink">{scan.farm_name}</p>
                    <Badge tone={status.tone} size="sm">
                      {status.label}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[10.5px] text-muted">
                    {formatDate(scan.started_at)} · {scan.total_detected ?? 0} chickens
                    {scan.diseased_count > 0 && (
                      <span className="font-medium text-critical"> · {scan.diseased_count} flagged</span>
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/farm/${scan.farm_id}`)}
                  aria-label={`Open ${scan.farm_name}`}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-line bg-paper text-olive transition-colors hover:border-ink hover:bg-ink hover:text-cream"
                >
                  <MdArrowForward className="text-base" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Surface>
  );
}
