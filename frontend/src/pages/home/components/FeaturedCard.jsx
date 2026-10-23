import { Reveal } from './index';

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <Reveal delay={delay} className="h-full">
      <article className="group flex h-full flex-col rounded-[20px] border border-[#DDE3CC] bg-[#FBFCF4] p-5 transition-colors duration-200 hover:border-[#A9B98C] sm:p-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EDD7] text-[#4F6B3B] transition-colors duration-200 group-hover:bg-[#6E8C56] group-hover:text-[#101107]">
          <Icon className="text-xl" aria-hidden="true" />
        </span>
        <h3 className="mt-6 text-[16px] font-bold tracking-[-0.02em] text-[#101107]">
          {title}
        </h3>
        <p className="mt-2 text-[13px] leading-6 text-[#5E604D]">{description}</p>
      </article>
    </Reveal>
  );
}
