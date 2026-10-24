const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-[-0.01em] transition-all duration-200 active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-50';

const variants = {
  primary:
    'bg-ink text-cream shadow-[0_10px_24px_-16px_rgba(16,17,7,0.8)] hover:bg-olive',
  sage: 'bg-sage text-ink hover:bg-ink hover:text-cream',
  secondary:
    'border border-line-strong bg-paper text-ink hover:border-sage hover:bg-cream-deep',
  ghost: 'text-soft hover:bg-ink/5 hover:text-ink',
  cream: 'bg-cream text-ink hover:bg-white',
  danger: 'bg-critical text-white hover:bg-[#8F1D17]',
  'danger-ghost':
    'border border-[#E9C4BE] bg-critical-soft text-critical hover:bg-[#F6DDD8]',
  'dark-ghost':
    'border border-cream/20 bg-transparent text-cream hover:border-cream/40 hover:bg-cream/10',
};

const sizes = {
  sm: 'min-h-9 px-3.5 text-[12px]',
  md: 'min-h-11 px-5 text-[13px]',
  lg: 'min-h-12 px-6 text-sm',
  icon: 'h-10 w-10 min-h-10 p-0',
};

function buttonStyles({ variant = 'primary', size = 'md', className = '' } = {}) {
  return [base, variants[variant] || variants.primary, sizes[size] || sizes.md, className]
    .filter(Boolean)
    .join(' ');
}

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...props
}) {
  const isButton = Tag === 'button';

  return (
    <Tag
      type={isButton ? type : undefined}
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      {children}
    </Tag>
  );
}
