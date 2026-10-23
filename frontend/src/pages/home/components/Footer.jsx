import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { MdBiotech } from 'react-icons/md';

import {
  ContactSupportContent,
  FeedbackModal,
  InfoModal,
  PrivacyPolicyContent,
  TermsOfServiceContent,
} from '../../../components/index';

const exploreLinks = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Inside the app', href: '#inside-app' },
  { label: 'A note on results', href: '#responsible' },
];

const accountLinks = [
  { label: 'Create account', to: '/register' },
  { label: 'Log in', to: '/login' },
  { label: 'Home', to: '/home' },
];

export default function Footer() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [activeInfo, setActiveInfo] = useState(null);

  const supportLinks = [
    { label: 'Privacy Policy', action: () => setActiveInfo('privacy') },
    { label: 'Terms of Service', action: () => setActiveInfo('terms') },
    { label: 'Contact Support', action: () => setActiveInfo('support') },
    { label: 'Send Feedback', action: () => setFeedbackOpen(true) },
  ];

  return (
    <>
      <footer className="border-t border-[#101107]/15 bg-[#F4F8E5]">
        <div className="ps-container py-12 sm:py-16">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.35fr_0.7fr_0.7fr_1fr] lg:gap-8">
            <div>
              <Link
                to="/home"
                className="inline-flex items-center gap-2.5"
                aria-label="PoultraScan home"
              >
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#101107] text-[#F4F8E5]">
                  <MdBiotech className="text-[18px]" aria-hidden="true" />
                  <span
                    className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-[#F4F8E5] bg-[#B1A03E]"
                    aria-hidden="true"
                  />
                </span>
                <span className="font-display text-[1.2rem] font-semibold tracking-[-0.025em] text-[#101107]">
                  PoultraScan
                </span>
              </Link>
              <p className="mt-4 max-w-[20rem] text-[13px] leading-6 text-[#555743]">
                Photo-based poultry health scanning for everyday flock checks, with results
                kept together by farm.
              </p>
              <p className="mt-5 max-w-[20rem] text-[10px] font-medium uppercase leading-5 tracking-[0.12em] text-[#6B6D57]">
                AI-assisted estimates. Not a substitute for veterinary diagnosis.
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#564F1E]">
                Explore
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-[13px] font-medium text-[#3F412F] transition-colors hover:text-[#101107]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#564F1E]">
                Account
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {accountLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3F412F] transition-colors hover:text-[#101107]"
                    >
                      {link.label}
                      {link.to === '/register' && (
                        <FiArrowUpRight className="text-[13px]" aria-hidden="true" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#564F1E]">
                Support
              </p>
              <ul className="mt-4 flex flex-col items-start gap-2.5">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={link.action}
                      className="text-left text-[13px] font-medium text-[#3F412F] transition-colors hover:text-[#101107]"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-[#101107]/12 pt-6 text-[11px] leading-5 text-[#6B6D57] sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} PoultraScan. All rights reserved.</p>
            <p>Poultry health, made a little clearer.</p>
          </div>
        </div>
      </footer>

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

      <InfoModal
        isOpen={activeInfo === 'privacy'}
        onClose={() => setActiveInfo(null)}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </InfoModal>

      <InfoModal
        isOpen={activeInfo === 'terms'}
        onClose={() => setActiveInfo(null)}
        title="Terms of Service"
      >
        <TermsOfServiceContent />
      </InfoModal>

      <InfoModal
        isOpen={activeInfo === 'support'}
        onClose={() => setActiveInfo(null)}
        title="Contact Support"
      >
        <ContactSupportContent />
      </InfoModal>
    </>
  );
}
