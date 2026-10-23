import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FiCheck, FiLock, FiShield } from "react-icons/fi";
import { resetPassword } from "../api/auth";
import {
  AuthLayout,
  AuthCard,
  AuthField,
  AuthSubmitButton,
  AuthAlert,
  AuthStatusIcon,
} from "../components";

function evaluatePasswordStrength(password) {
  if (!password) {
    return {
      score: 0,
      text: "Empty",
      labelClassName: "text-[#6B6E58]",
      barClassName: "bg-[#101107]/10",
    };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return {
      score,
      text: "Weak",
      labelClassName: "text-[#B3261E]",
      barClassName: "bg-[#B3261E]",
    };
  }

  if (score === 2) {
    return {
      score,
      text: "Fair",
      labelClassName: "text-[#8A6D1F]",
      barClassName: "bg-[#B1A03E]",
    };
  }

  if (score === 3) {
    return {
      score,
      text: "Good",
      labelClassName: "text-[#4D6938]",
      barClassName: "bg-[#6E8C56]",
    };
  }

  return {
    score,
    text: "Strong",
    labelClassName: "text-[#3F5C2E]",
    barClassName: "bg-[#3F5C2E]",
  };
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state?.token ?? searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const strength = evaluatePasswordStrength(password);
  const passwordsMatch = !confirmPassword || password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!passwordsMatch) {
      setFormError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setFormError("Your password must be at least 8 characters long.");
      return;
    }
    if (!token) {
      setFormError(
        "This reset link is invalid or missing a token. Please request a new code.",
      );
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, newPassword: password });
      setIsSuccess(true);
    } catch (err) {
      setFormError(err.message || "Could not reset your password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        eyebrow={isSuccess ? "All set" : "Account security"}
        title={isSuccess ? "Password updated" : "Set a new password"}
        subtitle={
          isSuccess
            ? "Your credentials have been securely updated."
            : "Choose a strong password you haven't used before."
        }
      >
        {isSuccess ? (
          <div className="flex flex-col items-center text-center">
            <AuthStatusIcon icon={FiCheck} />

            <p className="mt-5 max-w-[19rem] text-[13.5px] leading-6 text-[#555743]">
              You can now sign in to your account with your new password.
            </p>

            <div className="mt-6 w-full">
              <AuthSubmitButton
                type="button"
                label="Go to sign in"
                onClick={() => navigate("/login")}
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!token && (
              <AuthAlert tone="warning">
                This reset link is invalid or missing a token.{" "}
                <Link
                  to="/forgot-password"
                  className="font-semibold underline underline-offset-2 hover:text-[#101107]"
                >
                  Request a new code
                </Link>
                .
              </AuthAlert>
            )}

            {formError && <AuthAlert>{formError}</AuthAlert>}

            <AuthField
              id="new-password"
              name="new-password"
              label="New password"
              icon={FiLock}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (formError) setFormError(null);
              }}
              password
            />

            <AuthField
              id="confirm-password"
              name="confirm-password"
              label="Confirm new password"
              icon={FiShield}
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (formError) setFormError(null);
              }}
              password
            />

            {!passwordsMatch && (
              <p className="-mt-1 px-1 text-[11.5px] font-medium text-[#B3261E]">
                Passwords do not match.
              </p>
            )}

            <div className="pt-1">
              <div className="flex items-center justify-between gap-3 px-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B6E58]">
                  Password strength
                </span>
                <span
                  aria-live="polite"
                  className={`text-[11px] font-semibold ${strength.labelClassName}`}
                >
                  {strength.text}
                </span>
              </div>

              <div className="mt-2 flex h-1.5 gap-1.5" aria-hidden="true">
                {[1, 2, 3, 4].map((index) => (
                  <span
                    key={index}
                    className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                      password && strength.score >= index
                        ? strength.barClassName
                        : "bg-[#101107]/10"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-2 px-1 text-[11px] leading-5 text-[#6B6E58]">
                Use at least 8 characters with a mix of letters, numbers, and
                symbols.
              </p>
            </div>

            <AuthSubmitButton
              label="Reset password"
              loadingLabel="Resetting..."
              loading={loading}
              disabled={!token}
            />
          </form>
        )}

        {!isSuccess && (
          <p className="mt-6 border-t border-[#101107]/10 pt-5 text-center text-[13px] text-[#555743]">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#564F1E] underline-offset-4 transition-colors hover:text-[#101107] hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
