import { useState } from 'react';
import { apiRequest } from '../../../api/apiClient';

/**
 * Optional user correction for one chicken observation.
 * Weight and oil are saved on the observation, not on the AI prediction,
 * so the original estimate is never overwritten.
 */
export default function MeasurementEditor({ chicken, onSaved }) {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState(chicken.measured_weight_kg ?? '');
  const [oil, setOil] = useState(chicken.measured_oil_ml ?? '');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const updated = await apiRequest(
        `/api/ai/chicken/${chicken.detected_chicken_id}/measurements`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            measured_weight_kg: weight === '' ? null : Number(weight),
            measured_oil_ml: oil === '' ? null : Number(oil),
          }),
        }
      );
      onSaved?.(updated);
      setMessage('Saved. Your values now replace the AI estimate in this card and in totals.');
      setOpen(false);
    } catch (error) {
      setMessage(error.message || 'Could not save measurements. Try again.');
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => {
            setWeight(chicken.measured_weight_kg ?? '');
            setOil(chicken.measured_oil_ml ?? '');
            setMessage('');
            setOpen(true);
          }}
          className="text-left text-[11px] font-semibold text-sage-dark underline"
        >
          {chicken.weight_source === 'user' || chicken.oil_source === 'user'
            ? 'Edit actual measurements'
            : 'Add actual measurements'}
        </button>
        {message && <p role="status" className="text-[10.5px] text-muted">{message}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={save} className="rounded-xl border border-ink/10 bg-cream-deep/45 p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-olive">
        Actual measurements (optional)
      </p>
      <p className="mt-1 text-[10.5px] text-muted">
        Enter a scale weight and/or measured oil. Blank fields remove your correction and
        fall back to the AI estimate.
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="text-[11px] text-soft">
          Weight (kg)
          <input
            type="number"
            min="0.001"
            max="99999"
            step="0.001"
            value={weight}
            disabled={busy}
            placeholder={chicken.estimated_weight != null ? `AI ~${chicken.estimated_weight}` : '—'}
            onChange={(event) => setWeight(event.target.value)}
            className="mt-0.5 block w-full rounded-lg border border-ink/15 bg-paper px-2 py-1 text-[12px]"
          />
        </label>
        <label className="text-[11px] text-soft">
          Oil yield (mL)
          <input
            type="number"
            min="0.001"
            max="999999"
            step="1"
            value={oil}
            disabled={busy}
            placeholder={chicken.estimated_oil_ml != null ? `AI ~${Math.round(chicken.estimated_oil_ml)}` : '—'}
            onChange={(event) => setOil(event.target.value)}
            className="mt-0.5 block w-full rounded-lg border border-ink/15 bg-paper px-2 py-1 text-[12px]"
          />
        </label>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-sage-dark px-3 py-1.5 text-[11px] font-semibold text-cream disabled:opacity-60"
        >
          {busy ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setWeight('');
            setOil('');
            setMessage('');
            setOpen(false);
          }}
          className="text-[11px] font-semibold text-muted underline"
        >
          Cancel
        </button>
      </div>
      {message && <p role="status" className="mt-1 text-[10.5px] text-muted">{message}</p>}
    </form>
  );
}
