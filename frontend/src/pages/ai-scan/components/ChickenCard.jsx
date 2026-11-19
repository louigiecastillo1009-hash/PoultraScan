import { useState } from 'react';
import {
  MdHealthAndSafety,
  MdInfoOutline,
  MdOutlinePets,
} from 'react-icons/md';

import { Button } from '../../../components/index';
import { SEVERITY_STYLES } from '../../../constant/severity';
import MeasurementEditor from './MeasurementEditor';

export default function ChickenCard({ chicken, onMeasurementSaved }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const severity = SEVERITY_STYLES[chicken.severity?.toUpperCase()] || SEVERITY_STYLES.UNKNOWN;
  const isUncertain = chicken.assessable === false;
  const hasExtraContent = Boolean(chicken.breed || chicken.care_tips);

  const healthTone =
    chicken.healthy === true ? 'bg-sage-soft text-sage-dark'
      : chicken.healthy === false ? 'bg-critical-soft text-critical'
        : 'bg-cream-deep text-muted';
  const healthLine =
    chicken.healthy === true ? 'No health issues detected'
      : chicken.healthy === false ? 'Health issue flagged'
        : 'No specific condition identified in this photo';

  const weightIsUser = chicken.weight_source === 'user';
  const oilIsUser = chicken.oil_source === 'user';
  const weightValue =
    chicken.display_weight == null
      ? 'Unavailable'
      : `${weightIsUser ? '' : '~'}${chicken.display_weight}`;
  const oilValue =
    chicken.display_oil_ml == null
      ? 'Unavailable'
      : `${oilIsUser ? '' : '~'}${Math.round(chicken.display_oil_ml)}`;

  const marketReady = chicken.market_ready === true;
  const severityLabel =
    chicken.severity === 'NONE'
      ? 'No visible signs'
      : chicken.severity === 'UNKNOWN'
        ? 'No clear signs'
        : severity.label;

  if (isUncertain) return (
    <article className="rounded-2xl border border-ink/10 bg-paper p-5 shadow-card">
      <h3 className="font-semibold">
        {chicken.angle ? `${chicken.angle} · ` : ''}Chicken {chicken.tracking_id} — {chicken.disease}
      </h3>
      <p className="mt-3 text-sm">
        {chicken.cannot_assess_reason || chicken.reasoning || chicken.care_tips
          || 'This photo could not be assessed clearly. Please retake it with the whole bird visible.'}
      </p>
      <p className="mt-3 text-sm text-muted">
        {chicken.display_weight != null
          ? `Your entered weight: ${chicken.display_weight} kg${chicken.display_oil_ml != null ? ` · oil: ${Math.round(chicken.display_oil_ml)} mL` : ''}.`
          : 'No confirmed health result or weight estimate from this photo.'}
      </p>
      <div className="mt-3">
        <MeasurementEditor chicken={chicken} onSaved={onMeasurementSaved} />
      </div>
      {chicken.display_weight != null && (
        <div
          className={`mt-3 rounded-xl border px-3.5 py-2.5 ${
            chicken.market_ready
              ? 'border-[#CFDDB8] bg-success-soft'
              : 'border-ink/10 bg-cream-deep/45'
          }`}
        >
          <p className={`text-[11px] font-semibold ${chicken.market_ready ? 'text-sage-dark' : 'text-muted'}`}>
            {chicken.market_ready_label}
          </p>
          {chicken.market_ready_note && (
            <p className="mt-0.5 text-[10px] text-muted">{chicken.market_ready_note}</p>
          )}
        </div>
      )}
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
          {severityLabel}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-5">
        {chicken.reasoning && <p className="text-sm text-muted">{chicken.reasoning}</p>}
        <div className="flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${healthTone}`}>
            <MdHealthAndSafety className="text-lg" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-ink">{chicken.disease}</p>
            <p
              className={`mt-0.5 text-[11px] ${
                chicken.healthy === false ? 'text-critical' : 'text-muted'
              }`}
            >
              {healthLine}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-y border-ink/10 py-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-olive">
              {weightIsUser ? 'Actual weight' : 'Estimated weight'}
            </p>
            <p className="mt-1 font-display text-[1.35rem] font-medium text-ink">
              {weightValue}
              {chicken.display_weight != null && (
                <span className="ml-1 text-[11px] font-medium text-muted">kg</span>
              )}
            </p>
            <p className="mt-1 text-xs text-muted">
              {chicken.display_weight == null
                ? 'Retake with a clear, full-body view or add your own scale reading.'
                : weightIsUser
                  ? 'You entered this; it replaces the AI estimate in totals.'
                  : `AI estimate: ${chicken.weight_confidence == null ? 'confidence not provided' : `${Math.round(chicken.weight_confidence)}% self-reported`}. Verify with a scale.`}
            </p>
          </div>
          <div className="border-l border-ink/10 pl-4">
            <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.14em] text-olive">
              {oilIsUser ? 'Actual oil yield' : 'Est. oil yield'}
              <span
                className="inline-flex cursor-help text-muted"
                title="Estimated from body weight using an assumed fat percentage and rendering efficiency. Actual oil yield may vary depending on breed, age, sex, body condition, and rendering method."
              >
                <MdInfoOutline className="text-xs" aria-hidden="true" />
              </span>
            </p>
            <p className="mt-1 font-display text-[1.35rem] font-medium text-ink">
              {oilValue}
              {chicken.display_oil_ml != null && (
                <span className="ml-1 text-[11px] font-medium text-muted">mL</span>
              )}
            </p>
            <p className="mt-0.5 text-[9.5px] text-muted">
              {chicken.display_oil_ml == null
                ? 'Not available'
                : oilIsUser
                  ? 'You entered this value'
                  : 'from estimated weight'}
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

        <div
          className={`rounded-xl border px-3.5 py-2.5 ${
            marketReady
              ? 'border-[#CFDDB8] bg-success-soft'
              : 'border-ink/10 bg-cream-deep/45'
          }`}
        >
          <p className={`text-[11px] font-semibold ${marketReady ? 'text-sage-dark' : 'text-muted'}`}>
            {chicken.market_ready_label || (marketReady ? 'Market ready' : 'Not ready')}
          </p>
          {chicken.market_ready_note && (
            <p className="mt-0.5 text-[10px] text-muted">{chicken.market_ready_note}</p>
          )}
        </div>

        <MeasurementEditor chicken={chicken} onSaved={onMeasurementSaved} />

        {isExpanded && (
          <div className="flex flex-col gap-3">
            {chicken.breed && (
              <div className="flex items-center gap-2 text-[12px] text-soft">
                <MdOutlinePets className="text-base text-muted" aria-hidden="true" />
                <span>{chicken.breed}</span>
              </div>
            )}
            {chicken.care_tips && (
              <div className="rounded-xl border border-ink/10 bg-cream-deep/45 p-3">
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-olive">
                  Observed condition
                </span>
                <p className="mt-1 text-[11.5px] leading-relaxed text-soft">{chicken.care_tips}</p>
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
