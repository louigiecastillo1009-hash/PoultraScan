import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdHistory } from 'react-icons/md';

import { Button, Notice, PageHeader } from '../../../components/index';
import { useAuth } from '../../../middleware/AuthContext';
import { useActiveFarm } from '../../../context/activeFarmContext';
import { isFarmMissingError } from '../../../utils/farmMissingHandler';
import { useScanCache, getCachedScan, fileToBase64 } from '../hooks/useScanCache';
import { useDetection } from '../hooks/useDetection';
import { useAiPrediction } from '../hooks/useAiPrediction';
import { createScanSession } from '../api/scanSession';
import {
  CameraCaptureModal,
  FarmRequiredModal,
  NoActiveFarmNotice,
  ResultsView,
  ScanningView,
} from '../components/index';

const DEFAULT_IMAGE_TYPE = 'FRONT';
const ANGLES = ['FRONT', 'BACK', 'LEFT', 'RIGHT'];

export default function AiScan() {
  const navigate = useNavigate();
  const { activeFarmId } = useActiveFarm();
  const { user } = useAuth();
  const farmId = activeFarmId;
  const userId = user?.id;

  const initialCache = farmId && userId ? getCachedScan(userId, farmId) : null;

  const [scanState, setScanState] = useState(initialCache ? 'results' : 'scanning');
  const [previewUrl, setPreviewUrl] = useState(initialCache?.previewUrl ?? null);
  const [resultData, setResultData] = useState(
    initialCache
      ? { detectionData: initialCache.detectionData, predictionData: initialCache.predictionData }
      : null
  );
  const [errorMsg, setErrorMsg] = useState(null);
  const [showFarmModal, setShowFarmModal] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [multiAngle, setMultiAngle] = useState(false);
  const [angle, setAngle] = useState('FRONT');
  const [photos, setPhotos] = useState([]);
  const [busy, setBusy] = useState(false);
  const [providerNotice, setProviderNotice] = useState(null);
  const [stageNotice, setStageNotice] = useState(null);
  const submitting = useRef(false);

  const uploadInputRef = useRef(null);

  const { runDetection, loading: detectionLoading } = useDetection();
  const { runPrediction, loading: predictionLoading } = useAiPrediction();
  const { saveCache, clearCache } = useScanCache(farmId);

  const isProcessing = busy || detectionLoading || predictionLoading;

  // Stages one or many files. In multi-angle mode each file takes the next
  // free angle, so a single multi-select can fill FRONT/BACK/LEFT/RIGHT.
  const stageFiles = (files, scanType) => {
    if (!multiAngle) {
      if (files[0]) runFullScan(files[0], scanType);
      return;
    }

    const used = new Set(photos.map((photo) => photo.angle));
    const staged = [...photos];
    let skipped = 0;

    for (const file of files) {
      const nextAngle = [angle, ...ANGLES].find((value) => !used.has(value));
      if (!nextAngle) {
        skipped += 1;
        continue;
      }
      used.add(nextAngle);
      const existingIndex = staged.findIndex((photo) => photo.angle === nextAngle);
      const entry = { file, angle: nextAngle, scanType };
      if (existingIndex >= 0) staged[existingIndex] = entry;
      else staged.push(entry);
    }

    setPhotos(staged);
    const freeAngle = ANGLES.find((value) => !used.has(value));
    if (freeAngle) setAngle(freeAngle);
    setStageNotice(
      skipped
        ? `Only ${ANGLES.length} angles (${ANGLES.join(', ')}) are supported. ${skipped} extra photo${skipped === 1 ? '' : 's'} skipped — remove one first.`
        : null
    );
  };

  const runAngles = async () => {
    if (!farmId || !photos.length || submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setErrorMsg(null);
    try {
      const { session } = await createScanSession({
        farmId,
        scanType: photos.some((photo) => photo.scanType === 'WEBCAM') ? 'WEBCAM' : 'UPLOAD',
      });
      const detected = [];
      const failures = [];
      for (const photo of photos) {
        try {
          const result = await runDetection({ scanSessionId: session.id, imageFile: photo.file, angle: photo.angle });
          detected.push({ ...photo, result });
        } catch (error) {
          failures.push(`${photo.angle}: ${error.message}`);
        }
      }
      if (!detected.length) throw new Error(failures.join(' '));
      const predictionData = await runPrediction({ scanSessionId: session.id, imageType: DEFAULT_IMAGE_TYPE });
      // Results are independent observations, never a deduplicated flock count.
      // Boxes belong to the previewed photo only, so they stay aligned.
      const detectionData = {
        total_chickens: predictionData.total_chickens,
        detections: detected[0].result?.detections ?? [],
      };
      const preview = await fileToBase64(detected[0].file);
      setPreviewUrl(preview);
      setResultData({ detectionData, predictionData });
      setScanState('results');
      saveCache({ previewUrl: preview, detectionData, predictionData });
      if (failures.length || predictionData.quota_exhausted) {
        setProviderNotice([predictionData.quota_message, ...failures].filter(Boolean).join(' '));
      }
    } catch (error) {
      setErrorMsg(error.message || 'Scan failed. Please try again.');
      setProviderNotice(error.message || 'Analysis is temporarily unavailable. Try again later.');
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  const runFullScan = async (file, scanType) => {
    if (submitting.current) return;
    if (!farmId) {
      setShowFarmModal(true);
      return;
    }

    setErrorMsg(null);
    submitting.current = true;
    setBusy(true);
    const blobPreview = URL.createObjectURL(file);
    setPreviewUrl(blobPreview);

    try {
      const sessionResult = await createScanSession({ farmId, scanType });
      const newScanSessionId = sessionResult.session.id;

      const detectionResult = await runDetection({
        scanSessionId: newScanSessionId,
        imageFile: file,
      });
      const predictionResult = await runPrediction({
        scanSessionId: newScanSessionId,
        imageType: DEFAULT_IMAGE_TYPE,
      });

      setResultData({ detectionData: detectionResult, predictionData: predictionResult });
      setScanState('results');
      if (predictionResult.quota_exhausted) setProviderNotice(predictionResult.quota_message);

      const base64Preview = await fileToBase64(file);
      setPreviewUrl(base64Preview);
      saveCache({
        previewUrl: base64Preview,
        detectionData: detectionResult,
        predictionData: predictionResult,
      });
    } catch (err) {
      const message = err.message || 'Scan failed. Please try again.';

      if (isFarmMissingError(message)) {
        setPreviewUrl(null);
        setShowFarmModal(true);
        return;
      }

      setErrorMsg(message);
      if (/unavailable|quota|limit|busy/i.test(message)) setProviderNotice(message);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  const handleFileSelected = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length) stageFiles(files, 'UPLOAD');
    event.target.value = '';
  };

  const handleUpload = () => {
    if (!farmId) {
      setShowFarmModal(true);
      return;
    }
    uploadInputRef.current?.click();
  };

  const handleCapture = () => {
    if (!farmId) {
      setShowFarmModal(true);
      return;
    }
    setCameraOpen(true);
  };

  const handleCameraCapture = (file) => {
    setCameraOpen(false);
    stageFiles([file], 'WEBCAM');
  };

  const handleScanAgain = () => {
    clearCache();
    setResultData(null);
    setPreviewUrl(null);
    setErrorMsg(null);
    setScanState('scanning');
    setPhotos([]);
    setAngle('FRONT');
    setStageNotice(null);
  };

  return (
    <div>
      <PageHeader
        eyebrow="AI diagnostics"
        title="AI diagnostic scanner"
        description="Position the camera to clearly capture the flock. The AI will automatically detect chickens and analyze their health status."
        actions={
          <Button variant="secondary" onClick={() => navigate('/scan/history')}>
            <MdHistory className="text-lg" aria-hidden="true" />
            Scan history
          </Button>
        }
      />

      <div className="mt-7">
        {scanState === 'scanning' && farmId && (
          <div className="mx-auto mb-5 max-w-3xl rounded-2xl border border-ink/10 bg-paper p-4 shadow-card">
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input type="checkbox" checked={multiAngle} disabled={isProcessing}
                onChange={(event) => {
                  setMultiAngle(event.target.checked);
                  setPhotos([]);
                  setAngle('FRONT');
                  setStageNotice(null);
                }} />
              Capture multiple angles
            </label>
            {multiAngle && <>
              <p className="mt-2 text-sm text-muted">Add front, back, left or right photos. Select several files at once and they are assigned in order; each angle is analyzed independently, so the same bird may appear more than once. These are observations, not a unique flock count.</p>
              <label className="mt-3 flex items-center gap-2 text-sm text-soft">
                Next photo angle
                <select value={angle} disabled={isProcessing} onChange={(event) => setAngle(event.target.value)}
                  className="rounded-lg border border-ink/15 bg-paper px-2 py-1 text-sm">
                  {ANGLES.map((value) => <option key={value}>{value}</option>)}
                </select>
              </label>
              {photos.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {photos.map((photo) => (
                    <li key={photo.angle} className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-cream-deep/45 px-3 py-2 text-sm">
                      <span className="truncate"><strong>{photo.angle}</strong> · {photo.file.name}</span>
                      <button type="button" disabled={isProcessing}
                        className="text-xs font-semibold text-sage-dark underline"
                        onClick={() => {
                          setPhotos((items) => items.filter((p) => p.angle !== photo.angle));
                          setAngle(photo.angle);
                          setStageNotice(null);
                        }}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {stageNotice && (
                <p role="status" className="mt-3 rounded-xl border border-[#E8D7B4] bg-warn-soft px-3 py-2 text-xs text-warn">
                  {stageNotice}
                </p>
              )}
              <Button className="mt-3" disabled={!photos.length || isProcessing} onClick={runAngles}>
                Analyze {photos.length} photo{photos.length === 1 ? '' : 's'}
              </Button>
            </>}
          </div>
        )}
        {farmId && (
          <Notice
            tone="info"
            title="Results are saved to your active farm"
            className="mx-auto mb-5 max-w-3xl"
          >
            Make sure you&apos;ve created or selected a farm — every scan is stored in that
            farm&apos;s history in your account.
          </Notice>
        )}

        {!farmId ? (
          <NoActiveFarmNotice />
        ) : scanState === 'scanning' ? (
          <ScanningView
            onCapture={handleCapture}
            onUpload={handleUpload}
            uploadInputRef={uploadInputRef}
            onFileSelected={handleFileSelected}
            isProcessing={isProcessing}
            previewUrl={previewUrl}
            allowMultiple={multiAngle}
            errorMsg={errorMsg}
          />
        ) : (
          <ResultsView
            onScanAgain={handleScanAgain}
            detectionData={resultData?.detectionData}
            predictionData={resultData?.predictionData}
            previewUrl={previewUrl}
          />
        )}
      </div>

      {cameraOpen && (
        <CameraCaptureModal
          onCapture={handleCameraCapture}
          onClose={() => setCameraOpen(false)}
        />
      )}

      {providerNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/75 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="provider-notice-title" className="max-w-md rounded-2xl bg-paper p-6 shadow-pop">
            <h2 id="provider-notice-title" className="text-xl font-semibold">Some analysis is unavailable</h2>
            <p className="my-4">{providerNotice}</p>
            <p className="mb-4 text-sm">Available results are kept. Free limits may reset later or tomorrow; an exact reset time is not available.</p>
            <Button autoFocus onClick={() => setProviderNotice(null)}>Close</Button>
          </section>
        </div>
      )}

      {showFarmModal && (
        <FarmRequiredModal
          onClose={() => setShowFarmModal(false)}
          onNavigate={() => navigate('/farm')}
        />
      )}
    </div>
  );
}
