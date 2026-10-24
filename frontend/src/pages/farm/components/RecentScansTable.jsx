import { MdHistory, MdRefresh } from 'react-icons/md';

import { Badge, Button, EmptyState, Notice } from '../../../components/index';
import Surface from '../../../components/app/Surface';
import { PoultraScanLoader } from '../../../components/ui';
import { useRecentScans } from '../hooks/useRecentScan';
import ScanStatusBadge from './ScanStatusBadge';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatScanType(value) {
  if (!value) return '—';
  const label = String(value).replaceAll('_', ' ');
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function RecentScansTable({ farmId }) {
  const { scans, loading, error, refetch } = useRecentScans(farmId);

  return (
    <Surface padding="none" className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <h2 className="font-display text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
            Recent scans
          </h2>
          {!loading && !error && scans.length > 0 && (
            <Badge tone="neutral" size="sm">
              {scans.length} total
            </Badge>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 px-5 py-12">
          <PoultraScanLoader size={40} label="Loading scans..." />
        </div>
      )}

      {error && !loading && (
        <div className="p-5 sm:p-6">
          <Notice
            tone="error"
            title="Could not load recent scans"
            action={
              <Button variant="danger-ghost" size="sm" onClick={refetch}>
                <MdRefresh className="text-base" aria-hidden="true" />
                Try again
              </Button>
            }
          >
            {error}
          </Notice>
        </div>
      )}

      {!loading && !error && scans.length === 0 && (
        <EmptyState
          icon={MdHistory}
          title="No scans recorded yet"
          description="Scan results for this farm will appear here."
          className="m-5 border-0 bg-transparent px-2 py-8 sm:m-6"
        />
      )}

      {!loading && !error && scans.length > 0 && (
        <>
          {/* Mobile records */}
          <div className="divide-y divide-ink/10 md:hidden">
            {scans.map((scan) => (
              <div key={scan.id} className="px-5 py-3.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[12.5px] font-semibold tabular-nums text-ink">#{scan.id}</span>
                  <ScanStatusBadge status={scan.status} />
                </div>

                <p className="mt-1 text-[11.5px] text-muted">{formatScanType(scan.scan_type)}</p>

                <dl className="mt-2.5 grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <dt className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Started</dt>
                    <dd className="mt-0.5 text-[10.5px] leading-snug text-soft">
                      {formatDate(scan.started_at)}
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Finished</dt>
                    <dd className="mt-0.5 text-[10.5px] leading-snug text-soft">
                      {formatDate(scan.finished_at)}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 bg-cream-deep/50 text-left">
                  <th className="px-6 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-olive">ID</th>
                  <th className="px-6 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-olive">Type</th>
                  <th className="px-6 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-olive">Status</th>
                  <th className="px-6 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-olive">Started</th>
                  <th className="px-6 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-olive">Finished</th>
                </tr>
              </thead>
              <tbody>
                {scans.map((scan) => (
                  <tr
                    key={scan.id}
                    className="border-b border-ink/10 transition-colors last:border-0 hover:bg-cream-deep/40"
                  >
                    <td className="px-6 py-3.5 font-semibold tabular-nums text-ink">#{scan.id}</td>
                    <td className="px-6 py-3.5 text-[12.5px] text-soft">{formatScanType(scan.scan_type)}</td>
                    <td className="px-6 py-3.5">
                      <ScanStatusBadge status={scan.status} />
                    </td>
                    <td className="px-6 py-3.5 text-[12px] text-soft">{formatDate(scan.started_at)}</td>
                    <td className="px-6 py-3.5 text-[12px] text-soft">{formatDate(scan.finished_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Surface>
  );
}
