import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

export default function Pagination({ page, hasMore, onPrev, onNext, count }) {
  return (
    <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-ink/10 pt-4 sm:flex-row">
      <span className="text-[10.5px] text-muted">
        Page {page} · {count} results
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onPrev}
          disabled={page === 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-soft transition-colors hover:border-line-strong hover:bg-cream-deep disabled:opacity-40"
        >
          <MdChevronLeft className="text-lg" aria-hidden="true" />
        </button>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-cream">
          {page}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasMore}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-soft transition-colors hover:border-line-strong hover:bg-cream-deep disabled:opacity-40"
        >
          <MdChevronRight className="text-lg" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
