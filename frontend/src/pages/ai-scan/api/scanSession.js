import { apiRequest } from '../../../api/apiClient';

export function createScanSession({ farmId, scanType = 'UPLOAD' }) {
  return apiRequest('/api/scan-sessions/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ farm_id: farmId, scan_type: scanType }),
  });
}