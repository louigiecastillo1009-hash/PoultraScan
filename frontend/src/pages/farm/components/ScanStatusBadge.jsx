import { MdCheckCircle, MdError, MdHourglassEmpty } from 'react-icons/md';

const CONFIG = {
  COMPLETED: {
    icon: MdCheckCircle,
    className: 'bg-[#E7F6EE] text-[#1F7A4D]',
    label: 'Completed',
  },
  PROCESSING: {
    icon: MdHourglassEmpty,
    className: 'bg-[#FEF4E2] text-[#A35A00]',
    label: 'Processing',
  },
  FAILED: {
    icon: MdError,
    className: 'bg-[#FEF2F2] text-[#B42318]',
    label: 'Failed',
  },
};

export default function ScanStatusBadge({ status }) {
  const { icon: Icon, className, label } = CONFIG[status] || CONFIG.PROCESSING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >
      <Icon className="text-sm" />
      {label}
    </span>
  );
}
