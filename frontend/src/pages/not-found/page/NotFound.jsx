import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCenterFocusStrong } from 'react-icons/md';

import { Button, Surface } from '../../../components/index';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100dvh-14rem)] items-center justify-center py-4">
      <Surface padding="none" className="grid w-full max-w-3xl overflow-hidden md:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center p-7 sm:p-10">
          <span className="app-eyebrow">Error 404</span>

          <p className="mt-5 font-display text-[clamp(4rem,10vw,6rem)] font-medium leading-none tracking-[-0.04em] text-ink">
            404
          </p>

          <h1 className="mt-4 font-display text-[2rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[2.35rem]">
            Page not found
          </h1>
          <p className="mt-2 max-w-sm text-[12.5px] leading-6 text-muted">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>

          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <Button variant="secondary" className="flex-1" onClick={() => navigate('/dashboard')}>
              <MdArrowBack className="text-lg" aria-hidden="true" />
              Dashboard
            </Button>
            <Button className="flex-1" onClick={() => navigate('/scan')}>
              <MdCenterFocusStrong className="text-lg" aria-hidden="true" />
              Scan poultry
            </Button>
          </div>
        </div>

        <div className="relative hidden min-h-[420px] md:block">
          <img
            src="/img/poultry-farmer.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-cream/15 bg-ink/55 p-4 backdrop-blur-sm">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-cream/60">
              Lost in the coop?
            </p>
            <p className="mt-1 text-[12px] leading-5 text-cream/85">
              Let&apos;s get you back to the flock.
            </p>
          </div>
        </div>
      </Surface>
    </div>
  );
}
