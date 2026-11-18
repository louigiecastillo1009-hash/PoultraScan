import { useState, useCallback } from 'react';
import { countChickens } from '../api/detection';

export function useDetection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runDetection = useCallback(async ({ scanSessionId, imageFile, angle }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await countChickens({ scanSessionId, imageFile, angle });
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, runDetection };
}
