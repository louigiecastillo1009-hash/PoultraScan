import { FiArrowRight } from 'react-icons/fi';
import { Reveal } from './index';

const points = [
  {
    title: 'A photo is the starting point',
    description:
      'Capture a flock photo with your phone or upload one you already have. No extra equipment or setup.',
  },
  {
    title: 'Organized by farm',
    description:
      'Choose the farm before you scan, so every result stays with the right flock and the right records.',
  },
  {
    title: 'Easy to revisit',
    description:
      'Past scans and dashboard summaries are there when you need context for the next check.',
  },
];

export default function ProductIntro() {
  return (
    <section id="product" className="ps-container ps-section ps-anchor border-t border-[#101107]/12">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:order-2 lg:col-span-6">
          <p className="ps-eyebrow">
            <span className="ps-eyebrow-dot" aria-hidden="true" />
            What PoultraScan does
          </p>
          <h2 className="ps-h2 mt-4 max-w-[13ch] text-[#101107]">
            A simpler way to understand poultry health.
          </h2>
          <p className="ps-lead mt-5 max-w-[34rem]">
            PoultraScan turns a photo of your flock into a structured first look. See the
            birds it detects, review possible health concerns, and check estimated weight
            and market readiness — then keep the scan with the farm it belongs to.
          </p>

          <ol className="mt-8 divide-y divide-[#101107]/12 border-y border-[#101107]/15">
            {points.map((point, index) => (
              <li key={point.title} className="grid grid-cols-[2rem_1fr] gap-3 py-5 sm:gap-4">
                <span
                  className="pt-0.5 font-display text-[1.1rem] leading-none text-[#B1A03E]"
                  aria-hidden="true"
                >
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-[0.95rem] font-bold leading-snug text-[#101107]">
                    {point.title}
                  </h3>
                  <p className="mt-1.5 max-w-[30rem] text-[13px] leading-6 text-[#555743]">
                    {point.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <a href="#inside-app" className="ps-link mt-7">
            See the scanning interface
            <FiArrowRight className="text-[15px]" aria-hidden="true" />
          </a>
        </Reveal>

        <Reveal delay={120} className="lg:order-1 lg:col-span-6">
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-[#CCB4A0] sm:rounded-[2rem]">
              <img
                src="/img/poultry-farmer.jpg"
                alt="A poultry keeper holding a brown hen inside a barn"
                className="h-full w-full object-cover"
                style={{ objectPosition: '50% 42%' }}
                loading="lazy"
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-4 text-[9px] font-bold uppercase tracking-[0.14em] text-[#6B6D57] sm:text-[10px]">
              <span>Everyday flock care</span>
              <span>A closer look starts here</span>
            </div>
            <span
              aria-hidden="true"
              className="absolute -bottom-5 -right-3 hidden h-24 w-24 rounded-bl-[2rem] border-b border-l border-[#B1A03E]/50 sm:block"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
