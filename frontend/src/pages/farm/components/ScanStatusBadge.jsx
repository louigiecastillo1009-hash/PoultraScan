import { MdCheckCircle, MdError, MdHourglassEmpty } from 'react-icons/md';

import Badge from '../../../components/app/Badge';

const CONFIG = {
  COMPLETED: { icon: MdCheckCircle, tone: 'success', label: 'Completed' },
  PROCESSING: { icon: MdHourglassEmpty, tone: 'warning', label: 'Processing' },
  FAILED: { icon: MdError, tone: 'danger', label: 'Failed' },
};

export default function ScanStatusBadge({ status }) {
  const { icon: Icon, tone, label } = CONFIG[status] || CONFIG.PROCESSING;

  return (
    <Badge tone={tone} size="sm">
      <Icon className="text-[12px]" aria-hidden="true" />
      {label}
    </Badge>
  );
}
