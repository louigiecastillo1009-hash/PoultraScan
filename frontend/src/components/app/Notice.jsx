import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';
import { MdErrorOutline } from 'react-icons/md';

const tones = {
  error: {
    wrap: 'border-[#E9C4BE] bg-critical-soft text-critical',
    icon: MdErrorOutline,
  },
  success: {
    wrap: 'border-[#CFDDB8] bg-success-soft text-sage-dark',
    icon: FiCheckCircle,
  },
  warning: {
    wrap: 'border-[#E8D7B4] bg-warn-soft text-warn',
    icon: FiAlertCircle,
  },
  info: {
    wrap: 'border-line bg-cream-deep text-olive',
    icon: FiInfo,
  },
};

export default function Notice({ tone = 'info', title, children, action, onClose, className = '' }) {
  const config = tones[tone] || tones.info;
  const Icon = config.icon;

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 ${config.wrap} ${className}`}
    >
      <Icon className="mt-0.5 shrink-0 text-lg" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title && <p className="text-[12.5px] font-bold leading-5">{title}</p>}
        {children && <div className="text-[12px] leading-5 opacity-90">{children}</div>}
        {action && <div className="mt-2.5">{action}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="rounded-full p-1 opacity-60 transition-opacity hover:opacity-100"
        >
          <FiX className="text-sm" />
        </button>
      )}
    </div>
  );
}
