import { useId } from 'react';

export default function TextField({
  label,
  id,
  hint,
  error,
  icon: Icon,
  className = '',
  inputClassName = '',
  ...inputProps
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={fieldId}
          className="mb-2 block text-[10.5px] font-bold uppercase tracking-[0.14em] text-olive"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
            <Icon className="text-base" />
          </span>
        )}
        <input
          id={fieldId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error || hint ? `${fieldId}-help` : undefined}
          className={`input-field ${Icon ? 'pl-11' : ''} ${
            error ? 'border-critical/60 focus:border-critical' : ''
          } ${inputClassName}`}
          {...inputProps}
        />
      </div>
      {(error || hint) && (
        <p
          id={`${fieldId}-help`}
          className={`mt-1.5 text-[11px] leading-4 ${error ? 'font-medium text-critical' : 'text-muted'}`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
