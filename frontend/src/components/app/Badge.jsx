const tones = {
  neutral: 'border-line bg-cream-deep text-olive',
  sage: 'border-[#CFDDB8] bg-sage-soft text-sage-dark',
  success: 'border-[#CFDDB8] bg-success-soft text-sage-dark',
  warning: 'border-[#E8D7B4] bg-warn-soft text-warn',
  danger: 'border-[#E9C4BE] bg-critical-soft text-critical',
  gold: 'border-[#E4D9A6] bg-gold-soft text-olive',
  dark: 'border-ink bg-ink text-cream',
  outline: 'border-line-strong bg-transparent text-soft',
};

const sizes = {
  sm: 'px-2.5 py-1 text-[9.5px]',
  md: 'px-3 py-1.5 text-[10px]',
};

export default function Badge({
  tone = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  children,
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold uppercase leading-none tracking-[0.12em] ${
        tones[tone] || tones.neutral
      } ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}
