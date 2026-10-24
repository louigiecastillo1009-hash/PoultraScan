import { MdCheckCircle, MdError, MdInfo, MdWarning } from 'react-icons/md';

import { Button, ModalShell } from './app/index';

const variantConfig = {
  info: { Icon: MdInfo, iconColor: 'text-olive' },
  success: { Icon: MdCheckCircle, iconColor: 'text-sage-dark' },
  warning: { Icon: MdWarning, iconColor: 'text-warn' },
  error: { Icon: MdError, iconColor: 'text-critical' },
};

const sizeMap = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

export default function AppModal({
  isOpen,
  onClose,
  title,
  variant = 'info',
  message,
  children,
  size = 'sm',
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  confirmClassName,
  footer,
}) {
  const config = variantConfig[variant] || variantConfig.info;
  const Icon = config.Icon;

  const footerContent = footer || (onConfirm ? (
    <div className="flex gap-3">
      <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
        {cancelText}
      </Button>
      <Button
        type="button"
        className={`flex-1 ${confirmClassName || ''}`}
        onClick={onConfirm}
        disabled={loading}
      >
        {loading ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-cream/35 border-t-cream"
              aria-hidden="true"
            />
            Working...
          </>
        ) : (
          confirmText
        )}
      </Button>
    </div>
  ) : null);

  return (
    <ModalShell
      open={isOpen}
      onClose={onClose}
      title={title}
      icon={<Icon className={`text-lg ${config.iconColor}`} />}
      size={sizeMap[size] || 'sm'}
      footer={footerContent}
    >
      {(message || children) && (
        <div className="text-[12.5px] leading-6 text-soft">{message || children}</div>
      )}
    </ModalShell>
  );
}
