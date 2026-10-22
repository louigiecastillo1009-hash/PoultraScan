import {
  MdAgriculture,
  MdArrowForward,
  MdCheckCircle,
  MdLocationOn,
  MdRadioButtonUnchecked,
} from 'react-icons/md';

import { thumbnailSrc } from '../../../utils/thumbnailSrc';

export default function FarmCard({ farm, isActive, onSelectActive, onOpenDetails }) {
  return (
    <article
      className={`group relative flex flex-row overflow-hidden rounded-2xl border bg-white transition-all duration-200 sm:flex-col ${
        isActive
          ? 'border-[#1E4A38]/45 shadow-[0_16px_32px_-24px_rgba(40,92,69,0.55)] ring-1 ring-[#1E4A38]/10'
          : 'border-[#DFE6E0] shadow-[0_1px_2px_rgba(38,53,47,0.03)] hover:-translate-y-0.5 hover:border-[#C2D2C8] hover:shadow-[0_16px_30px_-22px_rgba(38,53,47,0.35)]'
      }`}
    >
      <button
        type="button"
        onClick={onOpenDetails}
        className="relative w-[96px] shrink-0 self-stretch overflow-hidden bg-[#ECF1ED] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E4A38]/50 sm:aspect-[16/9] sm:w-full sm:self-auto"
        aria-label={`View details for ${farm.farm_name}`}
      >
        {farm.image_url ? (
          <img
            alt={`${farm.farm_name} farm`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out sm:group-hover:scale-[1.03]"
            src={thumbnailSrc(farm.image_url)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#EDF5EF] to-[#E6F1EA] text-[#1E4A38]">
            <MdAgriculture className="text-3xl opacity-80 sm:text-[38px]" />
          </span>
        )}

        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent sm:h-20" />

        {isActive && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1E4A38] shadow-sm ring-1 ring-[#1E4A38]/10 backdrop-blur-sm sm:left-3 sm:top-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1E4A38]" />
            Active
          </span>
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col p-3.5 sm:p-5">
        <div className="flex min-w-0 items-start justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-[14px] font-bold leading-snug tracking-tight text-[#1B2922] sm:text-[15px]">
              {farm.farm_name}
            </h3>

            <div className="mt-1.5 flex items-start gap-1.5 text-[12px] leading-snug text-[#65746B] sm:text-[13px]">
              <MdLocationOn className="mt-px shrink-0 text-[14px] text-[#7D8B82]" />
              <span className="line-clamp-2 min-w-0">
                {farm.location || 'No location specified'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenDetails}
            aria-label={`Open ${farm.farm_name}`}
            className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#7D8B82] transition-colors hover:bg-[#ECF1ED] hover:text-[#1E4A38] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A38]/35 sm:h-8 sm:w-8"
          >
            <MdArrowForward className="text-lg" />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3 sm:border-t sm:border-[#ECF1ED] sm:pt-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7D8B82] sm:text-[11px]">
              Capacity
            </p>
            <p className="mt-0.5 truncate text-[13px] font-bold tabular-nums text-[#1B2922] sm:text-sm">
              {Number(farm.capacity)?.toLocaleString() || '0'}
              <span className="ml-1 text-[10px] font-medium text-[#65746B] sm:text-[11px]">
                birds
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectActive();
            }}
            aria-pressed={isActive}
            className={`inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A38]/35 sm:min-h-9 sm:text-xs ${
              isActive
                ? 'bg-[#E6F1EA] text-[#1E4A38]'
                : 'bg-[#F4F6F2] text-[#56665C] hover:bg-[#E6EDE8] hover:text-[#1B2922]'
            }`}
          >
            {isActive ? (
              <>
                <MdCheckCircle className="text-sm" />
                Selected
              </>
            ) : (
              <>
                <MdRadioButtonUnchecked className="text-sm" />
                Select
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
