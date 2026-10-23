import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { MdBiotech } from "react-icons/md";

const HIGHLIGHTS = [
  "Health and weight estimates",
  "Farm-linked scan history",
  "Market-readiness insights",
];

/**
 * Shared shell for the Login and Register pages.
 * Warm cream canvas + editorial photo panel, matching the public home page.
 */
export default function AuthLayout({ children }) {
  const year = new Date().getFullYear();

  // Match the document canvas to the auth page so browser overscroll/rubber
  // banding never reveals the app's light background underneath.
  useEffect(() => {
    const previousBodyBackground = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#F4F8E5";

    return () => {
      document.body.style.backgroundColor = previousBodyBackground;
    };
  }, []);

  return (
    <div className="auth-scope relative min-h-dvh w-full overflow-hidden bg-[#F4F8E5] text-[#101107] antialiased">
      <style>{`
        .auth-scope {
          --auth-cream: #F4F8E5;
          --auth-ink: #101107;
          --auth-sage: #6E8C56;
          --auth-olive: #564F1E;
          --auth-gold: #B1A03E;
        }

        .auth-scope .auth-display {
          font-family: var(--font-display, "Fraunces", Georgia, "Times New Roman", serif);
          font-optical-sizing: auto;
        }

        .auth-scope input:-webkit-autofill,
        .auth-scope input:-webkit-autofill:hover,
        .auth-scope input:-webkit-autofill:focus {
          -webkit-text-fill-color: #101107;
          -webkit-box-shadow: 0 0 0 1000px #F8FAEF inset;
          caret-color: #101107;
          transition: background-color 9999s ease-out 0s;
        }

        .auth-scope input::-ms-reveal {
          display: none;
        }

        @media (max-height: 780px) and (min-width: 1024px) {
          .auth-aside-highlights {
            display: none;
          }
          .auth-aside-headline {
            font-size: 2.15rem !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .auth-scope *,
          .auth-scope *::before,
          .auth-scope *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>

      <div className="flex min-h-dvh flex-col lg:flex-row">
        {/* Editorial brand panel */}
        <aside className="relative hidden shrink-0 overflow-hidden bg-[#101107] lg:flex lg:w-[46%] xl:w-[48%]">
          <img
            src="/img/left-hero.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-[1.02] object-cover object-[62%_40%]"
            fetchPriority="high"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-[#101107]/80 via-[#101107]/35 to-[#101107]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#101107]/45 via-transparent to-[#101107]/20"
          />

          <div className="relative z-10 flex h-full w-full flex-col justify-between p-9 xl:p-12">
            <Link
              to="/home"
              aria-label="PoultraScan AI home"
              className="group inline-flex items-center gap-3 self-start rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B1A03E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#101107]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6E8C56] text-[#101107] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.8)] transition-transform duration-200 group-hover:scale-105">
                <MdBiotech className="text-[24px]" aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="auth-display text-[20px] font-semibold tracking-[-0.02em] text-[#F4F8E5]">
                  PoultraScan
                </span>
                <span className="mt-1.5 text-[8.5px] font-bold uppercase tracking-[0.2em] text-[#CDBF73]">
                  AI flock diagnostics
                </span>
              </span>
            </Link>

            <div className="max-w-[30rem]">
              <div className="flex items-center gap-2.5">
                <span className="h-px w-7 bg-[#B1A03E]" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#CDBF73]">
                  Poultry care, clarified
                </span>
              </div>

              <h2 className="auth-display auth-aside-headline mt-5 text-[clamp(2.3rem,3.1vw,3.15rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-[#F4F8E5]">
                A clearer view of every{" "}
                <span className="italic text-[#CCB4A0]">flock.</span>
              </h2>

              <p className="mt-4 max-w-[27rem] text-[13.5px] leading-7 text-[#F4F8E5]/70">
                Capture a photo, review AI-assisted health and market-readiness
                estimates, and keep every scan linked to the right farm.
              </p>

              <ul className="auth-aside-highlights mt-7 grid gap-3">
                {HIGHLIGHTS.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-[12px] font-medium text-[#F4F8E5]/75"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 shrink-0 rounded-full bg-[#B1A03E]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[10.5px] font-medium tracking-[0.02em] text-[#F4F8E5]/35">
              © {year} PoultraScan AI. All rights reserved.
            </p>
          </div>
        </aside>

        {/* Form panel */}
        <main className="relative flex min-w-0 flex-1 flex-col">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[#6E8C56]/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-[#CCB4A0]/20 blur-3xl"
          />

          <header className="relative z-10 flex items-center justify-between gap-4 px-5 pb-1 pt-5 sm:px-8 sm:pt-7 lg:justify-end lg:px-10 lg:pt-8">
            {/* Compact brand for mobile and tablet */}
            <Link
              to="/home"
              aria-label="PoultraScan AI home"
              className="inline-flex items-center gap-2.5 rounded-xl lg:hidden"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6E8C56] text-[#101107]">
                <MdBiotech className="text-[20px]" aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="auth-display text-[17px] font-semibold tracking-[-0.02em]">
                  PoultraScan
                </span>
                <span className="mt-1 text-[7.5px] font-bold uppercase tracking-[0.16em] text-[#7A6A28]">
                  AI flock diagnostics
                </span>
              </span>
            </Link>

            <Link
              to="/home"
              className="group inline-flex h-10 items-center gap-2 rounded-full border border-[#101107]/15 bg-white/60 px-4 text-[12px] font-semibold text-[#3F412F] backdrop-blur-sm transition-colors duration-200 hover:border-[#101107]/35 hover:bg-white hover:text-[#101107] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B1A03E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F8E5]"
            >
              <FiArrowLeft
                className="text-[15px] transition-transform duration-200 group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
              Back to home
            </Link>
          </header>

          <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
            <div className="w-full max-w-[432px] animate-fade-in-up">
              {children}
            </div>
          </div>

          <p className="relative z-10 px-6 pb-5 text-center text-[10.5px] leading-5 text-[#555743]/70">
            AI-assisted estimates, not a veterinary diagnosis. Confirm concerns
            with a licensed poultry veterinarian.
          </p>
        </main>
      </div>
    </div>
  );
}
