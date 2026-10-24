import Surface from '../../../components/app/Surface';

const accents = {
  farm: {
    tile: 'bg-cream-deep text-olive',
    line: 'bg-sage',
  },
  scans: {
    tile: 'bg-gold-soft text-olive',
    line: 'bg-gold',
  },
  healthy: {
    tile: 'bg-sage-soft text-sage-dark',
    line: 'bg-sage-dark',
  },
  anomaly: {
    tile: 'bg-critical-soft text-critical',
    line: 'bg-critical',
  },
};

export default function MetricCard({ icon: Icon, label, value, caption, accent = 'farm' }) {
  const a = accents[accent] || accents.farm;

  return (
    <Surface
      padding="none"
      className="group relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${a.tile}`}>
          <Icon className="text-xl" aria-hidden="true" />
        </span>
        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-line-strong" aria-hidden="true" />
      </div>

      <div className="mt-5">
        <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-olive">{label}</p>
        <p className="mt-1.5 font-display text-[2rem] font-medium leading-none tracking-[-0.03em] text-ink sm:text-[2.35rem]">
          {value}
        </p>
        <p className="mt-2 text-[10.5px] leading-4 text-muted">{caption}</p>
      </div>

      <span className={`absolute inset-x-0 bottom-0 h-[2px] ${a.line}`} aria-hidden="true" />
    </Surface>
  );
}
