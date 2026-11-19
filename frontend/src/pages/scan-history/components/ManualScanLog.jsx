import { useEffect, useState } from 'react';
import { apiRequest } from '../../../api/apiClient';

export default function ManualScanLog({ scan }) {
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    let active = true;
    apiRequest(`/api/journal-entries/farm/${scan.farm_id}?limit=100`)
      .then((data) => {
        if (active) setEntries(data.filter((entry) => entry.scan_session_id === scan.scan_session_id));
      })
      .catch(() => { if (active) setMessage('Could not load previous logs.'); });
    return () => { active = false; };
  }, [scan.farm_id, scan.scan_session_id]);

  const save = async (event) => {
    event.preventDefault();
    if (busy || !content.trim()) return;
    setBusy(true);
    setMessage('');
    try {
      const data = await apiRequest('/api/journal-entries/', {
        method: 'POST',
        body: JSON.stringify({
          farm_id: scan.farm_id,
          scan_session_id: scan.scan_session_id,
          title: `Manual notes for scan #${scan.scan_session_id}`,
          content: content.trim(),
        }),
      });
      setEntries((previous) => [data.entry, ...previous]);
      setContent('');
      setMessage('Journal log saved separately from AI estimates.');
    } catch (error) {
      setMessage(error.message || 'Could not save log.');
    } finally {
      setBusy(false);
    }
  };

  return <div className="space-y-3">
    <p className="text-xs text-muted">Optional observations or actual scale readings. Include the chicken number and units. These notes do not overwrite scan estimates.</p>
    <form onSubmit={save} className="space-y-2">
      <label className="block text-sm">Manual journal notes
        <textarea className="mt-1 block w-full rounded border p-2" required maxLength={5000}
          value={content} disabled={busy} onChange={(event) => setContent(event.target.value)} />
      </label>
      <button type="submit" disabled={busy} className="text-sm font-semibold underline">{busy ? 'Saving…' : 'Save journal log'}</button>
      <p role="status" className="text-xs">{message}</p>
    </form>
    <p className="text-xs text-muted">Matching logs from the latest 100 farm entries:</p>
    {entries.map((entry) => <article key={entry.id} className="rounded border p-3">
      <p className="text-xs text-muted">{new Date(entry.created_at).toLocaleString()}</p>
      <p className="whitespace-pre-wrap text-sm">{entry.content}</p>
    </article>)}
  </div>;
}
