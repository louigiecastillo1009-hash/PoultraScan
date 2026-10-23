import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiAlertCircle,
  FiMail,
  FiLock,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useGoogleLogin } from "@react-oauth/google";
import { checkServerHealth } from "../api/auth";
import {
  AuthLayout,
  AuthCard,
  AuthField,
  AuthSubmitButton,
} from "../components";

export default function Login() {
  const { login, loading, error, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Input state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Server wake-up state
  const [serverStatus, setServerStatus] = useState("waking"); // "waking" | "ready" | "unreachable"

  useEffect(() => {
    let cancelled = false;

    const pingServer = async () => {
      try {
        await checkServerHealth();
        if (!cancelled) setServerStatus("ready");
      } catch {
        if (!cancelled) setServerStatus("unreachable");
      }
    };

    pingServer();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password, rememberMe });
      navigate("/dashboard"); // adjust to your actual post-login route
    } catch {
      // error already captured in `error` state from useAuth
    }
  };

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await loginWithGoogle(tokenResponse.access_token);
        console.log("loginWithGoogle finished, navigating...");
        navigate("/dashboard");
      } catch (err) {
        console.log("loginWithGoogle THREW:", err);
      }
    },
    onError: (err) => {
      console.log("GOOGLE ERROR FIRED:", err);
    },
  });

  return (
    <AuthLayout>
      <AuthCard
        eyebrow="Account access"
        title="Welcome back"
        subtitle="Sign in to review your flock's scans, health trends, and farm records."
      >
        {/* Server wake-up notices */}
        {serverStatus === "waking" && (
          <div
            role="status"
            className="mb-4 flex items-start gap-2.5 rounded-2xl border border-[#B1A03E]/30 bg-[#FFF9DB]/70 px-3.5 py-2.5 text-[12px] leading-5 text-[#5B5A2A]"
          >
            <span
              aria-hidden="true"
              className="mt-[7px] h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[#B1A03E]"
            />
            <span>
              Connecting to the server — this can take up to a minute if it has
              been idle.
            </span>
          </div>
        )}

        {serverStatus === "unreachable" && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2.5 rounded-2xl border border-[#9E6726]/25 bg-[#FBF4E7] px-3.5 py-2.5 text-[12px] leading-5 text-[#7A4E18]"
          >
            <FiAlertCircle
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-[15px]"
            />
            <span>
              We can't reach the server right now. Please try again in a moment.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-2xl border border-[#B3261E]/20 bg-[#FDF3F0] px-3.5 py-2.5 text-[12px] leading-5 text-[#8A2B20]"
            >
              <FiAlertCircle
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-[15px]"
              />
              <span>{error}</span>
            </div>
          )}

          <AuthField
            id="login-email"
            name="email"
            label="Email address"
            icon={FiMail}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AuthField
            id="login-password"
            name="password"
            label="Password"
            icon={FiLock}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            password
          />

          <div className="flex flex-row items-center justify-between gap-3 pt-0.5">
            <label className="group flex cursor-pointer select-none items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-[#101107]/25 accent-[#6E8C56] focus:ring-[#6E8C56]"
              />
              <span className="text-[12.5px] font-medium text-[#555743] transition-colors group-hover:text-[#101107]">
                Remember me
              </span>
            </label>

            <Link
              to="/forgot-password"
              className="text-[12.5px] font-semibold text-[#564F1E] underline-offset-4 transition-colors hover:text-[#101107] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <AuthSubmitButton
            label="Sign in"
            loadingLabel="Signing in..."
            loading={loading}
          />
        </form>

        {/* Divider */}
        <div className="relative my-5 flex items-center">
          <div className="h-px flex-grow bg-[#101107]/10" />
          <span className="mx-3 shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B6E58]">
            or
          </span>
          <div className="h-px flex-grow bg-[#101107]/10" />
        </div>

        {/* Google sign in */}
        <button
          type="button"
          onClick={() => googleLoginHandler()}
          className="flex h-[52px] w-full items-center justify-center gap-3 rounded-full border border-[#101107]/15 bg-transparent text-[13.5px] font-semibold text-[#101107] transition-all duration-200 hover:border-[#101107]/35 hover:bg-[#101107]/[0.04] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B1A03E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCFDF7]"
        >
          <svg
            aria-hidden="true"
            className="h-[18px] w-[18px] shrink-0"
            viewBox="0 0 24 24"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="mt-6 border-t border-[#101107]/10 pt-5 text-center text-[13px] text-[#555743]">
          New to PoultraScan?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#564F1E] underline-offset-4 transition-colors hover:text-[#101107] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
