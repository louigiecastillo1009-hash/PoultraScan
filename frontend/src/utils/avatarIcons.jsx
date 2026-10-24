// Shared farm-character icon set. Each icon is a flat-vector bust illustration
// of a person in a farm role. avatar_url stores these as "icon:<key>" strings.

function FarmerIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shirt */}
      <path d="M10 60c0-10 8-16 22-16s22 6 22 16z" fill="#4D6938" />
      <path d="M24 46c2 3 5 4 8 4s6-1 8-4l-2 6c-2 2-4 3-6 3s-4-1-6-3z" fill="#E9EFDA" />
      {/* Neck */}
      <rect x="27" y="34" width="10" height="10" rx="3" fill="#E3A97A" />
      {/* Head */}
      <circle cx="32" cy="27" r="13" fill="#EFB98A" />
      {/* Straw hat */}
      <ellipse cx="32" cy="17" rx="17" ry="4.5" fill="#D9A441" />
      <path d="M20 17c0-6 5-10 12-10s12 4 12 10c-3-2-8-3-12-3s-9 1-12 3z" fill="#F59E0B" />
      <path d="M22 16.5c2-1 6-1.5 10-1.5s8 .5 10 1.5" stroke="#C4922F" strokeWidth="1" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="27.5" cy="28" r="1.4" fill="#101107" />
      <circle cx="36.5" cy="28" r="1.4" fill="#101107" />
    </svg>
  );
}

function VetIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Coat */}
      <path d="M10 60c0-10 8-16 22-16s22 6 22 16z" fill="#FCFDF7" />
      <path d="M24 46c2 3 5 4 8 4s6-1 8-4v14H24z" fill="#FCFDF7" />
      <path d="M24 46l3 4-3 4-2-6zM40 46l-3 4 3 4 2-6z" fill="#DDE3CF" />
      {/* Stethoscope */}
      <path d="M22 48c0 6 4 9 10 9s10-3 10-9" stroke="#4D6938" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="57" r="2.4" fill="#4D6938" />
      {/* Neck */}
      <rect x="27" y="34" width="10" height="10" rx="3" fill="#C98A55" />
      {/* Head */}
      <circle cx="32" cy="27" r="13" fill="#D99B66" />
      {/* Hair */}
      <path d="M19 24c0-8 6-13 13-13s13 5 13 13c-2-3-6-5-13-5s-11 2-13 5z" fill="#2B2118" />
      {/* Eyes */}
      <circle cx="27.5" cy="28" r="1.4" fill="#101107" />
      <circle cx="36.5" cy="28" r="1.4" fill="#101107" />
    </svg>
  );
}

function AgronomistIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shirt */}
      <path d="M10 60c0-10 8-16 22-16s22 6 22 16z" fill="#4D6938" />
      <path d="M24 46c2 3 5 4 8 4s6-1 8-4l-2 6c-2 2-4 3-6 3s-4-1-6-3z" fill="#E9EFDA" />
      {/* Clipboard */}
      <rect x="10" y="46" width="10" height="13" rx="1.5" fill="#EFE6D6" transform="rotate(-12 10 46)" />
      <rect x="12" y="48" width="6" height="1.4" fill="#8A6A2A" transform="rotate(-12 12 48)" />
      <rect x="11.3" y="50.5" width="6" height="1.4" fill="#8A6A2A" transform="rotate(-12 11.3 50.5)" />
      {/* Neck */}
      <rect x="27" y="34" width="10" height="10" rx="3" fill="#8C5A3C" />
      {/* Head */}
      <circle cx="32" cy="27" r="13" fill="#9C6B48" />
      {/* Hair */}
      <path d="M19 25c-1-9 5-15 13-15s14 6 13 15c-1-4-3-7-6-8 1 2 1 4 0 5-2-3-5-4-7-4s-5 1-7 4c-1-1-1-3 0-5-3 1-5 4-6 8z" fill="#1E1712" />
      {/* Glasses */}
      <circle cx="27.5" cy="28" r="3.2" fill="none" stroke="#101107" strokeWidth="1.2" />
      <circle cx="36.5" cy="28" r="3.2" fill="none" stroke="#101107" strokeWidth="1.2" />
      <path d="M30.7 28h1.6" stroke="#101107" strokeWidth="1.2" />
      <circle cx="27.5" cy="28" r="1.1" fill="#101107" />
      <circle cx="36.5" cy="28" r="1.1" fill="#101107" />
    </svg>
  );
}

function RancherIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shirt */}
      <path d="M10 60c0-10 8-16 22-16s22 6 22 16z" fill="#8F4130" />
      <path d="M24 46c2 3 5 4 8 4s6-1 8-4l-1 14H25z" fill="#B5533C" />
      {/* Bandana */}
      <path d="M27 42h10l-3 6h-4z" fill="#D9A441" />
      {/* Neck */}
      <rect x="27" y="34" width="10" height="8" rx="3" fill="#D2905F" />
      {/* Head */}
      <circle cx="32" cy="26" r="13" fill="#E3A06A" />
      {/* Cowboy hat */}
      <ellipse cx="32" cy="17" rx="18" ry="4" fill="#7A4A2A" />
      <path d="M21 17c0-6 5-9 11-9s11 3 11 9c-3-2-7-3-11-3s-8 1-11 3z" fill="#8F5A34" />
      {/* Eyes */}
      <circle cx="27.5" cy="27" r="1.4" fill="#101107" />
      <circle cx="36.5" cy="27" r="1.4" fill="#101107" />
    </svg>
  );
}

function FieldWorkerIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shirt */}
      <path d="M10 60c0-10 8-16 22-16s22 6 22 16z" fill="#6E8C56" />
      <path d="M24 46c2 3 5 4 8 4s6-1 8-4l-2 6c-2 2-4 3-6 3s-4-1-6-3z" fill="#E9EFDA" />
      {/* Neck */}
      <rect x="27" y="34" width="10" height="10" rx="3" fill="#7A4A2A" />
      {/* Head */}
      <circle cx="32" cy="27" r="13" fill="#8C5A34" />
      {/* Headscarf */}
      <path d="M18 25c0-9 6-15 14-15s14 6 14 15c0-3-2-5-4-6l2 8-4-3v6l-4-4v5l-4-3v4l-4-4v3l-4-3v-3l-4 3c-2-1-4-3-4-6z" fill="#D9A441" />
      <path d="M45 22c2 1 4 4 4 8-2-1-4-3-5-6z" fill="#F59E0B" />
      {/* Eyes */}
      <circle cx="27.5" cy="29" r="1.4" fill="#101107" />
      <circle cx="36.5" cy="29" r="1.4" fill="#101107" />
    </svg>
  );
}

export const AVATAR_ICONS = {
  farmer: { label: 'Farmer', Icon: FarmerIcon },
  vet: { label: 'Vet', Icon: VetIcon },
  agronomist: { label: 'Agronomist', Icon: AgronomistIcon },
  rancher: { label: 'Rancher', Icon: RancherIcon },
  fieldworker: { label: 'Field Worker', Icon: FieldWorkerIcon },
};

export const AVATAR_ICON_KEYS = Object.keys(AVATAR_ICONS);

export function isIconAvatar(avatarUrl) {
  return typeof avatarUrl === 'string' && avatarUrl.startsWith('icon:');
}

export function getIconKey(avatarUrl) {
  return isIconAvatar(avatarUrl) ? avatarUrl.slice(5) : null;
}