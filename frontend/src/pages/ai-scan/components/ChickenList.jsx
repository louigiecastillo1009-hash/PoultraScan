import { useState } from 'react';
import {
  MdChevronRight,
  MdCheck,
  MdOutlinePets,
  MdOutlineMedicalServices,
} from 'react-icons/md';
import { SEVERITY_STYLES } from '../../../constant/severity';

export default function ChickenList({ chickens }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <ul className="divide-y divide-ink/10 overflow-hidden rounded-[1.5rem] border border-ink/10 bg-paper shadow-card">
      {chickens.map((chicken, i) => {
        const sev = SEVERITY_STYLES[chicken.severity?.toUpperCase()] || SEVERITY_STYLES.UNKNOWN;
        const isOpen = expanded === i;
        const isUncertain = chicken.disease === 'UNKNOWN';
        const hasExtra = Boolean(
          chicken.breed || chicken.recommendation || (isUncertain && chicken.reasoning)
        );

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
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                    chicken.healthy ? 'text-[#4D6938]' : 'text-[#B3261E]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${chicken.healthy ? 'bg-[#6E8C56]' : 'bg-[#B3261E]'}`} />
                    {chicken.disease}
                  </span>
                </span>
                <span className="flex items-center gap-2 mt-0.5 text-xs text-[#6F7160]">
                  <span>{chicken.estimated_weight} kg</span>
                  <span className="h-1 w-1 rounded-full bg-line-strong" />
                  <span>~{Math.round(chicken.estimated_oil_ml ?? 0)} mL</span>
                  <span className="h-1 w-1 rounded-full bg-line-strong" />
                  <span>{chicken.confidence}% confidence</span>
                </span>
              </span>

              <span className={`badge ${sev.bg} ${sev.text} hidden sm:inline-flex`}>{sev.label}</span>

              {chicken.market_ready ? (
                <span className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-[#4D6938] bg-[#E9EFDA] border border-[#CFDDB8] rounded-full px-2.5 py-1">
                  <MdCheck className="text-sm" /> Ready
                </span>
              ) : (
                <span className="hidden md:inline-flex text-xs font-medium text-[#6F7160] whitespace-nowrap">
                  Not ready
                </span>
              )}

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
                {chicken.recommendation && (
                  <div className="rounded-xl border border-ink/10 bg-cream-deep/45 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MdOutlineMedicalServices className="text-[#4D6938] text-sm" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#4D6938]">Recommendation</span>
                    </div>
                    <p className="text-xs text-[#4C4E3E] leading-relaxed">{chicken.recommendation}</p>
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