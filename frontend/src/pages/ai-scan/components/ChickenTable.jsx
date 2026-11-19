import { Fragment, useState } from 'react';
import {
  MdChevronRight,
  MdOutlinePets,
} from 'react-icons/md';
import { SEVERITY_STYLES } from '../../../constant/severity';

export default function ChickenTable({ chickens }) {
  const [expanded, setExpanded] = useState(null);

  const th =
    'whitespace-nowrap px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-olive';
  const td = 'px-4 py-3.5 text-[12px]';

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-ink/10 bg-paper shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-ink/10 bg-cream-deep/50">
              <th className={th}>Chicken</th>
              <th className={th}>Health</th>
              <th className={th}>Severity</th>
              <th className={th}>Weight</th>
              <th className={th}>Oil yield</th>
              <th className={th}>Confidence</th>
              <th className={th}>Market Ready</th>
              <th className={`${th} text-right`}>Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {chickens.map((chicken, i) => {
              const sev = SEVERITY_STYLES[chicken.severity?.toUpperCase()] || SEVERITY_STYLES.UNKNOWN;
              const isOpen = expanded === i;
              const isUncertain = chicken.assessable === false;
              const hasExtra = Boolean(chicken.breed || chicken.care_tips);
              const healthColor =
                chicken.healthy === false ? 'bg-[#B3261E]'
                  : chicken.healthy === true ? 'bg-[#6E8C56]'
                    : 'bg-[#9A9B8A]';
              const healthText =
                chicken.healthy === false ? 'text-[#B3261E]'
                  : chicken.healthy === true ? 'text-[#4D6938]'
                    : 'text-[#6F7160]';
              const sevLabel =
                chicken.severity === 'NONE' ? 'No visible signs'
                  : chicken.severity === 'UNKNOWN' ? 'No clear signs'
                    : sev.label;

              return (
                <Fragment key={chicken.tracking_id ?? i}>
                  <tr className={`transition-colors ${isOpen ? 'bg-cream-deep/30' : 'hover:bg-cream-deep/40'}`}>
                    <td className={`${td} font-semibold text-[#101107] whitespace-nowrap`}>
                      Chicken {chicken.tracking_id ?? '—'}
                      {chicken.angle ? ` · ${chicken.angle}` : ''}
                    </td>
                    <td className={td}>
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${healthColor}`} />
                        <span className={`font-medium ${healthText}`}>
                          {chicken.disease}
                        </span>
                      </span>
                    </td>
                    <td className={td}>
                      <span className={`badge ${sev.bg} ${sev.text}`}>{sevLabel}</span>
                    </td>
                    <td className={`${td} text-[#4C4E3E] whitespace-nowrap`}>
                      {chicken.display_weight == null
                        ? 'Estimate unavailable'
                        : `${chicken.weight_source === 'user' ? '' : '~'}${chicken.display_weight} kg`}
                    </td>
                    <td className={`${td} text-[#4C4E3E] whitespace-nowrap`}>
                      {chicken.display_oil_ml == null
                        ? 'Not estimated'
                        : `${chicken.oil_source === 'user' ? '' : '~'}${Math.round(chicken.display_oil_ml)} mL`}
                    </td>
                    <td className={td}>
                      <span className="inline-flex items-center gap-2">
                        <span className="w-16 h-1.5 bg-[#DDE3CF] rounded-full overflow-hidden">
                          <span className="block h-full bg-[#4D6938] rounded-full" style={{ width: `${chicken.confidence ?? 0}%` }} />
                        </span>
                        <span className="text-xs font-bold text-[#4D6938]">
                          {chicken.confidence == null ? 'Not provided' : `${Math.round(chicken.confidence)}%`}
                        </span>
                      </span>
                    </td>
                    <td className={td}>
                      <span className={`text-xs font-medium ${chicken.market_ready ? 'text-[#4D6938]' : 'text-[#6F7160]'}`}>
                        {chicken.market_ready_label}
                      </span>
                    </td>
                    <td className={`${td} text-right`}>
                      <button
                        type="button"
                        onClick={() => setExpanded(hasExtra ? (isOpen ? null : i) : null)}
                        disabled={!hasExtra}
                        aria-label={isOpen ? 'Hide details' : 'View details'}
                        className={`w-8 h-8 inline-flex items-center justify-center rounded-lg transition-colors ${
                          hasExtra
                            ? 'text-[#6F7160] hover:bg-[#E9EFDA] hover:text-[#4D6938]'
                            : 'text-[#D3DEDA] cursor-default'
                        }`}
                      >
                        <MdChevronRight className={`text-lg transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                      </button>
                    </td>
                  </tr>

                  {isOpen && (
                    <tr className="border-b border-ink/10 bg-cream-deep/30 last:border-b-0">
                      <td colSpan={8} className="px-4 py-4">
                        <div className="flex flex-col gap-2.5 max-w-3xl">
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
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
