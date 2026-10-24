import { useState } from 'react';
import { MdCheckCircle, MdEmail } from 'react-icons/md';

import { Button, ModalShell, Notice, TextField } from './app/index';
import { FeedbackAPI } from '../api/feedbackApi';

const FORM_ID = 'feedback-form';

export default function FeedbackModal({ isOpen, onClose }) {
  const [message, setMessage] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setMessage('');
    setSenderEmail('');
    setError(null);
    setIsSent(false);
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await FeedbackAPI.send({
        senderEmail,
        message,
      });
      setIsSent(true);
    } catch {
      setError('Something went wrong sending your feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell
      open
      onClose={handleClose}
      eyebrow="We're listening"
      title={isSent ? 'Feedback sent' : 'Send feedback'}
      description={
        isSent
          ? 'Thanks for helping us improve PoultraScan AI.'
          : 'Found a bug or have a suggestion? Let us know below.'
      }
      icon={isSent ? <MdCheckCircle className="text-lg" /> : <MdEmail className="text-lg" />}
      size="sm"
      footer={
        isSent ? (
          <Button type="button" className="w-full" onClick={handleClose}>
            Close
          </Button>
        ) : (
          <Button type="submit" form={FORM_ID} className="w-full" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-cream/35 border-t-cream"
                  aria-hidden="true"
                />
                Sending...
              </>
            ) : (
              'Send feedback'
            )}
          </Button>
        )
      }
    >
      {isSent ? (
        <div className="flex flex-col items-center rounded-2xl border border-[#CFDDB8] bg-success-soft px-6 py-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper text-sage-dark">
            <MdCheckCircle className="text-3xl" aria-hidden="true" />
          </span>
          <p className="mt-4 text-[12.5px] leading-5 text-soft">
            Your note is on its way. We read every message and use it to make the product better.
          </p>
        </div>
      ) : (
        <form id={FORM_ID} onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <Notice tone="error" title="Could not send feedback">
              {error}
            </Notice>
          )}

          <TextField
            label={
              <>
                Your email <span className="font-normal normal-case tracking-normal">(optional)</span>
              </>
            }
            type="email"
            value={senderEmail}
            onChange={(event) => setSenderEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            icon={MdEmail}
          />

          <div>
            <label
              htmlFor="feedback-message"
              className="mb-2 block text-[10.5px] font-bold uppercase tracking-[0.14em] text-olive"
            >
              Message
            </label>
            <textarea
              id="feedback-message"
              required
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tell us what's on your mind..."
              className="input-field resize-none"
            />
          </div>
        </form>
      )}
    </ModalShell>
  );
}
