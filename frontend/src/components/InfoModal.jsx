import { ModalShell } from './app/index';

export default function InfoModal({ isOpen, onClose, title, children }) {
  return (
    <ModalShell
      open={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      bodyClassName="text-[12.5px] leading-6 text-soft"
    >
      {children}
    </ModalShell>
  );
}
