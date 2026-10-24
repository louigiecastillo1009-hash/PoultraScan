import { FiActivity, FiCamera, FiFolder, FiGrid } from 'react-icons/fi';
import { Reveal } from './index';

const features = [
  {
    icon: FiCamera,
    title: 'Camera or gallery',
    description:
      'Use your phone camera for a quick check, or upload a photo you already have. No extra hardware required.',
  },
  {
    icon: FiActivity,
    title: 'A per-chicken readout',
    description:
      'Review detected chickens with health indicators, estimated weight and oil yield, and market-readiness status.',
  },
  {
    icon: FiFolder,
    title: 'Farms kept separate',
    description:
      'Create a farm profile for each site and keep every scan tied to the right operation.',
  },
  {
    icon: FiGrid,
    title: 'A wider view',
    description:
      'The dashboard brings recent scans, activity and farm health summaries together in one place.',
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="ps-container ps-section ps-anchor">
      <div className="max-w-[42rem]">
        <Reveal>
          <p className="ps-eyebrow">
            <span className="ps-eyebrow-dot" aria-hidden="true" />
            What&apos;s inside
          </p>
        </Reveal>
        <Reveal delay={70}>
          <h2 className="ps-h2 mt-4 text-[#101107]">
            Built around your poultry scanning workflow.
          </h2>
        </Reveal>
        <Reveal delay={130}>
          <p className="ps-lead mt-5">
            A focused set of tools for turning a photo into something you can review, save,
            and come back to.
          </p>
        </Reveal>
      </div>

      <div className="mt-12 grid border-t border-[#101107]/15 md:grid-cols-2">
        {features.map(({ icon: Icon, title, description }, index) => (
          <Reveal
            key={title}
            delay={index * 80}
            className={`group border-b border-[#101107]/15 py-8 md:py-10 ${
              index % 2 === 0 ? 'md:border-r md:pr-10 lg:pr-16' : 'md:pl-10 lg:pl-16'
            }`}
          >
            <div className="flex items-start gap-4 sm:gap-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#6E8C56]/45 text-[#564F1E] transition-colors duration-200 group-hover:bg-[#6E8C56]/10">
                <Icon className="text-[19px]" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-[1.55rem] leading-[1.12] tracking-[-0.02em] text-[#101107] sm:text-[1.7rem]">
                  {title}
                </h3>
                <p className="mt-2 max-w-[26rem] text-[13px] leading-6 text-[#555743] sm:text-sm sm:leading-7">
                  {description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={340}>
        <a href="#inside-app" className="ps-link mt-8">
          See how it looks in the app
          <span aria-hidden="true">→</span>
        </a>
      </Reveal>
    </section>
  );
}
