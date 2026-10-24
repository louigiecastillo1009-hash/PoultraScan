import { MdPhotoCamera, MdUpload } from 'react-icons/md';

import { Button, Notice } from '../../../components/index';
import { PoultraScanLoader } from '../../../components/ui';
import AccuracyNotice from './AccuracyNotice';

export default function ScanningView({
  onCapture,
  onUpload,
  uploadInputRef,
  onFileSelected,
  isProcessing,
  previewUrl,
  errorMsg,
}) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelected}
        className="hidden"
      />

      <AccuracyNotice />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-ink/10 bg-ink p-2 shadow-pop">
        <div className="relative aspect-video overflow-hidden rounded-[1.35rem] bg-[#0B0C04] ring-1 ring-cream/10">
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(244,248,229,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(244,248,229,0.45) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
            aria-hidden="true"
          />

          {previewUrl ? (
            <img src={previewUrl} alt="Scan preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-cream/55">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cream/5 ring-1 ring-cream/10 backdrop-blur-sm">
                <MdPhotoCamera className="text-3xl text-gold/85" aria-hidden="true" />
              </span>
              <span className="max-w-xs text-[12.5px] leading-5">
                No image yet — capture or upload a photo of your flock
              </span>
            </div>
          )}

          <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-cream/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-cream backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
            Live preview
          </div>

          <div className="pointer-events-none absolute inset-4 z-[5]">
            <span className="absolute left-0 top-0 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-gold/90" />
            <span className="absolute right-0 top-0 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-gold/90" />
            <span className="absolute bottom-0 left-0 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-gold/90" />
            <span className="absolute bottom-0 right-0 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-gold/90" />
          </div>

          {!previewUrl && (
            <span className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_14px_2px_rgba(177,160,62,0.5)] animate-scan-line" />
          )}

          {isProcessing && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink/75 backdrop-blur-sm">
              <PoultraScanLoader
                size={56}
                label={previewUrl ? 'Processing results...' : 'Analyzing poultry...'}
                labelClassName="text-cream"
              />
            </div>
          )}
        </div>
      </div>

      {errorMsg && (
        <Notice tone="error" title="Scan failed" className="mt-4">
          {errorMsg}
        </Notice>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          className="h-12 w-full"
          onClick={onUpload}
          disabled={isProcessing}
        >
          <MdUpload className="text-lg text-sage-dark" aria-hidden="true" />
          Upload image
        </Button>
        <Button className="h-12 w-full" onClick={onCapture} disabled={isProcessing}>
          <MdPhotoCamera className="text-lg" aria-hidden="true" />
          Capture
        </Button>
      </div>
    </div>
  );
}
