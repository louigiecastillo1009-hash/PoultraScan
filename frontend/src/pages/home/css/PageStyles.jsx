export function PageStyles() {
  return (
    <style>{`
      html { scroll-behavior: smooth; }

      .ps-home {
        --ps-cream: #F4F8E5;
        --ps-ink: #101107;
        --ps-sage: #6E8C56;
        --ps-olive: #564F1E;
        --ps-gold: #B1A03E;
        --ps-taupe: #CCB4A0;
        --ps-warm: #C2B4A3;
        --ps-brown: #9E6726;
        --ps-muted: #555743;
        --ps-line: rgba(16, 17, 7, 0.14);
        --ps-line-strong: rgba(16, 17, 7, 0.24);
        --ps-display: "Fraunces", Georgia, "Times New Roman", serif;
        --ps-body: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, sans-serif;

        background-color: var(--ps-cream);
        color: var(--ps-ink);
        font-family: var(--ps-body);
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
      }

      .ps-home ::selection {
        background: var(--ps-sage);
        color: var(--ps-cream);
      }

      .ps-home :where(a, button):focus-visible {
        outline: 2px solid var(--ps-gold);
        outline-offset: 3px;
        border-radius: 4px;
      }

      .ps-home .ps-container {
        width: 100%;
        max-width: 1240px;
        margin-inline: auto;
        padding-inline: 1.25rem;
      }

      .ps-home .ps-section {
        padding-block: 4.75rem;
      }

      .ps-home .ps-section-preview {
        padding-top: 4.75rem;
        padding-bottom: 2.5rem;
      }

      .ps-home .ps-anchor {
        scroll-margin-top: 6.5rem;
      }

      .ps-home .ps-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        color: var(--ps-olive);
        font-size: 0.6875rem;
        font-weight: 700;
        letter-spacing: 0.18em;
        line-height: 1.4;
        text-transform: uppercase;
      }

      .ps-home .ps-eyebrow-light {
        color: #CDBF73;
      }

      .ps-home .ps-eyebrow-dot {
        display: inline-block;
        width: 0.4rem;
        height: 0.4rem;
        flex-shrink: 0;
        border-radius: 999px;
        background: var(--ps-gold);
      }

      .ps-home .ps-h1,
      .ps-home .ps-h2,
      .ps-home .ps-h3 {
        font-family: var(--ps-display);
        font-optical-sizing: auto;
        font-weight: 500;
        text-wrap: balance;
      }

      .ps-home .ps-h1 {
        font-size: clamp(2.55rem, 6.7vw, 5.4rem);
        letter-spacing: -0.042em;
        line-height: 0.98;
      }

      .ps-home .ps-h2 {
        font-size: clamp(2.05rem, 4.4vw, 3.55rem);
        letter-spacing: -0.032em;
        line-height: 1.04;
      }

      .ps-home .ps-h3 {
        font-size: clamp(1.5rem, 2.5vw, 2.05rem);
        letter-spacing: -0.02em;
        line-height: 1.12;
      }

      .ps-home .ps-lead {
        color: var(--ps-muted);
        font-size: 1.0625rem;
        line-height: 1.8;
        max-width: 42rem;
        text-wrap: pretty;
      }

      .ps-home .ps-copy {
        color: var(--ps-muted);
        font-size: 0.9375rem;
        line-height: 1.75;
        text-wrap: pretty;
      }

      .ps-home .ps-btn {
        display: inline-flex;
        min-height: 3.15rem;
        align-items: center;
        justify-content: center;
        gap: 0.55rem;
        border: 1px solid transparent;
        border-radius: 999px;
        padding: 0.82rem 1.35rem;
        font-family: var(--ps-body);
        font-size: 0.875rem;
        font-weight: 600;
        letter-spacing: -0.012em;
        line-height: 1.2;
        text-align: center;
        text-decoration: none;
        white-space: nowrap;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition: background-color 0.2s ease, border-color 0.2s ease,
                    color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
      }

      .ps-home .ps-btn:active {
        transform: scale(0.985);
      }

      .ps-home .ps-btn-primary {
        border-color: var(--ps-sage);
        background: var(--ps-sage);
        color: var(--ps-ink);
        box-shadow: 0 14px 28px -22px rgba(16, 17, 7, 0.65);
      }

      .ps-home .ps-btn-primary:hover {
        border-color: var(--ps-ink);
        background: var(--ps-ink);
        color: var(--ps-cream);
      }

      .ps-home .ps-btn-dark {
        border-color: var(--ps-ink);
        background: var(--ps-ink);
        color: var(--ps-cream);
      }

      .ps-home .ps-btn-dark:hover {
        border-color: var(--ps-olive);
        background: var(--ps-olive);
        color: var(--ps-cream);
      }

      .ps-home .ps-btn-outline {
        border-color: rgba(16, 17, 7, 0.28);
        background: transparent;
        color: var(--ps-ink);
      }

      .ps-home .ps-btn-outline:hover {
        border-color: var(--ps-ink);
        background: rgba(16, 17, 7, 0.06);
      }

      .ps-home .ps-btn-cream {
        border-color: var(--ps-cream);
        background: var(--ps-cream);
        color: var(--ps-ink);
      }

      .ps-home .ps-btn-cream:hover {
        border-color: #E3E9D0;
        background: #E3E9D0;
      }

      .ps-home .ps-btn-ghost-light {
        border-color: rgba(244, 248, 229, 0.24);
        background: transparent;
        color: var(--ps-cream);
      }

      .ps-home .ps-btn-ghost-light:hover {
        border-color: rgba(244, 248, 229, 0.46);
        background: rgba(244, 248, 229, 0.08);
      }

      .ps-home .ps-btn-sm {
        min-height: 2.65rem;
        padding: 0.6rem 1.05rem;
        font-size: 0.78rem;
      }

      .ps-home .ps-btn-lg {
        min-height: 3.5rem;
        padding: 0.95rem 1.55rem;
        font-size: 0.95rem;
      }

      .ps-home .ps-link {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        color: var(--ps-olive);
        font-size: 0.875rem;
        font-weight: 600;
        line-height: 1.5;
        text-decoration: none;
        border-bottom: 1px solid rgba(86, 79, 30, 0.35);
        padding-bottom: 0.15rem;
        transition: color 0.18s ease, border-color 0.18s ease;
      }

      .ps-home .ps-link:hover {
        color: var(--ps-ink);
        border-bottom-color: var(--ps-ink);
      }

      .ps-home .ps-nav-link {
        position: relative;
        display: inline-block;
        padding-block: 0.45rem;
        color: #3F412F;
        font-size: 0.8125rem;
        font-weight: 600;
        line-height: 1.4;
        text-decoration: none;
        transition: color 0.18s ease;
      }

      .ps-home .ps-nav-link::after {
        position: absolute;
        right: 100%;
        bottom: 0;
        left: 0;
        height: 1px;
        background: var(--ps-olive);
        content: "";
        transition: right 0.22s ease;
      }

      .ps-home .ps-nav-link:hover {
        color: var(--ps-ink);
      }

      .ps-home .ps-nav-link:hover::after {
        right: 0;
      }

      .ps-home .ps-reveal {
        opacity: 0;
        transform: translateY(18px);
        transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .ps-home .ps-reveal-visible {
        opacity: 1;
        transform: translateY(0);
      }

      .ps-home .ps-scan-line {
        position: absolute;
        left: 7%;
        right: 7%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(214, 228, 185, 0.85), transparent);
        box-shadow: 0 0 18px 3px rgba(110, 140, 86, 0.28);
        animation: ps-home-scan 7s ease-in-out infinite alternate;
      }

      .ps-home .ps-hero-media {
        aspect-ratio: 4 / 5;
      }

      @keyframes ps-home-scan {
        0% { top: 18%; opacity: 0; }
        14% { opacity: 0.8; }
        86% { opacity: 0.8; }
        100% { top: 82%; opacity: 0; }
      }

      @media (min-width: 640px) {
        .ps-home .ps-container {
          padding-inline: 1.75rem;
        }

        .ps-home .ps-section {
          padding-block: 6.5rem;
        }

        .ps-home .ps-section-preview {
          padding-top: 6.5rem;
          padding-bottom: 3rem;
        }

        .ps-home .ps-lead {
          font-size: 1.125rem;
        }

        .ps-home .ps-copy {
          font-size: 1rem;
        }

        .ps-home .ps-hero-media {
          aspect-ratio: 4 / 3;
        }
      }

      @media (min-width: 1024px) {
        .ps-home .ps-container {
          padding-inline: 2.5rem;
        }

        .ps-home .ps-section {
          padding-block: 8rem;
        }

        .ps-home .ps-section-preview {
          padding-top: 8rem;
          padding-bottom: 4rem;
        }

        .ps-home .ps-hero-media {
          aspect-ratio: 4 / 5;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        html { scroll-behavior: auto; }

        .ps-home .ps-scan-line {
          animation: none;
          opacity: 0.4;
          top: 50%;
        }

        .ps-home .ps-reveal {
          opacity: 1;
          transform: none;
          transition: none;
        }

        .ps-home .ps-btn {
          transition: none;
        }

        .ps-home .ps-btn:hover,
        .ps-home .ps-btn:active {
          transform: none;
        }
      }
    `}</style>
  );
}
