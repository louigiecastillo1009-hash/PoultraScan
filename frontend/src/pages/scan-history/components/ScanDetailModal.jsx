import { useEffect, useState } from 'react';
import {
  MdAgriculture,
  MdCheckCircle,
  MdErrorOutline,
  MdHealthAndSafety,
  MdHourglassEmpty,
  MdOpacity,
  MdOutlineNotes,
  MdOutlinePets,
  MdScale,
} from 'react-icons/md';

import { Button, ModalShell } from '../../../components/index';
import { PoultraScanLoader } from '../../../components/ui';
import { formatDateTime } from '../../../utils/formatDateTime';
import { thumbnailSrc } from '../../../utils/thumbnailSrc';
import { getPredictionsBySession } from '../api/aiPredictionApi';
import ChickenPredictionCard from './ChickenPredictionCard';
import DetailStat from './DetailStat';
import StatusBadge from './StatusBadge';

export default function ScanDetailModal({ scan, onClose }) {
  const [chickens, setChickens] = useState([]);
  const [loadingChickens, setLoadingChickens] = useState(false);

  useEffect(() => {
    if (!scan) return;
    setLoadingChickens(true);
    getPredictionsBySession(scan.scan_session_id)
      .then((data) => setChickens(data))
      .catch(() => setChickens([]))
      .finally(() => setLoadingChickens(false));
  }, [scan]);

  if (!scan) return null;

  const { date, time } = formatDateTime(scan.started_at);
  const { date: finishedDate, time: finishedTime } = formatDateTime(scan.finished_at);
  const src = thumbnailSrc(scan.thumbnail_url);
  const diseasedTone = scan.diseased_count > 0 ? 'bad' : 'good';

  return (
    <ModalShell
      open
      onClose={onClose}
      eyebrow={`Scan #${scan.scan_session_id}`}
      title={scan.farm_name}
      description={scan.location}
      icon={<MdAgriculture className="text-lg" />}
      size="lg"
      footer={
        <Button type="button" className="w-full" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-ink/10 bg-cream-deep">
          {src ? (
            <img src={src} alt={`Scan of ${scan.farm_name}`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <MdHourglassEmpty className="animate-pulse text-4xl text-muted" aria-hidden="true" />
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/35 to-transparent" />

          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-paper/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-soft shadow-sm backdrop-blur-sm">
            <MdAgriculture className="text-[13px]" aria-hidden="true" />
            {scan.scan_type === 'WEBCAM' ? 'Live capture' : 'Uploaded image'}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <StatusBadge status={scan.status} />
          <span className="text-[10.5px] text-muted">Started {date} at {time}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-ink/10 bg-cream-deep/45 p-3 sm:p-4">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-olive">
              Started
            </p>
            <p className="text-[12.5px] font-semibold text-ink">{date}</p>
            <p className="text-[10.5px] text-muted">{time}</p>
          </div>
          <div className="rounded-xl border border-ink/10 bg-cream-deep/45 p-3 sm:p-4">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-olive">
              Finished
            </p>
            <p className="text-[12.5px] font-semibold text-ink">
              {scan.finished_at ? finishedDate : '--'}
            </p>
            <p className="text-[10.5px] text-muted">
              {scan.finished_at ? finishedTime : 'In progress'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
          <DetailStat
            icon={MdOutlinePets}
            label="Total detected"
            value={scan.total_detected ?? '--'}
          />
          <DetailStat
            icon={MdCheckCircle}
            label="Healthy"
            value={scan.healthy_count ?? '--'}
            tone="good"
          />
          <DetailStat
            icon={MdErrorOutline}
            label="Not Healthy"
            value={scan.diseased_count ?? '--'}
            tone={diseasedTone}
          />
          <DetailStat
            icon={MdScale}
            label="Avg. weight"
            value={scan.average_weight != null ? `${scan.average_weight} kg` : '--'}
          />
          <DetailStat
            icon={MdOpacity}
            label="Est. oil yield"
            value={
              scan.estimated_total_oil_ml != null
                ? `~${Math.round(scan.estimated_total_oil_ml)} mL`
                : '--'
            }
          />
          <DetailStat
            icon={MdHealthAndSafety}
            label="Market ready"
            value={
              scan.total_detected ? `${scan.market_ready_count ?? 0}/${scan.total_detected}` : '--'
            }
            tone="good"
          />
        </div>

        {scan.remarks && (
          <div className="rounded-2xl border border-ink/10 bg-sage-soft p-4">
            <div className="mb-2 flex items-center gap-2">
              <MdOutlineNotes className="text-base text-sage-dark" aria-hidden="true" />
              <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-olive">
                Remarks
              </span>
            </div>
            <p className="text-[12.5px] leading-relaxed text-soft">{scan.remarks}</p>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <h3 className="font-display text-[1.15rem] font-medium text-ink">
            Chicken-by-chicken results
          </h3>
          {loadingChickens ? (
            <div className="flex justify-center py-6">
              <PoultraScanLoader size={36} label={null} />
            </div>
          ) : chickens.length === 0 ? (
            <div className="flex items-center gap-2 rounded-xl border border-ink/10 bg-cream-deep/45 px-4 py-3">
              <MdOutlinePets className="text-lg text-muted" aria-hidden="true" />
              <p className="text-[11.5px] italic text-muted">No per-chicken data available.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {chickens.map((chicken, index) => (
                <ChickenPredictionCard
                  key={chicken.detected_chicken_id ?? chicken.tracking_id ?? index}
                  chicken={chicken}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
