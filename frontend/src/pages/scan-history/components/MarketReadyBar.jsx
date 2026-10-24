export default function MarketReadyBar({ ready, total }) {
  if (total == null || total === 0) {
    return <span className="text-[11px] italic text-muted">--</span>;
  }

  const percentage = Math.round((ready / total) * 100);

  return (
    <div className="flex items-center gap-2.5">
      <span className="w-10 text-[11.5px] font-semibold tabular-nums text-ink">
        {ready}/{total}
      </span>
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-cream-deep">
        <div
          className="h-full rounded-full bg-sage-dark"
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
