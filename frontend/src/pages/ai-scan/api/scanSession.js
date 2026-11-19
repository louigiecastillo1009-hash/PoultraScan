import { apiRequest } from '../../../api/apiClient';

export function createScanSession({ farmId, scanType = 'UPLOAD', chickenType = 'BROILER' }) {
  return apiRequest('/api/scan-sessions/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ farm_id: farmId, scan_type: scanType, chicken_type: chickenType }),
  });
}