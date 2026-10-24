import { useState } from 'react';
import { MdDelete, MdHourglassEmpty, MdVisibility } from 'react-icons/md';

import { Button } from '../../../components/index';
import { formatDateTime } from '../../../utils/formatDateTime';
import { thumbnailSrc } from '../../../utils/thumbnailSrc';
import { ConfirmDeleteModal, HealthBreakdown, MarketReadyBar, StatusBadge } from './index';

export default function ScanCard({ scan, onDelete, onView }) {
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
      <div className="flex gap-3 rounded-2xl border border-ink/10 bg-paper p-4 shadow-card">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-cream-deep">
          {src ? (
            <img className="h-full w-full object-cover" src={src} alt="" />
          ) : (
            <MdHourglassEmpty className="animate-pulse text-xl text-muted" aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 max-w-full">
              <p className="truncate text-[13px] font-semibold text-ink">{scan.farm_name}</p>
              <p className="truncate text-[10.5px] text-muted">
                {scan.location} · {date}, {time}
              </p>
            </div>
            <div className="flex-shrink-0">
              <StatusBadge status={scan.status} />
            </div>
          </div>

          <HealthBreakdown
            healthy={scan.healthy_count}
            diseased={scan.diseased_count}
            total={scan.total_detected}
          />

          <div className="mt-2">
            <MarketReadyBar ready={scan.market_ready_count} total={scan.total_detected} />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => onView(scan)}
              disabled={scan.status === 'PROCESSING'}
            >
              <MdVisibility className="text-sm" aria-hidden="true" />
              View
            </Button>
            <Button
              variant="danger-ghost"
              size="sm"
              className="flex-1"
              onClick={() => setConfirmOpen(true)}
            >
              <MdDelete className="text-sm" aria-hidden="true" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </>
  );
}
