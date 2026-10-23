import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";

const TONES = {
  error: {
    wrap: "border-[#B3261E]/20 bg-[#FDF3F0] text-[#8A2B20]",
    Icon: FiAlertCircle,
  },
  warning: {
    wrap: "border-[#9E6726]/25 bg-[#FBF4E7] text-[#7A4E18]",
    Icon: FiAlertTriangle,
  },
  success: {
    wrap: "border-[#6E8C56]/30 bg-[#F1F6E5] text-[#3F5C2E]",
    Icon: FiCheckCircle,
  },
  info: {
    wrap: "border-[#B1A03E]/30 bg-[#FFF9DB]/70 text-[#5B5A2A]",
    Icon: FiInfo,
  },
};

export default function AuthAlert({ tone = "error", children, className = "" }) {
  const { wrap, Icon } = TONES[tone] ?? TONES.error;

  return (
    <div
      role={tone === "error" || tone === "warning" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-2xl border px-3.5 py-2.5 text-[12px] leading-5 ${wrap} ${className}`}
    >
      <Icon aria-hidden="true" className="mt-0.5 shrink-0 text-[15px]" />
      <span>{children}</span>
    </div>
  );
}
