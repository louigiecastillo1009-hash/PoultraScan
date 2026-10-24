import { PoultraScanLoader } from './ui';

export default function LoadingScreen() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-cream px-4"
    >
      <PoultraScanLoader size={56} label="Loading..." />
    </div>
  );
}
