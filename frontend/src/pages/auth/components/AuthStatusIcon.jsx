import { FiCheck } from "react-icons/fi";

export default function AuthStatusIcon({ icon: Icon = FiCheck }) {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto flex h-20 w-20 items-center justify-center"
    >
      <span className="absolute inset-0 rounded-full border border-[#6E8C56]/25" />
      <span className="absolute inset-2 rounded-full bg-[#EDF3DF]" />
      <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#6E8C56] text-[#101107] shadow-[0_10px_24px_-10px_rgba(110,140,86,0.8)]">
        <Icon className="text-[24px]" />
      </span>
    </div>
  );
}
