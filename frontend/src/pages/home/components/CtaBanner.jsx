import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { Reveal } from './index';
import { useAuth } from '../../../middleware/AuthContext';

export default function CtaBanner() {
  const { user } = useAuth();
  const primaryPath = user ? '/scan' : '/register';

  return (
    <section className="ps-container pb-16 sm:pb-20 lg:pb-24">
      <Reveal className="relative isolate overflow-hidden rounded-[1.6rem] bg-[#101107] px-6 py-12 sm:rounded-[2rem] sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <img
          src="/img/poultry-pasture.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-55"
          style={{ objectPosition: '62% 52%' }}
          loading="lazy"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[#101107]/82 lg:bg-gradient-to-r lg:from-[#101107] lg:via-[#101107]/88 lg:to-[#101107]/40"
        />

        <div className="max-w-[37rem]">
          <p className="ps-eyebrow ps-eyebrow-light">
            <span className="ps-eyebrow-dot" aria-hidden="true" />
            Ready when you are
          </p>
          <h2 className="ps-h2 mt-4 text-[#F4F8E5]">Ready to start your poultry scan?</h2>
          <p className="mt-4 max-w-[31rem] text-[15px] leading-7 text-[#D7DAC8] sm:text-base">
            {user
              ? 'Your farm workspace is ready. Add a photo of your flock and keep the next scan with the right farm.'
              : 'Create an account, add your first farm, and take a photo of your flock. PoultraScan keeps the results with that farm.'}
          </p>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link to={primaryPath} className="ps-btn ps-btn-primary ps-btn-lg w-full sm:w-auto">
              {user ? 'Start a scan' : 'Create your account'}
              <FiArrowUpRight className="text-lg" aria-hidden="true" />
            </Link>
            <Link
              to={user ? '/dashboard' : '/login'}
              className="text-[12px] font-semibold text-[#D7DAC8] underline decoration-[#D7DAC8]/35 underline-offset-4 transition-colors hover:text-[#F4F8E5]"
            >
              {user ? 'Open your dashboard' : 'Already have an account? Log in'}
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
