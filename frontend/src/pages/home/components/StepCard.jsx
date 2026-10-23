import { Reveal } from './index';

export default function StepCard({ index, title, description, delay = 0, icon: Icon }) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="flex h-full flex-col border-t border-[#F4F8E5]/20 pt-6">
        <div className="flex items-center justify-between gap-4">
          <span className="ps-display text-[2rem] font-semibold leading-none text-[#B1A03E]">
            {index}
          </span>
          {Icon && (
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F4F8E5]/20 text-[#CCB4A0]">
              <Icon className="text-lg" aria-hidden="true" />
            </span>
          )}
        </div>
        <h3 className="mt-6 text-[17px] font-bold tracking-[-0.02em] text-[#F4F8E5]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#F4F8E5]/65">{description}</p>
      </div>
    </Reveal>
  );
}
