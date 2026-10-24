import { Link } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  backTo,
  backLabel = 'Back',
  meta,
  className = '',
  titleClassName = '',
}) {
  return (
    <header className={`flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div className="min-w-0">
        {backTo && (
          <Link
            to={backTo}
            className="mb-5 flex w-fit items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-olive transition-colors hover:text-ink"
          >
            <MdArrowBack className="text-sm" />
            {backLabel}
          </Link>
        )}

        {eyebrow && <span className="app-eyebrow">{eyebrow}</span>}

        <h1
          className={`app-display mt-3 max-w-3xl text-[clamp(2.15rem,4.5vw,3.5rem)] text-ink ${titleClassName}`}
        >
          {title}
        </h1>

        {description && (
          <p className="mt-3 max-w-2xl text-[13.5px] leading-6 text-soft sm:text-sm">
            {description}
          </p>
        )}

        {meta && <div className="mt-5 flex flex-wrap items-center gap-2.5">{meta}</div>}
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2.5 sm:justify-end">{actions}</div>
      )}
    </header>
  );
}
