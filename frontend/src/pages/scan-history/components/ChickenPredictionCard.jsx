import { useState } from 'react';
import {
  MdChevronRight,
  MdHealthAndSafety,
  MdOpacity,
  MdOutlinePets,
  MdScale,
} from 'react-icons/md';

import { Badge } from '../../../components/index';
import { thumbnailSrc } from '../../../utils/thumbnailSrc';
import DetailStat from './DetailStat';
import SeverityBadge from './SeverityBadge';

export default function ChickenPredictionCard({ chicken }) {
  const [expanded, setExpanded] = useState(false);
  const src = thumbnailSrc(chicken.image_url);

  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-cream-deep/45"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-cream-deep">
          {src ? (
            <img src={src} alt="" className="h-full w-full object-cover" />
          ) : (
            <MdOutlinePets className="text-lg text-muted" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[12.5px] font-semibold text-ink">
              Chicken #{chicken.tracking_id ?? chicken.detected_chicken_id}
            </p>
            <Badge tone={chicken.healthy ? 'success' : 'danger'} size="sm">
              {chicken.disease}
            </Badge>
            <SeverityBadge severity={chicken.severity} />
          </div>
          <p className="mt-0.5 text-[10.5px] text-muted">
            {chicken.breed || 'Unknown breed'} ·{' '}
            {chicken.confidence != null ? `${chicken.confidence}% confidence` : '--'}
          </p>
        </div>
        <MdChevronRight
          className={`flex-shrink-0 text-lg text-muted transition-transform ${
            expanded ? 'rotate-90' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {expanded && (
        <div className="flex flex-col gap-3 border-t border-ink/10 p-3 sm:p-4">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
            <DetailStat
              icon={MdScale}
              label="Weight"
              value={chicken.estimated_weight != null ? `${chicken.estimated_weight} kg` : '--'}
            />
            <DetailStat
              icon={MdOpacity}
              label="Estimated oil yield"
              value={chicken.estimated_oil_ml != null ? `~${Math.round(chicken.estimated_oil_ml)} mL` : '--'}
            />
            <DetailStat
              icon={MdHealthAndSafety}
              label="Market ready"
              value={chicken.market_ready ? 'Yes' : 'No'}
              tone={chicken.market_ready ? 'good' : 'default'}
            />
          </div>

          {chicken.care_tips && (
            <div className="rounded-xl border border-ink/10 bg-cream-deep/45 p-3">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-olive">
                Care tips
              </p>
              <p className="text-[12px] leading-relaxed text-soft">{chicken.care_tips}</p>
            </div>
          )}

          {chicken.recommendation && (
            <div className="rounded-xl border border-[#CFDDB8] bg-success-soft p-3">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-sage-dark">
                Recommendation
              </p>
              <p className="text-[12px] leading-relaxed text-soft">{chicken.recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
