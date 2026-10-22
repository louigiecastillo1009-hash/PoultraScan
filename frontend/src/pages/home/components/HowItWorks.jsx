import {Reveal,StepCard} from './index'

export default function HowItWorks() {
  const steps = [
    {
      index: '01',
      title: 'Capture',
      description: "Snap a photo or short clip of the coop — from your phone, no special equipment needed.",
    },
    {
      index: '02',
      title: 'Analyze',
      description: 'The model checks posture, feather condition, and movement per bird against known disease markers.',
    },
    {
      index: '03',
      title: 'Act',
      description: 'Get a flagged list with recommended next steps for every bird scanned.',
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-20 max-w-[1200px] mx-auto px-4 md:px-8 py-20 md:py-28">
      <Reveal className="max-w-xl mb-12">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#14532D]">
          How it works
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#10231A] mt-3 tracking-tight">
          Three steps, most of it automatic.
        </h2>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-5">
        {steps.map((s, i) => (
          <StepCard key={s.index} {...s} delay={i * 100} />
        ))}
      </div>
    </section>
  );
}