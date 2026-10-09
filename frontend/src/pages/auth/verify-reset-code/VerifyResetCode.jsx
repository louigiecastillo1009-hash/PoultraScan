import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FiHash, FiArrowLeft, FiCheckCircle, FiFeather } from 'react-icons/fi';
import { verifyResetCode } from '../api/auth';

export default function VerifyResetCode() {
  const location = useLocation();
  const navigate = useNavigate();
  // Email is carried via navigation state (not the URL) so it never leaks
  // into the address bar, browser history, or server logs.
  const email = location.state?.email || '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length < 6) {
      setError('Please enter the 6-character code.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Validate the code against the backend before moving to the reset page.
      await verifyResetCode(code);
      navigate('/reset-password', { state: { token: code }, replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card-side bg-[#F7FAF8] min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans antialiased text-[#10231A] w-full">
      <main className="w-full max-w-md mx-auto">
        <div className="auth-card-pad bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-card border border-[#E4ECE7] flex flex-col items-center text-center">

          {/* Brand Mark */}
          <div className="auth-brand-mark w-12 h-12 rounded-xl bg-gradient-to-br from-[#14532D] to-[#166534] flex items-center justify-center shadow-[0_6px_16px_rgba(20, 83, 45,0.30)] mb-5 sm:mb-6">
            <FiFeather className="text-white text-xl" />
          </div>

          {/* Primary Icon */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#E9F4EE] text-[#14532D] rounded-full flex items-center justify-center mb-4 sm:mb-5">
            <FiCheckCircle className="text-2xl sm:text-3xl" />
          </div>

          {/* Heading + Subtext */}
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-[#10231A] mb-3">
            Enter Reset Code
          </h1>
          <p className="text-sm sm:text-base text-[#4B6357] mb-6 sm:mb-8 leading-relaxed max-w-[340px] break-words">
            We've sent a 6-character code
            {email ? (
              <> to <span className="font-semibold text-[#10231A] break-all">{email}</span></>
            ) : (
              <> to your email</>
            )}
            . Enter it below to continue.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            {error && (
              <div className="text-sm text-[#EF4444] bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-4 py-2.5 text-center">
                {error}
              </div>
            )}

            {/* Code Input — focus ring removed, only subtle border shift */}
            <div className="relative w-full">
              <div className="relative flex items-center h-14 sm:h-[60px] rounded-xl border-2 border-[#E4ECE7]/70 bg-[#F7FAF8]/60 focus-within:border-[#14532D] focus-within:bg-white transition-all duration-300 px-4 sm:px-5">
                <FiHash className="text-xl mr-3 flex-shrink-0 text-[#4B6357]" />
                <input
                  className="w-full h-full bg-transparent border-0 p-0 text-[#10231A] text-lg outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 shadow-none tracking-[0.3em] uppercase font-semibold placeholder:text-[#718279]/60 placeholder:tracking-[0.3em] placeholder:font-semibold"
                  placeholder="XXXXXX"
                  maxLength={6}
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              className="w-full h-[52px] bg-gradient-to-r from-[#14532D] via-[#166534] to-[#10B981] hover:from-[#052E16] hover:via-[#14532D] hover:to-[#166534] active:scale-[0.98] text-white rounded-xl font-semibold text-base shadow-md shadow-[#14532D]/25 transition-all mt-1 flex justify-center items-center disabled:opacity-50 focus:outline-none"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Continue'}
            </button>
          </form>

          {/* Resend Hint */}
          <div className="mt-5 sm:mt-6 text-sm text-[#4B6357]">
            Didn't get a code?{' '}
            <Link
              to="/forgot-password"
              className="font-semibold text-[#14532D] hover:text-[#166534] transition-colors"
            >
              Try again
            </Link>
          </div>

          {/* Divider */}
          <div className="w-full flex items-center gap-3 my-5 sm:my-7">
            <div className="flex-1 h-px bg-[#E9F4EE]" />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#718279]">or</span>
            <div className="flex-1 h-px bg-[#E9F4EE]" />
          </div>

          {/* Back to Login */}
          <Link
            className="text-sm font-semibold text-[#14532D] hover:text-[#166534] transition-colors flex items-center gap-2"
            to="/login"
          >
            <FiArrowLeft className="text-lg" />
            Back to Login
          </Link>

        </div>
      </main>
    </div>
  );
}