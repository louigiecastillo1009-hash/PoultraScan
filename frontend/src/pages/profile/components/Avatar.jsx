import { MdCameraAlt } from 'react-icons/md';

import { PoultraScanLoader } from '../../../components/ui';
import { resolveAvatarSrc } from '../../../utils/AvatarSrc';
import { AVATAR_ICONS, getIconKey, isIconAvatar } from '../../../utils/avatarIcons';

export default function Avatar({ fullname, avatarUrl, size = 'h-24 w-24', onClick, uploading }) {
  const initials = fullname
    ? fullname
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join('')
    : '?';

  const isIcon = isIconAvatar(avatarUrl);
  const iconKey = getIconKey(avatarUrl);
  const IconEntry = isIcon ? AVATAR_ICONS[iconKey] : null;
  const src = !isIcon ? resolveAvatarSrc(avatarUrl) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-sage-soft text-[1.6rem] font-semibold text-sage-dark shadow-card ring-4 ring-paper ${
        size
      } ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {IconEntry ? (
        <IconEntry.Icon className="h-[70%] w-[70%]" />
      ) : src ? (
        <img
          src={src}
          alt={fullname || 'Profile'}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        initials
      )}

      {onClick && (
        <span className="absolute inset-0 flex items-center justify-center bg-ink/40 opacity-0 transition-opacity hover:opacity-100">
          <MdCameraAlt className="text-xl text-cream" aria-hidden="true" />
        </span>
      )}

      {uploading && (
        <span className="absolute inset-0 flex items-center justify-center bg-ink/50">
          <PoultraScanLoader size={20} label={null} className="gap-0" />
        </span>
      )}
    </button>
  );
}
