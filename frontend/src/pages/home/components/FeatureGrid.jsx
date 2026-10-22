
import {
  MdCameraAlt,
  MdNotificationsActive,
  MdHistory,
  MdOutlineFolderShared,
} from 'react-icons/md';
import {Reveal,FeatureCard} from './index'

export default function FeatureGrid() {
  const features = [
    {
      icon: MdCameraAlt,
      title: 'Disease detection',
      description: 'Vision AI trained on common poultry conditions classifies issues straight from a coop photo.',
    },
    {
      icon: MdHistory,
      title: 'Scan history',
      description: 'Every scan is saved per farm, so patterns across weeks are easy to spot.',
    },
    {
      icon: MdNotificationsActive,
      title: 'Real-time alerts',
      description: "Flagged birds notify whoever's on shift immediately, not at end-of-day review.",
    },
    {
      icon: MdOutlineFolderShared,
      title: 'Multi-farm management',
      description: 'Switch between farms and coops from one account — built for operations, not just one shed.',
    },
  ];

  return (
    <section id="features" className="scroll-mt-20 bg-white border-y border-[#E4ECE7]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-20 md:py-28">
        <Reveal className="max-w-xl mb-12">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#14532D]">
            What you get
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#10231A] mt-3 tracking-tight">
            Built around the daily walk-through.
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}