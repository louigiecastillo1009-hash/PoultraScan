import { Link } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import { Reveal } from './index';
import { useAuth } from '../../../middleware/AuthContext';

const steps = [
  {
    number: '01',
    title: 'Capture or upload',
    description:
      'Choose the active farm, then use the camera in the app or upload a clear photo from your gallery.',
  },
  {
    number: '02',
    title: 'Run the scan',
    description:
      'PoultraScan detects the birds in the frame and runs its AI-assisted health and size estimates.',
  },
  {
    number: '03',
    title: 'Review and keep',
    description:
      'Open the per-bird results and flock summary, then return to the saved scan from history whenever you need it.',
  },
];

export default function HowItWorks() {
  const { user } = useAuth();
  const primaryPath = user ? '/scan' : '/register';

  return (
    <section
      id="how-it-works"
      className="ps-anchor relative overflow-hidden bg-[#101107] text-[#F4F8E5]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-[#6E8C56]/10 blur-3xl"
      />
      <div className="ps-container ps-section relative">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:pt-2">
            <Reveal>
              <p className="ps-eyebrow ps-eyebrow-light">
                <span className="ps-eyebrow-dot" aria-hidden="true" />
                How it works
              </p>
            </Reveal>

            <Reveal delay={70}>
              <h2 className="ps-h2 mt-4 max-w-[13ch] text-[#F4F8E5]">
                From one photo to a useful readout.
              </h2>
            </Reveal>

            <Reveal delay={130}>
              <p className="mt-5 max-w-[30rem] text-[15px] leading-7 text-[#D7DAC8] sm:text-base">
                No special equipment and no complicated setup. Start with a clear image,
                choose your farm, and let the scan do the first pass.
              </p>
            </Reveal>

            <Reveal delay={190}>
              <Link to={primaryPath} className="ps-btn ps-btn-cream mt-8">
                {user ? 'Start a scan' : 'Start your first scan'}
                <FiArrowUpRight className="text-lg" aria-hidden="true" />
              </Link>
            </Reveal>

            <Reveal delay={250}>
              <p className="mt-7 flex max-w-[27rem] items-start gap-2.5 text-[11px] leading-5 text-[#AEB39B]">
                <span
                  aria-hidden="true"
                  className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#B1A03E]"
                />
                Results are automated estimates. They can help you decide where to look,
                but they do not replace a licensed poultry veterinarian.
              </p>
            </Reveal>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute bottom-8 left-[1.2rem] top-8 hidden w-px bg-[#F4F8E5]/15 sm:block"
            />
            <ol className="border-t border-[#F4F8E5]/15">
              {steps.map((step, index) => (
                <Reveal
                  key={step.number}
                  delay={100 + index * 90}
                  as="li"
                  className="relative grid grid-cols-[2.5rem_1fr] gap-4 border-b border-[#F4F8E5]/15 py-7 sm:grid-cols-[3rem_1fr] sm:gap-6 sm:py-8"
                >
                  <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#F4F8E5]/20 bg-[#101107] font-display text-[15px] text-[#CDBF73]">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-display text-[1.55rem] leading-tight text-[#F4F8E5] sm:text-[1.8rem]">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-[30rem] text-[13px] leading-6 text-[#B8BCA7] sm:text-sm">
                      {step.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={390}>
              <a
                href="#responsible"
                className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold text-[#CDBF73] transition-colors hover:text-[#F4F8E5]"
              >
                How to read the results
                <FiArrowRight className="text-[14px]" aria-hidden="true" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
