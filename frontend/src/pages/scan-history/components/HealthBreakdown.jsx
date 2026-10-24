export default function HealthBreakdown({ healthy, diseased, total }) {
  if (total == null) {
    return <span className="text-[11px] italic text-muted">--</span>;
  }

  const allHealthy = diseased === 0;

  return (
    <div className="flex items-center gap-2">
      <span
        className="h-2 w-2 flex-shrink-0 rounded-full"
        style={{ backgroundColor: allHealthy ? '#4D6938' : '#B3261E' }}
        aria-hidden="true"
      />
      <span className="text-[11.5px] font-medium text-ink">
        {healthy ?? 0} Healthy <span className="text-muted">/ {diseased ?? 0} Not Healthy</span>
      </span>
    </div>
  );
}
