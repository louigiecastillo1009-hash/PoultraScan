import { MdErrorOutline, MdSync } from 'react-icons/md';

import Badge from '../../../components/app/Badge';

const CONFIG = {
  COMPLETED: { tone: 'success', label: 'Completed' },
  PROCESSING: { tone: 'warning', label: 'Processing', icon: MdSync, spin: true },
  FAILED: { tone: 'danger', label: 'Failed', icon: MdErrorOutline },
};

export default function StatusBadge({ status }) {
  const config = CONFIG[status] || CONFIG.PROCESSING;
  const Icon = config.icon;

  return (
    <Badge tone={config.tone} size="sm" className="w-max">
      {Icon && (
        <Icon className={`text-[12px] ${config.spin ? 'animate-spin' : ''}`} aria-hidden="true" />
      )}
      {config.label}
    </Badge>
  );
}
