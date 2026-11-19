import { useState } from 'react';
import {
  MdHealthAndSafety,
  MdInfoOutline,
  MdOutlineMedicalServices,
  MdOutlinePets,
} from 'react-icons/md';

import { Button } from '../../../components/index';
import { SEVERITY_STYLES } from '../../../constant/severity';

export default function ChickenCard({ chicken }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const severity = SEVERITY_STYLES[chicken.severity?.toUpperCase()] || SEVERITY_STYLES.UNKNOWN;
  const isUncertain = chicken.assessable === false || ['UNKNOWN', 'CANNOT_ASSESS'].includes(chicken.disease);
  const hasExtraContent = Boolean(chicken.breed || chicken.recommendation);

  if (isUncertain) return (
    <article className="rounded-2xl border border-ink/10 bg-paper p-5 shadow-card">
      <h3 className="font-semibold">{chicken.angle ? `${chicken.angle} · ` : ''}Chicken {chicken.tracking_id} — {chicken.disease}</h3>
      <p className="mt-3 text-sm">{chicken.cannot_assess_reason || chicken.reasoning || chicken.care_tips || 'Chicken cannot be assessed clearly. Please reposition the camera and retake the photo.'}</p>
      <p className="mt-3 text-sm text-muted">Weight and health assessment unavailable. This is not a healthy result.</p>
    </article>
  );

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-ink/10 bg-paper shadow-card transition-shadow hover:shadow-card-hover">
      <header className="flex items-center justify-between gap-3 border-b border-ink/10 bg-cream-deep/45 px-5 py-3.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-olive">
          Chicken {chicken.tracking_id ?? '—'}
          {chicken.angle ? ` · ${chicken.angle}` : ''}
        </span>
        <span className={`badge ${severity.bg} ${severity.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${severity.dot}`} aria-hidden="true" />
          {chicken.severity === 'NONE' ? 'No visible signs' : chicken.severity === 'UNKNOWN' ? 'Not assessed' : severity.label}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-5">
        {chicken.reasoning && <p className="text-sm text-muted">{chicken.reasoning}</p>}
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              chicken.healthy ? 'bg-sage-soft text-sage-dark' : 'bg-critical-soft text-critical'
            }`}
          >
            <MdHealthAndSafety className="text-lg" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-ink">{chicken.disease}</p>
            <p
              className={`mt-0.5 text-[11px] ${
                chicken.healthy ? 'text-muted' : 'text-critical'
              }`}
            >
              {chicken.healthy ? 'No health issues detected' : 'Health issue flagged'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-y border-ink/10 py-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-olive">Estimated weight</p>
            <p className="mt-1 font-display text-[1.35rem] font-medium text-ink">
              {chicken.estimated_weight == null ? 'Estimate unavailable' : `~${chicken.estimated_weight}`}
              {chicken.estimated_weight != null && (
                <span className="ml-1 text-[11px] font-medium text-muted">kg</span>
              )}
            </p>
            <p className="mt-1 text-xs text-muted">
              {chicken.estimated_weight == null
                ? 'Try a clear, full-body photo of this chicken.'
                : `Model confidence: ${chicken.weight_confidence == null ? 'Not provided' : `${Math.round(chicken.weight_confidence)}%`}. Self-reported, not measured accuracy. Verify with a scale.`}
            </p>
          </div>
          <div className="border-l border-ink/10 pl-4">
            <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.14em] text-olive">
              Est. oil yield
              <span
                className="inline-flex cursor-help text-muted"
                title="Estimated from body weight using an assumed fat percentage and rendering efficiency. Actual oil yield may vary depending on breed, age, sex, body condition, and rendering method."
              >
                <MdInfoOutline className="text-xs" aria-hidden="true" />
              </span>
            </p>
            <p className="mt-1 font-display text-[1.35rem] font-medium text-ink">
              {chicken.estimated_oil_ml == null ? 'Not estimated' : `~${Math.round(chicken.estimated_oil_ml)}`}
              {chicken.estimated_oil_ml != null && (
                <span className="ml-1 text-[11px] font-medium text-muted">mL</span>
              )}
            </p>
            <p className="mt-0.5 text-[9.5px] text-muted">
              {chicken.estimated_oil_ml == null ? 'not estimated' : 'from estimated weight'}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-olive">
              AI confidence
            </span>
            <span className="text-[11px] font-bold text-sage-dark">
              {chicken.confidence == null ? 'Not provided' : `${Math.round(chicken.confidence)}%`}
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cream-deep">
            <div
              className="h-1.5 rounded-full bg-sage-dark transition-all duration-500"
              style={{ width: `${chicken.confidence ?? 0}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        <p className="rounded-xl border border-ink/10 bg-cream-deep/45 px-3.5 py-2.5 text-[11px] text-muted">
          Market readiness needs verification
        </p>

        {isExpanded && (
          <div className="flex flex-col gap-3">
            {chicken.breed && (
              <div className="flex items-center gap-2 text-[12px] text-soft">
                <MdOutlinePets className="text-base text-muted" aria-hidden="true" />
                <span>{chicken.breed}</span>
              </div>
            )}
            {chicken.recommendation && (
              <div className="rounded-xl border border-ink/10 bg-cream-deep/45 p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <MdOutlineMedicalServices className="text-sm text-sage-dark" aria-hidden="true" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-olive">
                    Recommendation
                  </span>
                </div>
                <p className="text-[11.5px] leading-relaxed text-soft">{chicken.recommendation}</p>
              </div>
            )}
          </div>
        )}

        {hasExtraContent && (
          <Button
            variant="secondary"
            size="sm"
            className="mt-auto w-full"
            onClick={() => setIsExpanded((value) => !value)}
          >
            {isExpanded ? 'See less' : 'See more'}
          </Button>
        )}
      </div>
    </article>
  );
}
