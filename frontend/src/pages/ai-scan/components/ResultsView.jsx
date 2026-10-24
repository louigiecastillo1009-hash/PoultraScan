import { useCallback, useEffect, useRef, useState } from 'react';
import { MdHistory, MdPhotoCamera, MdRefresh } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { Badge, Button, SectionHeading, Surface } from '../../../components/index';
import { ChickenCard, ChickenList, ChickenTable, TotalsFooter, ViewModeToggle } from './index';

const VIEW_STORAGE_KEY = 'ai_scan_results_view';

export default function ResultsView({ onScanAgain, detectionData, predictionData, previewUrl }) {
  const navigate = useNavigate();
  const detections = detectionData?.detections ?? [];
  const chickens = predictionData?.chickens ?? [];
  const totalWeight = predictionData?.total_weight ?? 0;
  const totalOilMl = predictionData?.total_oil_ml ?? 0;
  const marketReadyCount = predictionData?.market_ready_count ?? 0;

  const [view, setView] = useState(() => {
    try {
      return localStorage.getItem(VIEW_STORAGE_KEY) || 'card';
    } catch {
      return 'card';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, view);
    } catch {
      // localStorage unavailable (private mode, etc.) — view still works in-session
    }
  }, [view]);

  const containerRef = useRef(null);
  const imgRef = useRef(null);
  // Rendered rect of the actual picture content inside the img element
  // (accounting for object-contain letterboxing), plus the scale factor
  // from the image's natural pixel size to its displayed size.
  const [renderInfo, setRenderInfo] = useState(null);

  const recalcRenderInfo = useCallback(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img || !img.naturalWidth || !img.naturalHeight) return;

    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const imgAspect = naturalW / naturalH;
    const containerAspect = containerW / containerH;

    let renderW;
    let renderH;
    let offsetX;
    let offsetY;

    if (imgAspect > containerAspect) {
      // Image is wider than container -> letterboxed top/bottom
      renderW = containerW;
      renderH = containerW / imgAspect;
      offsetX = 0;
      offsetY = (containerH - renderH) / 2;
    } else {
      // Image is taller than container -> letterboxed left/right
      renderH = containerH;
      renderW = containerH * imgAspect;
      offsetY = 0;
      offsetX = (containerW - renderW) / 2;
    }

    setRenderInfo({
      offsetX,
      offsetY,
      // How much to multiply original-image pixel coords by to get
      // displayed pixel coords.
      scaleX: renderW / naturalW,
      scaleY: renderH / naturalH,
    });
  }, []);

  useEffect(() => {
    recalcRenderInfo();
    window.addEventListener('resize', recalcRenderInfo);
    return () => window.removeEventListener('resize', recalcRenderInfo);
  }, [recalcRenderInfo, previewUrl]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-7">
      <Surface padding="none" className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-soft text-sage-dark">
              <MdPhotoCamera className="text-lg" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-[1.15rem] font-medium tracking-[-0.02em] text-ink">
                Scan preview
              </h2>
              <p className="mt-0.5 text-[11px] text-muted">
                Captured flock with AI-detected chickens
              </p>
            </div>
          </div>
          <Badge tone="sage" dot>
            {chickens.length} {chickens.length === 1 ? 'chicken' : 'chickens'} analyzed
          </Badge>
        </div>

        <div
          ref={containerRef}
          className="relative h-[400px] bg-ink md:h-[460px]"
        >
          {previewUrl && (
            <img
              ref={imgRef}
              src={previewUrl}
              alt="Scan result"
              className="h-full w-full object-contain"
              onLoad={recalcRenderInfo}
            />
          )}
          {renderInfo &&
            detections.map((detection, index) => {
              const box = detection.bounding_box ?? detection;
              // Backend sends x/y as the CENTER point and width/height, all
              // in the ORIGINAL image's pixel space (not normalized, not
              // top-left). Convert to top-left, then scale to displayed size.
              const boxWidth = (box.width ?? 0) * renderInfo.scaleX;
              const boxHeight = (box.height ?? 0) * renderInfo.scaleY;
              const centerX = (box.x ?? 0) * renderInfo.scaleX;
              const centerY = (box.y ?? 0) * renderInfo.scaleY;

              const left = renderInfo.offsetX + centerX - boxWidth / 2;
              const top = renderInfo.offsetY + centerY - boxHeight / 2;

              return (
                <div
                  key={detection.tracking_id ?? index}
                  className="pointer-events-none absolute rounded border-2 border-gold"
                  style={{
                    left: `${left}px`,
                    top: `${top}px`,
                    width: `${boxWidth}px`,
                    height: `${boxHeight}px`,
                  }}
                >
                  <span className="absolute -top-5 left-0 rounded bg-gold px-1.5 py-0.5 text-[10px] font-bold text-ink shadow-sm">
                    #{detection.tracking_id ?? index + 1}
                  </span>
                </div>
              );
            })}
        </div>
      </Surface>

      <section>
        <SectionHeading
          eyebrow="Detections"
          title="Individual results"
          description="Detailed analysis for each detected chicken."
          action={
            <div className="flex items-center gap-3">
              <span className="hidden text-[11px] font-medium text-muted sm:inline">
                {marketReadyCount} of {chickens.length} market ready
              </span>
              <ViewModeToggle value={view} onChange={setView} />
            </div>
          }
        />

        <div className="mt-5">
          {view === 'table' && <ChickenTable chickens={chickens} />}

          {view === 'card' && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {chickens.map((chicken, index) => (
                <ChickenCard key={chicken.tracking_id ?? index} chicken={chicken} />
              ))}
            </div>
          )}

          {view === 'list' && <ChickenList chickens={chickens} />}

          {view === 'carousel' && (
            <div className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
              {chickens.map((chicken, index) => (
                <div key={chicken.tracking_id ?? index} className="w-80 flex-shrink-0 snap-start">
                  <ChickenCard chicken={chicken} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <TotalsFooter
        chickens={chickens}
        totalWeight={totalWeight}
        totalOilMl={totalOilMl}
        marketReadyCount={marketReadyCount}
      />

      <div className="flex flex-col items-center justify-center gap-3 pt-1 sm:flex-row">
        <Button variant="secondary" className="w-full sm:w-auto" onClick={onScanAgain}>
          <MdRefresh className="text-lg text-sage-dark" aria-hidden="true" />
          Scan again
        </Button>
        <Button className="w-full sm:w-auto" onClick={() => navigate('/scan/history')}>
          <MdHistory className="text-lg" aria-hidden="true" />
          Go to history
        </Button>
      </div>
    </div>
  );
}
