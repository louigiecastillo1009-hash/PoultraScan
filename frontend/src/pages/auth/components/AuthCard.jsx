export default function AuthCard({ eyebrow, title, subtitle, children }) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[#101107]/10 bg-[#FCFDF7] px-5 py-7 shadow-[0_36px_90px_-52px_rgba(16,17,7,0.55)] sm:px-8 sm:py-8">
      <span
        aria-hidden="true"
        className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#B1A03E]/70 to-transparent"
      />

      <header className="mb-6">
        <div className="flex items-center gap-2.5">
          <span className="h-px w-5 bg-[#B1A03E]" aria-hidden="true" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7A6A28]">
            {eyebrow}
          </span>
        </div>

        <h1 className="auth-display mt-3 text-[clamp(1.9rem,3vw,2.3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#101107]">
          {title}
        </h1>

        <p className="mt-2.5 text-[13.5px] leading-6 text-[#555743]">
          {subtitle}
        </p>
      </header>

      {children}
    </section>
  );
}
