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
      className={`group relative flex flex-row overflow-hidden rounded-[1.5rem] border bg-paper transition-all duration-200 sm:flex-col ${
        isActive
          ? 'border-sage/45 shadow-[0_18px_40px_-28px_rgba(77,105,56,0.55)] ring-1 ring-sage/10'
          : 'border-ink/10 shadow-card hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card-hover'
      }`}
    >
      <button
        type="button"
        onClick={onOpenDetails}
        className="relative w-[96px] shrink-0 self-stretch overflow-hidden bg-cream-deep text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sage/50 sm:aspect-[16/9] sm:w-full sm:self-auto"
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
          <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sage-soft to-cream-deep text-sage-dark">
            <MdAgriculture className="text-3xl opacity-80 sm:text-[38px]" aria-hidden="true" />
          </span>
        )}

        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/20 to-transparent sm:h-20" />

        {isActive && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-paper/95 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-sage-dark shadow-sm ring-1 ring-sage/15 backdrop-blur-sm sm:left-3 sm:top-3">
            <span className="h-1.5 w-1.5 rounded-full bg-sage-dark" aria-hidden="true" />
            Active
          </span>
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col p-3.5 sm:p-5">
        <div className="flex min-w-0 items-start justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-[13.5px] font-semibold leading-snug tracking-[-0.01em] text-ink sm:text-[15px]">
              {farm.farm_name}
            </h3>

            <div className="mt-1.5 flex items-start gap-1.5 text-[11.5px] leading-snug text-muted sm:text-[12.5px]">
              <MdLocationOn className="mt-px shrink-0 text-[14px]" aria-hidden="true" />
              <span className="line-clamp-2 min-w-0">
                {farm.location || 'No location specified'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenDetails}
            aria-label={`Open ${farm.farm_name}`}
            className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-cream-deep hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/35 sm:h-8 sm:w-8"
          >
            <MdArrowForward className="text-lg" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3 sm:border-t sm:border-ink/10 sm:pt-4">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted sm:text-[10px]">
              Capacity
            </p>
            <p className="mt-0.5 truncate text-[13px] font-semibold tabular-nums text-ink sm:text-sm">
              {Number(farm.capacity)?.toLocaleString() || '0'}
              <span className="ml-1 text-[10px] font-medium text-muted sm:text-[11px]">chickens</span>
            </p>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSelectActive();
            }}
            aria-pressed={isActive}
            className={`inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[10.5px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/35 sm:min-h-9 sm:text-[11px] ${
              isActive
                ? 'bg-sage-soft text-sage-dark'
                : 'bg-cream-deep text-soft hover:bg-ink hover:text-cream'
            }`}
          >
            {isActive ? (
              <>
                <MdCheckCircle className="text-sm" aria-hidden="true" />
                Selected
              </>
            ) : (
              <>
                <MdRadioButtonUnchecked className="text-sm" aria-hidden="true" />
                Select
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
