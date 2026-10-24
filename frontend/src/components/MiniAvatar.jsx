import { AVATAR_ICONS, getIconKey } from '../utils/avatarIcons';
import { resolveAvatarSrc } from '../utils/AvatarSrc';
import { getInitials } from '../utils/getInitials';

export default function MiniAvatar({ fullname, avatarUrl, sizeClass }) {
  const iconKey = getIconKey(avatarUrl);
  const baseClass = `${sizeClass} flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-sage-soft font-semibold text-sage-dark`;

  if (iconKey && AVATAR_ICONS[iconKey]) {
    const { Icon } = AVATAR_ICONS[iconKey];
    return (
      <div className={baseClass}>
        <Icon className="h-[70%] w-[70%]" />
      </div>
    );
  }

  const src = resolveAvatarSrc(avatarUrl);

  return (
    <div className={baseClass}>
      {src ? (
        <img
          alt="User profile avatar"
          className="h-full w-full object-cover"
          src={src}
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <span className="text-xs">{getInitials(fullname)}</span>
      )}
    </div>
  );
}
