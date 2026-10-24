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

  const uploadInputRef = useRef(null);

  const { runDetection, loading: detectionLoading } = useDetection();
  const { runPrediction, loading: predictionLoading } = useAiPrediction();
  const { saveCache, clearCache } = useScanCache(farmId);

  const isProcessing = detectionLoading || predictionLoading;

  const runFullScan = async (file, scanType) => {
    if (!farmId) {
      setShowFarmModal(true);
      return;
    }

    setErrorMsg(null);
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
        file,
      });

      setResultData({ detectionData: detectionResult, predictionData: predictionResult });
      setScanState('results');

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
    }
  };

  const handleFileSelected = (event) => {
    const file = event.target.files?.[0];
    if (file) runFullScan(file, 'UPLOAD');
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
    runFullScan(file, 'WEBCAM');
  };

  const handleScanAgain = () => {
    clearCache();
    setResultData(null);
    setPreviewUrl(null);
    setErrorMsg(null);
    setScanState('scanning');
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

      {showFarmModal && (
        <FarmRequiredModal
          onClose={() => setShowFarmModal(false)}
          onNavigate={() => navigate('/farm')}
        />
      )}
    </div>
  );
}
