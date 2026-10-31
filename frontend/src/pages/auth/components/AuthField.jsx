import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

/**
 * Auth field with a static label above the input.
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

  const resolvedType = password && revealed ? "text" : type;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13px] font-semibold text-[#3F412F]"
      >
        {label}
      </label>

      <div
        className={`flex h-[52px] items-center rounded-2xl border px-4 transition-colors duration-200 ${
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
          className={`h-full w-full cursor-text border-0 bg-transparent p-0 text-[15px] font-medium text-[#101107] outline-none focus:ring-0 ${inputClassName}`}
        />

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
    </div>
  );
}
