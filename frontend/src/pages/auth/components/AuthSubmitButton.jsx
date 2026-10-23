import { FiArrowRight } from "react-icons/fi";

export default function AuthSubmitButton({
  label,
  loadingLabel = "Please wait...",
  loading = false,
  disabled = false,
  icon: Icon = FiArrowRight,
  type = "submit",
  onClick,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="group mt-1 flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#101107] text-[14px] font-semibold tracking-[-0.01em] text-[#F4F8E5] shadow-[0_20px_38px_-24px_rgba(16,17,7,0.9)] transition-all duration-200 hover:bg-[#564F1E] hover:shadow-[0_24px_42px_-24px_rgba(86,79,30,0.9)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#101107] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B1A03E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCFDF7]"
    >
      {loading ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-[#F4F8E5]/30 border-t-[#F4F8E5]"
          />
          {loadingLabel}
        </>
      ) : (
        <>
          {label}
          <Icon
            aria-hidden="true"
            className="text-[17px] transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </>
      )}
    </button>
  );
}
