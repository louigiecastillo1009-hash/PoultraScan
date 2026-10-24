import { MdCheckCircle } from 'react-icons/md';

import EmptyState from '../../../components/app/EmptyState';
import Surface from '../../../components/app/Surface';

const palette = ['#4D6938', '#B1A03E', '#6E8C56', '#B3261E', '#CCB4A0'];

export default function AnomalyChart({ diseaseBreakdown = [], totalAnomalies = 0 }) {
  const topDiseases = diseaseBreakdown.slice(0, 4);
  const otherCount = diseaseBreakdown.slice(4).reduce((sum, disease) => sum + disease.count, 0);

  const segments = [
    ...topDiseases.map((disease, index) => ({
      label: disease.disease.charAt(0) + disease.disease.slice(1).toLowerCase(),
      value: disease.count,
      color: palette[index % palette.length],
    })),
    ...(otherCount > 0
      ? [{ label: 'Other', value: otherCount, color: '#CCB4A0' }]
      : []),
  ];

  let cumulative = 0;
  const gradientStops = segments.map((segment) => {
    const start = (cumulative / totalAnomalies) * 360;
    cumulative += segment.value;
    const end = (cumulative / totalAnomalies) * 360;
    return `${segment.color} ${start}deg ${end}deg`;
  });

  return (
    <Surface className="flex flex-col lg:col-span-6">
      <div>
        <h2 className="font-display text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
          Anomaly classification
        </h2>
        <p className="mt-0.5 text-[10.5px] text-muted">Detected conditions across completed scans</p>
      </div>

      {totalAnomalies === 0 ? (
        <div className="mt-4 flex flex-1 items-center justify-center">
          <EmptyState
            icon={MdCheckCircle}
            title="No anomalies detected"
            description="Completed scans will be classified here when something needs attention."
            className="w-full border-0 bg-transparent px-2 py-6"
          />
        </div>
      ) : (
        <>
          <div className="flex flex-1 items-center justify-center py-7">
            <div
              className="relative h-44 w-44 rounded-full"
              style={{ background: `conic-gradient(${gradientStops.join(', ')})` }}
              role="img"
              aria-label={`${totalAnomalies} total anomalies`}
            >
              <div className="absolute inset-0 m-[24px] flex flex-col items-center justify-center rounded-full bg-paper">
                <span className="font-display text-[2.5rem] font-medium leading-none tracking-[-0.03em] text-ink">
                  {totalAnomalies}
                </span>
                <span className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-muted">
                  Total
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 border-t border-ink/10 pt-4">
            {segments.map((segment) => (
              <div key={segment.label} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: segment.color }}
                    aria-hidden="true"
                  />
                  <span className="truncate text-[11.5px] font-medium text-soft">{segment.label}</span>
                </div>
                <span className="text-[11.5px] font-bold text-ink">
                  {Math.round((segment.value / totalAnomalies) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </Surface>
  );
}
