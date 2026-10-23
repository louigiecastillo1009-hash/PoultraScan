import { FiCamera, FiCheck, FiUploadCloud } from 'react-icons/fi';
import { MdBiotech } from 'react-icons/md';
import { Reveal } from './index';

const resultItems = [
  'Health status and severity',
  'Estimated weight',
  'Estimated oil yield',
  'Market-readiness status',
  'Confidence and recommendation',
];

export default function ProductPreview() {
  return (
    <section id="inside-app" className="ps-container ps-section-preview ps-anchor border-t border-[#101107]/12">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-[40rem]">
          <Reveal>
            <p className="ps-eyebrow">
              <span className="ps-eyebrow-dot" aria-hidden="true" />
              Inside the app
            </p>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="ps-h2 mt-4 text-[#101107]" id="product-preview-title">A scan you can read at a glance.</h2>
          </Reveal>
          <Reveal delay={130}>
            <p className="ps-lead mt-5">
              From the scan screen to the per-bird results, the interface stays focused on
              the next useful detail.
            </p>
          </Reveal>
        </div>
        <Reveal delay={170}>
          <p className="max-w-[15rem] text-[11px] font-medium uppercase leading-5 tracking-[0.14em] text-[#6B6D57] md:text-right">
            An illustrative preview of the scan and results views
          </p>
        </Reveal>
      </div>

      <Reveal delay={120}>
        <figure className="mt-10" aria-labelledby="product-preview-title">
          <div className="overflow-hidden rounded-[1.4rem] border border-[#101107]/15 bg-[#FBFAF2] shadow-[0_30px_70px_-50px_rgba(16,17,7,0.55)] sm:rounded-[1.8rem]">
            <div className="flex items-center justify-between gap-4 border-b border-[#101107]/10 px-4 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#101107] text-[#F4F8E5]">
                  <MdBiotech className="text-[14px]" aria-hidden="true" />
                </span>
                <span className="truncate font-display text-[0.95rem] font-semibold text-[#101107]">
                  PoultraScan
                </span>
              </div>

              <div className="hidden items-center gap-1 text-[10px] font-semibold text-[#6B6D57] sm:flex">
                <span className="rounded-full px-2.5 py-1.5">Dashboard</span>
                <span className="rounded-full bg-[#E7ECD7] px-2.5 py-1.5 text-[#101107]">
                  Scans
                </span>
                <span className="rounded-full px-2.5 py-1.5">History</span>
                <span className="rounded-full px-2.5 py-1.5">Farms</span>
              </div>

              <span className="inline-flex shrink-0 items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-[#564F1E]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B1A03E]" aria-hidden="true" />
                AI-assisted
              </span>
            </div>

            <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
              <div className="border-b border-[#101107]/10 p-4 sm:p-6 lg:border-b-0 lg:border-r">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-[#E7ECD7] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#564F1E]">
                    Scan console
                  </span>
                  <span className="text-[10px] font-medium text-[#6B6D57]">
                    Camera or upload
                  </span>
                </div>

                <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-[0.9rem] bg-[#101107]">
                  <img
                    src="/img/poultry-flock.jpg"
                    alt=""
                    className="h-full w-full object-cover"
                    style={{ objectPosition: '50% 48%' }}
                    loading="lazy"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#101107]/58 via-transparent to-[#101107]/18"
                  />

                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-[#F4F8E5]/30 bg-[#101107]/45 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#F4F8E5] backdrop-blur-sm">
                    <span className="h-1 w-1 rounded-full bg-[#D6E4B9]" aria-hidden="true" />
                    Scan preview
                  </span>

                  <span aria-hidden="true" className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 rounded-tl border-l-2 border-t-2 border-[#D6E4B9]/80" />
                  <span aria-hidden="true" className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 rounded-tr border-r-2 border-t-2 border-[#D6E4B9]/80" />
                  <span aria-hidden="true" className="absolute bottom-12 left-3 h-5 w-5 rounded-bl border-b-2 border-l-2 border-[#D6E4B9]/80" />
                  <span aria-hidden="true" className="absolute bottom-12 right-3 h-5 w-5 rounded-br border-b-2 border-r-2 border-[#D6E4B9]/80" />

                  <span className="absolute inset-x-3 bottom-3 text-[9px] font-medium tracking-[0.04em] text-[#F4F8E5]/85">
                    Keep the flock in frame
                  </span>

                  <span aria-hidden="true" className="ps-scan-line" />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <span className="flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-[#101107]/15 text-[10px] font-semibold text-[#101107]">
                    <FiUploadCloud className="text-[13px]" aria-hidden="true" />
                    Upload image
                  </span>
                  <span className="flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-[#101107] text-[10px] font-semibold text-[#F4F8E5]">
                    <FiCamera className="text-[13px]" aria-hidden="true" />
                    Capture
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-[1.35rem] leading-tight text-[#101107]">
                      Individual results
                    </h3>
                    <p className="mt-1 text-[10px] leading-5 text-[#6B6D57]">
                      Detailed analysis for each detected chicken
                    </p>
                  </div>
                  <span className="rounded-full border border-[#101107]/15 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#6B6D57]">
                    Per bird
                  </span>
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.13em] text-[#564F1E]">
                  Each bird card can include
                </p>
                <ul className="mt-2 divide-y divide-[#101107]/10 border-y border-[#101107]/12">
                  {resultItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 py-2.5 text-[11px] font-medium text-[#3F412F]"
                    >
                      <FiCheck className="shrink-0 text-[12px] text-[#6E8C56]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 rounded-[0.8rem] bg-[#E7ECD7] px-3.5 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#564F1E]">
                    Flock summary
                  </p>
                  <p className="mt-1 text-[10px] leading-5 text-[#555743]">
                    Total weight, estimated oil yield and the market-ready count are collected
                    after the analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <figcaption className="mt-3 text-center text-[10px] uppercase leading-5 tracking-[0.14em] text-[#6B6D57]">
            Interface preview. Actual results depend on the photo and selected farm.
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
