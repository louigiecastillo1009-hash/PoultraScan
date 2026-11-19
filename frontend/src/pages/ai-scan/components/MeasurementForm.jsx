import { useEffect, useState } from 'react';
import { apiRequest } from '../../../api/apiClient';

export default function MeasurementForm({ chicken }) {
  const [weight, setWeight] = useState(chicken.measured_weight_kg ?? '');
  const [height, setHeight] = useState(chicken.measured_height_cm ?? '');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest(`/api/ai/chicken/${chicken.detected_chicken_id}/measurements`)
      .then((data) => {
        if (!active) return;
        setWeight(data.measured_weight_kg ?? '');
        setHeight(data.measured_height_cm ?? '');
        setLoading(false);
      })
      .catch(() => {
        if (active) setMessage('Saved measurements could not be loaded. Reopen the results to retry.');
      });
    return () => { active = false; };
  }, [chicken.detected_chicken_id]);

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      await apiRequest(`/api/ai/chicken/${chicken.detected_chicken_id}/measurements`, {
        method: 'PATCH',
        body: JSON.stringify({
          measured_weight_kg: weight === '' ? null : Number(weight),
          measured_height_cm: height === '' ? null : Number(height),
        }),
      });
      setMessage('Measurements saved. These are user-entered, not AI-verified.');
    } catch (error) {
      setMessage(error.message || 'Could not save measurements. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-3 rounded-xl border border-ink/10 bg-paper p-4">
      <h3 className="text-sm font-semibold">Chicken {chicken.tracking_id} · {chicken.angle || 'Photo'} — Measurements</h3>
      <p className="text-xs text-muted">Measurement required for physical size. Use a scale for weight and measure standing height from the ground to the top of the head. Enter only measurements for this bird. Blank fields clear saved measurements.</p>
      <div className="flex flex-wrap gap-3">
        <label className="text-sm">Measured weight (kg)
          <input className="block w-40 rounded border p-2" type="number" min="0.001" max="99999" step="0.001"
            value={weight} disabled={busy || loading} onChange={(event) => setWeight(event.target.value)} />
        </label>
        <label className="text-sm">Measured height (cm)
          <input className="block w-40 rounded border p-2" type="number" min="0.01" max="99999" step="0.01"
            value={height} disabled={busy || loading} onChange={(event) => setHeight(event.target.value)} />
        </label>
      </div>
      <button type="submit" disabled={busy || loading} className="text-sm font-semibold text-sage-dark underline">
        {busy ? 'Saving…' : 'Save measurements'}
      </button>
      <p role="status" className="text-xs">{message}</p>
    </form>
  );
}
