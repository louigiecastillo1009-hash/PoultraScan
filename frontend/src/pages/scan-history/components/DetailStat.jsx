const TONES = {
  default: 'border-ink/10 bg-cream-deep/45 text-ink',
  good: 'border-[#CFDDB8] bg-success-soft text-sage-dark',
  warn: 'border-[#E8D7B4] bg-warn-soft text-warn',
  bad: 'border-[#E9C4BE] bg-critical-soft text-critical',
};

export default function DetailStat({ icon: Icon, label, value, tone = 'default' }) {
  return (
    <div className={`flex flex-col gap-1.5 rounded-xl border p-3 sm:p-4 ${TONES[tone] || TONES.default}`}>
      <div className="flex items-center gap-1.5">
        <Icon className="flex-shrink-0 text-base opacity-75" aria-hidden="true" />
        <span className="truncate text-[9px] font-bold uppercase tracking-[0.12em] opacity-75">
          {label}
        </span>
      </div>
      <p className="break-words font-display text-[1.1rem] font-medium leading-tight tracking-[-0.02em] sm:text-lg">
        {value}
      </p>
    </div>
  );
}
