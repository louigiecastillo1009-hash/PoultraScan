import React, { useState } from 'react';
import { FiMail, FiArrowLeft, FiCheckCircle, FiFeather } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../api/auth';
import { AppModal } from '../../../components';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notFoundModal, setNotFoundModal] = useState(null);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // The backend emails the 6-character reset code directly via Brevo.
      await forgotPassword(email);
      setIsSuccess(true);
    } catch (err) {
      if (err.status === 404) {
        setNotFoundModal(email);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const emailFloated = emailFocused || email.length > 0;

  return (
    <div className="auth-card-side bg-[#F7FAF8] min-h-dvh flex items-center justify-center p-4 sm:p-6 font-sans antialiased text-[#10231A] w-full">
      <main className="w-full max-w-md mx-auto">
        <div className="auth-card-pad bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-card border border-[#E4ECE7] flex flex-col items-center text-center">

          {/* Logo */}
          <div className="auth-brand-mark w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#14532D] to-[#166534] flex items-center justify-center shadow-[0_8px_20px_rgba(20, 83, 45,0.35)] mb-4">
            <FiFeather className="text-white text-2xl sm:text-3xl" />
          </div>

          {isSuccess ? (
            /* Success: code was emailed — move on to the code page */
            <div className="w-full flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
              <div className="w-16 h-16 bg-[#D1FAE5] text-[#059669] rounded-full flex items-center justify-center mb-6">
                <FiCheckCircle className="text-3xl" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#10231A] mb-3">
                Check Your Email
              </h1>
              <p className="text-sm sm:text-base text-[#4B6357] mb-6 sm:mb-8 leading-relaxed break-words">
                We've sent a 6-character code to <span className="font-semibold text-[#10231A]">{email}</span>. Enter it on the next page to reset your password.
              </p>
              <button
                className="w-full h-[52px] bg-gradient-to-r from-[#14532D] via-[#166534] to-[#10B981] hover:from-[#052E16] hover:via-[#14532D] hover:to-[#166534] active:scale-[0.98] text-white rounded-xl font-semibold text-base transition-all shadow-md shadow-[#14532D]/25"
                onClick={() => navigate('/verify-reset-code', { state: { email } })}
              >
                I Have a Code — Continue
              </button>
              <button
                type="button"
                className="mt-4 text-sm text-[#4B6357] hover:text-[#14532D] transition-colors"
                onClick={async () => {
                  setError(null);
                  setLoading(true);
                  try {
                    await forgotPassword(email);
                  } catch (err) {
                    setError(err.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                {loading ? 'Sending...' : "Didn't get a code? Resend"}
              </button>
            </div>
          ) : (
            /* Step 1: Enter Email */
            <>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#10231A] mb-3">
                Reset Your Password
              </h1>
              <p className="text-sm sm:text-base text-[#4B6357] mb-6 sm:mb-8 leading-relaxed">
                Enter your email address and we'll send you a 6-character reset code.
              </p>

              <form onSubmit={handleRequestCode} className="w-full flex flex-col gap-4 sm:gap-5">
                {error && (
                  <div className="text-sm text-[#EF4444] bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-4 py-2 text-center">
                    {error}
                  </div>
                )}

                <div className="relative w-full">
                  <div className="relative flex items-center h-[58px] rounded-xl border border-[#E4ECE7] bg-white focus-within:border-[#14532D] focus-within:ring-4 focus-within:ring-[#14532D]/10 transition-all duration-300 px-5">
                    <FiMail className={`text-xl mr-3 flex-shrink-0 transition-colors duration-200 ${emailFocused ? 'text-[#14532D]' : 'text-[#4B6357]'}`} />
                    <input
                      className="w-full h-full bg-transparent border-0 p-0 pt-3.5 focus:ring-0 text-[#10231A] text-base outline-none peer"
                      id="email"
                      name="email"
                      required
                      type="email"
                      value={email}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label
                      htmlFor="email"
                      className={`absolute left-14 origin-left pointer-events-none transition-all duration-250 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                        emailFloated
                          ? 'top-1.5 scale-[0.82] font-semibold text-[#14532D]'
                          : 'top-1/2 -translate-y-1/2 scale-100 text-[#718279]'
                      }`}
                    >
                      Email address
                    </label>
                  </div>
                </div>

                <button
                  className="w-full h-[52px] bg-gradient-to-r from-[#14532D] via-[#166534] to-[#10B981] hover:from-[#052E16] hover:via-[#14532D] hover:to-[#166534] active:scale-[0.98] text-white rounded-xl font-semibold text-base shadow-md shadow-[#14532D]/25 transition-all mt-2 flex justify-center items-center disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </button>
              </form>
            </>
          )}

          {/* Back to Login Anchor */}
          <div className="mt-6 sm:mt-8">
            <a className="text-sm font-semibold text-[#14532D] hover:text-[#166534] transition-colors flex items-center gap-2"
              href="/login"
            >
              <FiArrowLeft className="text-lg" />
              Back to Login
            </a>
          </div>

        </div>
      </main>

      <AppModal
        isOpen={!!notFoundModal}
        onClose={() => setNotFoundModal(null)}
        variant="error"
        title="User Not Found"
        message={
          <>
            We couldn't find an account for{' '}
            <span className="font-semibold text-[#10231A]">{notFoundModal}</span>. Please check
            the spelling or{' '}
            <span className="font-semibold text-[#14532D]">create an account</span> before
            requesting a reset code.
          </>
        }
        onConfirm={() => setNotFoundModal(null)}
        confirmText="Got It"
      />
    </div>
  );
}