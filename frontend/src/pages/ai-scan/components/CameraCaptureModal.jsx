import { useEffect, useRef, useState } from 'react';
import {
  MdCameraAlt,
  MdClose,
  MdStayCurrentLandscape,
  MdStayCurrentPortrait,
} from 'react-icons/md';

import { Button } from '../../../components/index';

export default function CameraCaptureModal({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const [orientation, setOrientation] = useState('landscape'); // 'landscape' | 'portrait'

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setReady(true);
        }
      } catch (err) {
        setError(err.message || 'Could not access camera');
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleSnap = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
      },
      'image/jpeg',
      0.92
    );
  };

  const handleClose = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    onClose();
  };

  const toggleOrientation = () => {
    setOrientation((previous) => (previous === 'landscape' ? 'portrait' : 'landscape'));
  };

  const isPortrait = orientation === 'portrait';

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/85 p-3 backdrop-blur-md sm:p-6">
      <div className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-[1.75rem] border border-cream/10 bg-[#0B0C04] shadow-modal">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-cream/10 px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={toggleOrientation}
            aria-label="Toggle camera orientation"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-cream/15 bg-cream/10 px-3 text-[10.5px] font-semibold text-cream transition-colors hover:bg-cream/15"
          >
            {isPortrait ? (
              <MdStayCurrentLandscape className="text-lg" aria-hidden="true" />
            ) : (
              <MdStayCurrentPortrait className="text-lg" aria-hidden="true" />
            )}
            {isPortrait ? 'Landscape' : 'Portrait'}
          </button>

          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-cream/50">
            Camera capture
          </p>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close camera"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 bg-cream/10 text-cream transition-colors hover:bg-cream/15"
          >
            <MdClose className="text-lg" aria-hidden="true" />
          </button>
        </header>

        <div className="flex items-center justify-center px-4 py-5 sm:px-6">
          <div
            className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-black transition-all duration-300 ease-out ${
              isPortrait
                ? 'aspect-[3/4] h-[52dvh] max-h-[560px] w-auto'
                : 'aspect-video max-h-[58dvh] w-full'
            }`}
          >
            {error ? (
              <p className="px-6 text-center text-[12.5px] text-[#F3B4AE]">{error}</p>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />
            )}

            <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-ink/45 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-cream backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
              Live
            </span>

            <div className="pointer-events-none absolute inset-4">
              <span className="absolute left-0 top-0 h-5 w-5 rounded-tl border-l-2 border-t-2 border-gold/85" />
              <span className="absolute right-0 top-0 h-5 w-5 rounded-tr border-r-2 border-t-2 border-gold/85" />
              <span className="absolute bottom-0 left-0 h-5 w-5 rounded-bl border-b-2 border-l-2 border-gold/85" />
              <span className="absolute bottom-0 right-0 h-5 w-5 rounded-br border-b-2 border-r-2 border-gold/85" />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 justify-center border-t border-cream/10 px-4 py-4">
          <Button
            type="button"
            onClick={handleSnap}
            disabled={!ready || Boolean(error)}
            className="h-12 w-full bg-gold text-ink hover:bg-cream sm:w-auto sm:px-10"
          >
            <MdCameraAlt className="text-xl" aria-hidden="true" />
            Take photo
          </Button>
        </div>
      </div>
    </div>
  );
}
