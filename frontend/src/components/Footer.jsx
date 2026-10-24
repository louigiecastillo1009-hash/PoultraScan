import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { MdBiotech } from 'react-icons/md';

import {
  FeedbackModal,
  ContactSupportContent,
  InfoModal,
  PrivacyPolicyContent,
  TermsOfServiceContent,
} from './index';

const navigateLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'New scan', to: '/scan' },
  { label: 'Scan history', to: '/scan/history' },
  { label: 'Farms', to: '/farm' },
];

export default function Footer() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [activeInfo, setActiveInfo] = useState(null); // null | 'privacy' | 'terms' | 'support'

  const supportLinks = [
    { label: 'Privacy Policy', action: () => setActiveInfo('privacy') },
    { label: 'Terms of Service', action: () => setActiveInfo('terms') },
    { label: 'Contact Support', action: () => setActiveInfo('support') },
    { label: 'Feedback', action: () => setFeedbackOpen(true) },
  ];

  return (
    <>
      <footer className="mb-[calc(env(safe-area-inset-bottom)+6rem)] mt-12 border-t border-ink/12 bg-cream md:mb-0">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
          <div className="grid gap-9 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr] lg:gap-12">
            <div>
              <Link to="/dashboard" className="inline-flex items-center gap-2.5" aria-label="PoultraScan dashboard">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cream">
                  <MdBiotech className="text-[18px]" aria-hidden="true" />
                  <span
                    className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-cream bg-gold"
                    aria-hidden="true"
                  />
                </span>
                <span className="font-display text-[1.2rem] font-semibold tracking-[-0.025em] text-ink">
                  PoultraScan
                </span>
              </Link>
              <p className="mt-4 max-w-[21rem] text-[12.5px] leading-6 text-soft">
                Photo-based poultry health scanning, with every result kept together by farm.
              </p>
              <p className="mt-4 max-w-[21rem] text-[9.5px] font-medium uppercase leading-5 tracking-[0.12em] text-muted">
                AI-assisted estimates. Not a substitute for veterinary diagnosis.
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-olive">Navigate</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {navigateLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                      {link.to === '/scan' && (
                        <FiArrowUpRight className="text-[12px]" aria-hidden="true" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-olive">Support</p>
              <ul className="mt-4 flex flex-col items-start gap-2.5">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={link.action}
                      className="text-left text-[12.5px] font-medium text-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-2 border-t border-ink/12 pt-5 text-[10.5px] leading-5 text-muted sm:flex-row sm:items-center sm:justify-between">
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
