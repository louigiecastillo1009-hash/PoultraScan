import { FiInfo } from 'react-icons/fi';
import { Reveal } from './index';

export default function ResponsibleUse() {
  return (
    <section id="responsible" className="ps-container ps-anchor pb-16 sm:pb-20 lg:pb-24">
      <Reveal className="rounded-[1.5rem] border border-[#101107]/15 bg-[#E7E1D4] p-6 sm:rounded-[1.8rem] sm:p-8 lg:p-10">
        <div className="grid gap-5 lg:grid-cols-[auto_1fr] lg:gap-8">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#101107]/15 bg-[#F4F8E5]/55 text-[#564F1E]">
            <FiInfo className="text-[19px]" aria-hidden="true" />
          </span>
          <div>
            <p className="ps-eyebrow">
              <span className="ps-eyebrow-dot" aria-hidden="true" />
              A note on the results
            </p>
            <h2 className="mt-3 max-w-[22ch] font-display text-[clamp(1.7rem,3.2vw,2.65rem)] font-medium leading-[1.08] tracking-[-0.025em] text-[#101107]">
              Helpful signals, not a veterinary diagnosis.
            </h2>
            <div className="mt-4 grid gap-4 text-[13px] leading-6 text-[#4C4E3B] md:grid-cols-2 md:gap-8 sm:text-sm sm:leading-7">
              <p>
                PoultraScan&apos;s results are automated estimates generated from the image
                you provide. They can help you notice possible issues and decide where to
                look next, but they do not confirm disease or replace an examination by a
                licensed poultry veterinarian.
              </p>
              <p>
                For sick, high-value, or large commercial flocks, confirm findings with a
                qualified professional before making treatment, quarantine, culling, or
                sale decisions.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
