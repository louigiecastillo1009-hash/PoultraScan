import Surface from '../../../components/app/Surface';

const TONES = {
  green: 'bg-sage-soft text-sage-dark',
  gold: 'bg-gold-soft text-olive',
  muted: 'bg-cream-deep text-muted',
};

export default function StatPill({
  label,
  value,
  icon: Icon,
  caption,
  tone = 'green',
  valueClassName = 'text-[1.6rem] sm:text-[2rem]',
  loading = false,
}) {
  return (
    <Surface padding="none" className="flex h-full flex-col p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[9.5px] font-bold uppercase leading-tight tracking-[0.14em] text-olive sm:text-[10px]">
          {label}
        </p>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl sm:h-9 sm:w-9 ${
            TONES[tone] || TONES.green
          }`}
        >
          <Icon className="text-[17px] sm:text-lg" aria-hidden="true" />
        </span>
      </div>

      {loading ? (
        <span className="mt-3 block h-7 w-20 animate-pulse rounded-md bg-cream-deep" />
      ) : (
        <p
          className={`mt-2.5 break-words font-display font-medium leading-tight tracking-[-0.025em] text-ink tabular-nums ${valueClassName}`}
        >
          {value}
        </p>
      )}

      {caption && (
        <p className="mt-1.5 hidden text-[10.5px] leading-snug text-muted sm:block">{caption}</p>
      )}
    </Surface>
  );
}
