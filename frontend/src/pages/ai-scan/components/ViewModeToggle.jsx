import { MdGridView, MdTableView, MdViewCarousel, MdViewList } from 'react-icons/md';

const VIEWS = [
  { key: 'table', icon: MdTableView, label: 'Table view' },
  { key: 'card', icon: MdGridView, label: 'Card view' },
  { key: 'list', icon: MdViewList, label: 'List view' },
  { key: 'carousel', icon: MdViewCarousel, label: 'Carousel view' },
];

export default function ViewModeToggle({ value, onChange }) {
  return (
    <div
      role="group"
      aria-label="View mode"
      className="inline-flex items-center gap-0.5 rounded-full border border-line bg-cream-deep p-1"
    >
      {VIEWS.map(({ key, icon: Icon, label }) => {
        const isActive = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={isActive}
            aria-label={label}
            title={label}
            className={`flex h-8 w-9 items-center justify-center rounded-full transition-colors ${
              isActive
                ? 'bg-paper text-ink shadow-card'
                : 'text-muted hover:bg-paper/70 hover:text-ink'
            }`}
          >
            <Icon className="text-lg" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
