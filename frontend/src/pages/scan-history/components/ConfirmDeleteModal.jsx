import { MdWarning } from 'react-icons/md';

import { Button, ModalShell } from '../../../components/index';

export default function ConfirmDeleteModal({ open, onCancel, onConfirm, loading }) {
  return (
    <ModalShell
      open={open}
      onClose={onCancel}
      title="Delete this scan?"
      description="This will permanently remove the scan and its results. This action can't be undone."
      icon={<MdWarning className="text-lg" />}
      size="sm"
      footer={
        <div className="flex gap-3">
          <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            className="flex-1"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
                  aria-hidden="true"
                />
                Deleting...
              </>
            ) : (
              'Delete scan'
            )}
          </Button>
        </div>
      }
    >
      <div className="rounded-2xl border border-[#E9C4BE] bg-critical-soft p-4">
        <p className="text-[12.5px] leading-5 text-[#8F1D17]">
          The scan photo, health counts, and per-chicken results will all be removed from this
          farm&apos;s history.
        </p>
      </div>
    </ModalShell>
  );
}
