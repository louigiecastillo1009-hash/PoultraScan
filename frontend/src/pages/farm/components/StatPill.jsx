const TONES = {
  green: 'bg-[#E6F1EA] text-[#1E4A38]',
  gold: 'bg-[#F7F0E2] text-[#8A6B2F]',
  muted: 'bg-[#ECF1ED] text-[#56665C]',
};

export default function StatPill({
  label,
  value,
  icon: Icon,
  caption,
  tone = 'green',
  valueClassName = 'text-[24px] sm:text-[28px]',
  loading = false,
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#DFE6E0] bg-white p-4 shadow-[0_1px_2px_rgba(38,53,47,0.03)] sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase leading-tight tracking-[0.12em] text-[#7D8B82] sm:text-[11px]">
          {label}
        </p>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${
            TONES[tone] || TONES.green
          }`}
        >
          <Icon className="text-[17px] sm:text-lg" />
        </span>
      </div>

      {loading ? (
        <span className="mt-2.5 block h-7 w-20 animate-pulse rounded-md bg-[#ECF1ED] sm:mt-3" />
      ) : (
        <p
          className={`mt-2 break-words font-bold leading-snug tracking-tight text-[#1B2922] tabular-nums sm:mt-2.5 ${valueClassName}`}
        >
          {value}
        </p>
      )}

      {caption && (
        <p className="mt-1 hidden text-[11px] leading-snug text-[#65746B] sm:block">
          {caption}
        </p>
      )}
    </div>
  );
}
