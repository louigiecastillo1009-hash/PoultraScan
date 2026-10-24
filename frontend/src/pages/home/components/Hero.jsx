import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiArrowUpRight,
  FiCamera,
  FiFolder,
} from 'react-icons/fi';

import { useAuth } from '../../../middleware/AuthContext';
import { HeroVisual, Reveal } from './index';

const checks = [
  { icon: FiCamera, label: 'Phone camera or image upload' },
  { icon: FiFolder, label: 'Results saved to your farm' },
  { icon: FiActivity, label: 'Per-chicken scan results' },
];

export default function Hero() {
  const { user } = useAuth();
  const primaryPath = user ? '/scan' : '/register';

  return (
    <section className="ps-container pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
      <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16 xl:gap-20">
        <div>
          <Reveal>
            <p className="ps-eyebrow">
              <span className="ps-eyebrow-dot" aria-hidden="true" />
              Poultry health, in plain sight
            </p>
          </Reveal>

          <Reveal delay={70}>
            <h1 className="ps-h1 mt-6 max-w-[13ch] text-[#101107]">
              Better poultry care
              <span className="mt-1 block italic text-[#564F1E]">
                starts with a clearer scan.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="ps-lead mt-6 max-w-[36rem]">
              Photograph your flock and let PoultraScan&apos;s AI-assisted analysis
              count the chickens in view, flag possible health concerns, and estimate
              weight and market readiness — a simpler first look at your flock,
              right from your phone.
            </p>
          </Reveal>

          <Reveal delay={210}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to={primaryPath}
                className="ps-btn ps-btn-primary ps-btn-lg w-full sm:w-auto"
              >
                Start a scan
                <FiArrowUpRight className="text-lg" aria-hidden="true" />
              </Link>
              <a
                href="#how-it-works"
                className="ps-btn ps-btn-outline ps-btn-lg w-full sm:w-auto"
              >
                See how it works
              </a>
            </div>
          </Reveal>

          <Reveal delay={280}>
            <ul className="mt-9 flex flex-col gap-3 border-t border-[#101107]/15 pt-5 text-[12px] font-medium text-[#555743] sm:flex-row sm:flex-wrap sm:gap-x-6">
              {checks.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon className="text-[15px] text-[#6E8C56]" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={330}>
            <p className="mt-5 text-[12px] text-[#6B6D57]">
              {user ? (
                <>
                  Your workspace is ready.{' '}
                  <Link
                    to="/dashboard"
                    className="font-semibold text-[#564F1E] underline decoration-[#564F1E]/30 underline-offset-4 transition-colors hover:text-[#101107]"
                  >
                    Open your dashboard
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-[#564F1E] underline decoration-[#564F1E]/30 underline-offset-4 transition-colors hover:text-[#101107]"
                  >
                    Log in
                  </Link>
                </>
              )}
            </p>
          </Reveal>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
