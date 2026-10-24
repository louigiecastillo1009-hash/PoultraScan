import ModalShell from '../../../components/app/ModalShell';

/**
 * Shared farm modal surface.
 *
 * Wraps the app's modal shell so farm forms, edit dialogs, and delete
 * confirmations share the same premium surface and mobile bottom-sheet
 * behavior.
 */
export default function FarmModalShell({
  title,
  description,
  icon: Icon,
  onClose,
  children,
  footer,
  size = 'md',
}) {
  return (
    <ModalShell
      open
      onClose={onClose}
      title={title}
      description={description}
      icon={Icon ? <Icon className="text-lg" /> : null}
      footer={footer}
      size={size === 'sm' ? 'sm' : 'lg'}
      bodyClassName="overscroll-contain"
    >
      {children}
    </ModalShell>
  );
}
