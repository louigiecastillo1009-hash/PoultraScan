import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { forgotPassword } from "../api/auth";
import {
  AuthLayout,
  AuthCard,
  AuthField,
  AuthSubmitButton,
  AuthAlert,
  AuthStatusIcon,
} from "../components";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notFoundEmail, setNotFoundEmail] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const sendCode = async ({ resend = false } = {}) => {
    setLoading(true);
    setError(null);
    setNotFoundEmail(null);
    setResendMessage("");

    try {
      // The backend emails the 6-character reset code directly via Brevo.
      await forgotPassword(email);
      setIsSuccess(true);
      if (resend) {
        setResendMessage("A fresh code is on its way.");
      }
    } catch (err) {
      if (err.status === 404) {
        if (isSuccess) {
          setError("That account is no longer available. Please try again.");
        } else {
          setNotFoundEmail(email);
        }
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    await sendCode();
  };

  return (
    <AuthLayout>
      <AuthCard
        eyebrow={isSuccess ? "Check your inbox" : "Password recovery"}
        title={isSuccess ? "Reset code sent" : "Reset your password"}
        subtitle={
          isSuccess ? (
            <>
              We've emailed a 6-character reset code to{" "}
              <span className="font-semibold break-all text-[#101107]">
                {email}
              </span>
              .
            </>
          ) : (
            "Enter the email linked to your account and we'll send you a 6-character reset code."
          )
        }
      >
        {isSuccess ? (
          <div className="flex flex-col items-center text-center">
            <AuthStatusIcon icon={FiMail} />

            <p className="mt-5 max-w-[19rem] text-[13.5px] leading-6 text-[#555743]">
              Enter the code on the next screen to choose a new password. The
              code expires shortly, so use it soon.
            </p>

            <div className="mt-6 w-full">
              <AuthSubmitButton
                type="button"
                label="Enter reset code"
                onClick={() =>
                  navigate("/verify-reset-code", { state: { email } })
                }
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-1.5 text-[12.5px] text-[#555743]">
              <span>Didn't get the code?</span>
              <button
                type="button"
                onClick={() => sendCode({ resend: true })}
                disabled={loading}
                className="font-semibold text-[#564F1E] underline-offset-4 transition-colors hover:text-[#101107] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending..." : "Resend code"}
              </button>
            </div>

            {resendMessage && (
              <p
                role="status"
                className="mt-2 text-[12px] font-medium text-[#3F5C2E]"
              >
                {resendMessage}
              </p>
            )}

            {error && <AuthAlert className="mt-4 w-full text-left">{error}</AuthAlert>}
          </div>
        ) : (
          <form onSubmit={handleRequestCode} className="space-y-3.5">
            {notFoundEmail && (
              <AuthAlert tone="warning">
                We couldn't find an account for{" "}
                <span className="font-semibold break-all">{notFoundEmail}</span>
                . Check the spelling or{" "}
                <Link
                  to="/register"
                  className="font-semibold underline underline-offset-2 hover:text-[#101107]"
                >
                  create an account
                </Link>
                .
              </AuthAlert>
            )}

            {error && <AuthAlert>{error}</AuthAlert>}

            <AuthField
              id="forgot-email"
              name="email"
              label="Email address"
              icon={FiMail}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <AuthSubmitButton
              label="Send reset code"
              loadingLabel="Sending..."
              loading={loading}
            />
          </form>
        )}

        <p className="mt-6 border-t border-[#101107]/10 pt-5 text-center text-[13px] text-[#555743]">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#564F1E] underline-offset-4 transition-colors hover:text-[#101107] hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
