import { MdArrowForward, MdCheckCircle } from 'react-icons/md';
import { HeroVisual, Reveal } from './index';

export default function Hero() {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
      <div className="relative isolate overflow-hidden rounded-[26px] bg-[#0C1712] shadow-[0_36px_90px_-46px_rgba(11,18,13,0.78)] sm:rounded-[32px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[#41B05E]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#938063]/10 blur-3xl"
        />

        <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
          <div className="relative z-10 flex flex-col justify-center p-6 sm:p-9 lg:p-12 xl:p-16">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#DCE7DD] backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#41B05E]" aria-hidden="true" />
                AI flock diagnostics
              </span>
            </Reveal>

            <Reveal delay={70}>
              <h1
                id="home-hero-title"
                className="mt-5 max-w-[15ch] text-balance text-[clamp(2.25rem,6.2vw,4.25rem)] font-bold leading-[1.02] tracking-[-0.05em] text-white"
              >
                Know your flock&apos;s <span className="text-[#83D295]">health</span> before
                symptoms spread.
              </h1>
            </Reveal>

            <Reveal delay={130}>
              <p className="mt-5 max-w-[34rem] text-pretty text-[15px] leading-7 text-white/68 sm:text-base">
                Point a camera at the coop. PoultraScan AI reads posture, feathering, and
                movement to flag sick birds in seconds — so you catch outbreaks while
                they&apos;re still one or two birds, not the whole house.
              </p>
            </Reveal>

            <Reveal delay={190}>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="/login" className="ps-btn ps-btn-primary w-full sm:w-auto">
                  Start scanning
                  <MdArrowForward className="text-lg" aria-hidden="true" />
                </a>
                <a href="#how-it-works" className="ps-btn ps-btn-ghost-light w-full sm:w-auto">
                  See how it works
                </a>
              </div>
            </Reveal>

            <Reveal delay={250}>
              <p className="mt-6 flex max-w-[27rem] items-start gap-2.5 text-xs leading-5 text-white/55 sm:text-[13px]">
                <MdCheckCircle
                  className="mt-0.5 shrink-0 text-base text-[#41B05E]"
                  aria-hidden="true"
                />
                No hardware to install — works from any phone camera
              </p>
            </Reveal>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
