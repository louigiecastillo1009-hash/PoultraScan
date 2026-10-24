import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdArrowForward,
  MdCameraAlt,
  MdCheckCircle,
  MdHealthAndSafety,
  MdOutlineAgriculture,
  MdUpload,
} from 'react-icons/md';

import { Button, ModalShell, Notice } from './app/index';
import { PoultraScanLoader } from './ui';
import { useQuickScan } from '../hooks/useQuickScan';
import { CameraCaptureModal } from '../pages/ai-scan/components/index';
import { SEVERITY_STYLES } from '../constant/severity';

export default function QuickScanModal({ isOpen, onClose, farmId }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const { status, summary, error, runQuickScan, reset } = useQuickScan(farmId);

  if (!isOpen) return null;

  // Guard: no active/valid farm selected
  const hasFarm = farmId !== null && farmId !== undefined && farmId !== '';

  const handleClose = () => {
    setCameraOpen(false);
    reset();
    onClose();
  };

  const handleUploadClick = () => {
    if (!hasFarm) return;
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!hasFarm) return;
    if (file) runQuickScan(file, 'UPLOAD');
  };

  const handleCaptureClick = () => {
    if (!hasFarm) return;
    setCameraOpen(true);
  };

  const handleCameraCapture = (file) => {
    setCameraOpen(false);
    if (!hasFarm) return;
    runQuickScan(file, 'WEBCAM');
  };

  const handleMoreInfo = () => {
    handleClose();
    navigate('/scan');
  };

  const handleGoToFarms = () => {
    handleClose();
    navigate('/farm');
  };

  const severity =
    SEVERITY_STYLES[summary?.topSeverity?.toUpperCase()] || SEVERITY_STYLES.UNKNOWN;

  // While the camera is open, render ONLY the camera modal — hide the
  // sheet + backdrop entirely instead of stacking both overlays, which
  // was causing the blur bleed-through and squeezed-camera-view bug.
  if (cameraOpen) {
    return (
      <CameraCaptureModal
        onCapture={handleCameraCapture}
        onClose={() => setCameraOpen(false)}
      />
    );
  }

  return (
    <ModalShell
      open
      onClose={handleClose}
      eyebrow="Instant check"
      title="Quick scan"
      description="Capture or upload a photo to get an instant read on your flock."
      icon={<MdCameraAlt className="text-lg" />}
      size="sm"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelected}
        className="hidden"
      />

      {!hasFarm && (
        <div className="flex flex-col gap-3">
          <Notice tone="warning" title="Select a farm first">
            Please create a farm before running a scan.
          </Notice>
          <Button className="w-full" onClick={handleGoToFarms}>
            <MdOutlineAgriculture className="text-lg" aria-hidden="true" />
            Create a farm
            <MdArrowForward className="text-lg" aria-hidden="true" />
          </Button>
        </div>
      )}

      {hasFarm && status === 'idle' && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleCaptureClick}
            className="flex flex-col items-center gap-2 rounded-2xl border border-ink bg-ink px-4 py-7 text-cream transition-colors hover:bg-olive"
          >
            <MdCameraAlt className="text-2xl text-gold" aria-hidden="true" />
            <span className="text-[12.5px] font-semibold">Capture</span>
          </button>
          <button
            type="button"
            onClick={handleUploadClick}
            className="flex flex-col items-center gap-2 rounded-2xl border border-line-strong bg-paper px-4 py-7 text-ink transition-colors hover:border-sage hover:bg-cream-deep"
          >
            <MdUpload className="text-2xl text-sage-dark" aria-hidden="true" />
            <span className="text-[12.5px] font-semibold">Upload</span>
          </button>
        </div>
      )}

      {hasFarm && status === 'processing' && (
        <div className="py-10">
          <PoultraScanLoader size={48} label="Analyzing flock..." />
        </div>
      )}

      {hasFarm && status === 'error' && (
        <div className="flex flex-col gap-3">
          <Notice tone="error" title="Quick scan failed">
            {error}
          </Notice>
          <Button variant="secondary" className="w-full" onClick={reset}>
            Try again
          </Button>
        </div>
      )}

      {hasFarm && status === 'done' && summary && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 rounded-xl border border-[#CFDDB8] bg-success-soft px-3 py-2.5">
            <MdCheckCircle className="flex-shrink-0 text-lg text-sage-dark" aria-hidden="true" />
            <span className="text-[12px] font-semibold text-sage-dark">
              {summary.chickenCount} {summary.chickenCount === 1 ? 'chicken' : 'chickens'} scanned ·{' '}
              {summary.healthyCount}/{summary.chickenCount} healthy
            </span>
          </div>

          {summary.topDisease && (
            <div className={`flex items-center justify-between rounded-xl border px-3 py-2.5 ${severity.bg}`}>
              <div className="flex items-center gap-2">
                <MdHealthAndSafety className={`text-lg ${severity.text}`} aria-hidden="true" />
                <span className={`text-[12.5px] font-bold ${severity.text}`}>
                  {summary.topDisease}
                </span>
              </div>
              <span className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${severity.dot}`} aria-hidden="true" />
                <span className={`text-[9px] font-bold uppercase tracking-[0.12em] ${severity.text}`}>
                  {summary.topSeverity}
                </span>
              </span>
            </div>
          )}

          <Button className="w-full" onClick={handleMoreInfo}>
            More info
            <MdArrowForward className="text-lg" aria-hidden="true" />
          </Button>
        </div>
      )}
    </ModalShell>
  );
}
