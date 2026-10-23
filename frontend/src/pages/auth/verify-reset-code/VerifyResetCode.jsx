import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiKey } from "react-icons/fi";
import { verifyResetCode } from "../api/auth";
import {
  AuthLayout,
  AuthCard,
  AuthField,
  AuthSubmitButton,
  AuthAlert,
} from "../components";

export default function VerifyResetCode() {
  const location = useLocation();
  const navigate = useNavigate();
  // Email is carried via navigation state (not the URL) so it never leaks
  // into the address bar, browser history, or server logs.
  const email = location.state?.email || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length < 6) {
      setError("Please enter the 6-character code.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Validate the code against the backend before moving to the reset page.
      await verifyResetCode(code);
      navigate("/reset-password", { state: { token: code }, replace: true });
    } catch (err) {
      setError(err.message || "That code isn't valid. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        eyebrow="Verification"
        title="Enter your reset code"
        subtitle={
          email ? (
            <>
              We sent a 6-character code to{" "}
              <span className="font-semibold break-all text-[#101107]">
                {email}
              </span>
              . Enter it below to continue.
            </>
          ) : (
            "Enter the 6-character code from your email to continue."
          )
        }
      >
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && <AuthAlert>{error}</AuthAlert>}

          <AuthField
            id="reset-code"
            name="code"
            label="Reset code"
            icon={FiKey}
            type="text"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
            }
            autoComplete="one-time-code"
            inputMode="text"
            maxLength={6}
            autoFocus
            autoCapitalize="characters"
            inputClassName="tracking-[0.32em] font-semibold uppercase"
          />

          <p className="px-1 text-[11.5px] leading-5 text-[#6B6E58]">
            The code is case-insensitive and expires after a short time.
          </p>

          <AuthSubmitButton
            label="Verify code"
            loadingLabel="Verifying..."
            loading={loading}
          />
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-[#101107]/10 pt-5 text-center text-[13px] text-[#555743]">
          <span>
            Didn't get a code?{" "}
            <Link
              to="/forgot-password"
              className="font-semibold text-[#564F1E] underline-offset-4 transition-colors hover:text-[#101107] hover:underline"
            >
              Request a new one
            </Link>
          </span>
          <span aria-hidden="true" className="text-[#101107]/25">
            ·
          </span>
          <Link
            to="/login"
            className="font-semibold text-[#564F1E] underline-offset-4 transition-colors hover:text-[#101107] hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
