import { useState } from 'react';
import { MdDelete, MdHourglassEmpty, MdVisibility } from 'react-icons/md';

import { thumbnailSrc } from '../../../utils/thumbnailSrc';
import { formatDateTime } from '../../../utils/formatDateTime';
import { ConfirmDeleteModal, HealthBreakdown, MarketReadyBar, StatusBadge } from './index';

export default function ScanRow({ scan, onDelete, onView }) {
  const { date, time } = formatDateTime(scan.started_at);
  const src = thumbnailSrc(scan.thumbnail_url);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    await onDelete(scan.summary_id);
    setDeleting(false);
    setConfirmOpen(false);
  };

  return (
    <>
      <tr className="group transition-colors hover:bg-cream-deep/40">
        <td className="py-4 pl-2">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-cream-deep">
            {src ? (
              <img className="h-full w-full object-cover" src={src} alt="" />
            ) : (
              <MdHourglassEmpty className="animate-pulse text-lg text-muted" aria-hidden="true" />
            )}
          </div>
        </td>
        <td className="whitespace-nowrap px-3 py-4">
          <p className="text-[12.5px] font-semibold text-ink">{date}</p>
          <p className="text-[10.5px] text-muted">{time}</p>
        </td>
        <td className="max-w-[170px] px-3 py-4">
          <p className="truncate text-[12.5px] font-semibold text-ink">{scan.farm_name}</p>
          <p className="truncate text-[10.5px] text-muted">{scan.location}</p>
        </td>
        <td className="px-3 py-4">
          <HealthBreakdown
            healthy={scan.healthy_count}
            diseased={scan.diseased_count}
            total={scan.total_detected}
          />
        </td>
        <td className="px-3 py-4">
          <MarketReadyBar ready={scan.market_ready_count} total={scan.total_detected} />
        </td>
        <td className="whitespace-nowrap px-3 py-4">
          <StatusBadge status={scan.status} />
        </td>
        <td className="py-4 pr-2 text-right">
          <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onView(scan)}
              disabled={scan.status === 'PROCESSING'}
              aria-label={`View scan for ${scan.farm_name}`}
              className="rounded-full p-2 text-soft transition-colors hover:bg-cream-deep hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              <MdVisibility className="text-lg" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              aria-label={`Delete scan for ${scan.farm_name}`}
              className="rounded-full p-2 text-soft transition-colors hover:bg-critical-soft hover:text-critical"
            >
              <MdDelete className="text-lg" aria-hidden="true" />
            </button>
          </div>
        </td>
      </tr>

      <ConfirmDeleteModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </>
  );
}
