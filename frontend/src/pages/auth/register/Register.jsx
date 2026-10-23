import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiAlertCircle,
  FiCheck,
  FiLock,
  FiMail,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import {
  AuthLayout,
  AuthCard,
  AuthField,
  AuthSubmitButton,
} from "../components";
import {
  InfoModal,
  PrivacyPolicyContent,
  TermsOfServiceContent,
} from "../../../components";

function SuccessModal({ onDone }) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      onDone();
    }, 3000);

    const tickInterval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(tickInterval);
    };
  }, [onDone]);

  return (
    <div className="auth-scope fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#101107]/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-sm overflow-hidden rounded-[28px] border border-[#101107]/10 bg-[#FCFDF7] p-7 text-center shadow-[0_40px_90px_-40px_rgba(16,17,7,0.75)] sm:p-8">
        <span
          aria-hidden="true"
          className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#B1A03E]/70 to-transparent"
        />

        <div className="relative mx-auto h-20 w-20">
          <svg
            aria-hidden="true"
            className="h-20 w-20"
            viewBox="0 0 80 80"
          >
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#E6EBD6"
              strokeWidth="3"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#6E8C56"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="226.19"
              strokeDashoffset="226.19"
              style={{
                animation: "authCircleDraw 0.6s ease-out forwards",
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
              }}
            />
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: "authCheckPop 0.4s ease-out 0.5s both" }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6E8C56] shadow-[0_10px_24px_-10px_rgba(110,140,86,0.8)]">
              <FiCheck
                className="text-[22px] text-[#101107]"
                strokeWidth={3}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <h2 className="auth-display mt-5 text-[26px] font-semibold leading-tight tracking-[-0.03em] text-[#101107]">
          Account created
        </h2>
        <p className="mt-2 text-[13.5px] leading-6 text-[#555743]">
          Your PoultraScan AI account is ready. Taking you to sign in in{" "}
          <span className="font-semibold text-[#101107]">{countdown}</span>...
        </p>

        <style>{`
          @keyframes authCircleDraw {
            to { stroke-dashoffset: 0; }
          }
          @keyframes authCheckPop {
            0% { opacity: 0; transform: scale(0.5); }
            70% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default function Register() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formError, setFormError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [legalDoc, setLegalDoc] = useState(null); // null | "terms" | "privacy"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("Passwords do not match!");
      return;
    }

    const username = email.split("@")[0];

    try {
      await register({
        fullname: fullName,
        username,
        email,
        password,
      });
      setShowSuccess(true);
    } catch (err) {
      setFormError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <>
      <AuthLayout>
        <AuthCard
          eyebrow="Create your account"
          title="Start with a clearer view"
          subtitle="Set up your account to organize scans, health notes, and farm records in one place."
        >
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {(formError || error) && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-2xl border border-[#B3261E]/20 bg-[#FDF3F0] px-3.5 py-2.5 text-[12px] leading-5 text-[#8A2B20]"
              >
                <FiAlertCircle
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[15px]"
                />
                <span>{formError || error}</span>
              </div>
            )}

            <AuthField
              id="register-full-name"
              name="fullName"
              label="Full name"
              icon={FiUser}
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <AuthField
              id="register-email"
              name="email"
              label="Email address"
              icon={FiMail}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <AuthField
              id="register-password"
              name="password"
              label="Password"
              icon={FiLock}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              password
            />

            <AuthField
              id="register-confirm-password"
              name="confirmPassword"
              label="Confirm password"
              icon={FiShield}
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              password
            />

            <div className="flex items-start gap-2.5 pt-0.5">
              <input
                id="terms"
                name="terms"
                required
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-[#101107]/25 accent-[#6E8C56] focus:ring-[#6E8C56]"
              />
              <p className="text-[11.5px] leading-5 text-[#555743]">
                <label htmlFor="terms" className="cursor-pointer">
                  I agree to the
                </label>{" "}
                <button
                  type="button"
                  onClick={() => setLegalDoc("terms")}
                  className="font-semibold text-[#564F1E] underline decoration-[#564F1E]/30 underline-offset-2 transition-colors hover:text-[#101107] hover:decoration-[#101107]/50"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => setLegalDoc("privacy")}
                  className="font-semibold text-[#564F1E] underline decoration-[#564F1E]/30 underline-offset-2 transition-colors hover:text-[#101107] hover:decoration-[#101107]/50"
                >
                  Privacy Policy
                </button>
                .
              </p>
            </div>

            <AuthSubmitButton
              label="Create account"
              loadingLabel="Creating account..."
              loading={loading}
            />
          </form>

          <p className="mt-6 border-t border-[#101107]/10 pt-5 text-center text-[13px] text-[#555743]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#564F1E] underline-offset-4 transition-colors hover:text-[#101107] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </AuthCard>
      </AuthLayout>

      {showSuccess && <SuccessModal onDone={() => navigate("/login")} />}

      <InfoModal
        isOpen={legalDoc === "terms"}
        onClose={() => setLegalDoc(null)}
        title="Terms of Service"
      >
        <TermsOfServiceContent />
      </InfoModal>

      <InfoModal
        isOpen={legalDoc === "privacy"}
        onClose={() => setLegalDoc(null)}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </InfoModal>
    </>
  );
}
