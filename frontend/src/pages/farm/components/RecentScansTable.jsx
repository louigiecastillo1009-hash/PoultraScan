import { MdHistory, MdRefresh } from 'react-icons/md';

import { ScanStatusBadge } from './index';
import { useRecentScans } from '../hooks/useRecentScan';
import { PoultraScanLoader } from '../../../components/ui';

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
    <section
      aria-labelledby="recent-scans-heading"
      className="overflow-hidden rounded-2xl border border-[#DFE6E0] bg-white shadow-[0_1px_2px_rgba(38,53,47,0.03)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#DFE6E0] px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex min-w-0 items-center gap-2">
          <h2
            id="recent-scans-heading"
            className="text-[15px] font-bold tracking-tight text-[#1B2922] sm:text-base"
          >
            Recent scans
          </h2>
          {!loading && !error && scans.length > 0 && (
            <span className="rounded-full bg-[#ECF1ED] px-2 py-0.5 text-[11px] font-semibold text-[#65746B]">
              {scans.length} total
            </span>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 px-5 py-12">
          <PoultraScanLoader size={40} label="Loading scans..." />
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <p className="text-sm font-medium text-[#B42318]">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#DFE6E0] bg-white px-3.5 text-[13px] font-semibold text-[#1E4A38] transition-colors hover:bg-[#ECF1ED]"
          >
            <MdRefresh className="text-base" />
            Try again
          </button>
        </div>
      )}

      {!loading && !error && scans.length === 0 && (
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECF1ED] text-[#56665C]">
            <MdHistory className="text-2xl" />
          </span>
          <h3 className="mt-3 text-[14px] font-bold text-[#1B2922]">
            No scans recorded yet
          </h3>
          <p className="mt-1 max-w-xs text-[12px] leading-relaxed text-[#65746B]">
            Scan results for this farm will appear here.
          </p>
        </div>
      )}

      {!loading && !error && scans.length > 0 && (
        <>
          {/* Mobile records */}
          <div className="divide-y divide-[#ECF1ED] md:hidden">
            {scans.map((scan) => (
              <div key={scan.id} className="px-4 py-3.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13px] font-bold tabular-nums text-[#1B2922]">
                    #{scan.id}
                  </span>
                  <ScanStatusBadge status={scan.status} />
                </div>

                <p className="mt-1 text-[12px] text-[#65746B]">
                  {formatScanType(scan.scan_type)}
                </p>

                <dl className="mt-2.5 grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7D8B82]">
                      Started
                    </dt>
                    <dd className="mt-0.5 text-[11px] leading-snug text-[#56665C]">
                      {formatDate(scan.started_at)}
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7D8B82]">
                      Finished
                    </dt>
                    <dd className="mt-0.5 text-[11px] leading-snug text-[#56665C]">
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
                <tr className="border-b border-[#DFE6E0] bg-[#F4F6F2] text-left">
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#65746B]">
                    ID
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#65746B]">
                    Type
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#65746B]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#65746B]">
                    Started
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#65746B]">
                    Finished
                  </th>
                </tr>
              </thead>
              <tbody>
                {scans.map((scan) => (
                  <tr
                    key={scan.id}
                    className="border-b border-[#ECF1ED] transition-colors last:border-0 hover:bg-[#FBFCFA]"
                  >
                    <td className="px-6 py-3.5 font-semibold tabular-nums text-[#1B2922]">
                      #{scan.id}
                    </td>
                    <td className="px-6 py-3.5 text-[#56665C]">
                      {formatScanType(scan.scan_type)}
                    </td>
                    <td className="px-6 py-3.5">
                      <ScanStatusBadge status={scan.status} />
                    </td>
                    <td className="px-6 py-3.5 text-[13px] text-[#56665C]">
                      {formatDate(scan.started_at)}
                    </td>
                    <td className="px-6 py-3.5 text-[13px] text-[#56665C]">
                      {formatDate(scan.finished_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
