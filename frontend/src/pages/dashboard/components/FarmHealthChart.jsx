import { useEffect, useState } from 'react';

import EmptyState from '../../../components/app/EmptyState';
import Surface from '../../../components/app/Surface';

function getBarColor(percentage) {
  if (percentage >= 90) return '#4D6938';
  if (percentage >= 70) return '#B1A03E';
  return '#B3261E';
}

function getLabelColor(percentage) {
  if (percentage >= 90) return '#4D6938';
  if (percentage >= 70) return '#9E6726';
  return '#B3261E';
}

export default function FarmHealthChart({ farmHealthIndex = [] }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, [farmHealthIndex]);

  return (
    <Surface className="flex flex-col lg:col-span-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
            Health index by farm
          </h2>
          <p className="mt-0.5 text-[10.5px] text-muted">Healthy chicken percentage per farm</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4D6938]" aria-hidden="true" />
            90%+
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B1A03E]" aria-hidden="true" />
            70–89%
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B3261E]" aria-hidden="true" />
            Below 70%
          </span>
        </div>
      </div>

      {farmHealthIndex.length === 0 ? (
        <div className="mt-4 flex flex-1 items-center justify-center">
          <EmptyState
            icon={null}
            title="No farm scan data yet"
            description="Farm health appears here after your first completed scan."
            className="w-full border-0 bg-transparent px-2 py-8"
          />
        </div>
      ) : (
        <div className="mt-6 flex-1 overflow-x-auto">
          <div className="flex h-[220px] min-w-max items-end gap-4 border-b border-ink/10 pb-0 sm:min-w-0 sm:justify-between">
            {farmHealthIndex.map((farm, index) => {
              const percentage = Number(farm.health_percentage) || 0;
              const targetHeight = Math.max(percentage, 4);
              const color = getBarColor(percentage);

              return (
                <div
                  key={farm.farm_id}
                  className="group relative flex h-full w-12 flex-shrink-0 flex-col items-center justify-end gap-2 sm:w-auto sm:flex-1"
                >
                  <div
                    className="relative w-full max-w-[34px] rounded-t-lg opacity-90 transition-opacity group-hover:opacity-100 sm:max-w-[40px]"
                    style={{
                      height: animate ? `${targetHeight}%` : '0%',
                      backgroundColor: color,
                      transition: `height 700ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 70}ms, opacity 200ms`,
                    }}
                    title={`${farm.farm_name}: ${percentage}%`}
                  >
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[10px] font-semibold text-cream opacity-0 transition-opacity group-hover:opacity-100">
                      {percentage}%
                    </span>
                  </div>
                  <span
                    className="max-w-[60px] text-center text-[10px] font-medium leading-tight sm:max-w-[96px] sm:text-[10.5px]"
                    style={{ color: getLabelColor(percentage) }}
                  >
                    {farm.farm_name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Surface>
  );
}
