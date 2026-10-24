export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-line-strong bg-cream-deep/45 px-6 py-12 text-center ${className}`}
    >
      {Icon && (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-paper text-olive shadow-card">
          <Icon className="text-xl" />
        </span>
      )}
      <h3 className="font-display text-xl font-medium tracking-[-0.02em] text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-xs leading-5 text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
