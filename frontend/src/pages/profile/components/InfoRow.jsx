export default function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3.5 py-3.5">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sage-soft text-sage-dark">
        <Icon className="text-lg" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-olive">{label}</p>
        <p className="mt-0.5 truncate text-[12.5px] font-semibold text-ink">{value || '—'}</p>
      </div>
    </div>
  );
}
