const tones = {
  paper: 'border-ink/10 bg-paper text-ink shadow-card',
  white: 'border-ink/10 bg-white text-ink shadow-card',
  cream: 'border-ink/10 bg-cream-deep text-ink',
  dark: 'border-ink bg-ink text-cream shadow-pop',
  outline: 'border-ink/15 bg-transparent text-ink',
  'outline-strong': 'border-ink/25 bg-transparent text-ink',
};

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
  xl: 'p-6 sm:p-10',
};

const radii = {
  md: 'rounded-2xl',
  lg: 'rounded-[1.5rem]',
  xl: 'rounded-[1.75rem]',
};

export default function Surface({
  as: Tag = 'section',
  tone = 'paper',
  padding = 'md',
  radius = 'lg',
  className = '',
  children,
  ...props
}) {
  return (
    <Tag
      className={`border ${tones[tone] || tones.paper} ${paddings[padding] || paddings.md} ${
        radii[radius] || radii.lg
      } ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
