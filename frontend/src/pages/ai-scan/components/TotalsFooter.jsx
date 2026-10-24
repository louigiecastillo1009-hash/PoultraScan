import { GiChicken } from 'react-icons/gi';
import { MdInfoOutline } from 'react-icons/md';

import { Surface } from '../../../components/index';

function MarketReadyBar({ ready, total }) {
  if (!total) return null;
  const percentage = Math.round((ready / total) * 100);

  return (
    <div className="mt-3 flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-deep">
        <div
          className="h-full rounded-full bg-sage-dark"
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        />
      </div>
      <span className="text-[10.5px] font-bold text-sage-dark">{percentage}%</span>
    </div>
  );
}

export default function TotalsFooter({ chickens, totalWeight, totalOilMl, marketReadyCount }) {
  return (
    <Surface padding="none" className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-soft text-sage-dark">
            <GiChicken className="text-lg" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-[1.15rem] font-medium tracking-[-0.02em] text-ink">
              Flock summary
            </h2>
            <p className="mt-0.5 text-[11px] text-muted">
              {chickens.length} {chickens.length === 1 ? 'chicken' : 'chickens'} scanned in this
              run
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-ink/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="px-5 py-4 sm:py-5">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-olive">
            Total weight
          </p>
          <p className="mt-1.5 font-display text-[1.8rem] font-medium leading-none text-ink">
            {totalWeight}
            <span className="ml-1 text-[12px] font-medium text-muted">kg</span>
          </p>
        </div>
        <div className="px-5 py-4 sm:py-5">
          <p className="flex items-center gap-1 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.14em] text-olive">
            Total estimated oil yield
            <MdInfoOutline
              className="cursor-help text-xs text-muted"
              title="Estimated from body weight using an assumed fat percentage and rendering efficiency. Actual oil yield may vary depending on breed, age, sex, body condition, and rendering method."
            />
          </p>
          <p className="mt-1.5 font-display text-[1.8rem] font-medium leading-none text-ink">
            ~{Math.round(totalOilMl ?? 0)}
            <span className="ml-1 text-[12px] font-medium text-muted">mL</span>
          </p>
        </div>
        <div className="px-5 py-4 sm:py-5">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-olive">
            Market ready
          </p>
          <p className="mt-1.5 font-display text-[1.8rem] font-medium leading-none text-ink">
            {marketReadyCount}
            <span className="ml-1 text-[12px] font-medium text-muted">of {chickens.length}</span>
          </p>
          <MarketReadyBar ready={marketReadyCount} total={chickens.length} />
        </div>
      </div>
    </Surface>
  );
}
