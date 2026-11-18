import { apiRequest } from '../../../api/apiClient';

export function countChickens({ scanSessionId, imageFile, angle = 'FRONT' }) {
  const formData = new FormData();
  formData.append('scan_session_id', scanSessionId);
  formData.append('image', imageFile);
  formData.append('angle', angle);

  return apiRequest('/api/detection/count', {
    method: 'POST',
    body: formData,
  });
}
