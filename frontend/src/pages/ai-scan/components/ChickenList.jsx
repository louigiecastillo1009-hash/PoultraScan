import { useState } from 'react';
import {
  MdChevronRight,
  MdOutlinePets,
} from 'react-icons/md';
import { SEVERITY_STYLES } from '../../../constant/severity';

export default function ChickenList({ chickens }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <ul className="divide-y divide-ink/10 overflow-hidden rounded-[1.5rem] border border-ink/10 bg-paper shadow-card">
      {chickens.map((chicken, i) => {
        const sev = SEVERITY_STYLES[chicken.severity?.toUpperCase()] || SEVERITY_STYLES.UNKNOWN;
        const isOpen = expanded === i;
        const isUncertain = chicken.assessable === false;
        const hasExtra = Boolean(chicken.breed || chicken.care_tips);
        const sevLabel =
          chicken.severity === 'NONE' ? 'No visible signs'
            : chicken.severity === 'UNKNOWN' ? 'No clear signs'
              : sev.label;
        const healthColor =
          chicken.healthy === false ? 'text-[#B3261E]'
            : chicken.healthy === true ? 'text-[#4D6938]'
              : 'text-[#6F7160]';
        const dotColor =
          chicken.healthy === false ? 'bg-[#B3261E]'
            : chicken.healthy === true ? 'bg-[#6E8C56]'
              : 'bg-[#9A9B8A]';

        return (
          <li
            key={chicken.tracking_id ?? i}
            className={`transition-colors ${isOpen ? 'bg-cream-deep/30' : ''}`}
          >
            <button
              type="button"
              onClick={() => setExpanded(hasExtra ? (isOpen ? null : i) : null)}
              disabled={!hasExtra}
              className={`w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 text-left transition-colors ${
                hasExtra ? 'cursor-pointer hover:bg-cream-deep/40' : 'cursor-default'
              }`}
            >
              <span className="w-8 h-8 rounded-lg bg-[#E9EFDA] text-[#4D6938] flex items-center justify-center text-xs font-bold flex-shrink-0">
                {chicken.tracking_id ?? i + 1}
              </span>

              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-[#101107]">
                    Chicken {chicken.tracking_id ?? '—'}
                    {chicken.angle ? ` · ${chicken.angle}` : ''}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${healthColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    {chicken.disease}
                  </span>
                </span>
                <span className="flex items-center gap-2 mt-0.5 text-xs text-[#6F7160]">
                  <span>
                    {chicken.display_weight == null
                      ? 'Weight estimate unavailable'
                      : `${chicken.weight_source === 'user' ? 'Actual' : 'Est.'} ${chicken.display_weight} kg`}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-line-strong" />
                  <span>
                    {chicken.display_oil_ml == null
                      ? 'Oil: not estimated'
                      : `${chicken.oil_source === 'user' ? '' : '~'}${Math.round(chicken.display_oil_ml)} mL`}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-line-strong" />
                  <span>{chicken.confidence == null ? 'confidence not provided' : `${Math.round(chicken.confidence)}% confidence`}</span>
                </span>
              </span>

              <span className={`badge ${sev.bg} ${sev.text} hidden sm:inline-flex`}>{sevLabel}</span>

              <span className={`hidden md:inline-flex text-xs font-medium whitespace-nowrap ${chicken.market_ready ? 'text-[#4D6938]' : 'text-[#6F7160]'}`}>
                {chicken.market_ready_label}
              </span>

              {hasExtra && (
                <MdChevronRight
                  className={`text-[#6F7160] text-lg flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                />
              )}
            </button>

            {isOpen && (
              <div className="px-4 sm:px-5 pb-4 -mt-1 flex flex-col gap-2.5">
                {isUncertain && chicken.reasoning && (
                  <p className="text-xs text-[#9E6726] bg-[#F7EFD9] border border-[#E8D7B4] rounded-lg px-3 py-2 leading-relaxed">
                    {chicken.reasoning}
                  </p>
                )}
                {chicken.breed && (
                  <p className="flex items-center gap-2 text-sm text-[#4C4E3E]">
                    <MdOutlinePets className="text-base text-[#6F7160]" />
                    {chicken.breed}
                  </p>
                )}
                {chicken.care_tips && (
                  <div className="rounded-xl border border-ink/10 bg-cream-deep/45 p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4D6938]">Observed condition</span>
                    <p className="mt-1 text-xs text-[#4C4E3E] leading-relaxed">{chicken.care_tips}</p>
                  </div>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
