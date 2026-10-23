import { MdPhotoCamera } from 'react-icons/md';
import { Reveal, ScanCorners } from './index';

export default function HeroVisual() {
  return (
    <Reveal
      delay={120}
      className="mx-auto w-full max-w-[560px] lg:mx-0 lg:max-w-none"
    >
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute -left-4 top-6 hidden h-full w-full rounded-[30px] border border-[#6E8C56]/35 sm:block"
        />

        <div className="ps-hero-media relative overflow-hidden rounded-[26px] bg-[#DDE4CA] shadow-[0_30px_70px_-38px_rgba(16,17,7,0.55)] sm:rounded-[30px]">
          <img
            src="/img/poultry-hero.jpg"
            alt="A healthy brown hen standing in tall green pasture"
            className="h-full w-full object-cover object-[center_52%]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#101107]/62 via-transparent to-[#101107]/5"
          />
          <div aria-hidden="true" className="absolute inset-0 opacity-25">
            <ScanCorners color="#F4F8E5" />
          </div>
          <div
            aria-hidden="true"
            className="ps-scan-line absolute inset-x-0 h-px bg-[#F4F8E5]/75"
          />

          <div className="absolute inset-x-4 top-4 flex items-center gap-2 sm:inset-x-5 sm:top-5">
            <span
              className="rounded-full border border-[#F4F8E5]/30 bg-[#101107]/60 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#F4F8E5] backdrop-blur-md"
            >
              Photo-based screening
            </span>
          </div>

          <div className="absolute inset-x-4 bottom-4 flex items-center gap-2.5 rounded-xl border border-[#F4F8E5]/30 bg-[#101107]/72 px-3.5 py-3 text-[#F4F8E5] backdrop-blur-md sm:inset-x-5 sm:bottom-5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6E8C56] text-[#101107]">
              <MdPhotoCamera className="text-lg" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#CCB4A0]">
                Camera or image upload
              </p>
              <p className="mt-0.5 truncate text-[13px] font-semibold">
                Start with a clear flock photo
              </p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
