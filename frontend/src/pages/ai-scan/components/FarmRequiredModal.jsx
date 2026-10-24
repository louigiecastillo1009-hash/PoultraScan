import { MdAgriculture } from 'react-icons/md';

import { Button, ModalShell } from '../../../components/index';

export default function FarmRequiredModal({ onClose, onNavigate }) {
  return (
    <ModalShell
      open
      onClose={onClose}
      title="Please select a farm"
      description="This farm couldn't be found — it may have been removed."
      icon={<MdAgriculture className="text-lg" />}
      size="sm"
      footer={
        <div className="grid grid-cols-1 gap-2.5">
          <Button type="button" className="w-full" onClick={onNavigate}>
            Go to my farms
          </Button>
          <Button type="button" variant="secondary" className="w-full" onClick={onClose}>
            Cancel
          </Button>
        </div>
      }
    >
      <div className="rounded-2xl border border-ink/10 bg-cream-deep/45 p-4">
        <p className="text-[12.5px] leading-5 text-soft">
          Please select an existing farm or create a new one before scanning. Scan results are
          always saved to the active farm.
        </p>
      </div>
    </ModalShell>
  );
}
