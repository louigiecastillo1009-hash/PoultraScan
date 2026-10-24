import { useEffect, useRef, useState } from 'react';
import { MdPhotoCamera, MdUpload } from 'react-icons/md';

import { Button, ModalShell, Notice } from '../../../components/index';
import { AVATAR_ICONS, AVATAR_ICON_KEYS, getIconKey } from '../../../utils/avatarIcons';

export default function AvatarModal({
  currentAvatarUrl,
  onSaveFile,
  onSaveIcon,
  onCancel,
  saving,
  error,
}) {
  const [tab, setTab] = useState('upload'); // 'upload' | 'icon'
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(
    getIconKey(currentAvatarUrl) || AVATAR_ICON_KEYS[0]
  );
  const fileInputRef = useRef(null);

  useEffect(
    () => () => {
      if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
    },
    [pendingPreviewUrl]
  );

  const handleFilePicked = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
    setPendingFile(file);
    setPendingPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (tab === 'upload' && pendingFile) {
      onSaveFile(pendingFile);
    } else if (tab === 'icon' && selectedIcon) {
      onSaveIcon(selectedIcon);
    }
  };

  const canSave = (tab === 'upload' && Boolean(pendingFile)) || (tab === 'icon' && Boolean(selectedIcon));

  return (
    <ModalShell
      open
      onClose={() => {
        if (!saving) onCancel();
      }}
      eyebrow="Account photo"
      title="Update profile photo"
      description="Upload a photo or choose an illustrated icon."
      icon={<MdPhotoCamera className="text-lg" />}
      size="sm"
      footer={
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={handleSave}
            disabled={saving || !canSave}
          >
            {saving ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-cream/35 border-t-cream"
                  aria-hidden="true"
                />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center">
        <div className="mb-5 flex w-full gap-1 rounded-full border border-line bg-cream-deep p-1">
          <button
            type="button"
            onClick={() => setTab('upload')}
            disabled={saving}
            className={`flex-1 rounded-full px-4 py-2 text-[11px] font-semibold transition-colors ${
              tab === 'upload'
                ? 'bg-paper text-ink shadow-card'
                : 'text-muted hover:text-ink'
            }`}
          >
            Upload photo
          </button>
          <button
            type="button"
            onClick={() => setTab('icon')}
            disabled={saving}
            className={`flex-1 rounded-full px-4 py-2 text-[11px] font-semibold transition-colors ${
              tab === 'icon' ? 'bg-paper text-ink shadow-card' : 'text-muted hover:text-ink'
            }`}
          >
            Choose icon
          </button>
        </div>

        {tab === 'upload' ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={handleFilePicked}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
              className="group relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border border-dashed border-line-strong bg-cream-deep/45 transition-colors hover:border-sage hover:bg-cream-deep"
            >
              {pendingPreviewUrl ? (
                <img src={pendingPreviewUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-1.5 text-muted">
                  <MdUpload className="text-2xl" aria-hidden="true" />
                  <span className="text-[11px] font-medium">Select a photo</span>
                </span>
              )}
              <span className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/10" />
            </button>
            {pendingPreviewUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
              >
                Choose a different photo
              </Button>
            )}
          </>
        ) : (
          <div className="grid w-full grid-cols-3 gap-2.5">
            {AVATAR_ICON_KEYS.map((key) => {
              const { Icon, label } = AVATAR_ICONS[key];
              const isSelected = selectedIcon === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedIcon(key)}
                  disabled={saving}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-colors ${
                    isSelected
                      ? 'border-sage bg-sage-soft'
                      : 'border-ink/10 bg-paper hover:border-line-strong'
                  }`}
                >
                  <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-paper">
                    <Icon className="h-[70%] w-[70%]" />
                  </span>
                  <span className="text-[10px] font-medium text-soft">{label}</span>
                </button>
              );
            })}
          </div>
        )}

        {error && (
          <Notice tone="error" className="mt-4 w-full">
            {error}
          </Notice>
        )}
      </div>
    </ModalShell>
  );
}
