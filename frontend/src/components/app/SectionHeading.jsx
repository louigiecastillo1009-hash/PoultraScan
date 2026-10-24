export default function SectionHeading({ eyebrow, title, description, action, className = '' }) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        {eyebrow && <span className="app-eyebrow">{eyebrow}</span>}
        <h2 className="mt-2 font-display text-[1.55rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[1.75rem]">
          {title}
        </h2>
        {description && <p className="mt-1.5 max-w-xl text-[12.5px] leading-5 text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
