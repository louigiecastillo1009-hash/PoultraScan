import { MdHome, MdAgriculture, MdHistory } from 'react-icons/md';

export const navLinks = [
  { key: 'home', label: 'Home', icon: MdHome, path: '/dashboard' },
  { key: 'farm', label: 'Farm', icon: MdAgriculture, path: '/farm' },
];

export const navLinksRight = [
  { key: 'history', label: 'History', icon: MdHistory, path: '/scan/history' },
];
