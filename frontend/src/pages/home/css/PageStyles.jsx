export function PageStyles() {
  return (
    <style>{`
      html { scroll-behavior: smooth; }

      @keyframes ps-scan-sweep {
        0%   { top: 8%; opacity: 0; }
        10%  { opacity: 1; }
        90%  { opacity: 1; }
        100% { top: 88%; opacity: 0; }
      }
      @keyframes ps-float {
        0%, 100% { transform: translateY(0px); }
        50%      { transform: translateY(-8px); }
      }
      .ps-scan-line { animation: ps-scan-sweep 3.4s ease-in-out infinite; }
      .ps-float { animation: ps-float 5s ease-in-out infinite; }

      .ps-reveal {
        opacity: 0;
        transform: translateY(22px);
        transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .ps-reveal-visible {
        opacity: 1;
        transform: translateY(0);
      }

      .ps-btn {
        display: inline-flex;
        min-height: 3.15rem;
        align-items: center;
        justify-content: center;
        gap: 0.55rem;
        padding: 0.8rem 1.4rem;
        border: 1px solid transparent;
        border-radius: 0.9rem;
        font-family: inherit;
        font-size: 0.9rem;
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: -0.015em;
        white-space: nowrap;
        text-decoration: none;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition: background-color 0.18s ease, border-color 0.18s ease,
                    color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
      }
      .ps-btn:active { transform: scale(0.99); }
      .ps-btn:focus-visible {
        outline: 2px solid #41B05E;
        outline-offset: 3px;
      }

      .ps-btn-primary {
        background: #028915;
        color: #FFFFFF;
        box-shadow: 0 14px 28px -16px rgba(2, 137, 21, 0.72);
      }
      .ps-btn-primary:hover {
        background: #017612;
        box-shadow: 0 18px 34px -18px rgba(2, 137, 21, 0.8);
        transform: translateY(-1px);
      }

      .ps-btn-light {
        background: #FFFFFF;
        color: #0B0B0D;
        box-shadow: 0 14px 30px -18px rgba(0, 0, 0, 0.5);
      }
      .ps-btn-light:hover {
        background: #F1F5EE;
        transform: translateY(-1px);
      }

      .ps-btn-ghost-light {
        border-color: rgba(255, 255, 255, 0.26);
        background: rgba(255, 255, 255, 0.06);
        color: #FFFFFF;
      }
      .ps-btn-ghost-light:hover {
        border-color: rgba(255, 255, 255, 0.44);
        background: rgba(255, 255, 255, 0.12);
        transform: translateY(-1px);
      }

      .ps-btn-secondary {
        border-color: #D7DCDE;
        background: #FFFFFF;
        color: #0B0B0D;
      }
      .ps-btn-secondary:hover {
        border-color: #B7C0BA;
        background: #F7F8F7;
      }

      .ps-btn-sm {
        min-height: 2.55rem;
        padding: 0.55rem 1rem;
        border-radius: 0.8rem;
        font-size: 0.8rem;
      }

      @media (hover: none) {
        .ps-btn-primary:hover,
        .ps-btn-light:hover,
        .ps-btn-ghost-light:hover {
          transform: none;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        html { scroll-behavior: auto; }
        .ps-scan-line, .ps-float { animation: none; }
        .ps-reveal {
          opacity: 1;
          transform: none;
          transition: none;
        }
        .ps-btn { transition: none; }
        .ps-btn:hover, .ps-btn:active { transform: none; }
      }
    `}</style>
  );
}
