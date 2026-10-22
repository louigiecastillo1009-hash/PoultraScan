import { Reveal, ScanCorners } from './index';

export default function HeroVisual() {
  return (
    <Reveal
      delay={160}
      className="relative min-h-[300px] overflow-hidden border-t border-white/10 sm:min-h-[360px] lg:min-h-[590px] lg:border-l lg:border-t-0"
    >
      <img
        src="/img/hero1.png"
        alt="Free-range chickens standing in a green, softly lit coop"
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
        fetchPriority="high"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#07110B]/90 via-[#07110B]/25 to-transparent lg:bg-gradient-to-r lg:from-[#0C1712] lg:via-[#0C1712]/10 lg:to-transparent"
      />
      <div aria-hidden="true" className="ps-grid-overlay absolute inset-0 opacity-[0.08]" />

      <div
        aria-hidden="true"
        className="absolute left-[12%] top-[18%] h-[33%] w-[34%] rounded-xl border border-[#9DE3AF]/80 shadow-[0_0_0_1px_rgba(7,17,11,0.18)]"
      >
        <span className="absolute -top-6 left-0 whitespace-nowrap rounded-md bg-[#41B05E] px-1.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#07110B]">
          Bird 01
        </span>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-[33%] right-[10%] h-[27%] w-[29%] rounded-xl border border-white/55"
      >
        <span className="absolute -top-5 left-0 whitespace-nowrap rounded-md bg-white/90 px-1.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#0B0B0D]">
          Bird 02
        </span>
      </div>

      <div
        aria-hidden="true"
        className="ps-scan-line absolute inset-x-0 h-px bg-[#7DDE93]/80 shadow-[0_0_18px_4px_rgba(65,176,94,0.28)]"
      />
      <ScanCorners color="rgba(255,255,255,0.75)" />

      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#07110B]/45 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-md sm:left-6 sm:top-6">
        <span className="h-1.5 w-1.5 rounded-full bg-[#41B05E]" aria-hidden="true" />
        Live coop scan
      </span>

      <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-[0_20px_45px_-22px_rgba(0,0,0,0.65)] backdrop-blur-md sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[252px]">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#79807B]">
            Scan in progress
          </span>
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#41B05E]" aria-hidden="true" />
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {['Posture', 'Feathering', 'Movement'].map((label) => (
            <span
              key={label}
              className="rounded-full bg-[#EEF3EE] px-2 py-1 text-[9px] font-bold text-[#3F4B43]"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E6ECE7]" aria-hidden="true">
          <div className="h-full w-[68%] rounded-full bg-[#41B05E]" />
        </div>
        <p className="mt-2 text-[10px] leading-4 text-[#737B76]">
          Reading flock signals from one frame
        </p>
      </div>
    </Reveal>
  );
}
