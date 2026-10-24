import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

/**
 * Floating-label field styled for the auth shell.
 * Keeps focus styling and show/hide password behavior self-contained.
 */
export default function AuthField({
  id,
  name,
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  autoComplete,
  inputMode,
  password = false,
  required = true,
  inputClassName = "",
  maxLength,
  autoFocus = false,
  autoCapitalize,
}) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const floated = focused || String(value ?? "").length > 0;
  const resolvedType = password && revealed ? "text" : type;

  return (
    <div
      className={`relative flex h-[58px] items-center rounded-2xl border px-4 transition-all duration-200 ${
        focused
          ? "border-[#6E8C56] bg-white"
          : "border-[#101107]/12 bg-[#F8FAEF] hover:border-[#101107]/20"
      }`}
    >
      <Icon
        aria-hidden="true"
        className={`mr-3 shrink-0 text-[19px] transition-colors duration-200 ${
          focused ? "text-[#564F1E]" : "text-[#6B6E58]"
        }`}
      />

      <div className="relative h-full flex-1">
        <input
          id={id}
          name={name ?? id}
          type={resolvedType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          autoFocus={autoFocus}
          autoCapitalize={autoCapitalize}
          required={required}
          spellCheck={false}
          className={`h-full w-full cursor-text border-0 bg-transparent p-0 pt-[22px] text-[15px] font-medium text-[#101107] outline-none focus:ring-0 ${inputClassName}`}
        />

        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-0 origin-left transition-all duration-200 ${
            floated
              ? "top-[11px] text-[10px] font-bold uppercase tracking-[0.14em] text-[#5B5A2A]"
              : "top-1/2 -translate-y-1/2 text-[15px] text-[#6B6E58]"
          }`}
        >
          {label}
        </label>
      </div>

      {password && (
        <button
          type="button"
          onClick={() => setRevealed((current) => !current)}
          aria-label={revealed ? "Hide password" : "Show password"}
          className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#6B6E58] transition-colors duration-200 hover:bg-[#101107]/5 hover:text-[#101107] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B1A03E]"
        >
          {revealed ? (
            <FiEyeOff className="text-[18px]" aria-hidden="true" />
          ) : (
            <FiEye className="text-[18px]" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}
