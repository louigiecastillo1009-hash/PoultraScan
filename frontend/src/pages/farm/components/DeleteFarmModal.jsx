import { MdDeleteOutline, MdWarningAmber } from 'react-icons/md';

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
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[12px] font-medium leading-relaxed text-[#B42318]"
            >
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-xl border border-[#DFE6E0] bg-white px-4 text-sm font-semibold text-[#56665C] transition-colors hover:bg-[#ECF1ED] hover:text-[#1B2922] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A38]/35"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={deleting}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#B42318] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(180,35,24,0.7)] transition-colors hover:bg-[#912018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B42318]/35 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                  Deleting...
                </>
              ) : (
                'Delete farm'
              )}
            </button>
          </div>
        </div>
      }
    >
      <div className="rounded-xl border border-[#FAD8D4] bg-[#FEF3F2] p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FEE4E2] text-[#B42318]">
            <MdWarningAmber className="text-lg" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#B42318]">
              Delete “{farmName}”?
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-[#8A3A32]">
              This cannot be undone. All scan history tied to this farm will no
              longer be accessible.
            </p>
          </div>
        </div>
      </div>
    </FarmModalShell>
  );
}
