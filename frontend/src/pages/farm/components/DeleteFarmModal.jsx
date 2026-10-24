import { MdDeleteOutline, MdWarningAmber } from 'react-icons/md';

import { Button, Notice } from '../../../components/index';
import FarmModalShell from './FarmModalShell';

export default function DeleteFarmModal({
  farmName,
  onClose,
  onConfirm,
  deleting,
  error,
}) {
  return (
    <FarmModalShell
      title="Delete farm"
      description="This action permanently removes the farm profile."
      icon={MdDeleteOutline}
      onClose={onClose}
      size="sm"
      footer={
        <div className="flex flex-col gap-3">
          {error && <Notice tone="error" title={error} />}
          <div className="flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              className="flex-1"
              onClick={onConfirm}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
                    aria-hidden="true"
                  />
                  Deleting...
                </>
              ) : (
                'Delete farm'
              )}
            </Button>
          </div>
        </div>
      }
    >
      <div className="rounded-2xl border border-[#E9C4BE] bg-critical-soft p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F6DDD8] text-critical">
            <MdWarningAmber className="text-lg" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-critical">Delete “{farmName}”?</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#8F1D17]">
              This cannot be undone. All scan history tied to this farm will no longer be
              accessible.
            </p>
          </div>
        </div>
      </div>
    </FarmModalShell>
  );
}
